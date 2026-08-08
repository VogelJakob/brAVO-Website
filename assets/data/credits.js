/*
 * FOTO-CREDITS – wer hat welches Bild gemacht.
 *
 * Der Name erscheint als Wasserzeichen unten rechts auf dem Foto und in der
 * Lightbox-Großansicht. Zugeordnet wird über den Bildpfad; es genügt das
 * Ende des Pfads, so wie es in assets/ liegt.
 *
 * ARBEITSSCHRITT beim Ablegen neuer Fotos: Die Leute liefern ihre Bilder mit
 * den Credits IM DATEINAMEN. Beim Umbenennen auf die Namenskonvention
 * ({slug}.jpg, {slug}-2.jpg, hamlet-3.jpg …) den Namen aus dem alten
 * Dateinamen hier als eine Zeile eintragen.
 *
 * Kein Eintrag = "default" wird verwendet. Ein leerer String ("") blendet das
 * Wasserzeichen für dieses Bild komplett aus.
 */
const FOTO_CREDITS = {
  /* Fällt für alle Bilder ohne eigenen Eintrag ein. */
  default: "ADK Bayern Jahrgang 2027",

  /* Gruppenfotos */
  "assets/images/group.jpg": "Laukart Photography",
  "assets/images/group-2.jpg": "Laukart Photography",

  /* Aufführung „Hamlet“ */
  "assets/images/productions/hamlet.jpg": "Konstantin Kloppe",

  /* Aufführung „Die kleine Hexe“ */
  "assets/images/productions/kleine-hexe.jpg": "Werner Hofbauer",
  "assets/images/productions/kleine-hexe-2.jpg": "Werner Hofbauer",
  "assets/images/productions/kleine-hexe-3.jpg": "Werner Hofbauer",
  "assets/images/productions/kleine-hexe-4.jpg": "Werner Hofbauer",
  "assets/images/productions/kleine-hexe-5.jpg": "Werner Hofbauer",
  "assets/images/productions/kleine-hexe-6.jpg": "Werner Hofbauer",

  /* Cedric Corazza */
  "assets/images/students/cedric-corazza.jpg": "Laukart Photography",
  "assets/images/students/cedric-corazza-2.jpg": "Jan Louis Trummer",
  "assets/images/students/cedric-corazza-3.jpg": "Jan Louis Trummer",

  /* Charlotte Friederich – alle Bilder */
  "assets/images/students/charlotte-friederich.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-2.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-3.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-4.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-5.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-6.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-7.jpg": "Salome Ridder",
  "assets/images/students/charlotte-friederich-8.jpg": "Salome Ridder",

  /* Charlotte Grünewald */
  "assets/images/students/charlotte-gruenewald.jpg": "Alexander Schank",
  "assets/images/students/charlotte-gruenewald-2.jpg": "Alexander Schank",
  "assets/images/students/charlotte-gruenewald-3.jpg": "Konstantin Kloppe",
  "assets/images/students/charlotte-gruenewald-3.jpeg": "Konstantin Kloppe",
  "assets/images/students/charlotte-gruenewald-4.jpg": "Laukart Photography",
  "assets/images/students/charlotte-gruenewald-5.jpg": "Konstantin Kloppe",

  /* Konstantin Dimitrios Kloppe */
  "assets/images/students/konstantin-kloppe.jpg": "Laukart Photography",
  "assets/images/students/konstantin-kloppe-2.jpg": "Ferdinand Putz",
  "assets/images/students/konstantin-kloppe-3.jpg": "Salome Ridder",

  /* Linda Lehmann */
  "assets/images/students/linda-lehmann.jpg": "Alexander Schank",
  "assets/images/students/linda-lehmann-2.jpg": "Alexander Schank",
  "assets/images/students/linda-lehmann-3.jpg": "Alexander Schank",
  "assets/images/students/linda-lehmann-4.jpg": "Alexander Schank",

  /* Bianca Pitschedell */
  "assets/images/students/bianca-pitschedell.jpg": "Laukart Photography",
  "assets/images/students/bianca-pitschedell-2.jpg": "Konstantin Kloppe",
  "assets/images/students/bianca-pitschedell-3.jpg": "Saskia Wagner",

  /* Salome Ridder – alle Bilder */
  "assets/images/students/salome-ridder.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-2.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-3.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-4.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-5.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-6.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-7.jpg": "Oliver Look",
  "assets/images/students/salome-ridder-8.jpg": "Oliver Look",

  /* Karl-Georg Rößler */
  "assets/images/students/karl-georg-roessler.jpg": "Laukart Photography",
  "assets/images/students/karl-georg-roessler-2.jpg": "Werner Hofbauer",
  "assets/images/students/karl-georg-roessler-3.jpg": "Werner Hofbauer",

  /* Michelle Thielsch */
  "assets/images/students/michelle-thielsch.jpg": "Laukart Photography",
  "assets/images/students/michelle-thielsch-2.jpg": "Christine la Renard",
  "assets/images/students/michelle-thielsch-3.jpg": "Laukart Photography",
  "assets/images/students/michelle-thielsch-4.jpg": "Manuerl",

  /* Rosalie Daria Zwenzner */
  "assets/images/students/rosalie-zwenzner.jpg": "Einbrandfoto",
  "assets/images/students/rosalie-zwenzner-2.jpg": "Einbrandfoto",
  "assets/images/students/rosalie-zwenzner-3.jpg": "Einbrandfoto",
  "assets/images/students/rosalie-zwenzner-4.jpg": "Einbrandfoto",
  "assets/images/students/rosalie-zwenzner-5.jpg": "Einbrandfoto",
};
