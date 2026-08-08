/*
 * Gemeinsame Logik: UI-Texte (nur Deutsch), Medien-Konvention, Helfer.
 * Keine JS-Animationen – nur Zustands-/Inhaltslogik. Übergänge macht CSS.
 */
(function () {
  "use strict";

  /* ---------- UI-Texte (Seiten-Chrome, nicht die Personen-Inhalte) ---------- */
  var UI = {
    de: {
      siteName: "ADK Bayern · Jahrgang 2027",
      heroKicker: "Akademie für Darstellende Kunst Bayern",
      heroTitle1: "Jahrgang",
      heroTitle2: "2027",
      heroText: "Zehn Schauspielstudierende stellen sich vor – mit Steckbrief, Vita und Showreel. Ab Sommer 2027 frei für Engagements an Theater, Film und Fernsehen.",
      ensemble: "Ensemble",
      productions: "Aufführungen",
      prodDateSoon: "Termine folgen",
      /* Termin-Texte: aus assets/data/termine.js zusammengesetzt (termine.js) */
      marqueeLead: "Vorsprechen",
      premiere: "Premiere",
      moreShows: "Weitere Vorstellungen",
      moreDatesSoon: "weitere Termine folgen …",
      allDatesSoon: "alle Termine folgen …",
      expected: "Voraussichtlich",
      timeSoon: "Uhrzeit folgt",
      creditPrefix: "© Foto: ",
      tickets: "Tickets",
      prodImageSoon: "Foto folgt",
      photos: "Fotos",
      lightboxClose: "Schließen",
      lightboxAria: "Vergrößerte Bildansicht",
      lightboxPrev: "Vorheriges Bild",
      lightboxNext: "Nächstes Bild",
      toProfile: "Zum Profil",
      toOverview: "Zur Übersicht",
      imprint: "Impressum",
      privacy: "Datenschutz",
      steckbrief: "Steckbrief",
      born: "Geburtsdatum",
      locations: "Wohnmöglichkeiten",
      playingAge: "Spielalter",
      height: "Größe",
      hairColor: "Haarfarbe",
      eyeColor: "Augenfarbe",
      voiceType: "Stimmlage",
      languages: "Sprachen",
      skills: "Besondere Fähigkeiten",
      bio: "Biografie",
      auditionRoles: "Vorsprechrollen (Auswahl)",
      auditionSongs: "Vorsprechlieder (Auswahl)",
      credits: "Arbeiten",
      theater: "Theater",
      film: "Film",
      other: "Weitere Arbeiten",
      director: "Regie",
      byAuthor: "von",
      showreel: "Showreel",
      showreelSoon: "Das Showreel folgt in Kürze.",
      audioReel: "Hörproben",
      contact: "Kontakt",
      email: "E-Mail",
      comingSoon: "Inhalte folgen in Kürze.",
      comingSoonText: "Das vollständige Profil mit Steckbrief, Vita und Showreel wird gerade vorbereitet.",
      noscript: "Bitte aktivieren Sie JavaScript, um die Profile anzuzeigen.",
      videoFallback: "Ihr Browser unterstützt das Video-Element nicht.",
      audioFallback: "Ihr Browser unterstützt das Audio-Element nicht.",
      portraitAlt: "Portrait von",
      groupAlt: "Gruppenfoto des Abschlussjahrgangs 2027",
      skipLink: "Zum Inhalt springen",
      footerNote: "Akademie für Darstellende Kunst Bayern · Abschlussjahrgang 2027"
    }
  };

  var ADK = {
    // Relativer Pfad zur Projektwurzel (Profilseiten liegen in /students/)
    root: /\/students\//.test(location.pathname) ? "../" : "./",
    lang: "de",

    t: function (key) {
      var dict = UI[this.lang] || UI.de;
      return dict[key] !== undefined ? dict[key] : (UI.de[key] !== undefined ? UI.de[key] : key);
    },

    /*
     * Löst ein Datenfeld auf. Akzeptiert Strings, Arrays oder
     * { de: ..., en: ... }-Objekte (Altbestand in students.js);
     * bei Objekten wird immer der deutsche Wert verwendet.
     */
    pick: function (value) {
      if (value === null || value === undefined) return null;
      if (typeof value === "object" && !Array.isArray(value) && ("de" in value || "en" in value)) {
        var v = value[this.lang];
        return v === undefined || v === null || v === "" ? value.de : v;
      }
      return value;
    },

    /* Medien-Konvention: Pfade ausschließlich aus dem Slug abgeleitet. */
    mediaPath: function (type, slug) {
      var map = {
        image: "assets/images/students/" + slug + ".jpg",
        video: "assets/videos/" + slug + ".mp4",
        audio: "assets/audio/" + slug + ".mp3"
      };
      return this.root + map[type];
    },

    /*
     * Prüft per HEAD-Request, ob eine Mediendatei existiert.
     * Funktioniert über HTTP(S) (lokaler Server, GitHub Pages, Netlify);
     * unter file:// schlägt fetch fehl -> Medium wird sauber ausgeblendet.
     */
    mediaExists: function (url) {
      return fetch(url, { method: "HEAD" })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; });
    },

    esc: function (s) {
      return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },

    /* Datum "JJJJ-MM-TT" -> { tag: "Sa", datum: "08.08.2026" } */
    datum: function (iso) {
      var p = String(iso).split("-");
      var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
      return {
        tag: d.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", ""),
        datum: p[2] + "." + p[1] + "." + p[0]
      };
    },

    /* ---------- Foto-Credits (assets/data/credits.js) ---------- */

    /* Text als CSS-String für content: … */
    cssString: function (s) {
      return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    },

    /*
     * Sucht den Credit zu einem Bildpfad: der längste passende Schlüssel aus
     * FOTO_CREDITS gewinnt, sonst greift "default". Rückgabe "" bedeutet:
     * bewusst kein Wasserzeichen.
     */
    credit: function (src) {
      if (typeof FOTO_CREDITS === "undefined") return null;
      var path = String(src || "").split(/[?#]/)[0];
      var best = null;
      Object.keys(FOTO_CREDITS).forEach(function (key) {
        if (key === "default") return;
        var end = path.length - key.length;
        if (end >= 0 && path.slice(end) === key && (best === null || key.length > best.length)) best = key;
      });
      var name = best === null ? FOTO_CREDITS.default : FOTO_CREDITS[best];
      return name === undefined || name === null ? null : name;
    },

    /*
     * Setzt --foto-credit passend zum jeweiligen Bild auf dem Container, der
     * das Wasserzeichen zeichnet (die ::after-Regeln in style.css lesen die
     * Variable). Nach jedem dynamischen Rendern aufrufen.
     */
    applyCredits: function (root) {
      var self = this;
      var scope = root || document;
      var sel = ".hero-photo, .group-band figure, .portrait, .prod-media";
      Array.prototype.forEach.call(scope.querySelectorAll(sel), function (box) {
        var img = box.querySelector("img");
        if (!img) return;
        self.setCredit(box, img.getAttribute("src"));
      });
    },

    setCredit: function (el, src) {
      var name = this.credit(src);
      if (name === null) return;
      el.style.setProperty("--foto-credit", name === "" ? "none" : this.cssString(this.t("creditPrefix") + name));
    },

    /* Statische Elemente mit data-i18n-Attribut aus dem UI-Wörterbuch befüllen. */
    applyStatic: function () {
      var self = this;
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = self.t(el.getAttribute("data-i18n"));
      });
      document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
        el.setAttribute("alt", self.t(el.getAttribute("data-i18n-alt")));
      });
    },

    findStudent: function (slug) {
      if (typeof STUDENTS === "undefined") return null;
      for (var i = 0; i < STUDENTS.length; i++) {
        if (STUDENTS[i].slug === slug) return STUDENTS[i];
      }
      return null;
    }
  };

  window.ADK = ADK;

  /*
   * Lightbox: jedes Bild mit [data-lightbox] öffnet sich per Klick/Enter
   * bildschirmfüllend. Bilder mit demselben data-gallery-Wert bilden eine
   * Galerie: Pfeil-Knöpfe bzw. Pfeiltasten blättern durch die Bilder.
   * Klick auf das große Bild zoomt auf Originalgröße (scrollbar).
   * Schließen über Klick auf den Hintergrund, Schließen-Knopf oder Escape.
   */
  function openLightbox(img) {
    var galleryId = img.getAttribute("data-gallery");
    var group = [img];
    if (galleryId) {
      group = Array.prototype.filter.call(
        document.querySelectorAll("img[data-lightbox]"),
        function (el) { return el.getAttribute("data-gallery") === galleryId; }
      );
    }
    var index = group.indexOf(img);
    if (index === -1) { group = [img]; index = 0; }

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", ADK.t("lightboxAria"));

    var big = document.createElement("img");

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox-close";
    close.textContent = ADK.t("lightboxClose");

    overlay.appendChild(big);
    overlay.appendChild(close);

    function navButton(cls, glyph, label, dir) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lightbox-nav " + cls;
      b.textContent = glyph;
      b.setAttribute("aria-label", label);
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        show(index + dir);
      });
      return b;
    }

    /*
     * Fußzeile unten mittig: Bildzähler als erste Zeile, darunter der
     * Foto-Credit (den zeichnet ::after aus style.css). Beide stehen im
     * normalen Fluss einer Spalte, der Container wächst also mit – ein
     * zweizeiliger Credit kann den Zähler nicht mehr überdecken.
     */
    var footer = document.createElement("div");
    footer.className = "lightbox-footer";
    overlay.appendChild(footer);

    var count = null;
    if (group.length > 1) {
      overlay.appendChild(navButton("lightbox-prev", "‹", ADK.t("lightboxPrev"), -1));
      overlay.appendChild(navButton("lightbox-next", "›", ADK.t("lightboxNext"), 1));
      count = document.createElement("span");
      count.className = "lightbox-count";
      count.setAttribute("aria-hidden", "true");
      footer.appendChild(count);
    }

    function show(i) {
      index = (i + group.length) % group.length;
      overlay.classList.remove("zoomed");
      big.src = group[index].currentSrc || group[index].src;
      big.alt = group[index].alt || "";
      /* Wasserzeichen der Großansicht: Credit des gerade gezeigten Bildes */
      ADK.setCredit(overlay, group[index].getAttribute("src"));
      if (count) count.textContent = (index + 1) + " / " + group.length;
    }

    /* Klick aufs Bild: zwischen Einpassen und Originalgröße wechseln */
    big.addEventListener("click", function (e) {
      e.stopPropagation();
      if (overlay.classList.toggle("zoomed")) {
        overlay.scrollLeft = (overlay.scrollWidth - overlay.clientWidth) / 2;
        overlay.scrollTop = (overlay.scrollHeight - overlay.clientHeight) / 2;
      }
    });

    function destroy() {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      group[index].focus();
    }
    function onKey(e) {
      if (e.key === "Escape") destroy();
      else if (e.key === "ArrowLeft" && group.length > 1) show(index - 1);
      else if (e.key === "ArrowRight" && group.length > 1) show(index + 1);
    }
    overlay.addEventListener("click", destroy);
    document.addEventListener("keydown", onKey);
    show(index);
    document.body.appendChild(overlay);
    close.focus();
  }

  document.addEventListener("click", function (e) {
    var img = e.target.closest ? e.target.closest("img[data-lightbox]") : null;
    if (img) openLightbox(img);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var el = document.activeElement;
    if (el && el.matches && el.matches("img[data-lightbox]")) openLightbox(el);
  });

  document.addEventListener("DOMContentLoaded", function () {
    ADK.applyStatic();
    /* Standard-Credit global setzen, danach die einzelnen Bilder überschreiben */
    if (typeof FOTO_CREDITS !== "undefined" && FOTO_CREDITS.default) {
      document.documentElement.style.setProperty(
        "--foto-credit", ADK.cssString(ADK.t("creditPrefix") + FOTO_CREDITS.default)
      );
    }
    ADK.applyCredits();
  });
})();
