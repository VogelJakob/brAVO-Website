#!/usr/bin/env python3
"""
Befüllt die statischen HTML-Seiten aus den Daten in assets/data/*.js vor –
damit Suchmaschinen Namen, Steckbrief, Vita und Bilder schon im
ausgelieferten HTML finden und nicht erst nach dem JavaScript-Rendering.

NACH JEDER ÄNDERUNG an assets/data/students.js, termine.js oder
image-sizes.js (bzw. nach einer neuen Versionskennung) im Projektordner
ausführen:

    python3 tools/build-pages.py

Danach die geänderten HTML-Dateien (index.html, students/*.html) und
sitemap.xml mit committen bzw. hochladen.

Was das Skript schreibt (nur zwischen den Markierungskommentaren
BUILD:SEO … und BUILD:CONTENT … – alles andere bleibt unberührt):
  students/{slug}.html
    - <head>: title, description, canonical, Open Graph, Twitter, JSON-LD
      (ProfilePage + Person mit sameAs-Links aus "social")
    - <main>: Profilinhalt (Name, Steckbrief, Vita, Rollen, Credits,
      Kontakt) – exakt das Markup, das assets/js/profile.js erzeugt.
      profile.js rendert danach wie bisher neu und ergänzt Showreel,
      Hörproben und Zusatzfotos.
  index.html
    - <head>: title, description, Open Graph, Twitter, JSON-LD
      (Website, Akademie, Jahrgang mit Mitgliedern, Profil-Liste und alle
      Aufführungs- und AVO-Termine AB DEM HEUTIGEN DATUM)
    - Ensemble-Kacheln als normale Links (wie assets/js/index.js)
  sitemap.xml
    - lastmod = heute für Seiten mit nicht committeten Änderungen,
      sonst Datum des letzten Commits der Datei.

Berufsbezeichnung (title, jobTitle): aus "pronouns" abgeleitet –
"sie/ihr" → Schauspielerin, "er/ihm" → Schauspieler, sonst Schauspieler:in.

Ohne externe Abhängigkeiten (nur Python-Standardbibliothek, ab 3.9).
"""

import datetime
import json
import os
import re
import subprocess
import sys
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://adk-bayern-2027.de"
TZ = ZoneInfo("Europe/Berlin")
TODAY = datetime.datetime.now(TZ).date()

ORG_ID = SITE + "/#akademie"
GROUP_ID = SITE + "/#jahrgang"
WEBSITE_ID = SITE + "/#website"
ORG_NAME = "Akademie für Darstellende Kunst Bayern"
GROUP_NAME = "ADK Bayern – Abschlussjahrgang 2027"

# Orte, die in den venue-Texten aus termine.js vorkommen (für die Adresse im
# Event-JSON-LD). Unbekannte Orte → Event ohne Adresse statt geratener Angabe.
STAEDTE = {"Regensburg": "DE", "Chemnitz": "DE", "Linz": "AT", "Köln": "DE",
           "Hamburg": "DE", "Berlin": "DE", "Dresden": "DE", "München": "DE"}

ZAHLWORTE = {1: "eine", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs",
             7: "sieben", 8: "acht", 9: "neun", 10: "zehn", 11: "elf", 12: "zwölf"}

SEO_RE = re.compile(r"(<!-- BUILD:SEO START[^>]*-->\n)(.*?)([ \t]*<!-- BUILD:SEO END -->)", re.S)
CONTENT_RE = re.compile(r"(<!-- BUILD:CONTENT START[^>]*-->\n)(.*?)([ \t]*<!-- BUILD:CONTENT END -->)", re.S)


# ---------------------------------------------------------------------------
# Mini-Parser für die JS-Datendateien (Objekt-/Array-Literale → Python)
# ---------------------------------------------------------------------------

