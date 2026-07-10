# brAVO-Website – ADK Bayern, Abschlussjahrgang 2027

Portfolio-Website der zehn Schauspielstudierenden des Abschlussjahrgangs 2027 der Akademie für Darstellende Kunst Bayern. Reines HTML/CSS/JavaScript – kein Framework, kein Build-Tool. Direkt deploybar auf GitHub Pages oder Netlify.

## Lokal starten

Wegen der `fetch`-basierten Medien-Erkennung braucht die Seite einen HTTP-Server (nicht per Doppelklick als `file://` öffnen – dann werden Video/Audio-Player ausgeblendet):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Struktur

```
index.html               Gruppenübersicht (Hero + Ensemble-Grid)
students/{slug}.html     Einzelprofile (dünne Hüllen, Inhalt kommt aus students.js)
impressum.html           Impressum (Platzhalter [in eckigen Klammern] ausfüllen!)
datenschutz.html         Datenschutzerklärung (Platzhalter ausfüllen!)
assets/data/students.js  ZENTRALE DATENBASIS – alle Textinhalte aller Personen
assets/js/app.js         Sprachumschaltung (DE/EN), Medien-Konvention, Helfer
assets/js/index.js       Rendert das Ensemble-Grid
assets/js/profile.js     Rendert die Einzelprofile
assets/css/style.css     Design-System
assets/images/students/  Portraitfotos:  {slug}.jpg
assets/images/group.jpg  Gruppenfoto für den Hero-Bereich
assets/images/group-2.jpg  Zweites Gruppenfoto (Band zwischen Ensemble und Aufführungen)
assets/videos/           Showreels:      {slug}.mp4
assets/audio/            Audio-Reels:    {slug}.mp3 (optional)
```

## Inhalte ergänzen

### Profil einer bestehenden Person befüllen (die 8 Platzhalter)

In `assets/data/students.js` beim jeweiligen Eintrag `placeholder: true` entfernen und die Felder analog zu Konstantin/Salome ergänzen. **Kein HTML anfassen** – die Profilseite existiert bereits und rendert automatisch alles, was an Daten vorhanden ist.

- Alle Felder sind optional: fehlende/leere Felder (auch ganze Sektionen wie `auditionSongs` oder `credits.film`) werden einfach ausgelassen.
- Arrays dürfen beliebig lang sein – es gibt keine festen Längen.
- Mehrsprachige Felder haben die Form `{ de: "...", en: "..." }`. Solange keine Übersetzung vorliegt: `en: "TODO: Übersetzung folgt"` eintragen (niemals leer lassen).

### Medien ergänzen (kein Code nötig!)

Dateien nur korrekt benennen und in den passenden Ordner legen:

| Medium | Pfad | Verhalten |
|---|---|---|
| Portraitfoto | `assets/images/students/{slug}.jpg` | Fallback mit Initialen, solange es fehlt |
| Showreel | `assets/videos/{slug}.mp4` | Player erscheint automatisch; solange die Datei fehlt: Hinweis „Showreel folgt in Kürze“ |
| Audio-Reel | `assets/audio/{slug}.mp3` | Optional – Player erscheint **nur**, wenn die Datei existiert |

Die Existenz wird zur Laufzeit per HTTP-HEAD-Request geprüft; es gibt nirgends manuell gepflegte Pfade. Videos werden mit `preload="none"` und dem Portrait als Poster eingebunden – die Seite lädt also nicht schwer.

### Ganz neue Person (z.B. eine 11.) hinzufügen

1. Eintrag in `assets/data/students.js` anlegen (mindestens `{ slug, name, placeholder: true }`).
2. Eine bestehende Platzhalter-Profilseite (z.B. `students/cedric-corazza.html`) kopieren, als `students/{neuer-slug}.html` speichern und darin Name, Slug und Beschreibung in `<title>`, Meta-Tags und JSON-LD anpassen (`data-slug` im `<main>` nicht vergessen).
3. URL in `sitemap.xml` ergänzen.

### Neue optionale Felder oder Medientypen

- Neue Textfelder: in `students.js` ergänzen und in `assets/js/profile.js` eine kleine Render-Funktion nach dem Muster der bestehenden (`songsHtml`, `rolesHtml`, …) hinzufügen. Bestehende Profile ohne das Feld brechen nicht.
- Neue Medientypen: in `app.js` → `mediaPath()` eine Zeile ergänzen und in `profile.js` analog zum Audio-Reel per `mediaExists()` einbinden.

## Sprachen (DE/EN)

- Umschalter oben rechts auf jeder Seite; Auswahl wird in `localStorage` gemerkt, `<html lang>` wird dynamisch aktualisiert.
- UI-Texte (Überschriften, Labels, Navigation) liegen zweisprachig in `assets/js/app.js` (`UI`-Objekt).
- Personen-Inhalte liegen zweisprachig in `students.js`; fehlt die englische Fassung, wird sichtbar „TODO: Übersetzung folgt“ angezeigt bzw. auf Deutsch zurückgefallen.
- Impressum & Datenschutz sind bewusst nur auf Deutsch; im EN-Modus erscheint ein Hinweis darauf.

## Vor dem Livegang (Checkliste)

1. **Domain ersetzen:** Der Platzhalter `https://adk-bayern-2027.de` steht in allen Meta-Tags (Canonical/Open Graph/JSON-LD), in `sitemap.xml` und `robots.txt`. Projektweit suchen & ersetzen:
   ```bash
   grep -rl "adk-bayern-2027.de" --include="*.html" --include="*.xml" --include="*.txt" . | xargs sed -i 's|adk-bayern-2027.de|EURE-DOMAIN.de|g'
   ```
2. **Impressum & Datenschutz:** alle `[Platzhalter in eckigen Klammern]` ausfüllen, Hosting-Anbieter in der Datenschutzerklärung eintragen.
3. **Gruppenfotos** als `assets/images/group.jpg` (Hero) und `assets/images/group-2.jpg` (Band unter dem Ensemble) ablegen; beide Bereiche blenden sich automatisch aus, solange die Datei fehlt.
4. Portraits und Videos gemäß Namenskonvention hochladen.

## Deployment

- **GitHub Pages:** Repo pushen → Settings → Pages → Branch `main`, Ordner `/ (root)`. Relative Pfade funktionieren auch bei Projekt-Pages (URL mit `/repo-name/`) unverändert.
- **Netlify:** Ordner per Drag & Drop hochladen oder Repo verbinden – kein Build-Command, Publish-Directory ist die Wurzel.
- GitHub hat ein Datei-Limit von 100 MB – Showreels ggf. komprimieren (z.B. 1080p, H.264, ~5 Mbit/s) oder Netlify verwenden.

## Getroffene Annahmen (bitte prüfen)

- **Domain:** `adk-bayern-2027.de` als Platzhalter (analog zur Vorgängerseite). Siehe Checkliste oben.
- **Fotoformat:** ausschließlich `.jpg` (Konvention, bewusst keine Format-Varianten).
- **Englische UI-Texte** (Navigation, Labels, Hero) habe ich verfasst – die persönlichen Inhalte der beiden Beispielprofile sind wie vereinbart mit „TODO: Übersetzung folgt“ markiert.
- **Impressum/Datenschutz noindex:** Rechtsseiten sind von der Suchindexierung ausgenommen und nicht in der Sitemap.
- **Design:** Credits und Vorsprechrollen sind bewusst reine statische Listen ohne Hover-Effekte (Lehre aus der Vorgängerseite); Interaktives (Links, Buttons, Karten) hat dagegen klare Hover-/Focus-Zustände mit reinen CSS-Transitions.
