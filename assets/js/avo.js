/*
 * AVO-Sektion der Startseite: Trailer.
 *
 * Das frühere Anmeldeformular (Versand an api/avo-anmeldung.php) ist nach
 * den Abschlussvorsprechen 2026 entfernt worden – Wiederherstellung siehe
 * README, Abschnitt „AVO-Anmeldeformular“.
 */
(function () {
  "use strict";

  /*
   * Trailer-Konvention: der Kasten steht in index.html auf "hidden" und
   * erscheint erst, wenn assets/videos/avo-trailer.mp4 wirklich vorliegt –
   * dann ersetzt der Videoplayer den Hinweistext (gleiches Muster wie die
   * Showreels auf den Profilseiten). Ein leerer Platzhalterkasten wuerde
   * sonst dem Spendenaufruf daneben die halbe Breite wegnehmen.
   * Alternative YouTube/Vimeo-Einbettung: statt des <video>-Elements ein
   * <iframe> einsetzen – dann aber die Datenschutzerklärung ergänzen!
   */
  function initTrailer() {
    var box = document.getElementById("avo-trailer");
    var soon = document.getElementById("avo-trailer-soon");
    if (!box || !soon) return;

    var src = ADK.asset(ADK.root + "assets/videos/avo-trailer.mp4");
    ADK.mediaExists(src).then(function (exists) {
      if (!exists) return;
      box.hidden = false;
      var video = document.createElement("video");
      video.className = "reel";
      video.controls = true;
      video.preload = "metadata";
      /* #t=0.1: Browser zeigt den Videoanfang als Vorschaubild */
      video.src = src + "#t=0.1";
      video.textContent = ADK.t("videoFallback");
      soon.replaceWith(video);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTrailer();
  });
})();
