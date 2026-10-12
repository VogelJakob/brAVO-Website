/*
 * Rendert alle Termin-Anzeigen der Startseite aus assets/data/termine.js:
 *   - Laufband oben (8 identische Kopien, wie es die CSS-Animation erwartet)
 *   - AVO-Terminliste
 *   - Auswahlfeld im Anmeldeformular
 *   - Datumszeilen der Aufführungs-Karten (+ Uhrzeiten, Besetzung,
 *     Szenenfoto-Galerien)
 *   - Datums-Platzhalter in den News ([data-news-premiere], [data-news-avo])
 *   - Event-Auszeichnung (JSON-LD) für Suchmaschinen
 *
 * Termine werden ausschließlich in termine.js gepflegt – hier steht nur die
 * Darstellung. Keine JS-Animationen; Bewegung macht weiterhin CSS.
 */
(function () {
  "use strict";

  if (typeof TERMINE === "undefined") return;

  var esc = function (s) { return ADK.esc(s); };
  var t = function (k) { return ADK.t(k); };

  /* Galerie-Konvention der Produktionen: {key}-2.jpg bis {key}-10.jpg;
     pro Produktion über "fotosMax" in termine.js begrenzbar. */
  var PROD_GALLERY_MAX = 10;

  function prodImage(key, n) {
    return ADK.asset(ADK.root + "assets/images/productions/" + key + (n ? "-" + n : "") + ".jpg");
  }

  /* "08.08.2026" bzw. ohne Jahr "08.08." – das Jahr trägt nur der letzte Termin. */
  function kurz(iso, mitJahr) {
    var d = ADK.datum(iso);
    return mitJahr ? d.datum : d.datum.slice(0, 6);
  }

  function aufzaehlung(list) {
    return list.map(function (item, i) {
      var letzter = i === list.length - 1;
      var text = "<strong>" + esc(kurz(item.d, letzter)) + "</strong>";
      if (i === 0) return text;
      return (letzter ? " und " : ", ") + text;
    }).join("");
  }

  /* ["14:00", "17:00"] -> "14:00 und 17:00 Uhr"; leer, wenn keine Uhrzeit gepflegt ist */
  function uhrzeitText(zeiten) {
    if (!zeiten || !zeiten.length) return "";
    var liste = zeiten.length > 1
      ? zeiten.slice(0, -1).join(", ") + " und " + zeiten[zeiten.length - 1]
      : zeiten[0];
    return liste + " " + t("oClock");
  }

  /* ---------- Laufband ---------- */

  function marqueeText() {
    var teile = TERMINE.avo.map(function (a) {
      var d = ADK.datum(a.d);
      return d.datum + " " + a.stadt + " " + (a.zeit || t("timeSoon")) + " (" + a.venue + ")";
    });
    return t("marqueeLead") + " · " + teile.join(" · ") + " ·";
  }

  function renderMarquee() {
    var box = document.querySelector(".marquee-in");
    if (!box) return;
    var text = marqueeText();
    var html = "";
    /* 8 Kopien: genug Breite für sehr breite Viewports; die CSS-Animation
       verschiebt um exakt 1/8 und springt dann nahtlos zurück. */
    for (var i = 0; i < 8; i++) html += "<span>" + esc(text) + "</span>";
    box.innerHTML = html;
    var band = box.closest(".marquee");
    if (band) band.hidden = false;
  }

  /* ---------- AVO-Liste und Formular-Auswahl ---------- */

  function renderAvoListe() {
    var list = document.querySelector(".avo-dates");
    if (!list) return;
    list.innerHTML = TERMINE.avo.map(function (a) {
      var d = ADK.datum(a.d);
      return (
        '<li><a href="#anmeldung">' +
          '<span class="avo-date">' + esc(d.datum) + "</span>" +
          '<span class="avo-city">' + esc(a.stadt) + "</span>" +
          '<span class="avo-venue">' + esc(a.venue) + "</span>" +
          '<span class="avo-time">' + esc(a.zeit || t("timeSoon")) + "</span>" +
        "</a></li>"
      );
    }).join("");
  }

  function renderAvoOptionen() {
    var select = document.getElementById("avo-termin");
    if (!select) return;
    var erste = select.querySelector("option");
    select.innerHTML = "";
    if (erste) select.appendChild(erste);
    TERMINE.avo.forEach(function (a) {
      var d = ADK.datum(a.d);
      var opt = document.createElement("option");
      opt.textContent = d.datum + " – " + a.stadt + ", " + (a.zeit || t("timeSoon")) + " (" + a.venue + ")";
      select.appendChild(opt);
    });
  }

  /* ---------- Aufführungs-Karten ---------- */

  /* Heutiges Datum als ISO-String "JJJJ-MM-TT" (lokale Zeit) */
  function heuteIso() {
    var h = new Date();
    return h.getFullYear() + "-" + ("0" + (h.getMonth() + 1)).slice(-2) + "-" + ("0" + h.getDate()).slice(-2);
  }

  function terminZeile(p) {
    var premiere = null;
    var weitere = [];
    var heute = heuteIso();
    /* Vergangene Termine werden nicht mehr angezeigt (der heutige noch). */
    var kommende = p.termine.filter(function (item) { return item.d >= heute; });
    var alleVorbei = p.termine.length > 0 && !kommende.length;
    kommende.forEach(function (item) {
      if (item.typ === "premiere" && !premiere) premiere = item;
      else weitere.push(item);
    });
    var unsicher = weitere.length > 0 && weitere.every(function (item) { return item.unsicher; });

    var zeit = uhrzeitText(p.uhrzeiten);
    var text = "";
    if (weitere.length) {
      text = unsicher && !premiere
        ? t("expected") + " " + aufzaehlung(weitere)
        : (premiere ? t("moreShows") : t("shows")) + ": " + aufzaehlung(weitere);
      if (zeit) text += " · " + esc(t("eachAt") + " " + zeit);
      if (p.weitereFolgen) {
        text += " · " + esc(unsicher && !premiere ? t("allDatesSoon") : t("moreDatesSoon"));
      }
    } else if (p.weitereFolgen) {
      text = esc(t("moreDatesSoon"));
    }

    /*
     * Der Chip nennt die Premiere. Ohne Premiere, aber mit (auch nur
     * voraussichtlichen) Terminen bleibt er leer – die Termine stehen dann
     * schon in der Zeile darunter, ein zusätzliches "Termine folgen" wäre
     * dazu widersprüchlich. Nur wenn gar kein Datum bekannt ist, tritt der
     * Platzhalter an.
     */
    var chip = premiere
      ? t("premiere") + " · " + ADK.datum(premiere.d).tag + " " + ADK.datum(premiere.d).datum + (zeit ? " · " + zeit : "")
      : (weitere.length || alleVorbei ? "" : t("prodDateSoon"));

    return { chip: chip, text: text };
  }

  function renderProduktionen() {
    TERMINE.produktionen.forEach(function (p) {
      var card = document.querySelector('[data-prod="' + p.key + '"]');
      if (!card) return;
      var zeile = terminZeile(p);
      var chip = card.querySelector(".prod-date");
      var text = card.querySelector(".prod-text");
      if (chip) {
        chip.textContent = zeile.chip;
        chip.hidden = !zeile.chip;
      }
      if (text) {
        text.innerHTML = zeile.text;
        text.hidden = !zeile.text;
      }
      renderBesetzung(card, p);
    });
  }

  function namen(list) {
    return (list || []).filter(function (n) { return n && String(n).trim(); });
  }

  /*
   * "Es spielen: …" unter dem Termintext. Bei Doppelbesetzung (ensembles)
   * eine Zeile je Ensemble. Leere Listen erzeugen keine Zeile.
   */
  function renderBesetzung(card, p) {
    var zeilen = [];
    if (namen(p.besetzung).length) {
      zeilen.push(t("cast") + ": " + namen(p.besetzung).join(", "));
    }
    (p.ensembles || []).forEach(function (e) {
      var liste = namen(e.besetzung);
      if (!liste.length) return;
      zeilen.push((e.name ? e.name + " – " : "") + t("cast") + ": " + liste.join(", "));
    });
    if (!zeilen.length) return;
    var anker = card.querySelector(".prod-text");
    if (!anker) return;
    zeilen.reverse().forEach(function (z) {
      var el = document.createElement("p");
      el.className = "prod-text prod-cast";
      el.textContent = z;
      anker.parentNode.insertBefore(el, anker.nextSibling);
    });
  }

  /* ---------- News: Termine aus termine.js statt doppelt gepflegt ---------- */

  function renderNews() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-news-premiere]"), function (el) {
      var key = el.getAttribute("data-news-premiere");
      TERMINE.produktionen.forEach(function (p) {
        if (p.key !== key) return;
        var premiere = p.termine.filter(function (item) { return item.typ === "premiere"; })[0];
        if (!premiere) return;
        var zeit = uhrzeitText(p.uhrzeiten);
        el.textContent = "am " + ADK.datum(premiere.d).datum + (zeit ? " um " + zeit : "");
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-news-avo]"), function (el) {
      el.innerHTML = TERMINE.avo.map(function (a, i) {
        var letzter = i === TERMINE.avo.length - 1;
        var text = esc(kurz(a.d, letzter) + " " + a.stadt);
        if (i === 0) return text;
        return (letzter ? " und " : ", ") + text;
      }).join("");
    });
  }

  /*
   * Szenenfotos: neben dem Hauptbild ({key}.jpg) erscheinen vorhandene
   * Zusatzbilder ({key}-2.jpg …) als Vorschaureihe. Jede Aufführung bildet
   * eine eigene Lightbox-Galerie (data-gallery = key), damit die Pfeiltasten
   * nur innerhalb dieser Aufführung blättern und nicht in die nächste laufen.
   */
  function renderProdGalerien() {
    TERMINE.produktionen.forEach(function (p) {
      var card = document.querySelector('[data-prod="' + p.key + '"]');
      if (!card) return;
      var kandidaten = [];
      var max = Math.min(p.fotosMax || PROD_GALLERY_MAX, PROD_GALLERY_MAX);
      for (var n = 2; n <= max; n++) kandidaten.push(prodImage(p.key, n));

      Promise.all(kandidaten.map(function (url) { return ADK.mediaExists(url); })).then(function (da) {
        var bilder = kandidaten.filter(function (url, i) { return da[i]; });
        if (!bilder.length) return;
        var box = document.createElement("div");
        box.className = "prod-thumbs";
        box.innerHTML = bilder.map(function (src, i) {
          return (
            '<img src="' + esc(src) + '" alt="' + esc("Szenenfoto aus " + p.titel + " – " + (i + 2)) + '" ' +
              'loading="lazy" data-lightbox data-gallery="' + esc(p.key) + '" tabindex="0">'
          );
        }).join("");
        var media = card.querySelector(".prod-media");
        if (media && media.parentNode) media.parentNode.insertBefore(box, media.nextSibling);
        var imgs = Array.prototype.slice.call(box.querySelectorAll("img"));
        Promise.all(imgs.map(geladen)).then(function () { layoutThumbs(box); });
      });
    });
  }

  function geladen(img) {
    return new Promise(function (resolve) {
      if (img.complete) return resolve();
      img.addEventListener("load", resolve);
      img.addEventListener("error", resolve);
    });
  }

  /*
   * Vorschauen im 5-Spalten-Raster: aufeinanderfolgende Querformate teilen
   * sich eine Spalte (übereinander), ein Hochformat belegt eine Spalte über
   * beide Zeilen. Je 5 Spalten bilden eine Doppelzeile. Hat die letzte
   * Doppelzeile Spalten frei, werden Querformat-Paare von hinten aufgeteilt;
   * einzelne Querformate rücken ans Ende, damit die Lücken unten rechts
   * liegen. Nur die Platzierung ändert sich, die DOM- (Lightbox-)
   * Reihenfolge bleibt. Bildmaße ohne Beschnitt: Querformate füllen die
   * Spaltenbreite (höchstens 3:2-Höhe), Hochformate sind so hoch wie zwei
   * Querformate plus Abstand.
   */
  var THUMB_COLS = 5, THUMB_GAP = 5, THUMB_BORDER = 3;

  function istHoch(img) { return img.naturalHeight > img.naturalWidth; }

  function layoutThumbs(box) {
    var imgs = Array.prototype.slice.call(box.querySelectorAll("img"));
    if (!imgs.length || imgs.some(function (img) { return !img.naturalWidth; })) return;

    // Spalten bilden
    var spalten = [], offen = null;
    imgs.forEach(function (img) {
      if (istHoch(img)) {
        spalten.push([img]);
        offen = null;
      } else if (offen) {
        offen.push(img);
        offen = null;
      } else {
        offen = [img];
        spalten.push(offen);
      }
    });

    // in Doppelzeilen zu je 5 Spalten aufteilen
    var baender = [];
    for (var i = 0; i < spalten.length; i += THUMB_COLS) baender.push(spalten.slice(i, i + THUMB_COLS));
    var letztes = baender[baender.length - 1];
    for (var j = letztes.length - 1; j >= 0 && letztes.length < THUMB_COLS; j--) {
      if (letztes[j].length === 2) letztes.splice(j, 1, [letztes[j][0]], [letztes[j][1]]);
    }
    baender = baender.map(function (band) {
      var einzeln = function (s) { return s.length === 1 && !istHoch(s[0]); };
      return band.filter(function (s) { return !einzeln(s); })
        .concat(band.filter(einzeln));
    });

    // Maße
    var cs = getComputedStyle(box);
    var inner = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (inner <= 0) return;
    var colW = (inner - THUMB_GAP * (THUMB_COLS - 1)) / THUMB_COLS;
    var rowH = (colW - THUMB_BORDER) * 2 / 3 + THUMB_BORDER;

    baender.forEach(function (band, b) {
      band.forEach(function (spalte, c) {
        spalte.forEach(function (img, r) {
          var ratio = img.naturalWidth / img.naturalHeight;
          var w, h;
          if (istHoch(img)) {
            h = 2 * rowH + THUMB_GAP;
            w = (h - THUMB_BORDER) * ratio + THUMB_BORDER;
            if (w > colW) { w = colW; h = (w - THUMB_BORDER) / ratio + THUMB_BORDER; }
          } else {
            w = colW;
            h = (w - THUMB_BORDER) / ratio + THUMB_BORDER;
            if (h > rowH) { h = rowH; w = (h - THUMB_BORDER) * ratio + THUMB_BORDER; }
          }
          img.style.width = w + "px";
          img.style.height = h + "px";
          img.style.gridColumn = String(c + 1);
          img.style.gridRow = istHoch(img)
            ? (2 * b + 1) + " / span 2"
            : String(2 * b + 1 + r);
        });
      });
    });
  }

  var thumbResizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(thumbResizeTimer);
    thumbResizeTimer = setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".prod-thumbs"), layoutThumbs);
    }, 100);
  });

  /* ---------- Event-Auszeichnung für Suchmaschinen ---------- */

  function renderJsonLd() {
    var events = [];
    TERMINE.produktionen.forEach(function (p) {
      p.termine.forEach(function (item) {
        if (item.unsicher) return;
        /* Eine Event-Auszeichnung je Vorstellung (bei zwei Uhrzeiten zwei) */
        var zeiten = p.uhrzeiten && p.uhrzeiten.length ? p.uhrzeiten : [null];
        zeiten.forEach(function (z) {
          var ev = {
            "@type": "TheaterEvent",
            name: p.titel,
            startDate: z ? item.d + "T" + z : item.d,
            eventStatus: "https://schema.org/EventScheduled"
          };
          if (p.venue) ev.location = { "@type": "Place", name: p.venue };
          if (p.tickets) ev.offers = { "@type": "Offer", url: p.tickets };
          events.push(ev);
        });
      });
    });
    TERMINE.avo.forEach(function (a) {
      events.push({
        "@type": "TheaterEvent",
        name: "Abschlussvorsprechen ADK Bayern 2027 – " + a.stadt,
        startDate: a.d,
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: a.venue, address: a.stadt }
      });
    });
    if (!events.length) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": events });
    document.head.appendChild(script);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderMarquee();
    renderAvoListe();
    renderAvoOptionen();
    renderProduktionen();
    renderProdGalerien();
    renderNews();
    renderJsonLd();
    ADK.applyCredits();
  });
})();
