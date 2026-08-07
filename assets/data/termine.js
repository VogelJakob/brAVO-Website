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
      weitereFolgen: true,
      termine: [
        { d: "2026-08-08", typ: "premiere" },
        { d: "2026-09-18" },
        { d: "2026-09-19" },
        { d: "2026-09-25" },
        { d: "2026-09-26" },
        { d: "2026-10-01" },
        { d: "2026-10-02" }
      ]
    },
    {
      key: "reise-zum-mond",
      titel: "Die Reise von der Erde zum Mond",
      venue: "Theater Chemnitz",
      tickets: "https://www.theater-chemnitz.de/spielplan/detailseite/die-reise-von-der-erde-zum-mond",
      weitereFolgen: true,
      termine: [
        { d: "2026-10-02", typ: "premiere" },
        { d: "2026-10-07" },
        { d: "2026-10-16" },
        { d: "2026-10-23" }
      ]
    },
    {
      key: "kleine-hexe",
      titel: "Die kleine Hexe",
      weitereFolgen: true,
      termine: [
        { d: "2027-01-15", unsicher: true },
        { d: "2027-01-16", unsicher: true }
      ]
    }
  ],

  /*
   * Abschlussvorsprechen. "zeit" bleibt leer, solange die Uhrzeit nicht
   * feststeht – dann zeigt die Seite "Uhrzeit folgt" statt einer erfundenen
   * Zeit.
   */
  avo: [
    { d: "2026-10-22", stadt: "Linz",       venue: "Anton Bruckner Universität",     zeit: "14:30 Uhr" },
    { d: "2026-10-30", stadt: "Regensburg", venue: "Akademietheater Regensburg",     zeit: "14 Uhr" },
    { d: "2026-11-02", stadt: "Köln",       venue: "Theater im Bauturm",             zeit: "14:30 Uhr" },
    { d: "2026-11-03", stadt: "Hamburg",    venue: "Hamburger Sprechwerk",           zeit: "14:30 Uhr" },
    { d: "2026-11-04", stadt: "Berlin",     venue: "Theaterhaus Berlin Schöneweide", zeit: "14:30 Uhr" },
    { d: "2026-11-05", stadt: "Dresden",    venue: "Zentralwerk",                    zeit: "14:30 Uhr" },
    { d: "2026-11-07", stadt: "München",    venue: "Mucca Halle",                    zeit: "14:30 Uhr" }
  ]
};
