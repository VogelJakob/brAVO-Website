# Caching & Versionskennung

Damit Besucher nach einem Upload sofort die neuen Dateien sehen (auch auf
dem Handy), gibt es zwei Bausteine:

1. **`.htaccess`** (Webroot) – sagt dem Browser, dass er HTML und Assets
   vor jeder Nutzung kurz beim Server prüfen muss (`Cache-Control: no-cache`).
   Darin steht auch eine auskommentierte Alternative mit langem Caching
   (Modus B); wie man umschaltet, ist direkt in der Datei erklärt.
2. **Versionskennung `?v=JJJJMMTT-N`** an allen eigenen CSS-, JS-, Bild-,
   Audio- und Video-Einbindungen. Ändert sich die Kennung, ist es für den
   Browser eine neue Adresse – er lädt die Datei garantiert neu.

## Bei jedem Deployment

Werden geänderte **CSS-, JS-, Daten- (`assets/data/*.js`) oder Mediendateien**
hochgeladen, die Versionskennung erhöhen:

- Format: `JJJJMMTT-N` (Datum des Uploads, `N` = laufende Nummer am Tag),
  z. B. `20261010-1` → `20261010-2` → am nächsten Tag `20261011-1`.
- Aktueller Stand: **`20261010-4`**

### Wo die Kennung steht

Nur in den HTML-Dateien (als Text, per „Suchen & Ersetzen“ in allen Dateien
austauschen):

| Datei | Stellen |
|---|---|
| `index.html` | style.css, 7 Skripte, 5 statische Bilder |
| `impressum.html`, `datenschutz.html` | style.css, app.js |
| `students/*.html` (10 Profile) | style.css, students.js, credits.js, app.js, profile.js |
| `links/index.html` | style.css |

Befehl dafür (im Projektordner, ALT und NEU anpassen):

```bash
grep -rl "v=20261010-1" --include="*.html" . | xargs sed -i 's/v=20261010-1/v=20261010-2/g'
```

Danach **alle geänderten HTML-Dateien mit hochladen** – sonst kommt die neue
Kennung nicht beim Besucher an.

Bilder, Audio und Video, die per JavaScript gerendert werden (Portraits,
Galerien, Szenenfotos, Showreels, Hörproben, Trailer), bekommen die Kennung
automatisch: `assets/js/app.js` liest sie aus dem `?v=…` seiner eigenen
Einbindung (`ADK.version`) und hängt sie über `ADK.asset()` an. In den
JS-Dateien und in `assets/data/*.js` muss also nichts geändert werden.

Nicht versioniert (bewusst): externe Ressourcen (Google Fonts, Formspree, …)
sowie die absoluten `og:image`/`twitter:image`-URLs für Link-Vorschauen.
