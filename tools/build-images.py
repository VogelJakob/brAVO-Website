#!/usr/bin/env python3
"""
Erzeugt verkleinerte Bildfassungen (w600 / w1200 / w2000) für die Website
und schreibt die Maß-Tabelle assets/data/image-sizes.js.

ANLEITUNG
---------
1. Den Bildordner vom Server (IONOS, /public/assets/images) bzw. die neuen
   Originale lokal ablegen, Standard:
       "AVO Website aktuell/assets/images"   (relativ zum Projektordner)
2. Im Projektordner ausführen:
       python tools/build-images.py
   Optionen:
       --src  PFAD   anderer Quellordner (Struktur wie assets/images)
       --out  PFAD   Zielordner (Standard: _upload/assets/images)
       --force       alle Fassungen neu erzeugen (sonst nur neue/geänderte)
3. Den Inhalt von _upload/ per FileZilla nach /public hochladen
   (_upload/assets/images/... -> /public/assets/images/...). Die Originale
   auf dem Server bleiben unverändert, die Fassungen landen in den
   Unterordnern w600/, w1200/, w2000/ neben dem jeweiligen Original.
   ACHTUNG: _upload/ enthält NUR die Fassungen, keine Originale. Auf dem
   Server nichts löschen oder ersetzen, nur hinzufügen – die Originale in
   /public/assets/images müssen bleiben (Lightbox, Galerie-Erkennung).
4. assets/data/image-sizes.js committen/hochladen und die Versionskennung
   erhöhen (siehe CACHE.md).

Regeln
------
- Die Quelldateien werden nur gelesen, nie verändert/verschoben/gelöscht.
- Pro Bild bis zu drei Fassungen; die Zahl ist die längste Kante in px.
  Fassungen werden nur erzeugt, wenn das Original GRÖSSER als die Stufe
  ist (keine Vergrößerung; bei exakt gleicher Größe dient das Original
  selbst als diese Stufe).
- JPG, progressive, Qualität 80, EXIF-Ausrichtung angewendet, Farbprofil
  nach sRGB umgerechnet, alle Metadaten entfernt, Seitenverhältnis
  unverändert, kein Zuschnitt.
- PNG und SVG werden übersprungen und nur aufgelistet.
- Unterordner namens w600/w1200/w2000 im Quellordner werden ignoriert
  (falls der Ordner später samt Fassungen vom Server geladen wird).
- image-sizes.js wird bei jedem Lauf komplett aus dem Quellordner neu
  geschrieben (Maße des Originals nach EXIF-Drehung + vorhandene Stufen).

Benötigt: Python 3 mit Pillow (pip install Pillow).
"""
import argparse
import io
import json
import os
import sys

from PIL import Image, ImageCms, ImageOps

LEVELS = (600, 1200, 2000)
QUALITY = 80
LEVEL_DIRS = {"w%d" % lv for lv in LEVELS}
JPEG_EXT = (".jpg", ".jpeg")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SRC = os.path.join(ROOT, "AVO Website aktuell", "assets", "images")
DEFAULT_OUT = os.path.join(ROOT, "_upload", "assets", "images")
MANIFEST = os.path.join(ROOT, "assets", "data", "image-sizes.js")

SRGB = ImageCms.createProfile("sRGB")


def scaled(w, h, level):
    """Maße bei längster Kante = level (gleiche Rundung wie app.js)."""
    f = level / max(w, h)
    return max(1, int(w * f + 0.5)), max(1, int(h * f + 0.5))


def to_srgb(im):
    icc = im.info.get("icc_profile")
    if not icc:
        return im.convert("RGB")
    try:
        prof = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        name = ImageCms.getProfileDescription(prof) or ""
        if "srgb" in name.lower() and im.mode == "RGB":
            return im
        return ImageCms.profileToProfile(im, prof, SRGB, outputMode="RGB")
    except Exception as e:  # defektes Profil: Pixel unverändert übernehmen
        print("  Hinweis: Farbprofil nicht lesbar (%s), ohne Umrechnung" % e)
        return im.convert("RGB")


def has_alpha(im):
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        alpha = im.convert("RGBA").getchannel("A")
        return alpha.getextrema()[0] < 255
    return False


