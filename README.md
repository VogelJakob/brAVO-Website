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
index.html               Startseite (Hero, Einleitung, Ensemble, Aufführungen, AVO, News)
students/{slug}.html     Einzelprofile (dünne Hüllen, Inhalt kommt aus students.js)
impressum.html           Impressum (Kontaktdaten eingetragen)
datenschutz.html         Datenschutzerklärung (Hosting-Anbieter vor Livegang ergänzen)
assets/data/students.js  ZENTRALE DATENBASIS – alle Textinhalte aller Personen
assets/data/termine.js   ZENTRALE TERMINE – Produktionen und AVO (siehe unten)
assets/data/credits.js   Foto-Credits pro Bild (Wasserzeichen)
assets/js/app.js         UI-Texte, Medien-Konvention, Lightbox, Foto-Credits, Helfer
assets/js/index.js       Rendert das Ensemble-Grid (alphabetisch nach Nachname)
assets/js/profile.js     Rendert die Einzelprofile
assets/js/termine.js     Rendert Laufband, AVO-Liste, Formular-Auswahl, Aufführungs-Termine
assets/js/avo.js         AVO-Anmeldeformular (Formspree) und Trailer-Einbindung
assets/css/style.css     Design-System
assets/images/students/  Portraitfotos:  {slug}.jpg · Galerie: {slug}-2.jpg … -8.jpg
assets/images/group.jpg  Gruppenfoto (QUER) für den Hero-Bereich
assets/images/group-2.jpg  Zweites Gruppenfoto (Band zwischen Ensemble und Aufführungen)
assets/images/productions/  Szenenfotos: hamlet.jpg, reise-zum-mond.jpg, kleine-hexe.jpg
                            (+ Galerie: hamlet-2.jpg … hamlet-6.jpg usw.)