def _js_string(src, i):
    quote = src[i]
    i += 1
    out = []
    esc = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v", "0": "\0"}
    while src[i] != quote:
        c = src[i]
        if c == "\\":
            n = src[i + 1]
            if n == "u":
                out.append(chr(int(src[i + 2:i + 6], 16)))
                i += 6
                continue
            if n == "\n":
                i += 2
                continue
            out.append(esc.get(n, n))
            i += 2
            continue
        out.append(c)
        i += 1
    return "".join(out), i + 1


def js_literal(src, name):
    """Liest das Literal, das `const|var|let NAME =` zugewiesen wird."""
    m = re.search(r"\b(?:const|var|let)\s+" + re.escape(name) + r"\s*=\s*", src)
    if not m:
        raise SystemExit("Nicht gefunden: " + name)
    i = m.end()
    out = []
    depth = 0
    while True:
        c = src[i]
        if c.isspace():
            i += 1
        elif src.startswith("//", i):
            i = src.index("\n", i)
        elif src.startswith("/*", i):
            i = src.index("*/", i) + 2
        elif c in "\"'":
            s, i = _js_string(src, i)
            out.append(json.dumps(s))
        elif c in "[{":
            depth += 1
            out.append(c)
            i += 1
        elif c in "]}":
            if out and out[-1] == ",":
                out.pop()   # Komma am Listenende (in JS erlaubt, in JSON nicht)
            out.append(c)
            depth -= 1
            i += 1
            if depth == 0:
                break
        elif c in ",:":
            out.append(c)
            i += 1
        else:
            m2 = re.compile(r"-?\d+(?:\.\d+)?|[A-Za-z_$][\w$]*").match(src, i)
            if not m2:
                raise SystemExit("Unerwartetes Zeichen in %s: %r" % (name, src[i:i + 30]))
            tok = m2.group(0)
            i = m2.end()
            if tok in ("true", "false", "null") or tok[0].isdigit() or tok[0] == "-":
                out.append(tok)
            else:
                out.append(json.dumps(tok))   # Objektschlüssel ohne Anführungszeichen
    return json.loads("".join(out))


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def write_if_changed(rel, text):
    path = os.path.join(ROOT, rel)
    with open(path, encoding="utf-8") as f:
        old = f.read()
    if old != text:
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return True
    return False


# ---------------------------------------------------------------------------
# Helfer – Nachbildungen der gleichnamigen Funktionen in assets/js/app.js
# ---------------------------------------------------------------------------

def esc(s):
    s = "" if s is None else str(s)
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;").replace("'", "&#39;"))


def pick(v):
    if isinstance(v, dict) and ("de" in v or "en" in v):
        return v.get("de")
    return v


def has(v):
    if v is None:
        return False
    if isinstance(v, list):
        return len(v) > 0
    return str(v).strip() != ""


class Img:
    """Bildpfade und srcset wie ADK.imageAttrs / ADK.imageHtml."""

    def __init__(self, sizes, version, root):
        self.sizes = sizes
        self.version = version
        self.root = root

    def asset(self, url):
        return url + ("&" if "?" in url else "?") + "v=" + self.version if self.version else url

    def info(self, key):
        return self.sizes.get(key)

    @staticmethod
    def level_width(info, level):
        return max(1, int(info["w"] * level / max(info["w"], info["h"]) + 0.5))

    def variant(self, path, level):
        cut = path.rfind("/") + 1
        return self.asset(path[:cut] + "w" + str(level) + "/" + path[cut:])

    def html(self, key, alt, sizes, eager=False, extra=""):
        path = self.root + "assets/images/" + key
        orig = self.asset(path)
        info = self.info(key)
        attrs = []
        if eager:
            attrs.append(("fetchpriority", "high"))
        else:
            attrs += [("loading", "lazy"), ("decoding", "async")]
        src = orig
        if info:
            attrs += [("width", info["w"]), ("height", info["h"])]
            if info["s"]:
                attrs.append(("sizes", sizes or "100vw"))
                srcset = [self.variant(path, lv) + " " + str(self.level_width(info, lv)) + "w" for lv in info["s"]]
                srcset.append(orig + " " + str(info["w"]) + "w")
                attrs.append(("srcset", ", ".join(srcset)))
                if 1200 in info["s"]:
                    src = self.variant(path, 1200)
        attrs += [("data-orig", orig), ("src", src)]
        # Ohne onerror: app.js steht erst am Seitenende; der Bild-Fallback
        # kommt mit dem Neu-Rendern durch profile.js / index.js dazu.
        out = '<img alt="' + esc(alt) + '"'
        for k, v in attrs:
            out += " " + k + '="' + esc(v) + '"'
        if extra:
            out += " " + extra
        return out + ">"

    def absolute(self, key):
        """Absolute URL für og:image / JSON-LD: w1200-Fassung, falls vorhanden."""
        info = self.info(key)
        if info and 1200 in info["s"]:
            cut = key.rfind("/") + 1
            k = key[:cut] + "w1200/" + key[cut:]
            scale = 1200 / max(info["w"], info["h"])
            return (SITE + "/assets/images/" + k, self.level_width(info, 1200),
                    max(1, int(info["h"] * scale + 0.5)))
        return SITE + "/assets/images/" + key, info["w"] if info else None, info["h"] if info else None


