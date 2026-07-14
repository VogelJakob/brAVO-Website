/*
 * Rendert eine Einzelprofilseite aus STUDENTS anhand von <main data-slug="...">.
 * Alle Felder sind optional: fehlende oder leere Felder werden ausgelassen,
 * Arrays generisch durchlaufen (keine festen Längen).
 * Medien (Video/Audio) erscheinen nur, wenn die Datei per Konvention existiert.
 */
(function () {
  "use strict";

  var main = document.querySelector("main[data-slug]");
  if (!main) return;
  var slug = main.getAttribute("data-slug");

  /* Existenz-Checks nur einmal ausführen und für Sprach-Rerenders cachen. */
  var media = { video: null, audio: null, audioReels: null, gallery: null, checked: false };

  function audioReelPath(file) {
    return ADK.root + "assets/audio/" + file;
  }

  /* Galerie-Konvention: {slug}-2.jpg bis {slug}-8.jpg neben dem Hauptportrait. */
  var GALLERY_MAX = 8;

  function galleryPath(n) {
    return ADK.root + "assets/images/students/" + slug + "-" + n + ".jpg";
  }

  function esc(s) { return ADK.esc(s); }
  function t(k) { return ADK.t(k); }
  function pick(v) { return ADK.pick(v); }

  function has(v) {
    if (v === null || v === undefined) return false;
    if (Array.isArray(v)) return v.length > 0;
    return String(v).trim() !== "";
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).map(function (p) { return p.charAt(0); }).slice(0, 3).join("");
  }

  function portraitHtml(student) {
    return (
      '<div class="portrait">' +
        '<img src="' + esc(ADK.mediaPath("image", slug)) + '" alt="' + esc(t("portraitAlt") + " " + student.name) + '" ' +
          'data-lightbox data-gallery="' + esc(slug) + '" tabindex="0" ' +
          'onerror="this.closest(\'.portrait\').classList.add(\'no-img\')">' +
        '<div class="media-fallback" aria-hidden="true">' + esc(initials(student.name)) + "</div>" +
      "</div>"
    );
  }

  /*
   * Zusatzbilder ({slug}-2.jpg …) als sichtbare Vorschauen direkt beim
   * Portrait. Portrait + Vorschauen teilen sich denselben data-gallery-Wert,
   * damit die Lightbox durch alle Bilder der Person blättern kann.
   */
  function headThumbsHtml(s) {
    if (!media.gallery || !media.gallery.length) return "";
    var items = media.gallery.map(function (src, i) {
      return (
        '<img src="' + esc(src) + '" alt="' + esc(t("portraitAlt") + " " + s.name + " – " + (i + 2)) + '" ' +
          'loading="lazy" data-lightbox data-gallery="' + esc(slug) + '" tabindex="0">'
      );
    }).join("");
    return '<div class="head-thumbs">' + items + "</div>";
  }

  /* Steckbrief als Definitionsliste; nur vorhandene Felder. */
  function factsHtml(s) {
    var rows = [
      ["pronouns", s.pronouns],
      ["born", s.born],
      ["locations", s.locations],
      ["playingAge", s.playingAge],
      ["height", s.height],
      ["hairColor", pick(s.hairColor)],
      ["eyeColor", pick(s.eyeColor)],
      ["voiceType", pick(s.voiceType)],
      ["languages", pick(s.languages)],
      ["skills", pick(s.skills)]
    ].filter(function (row) { return has(row[1]); });

    if (!rows.length) return "";

    var items = rows.map(function (row) {
      var value = row[1];
      var valueHtml = Array.isArray(value)
        ? '<ul class="fact-list">' + value.map(function (v) { return "<li>" + esc(v) + "</li>"; }).join("") + "</ul>"
        : esc(value);
      return "<dt>" + esc(t(row[0])) + "</dt><dd>" + valueHtml + "</dd>";
    }).join("");

    return section("steckbrief", '<dl class="facts">' + items + "</dl>");
  }

  function section(titleKey, inner) {
    return '<section class="profile-section"><h2>' + esc(t(titleKey)) + "</h2>" + inner + "</section>";
  }

  function bioHtml(s) {
    var bio = pick(s.bio);
    if (!has(bio)) return "";
    var paragraphs = String(bio).split(/\n\s*\n/).map(function (p) {
      return "<p>" + esc(p) + "</p>";
    }).join("");
    return section("bio", '<div class="bio">' + paragraphs + "</div>");
  }

  function rolesHtml(s) {
    if (!has(s.auditionRoles)) return "";
    var items = s.auditionRoles.map(function (r) {
      var parts = [];
      if (has(r.role)) parts.push('<span class="entry-lead">' + esc(r.role) + "</span>");
      if (has(r.play)) parts.push("<em>" + esc(r.play) + "</em>");
      if (has(r.author)) parts.push(esc(r.author));
      return '<li class="entry">' + parts.join('<span class="sep" aria-hidden="true"> · </span>') + "</li>";
    }).join("");
    return section("auditionRoles", '<ul class="entry-list">' + items + "</ul>");
  }

  function songsHtml(s) {
    if (!has(s.auditionSongs)) return "";
    var items = s.auditionSongs.map(function (song) {
      var parts = [];
      if (has(song.title)) parts.push('<span class="entry-lead">' + esc(song.title) + "</span>");
      if (has(song.from)) parts.push("<em>" + esc(song.from) + "</em>");
      return '<li class="entry">' + parts.join('<span class="sep" aria-hidden="true"> · </span>') + "</li>";
    }).join("");
    return section("auditionSongs", '<ul class="entry-list">' + items + "</ul>");
  }

  /*
   * Statische Credits-Liste. Bewusst ohne Hover-/Cursor-Verhalten (siehe CSS),
   * damit nichts fälschlich klickbar wirkt.
   */
  function creditGroup(titleKey, list) {
    if (!has(list)) return "";
    var items = list.map(function (c) {
      var head = [];
      if (has(c.production)) head.push('<span class="credit-production">' + esc(c.production) + "</span>");
      if (has(c.author)) head.push('<span class="credit-author">' + esc(t("byAuthor")) + " " + esc(c.author) + "</span>");

      var meta = [];
      if (has(c.director)) meta.push(esc(t("director")) + ": " + esc(c.director));
      if (has(c.venue)) meta.push(esc(c.venue));

      return (
        '<li class="credit">' +
          '<span class="credit-years">' + esc(c.years || "") + "</span>" +
          '<div class="credit-body">' +
            '<div class="credit-head">' + head.join(" ") + "</div>" +
            (has(c.role) ? '<div class="credit-role">' + esc(c.role) + "</div>" : "") +
            (meta.length ? '<div class="credit-meta">' + meta.join('<span class="sep" aria-hidden="true"> · </span>') + "</div>" : "") +
          "</div>" +
        "</li>"
      );
    }).join("");
    return '<h3>' + esc(t(titleKey)) + '</h3><ul class="credit-list">' + items + "</ul>";
  }

  function creditsHtml(s) {
    if (!s.credits) return "";
    var inner =
      creditGroup("theater", s.credits.theater) +
      creditGroup("film", s.credits.film) +
      creditGroup("other", s.credits.other);
    if (!inner) return "";
    return section("credits", inner);
  }

  /* Showreel: Player nur bei vorhandener Datei, sonst Hinweis. Audio: nur bei vorhandener Datei. */
  function mediaHtml(s) {
    var out = "";
    if (media.video) {
      /* preload="metadata" + #t=0.1: Browser zeigt den Videoanfang als Vorschaubild */
      out += section("showreel",
        '<video class="reel" controls preload="metadata" ' +
          'src="' + esc(ADK.mediaPath("video", slug)) + '#t=0.1">' +
          esc(t("videoFallback")) +
        "</video>");
    } else if (media.checked) {
      out += section("showreel", '<p class="muted">' + esc(t("showreelSoon")) + "</p>");
    }
    out += audioHtml(s);
    return out;
  }

  /*
   * Hörproben: entweder mehrere beschriftete Dateien (s.audioReels, nur
   * vorhandene Dateien werden gezeigt) oder die Einzeldatei-Konvention
   * {slug}.mp3. Beides kombinierbar; Einzeldatei erscheint zuerst.
   */
  function audioHtml(s) {
    var items = "";
    if (media.audio) {
      items +=
        '<div class="audio-item">' +
          '<audio class="reel-audio" controls preload="none" src="' + esc(ADK.mediaPath("audio", slug)) + '">' +
            esc(t("audioFallback")) +
          "</audio>" +
        "</div>";
    }
    if (has(s.audioReels) && media.audioReels) {
      s.audioReels.forEach(function (reel, i) {
        if (!media.audioReels[i]) return;
        items +=
          '<div class="audio-item">' +
            '<p class="audio-label">' + esc(pick(reel.label)) + "</p>" +
            '<audio class="reel-audio" controls preload="none" src="' + esc(audioReelPath(reel.file)) + '">' +
              esc(t("audioFallback")) +
            "</audio>" +
          "</div>";
      });
    }
    if (!items) return "";
    return section("audioReel", '<div class="audio-list">' + items + "</div>");
  }

  function contactLinks(s) {
    var links = [];
    if (has(s.email)) {
      links.push('<a class="contact-link" href="mailto:' + esc(s.email) + '">' + esc(s.email) + "</a>");
    }
    if (s.social && has(s.social.instagram)) {
      links.push('<a class="contact-link" href="https://www.instagram.com/' + esc(s.social.instagram) +
        '" target="_blank" rel="noopener noreferrer">Instagram: @' + esc(s.social.instagram) + "</a>");
    }
    if (s.social && has(s.social.filmmakers)) {
      links.push('<a class="contact-link" href="' + esc(s.social.filmmakers) +
        '" target="_blank" rel="noopener noreferrer">Filmmakers</a>');
    }
    if (s.social && has(s.social.etalenta)) {
      links.push('<a class="contact-link" href="' + esc(s.social.etalenta) +
        '" target="_blank" rel="noopener noreferrer">e-TALENTA</a>');
    }
    return links;
  }

  /* Kompakte Kontaktlinks direkt unter Portrait und Zusatzfotos */
  function contactSideHtml(s) {
    var links = contactLinks(s);
    if (!links.length) return "";
    return '<div class="contact-links contact-links-side">' + links.join("") + "</div>";
  }

  /* Vollständige Kontakt-Sektion am Seitenende (zusätzlich zur Seitenleiste) */
  function contactHtml(s) {
    var links = contactLinks(s);
    if (!links.length) return "";
    return section("contact", '<div class="contact-links">' + links.join("") + "</div>");
  }

  function placeholderHtml(s) {
    return (
      '<div class="profile-head">' +
        portraitHtml(s) +
        '<div class="profile-intro"><h1>' + esc(s.name) + "</h1>" +
          '<p class="coming-soon">' + esc(t("comingSoon")) + "</p>" +
          "<p class='muted'>" + esc(t("comingSoonText")) + "</p>" +
        "</div>" +
      "</div>"
    );
  }

  function render() {
    var s = ADK.findStudent(slug);
    if (!s) {
      main.innerHTML = "<h1>404</h1>";
      return;
    }

    if (s.placeholder) {
      main.innerHTML = placeholderHtml(s);
      return;
    }

    /*
     * Layout: Name über beiden Spalten; links Portrait, Zusatzfotos und
     * Kontakt (mobil direkt unter den Bildern), rechts alle Inhalte.
     * Auf breiten Bildschirmen stehen beide Spalten nebeneinander (CSS).
     */
    main.innerHTML =
      '<header class="profile-title">' +
        "<h1>" + esc(s.name) + "</h1>" +
        (has(s.pronouns) ? '<p class="pronouns">' + esc(s.pronouns) + "</p>" : "") +
      "</header>" +
      '<div class="profile-layout">' +
        '<aside class="profile-side">' +
          portraitHtml(s) +
          headThumbsHtml(s) +
          contactSideHtml(s) +
        "</aside>" +
        '<div class="profile-main">' +
          factsHtml(s) +
          bioHtml(s) +
          rolesHtml(s) +
          songsHtml(s) +
          mediaHtml(s) +
          creditsHtml(s) +
          contactHtml(s) +
        "</div>" +
      "</div>";
  }

  function checkMedia() {
    var s = ADK.findStudent(slug);
    var reels = (s && s.audioReels) || [];
    var galleryCandidates = [];
    for (var n = 2; n <= GALLERY_MAX; n++) galleryCandidates.push(galleryPath(n));
    Promise.all([
      ADK.mediaExists(ADK.mediaPath("video", slug)),
      ADK.mediaExists(ADK.mediaPath("audio", slug)),
      Promise.all(reels.map(function (reel) {
        return ADK.mediaExists(audioReelPath(reel.file));
      })),
      Promise.all(galleryCandidates.map(function (url) {
        return ADK.mediaExists(url);
      }))
    ]).then(function (results) {
      media.video = results[0];
      media.audio = results[1];
      media.audioReels = results[2];
      media.gallery = galleryCandidates.filter(function (url, i) { return results[3][i]; });
      media.checked = true;
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    var s = ADK.findStudent(slug);
    if (s && !s.placeholder) checkMedia();
  });
  document.addEventListener("adk:lang", render);
})();
