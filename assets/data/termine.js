/*
 * ZENTRALE TERMIN-DATENBASIS – Produktionen und Abschlussvorsprechen (AVO).
 *
 * Alles, was auf der Startseite Termine anzeigt, wird aus dieser Datei erzeugt:
 * das Laufband oben, die AVO-Terminliste, die Auswahl im Anmeldeformular und
 * die Datumszeilen der Aufführungs-Karten (siehe assets/js/termine.js).
 * Ein Termin wird also genau EINMAL gepflegt – hier.
 *
 * DATUM: immer ISO-Format "JJJJ-MM-TT". Der Wochentag wird daraus berechnet
 * und nie eingetragen (verhindert Tippfehler wie "18.09.206").
 *
 * Termin-Felder (Produktionen):
 *   d         Datum (Pflicht)
 *   typ       "premiere" für die Premiere, sonst weglassen
 *   unsicher  true = Termin steht noch nicht fest (wird als "voraussichtlich"
 *             ausgewiesen)
 *
 * Felder pro Produktion (zusätzlich zu key/titel/venue/tickets):
 *   uhrzeiten  Beginnzeiten, die für ALLE Termine der Produktion gelten,
 *              z.B. ["19:00"] oder bei zwei Vorstellungen pro Tag
 *              ["14:00", "17:00"]. Fehlt das Feld, wird keine Uhrzeit gezeigt.
 *   fotosMax   Höchstzahl der Szenenfotos inkl. Hauptbild ({key}.jpg bis
 *              {key}-{fotosMax}.jpg). Ohne Angabe: 10.
 *   besetzung  Wer spielt mit – Liste von Namen. Wird als Zeile
 *              "Es spielen: …" unter der Karte gezeigt, nur wenn befüllt.
 *   ensembles  Nur bei Doppelbesetzung (z.B. Die kleine Hexe): Liste von
 *              { name: "Ensemble 1", besetzung: [ … ] }. Je befülltem
 *              Ensemble erscheint eine eigene Zeile; leere entfallen.
 *   Namen bitte genau so schreiben wie in students.js.
 *
 * Neue Vorstellung ergänzen: eine Zeile in "termine" einfügen – fertig.
 * Sobald alle Termine feststehen: "weitereFolgen: false" setzen, dann
 * verschwindet der Zusatz "weitere Termine folgen …".
 */
const TERMINE = {
  produktionen: [
    {
      key: "hamlet",
      titel: "Hamlet",
      venue: "Akademietheater Regensburg",
      tickets: "https://okticket.de/tickets-hamlet-regensburg-akademietheater-e58704?event_id=58704",
      uhrzeiten: ["19:00"],
      fotosMax: 7,
      weitereFolgen: false,
      termine: [
        { d: "2027-02-26" },
        { d: "2027-03-04" },
        { d: "2027-03-05" },
        { d: "2027-03-06" }
      ],
      besetzung: []
    },
    {
      key: "reise-zum-mond",
      titel: "Die Reise von der Erde zum Mond",
      venue: "Theater Chemnitz",
      tickets: "https://www.theater-chemnitz.de/spielplan/detailseite/die-reise-von-der-erde-zum-mond",
      uhrzeiten: ["20:00"],
      fotosMax: 7,
      weitereFolgen: false,
      termine: [
        { d: "2026-11-28", typ: "premiere" },
        { d: "2026-12-21" },
        { d: "2026-12-30" }
      ],
      besetzung: []
    },
    {
      key: "kleine-hexe",
      titel: "Die kleine Hexe",
      venue: "Akademietheater Regensburg",
      tickets: "https://okticket.de/tickets-akademietheater-regensburg-v171199",
      uhrzeiten: ["14:00", "17:00"],
      weitereFolgen: false,
      termine: [
        { d: "2027-01-16" },
        { d: "2027-01-17" },
        { d: "2027-01-23" },
        { d: "2027-01-24" },
        { d: "2027-01-30" },
        { d: "2027-01-31" }
      ],
      /* Doppelbesetzung: zwei Ensembles, je eine eigene "Es spielen"-Zeile */
      ensembles: [
        { name: "Ensemble 1", besetzung: [] },
        { name: "Ensemble 2", besetzung: [] }
      ]
    }
  ],

  /*
   * Abschlussvorsprechen. "zeit" bleibt leer, solange die Uhrzeit nicht
   * feststeht – dann zeigt die Seite "Uhrzeit folgt" statt einer erfundenen
   * Zeit.
   */
  avo: [
    { d: "2026-10-22", stadt: "Linz",       venue: "Anton Bruckner Universität",     zeit: "17:00 Uhr" },
    { d: "2026-10-30", stadt: "Regensburg", venue: "Akademietheater Regensburg",     zeit: "14 Uhr" },
    { d: "2026-11-02", stadt: "Köln",       venue: "Theater im Bauturm",             zeit: "14:30 Uhr" },
    { d: "2026-11-03", stadt: "Hamburg",    venue: "Hamburger Sprechwerk",           zeit: "14:30 Uhr" },
    { d: "2026-11-04", stadt: "Berlin",     venue: "Theaterhaus Berlin (Mitte)",     zeit: "14:30 Uhr" },
    { d: "2026-11-05", stadt: "Dresden",    venue: "Zentralwerk",                    zeit: "14:30 Uhr" },
    { d: "2026-11-07", stadt: "München",    venue: "Mucca Halle",                    zeit: "14:30 Uhr" }
  ]
};