# ---------------------------------------------------------------------------
# Profil-Markup – Nachbildung von assets/js/profile.js (erstes Rendern, also
# noch ohne Showreel, Hörproben und Zusatzfotos)
# ---------------------------------------------------------------------------

def initials(name):
    return "".join(p[0] for p in name.split() if p)[:3]


def section(title, inner):
    return '<section class="profile-section"><h2>' + esc(title) + "</h2>" + inner + "</section>"


def facts_html(s, ui):
    rows = [("born", s.get("born")), ("locations", s.get("locations")),
            ("playingAge", s.get("playingAge")), ("height", s.get("height")),
            ("hairColor", pick(s.get("hairColor"))), ("eyeColor", pick(s.get("eyeColor"))),
            ("voiceType", pick(s.get("voiceType"))), ("languages", pick(s.get("languages"))),
            ("skills", pick(s.get("skills"))), ("qualifications", pick(s.get("qualifications")))]
    rows = [r for r in rows if has(r[1])]
    if not rows:
        return ""
    items = ""
    for key, value in rows:
        if isinstance(value, list):
            vh = '<ul class="fact-list">' + "".join("<li>" + esc(v) + "</li>" for v in value) + "</ul>"
        else:
            vh = esc(value)
        items += "<dt>" + esc(ui[key]) + "</dt><dd>" + vh + "</dd>"
    return section(ui["steckbrief"], '<dl class="facts">' + items + "</dl>")


def bio_html(s, ui):
    bio = pick(s.get("bio"))
    if not has(bio):
        return ""
    paras = "".join("<p>" + esc(p) + "</p>" for p in re.split(r"\n\s*\n", str(bio)))
    return section(ui["bio"], '<div class="bio">' + paras + "</div>")


SEP = '<span class="sep" aria-hidden="true"> · </span>'


def roles_html(s, ui):
    if not has(s.get("auditionRoles")):
        return ""
    items = ""
    for r in s["auditionRoles"]:
        parts = []
        if has(r.get("role")):
            parts.append('<span class="entry-lead">' + esc(r["role"]) + "</span>")
        if has(r.get("play")):
            parts.append("<em>" + esc(r["play"]) + "</em>")
        if has(r.get("author")):
            parts.append(esc(r["author"]))
        items += '<li class="entry">' + SEP.join(parts) + "</li>"
    return section(ui["auditionRoles"], '<ul class="entry-list">' + items + "</ul>")


def songs_html(s, ui):
    if not has(s.get("auditionSongs")):
        return ""
    items = ""
    for song in s["auditionSongs"]:
        parts = []
        if has(song.get("title")):
            parts.append('<span class="entry-lead">' + esc(song["title"]) + "</span>")
        if has(song.get("from")):
            parts.append("<em>" + esc(song["from"]) + "</em>")
        items += '<li class="entry">' + SEP.join(parts) + "</li>"
    return section(ui["auditionSongs"], '<ul class="entry-list">' + items + "</ul>")