def main():
    ap = argparse.ArgumentParser(description="Bildfassungen w600/w1200/w2000 erzeugen")
    ap.add_argument("--src", default=DEFAULT_SRC)
    ap.add_argument("--out", default=DEFAULT_OUT)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    src_root = os.path.abspath(args.src)
    out_root = os.path.abspath(args.out)
    if not os.path.isdir(src_root):
        sys.exit("Quellordner nicht gefunden: " + src_root)

    manifest = {}
    skipped = []
    orig_bytes = 0
    level_bytes = {lv: 0 for lv in LEVELS}
    created = 0

    for dirpath, dirnames, filenames in os.walk(src_root):
        dirnames[:] = sorted(d for d in dirnames if d not in LEVEL_DIRS)
        for name in sorted(filenames):
            if name.startswith("."):
                continue
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, src_root).replace(os.sep, "/")
            ext = os.path.splitext(name)[1].lower()

            if ext == ".svg":
                skipped.append((rel, "SVG"))
                continue
            if ext == ".png":
                with Image.open(path) as im:
                    reason = "PNG mit Transparenz" if has_alpha(im) else "PNG ohne Transparenz (Ausgabeformat nicht festgelegt)"
                skipped.append((rel, reason))
                continue
            if ext not in JPEG_EXT:
                skipped.append((rel, "kein Bildformat der Website"))
                continue

            orig_bytes += os.path.getsize(path)
            with Image.open(path) as im:
                im = ImageOps.exif_transpose(im)
                w, h = im.size
                levels = [lv for lv in LEVELS if max(w, h) > lv]
                manifest[rel] = {"w": w, "h": h, "s": levels}
                if not levels:
                    continue

                src_mtime = os.path.getmtime(path)
                todo = []
                for lv in levels:
                    out = os.path.join(out_root, os.path.dirname(rel), "w%d" % lv, name)
                    if args.force or not os.path.exists(out) or os.path.getmtime(out) < src_mtime:
                        todo.append((lv, out))

                if todo:
                    print("%s  (%d x %d)" % (rel, w, h))
                    rgb = to_srgb(im)
                    for lv, out in todo:
                        os.makedirs(os.path.dirname(out), exist_ok=True)
                        small = rgb.resize(scaled(w, h, lv), Image.LANCZOS)
                        small.save(out, "JPEG", quality=QUALITY, progressive=True, optimize=True)
                        created += 1

            for lv in levels:
                out = os.path.join(out_root, os.path.dirname(rel), "w%d" % lv, name)
                level_bytes[lv] += os.path.getsize(out)

    lines = [
        "/*",
        " * Bildmaße und vorhandene Fassungen – AUTOMATISCH ERZEUGT von",
        " * tools/build-images.py, nicht von Hand bearbeiten.",
        " * Schlüssel: Pfad ab assets/images/. w/h: Originalmaße (nach EXIF-Drehung),",
        " * s: vorhandene Stufen (längste Kante in px) in den Unterordnern w600/ w1200/ w2000/.",
        " */",
        "var IMAGE_SIZES = {",
    ]
    keys = sorted(manifest)
    for i, k in enumerate(keys):
        m = manifest[k]
        lines.append('  %s: { w: %d, h: %d, s: %s }%s' % (
            json.dumps(k), m["w"], m["h"], json.dumps(m["s"]),
            "," if i < len(keys) - 1 else ""))
    lines.append("};")
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    with open(MANIFEST, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")

    mb = lambda b: "%.1f MB" % (b / 1024 / 1024)
    print()
    print("Bilder verarbeitet : %d (neu erzeugte Fassungen: %d)" % (len(manifest), created))
    print("Originale gesamt   : %s" % mb(orig_bytes))
    for lv in LEVELS:
        print("w%-5d gesamt      : %s" % (lv, mb(level_bytes[lv])))
    print("Maß-Tabelle        : %s" % os.path.relpath(MANIFEST, ROOT))
    if skipped:
        print("Übersprungen:")
        for rel, reason in skipped:
            print("  %s – %s" % (rel, reason))


if __name__ == "__main__":
    main()
