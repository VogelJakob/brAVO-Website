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

  function render() {
    var grid = document.getElementById("ensemble-grid");
    if (!grid || typeof STUDENTS === "undefined") return;

    var html = STUDENTS.map(function (s) {
      var img = ADK.mediaPath("image", s.slug);
      return (
        '<a class="card" href="students/' + ADK.esc(s.slug) + '.html">' +
          '<div class="card-media">' +
            '<img src="' + ADK.esc(img) + '" alt="' + ADK.esc(ADK.t("portraitAlt") + " " + s.name) + '" loading="lazy" ' +
              'onerror="this.closest(\'.card-media\').classList.add(\'no-img\')">' +
            '<div class="media-fallback" aria-hidden="true">' + ADK.esc(initials(s.name)) + "</div>" +
          "</div>" +
          '<span class="card-name">' + ADK.esc(s.name) + "</span>" +
          '<span class="card-cta">' + ADK.esc(ADK.t("toProfile")) + "</span>" +
        "</a>"
      );
    }).join("");

    grid.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("adk:lang", render);
})();
