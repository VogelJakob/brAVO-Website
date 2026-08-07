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

  /*
   * PLATZHALTER: Anmelde-Mailadresse (ADK). Erscheint im Fehlerhinweis des
   * Formulars und – als eigener Button – auf der Linkseite links/index.html.
   * Wird die Adresse geändert, beide Stellen anpassen.
   */
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

    var src = ADK.root + "assets/videos/avo-trailer.mp4";
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
    initForm();
    initTrailer();
  });
})();