def credit_group(title, lst, ui):
    if not has(lst):
        return ""
    items = ""
    for c in lst:
        head = []
        if has(c.get("production")):
            head.append('<span class="credit-production">' + esc(c["production"]) + "</span>")
        if has(c.get("author")):
            lead = "" if re.match(r"nach\s", str(c["author"]), re.I) else esc(ui["byAuthor"]) + " "
            head.append('<span class="credit-author">' + lead + esc(c["author"]) + "</span>")
        meta = []
        if has(c.get("director")):
            meta.append(esc(ui["director"]) + ": " + esc(c["director"]))
        if has(c.get("venue")):
            meta.append(esc(c["venue"]))
        items += ('<li class="credit"><span class="credit-years">' + esc(c.get("years") or "") + "</span>"
                  '<div class="credit-body"><div class="credit-head">' + " ".join(head) + "</div>"
                  + ('<div class="credit-role">' + esc(c["role"]) + "</div>" if has(c.get("role")) else "")
                  + ('<div class="credit-meta">' + SEP.join(meta) + "</div>" if meta else "")
                  + "</div></li>")
    return "<h3>" + esc(title) + '</h3><ul class="credit-list">' + items + "</ul>"


def credits_html(s, ui):
    cr = s.get("credits")
    if not cr:
        return ""
    inner = (credit_group(ui["theater"], cr.get("theater"), ui) + credit_group(ui["film"], cr.get("film"), ui)
             + credit_group(ui["other"], cr.get("other"), ui))
    return section(ui["credits"], inner) if inner else ""


class Links:
    """Kontaktlinks inkl. Icons – Icons und Domain-Zuordnung aus profile.js."""

    def __init__(self, profile_js):
        self.icons = js_literal(profile_js, "LINK_ICONS")
        self.platforms = js_literal(profile_js, "LINK_PLATFORMS")

    def icon_name(self, href):
        if re.match(r"mailto:", href, re.I):
            return "mail"
        m = re.match(r"[a-z][a-z0-9+.-]*://([^/?#:]+)", href, re.I)
        if not m:
            return "link"
        host = m.group(1).lower()
        for p in self.platforms:
            for d in p["domains"]:
                if host == d or host.endswith("." + d):
                    return p["icon"]
        return "link"

    def link(self, href, text, external):
        return ('<a class="contact-link" href="' + esc(href) + '"'
                + (' target="_blank" rel="noopener noreferrer"' if external else "") + ">"
                + '<svg class="link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">'
                + self.icons[self.icon_name(href)] + "</svg>"
                + '<span class="contact-link-text">' + esc(text) + "</span></a>")

    def all(self, s):
        out = []
        social = s.get("social") or {}
        if has(s.get("email")):
            out.append(self.link("mailto:" + s["email"], s["email"], False))
        if has(social.get("instagram")):
            out.append(self.link(instagram_url(social["instagram"]), "Instagram: @" + social["instagram"], True))
        if has(social.get("filmmakers")):
            out.append(self.link(social["filmmakers"], "Filmmakers", True))
        if has(social.get("etalenta")):
            out.append(self.link(social["etalenta"], "e-TALENTA", True))
        if has(social.get("theapolis")):
            out.append(self.link(social["theapolis"], "Theapolis", True))
        return out


def instagram_url(handle):
    return "https://www.instagram.com/" + handle


def same_as(s):
    """Alle externen Profile der Person (für JSON-LD sameAs)."""
    social = s.get("social") or {}
    urls = []
    for key, value in social.items():
        if not has(value):
            continue
        urls.append(instagram_url(value) if key == "instagram" else value)
    return urls


