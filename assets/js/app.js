/*
 * Gemeinsame Logik: Sprachumschaltung (DE/EN), Medien-Konvention, Helfer.
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
      marquee: "Theater · Film · Fernsehen · Ab Sommer 2027 frei für Engagements · Theater · Film · Fernsehen · Ab Sommer 2027 frei für Engagements ·",
      ensemble: "Ensemble",
      toProfile: "Zum Profil",
      toOverview: "Zur Übersicht",
      imprint: "Impressum",
      privacy: "Datenschutz",
      steckbrief: "Steckbrief",
      pronouns: "Pronomen",
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
      footerNote: "Akademie für Darstellende Kunst Bayern · Abschlussjahrgang 2027",
      langToggle: "EN",
      langToggleAria: "Switch language to English"
    },
    en: {
      siteName: "ADK Bavaria · Class of 2027",
      heroKicker: "Academy of Performing Arts Bavaria",
      heroTitle1: "Class of",
      heroTitle2: "2027",
      heroText: "Ten acting students introduce themselves – with profile, résumé and showreel. Available for engagements in theatre, film and television from summer 2027.",
      marquee: "Theatre · Film · Television · Available for engagements from summer 2027 · Theatre · Film · Television · Available for engagements from summer 2027 ·",
      ensemble: "Ensemble",
      toProfile: "View profile",
      toOverview: "Back to overview",
      imprint: "Legal notice",
      privacy: "Privacy policy",
      steckbrief: "Profile",
      pronouns: "Pronouns",
      born: "Date of birth",
      locations: "Possible places of residence",
      playingAge: "Playing age",
      height: "Height",
      hairColor: "Hair colour",
      eyeColor: "Eye colour",
      voiceType: "Voice type",
      languages: "Languages",
      skills: "Special skills",
      bio: "Biography",
      auditionRoles: "Audition roles (selection)",
      auditionSongs: "Audition songs (selection)",
      credits: "Work",
      theater: "Theatre",
      film: "Film",
      other: "Other work",
      director: "Director",
      byAuthor: "by",
      showreel: "Showreel",
      showreelSoon: "The showreel will be added shortly.",
      audioReel: "Audio samples",
      contact: "Contact",
      email: "Email",
      comingSoon: "Content coming soon.",
      comingSoonText: "The full profile with facts, résumé and showreel is currently being prepared.",
      noscript: "Please enable JavaScript to view the profiles.",
      videoFallback: "Your browser does not support the video element.",
      audioFallback: "Your browser does not support the audio element.",
      portraitAlt: "Portrait of",
      groupAlt: "Group photo of the graduating class of 2027",
      skipLink: "Skip to content",
      footerNote: "Academy of Performing Arts Bavaria · Graduating class of 2027",
      langToggle: "DE",
      langToggleAria: "Sprache auf Deutsch umstellen"
    }
  };

  var STORAGE_KEY = "adk-lang";

  function storedLang() {
    try {
      var l = localStorage.getItem(STORAGE_KEY);
      return l === "en" || l === "de" ? l : "de";
    } catch (e) {
      return "de";
    }
  }

  var ADK = {
    // Relativer Pfad zur Projektwurzel (Profilseiten liegen in /students/)
    root: /\/students\//.test(location.pathname) ? "../" : "./",
    lang: storedLang(),

    t: function (key) {
      var dict = UI[this.lang] || UI.de;
      return dict[key] !== undefined ? dict[key] : (UI.de[key] !== undefined ? UI.de[key] : key);
    },

    /*
     * Löst ein mehrsprachiges Feld auf.
     * Akzeptiert Strings, Arrays oder { de: ..., en: ... }-Objekte.
     * Fällt auf Deutsch zurück, wenn die gewählte Sprache fehlt.
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

    setLang: function (lang) {
      this.lang = lang === "en" ? "en" : "de";
      try { localStorage.setItem(STORAGE_KEY, this.lang); } catch (e) { /* privater Modus o.ä. */ }
      document.documentElement.lang = this.lang;
      this.applyStatic();
      document.dispatchEvent(new CustomEvent("adk:lang"));
    },

    /* Statische Elemente mit data-i18n-Attribut übersetzen. */
    applyStatic: function () {
      var self = this;
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = self.t(el.getAttribute("data-i18n"));
      });
      document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
        el.setAttribute("alt", self.t(el.getAttribute("data-i18n-alt")));
      });
      var toggle = document.getElementById("lang-toggle");
      if (toggle) {
        toggle.textContent = this.t("langToggle");
        toggle.setAttribute("aria-label", this.t("langToggleAria"));
      }
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

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.lang = ADK.lang;
    ADK.applyStatic();
    var toggle = document.getElementById("lang-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        ADK.setLang(ADK.lang === "de" ? "en" : "de");
      });
    }
  });
})();
