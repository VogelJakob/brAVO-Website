/*
 * AVO-Sektion der Startseite: Anmeldeformular (Formspree) und Trailer.
 *
 * Formspree-Setup (einmalig): kostenlosen Account auf https://formspree.io
 * anlegen, als Zieladresse adk.bayern27@gmail.com (Konstante ADK_MAIL)
 * eintragen und im Formular in index.html den Platzhalter "FORMSPREE_ID"
 * durch die echte Formular-ID ersetzen
 * (z.B. action="https://formspree.io/f/abcdwxyz").
 * Achtung: Der Empfänger wird bei Formspree im Account hinterlegt, nicht im
 * Markup – ADK_MAIL und die Formspree-Zieladresse müssen zusammenpassen.
 */
(function () {
  "use strict";

  /*
   * Zieladresse des Anmeldeformulars. Erscheint als Rückfall-Kontakt im
   * Fehlerhinweis des Formulars und muss identisch mit der im Formspree-
   * Account hinterlegten Empfängeradresse sein.
   * Die Linkseite links/index.html verlinkt bewusst auf das Formular
   * (index.html#anmeldung) statt auf diese Adresse.
   */
  var ADK_MAIL = "adk.bayern27@gmail.com";

  /* --- Anmeldeformular: per fetch absenden, Bestätigung inline anzeigen --- */
  function initForm() {
    var form = document.getElementById("avo-form");
    var status = document.getElementById("avo-form-status");
    if (!form || !status) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Fehlerfall: Hinweis mit klickbarem mailto-Fallback auf ADK_MAIL. */
      function fail() {
        status.hidden = false;
        status.classList.add("form-status-error");
        status.textContent = "";
        status.appendChild(document.createTextNode(
          "Senden hat leider nicht geklappt – bitte versucht es später erneut oder schreibt uns direkt an "
        ));
        var mail = document.createElement("a");
        mail.href = "mailto:" + ADK_MAIL + "?subject=AVO-Anmeldung";
        mail.textContent = ADK_MAIL;
        status.appendChild(mail);
        status.appendChild(document.createTextNode("."));
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
