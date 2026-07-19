/*
 * AVO-Sektion der Startseite: Anmeldeformular (Formspree) und Trailer.
 *
 * Formspree-Setup (einmalig): kostenlosen Account auf https://formspree.io
 * anlegen, als Zieladresse die ADK-Mail eintragen und im Formular in
 * index.html den Platzhalter "FORMSPREE_ID" durch die echte Formular-ID
 * ersetzen (z.B. action="https://formspree.io/f/abcdwxyz").
 */
(function () {
  "use strict";

  /* PLATZHALTER: ADK-Mailadresse für den Fehlerhinweis im Formular */
  var ADK_MAIL = "avo@adk-bayern.de";

  /* --- Anmeldeformular: per fetch absenden, Bestätigung inline anzeigen --- */
  function initForm() {
    var form = document.getElementById("avo-form");
    var status = document.getElementById("avo-form-status");
    if (!form || !status) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      function fail() {
        status.hidden = false;
        status.classList.add("form-status-error");
        status.textContent = "Senden hat leider nicht geklappt – bitte versucht es später erneut oder schreibt uns direkt an " + ADK_MAIL + ".";
      }

      status.hidden = false;
      status.classList.remove("form-status-error");
      status.textContent = "Wird gesendet …";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (r) {
        if (r.ok) {
          form.reset();
          status.textContent = "Danke! Eure Anzahl wurde aufgenommen – wir freuen uns auf euch.";
        } else {
          fail();
        }
      }).catch(fail);
    });
  }

  /*
   * Trailer-Konvention: sobald assets/videos/avo-trailer.mp4 vorliegt,
   * wird der Hinweistext durch den Videoplayer ersetzt (gleiches Muster
   * wie die Showreels auf den Profilseiten).
   * Alternative YouTube/Vimeo-Einbettung: statt des <video>-Elements ein
   * <iframe> einsetzen – dann aber die Datenschutzerklärung ergänzen!
   */
  function initTrailer() {
    var box = document.getElementById("avo-trailer");
    var soon = document.getElementById("avo-trailer-soon");
    if (!box || !soon) return;

    var src = ADK.root + "assets/videos/avo-trailer.mp4";
    ADK.mediaExists(src).then(function (exists) {
      if (!exists) return;
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
    initForm();
    initTrailer();
  });
})();
