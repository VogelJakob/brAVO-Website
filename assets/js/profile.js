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
    return ADK.asset(ADK.root + "assets/audio/" + file);
  }

  /* Galerie-Konvention: {slug}-2.jpg bis {slug}-8.jpg neben dem Hauptportrait. */
  var GALLERY_MAX = 8;

  function galleryPath(n) {
    return ADK.asset(ADK.root + "assets/images/students/" + slug + "-" + n + ".jpg");
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
        /* Hauptbild der Profilseite: sofort laden (kein Lazy-Loading) */
        ADK.imageHtml(ADK.mediaPath("image", slug), {
          alt: t("portraitAlt") + " " + student.name,
          sizes: "(max-width: 22rem) 100vw, 19rem",
          eager: true,
          extra: 'data-lightbox data-gallery="' + esc(slug) + '" tabindex="0"',
          onerror: "this.closest('.portrait').classList.add('no-img')"
        }) +
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
      return ADK.imageHtml(src, {
        alt: t("portraitAlt") + " " + s.name + " – " + (i + 2),
        sizes: "88px",   /* .head-thumbs img: 5.5rem */
        extra: 'data-lightbox data-gallery="' + esc(slug) + '" tabindex="0"'
      });
    }).join("");
    return '<div class="head-thumbs">' + items + "</div>";
  }

  /* Steckbrief als Definitionsliste; nur vorhandene Felder. */
  function factsHtml(s) {
    var rows = [
      ["born", s.born],
      ["locations", s.locations],
      ["playingAge", s.playingAge],
      ["height", s.height],
      ["hairColor", pick(s.hairColor)],
      ["eyeColor", pick(s.eyeColor)],
      ["voiceType", pick(s.voiceType)],
      ["languages", pick(s.languages)],
      ["skills", pick(s.skills)],
      /* Formale Qualifikationen (Abschlüsse, Zertifikate, Lizenzen) – bewusst
         getrennt von den praktischen "Besonderen Fähigkeiten" darüber.
         Fehlt das Feld, entfällt die Zeile durch den has()-Filter komplett. */
      ["qualifications", pick(s.qualifications)]
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
      /* Autorenangaben wie „nach Georg Büchner" bringen ihre Präposition schon mit –
         dann kein zusätzliches „von" davorsetzen. */
      if (has(c.author)) {
        var lead = /^nach\s/i.test(String(c.author)) ? "" : esc(t("byAuthor")) + " ";
        head.push('<span class="credit-author">' + lead + esc(c.author) + "</span>");
      }

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

  /* Showreel und Audio: nur bei vorhandener Datei – sonst entfällt der Abschnitt ganz. */
  function mediaHtml(s) {
    var out = "";
    if (media.video) {
      /* preload="metadata" + #t=0.1: Browser zeigt den Videoanfang als Vorschaubild */
      out += section("showreel",
        '<video class="reel" controls preload="metadata" ' +
          'src="' + esc(ADK.mediaPath("video", slug)) + '#t=0.1">' +
          esc(t("videoFallback")) +
        "</video>");
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

  /*
   * LINK-ICONS – zentrale Zuordnung Domain → Icon (einzige Stelle zum Pflegen).
   * Die Plattform wird automatisch an der Domain der URL erkannt, die Daten
   * in students.js bleiben unverändert. Marken-Icons: Simple Icons
   * (simpleicons.org, CC0), Pfade 1:1 übernommen. Plattformen ohne Simple-Icons-
   * Logo (z. B. Casting-Plattformen) bekommen bewusst ein neutrales Icon.
   *
   * PLATTFORM ERGÄNZEN: Eintrag in LINK_PLATFORMS anlegen –
   *   { domains: ["beispiel.de"], icon: "globe" }       (neutrales Icon) oder
   *   { domains: ["beispiel.com"], icon: "beispiel" }   und in LINK_ICONS
   *   beispiel: '<path d="…"/>' (Pfad aus simpleicons.org, viewBox 0 0 24 24).
   * Subdomains (z. B. m.youtube.com) werden automatisch mit erkannt.
   * Unbekannte Domains → "link", mailto: → "mail".
   */
  var LINK_ICONS = {
    /* Simple Icons (CC0), gefüllt */
    instagram: '<path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
    youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
    vimeo: '<path d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457a315.06 315.06 0 003.501-3.1279c1.579-1.368 2.765-2.085 3.5539-2.159 1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.5069.5389 2.45 1.1309 3.674 1.7759 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.8679 3.434-5.7568 6.7619-5.6368 2.4729.06 3.6279 1.664 3.4929 4.7969z"/>',
    spotify: '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>',
    tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
    imdb: '<path d="M22.3781 0H1.6218C.7411.0583.0587.7437.0018 1.5953l-.001 20.783c.0585.8761.7125 1.543 1.5559 1.6191A.337.337 0 0 0 1.6016 24h20.7971a.4579.4579 0 0 0 .0437-.002c.8727-.0768 1.5568-.8271 1.5568-1.7085V1.7098c0-.8914-.696-1.6416-1.584-1.7078A.3294.3294 0 0 0 22.3781 0zm0 .496a1.2144 1.2144 0 0 1 1.1252 1.2139v20.5797c0 .6377-.4875 1.1602-1.1045 1.2145H1.6016c-.5967-.0543-1.0645-.5297-1.1053-1.1258V1.6284C.5371 1.0185 1.0184.5364 1.6217.496h20.7564zM4.7954 8.2603v7.3636H2.8899V8.2603h1.9055zm6.5367 0v7.3636H9.6707v-4.9704l-.6711 4.9704H7.813l-.6986-4.8618-.0066 4.8618h-1.668V8.2603h2.468c.0748.4476.1492.9694.2307 1.5734l.2712 1.8713.4407-3.4447h2.4817zm2.9772 1.3289c.0742.0404.122.108.1417.2034.0279.0953.0345.3118.0345.6442v2.8548c0 .4881-.0345.7867-.0955.8954-.0609.1152-.2304.1695-.5018.1695V9.5211c.204 0 .3457.0205.4211.0681zm-.0211 6.0347c.4543 0 .8006-.0265 1.0245-.0742.2304-.0477.4204-.1357.5694-.2648.1556-.1218.2642-.298.3251-.5219.0611-.2238.1021-.6648.1021-1.3224v-2.5832c0-.6986-.0271-1.1668-.0742-1.4039-.041-.237-.1431-.4543-.3126-.6437-.1695-.1973-.4198-.3324-.7456-.421-.3191-.0808-.8542-.1285-1.7694-.1285h-1.4244v7.3636h2.3051zm5.14-1.7827c0 .3523-.0199.5762-.0544.6708-.033.0947-.1894.1424-.3046.1424-.1086 0-.19-.0477-.2238-.1351-.041-.0887-.0609-.2986-.0609-.6238v-1.9469c0-.3324.0199-.5423.0543-.6237.0338-.0808.1086-.122.2171-.122.1153 0 .2709.0412.3114.1425.041.0947.0609.2986.0609.6032v1.8926zm-2.4747-5.5809v7.3636h1.7157l.1152-.4675c.1556.1894.3251.3324.5152.4271.1828.0881.4608.1357.678.1357.3047 0 .5629-.0748.7802-.237.2165-.1562.3589-.3462.4198-.5628.0543-.2173.0887-.543.0887-.9841v-2.0675c0-.4409-.0139-.7324-.0344-.8681-.0199-.1357-.0742-.2781-.1695-.4204-.1021-.1425-.2437-.251-.4272-.3325-.1834-.0742-.3999-.1152-.6576-.1152-.2172 0-.4952.0477-.6846.1285-.1835.0887-.353.2238-.5086.4007V8.2603h-1.8309z"/>',
    facebook: '<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>',
    /* Neutrale Icons (Kontur) für Plattformen ohne freies Logo */
    globe: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"/></g>',
    link: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></g>',
    mail: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></g>'
  };

  var LINK_PLATFORMS = [
    { domains: ["instagram.com"], icon: "instagram" },
    { domains: ["youtube.com", "youtu.be"], icon: "youtube" },
    { domains: ["vimeo.com"], icon: "vimeo" },
    { domains: ["spotify.com"], icon: "spotify" },
    { domains: ["tiktok.com"], icon: "tiktok" },
    { domains: ["imdb.com"], icon: "imdb" },
    { domains: ["facebook.com", "fb.com"], icon: "facebook" },
    /* Kein Logo in Simple Icons → neutrales Globus-Symbol */
    { domains: ["linkedin.com"], icon: "globe" },
    { domains: ["filmmakers.eu", "filmmakers.de"], icon: "globe" },
    { domains: ["etalenta.eu", "e-talenta.eu"], icon: "globe" },
    { domains: ["theapolis.de"], icon: "globe" }
  ];

  function linkIconName(href) {
    if (/^mailto:/i.test(href)) return "mail";
    var m = /^[a-z][a-z0-9+.-]*:\/\/([^\/?#:]+)/i.exec(href);
    if (!m) return "link";
    var host = m[1].toLowerCase();
    for (var i = 0; i < LINK_PLATFORMS.length; i++) {
      var domains = LINK_PLATFORMS[i].domains;
      for (var j = 0; j < domains.length; j++) {
        var d = domains[j];
        if (host === d || host.slice(-(d.length + 1)) === "." + d) return LINK_PLATFORMS[i].icon;
      }
    }
    return "link";
  }

  function linkIcon(href) {
    return '<svg class="link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
      LINK_ICONS[linkIconName(href)] + "</svg>";
  }

  /* href und text werden roh übergeben und hier escaped. */
  function contactLink(href, text, external) {
    return '<a class="contact-link" href="' + esc(href) + '"' +
      (external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
      linkIcon(href) + '<span class="contact-link-text">' + esc(text) + "</span></a>";
  }

  function contactLinks(s) {
    var links = [];
    if (has(s.email)) {
      links.push(contactLink("mailto:" + s.email, s.email, false));
    }
    if (s.social && has(s.social.instagram)) {
      links.push(contactLink("https://www.instagram.com/" + s.social.instagram, "Instagram: @" + s.social.instagram, true));
    }
    if (s.social && has(s.social.filmmakers)) {
      links.push(contactLink(s.social.filmmakers, "Filmmakers", true));
    }
    if (s.social && has(s.social.etalenta)) {
      links.push(contactLink(s.social.etalenta, "e-TALENTA", true));
    }
    if (s.social && has(s.social.theapolis)) {
      links.push(contactLink(s.social.theapolis, "Theapolis", true));
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

  /* Pronomen als dezenter Untertitel direkt unter dem Namen (nur im Profil). */
  function pronounsHtml(s) {
    if (!has(s.pronouns)) return "";
    return '<p class="profile-pronouns">' + esc(s.pronouns) + "</p>";
  }

  function placeholderHtml(s) {
    return (
      '<div class="profile-head">' +
        portraitHtml(s) +
        '<div class="profile-intro"><h1>' + esc(s.name) + "</h1>" +
          pronounsHtml(s) +
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
        pronounsHtml(s) +
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

    /* Foto-Credits (assets/data/credits.js) auf die frisch gerenderten Bilder */
    ADK.applyCredits(main);
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
})();