def profile_html(s, ui, img, links):
    slug = s["slug"]
    portrait = ('<div class="portrait">'
                + img.html("students/" + slug + ".jpg", s["name"] + " – " + ui["portraitAlt"],
                           "(max-width: 22rem) 100vw, 19rem", eager=True,
                           extra='data-lightbox data-gallery="' + esc(slug) + '" tabindex="0"')
                + '<div class="media-fallback" aria-hidden="true">' + esc(initials(s["name"])) + "</div></div>")
    pronouns = '<p class="profile-pronouns">' + esc(s["pronouns"]) + "</p>" if has(s.get("pronouns")) else ""
    if s.get("placeholder"):
        return ('<div class="profile-head">' + portrait + '<div class="profile-intro"><h1>' + esc(s["name"])
                + "</h1>" + pronouns + '<p class="coming-soon">' + esc(ui["comingSoon"]) + "</p>"
                + "<p class='muted'>" + esc(ui["comingSoonText"]) + "</p></div></div>")
    lk = links.all(s)
    title_links = '<div class="contact-links contact-links-title">' + "".join(lk) + "</div>" if lk else ""
    side_links = '<div class="contact-links contact-links-side">' + "".join(lk) + "</div>" if lk else ""
    contact = section(ui["contact"], '<div class="contact-links">' + "".join(lk) + "</div>") if lk else ""
    return ('<header class="profile-title"><h1>' + esc(s["name"]) + "</h1>" + pronouns + title_links + "</header>"
            + '<div class="profile-layout"><aside class="profile-side">' + portrait + side_links + "</aside>"
            + '<div class="profile-main">' + facts_html(s, ui) + bio_html(s, ui) + roles_html(s, ui)
            + songs_html(s, ui) + credits_html(s, ui) + contact + "</div></div>")


# ---------------------------------------------------------------------------
# SEO-Texte
# ---------------------------------------------------------------------------

def beruf(s):
    p = (s.get("pronouns") or "").strip().lower()
    if p == "sie/ihr":
        return "Schauspielerin"
    if p == "er/ihm":
        return "Schauspieler"
    return "Schauspieler:in"


def strip_paren(t):
    return re.sub(r"\s*\(.*?\)", "", t).strip()


def aufzaehlung(items):
    return items[0] if len(items) == 1 else ", ".join(items[:-1]) + " und " + items[-1]


def description(s):
    """140–160 Zeichen, nur aus vorhandenen Daten. Merkmale werden der Reihe
    nach angehängt, solange die Länge passt."""
    base = s["name"] + ", " + beruf(s) + " im Abschlussjahrgang 2027 der Akademie für Darstellende Kunst Bayern."
    merkmale = []
    if has(s.get("playingAge")):
        merkmale.append("Spielalter " + s["playingAge"])
    if has(pick(s.get("voiceType"))):
        merkmale.append(strip_paren(pick(s["voiceType"])))
    langs = [strip_paren(l) for l in (pick(s.get("languages")) or [])
             if re.search(r"Muttersprache|fließend", l)]
    if langs and langs != ["Deutsch"]:   # nur Deutsch ist kein Merkmal
        merkmale.append("spricht " + aufzaehlung(langs))
    text = base
    used = []
    for m in merkmale:
        cand = base + " " + ", ".join(used + [m]) + "."
        if len(cand) <= 160:
            used.append(m)
            text = cand
    if len(text) < 140:
        for tail in (" Profil mit Steckbrief, Vita und Vorsprechrollen.", " Profil mit Steckbrief und Vita.", " Mit Steckbrief und Vita.", " Steckbrief und Vita."):
            if 140 <= len(text + tail) <= 160:
                text += tail
                break
    return text


def ld_script(data):
    body = json.dumps(data, ensure_ascii=False, indent=2)
    body = body.replace("</", "<\\/")
    return '  <script type="application/ld+json">\n' + body + "\n  </script>\n"


