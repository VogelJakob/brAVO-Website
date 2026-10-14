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
      ensemble: "Ensemble",
      productions: "Aufführungen",
      prodDateSoon: "Termine folgen",
      /* Termin-Texte: aus assets/data/termine.js zusammengesetzt (termine.js) */
      marqueeLead: "Vorsprechen",
      premiere: "Premiere",
      moreShows: "Weitere Vorstellungen",
      shows: "Vorstellungen",
      moreDatesSoon: "weitere Termine folgen …",
      allDatesSoon: "alle Termine folgen …",
      expected: "Voraussichtlich",
      timeSoon: "Uhrzeit folgt",
      eachAt: "jeweils",
      oClock: "Uhr",
      cast: "Es spielen",
      creditPrefix: "© Foto: ",
      tickets: "Tickets",
      prodImageSoon: "Foto folgt",
      photos: "Fotos",
      lightboxClose: "Schließen",
      lightboxAria: "Vergrößerte Bildansicht",
      lightboxPrev: "Vorheriges Bild",
      lightboxNext: "Nächstes Bild",
      lightboxLoading: "Lädt …",
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
      qualifications: "Zusatzqualifikationen",
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

  /*
   * Cache-Busting (siehe CACHE.md): Die Versionskennung wird aus dem
   * ?v=…-Parameter gelesen, mit dem die HTML-Seite app.js einbindet.
   * So steht sie nur in den HTML-Dateien und muss hier nie angepasst werden.
   */
  var VERSION = (function () {
    var el = document.currentScript;
    var m = el && el.src ? el.src.match(/[?&]v=([^&#]+)/) : null;
    return m ? decodeURIComponent(m[1]) : "";
  })();

  var ADK = {
    // Relativer Pfad zur Projektwurzel (Profilseiten liegen in /students/)
    root: /\/students\//.test(location.pathname) ? "../" : "./",
    lang: "de",
    version: VERSION,

    /* Hängt die Versionskennung an eine eigene Datei-URL an (Bilder, Audio, Video). */
    asset: function (url) {
      if (!this.version) return url;
      return url + (url.indexOf("?") === -1 ? "?" : "&") + "v=" + encodeURIComponent(this.version);
    },

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
      return this.asset(this.root + map[type]);
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

    /* ---------- Bildfassungen (assets/data/image-sizes.js) ----------
     * Neben jedem Original liegen verkleinerte Fassungen in w600/, w1200/
     * und w2000/ (Zahl = längste Kante, erzeugt von tools/build-images.py).
     * Welche Stufen es gibt und wie groß das Original ist, steht in
     * IMAGE_SIZES. Bilder ohne Eintrag werden wie bisher als Original geladen.
     */
    /* Eintrag { w, h, s } zu einem Bildpfad (mit/ohne ?v=), sonst null */
    imageInfo: function (url) {
      if (typeof IMAGE_SIZES === "undefined") return null;
      var path = String(url || "").split(/[?#]/)[0];
      var i = path.indexOf("assets/images/");
      return i === -1 ? null : IMAGE_SIZES[path.slice(i + 14)] || null;
    },

    /* …/students/name.jpg -> …/students/w1200/name.jpg (mit Versionskennung) */
    variantUrl: function (url, level) {
      var path = String(url).split(/[?#]/)[0];
      var cut = path.lastIndexOf("/") + 1;
      return this.asset(path.slice(0, cut) + "w" + level + "/" + path.slice(cut));
    },

    /* Pixelbreite einer Stufe (gleiche Rundung wie tools/build-images.py) */
    levelWidth: function (info, level) {
      return Math.max(1, Math.floor(info.w * level / Math.max(info.w, info.h) + 0.5));
    },

    /*
     * Attribute eines Seitenbildes: srcset aus den vorhandenen Fassungen plus
     * Original als größter Stufe, src auf w1200 (falls vorhanden), Maße gegen
     * Layout-Sprünge. o.sizes: Darstellungsbreite je Einsatzort;
     * o.eager: erstes sichtbares Bild (kein Lazy-Loading, hohe Priorität).
     * Reihenfolge bewusst: loading/srcset vor src (beim Setzen per DOM).
     */
    imageAttrs: function (url, o) {
      o = o || {};
      var self = this;
      var orig = this.asset(String(url).split(/[?#]/)[0]);
      var info = this.imageInfo(url);
      var src = orig;
      var a = {};
      if (o.eager) a.fetchpriority = "high";
      else { a.loading = "lazy"; a.decoding = "async"; }
      if (info) {
        a.width = info.w;
        a.height = info.h;
        if (info.s.length) {
          a.sizes = o.sizes || "100vw";
          a.srcset = info.s.map(function (lv) {
            return self.variantUrl(url, lv) + " " + self.levelWidth(info, lv) + "w";
          }).concat(orig + " " + info.w + "w").join(", ");
          if (info.s.indexOf(1200) !== -1) src = this.variantUrl(url, 1200);
        }
      }
      a["data-orig"] = orig;
      a.src = src;
      return a;
    },

    /*
     * <img>-HTML mit srcset & Co. o.alt: Alternativtext; o.extra: weitere
     * Attribute als fertiger HTML-Text; o.onerror: Anweisung für den Fall,
     * dass auch das Original nicht lädt (z. B. Initialen-Fallback).
     */
    imageHtml: function (url, o) {
      o = o || {};
      var self = this;
      var a = this.imageAttrs(url, o);
      var html = '<img alt="' + this.esc(o.alt || "") + '"';
      Object.keys(a).forEach(function (k) { html += " " + k + '="' + self.esc(a[k]) + '"'; });
      html += ' onerror="' + this.esc("if(!ADK.imgFallback(this)){" + (o.onerror || "") + "}") + '"';
      if (o.extra) html += " " + o.extra;
      return html + ">";
    },

    /*
     * Statische Bilder der HTML-Seiten: <img data-img="assets/images/…"
     * data-sizes="…" [data-eager]> ohne src – hier bekommen sie dieselben
     * Attribute wie die per JS gerenderten. Ihr onerror ruft selbst
     * ADK.imgFallback(this) auf.
     */
    hydrateImages: function (scope) {
      var self = this;
      Array.prototype.forEach.call((scope || document).querySelectorAll("img[data-img]"), function (img) {
        var a = self.imageAttrs(self.root + img.getAttribute("data-img"), {
          sizes: img.getAttribute("data-sizes"),
          eager: img.hasAttribute("data-eager")
        });
        img.removeAttribute("data-img");
        Object.keys(a).forEach(function (k) { img.setAttribute(k, a[k]); });
      });
    },

    /*
     * onerror-Rückfall: Fehlt eine Fassung, wird das Original geladen.
     * Rückgabe false = das Original selbst ist fehlgeschlagen; dann greift
     * der bisherige Fallback der jeweiligen Stelle.
     */
    imgFallback: function (img) {
      var orig = img.getAttribute("data-orig");
      if (!orig || img.hasAttribute("data-fallback")) return false;
      /* ohne Fassungen wurde schon das Original geladen – nicht doppelt anfragen */
      if (!img.hasAttribute("srcset") && img.getAttribute("src") === orig) return false;
      img.setAttribute("data-fallback", "");
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.src = orig;
      return true;
    },

    /* Pfad des Originals eines Bildes (Credits, Lightbox) */
    origSrc: function (img) {
      return img.getAttribute("data-orig") || img.getAttribute("src");
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
        self.setCredit(box, self.origSrc(img));
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

  /* Statische Bilder (data-img) sofort versorgen – app.js steht am Ende des
     <body>, die Elemente existieren also schon; ohne src lädt vorher nichts. */
  ADK.hydrateImages();

  /*
   * Lightbox: jedes Bild mit [data-lightbox] öffnet sich per Klick/Enter
   * bildschirmfüllend. Bilder mit demselben data-gallery-Wert bilden eine
   * Galerie: Pfeil-Knöpfe bzw. Pfeiltasten blättern durch die Bilder.
   * Klick auf das große Bild zoomt auf Originalgröße (scrollbar).
   * Schließen über Klick auf den Hintergrund, Schließen-Knopf oder Escape.
   *
   * Zweistufiges Laden: sofort die größte Fassung (w2000, sonst w1200),
   * parallel das Original, das die Fassung nach vollständigem Laden und
   * Dekodieren ersetzt. Die Darstellungsgröße kommt aus den Originalmaßen
   * (IMAGE_SIZES), deshalb springt beim Tausch nichts. Blättern geht
   * jederzeit; jede Anzeige trägt eine laufende Nummer (req), verspätete
   * Ladevorgänge eines vorherigen Bildes werden verworfen.
   */
  var BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

  /* Bild laden und dekodieren; done(im) bzw. fail(). Aus dem Cache sofort. */
  function preload(url, done, fail) {
    var im = new Image();
    im.src = url;
    if (im.complete && im.naturalWidth) {
      done(im);
    } else if (im.decode) {
      im.decode().then(function () { done(im); }, function () {
        if (im.complete && im.naturalWidth) done(im); else fail();
      });
    } else {
      im.onload = function () { done(im); };
      im.onerror = fail;
    }
    return im;
  }

  /* Laufenden Ladevorgang abbrechen (spart Datenvolumen beim Weiterblättern) */
  function abortLoad(im) {
    if (im) im.src = BLANK;
  }

  /* Erste Stufe der Großansicht: w2000, sonst w1200, sonst keine (null) */
  function lightboxVariant(orig) {
    var info = ADK.imageInfo(orig);
    if (!info) return null;
    var lv = info.s.indexOf(2000) !== -1 ? 2000 : (info.s.indexOf(1200) !== -1 ? 1200 : 0);
    return lv ? ADK.variantUrl(orig, lv) : null;
  }

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

    /* Dezente Ladeanzeige, solange vom aktuellen Bild noch nichts zu sehen ist */
    var loading = document.createElement("span");
    loading.className = "lightbox-loading";
    loading.setAttribute("role", "status");
    loading.textContent = ADK.t("lightboxLoading");

    var close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox-close";
    close.textContent = ADK.t("lightboxClose");

    overlay.appendChild(big);
    overlay.appendChild(loading);
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

    var req = 0;          /* laufende Nummer der zuletzt angeforderten Anzeige */
    var dims = null;      /* Originalmaße des aktuellen Bildes */
    var origLoad = null;  /* Ladevorgang des aktuellen Originals */
    var preloaded = {};   /* vorgeladene Fassungen der Nachbarbilder */

    /*
     * Darstellungsgröße: eingepasst so groß wie möglich (auch über die
     * natürliche Größe hinaus), ohne Zuschnitt; gezoomt in Originalgröße.
     * Gilt für Fassung und Original gleichermaßen (border-box inkl. Rahmen).
     */
    function layout() {
      if (!dims) {
        big.style.width = big.style.height = "";
        return;
      }
      /* erst schrumpfen, damit Scrollbalken eines vorherigen Zooms nicht mitmessen */
      big.style.width = big.style.height = "0px";
      var cs = getComputedStyle(overlay);
      var bs = getComputedStyle(big);
      var bx = parseFloat(bs.borderLeftWidth) + parseFloat(bs.borderRightWidth);
      var by = parseFloat(bs.borderTopWidth) + parseFloat(bs.borderBottomWidth);
      var aw = overlay.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - bx;
      var ah = overlay.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - by;
      var f = Math.max(0, Math.min(aw / dims.w, ah / dims.h));
      if (overlay.classList.contains("zoomed")) f = Math.max(f, 1);
      big.style.width = Math.floor(dims.w * f + bx) + "px";
      big.style.height = Math.floor(dims.h * f + by) + "px";
    }

    function show(i) {
      index = (i + group.length) % group.length;
      var my = ++req;
      var el = group[index];
      var orig = ADK.origSrc(el);
      var info = ADK.imageInfo(orig);
      var first = lightboxVariant(orig);
      var origShown = false;
      var firstState = first ? "loading" : "none";   /* loading | shown | failed | none */
      var origFailed = false;

      overlay.classList.remove("zoomed");
      big.alt = el.alt || "";
      /* Wasserzeichen der Großansicht: Credit des gerade gezeigten Bildes */
      ADK.setCredit(overlay, orig);
      if (count) count.textContent = (index + 1) + " / " + group.length;

      abortLoad(origLoad);
      overlay.classList.add("is-loading");
      dims = info ? { w: info.w, h: info.h } : null;
      layout();

      function display(url) {
        big.src = url;
        overlay.classList.remove("is-loading");
      }

      /* Weder Fassung noch Original ladbar: Ladeanzeige beenden, Alt-Text zeigen */
      function giveUp() {
        if (firstState === "loading" || firstState === "shown" || !origFailed) return;
        big.removeAttribute("src");
        overlay.classList.remove("is-loading");
      }

      if (first) {
        preload(first, function () {
          if (my !== req || origShown) return;
          firstState = "shown";
          display(first);
        }, function () {
          if (my !== req) return;
          firstState = "failed";
          giveUp();
        });
      }
      origLoad = preload(orig, function (im) {
        if (my !== req) return;
        origLoad = null;
        origShown = true;
        if (!dims) {
          dims = { w: im.naturalWidth, h: im.naturalHeight };
          layout();
        }
        display(orig);
      }, function () {
        if (my !== req) return;
        origLoad = null;
        origFailed = true;
        giveUp();   /* steht die Fassung schon, bleibt sie einfach stehen */
      });

      /* Nachbarbilder: nur die Fassung vorladen, nicht das Original */
      if (group.length > 1) {
        [index - 1, index + 1].forEach(function (n) {
          var url = lightboxVariant(ADK.origSrc(group[(n + group.length) % group.length]));
          if (url && !preloaded[url]) {
            preloaded[url] = new Image();
            preloaded[url].src = url;
          }
        });
      }
    }

    /* Klick aufs Bild: zwischen Einpassen und Originalgröße wechseln */
    big.addEventListener("click", function (e) {
      e.stopPropagation();
      var zoomed = overlay.classList.toggle("zoomed");
      layout();
      if (zoomed) {
        overlay.scrollLeft = (overlay.scrollWidth - overlay.clientWidth) / 2;
        overlay.scrollTop = (overlay.scrollHeight - overlay.clientHeight) / 2;
      }
    });

    /* Wischen auf Touch-Geräten (nicht im Zoom, dort wird gescrollt) */
    var touch = null;
    overlay.addEventListener("touchstart", function (e) {
      touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    }, { passive: true });
    overlay.addEventListener("touchend", function (e) {
      var start = touch;
      touch = null;
      if (!start || group.length < 2 || overlay.classList.contains("zoomed")) return;
      var dx = e.changedTouches[0].clientX - start.x;
      var dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        e.preventDefault();   /* kein Klick hinterher (würde schließen bzw. zoomen) */
        show(index + (dx < 0 ? 1 : -1));
      }
    });

    function destroy() {
      req++;
      abortLoad(origLoad);
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", layout);
      group[index].focus();
    }
    function onKey(e) {
      if (e.key === "Escape") destroy();
      else if (e.key === "ArrowLeft" && group.length > 1) show(index - 1);
      else if (e.key === "ArrowRight" && group.length > 1) show(index + 1);
    }
    overlay.addEventListener("click", destroy);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", layout);
    /* Erst einhängen, dann anzeigen: layout() misst die Overlay-Größe */
    document.body.appendChild(overlay);
    show(index);
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

  /* ---------- Sprunglinks (#anker) ----------
   * Der Header ist sticky; damit ein Anker-Ziel direkt darunter beginnt, gilt
   * html { scroll-padding-top: var(--header-h) } (style.css). Die Höhe
   * schwankt (auf dem Handy bricht das Menü um) und wird deshalb hier
   * gemessen und bei jeder Größenänderung nachgeführt.
   * Außerdem bekommen Inhalte oberhalb des Ziels ihre Höhe teils erst nach
   * dem Sprung (Fotos ohne feste Maße, Lazy-Loading, per JS erzeugte Grids
   * und Vorschaureihen) und schieben das Ziel weiter. Nach einem Sprung wird
   * das Ziel daher kurz nachgeführt, bis das Layout steht oder Besucher:innen
   * selbst scrollen. Kein eigener Versatz: scrollIntoView beachtet
   * scroll-padding-top, damit wird nichts doppelt ausgeglichen. */
  var siteHeader = document.querySelector(".site-header");
  var follow = null;
  var STOP_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"];

  function setHeaderHeight() {
    if (!siteHeader) return;
    document.documentElement.style.setProperty(
      "--header-h", siteHeader.getBoundingClientRect().height + "px"
    );
    if (follow) follow.target.scrollIntoView();
  }

  function stopFollow() {
    if (!follow) return;
    follow.observer.disconnect();
    clearTimeout(follow.timer);
    STOP_EVENTS.forEach(function (type) { window.removeEventListener(type, stopFollow, true); });
    follow = null;
  }

  function followTarget(target, ms) {
    stopFollow();
    if (!target || !("ResizeObserver" in window)) return;
    var initial = true;   /* ResizeObserver meldet sich einmal direkt beim Start */
    var observer = new ResizeObserver(function () {
      if (initial) { initial = false; return; }
      target.scrollIntoView();
    });
    follow = { target: target, observer: observer, timer: setTimeout(stopFollow, ms) };
    observer.observe(document.body);
    STOP_EVENTS.forEach(function (type) {
      window.addEventListener(type, stopFollow, { capture: true, passive: true });
    });
  }

  function hashTarget(hash) {
    if (!hash || hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch (e) { return null; }
  }

  setHeaderHeight();
  if (siteHeader && "ResizeObserver" in window) new ResizeObserver(setHeaderHeight).observe(siteHeader);
  window.addEventListener("resize", setHeaderHeight);

  /* Klick auf einen Sprunglink dieser Seite: Browser springt selbst, wir führen nur nach */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href*='#']") : null;
    if (!a || e.defaultPrevented || a.host !== location.host || a.pathname !== location.pathname) return;
    var target = hashTarget(a.hash);
    if (target) followTarget(target, 3000);
  });

  /* Aufruf mit #anker in der URL (z. B. /#avo): bis nach dem Laden nachführen */
  var initialTarget = hashTarget(location.hash);
  if (initialTarget) {
    followTarget(initialTarget, 10000);
    window.addEventListener("load", function () {
      if (!follow || follow.target !== initialTarget) return;
      initialTarget.scrollIntoView();
      clearTimeout(follow.timer);
      follow.timer = setTimeout(stopFollow, 1500);
    });
  }

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
