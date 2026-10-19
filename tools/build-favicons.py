#!/usr/bin/env python3
"""
Erzeugt alle Favicon-Fassungen aus dem Master-SVG _upload/favicon.svg.

ANLEITUNG
---------
1. Master liegt in _upload/favicon.svg (Kachel 512×512: roter Versatz-
   schatten, Creme-Fläche mit schwarzem Rahmen, "27" in Anton als Pfad).
2. Im Projektordner ausführen:
       python3 tools/build-favicons.py
   Optionen:
       --out PFAD   Zielordner (Standard: _upload)
3. Die erzeugten Dateien per FileZilla in den Root von /public hochladen
   (_upload/favicon.ico -> /public/favicon.ico usw.). site.webmanifest kommt
   per Push aus dem Repo.

Erzeugte Dateien (alle direkt im Zielordner, keine Unterordner)
---------------------------------------------------------------
- favicon.svg                    Master (wird nur gelesen, nicht verändert)
- favicon.ico                    16 + 32 aus der Klein-Variante, 48 aus dem Master
- favicon-96x96.png              kreis-sichere Variante (Google zeigt Favicons
                                 rund an; Kachel + Schatten passen ganz in den Kreis)
- apple-touch-icon.png           180×180, Master auf Creme, ohne Transparenz
- web-app-manifest-192x192.png   Master
- web-app-manifest-512x512.png   Master

Die beiden Varianten werden aus dem Master abgeleitet (gleiche Glyphen):
- Klein (16/32 px): 32er-Raster, Rahmen 2, Schatten 4, Ziffern 20 hoch –
  alles pixelgenau, damit "27" auch bei 16 px lesbar bleibt.
- Kreis-sicher: ganze Kachel samt Schatten auf 340 px skaliert und zentriert,
  sodass alle Ecken im Kreis mit Durchmesser 512 liegen.

Benötigt: Python 3 mit Pillow und PyGObject mit GdkPixbuf + librsvg
(SVG-Loader; unter Ubuntu: gir1.2-gdkpixbuf-2.0, librsvg2-common).
"""
import argparse
import io
import re
import sys
from pathlib import Path

import gi
gi.require_version("GdkPixbuf", "2.0")
from gi.repository import GdkPixbuf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BG, INK, ACC = "#fbfaf7", "#111111", "#a4161a"   # --bg, --ink, --acc aus style.css

# Geometrie des Masters (512er-Raster): Ziffern zentriert auf (238, 238), 300 hoch
GLYPH_CENTER, GLYPH_H = 238, 300
TILE_BOX = (8, 512)   # Kachel + Schatten reichen von 8 bis 512


def small_svg(glyph_d):
    """Klein-Variante im 32er-Raster: Kachel 28, Schatten 4, Rahmen 2, Ziffern 20 hoch."""
    k = 20 / GLYPH_H
    t = 14 - GLYPH_CENTER * k
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect x="4" y="4" width="28" height="28" fill="{ACC}"/>
  <rect x="1" y="1" width="26" height="26" fill="{BG}" stroke="{INK}" stroke-width="2"/>
  <path fill="{INK}" transform="translate({t:.4f} {t:.4f}) scale({k:.6f})" d="{glyph_d}"/>
</svg>
'''


def round_svg(master):
    """Kreis-sichere Variante: ganze Kachel samt Schatten auf 340 px, zentriert."""
    inner = re.sub(r"<title>.*?</title>", "", master.split(">", 1)[1].rsplit("</svg>", 1)[0])
    s = 340 / (TILE_BOX[1] - TILE_BOX[0])
    mid = (TILE_BOX[0] + TILE_BOX[1]) / 2
    off = 256 - mid * s
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">'
            f'<g transform="translate({off:.2f} {off:.2f}) scale({s:.4f})">{inner}</g></svg>\n')


def render(svg, size):
    """SVG per GdkPixbuf/librsvg auf size×size px rastern, als RGBA-Pillow-Bild."""
    loader = GdkPixbuf.PixbufLoader.new_with_type("svg")
    loader.set_size(size, size)
    loader.write(svg.encode())
    loader.close()
    ok, buf = loader.get_pixbuf().save_to_bufferv("png", [], [])
    return Image.open(io.BytesIO(bytes(buf))).convert("RGBA")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default=str(ROOT / "_upload"), help="Zielordner (Standard: _upload)")
    out = Path(ap.parse_args().out)

    master_path = out / "favicon.svg"
    if not master_path.is_file():
        sys.exit(f"Master fehlt: {master_path}")
    master = master_path.read_text(encoding="utf-8")
    m = re.search(r'<path fill="#111111" d="([^"]+)"', master)
    if not m:
        sys.exit("Glyphen-Pfad im Master nicht gefunden.")
    small, rund = small_svg(m.group(1)), round_svg(master)

    written = []

    def save_png(img, name):
        img.save(out / name, "PNG", optimize=True)
        written.append((name, img.size))

    # favicon.ico: 16 + 32 aus der Klein-Variante, 48 aus dem Master
    ico = [render(small, 16), render(small, 32), render(master, 48)]
    ico[2].save(out / "favicon.ico", format="ICO", sizes=[i.size for i in ico], append_images=ico[:2])
    written.append(("favicon.ico", "16, 32, 48"))

    save_png(render(rund, 96), "favicon-96x96.png")

    apple = Image.new("RGBA", (180, 180), BG)
    apple.alpha_composite(render(master, 180))
    save_png(apple.convert("RGB"), "apple-touch-icon.png")

    save_png(render(master, 192), "web-app-manifest-192x192.png")
    save_png(render(master, 512), "web-app-manifest-512x512.png")

    print(f"Master: {master_path}")
    for name, size in written:
        print(f"  {name:32} {size if isinstance(size, str) else '%d×%d' % size}")


if __name__ == "__main__":
    main()