def meta_block(title, desc, url, og_type, image, image_alt, extra_ld):
    img_url, w, h = image
    out = ["  <title>" + esc(title) + "</title>",
           '  <meta name="description" content="' + esc(desc) + '">',
           '  <link rel="canonical" href="' + esc(url) + '">',
           '  <meta property="og:type" content="' + og_type + '">',
           '  <meta property="og:site_name" content="ADK Bayern Jahrgang 2027">',
           '  <meta property="og:title" content="' + esc(title) + '">',
           '  <meta property="og:description" content="' + esc(desc) + '">',
           '  <meta property="og:url" content="' + esc(url) + '">',
           '  <meta property="og:image" content="' + esc(img_url) + '">']
    if w and h:
        out += ['  <meta property="og:image:width" content="' + str(w) + '">',
                '  <meta property="og:image:height" content="' + str(h) + '">']
    out += ['  <meta property="og:image:alt" content="' + esc(image_alt) + '">',
            '  <meta property="og:locale" content="de_DE">',
            '  <meta name="twitter:card" content="summary_large_image">',
            '  <meta name="twitter:title" content="' + esc(title) + '">',
            '  <meta name="twitter:description" content="' + esc(desc) + '">',
            '  <meta name="twitter:image" content="' + esc(img_url) + '">',
            '  <meta name="twitter:image:alt" content="' + esc(image_alt) + '">']
    return "\n".join(out) + "\n" + ld_script(extra_ld)


def org_node():
    return {"@type": "EducationalOrganization", "@id": ORG_ID, "name": ORG_NAME,
            "address": {"@type": "PostalAddress", "addressLocality": "Regensburg", "addressCountry": "DE"}}


def profile_url(slug):
    return SITE + "/students/" + slug + ".html"


def profile_seo(s, img):
    url = profile_url(s["slug"])
    title = s["name"] + " – " + beruf(s) + " | ADK Bayern 2027"
    desc = description(s)
    image = img.absolute("students/" + s["slug"] + ".jpg")
    person = {"@type": "Person", "@id": url + "#person", "name": s["name"], "url": url,
              "image": image[0], "jobTitle": beruf(s), "description": desc,
              "affiliation": org_node(),
              "memberOf": {"@type": "PerformingGroup", "@id": GROUP_ID, "name": GROUP_NAME, "url": SITE + "/"}}
    sa = same_as(s)
    if sa:
        person["sameAs"] = sa
    langs = [strip_paren(l) for l in (pick(s.get("languages")) or [])]
    if langs:
        person["knowsLanguage"] = langs
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "ProfilePage", "@id": url, "url": url, "name": title, "inLanguage": "de",
         "isPartOf": {"@type": "WebSite", "@id": WEBSITE_ID, "url": SITE + "/"},
         "mainEntity": {"@id": url + "#person"}},
        person]}
    return meta_block(title, desc, url, "profile", image, s["name"] + " – Portrait", ld), title, desc, len(sa)


# ---------------------------------------------------------------------------
# Startseite
# ---------------------------------------------------------------------------

def nachname_key(s):
    last = s["name"].split()[-1].lower()
    for a, b in (("ä", "a"), ("ö", "o"), ("ü", "u"), ("ß", "ss")):
        last = last.replace(a, b)
    return last


def cards_html(students, ui, img):
    out = ""
    for s in sorted(students, key=nachname_key):
        out += ('<a class="card" href="students/' + esc(s["slug"]) + '.html"><div class="card-media">'
                + img.html("students/" + s["slug"] + ".jpg", s["name"] + " – " + ui["portraitAlt"],
                           "(min-width: 125rem) 20rem, (min-width: 72rem) 21rem, (min-width: 640px) 31vw, 50vw")
                + '<div class="media-fallback" aria-hidden="true">' + esc(initials(s["name"])) + "</div></div>"
                + '<div class="card-body"><span class="card-name">' + esc(s["name"]) + "</span>"
                + '<span class="card-cta">' + esc(ui["toProfile"]) + "</span></div></a>")
    return out


