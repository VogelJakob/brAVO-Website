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
impressum.html           Impressum (Platzhalter [in eckigen Klammern] ausfüllen!)
datenschutz.html         Datenschutzerklärung (Platzhalter ausfüllen!)
assets/data/students.js  ZENTRALE DATENBASIS – alle Textinhalte aller Personen
assets/js/app.js         UI-Texte, Medien-Konvention, Lightbox, Helfer
assets/js/index.js       Rendert das Ensemble-Grid (alphabetisch nach Nachname)
assets/js/profile.js     Rendert die Einzelprofile
assets/js/avo.js         AVO-Anmeldeformular (Formspree) und Trailer-Einbindung
assets/css/style.css     Design-System
assets/images/students/  Portraitfotos:  {slug}.jpg
assets/images/group.jpg  Gruppenfoto (QUER) für den Hero-Bereich
assets/images/group-2.jpg  Zweites Gruppenfoto (Band zwischen Ensemble und Aufführungen)
assets/images/productions/  Szenenfotos: hamlet.jpg, reise-zum-mond.jpg, kleine-hexe.jpg
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

### Medien ergänzen (kein Code nötig!)

Dateien nur korrekt benennen und in den passenden Ordner legen:

| Medium | Pfad | Verhalten |
|---|---|---|
| Portraitfoto | `assets/images/students/{slug}.jpg` | Fallback mit Initialen, solange es fehlt |
| Showreel | `assets/videos/{slug}.mp4` | Player erscheint automatisch; solange die Datei fehlt: Hinweis „Showreel folgt in Kürze“ |
| Audio-Reel | `assets/audio/{slug}.mp3` | Optional – Player erscheint **nur**, wenn die Datei existiert |
| Gruppenfoto Hero | `assets/images/group.jpg` (**Querformat**) | Solange es fehlt, zeigt der Hero automatisch `group-2.jpg` und blendet das Gruppenfoto-Band aus |
| Szenenfotos | `assets/images/productions/hamlet.jpg`, `reise-zum-mond.jpg`, `kleine-hexe.jpg` | Erscheinen automatisch in den Aufführungs-Karten (mit Lightbox/Zoom); solange sie fehlen: „Foto folgt“ |
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
| Fotograf:innen-Name (Wasserzeichen + Credit) | `assets/css/style.css` → CSS-Variable `--foto-credit` in `:root`, zusätzlich `impressum.html` unter „Urheberrecht“ |
| Formspree-Formular-ID | `index.html` → `action="https://formspree.io/f/FORMSPREE_ID"` (kostenloser Account auf formspree.io, Zieladresse = ADK-Mail) |
| ADK-Mailadresse (Fehlerhinweis im Formular) | `assets/js/avo.js` → Konstante `ADK_MAIL` |
| GoFundMe-Link | `index.html` → Button „Zur GoFundMe-Kampagne“ in der AVO-Sektion |
| Uhrzeiten der übrigen AVO-Termine | `index.html` (AVO-Terminliste + Formular-Optionen + Marquee-Spans) und `assets/js/app.js` (`marquee`-Text) |
| Karls Doppelname („Karl Georg“ vs. „Karl-Georg“) | `assets/data/students.js` (TODO-Kommentar beim Eintrag) |
| Impressum-Kontaktdaten | `impressum.html` + `datenschutz.html` (eckige Klammern) |

Neue News-Einträge werden direkt in `index.html` in der Sektion `#news` gepflegt – neue Einträge immer oben einfügen.

## Vorübergehender Passwortschutz

Solange die Seite noch nicht offiziell veröffentlicht ist, liegt ein einfacher Passwortschutz über allen Seiten (`assets/js/gate.js`, eingebunden im `<head>` jeder HTML-Datei). Nach einmaliger Eingabe merkt sich der Browser die Freischaltung.

- **Passwort ändern:** neuen Hash erzeugen mit `node -e "console.log(require('crypto').createHash('sha256').update('NEUES-PASSWORT').digest('hex'))"` und in `assets/js/gate.js` bei `HASH` eintragen.
- **Grenzen:** Es ist ein Sichtschutz, keine echte Zugriffskontrolle – bei einer statischen Seite (z.B. GitHub Pages) sind die Inhalte technisch weiter abrufbar, und bei einem öffentlichen Repository ohnehin einsehbar. Für den vorübergehenden Zweck reicht das; echte Zugriffskontrolle bräuchte einen Server bzw. Hosting mit Auth (z.B. Cloudflare Access).
- **Zum Livegang entfernen:** `assets/js/gate.js` löschen, die `<script ... gate.js>`-Zeile aus allen HTML-Dateien entfernen (`grep -rl "gate.js" --include="*.html" . | xargs sed -i '/gate.js/d'`) und `robots.txt` wieder auf `Allow: /` stellen.

## Vor dem Livegang (Checkliste)

0. **Passwortschutz entfernen** (siehe Abschnitt oben) und `robots.txt` wieder auf `Allow: /` stellen.
1. **Domain ersetzen:** Der Platzhalter `https://adk-bayern-2027.de` steht in allen Meta-Tags (Canonical/Open Graph/JSON-LD), in `sitemap.xml` und `robots.txt`. Projektweit suchen & ersetzen:
   ```bash
   grep -rl "adk-bayern-2027.de" --include="*.html" --include="*.xml" --include="*.txt" . | xargs sed -i 's|adk-bayern-2027.de|EURE-DOMAIN.de|g'
   ```
2. **Impressum & Datenschutz:** alle `[Platzhalter in eckigen Klammern]` ausfüllen, Hosting-Anbieter in der Datenschutzerklärung eintragen.
3. **Gruppenfotos** als `assets/images/group.jpg` (Hero, **Querformat**) und `assets/images/group-2.jpg` (Band unter dem Ensemble) ablegen.
4. Portraits, Szenenfotos und Videos gemäß Namenskonvention hochladen.
5. **Platzhalter aus der Tabelle oben** (Formspree-ID, GoFundMe, Foto-Credit, …) ausfüllen.

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