assets/videos/           Showreels: {slug}.mp4 · AVO-Trailer: avo-trailer.mp4
assets/audio/            Audio-Reels:    {slug}.mp3 (optional)
```

## Inhalte ergänzen

### Profil einer bestehenden Person befüllen (die 8 Platzhalter)

In `assets/data/students.js` beim jeweiligen Eintrag `placeholder: true` entfernen und die Felder analog zu Konstantin/Salome ergänzen. **Kein HTML anfassen** – die Profilseite existiert bereits und rendert automatisch alles, was an Daten vorhanden ist.

- Alle Felder sind optional: fehlende/leere Felder (auch ganze Sektionen wie `auditionSongs` oder `credits.film`) werden einfach ausgelassen.
- Arrays dürfen beliebig lang sein – es gibt keine festen Längen.
- Die Website ist rein deutsch. Alte Felder der Form `{ de: "...", en: "..." }` funktionieren weiter (angezeigt wird immer der deutsche Wert); neue Felder einfach als einfachen String anlegen.
- Das Feld `pronouns` wird nicht mehr angezeigt.
- Die Reihenfolge im Ensemble-Grid ist automatisch alphabetisch nach Nachname – die Reihenfolge der Einträge in `students.js` spielt keine Rolle.

### Termine ändern oder ergänzen

Alle Termine stehen **nur** in `assets/data/termine.js`. Daraus entstehen automatisch: das Laufband oben, die AVO-Terminliste, die Auswahl im Anmeldeformular, die Datumszeilen der Aufführungs-Karten und die Event-Auszeichnung für Suchmaschinen.

- **Neue Vorstellung:** eine Zeile in `termine` der jeweiligen Produktion ergänzen, z.B. `{ d: "2026-11-14" }`.
- **Datum immer im Format `"JJJJ-MM-TT"`** – der Wochentag wird daraus berechnet und nie eingetragen.
- `typ: "premiere"` markiert die Premiere (Chip auf der Karte), `unsicher: true` weist einen Termin als „voraussichtlich" aus.
- Stehen alle Termine fest: `weitereFolgen: false` setzen, dann verschwindet „weitere Termine folgen …".
- **AVO-Uhrzeit nachtragen:** beim jeweiligen Eintrag `zeit` setzen. Fehlt `zeit`, zeigt die Seite „Uhrzeit folgt" statt einer erfundenen Uhrzeit.

Die `<noscript>`-Blöcke in `index.html` (AVO-Sektion und Aufführungen) enthalten dieselben Termine im Klartext für Besucher:innen ohne JavaScript – bei größeren Änderungen bitte mitziehen.

### Foto-Credits eintragen

Die Credits erscheinen als Wasserzeichen unten rechts auf den großen Fotos und in der Lightbox. Gepflegt werden sie pro Bild in `assets/data/credits.js`:

```js
"assets/images/students/linda-lehmann-2.jpg": "Vorname Nachname",
```

- Ohne Eintrag greift `default` (aktuell „ADK Bayern Jahrgang 2027").
- Ein leerer String (`""`) blendet das Wasserzeichen für dieses eine Bild aus.
- Die Leute liefern ihre Fotos mit den Credits **im Dateinamen**: beim Umbenennen auf die Namenskonvention den Namen einfach hier als Zeile eintragen.

### Medien ergänzen (kein Code nötig!)

Dateien nur korrekt benennen und in den passenden Ordner legen:

| Medium | Pfad | Verhalten |
|---|---|---|
| Portraitfoto | `assets/images/students/{slug}.jpg` | Fallback mit Initialen, solange es fehlt |
| Showreel | `assets/videos/{slug}.mp4` | Player erscheint automatisch; solange die Datei fehlt: Hinweis „Showreel folgt in Kürze“ |
| Audio-Reel | `assets/audio/{slug}.mp3` | Optional – Player erscheint **nur**, wenn die Datei existiert |
| Fotogalerie Person | `assets/images/students/{slug}-2.jpg` … `-8.jpg` | Erscheinen automatisch als Vorschaureihe im Profil; Lightbox blättert durch alle Bilder der Person |
| Gruppenfoto Hero | `assets/images/group.jpg` (**Querformat**) | Solange es fehlt, zeigt der Hero automatisch `group-2.jpg` und blendet das Gruppenfoto-Band aus |
| Szenenfotos | `assets/images/productions/hamlet.jpg`, `reise-zum-mond.jpg`, `kleine-hexe.jpg` | Erscheinen automatisch in den Aufführungs-Karten (mit Lightbox/Zoom); solange sie fehlen: „Foto folgt“ |
| Szenenfoto-Galerie | `assets/images/productions/{key}-2.jpg` … `-6.jpg` | Vorschaureihe unter dem Hauptbild der Karte; Lightbox blättert durch alle Szenenfotos |
| AVO-Trailer | `assets/videos/avo-trailer.mp4` | Player erscheint automatisch in der AVO-Sektion; solange die Datei fehlt: Hinweis „Trailer folgt“ |

Die Existenz wird zur Laufzeit per HTTP-HEAD-Request geprüft; es gibt nirgends manuell gepflegte Pfade. Videos werden mit `preload="none"` und dem Portrait als Poster eingebunden – die Seite lädt also nicht schwer.

### Ganz neue Person (z.B. eine 11.) hinzufügen

1. Eintrag in `assets/data/students.js` anlegen (mindestens `{ slug, name, placeholder: true }`).
2. Eine bestehende Platzhalter-Profilseite (z.B. `students/cedric-corazza.html`) kopieren, als `students/{neuer-slug}.html` speichern und darin Name, Slug und Beschreibung in `<title>`, Meta-Tags und JSON-LD anpassen (`data-slug` im `<main>` nicht vergessen).
3. URL in `sitemap.xml` ergänzen.

### Neue optionale Felder oder Medientypen

- Neue Textfelder: in `students.js` ergänzen und in `assets/js/profile.js` eine kleine Render-Funktion nach dem Muster der bestehenden (`songsHtml`, `rolesHtml`, …) hinzufügen. Bestehende Profile ohne das Feld brechen nicht.
- Neue Medientypen: in `app.js` → `mediaPath()` eine Zeile ergänzen und in `profile.js` analog zum Audio-Reel per `mediaExists()` einbinden.

## Sprache

Die Website ist rein deutsch (der frühere DE/EN-Umschalter wurde auf Kundenwunsch entfernt). UI-Texte liegen zentral in `assets/js/app.js` (`UI`-Objekt); englische Altbestände in `students.js` werden ignoriert.

## Noch offene Platzhalter (nach Feedback-Umsetzung)

| Was | Wo eintragen |
|---|---|
| Fotograf:innen-Namen | `assets/data/credits.js` (pro Bild), zusätzlich `impressum.html` unter „Urheberrecht“ |
| Anmelde-Mailadresse (ADK) | `assets/js/avo.js` → Konstante `ADK_MAIL` **und** `links/index.html` → Button „Anmeldung AVO“ (beide Stellen zusammen ändern) |
| Formspree-Formular-ID | `index.html` → `action="https://formspree.io/f/FORMSPREE_ID"` (kostenloser Account auf formspree.io, Zieladresse = die Anmelde-Mail) |
| Karls Doppelname („Karl Georg“ vs. „Karl-Georg“) | `assets/data/students.js` (TODO-Kommentar beim Eintrag) |
| Domain | projektweit `adk-bayern-2027.de` ersetzen (siehe Checkliste unten) |

Erledigt und daher **nicht** mehr offen: Impressum/Datenschutz (echte Daten eingetragen), GoFundMe-Link, AVO-Uhrzeiten (Regensburg 14 Uhr, übrige Städte 14:30 Uhr – Änderungen jetzt in `assets/data/termine.js`).

Neue News-Einträge werden direkt in `index.html` in der Sektion `#news` gepflegt – neue Einträge immer oben einfügen.

## Vor dem Livegang (Checkliste)

1. **Domain ersetzen:** Der Platzhalter `https://adk-bayern-2027.de` steht in allen Meta-Tags (Canonical/Open Graph/JSON-LD), in `sitemap.xml` und `robots.txt`. Projektweit suchen & ersetzen:
   ```bash
   grep -rl "adk-bayern-2027.de" --include="*.html" --include="*.xml" --include="*.txt" . | xargs sed -i 's|adk-bayern-2027.de|EURE-DOMAIN.de|g'
   ```
2. **Datenschutz:** Hosting-Anbieter in der Datenschutzerklärung eintragen.
3. **Gruppenfotos** als `assets/images/group.jpg` (Hero, **Querformat**) und `assets/images/group-2.jpg` (Band unter dem Ensemble) ablegen.
4. Portraits, Szenenfotos (inkl. Galerien) und Videos gemäß Namenskonvention hochladen und die Foto-Credits in `assets/data/credits.js` eintragen.
5. **Platzhalter aus der Tabelle oben** (Formspree-ID, Anmelde-Mail, Foto-Credits, …) ausfüllen.

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
