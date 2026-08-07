/*
 * Rendert alle Termin-Anzeigen der Startseite aus assets/data/termine.js:
 *   - Laufband oben (8 identische Kopien, wie es die CSS-Animation erwartet)
 *   - AVO-Terminliste
 *   - Auswahlfeld im Anmeldeformular
 *   - Datumszeilen der Aufführungs-Karten (+ Szenenfoto-Galerien)
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

  /* Galerie-Konvention der Produktionen: {key}-2.jpg bis {key}-5.jpg */
  var PROD_GALLERY_MAX = 5;

  function prodImage(key, n) {
    return ADK.root + "assets/images/productions/" + key + (n ? "-" + n : "") + ".jpg";
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

  function terminZeile(p) {
    var premiere = null;
    var weitere = [];
    p.termine.forEach(function (item) {
      if (item.typ === "premiere" && !premiere) premiere = item;
      else weitere.push(item);
    });
    var unsicher = weitere.length > 0 && weitere.every(function (item) { return item.unsicher; });

    var text = "";
    if (weitere.length) {
      text = unsicher && !premiere
        ? t("expected") + " " + aufzaehlung(weitere)
        : t("moreShows") + ": " + aufzaehlung(weitere);
      if (p.weitereFolgen) {
        text += " · " + esc(unsicher && !premiere ? t("allDatesSoon") : t("moreDatesSoon"));
      }
    } else if (p.weitereFolgen) {
      text = esc(t("moreDatesSoon"));
    }

    var chip = premiere
      ? t("premiere") + " · " + ADK.datum(premiere.d).tag + " " + ADK.datum(premiere.d).datum
      : t("prodDateSoon");

    return { chip: chip, text: text };
  }

  function renderProduktionen() {
    TERMINE.produktionen.forEach(function (p) {
      var card = document.querySelector('[data-prod="' + p.key + '"]');
      if (!card) return;
      var zeile = terminZeile(p);
      var chip = card.querySelector(".prod-date");
      var text = card.querySelector(".prod-text");
      if (chip) chip.textContent = zeile.chip;
      if (text) {
        text.innerHTML = zeile.text;
        text.hidden = !zeile.text;
      }
    });
  }

  /*
   * Szenenfotos: neben dem Hauptbild ({key}.jpg) erscheinen vorhandene
   * Zusatzbilder ({key}-2.jpg …) als Vorschaureihe. Alle Bilder teilen sich
   * die Galerie "produktionen", sodass die Lightbox durchblättern kann.
   */
  function renderProdGalerien() {
    TERMINE.produktionen.forEach(function (p) {
      var card = document.querySelector('[data-prod="' + p.key + '"]');
      if (!card) return;
      var kandidaten = [];
      for (var n = 2; n <= PROD_GALLERY_MAX; n++) kandidaten.push(prodImage(p.key, n));

      Promise.all(kandidaten.map(function (url) { return ADK.mediaExists(url); })).then(function (da) {
        var bilder = kandidaten.filter(function (url, i) { return da[i]; });
        if (!bilder.length) return;
        var box = document.createElement("div");
        box.className = "prod-thumbs";
        box.innerHTML = bilder.map(function (src, i) {
          return (
            '<img src="' + esc(src) + '" alt="' + esc("Szenenfoto aus " + p.titel + " – " + (i + 2)) + '" ' +
              'loading="lazy" data-lightbox data-gallery="produktionen" tabindex="0">'
          );
        }).join("");
        var media = card.querySelector(".prod-media");
        if (media && media.parentNode) media.parentNode.insertBefore(box, media.nextSibling);
      });
    });
  }

  /* ---------- Event-Auszeichnung für Suchmaschinen ---------- */

  function renderJsonLd() {
    var events = [];
    TERMINE.produktionen.forEach(function (p) {
      p.termine.forEach(function (item) {
        if (item.unsicher) return;
        var ev = {
          "@type": "TheaterEvent",
          name: p.titel,
          startDate: item.d,
          eventStatus: "https://schema.org/EventScheduled"
        };
        if (p.venue) ev.location = { "@type": "Place", name: p.venue };
        if (p.tickets) ev.offers = { "@type": "Offer", url: p.tickets };
        events.push(ev);
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
    renderJsonLd();
    ADK.applyCredits();
  });
})();