def iso_start(d, zeit):
    y, m, t = (int(x) for x in d.split("-"))
    if not zeit:
        return d
    hh, mm = (int(x) for x in re.match(r"(\d{1,2}):(\d{2})", zeit).groups())
    return datetime.datetime(y, m, t, hh, mm, tzinfo=TZ).isoformat()


def place(name, stadt=None):
    p = {"@type": "Place", "name": name}
    if stadt is None:
        stadt = next((c for c in STAEDTE if c in name), None)
    if stadt:
        addr = {"@type": "PostalAddress", "addressLocality": stadt}
        if stadt in STAEDTE:
            addr["addressCountry"] = STAEDTE[stadt]
        p["address"] = addr
    return p


def events(termine, img):
    out = []
    for p in termine["produktionen"]:
        bild = img.absolute("productions/" + p["key"] + ".jpg")[0] if img.info("productions/" + p["key"] + ".jpg") else None
        zeiten = p.get("uhrzeiten") or [None]
        for t in p.get("termine", []):
            if t.get("unsicher") or datetime.date.fromisoformat(t["d"]) < TODAY:
                continue   # nur feststehende, nicht vergangene Termine
            for z in zeiten:
                ev = {"@type": "TheaterEvent",
                      "name": p["titel"] + (" (Premiere)" if t.get("typ") == "premiere" else ""),
                      "startDate": iso_start(t["d"], z),
                      "eventStatus": "https://schema.org/EventScheduled",
                      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                      "location": place(p["venue"]),
                      "performer": {"@id": GROUP_ID},
                      "organizer": {"@id": ORG_ID},
                      "url": SITE + "/#auffuehrungen"}
                if bild:
                    ev["image"] = bild
                if has(p.get("tickets")):
                    ev["offers"] = {"@type": "Offer", "url": p["tickets"]}
                out.append(ev)
    for a in termine["avo"]:
        if datetime.date.fromisoformat(a["d"]) < TODAY:
            continue
        out.append({"@type": "Event",
                    "name": "Abschlussvorsprechen ADK Bayern Jahrgang 2027 – " + a["stadt"],
                    "description": "Abschlussvorsprechen des Abschlussjahrgangs 2027 der " + ORG_NAME
                                   + " in " + a["stadt"] + " (" + a["venue"] + ").",
                    "startDate": iso_start(a["d"], a.get("zeit")),
                    "eventStatus": "https://schema.org/EventScheduled",
                    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                    "location": place(a["venue"], a["stadt"]),
                    "performer": {"@id": GROUP_ID},
                    "organizer": {"@id": GROUP_ID},
                    "url": SITE + "/#avo"})
    return out


def index_seo(students, termine, img):
    n = ZAHLWORTE.get(len(students), str(len(students)))
    title = "ADK Bayern Jahrgang 2027 – Abschlussjahrgang & Abschlussvorsprechen"
    desc = ("Abschlussjahrgang 2027 der ADK Bayern (Akademie für Darstellende Kunst Bayern): "
            + n + " Schauspieler:innen, Aufführungen und Termine der Abschlussvorsprechen.")
    image = img.absolute("group.jpg")
    group = {"@type": "PerformingGroup", "@id": GROUP_ID, "name": GROUP_NAME, "url": SITE + "/",
             "description": "Abschlussjahrgang 2027 der " + ORG_NAME + " in Regensburg: " + n
                            + " Schauspieler:innen.",
             "image": image[0],
             "address": {"@type": "PostalAddress", "addressLocality": "Regensburg", "addressCountry": "DE"},
             "parentOrganization": {"@id": ORG_ID},
             "sameAs": ["https://www.instagram.com/adkbayern2027/"],
             "member": [{"@type": "Person", "@id": profile_url(s["slug"]) + "#person", "name": s["name"],
                         "url": profile_url(s["slug"])} for s in sorted(students, key=nachname_key)]}
    item_list = {"@type": "ItemList", "@id": SITE + "/#ensemble", "name": "Ensemble – " + GROUP_NAME,
                 "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": profile_url(s["slug"]),
                                      "name": s["name"]}
                                     for i, s in enumerate(sorted(students, key=nachname_key))]}
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "@id": WEBSITE_ID, "url": SITE + "/", "name": "ADK Bayern Jahrgang 2027",
         "inLanguage": "de", "publisher": {"@id": GROUP_ID}},
        org_node(), group, item_list] + events(termine, img)}
    return meta_block(title, desc, SITE + "/", "website", image, "Gruppenfoto des Abschlussjahrgangs 2027", ld), title, desc


