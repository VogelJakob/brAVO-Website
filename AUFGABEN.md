# Aufgabenliste brAVO-Website

Stand: 09.10.2026. Grundlage ist der Code im Repo. Fotos, Videos und Audio liegen
nicht im Repo, sondern kommen per FileZilla auf den Server. Was dort schon liegt,
lässt sich von hier aus nicht prüfen, deshalb sind diese Punkte als „prüfen“ formuliert.

## 1. Dringend (Termine sind veraltet)

- [ ] **Hamlet**: Alle eingetragenen Vorstellungen (bis 02.10.2026) sind vorbei,
      trotzdem steht `weitereFolgen: true`. Entweder neue Termine eintragen oder
      `weitereFolgen: false` setzen und über „Dernière gespielt“ o. Ä. entscheiden
      (`assets/data/termine.js`).
- [ ] **Reise zum Mond**: Termine nach dem 23.10.2026 ergänzen oder `weitereFolgen: false` setzen.
- [ ] **Vergangene Termine** werden nicht automatisch ausgeblendet. Das betrifft das Laufband,
      die AVO-Liste, das Auswahlfeld im Anmeldeformular und die Aufführungs-Karten.
      Ab dem 22.10. (Linz) kann man sich zum Beispiel noch für vergangene AVO-Termine anmelden.
      → Filter „nur heutige und künftige Termine“ in `assets/js/termine.js` einbauen
      (oder vergangene Termine von Hand löschen).
- [ ] **`<noscript>`-Blöcke** in `index.html` an die neuen Termine anpassen.
- [ ] **News** (`index.html`, Bereich `#news`): Die letzten Einträge stammen aus dem Juli 2026.
      Neue Meldungen oben einfügen, z. B. zur Hamlet-Premiere, zur Premiere von „Reise zum Mond“
      in Chemnitz und zum AVO in Linz. Den Satz „Fotos … folgen in Kürze“ entfernen.

## 2. Inhalte / Profile

- [ ] **Karl-Georg Rößler**: Es fehlen Stimmlage (`voiceType`) und die komplette Vita/Credits-Liste
      (`credits.theater` / `credits.film`) in `assets/data/students.js`.
      Die Bio erwähnt nur die Zeit bis 2023, die ADK-Produktionen fehlen.
- [ ] **Karls Name**: Das README listet „Karl Georg“ vs. „Karl-Georg“ noch als offen. Mit ihm klären
      und anschließend den README-Eintrag streichen.
- [ ] **Charlotte Friederich**: Nur Theater-Credits vorhanden. Film-Credits und Sonstiges nachfragen.
- [ ] **Audio-Reels**: Nur Charlotte Grünewald und Michelle Thielsch haben welche. Bei den anderen
      nachfragen, ob sie Hörproben haben (optional).
- [ ] **Kurzer Korrekturlauf** aller zehn Profile (Tippfehler, Rollen, Jahreszahlen, E-Mail/Instagram)
      und eine Freigabe durch die jeweilige Person einholen.

## 3. Medien (auf dem Server prüfen bzw. hochladen)

- [ ] **Showreels** `assets/videos/{slug}.mp4`: Für wen fehlen sie noch? Solange eins fehlt, steht dort
      „Showreel folgt in Kürze“.
- [ ] **AVO-Trailer** `assets/videos/avo-trailer.mp4` hochladen (Hinweis „Trailer folgt“).
- [ ] **Szenenfotos „Die Reise von der Erde zum Mond“**: In `credits.js` gibt es keine Einträge,
      vermutlich fehlen die Fotos also noch. Ablegen als `reise-zum-mond.jpg` (+ `-2` … `-10`)
      und den Fotografen bzw. die Fotografin eintragen.
- [ ] **Galerie-Fotos** für Karl-Georg (bisher nur 3 Bilder) und Michelle (4 Bilder) ggf. ergänzen.
- [ ] **Gruppenfoto quer** `assets/images/group.jpg` prüfen. Es wird auch als Vorschaubild
      beim Teilen (`og:image`) verwendet.
- [ ] `credits.js`: Für `charlotte-gruenewald-3.jpeg` gibt es einen Eintrag, die Seite lädt aber nur
      `.jpg`. Datei umbenennen und den doppelten Eintrag löschen.

## 4. Technik / SEO / Rechtliches

- [ ] **Domain prüfen**: `adk-bayern-2027.de` steht überall (Canonical, Open Graph, Sitemap,
      robots.txt, Links-Seite). Ist das die echte Domain bei IONOS? Falls nicht, projektweit
      ersetzen (Befehl steht im README).
- [ ] **Google Fonts lokal einbinden**: Die Schriften werden aktuell direkt von Google geladen.
      Deutsche Gerichte haben das schon abgemahnt (LG München 2022), weil dabei die IP-Adresse
      übertragen wird. Anton und Archivo als Dateien nach `assets/fonts/` legen und
      Abschnitt 3 der Datenschutzerklärung anpassen.
- [ ] **Datenschutz**: Abschnitt 7 nennt als Formular-Felder „Vorsprechen, Personenanzahl, Name,
      E-Mail“. Mit den tatsächlichen Formularfeldern abgleichen.
- [ ] **sitemap.xml**: `lastmod`-Daten aktualisieren (stehen noch auf Juli 2026).
- [ ] **Deploy-Workflow** (`.github/workflows/deploy.yml`): Der Ausschluss `assets/videos/students/*`
      passt nicht zur echten Struktur (`assets/videos/*.mp4`). Weil Videos ohnehin nicht im Repo
      sind, ist das unkritisch. Trotzdem prüfen, dass ein Deploy keine per FileZilla
      hochgeladenen Medien überschreibt oder löscht.
- [ ] **Test auf echten Geräten**: iPhone/Android, Safari, Lightbox, Videos, Formular einmal
      absenden (kommt die Mail bei `adk.bayern27@gmail.com` an?).

## 5. README aufräumen

- [ ] Steht noch „Hosting-Anbieter vor Livegang ergänzen“, ist aber erledigt (IONOS ist eingetragen).
- [ ] Steht noch „Das Feld `pronouns` wird nicht mehr angezeigt“, wird aber wieder angezeigt.
- [ ] Abschnitt „Getroffene Annahmen“ erwähnt noch englische UI-Texte und Übersetzungen. Die Seite
      ist inzwischen rein deutsch.

## 6. Nach dem AVO (ab 08.11.2026)

- [ ] AVO-Bereich, Laufband und Anmeldeformular umbauen oder ausblenden, z. B. zu
      „Danke für euren Besuch“ und Kontakt für Agenturen.
- [ ] GoFundMe-Button auf der Links-Seite (`links/index.html`) entfernen oder ändern, sobald
      die Kampagne endet.
- [ ] Formspree-Formular deaktivieren, wenn es nicht mehr gebraucht wird (Datenschutz).
