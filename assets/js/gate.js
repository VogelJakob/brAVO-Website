/*
 * Vorübergehender Passwortschutz, bis die Seite offiziell veröffentlicht wird.
 * Wird in JEDEM <head> VOR dem Inhalt geladen und blendet die Seite aus, bis
 * das richtige Passwort eingegeben wurde (Freischaltung bleibt im Browser
 * gespeichert). Bewusst ohne besonderes Design.
 *
 * WICHTIG: Das ist ein Sichtschutz, keine echte Zugriffskontrolle – bei einer
 * statischen Seite (GitHub Pages) bleiben die Inhalte technisch abrufbar.
 * Zum Livegang: dieses Skript und seine <script>-Tags entfernen (siehe README).
 *
 * Passwort ändern: neuen Hash erzeugen mit
 *   node -e "console.log(require('crypto').createHash('sha256').update('NEUES-PASSWORT').digest('hex'))"
 * und unten in HASH eintragen.
 */
(function () {
  "use strict";

  var HASH = "f223f4b723b2dee53e7453529440f02ea3920b5332f90d2a8a6621ca6033303c";
  var KEY = "adk-gate";

  try {
    if (localStorage.getItem(KEY) === HASH) return;
  } catch (e) { /* privater Modus o.ä. – dann eben bei jedem Besuch fragen */ }

  /* Läuft im <head>: Inhalt verstecken, bevor er gerendert wird */
  var style = document.createElement("style");
  style.textContent =
    "body > :not(.gate) { display: none !important; }" +
    ".gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; }" +
    ".gate form { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; width: min(90vw, 20rem); }" +
    ".gate input, .gate button { font: inherit; padding: 0.6rem 0.8rem; }" +
    ".gate .gate-error { color: #a4161a; margin: 0; min-height: 1.5em; }";
  document.head.appendChild(style);

  function sha256Hex(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var gate = document.createElement("div");
    gate.className = "gate";
    gate.innerHTML =
      '<form>' +
        '<label for="gate-pw">Passwort</label>' +
        '<input id="gate-pw" type="password" autocomplete="current-password" autofocus>' +
        '<button type="submit">Weiter</button>' +
        '<p class="gate-error" aria-live="polite"></p>' +
      "</form>";
    document.body.appendChild(gate);

    var input = gate.querySelector("input");
    var error = gate.querySelector(".gate-error");

    gate.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      sha256Hex(input.value).then(function (hex) {
        if (hex === HASH) {
          try { localStorage.setItem(KEY, HASH); } catch (err) { /* s.o. */ }
          gate.remove();
          style.remove();
        } else {
          error.textContent = "Falsches Passwort.";
          input.select();
        }
      });
    });
  });
})();