# ---------------------------------------------------------------------------
# Sitemap
# ---------------------------------------------------------------------------

def lastmod(rel):
    try:
        dirty = subprocess.run(["git", "status", "--porcelain", "--", rel], cwd=ROOT,
                               capture_output=True, text=True, check=True).stdout.strip()
        if dirty:
            return TODAY.isoformat()
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT,
                           capture_output=True, text=True, check=True).stdout.strip()
        return d or TODAY.isoformat()
    except (OSError, subprocess.CalledProcessError):
        return TODAY.isoformat()


def sitemap(students):
    pages = [("/", "index.html", "1.0"), ("/links/", "links/index.html", "0.6")]
    pages += [("/students/" + s["slug"] + ".html", "students/" + s["slug"] + ".html", "0.8") for s in students]
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, rel, prio in pages:
        out += ["  <url>", "    <loc>" + SITE + loc + "</loc>", "    <lastmod>" + lastmod(rel) + "</lastmod>",
                "    <priority>" + prio + "</priority>", "  </url>"]
    out.append("</urlset>")
    return "\n".join(out) + "\n"


# ---------------------------------------------------------------------------

def fill(html, regex, inner, rel):
    if not regex.search(html):
        raise SystemExit("Markierung fehlt in " + rel)
    return regex.sub(lambda m: m.group(1) + inner + m.group(3), html, count=1)


def version_of(html):
    m = re.search(r"app\.js\?v=([^\"&#]+)", html)
    return m.group(1) if m else ""


def main():
    students = js_literal(read("assets/data/students.js"), "STUDENTS")
    termine = js_literal(read("assets/data/termine.js"), "TERMINE")
    sizes = js_literal(read("assets/data/image-sizes.js"), "IMAGE_SIZES")
    app_js = read("assets/js/app.js")
    ui = js_literal(app_js, "UI")["de"]
    links = Links(read("assets/js/profile.js"))
    report = []

    for s in students:
        rel = "students/" + s["slug"] + ".html"
        if not os.path.exists(os.path.join(ROOT, rel)):
            print("FEHLT (bitte aus einer bestehenden Profilseite kopieren):", rel, file=sys.stderr)
            continue
        html = read(rel)
        img = Img(sizes, version_of(html), "../")
        seo, title, desc, n_same = profile_seo(s, img)
        html = fill(html, SEO_RE, seo, rel)
        html = fill(html, CONTENT_RE, "    " + profile_html(s, ui, img, links) + "\n", rel)
        changed = write_if_changed(rel, html)
        report.append((rel, changed, title, desc, n_same))

    html = read("index.html")
    img = Img(sizes, version_of(html), "./")
    seo, title, desc = index_seo(students, termine, img)
    html = fill(html, SEO_RE, seo, "index.html")
    html = fill(html, CONTENT_RE, "        " + cards_html(students, ui, img) + "\n", "index.html")
    report.append(("index.html", write_if_changed("index.html", html), title, desc, None))

    write_if_changed("sitemap.xml", sitemap(students))

    for rel, changed, title, desc, n_same in report:
        warn = "" if 140 <= len(desc) <= 160 else "  <-- description nicht 140–160 Zeichen"
        print("%s %s\n   title (%d): %s\n   description (%d): %s%s%s" % (
            "geändert " if changed else "unverändert", rel, len(title), title, len(desc), desc,
            "" if n_same is None else "\n   sameAs: %d" % n_same, warn))


if __name__ == "__main__":
    main()
