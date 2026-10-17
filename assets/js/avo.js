/*
 * AVO-Sektion der Startseite: Anmeldeformular und Trailer.
 *
 * Das Formular in index.html postet per fetch an den eigenen PHP-Endpunkt
 * api/avo-anmeldung.php (action-Attribut), der die Anmeldung per SMTP
 * verschickt. Die Empfängeradresse steht nur in der Server-Konfiguration
 * /config/avo-anmeldung-mail.php (siehe README), nicht im Repo.
 */
(function () {
  "use strict";

  /*
   * Rückfall-Kontakt im Fehlerhinweis des Formulars (mailto-Link).
   * Die Linkseite links/index.html verlinkt bewusst auf das Formular
   * (index.html#anmeldung) statt auf diese Adresse.
   */
  var ADK_MAIL = "adk.bayern27@gmail.com";

  /* --- Anmeldeformular: per fetch absenden, Bestätigung inline anzeigen --- */
  function initForm() {
    var form = document.getElementById("avo-form");
    var status = document.getElementById("avo-form-status");
    if (!form || !status) return;
    var button = form.querySelector('button[type="submit"]');
    var sending = false;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      /* Gegen Doppelversand: während des Sendens keine zweite Anfrage */
      if (sending) return;

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
      sending = true;
      if (button) button.disabled = true;

      /* Antwort des Endpunkts: { ok: true } bzw. { ok: false, message } */
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (r) {
        return r.json().catch(function () { return { ok: false }; }).then(function (data) {
          if (r.ok && data && data.ok === true) {
            form.reset();
            status.textContent = "Danke! Eure Anzahl wurde aufgenommen – wir freuen uns auf euch.";
          } else {
            fail();
          }
        });
      }).catch(fail).then(function () {
        sending = false;
        if (button) button.disabled = false;
      });
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
    initForm();
    initTrailer();
  });
})();
