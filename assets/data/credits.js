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

  /* Beispiele – Pfade bleiben stehen, sobald die Namen bekannt sind:
  "assets/images/group.jpg": "Vorname Nachname",
  "assets/images/students/konstantin-kloppe-2.jpg": "Vorname Nachname",
  "assets/images/productions/hamlet.jpg": "Vorname Nachname",
  */
};
