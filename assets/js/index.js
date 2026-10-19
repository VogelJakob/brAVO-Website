/* Rendert das Ensemble-Grid der Startseite aus STUDENTS (generisch, beliebig viele Einträge). */
(function () {
  "use strict";

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map(function (part) { return part.charAt(0); })
      .slice(0, 3)
      .join("");
  }

  /* Anzeige alphabetisch nach Nachname (letzter Namensbestandteil);
     die Reihenfolge in students.js bleibt davon unberührt. */
  function nachname(s) {
    var parts = s.name.trim().split(/\s+/);
    return parts[parts.length - 1];
  }

  function render() {
    var grid = document.getElementById("ensemble-grid");
    if (!grid || typeof STUDENTS === "undefined") return;

    var sorted = STUDENTS.slice().sort(function (a, b) {
      return nachname(a).localeCompare(nachname(b), "de");
    });

    var html = sorted.map(function (s) {
      var img = ADK.mediaPath("image", s.slug);
      return (
        '<a class="card" href="students/' + ADK.esc(s.slug) + '.html">' +
          '<div class="card-media">' +
            ADK.imageHtml(img, {
              alt: s.name + " – " + ADK.t("portraitAlt"),
              /* 2 Spalten, ab 640px 3 (max. 72rem breit), ab 125rem 5 */
              sizes: "(min-width: 125rem) 20rem, (min-width: 72rem) 21rem, (min-width: 640px) 31vw, 50vw",
              onerror: "this.closest('.card-media').classList.add('no-img')"
            }) +
            '<div class="media-fallback" aria-hidden="true">' + ADK.esc(initials(s.name)) + "</div>" +
          "</div>" +
          '<div class="card-body">' +
            '<span class="card-name">' + ADK.esc(s.name) + "</span>" +
            '<span class="card-cta">' + ADK.esc(ADK.t("toProfile")) + "</span>" +
          "</div>" +
        "</a>"
      );
    }).join("");

    grid.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
