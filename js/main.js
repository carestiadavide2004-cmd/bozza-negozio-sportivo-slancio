/* =====================================================================
   SLANCIO – main.js
   Tutti i dati arrivano da config.js (window.SITO).
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO;
  if (!C) return;
  var d = document, html = d.documentElement, body = d.body;
  var REL = body.getAttribute('data-rel') || '';
  var ridotto = matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var waLink = function (msg) { return 'https://wa.me/' + C.contatti.whatsapp + '?text=' + encodeURIComponent(msg); };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) window.__anim = true;

  /* ---------------- Orari: Aperto / Chiuso (ora italiana) ---------------- */
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DOW = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var minuti = function (hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; };
  var ora = function (hhmm) { return hhmm.replace(/^0/, ''); };

  function partiRoma(data) {
    var f = new Intl.DateTimeFormat('en-GB', { timeZone: C.orari.fusoOrario || 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' });
    var o = {};
    f.formatToParts(data).forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, dow: DOW[o.weekday] };
  }
  function fasceGiorno(y, m, d, dow) {
    var mmdd = pad(m) + '-' + pad(d), ymd = y + '-' + mmdd;
    if ((C.orari.festivi || []).indexOf(mmdd) > -1) return [];
    if ((C.orari.chiusureStraordinarie || []).indexOf(ymd) > -1) return [];
    return C.orari.settimana[dow] || [];
  }
  function statoOrario(data) {
    var p = partiRoma(data || new Date());
    var adesso = p.h * 60 + p.min;
    var fasce = fasceGiorno(p.y, p.m, p.d, p.dow);
    for (var i = 0; i < fasce.length; i++) {
      if (adesso >= minuti(fasce[i][0]) && adesso < minuti(fasce[i][1])) return { aperto: true, testo: 'Aperto ora · chiude alle ' + ora(fasce[i][1]), dow: p.dow };
    }
    for (i = 0; i < fasce.length; i++) {
      if (minuti(fasce[i][0]) > adesso) return { aperto: false, testo: 'Chiuso · riapre alle ' + ora(fasce[i][0]), dow: p.dow };
    }
    var base = Date.UTC(p.y, p.m - 1, p.d);
    for (var g = 1; g <= 21; g++) {
      var t = new Date(base + g * 864e5);
      var f2 = fasceGiorno(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCDay());
      if (f2.length) {
        var quando = g === 1 ? 'domani' : g < 7 ? GIORNI[t.getUTCDay()] : t.getUTCDate() + '/' + (t.getUTCMonth() + 1);
        return { aperto: false, testo: 'Chiuso · riapre ' + quando + ' alle ' + ora(f2[0][0]), dow: p.dow };
      }
    }
    return { aperto: false, testo: 'Chiuso', dow: p.dow };
  }
  window.SLANCIO = { statoOrario: statoOrario };
  function aggiornaOrario() {
    var s = statoOrario();
    $$('[data-orario]').forEach(function (el) {
      el.setAttribute('data-stato', s.aperto ? 'aperto' : 'chiuso');
      var t = $('[data-orario-testo]', el); if (t) t.textContent = s.testo;
    });
    $$('.orari tr').forEach(function (tr) { tr.classList.toggle('is-oggi', +tr.getAttribute('data-giorno') === s.dow); });
  }
  aggiornaOrario();
  setInterval(aggiornaOrario, 60000);

  /* ---------------- Header compatto ---------------- */
  var hdr = $('[data-hdr]');
  var compatta = function () { if (hdr && !blocchiAttivi()) hdr.classList.toggle('is-compatto', window.scrollY > 40); };
  function blocchiAttivi() { return html.style.overflow === 'hidden'; }
  compatta();
  addEventListener('scroll', compatta, { passive: true });

  /* ---------------- utilità dialoghi ---------------- */
  function intrappola(box, e) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', box).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  var blocchi = 0;
  var bloccaScroll = function (si) {
    blocchi = Math.max(0, blocchi + (si ? 1 : -1));
    html.style.overflow = blocchi ? 'hidden' : '';   // solo html: sul body romperebbe gli elementi sticky
  };

  /* ---------------- Mega menu (computer) ---------------- */
  var megaBtn = $('[data-mega-btn]'), mega = $('[data-mega]'), megaTimer;
  function megaApri(si) {
    if (!mega) return;
    clearTimeout(megaTimer);
    mega.hidden = !si;
    megaBtn.setAttribute('aria-expanded', si ? 'true' : 'false');
    hdr.classList.toggle('is-aperto', si);
  }
  if (megaBtn) {
    megaBtn.addEventListener('click', function () { megaApri(mega.hidden); });
    var zona = megaBtn.parentElement;
    if (matchMedia('(hover: hover)').matches) {
      zona.addEventListener('mouseenter', function () { clearTimeout(megaTimer); megaTimer = setTimeout(function () { megaApri(true); }, 90); });
      zona.addEventListener('mouseleave', function () { clearTimeout(megaTimer); megaTimer = setTimeout(function () { megaApri(false); }, 220); });
    }
    d.addEventListener('click', function (e) { if (!mega.hidden && !zona.contains(e.target)) megaApri(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mega.hidden) { megaApri(false); megaBtn.focus(); } });
    zona.addEventListener('focusout', function (e) { if (!zona.contains(e.relatedTarget)) megaApri(false); });
  }

  /* ---------------- Menu telefono ---------------- */
  var menuBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
  function menuApri(si) {
    if (!menu) return;
    menu.hidden = !si;
    menuBtn.setAttribute('aria-expanded', si ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', si ? 'Chiudi il menu' : 'Apri il menu');
    hdr.classList.toggle('is-aperto', si);
    bloccaScroll(si);
    if (si) { var p = $('a', menu); if (p) p.focus({ preventScroll: true }); }
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { menuApri(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) menuApri(false); });
    d.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') { menuApri(false); menuBtn.focus(); }
      else if (e.key === 'Tab') intrappolaMenu(e);
    });
  }
  function intrappolaMenu(e) {
    var f = [menuBtn].concat($$('a', menu));
    if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  addEventListener('resize', function () { if (innerWidth >= 1024 && menu && !menu.hidden) menuApri(false); });

  /* ---------------- Ricerca ---------------- */
  var cerca = $('[data-cerca]');
  if (cerca) {
    var campo = $('#cerca-campo'), lista = $('#cerca-risultati'), vuoto = $('[data-cerca-vuoto]'), apriBtn = $('[data-cerca-apri]'), sel = -1, ritorno;
    var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var indice = [];
    C.sport.forEach(function (s) {
      var url = REL + 'sport/' + s.slug + '/index.html';
      indice.push({ tit: s.nome, sotto: s.categorie.length + ' categorie', num: s.numero, acc: s.accento, url: url, testo: norm(s.nome + ' ' + (s.nomeBreve || '')), sport: true });
      s.categorie.forEach(function (c) {
        var cu = REL + 'sport/' + s.slug + '/' + c.slug + '/index.html';
        indice.push({ tit: c.titolo, sotto: s.nome + ' · ' + (c.prodotti || []).length + ' prodotti', num: s.numero, acc: s.accento, url: cu, testo: norm(c.titolo + ' ' + s.nome + ' ' + c.tipologie.join(' ')), cat: true });
        (c.prodotti || []).forEach(function (p) {
          indice.push({ tit: p.nome, sotto: p.codice + ' · ' + s.nome, num: s.numero, acc: s.accento, url: cu + '#prodotto-' + p.codice, testo: norm(p.nome + ' ' + p.codice + ' ' + c.titolo + ' ' + s.nome + ' ' + (p.linea === 'adulto' ? '' : 'bambino bimbo junior')), prod: p.codice });
        });
      });
    });
    var evid = function (t, q) {
      var e = t.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
      if (!q) return e;
      var i = norm(e).indexOf(norm(q.split(/\s+/)[0]));
      return i < 0 ? e : e.slice(0, i) + '<mark>' + e.slice(i, i + q.split(/\s+/)[0].length) + '</mark>' + e.slice(i + q.split(/\s+/)[0].length);
    };
    function mostra() {
      var q = campo.value.trim();
      var parole = norm(q).split(/\s+/).filter(Boolean);
      var ris = !parole.length ? indice.filter(function (x) { return x.sport; }) : indice.filter(function (x) {
        return parole.every(function (p) { return x.testo.indexOf(p) > -1; });
      }).sort(function (a, b) {
        var peso = function (x) { return (norm(x.tit).indexOf(parole[0]) === 0 ? 4 : 0) + (x.sport ? 3 : x.cat ? 2 : 0); };
        return peso(b) - peso(a);
      }).slice(0, 12);
      lista.innerHTML = ris.map(function (x, i) {
        return '<li role="presentation"><a role="option" id="r-' + i + '" href="' + x.url + '" aria-selected="false" style="--acc:' + x.acc + '"><span class="r-num">' + x.num + '</span><span class="r-tit">' + evid(x.tit, q) + '</span><span class="r-sport">' + x.sotto + '</span></a></li>';
      }).join('');
      vuoto.hidden = ris.length > 0;
      campo.setAttribute('aria-expanded', ris.length ? 'true' : 'false');
      sel = -1; campo.removeAttribute('aria-activedescendant');
    }
    function seleziona(n) {
      var voci = $$('a', lista); if (!voci.length) return;
      sel = (n + voci.length) % voci.length;
      voci.forEach(function (v, i) { v.setAttribute('aria-selected', i === sel ? 'true' : 'false'); });
      campo.setAttribute('aria-activedescendant', voci[sel].id);
      voci[sel].scrollIntoView({ block: 'nearest' });
    }
    function cercaApri(si) {
      cerca.hidden = !si;
      bloccaScroll(si);
      if (si) { ritorno = d.activeElement; megaApri(false); if (menu && !menu.hidden) menuApri(false); mostra(); campo.focus({ preventScroll: true }); }
      else { campo.value = ''; if (ritorno) ritorno.focus({ preventScroll: true }); }
    }
    apriBtn.addEventListener('click', function () { cercaApri(true); });
    $('[data-cerca-chiudi]').addEventListener('click', function () { cercaApri(false); });
    campo.addEventListener('input', mostra);
    campo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); seleziona(sel + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); seleziona(sel - 1); }
      else if (e.key === 'Enter') { var v = $$('a', lista)[sel < 0 ? 0 : sel]; if (v) { e.preventDefault(); v.click(); } }
    });
    cerca.addEventListener('keydown', function (e) { if (e.key === 'Escape') cercaApri(false); else intrappola(cerca, e); });
    cerca.addEventListener('click', function (e) {
      if (e.target === cerca) cercaApri(false);
      var a = e.target.closest('a[href]');
      var stessa = a && a.getAttribute('href').indexOf('#') > -1 && a.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '');
      if (stessa && /^#prodotto-/.test(a.hash)) { e.preventDefault(); e.stopPropagation(); cercaApri(false); apriScheda(a.hash.slice(10), null, true); }
      else if (stessa) { cercaApri(false); apriCategoria(a.hash.slice(1)); }
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === '/' && cerca.hidden && !/input|textarea|select/i.test(d.activeElement.tagName)) { e.preventDefault(); cercaApri(true); }
    });
  }

  /* ---------------- Video hero (dopo il caricamento) ---------------- */
  var video = $('.hero__video');
  if (video && !ridotto.matches && !(navigator.connection && navigator.connection.saveData)) {
    var avviaVideo = function () {
      var tel = matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
      video.src = REL + video.getAttribute(tel ? 'data-video-m' : 'data-video-d');
      video.muted = true;
      video.addEventListener('playing', function () { video.classList.add('is-attivo'); }, { once: true });
      var p = video.play(); if (p && p.catch) p.catch(function () {});
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (v) {
          if (v[0].isIntersecting) { var q = video.play(); if (q && q.catch) q.catch(function () {}); } else video.pause();
        }, { threshold: 0.05 }).observe(video);
      }
    };
    var dopo = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(avviaVideo, { timeout: 1500 }); };
    if (d.readyState === 'complete') dopo(); else addEventListener('load', dopo, { once: true });
  }

  /* ---------------- Vedi tutti ---------------- */
  var vediSport = $('[data-vedi-tutti]');
  if (vediSport) vediSport.addEventListener('click', function () {
    var g = $('[data-tessere]'); g.classList.add('is-tutte'); vediSport.setAttribute('aria-expanded', 'true');
    var primo = $('.tessera--extra a', g); if (primo) primo.focus({ preventScroll: true });
    if (hasGsap) { ScrollTrigger.refresh(); }
  });
  var grigliaCat = $('[data-cat-griglia]'), vediCat = $('[data-vedi-cat]');
  function mostraTutteCat() {
    if (!grigliaCat || grigliaCat.classList.contains('is-tutte')) return;
    grigliaCat.classList.add('is-tutte');
    if (vediCat) vediCat.setAttribute('aria-expanded', 'true');
    if (hasGsap) ScrollTrigger.refresh();
  }
  if (vediCat) vediCat.addEventListener('click', function () {
    mostraTutteCat();
    var p = $('.cat--extra a', grigliaCat); if (p) p.focus({ preventScroll: true });
  });
  function apriCategoria(id) {
    var el = id && d.getElementById(id);
    if (!el || !el.hasAttribute('data-cat')) return;
    if (el.classList.contains('cat--extra')) mostraTutteCat();
    requestAnimationFrame(function () { el.scrollIntoView({ behavior: ridotto.matches ? 'auto' : 'smooth', block: 'start' }); });
  }
  $$('[data-chip]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', a.hash); apriCategoria(a.hash.slice(1)); });
  });
  if (location.hash) { var h = location.hash.slice(1); var bersaglio = d.getElementById(h); if (bersaglio && bersaglio.classList.contains('cat--extra')) { mostraTutteCat(); setTimeout(function () { bersaglio.scrollIntoView(); }, 50); } }

  /* ---------------- Barra categorie: categoria attiva ---------------- */
  var catbar = $('[data-catbar]');
  if (catbar && 'IntersectionObserver' in window) {
    var chips = $$('[data-chip]'), visibili = {};
    var attiva = function (id) {
      chips.forEach(function (c) {
        var on = c.hash === '#' + id;
        c.classList.toggle('is-attiva', on);
        if (on) {
          c.setAttribute('aria-current', 'true');
          var bar = c.closest('.catbar__lista');
          if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: c.offsetLeft - 16, behavior: ridotto.matches ? 'auto' : 'smooth' });
        } else c.removeAttribute('aria-current');
      });
    };
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { visibili[v.target.id] = v.isIntersecting ? v.boundingClientRect.top : null; });
      var migliore = null, top = Infinity;
      Object.keys(visibili).forEach(function (k) { if (visibili[k] !== null && visibili[k] < top) { top = visibili[k]; migliore = k; } });
      if (migliore) attiva(migliore);
    }, { rootMargin: '-120px 0px -45% 0px' });
    $$('[data-cat]').forEach(function (c) { io.observe(c); });
  }

  /* ---------------- Carosello ---------------- */
  var car = $('[data-carosello]');
  if (car) $$('[data-car]').forEach(function (b) {
    b.addEventListener('click', function () {
      var li = $('li', car); var passo = li ? li.getBoundingClientRect().width + 16 : 300;
      car.scrollBy({ left: passo * +b.getAttribute('data-car'), behavior: ridotto.matches ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- Accordion ---------------- */
  $$('.acc__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var aperto = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', aperto ? 'false' : 'true');
      d.getElementById(b.getAttribute('aria-controls')).hidden = aperto;
    });
  });

  /* ---------------- Configuratore maglia ---------------- */
  var cfg = $('[data-config]');
  if (cfg) {
    var nomeIn = $('#m-nome', cfg), numIn = $('#m-num', cfg), btnWa = $('[data-config-wa]', cfg);
    var tNome = $('[data-maglia-nome]'), tNum = $('[data-maglia-num]'), corpo = $('[data-maglia-corpo]'), filetto = $('[data-maglia-filetto]');
    var titolo = $('#maglia-desc'), nomeColore = $('[data-colore-nome]');
    var colori = C.home.maglia.colori;
    function aggiornaMaglia() {
      var nome = nomeIn.value.toUpperCase().replace(/[^A-ZÀ-ÖØ-Ý' .\-]/g, '').slice(0, 12);
      if (nomeIn.value !== nome) { var pos = nomeIn.selectionStart; nomeIn.value = nome; try { nomeIn.setSelectionRange(pos, pos); } catch (e) {} }
      var num = numIn.value.replace(/\D/g, '').slice(0, 2);
      if (numIn.value !== num) numIn.value = num;
      var c = colori[+(($('input[name="colore"]:checked', cfg) || {}).value || 0)];
      tNome.textContent = nome || ' ';
      if (nome.length > 9) { tNome.setAttribute('textLength', String(Math.min(200, 21 * nome.length))); tNome.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
      else { tNome.removeAttribute('textLength'); tNome.removeAttribute('lengthAdjust'); }
      tNum.textContent = num;
      corpo.setAttribute('fill', c.hex);
      [tNome, tNum].forEach(function (t) { t.setAttribute('fill', c.testo); });
      filetto.setAttribute('stroke', c.testo);
      nomeColore.textContent = c.nome;
      titolo.textContent = 'Anteprima della maglia: ' + (nome || 'senza nome') + ', numero ' + (num || '–') + ', colore ' + c.nome;
      btnWa.href = waLink('Ciao, vorrei un preventivo per maglie personalizzate. Nome sul retro: ' + (nome || '-') + ', numero: ' + (num || '-') + ', colore: ' + c.nome + '. Quante maglie e in che tempi?');
    }
    cfg.addEventListener('input', aggiornaMaglia);
    cfg.addEventListener('change', aggiornaMaglia);
    cfg.addEventListener('submit', function (e) { e.preventDefault(); });
    aggiornaMaglia();
  }

  /* ---------------- Modulo "Chiedi disponibilità" ---------------- */
  var mod = $('[data-modulo]');
  if (mod) {
    var esito = $('[data-esito]', mod);
    var regole = {
      nome: function (v) { return v.trim().length >= 2 ? '' : 'Scrivi il tuo nome.'; },
      telefono: function (v) { return v.replace(/[^\d]/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.'; },
      sport: function (v) { return v ? '' : 'Scegli uno sport.'; },
      richiesta: function (v) { return v.trim().length >= 3 ? '' : 'Scrivi cosa cerchi.'; }
    };
    function controlla(campo) {
      var msg = regole[campo.name] ? regole[campo.name](campo.value) : '';
      var err = d.getElementById(campo.id + '-err');
      campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.textContent = msg; err.hidden = !msg; }
      return !msg;
    }
    $$('input[name], select, textarea', mod).forEach(function (c) {
      if (!regole[c.name]) return;
      c.addEventListener('blur', function () { if (c.value) controlla(c); });
      c.addEventListener('input', function () { if (c.getAttribute('aria-invalid') === 'true') controlla(c); });
    });
    mod.addEventListener('submit', function (e) {
      e.preventDefault();
      var campi = $$('input[name], select, textarea', mod).filter(function (c) { return regole[c.name]; });
      var ok = campi.map(controlla).every(Boolean);
      if (!ok) { var primo = $('[aria-invalid="true"]', mod); if (primo) primo.focus({ preventScroll: true }); esito.textContent = 'Controlla i campi evidenziati.'; return; }
      var v = function (n) { return mod.elements[n].value.trim(); };
      if (C.modulo.modalita === 'web3forms' && C.modulo.web3formsAccessKey) {
        esito.textContent = 'Invio in corso…';
        fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(mod))) })
          .then(function (r) { return r.json(); })
          .then(function (j) { if (!j.success) throw 0; mod.reset(); esito.textContent = 'Grazie! Ti rispondiamo appena possibile.'; })
          .catch(function () { esito.innerHTML = 'Invio non riuscito. Chiamaci al <a href="tel:' + C.contatti.telefonoLink + '">' + C.contatti.telefono + '</a>.'; });
        return;
      }
      var msg = 'Ciao ' + C.attivita.nome + ', sono ' + v('nome') + ' (tel. ' + v('telefono') + ').\nSport: ' + v('sport') + '\nCerco: ' + v('richiesta') + '\nMi dite se è disponibile?';
      var url = waLink(msg);
      mod.setAttribute('data-wa', url);
      esito.innerHTML = 'Messaggio pronto: si apre WhatsApp. Se non si apre, <a href="' + url + '" target="_blank" rel="noopener">tocca qui</a>.';
      window.open(url, '_blank', 'noopener');
    });
  }

  /* =====================================================================
     CATALOGO: dati, card prodotto, filtri, scheda prodotto
     ===================================================================== */
  var CAT = C.catalogo, TAG = CAT.taglie;
  var PROD = {};
  C.sport.forEach(function (s) { s.categorie.forEach(function (c) { (c.prodotti || []).forEach(function (p) { PROD[p.codice] = { p: p, s: s, c: c }; }); }); });
  var euro = function (n) { return Number(n).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }); };
  var escH = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var dispSlug = function (v) { return v.replace(/\s+/g, '-'); };
  var catUrl = function (s, c) { return REL + 'sport/' + s.slug + '/' + c.slug + '/index.html'; };
  var SVG = {
    chiudi: '<path d="M6 6l12 12M18 6 6 18"/>',
    sacchetto: '<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
    chat: '<path d="M4 18.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8z"/><path d="M8.5 9.5h7M8.5 13h4.5"/>',
    righello: '<path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
    cubo: '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
    ok: '<path d="m5 12 5 5 9-10"/>',
    sx: '<path d="M15 5l-7 7 7 7"/>',
    dx: '<path d="m9 5 7 7-7 7"/>',
    piu: '<path d="M12 5v14M5 12h14"/>',
    meno: '<path d="M5 12h14"/>'
  };
  var icona = function (k, cls) { return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + SVG[k] + '</svg>'; };

  // taglie di un prodotto divise per linea: [{ linea, valori }]
  function gruppiTaglia(p) {
    var t = TAG[p.taglia] || TAG.nessuna;
    if (p.misure) return [{ linea: p.linea === 'entrambe' ? (t.linea || 'entrambe') : p.linea, valori: p.misure }];
    var g = t.gruppi ? t.gruppi.map(function (x) { return typeof x === 'string' ? { linea: TAG[x].linea, valori: TAG[x].valori } : x; }) : [{ linea: t.linea || p.linea, valori: t.valori }];
    return g.filter(function (x) { return x.valori.length; });
  }
  var tutteTaglie = function (p) { return gruppiTaglia(p).reduce(function (a, x) { return a.concat(x.valori); }, []); };
  var nomeTaglia = function (p) { return (TAG[p.taglia] || {}).nome || 'Taglia'; };
  var ARTICOLO = { Numero: 'il numero', Taglia: 'la taglia', Misura: 'la misura', Peso: 'il peso', Lunghezza: 'la lunghezza', Impugnatura: "l'impugnatura", Diametro: 'il diametro', Mondopoint: 'la misura' };
  var scegliTxt = function (p) { return 'Scegli ' + (ARTICOLO[nomeTaglia(p)] || 'la taglia'); };
  // la taglia scelta è da bambino?
  function tagliaBimbo(p, t) {
    if (p.linea === 'bambino') return true;
    if (p.linea === 'adulto') return false;
    return gruppiTaglia(p).some(function (g) { return g.linea === 'bambino' && g.valori.indexOf(t) > -1; });
  }

  /* illustrazioni: aprendo il sito come file, Chrome blocca <use> verso un altro file → sprite inline */
  var SPRITE = REL + 'assets/img/prodotti.svg';
  if (location.protocol === 'file:') {
    var sc = d.createElement('script');
    sc.src = REL + 'js/prodotti-svg.js';
    sc.onload = function () {
      if (!window.SLANCIO_SVG) return;
      var box = d.createElement('div');
      box.setAttribute('aria-hidden', 'true');
      box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      box.innerHTML = window.SLANCIO_SVG;
      body.insertBefore(box, body.firstChild);
      SPRITE = '';
      $$('use').forEach(function (u) { var h = u.getAttribute('href') || ''; var i = h.indexOf('prodotti.svg#'); if (i > -1) u.setAttribute('href', h.slice(i + 12)); });
    };
    d.head.appendChild(sc);
  }
  function figura(p, cls) {
    if (p.foto && p.foto.length) return '<img class="' + cls + '" src="' + REL + p.foto[0] + '" alt="" width="480" height="480" decoding="async">';
    return '<svg class="' + cls + '" viewBox="0 0 160 160" style="color:' + p.colore + '" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#' + p.illustrazione + '"/></svg>';
  }

  /* ---------------- Borsa: dati (salvati solo nel browser) ---------------- */
  var CHIAVE = 'slancio-borsa', memoria = [];
  function pulisciBorsa(b) {
    return (Array.isArray(b) ? b : []).filter(function (x) {
      var r = x && PROD[x.c];
      return r && r.p.disponibilita !== 'esaurito' && (x.t === '' || tutteTaglie(r.p).indexOf(x.t) > -1);
    }).map(function (x) { return { c: x.c, t: x.t, q: Math.max(1, Math.min(9, x.q | 0 || 1)) }; });
  }
  function leggiBorsa() {
    try { var v = localStorage.getItem(CHIAVE); if (v !== null) return pulisciBorsa(JSON.parse(v)); } catch (e) {}
    return pulisciBorsa(memoria);
  }
  var ascolta = [];
  function salvaBorsa(b) {
    memoria = b;
    try { localStorage.setItem(CHIAVE, JSON.stringify(b)); } catch (e) {}
    ascolta.forEach(function (f) { f(b); });
  }
  var pezzi = function (b) { return b.reduce(function (a, x) { return a + x.q; }, 0); };
  function aggiungiBorsa(cod, t) {
    var r = PROD[cod];
    if (!r || r.p.disponibilita === 'esaurito') return false;
    var b = leggiBorsa(), x = b.filter(function (y) { return y.c === cod && y.t === t; })[0];
    if (x) x.q = Math.min(9, x.q + 1); else b.push({ c: cod, t: t, q: 1 });
    salvaBorsa(b);
    return true;
  }
  var conta = $$('[data-borsa-conta]');
  function aggiornaConta(b, salta) {
    var n = pezzi(b || leggiBorsa());
    conta.forEach(function (el) {
      el.textContent = n > 9 ? '9+' : n; el.hidden = !n;
      if (salta) { el.classList.remove('is-salto'); void el.offsetWidth; el.classList.add('is-salto'); }
    });
    $$('[data-borsa-apri]').forEach(function (bt) { bt.setAttribute('aria-label', 'Apri la borsa (' + C.borsa.nome + ')' + (n ? ': ' + n + (n === 1 ? ' prodotto' : ' prodotti') : ': vuota')); });
  }
  aggiornaConta();
  ascolta.push(function (b) { aggiornaConta(b, true); });
  addEventListener('storage', function (e) { if (e.key === CHIAVE) { var b = leggiBorsa(); ascolta.forEach(function (f) { f(b); }); } });

  /* ---------------- Avviso in basso ---------------- */
  var avviso, tAvviso;
  function mostraAvviso(testo, bottone, azione) {
    if (!avviso) {
      avviso = d.createElement('div'); avviso.className = 'avviso'; avviso.setAttribute('role', 'status'); avviso.hidden = true;
      avviso.innerHTML = '<span data-t></span><button type="button"></button>';
      body.appendChild(avviso);
    }
    $('[data-t]', avviso).textContent = testo;
    var bt = $('button', avviso); bt.hidden = !bottone; bt.textContent = bottone || '';
    bt.onclick = function () { avviso.hidden = true; if (azione) azione(bt); };
    avviso.hidden = false;
    clearTimeout(tAvviso); tAvviso = setTimeout(function () { avviso.hidden = true; }, 4200);
  }

  /* ---------------- Pannelli (scheda, borsa, guida, 3D): accessibili ---------------- */
  var pila = [];
  function Pannello(id, opz) {
    opz = opz || {};
    var el = d.createElement('div');
    el.className = 'pan' + (opz.cls ? ' ' + opz.cls : '');
    el.id = id; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', id + '-tit');
    el.innerHTML = '<div class="pan__velo" data-pan-chiudi></div><div class="pan__box" tabindex="-1"><div class="pan__testa"><h2 class="pan__tit" id="' + id + '-tit"></h2><button class="hdr__ico pan__x" type="button" data-pan-chiudi aria-label="Chiudi">' + icona('chiudi') + '</button></div><div class="pan__corpo"></div><div class="pan__piede" hidden></div></div>';
    body.appendChild(el);
    var P = { el: el, box: $('.pan__box', el), tit: $('.pan__tit', el), corpo: $('.pan__corpo', el), piede: $('.pan__piede', el), ritorno: null, onChiudi: opz.onChiudi };
    P.apri = function (da) {
      if (!el.hidden) return;
      P.ritorno = da || d.activeElement;
      if (avviso) avviso.hidden = true;
      body.appendChild(el);                       // sempre sopra agli altri pannelli
      el.hidden = false; pila.push(P); bloccaScroll(true);
      P.corpo.scrollTop = 0;
      P.box.focus({ preventScroll: true });
    };
    P.chiudi = function (senzaFocus) {
      if (el.hidden) return;
      el.hidden = true; pila.splice(pila.indexOf(P), 1); bloccaScroll(false);
      if (P.onChiudi) P.onChiudi();
      if (!senzaFocus && P.ritorno && d.contains(P.ritorno)) P.ritorno.focus({ preventScroll: true });
    };
    el.addEventListener('click', function (e) { if (e.target.closest('[data-pan-chiudi]')) P.chiudi(); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Tab') intrappola(P.box, e); });
    // iPhone: il velo non deve far scorrere la pagina sotto
    $('.pan__velo', el).addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    return P;
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pila.length) { e.preventDefault(); e.stopPropagation(); pila[pila.length - 1].chiudi(); }
  }, true);

  /* ---------------- Scelta della taglia e "Aggiungi" (card) ---------------- */
  function messaggio(el, testo, tipo) {
    if (!el) return;
    el.textContent = testo || '';
    el.classList.toggle('is-err', tipo === 'err'); el.classList.toggle('is-ok', tipo === 'ok');
  }
  function fatto(btn, testo) {
    var prima = btn.innerHTML;
    btn.classList.add('is-fatto'); btn.innerHTML = icona('ok', 'ico ico--s') + testo;
    setTimeout(function () { btn.classList.remove('is-fatto'); btn.innerHTML = prima; }, 1600);
  }
  var apriBorsa = function () {};               // sostituita dal pannello borsa
  function linkApriBorsa(el) {
    var b = d.createElement('button'); b.type = 'button'; b.className = 'link-borsa'; b.textContent = 'Apri la borsa';
    b.addEventListener('click', function () { apriBorsa(b); }); el.appendChild(b);
  }
  function avvisoAggiunto(p, t) {
    mostraAvviso('Nella borsa: ' + p.nome + (t ? ' · ' + t : ''), 'Apri la borsa', function () { apriBorsa(); });
  }
  d.addEventListener('change', function (e) {
    var s = e.target.closest('[data-taglia]'); if (!s) return;
    var card = s.closest('[data-prod]'), btn = $('[data-aggiungi]', card);
    s.classList.remove('is-err');
    if (s.value) { btn.removeAttribute('aria-disabled'); messaggio($('[data-msg]', card), ''); }
    else { btn.setAttribute('aria-disabled', 'true'); messaggio($('[data-msg]', card), scegliTxt(PROD[card.getAttribute('data-prod')].p)); }
  });
  d.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-aggiungi]'); if (!btn || btn.closest('.pan')) return;
    var card = btn.closest('[data-prod]'), r = PROD[card.getAttribute('data-prod')]; if (!r) return;
    var s = $('[data-taglia]', card), msg = $('[data-msg]', card);
    var tt = tutteTaglie(r.p), t = s ? s.value : (tt.length === 1 ? tt[0] : '');
    if (s && !t) {
      s.classList.add('is-err'); messaggio(msg, scegliTxt(r.p) + ' prima di aggiungere.', 'err');
      s.focus({ preventScroll: true }); return;
    }
    if (aggiungiBorsa(r.p.codice, t)) { fatto(btn, 'Aggiunto'); messaggio(msg, 'Nella borsa' + (t ? ' · ' + t : ''), 'ok'); avvisoAggiunto(r.p, t); }
  });

  /* ---------------- Filtri della pagina categoria ---------------- */
  var filtri = $('[data-filtri]'), griglia = $('[data-griglia]');
  if (filtri && griglia) {
    var voci = $$('li', griglia), fPan = $('[data-filtri-pan]'), fApri = $('[data-filtri-apri]'), fBox = $('.filtri__box', filtri);
    var tel = matchMedia('(max-width: 1023px)'), fRitorno;
    var applica = function () {
      var linea = ($('input[name="linea"]:checked', filtri) || {}).value || 'tutti';
      var negozio = $('input[name="negozio"]', filtri).checked;
      var pr = $('select[name="prezzo"]', filtri), fascia = pr && pr.value ? pr.value.split('-').map(Number) : null;
      var ord = $('[data-ordina]', filtri).value, n = 0;
      voci.forEach(function (li) {
        var c = $('[data-prod]', li), l = c.getAttribute('data-linea'), prezzo = +c.getAttribute('data-prezzo');
        var ok = (linea === 'tutti' || l === linea || l === 'entrambe') && (!negozio || c.getAttribute('data-disp') === 'in-negozio') && (!fascia || (prezzo > fascia[0] && prezzo <= fascia[1]));
        li.hidden = !ok; if (ok) n++;
      });
      voci.slice().sort(function (a, b) {
        if (ord === 'consigliati') return a.getAttribute('data-ord') - b.getAttribute('data-ord');
        var pa = +$('[data-prod]', a).getAttribute('data-prezzo'), pb = +$('[data-prod]', b).getAttribute('data-prezzo');
        return ord === 'su' ? pa - pb : pb - pa;
      }).forEach(function (li) { griglia.appendChild(li); });
      $('[data-n-ris]').textContent = n;
      $('[data-conta-txt]').textContent = n === 1 ? 'prodotto' : 'prodotti';
      $$('[data-conta-btn]').forEach(function (x) { x.textContent = n + (n === 1 ? ' prodotto' : ' prodotti'); });
      $('[data-vuoto]').hidden = n > 0;
      var attivi = (linea !== 'tutti') + negozio + !!fascia, bn = $('[data-filtri-n]');
      bn.textContent = attivi; bn.hidden = !attivi;
      if (hasGsap) window.ScrollTrigger.refresh();
    };
    filtri.addEventListener('change', applica);
    $$('[data-azzera]').forEach(function (b) {
      b.addEventListener('click', function () {
        $('input[name="linea"][value="tutti"]', filtri).checked = true;
        $('input[name="negozio"]', filtri).checked = false;
        var pr = $('select[name="prezzo"]', filtri); if (pr) pr.value = '';
        applica();
      });
    });
    var fChiudi = function () {
      if (!fPan.classList.contains('is-aperto')) return;
      fPan.classList.remove('is-aperto'); filtri.classList.remove('is-aperto'); fPan.removeAttribute('role'); fPan.removeAttribute('aria-modal');
      fApri.setAttribute('aria-expanded', 'false'); bloccaScroll(false);
      (fRitorno || fApri).focus({ preventScroll: true });
    };
    fApri.addEventListener('click', function () {
      fRitorno = fApri;
      fPan.classList.add('is-aperto'); filtri.classList.add('is-aperto'); fPan.setAttribute('role', 'dialog'); fPan.setAttribute('aria-modal', 'true');
      fApri.setAttribute('aria-expanded', 'true'); bloccaScroll(true);
      fBox.focus({ preventScroll: true });
    });
    $$('[data-filtri-chiudi]', filtri).forEach(function (b) { b.addEventListener('click', fChiudi); });
    fPan.addEventListener('keydown', function (e) {
      if (!fPan.classList.contains('is-aperto')) return;
      if (e.key === 'Escape') { e.stopPropagation(); fChiudi(); } else intrappola(fBox, e);
    });
    $('.filtri__velo', filtri).addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
    (tel.addEventListener ? tel.addEventListener.bind(tel, 'change') : tel.addListener.bind(tel))(function () { if (!tel.matches) fChiudi(); });
    // ripristino dopo "indietro" (il browser ricorda i campi)
    addEventListener('pageshow', applica);
    applica();
  }

  /* ---------------- Scheda prodotto (pannello laterale / foglio dal basso) ---------------- */
  var scheda, schedaCod = null, schedaStorico = false;
  var HASH_P = /^#prodotto-([A-Z0-9-]+)$/;
  function schedaHtmlTaglie(p) {
    var g = gruppiTaglia(p), tt = tutteTaglie(p);
    if (!tt.length) return '';
    if (tt.length === 1) return '<div class="scheda__taglie"><div class="scheda__tt"><p>' + escH(nomeTaglia(p)) + ': ' + escH(tt[0]) + '</p></div></div>';
    var k = 0;
    var gruppi = g.map(function (x) {
      return (g.length > 1 ? '<p class="chip-taglie__gr">' + (x.linea === 'bambino' ? 'Bambino' : 'Adulto') + '</p>' : '') +
        x.valori.map(function (v) { k++; return '<label><input type="radio" name="taglia-scheda" value="' + escH(v) + '"><span>' + escH(v) + '</span></label>'; }).join('');
    }).join('');
    return '<fieldset class="scheda__taglie" style="border:0;padding:0;margin-inline:0;min-width:0"><div class="scheda__tt"><legend style="float:left;padding:0"><p>' + escH(nomeTaglia(p)) + '</p></legend>' +
      (guidaTabPer(p) ? '<a class="link" href="#guida-taglie" data-guida data-guida-tab="' + guidaTabPer(p) + '">' + icona('righello', 'ico ico--s') + 'Guida taglie</a>' : '') +
      '</div><div class="chip-taglie" data-chip-taglie>' + gruppi + '</div></fieldset>';
  }
  function guidaTabPer(p) {
    var k = (TAG[p.taglia] || {}).guida || '';
    return k === 'abb-bambino' && p.linea !== 'bambino' ? 'abb-adulto' : k;
  }
  function apriScheda(cod, da, storico) {
    var r = PROD[cod]; if (!r) return;
    var p = r.p, s = r.s, c = r.c, esaurito = p.disponibilita === 'esaurito';
    if (!scheda) scheda = Pannello('scheda', { onChiudi: function () { schedaCod = null; if (HASH_P.test(location.hash)) { if (schedaStorico) { schedaStorico = false; history.back(); } else history.replaceState(null, '', location.pathname + location.search); } } });
    schedaCod = cod;
    scheda.el.style.setProperty('--acc', s.accento); scheda.el.style.setProperty('--acc-ink', s.testoAccento);
    scheda.tit.textContent = s.nome + ' · ' + c.titolo.replace(/\s*\(.*\)$/, '');
    var foto = (p.foto || []);
    var galleria = foto.length
      ? '<div class="scheda__pista" data-pista>' + foto.map(function (f, i) { return '<div class="scheda__foto"><img src="' + REL + f + '" alt="' + escH(p.nome) + ' – foto ' + (i + 1) + ' di ' + foto.length + '" width="960" height="720" decoding="async"></div>'; }).join('') + '</div>' +
        (foto.length > 1 ? '<div class="scheda__miniature">' + foto.map(function (f, i) { return '<button type="button" data-mini="' + i + '"' + (i ? '' : ' aria-current="true"') + ' aria-label="Foto ' + (i + 1) + '"><img src="' + REL + f + '" alt="" width="56" height="56"></button>'; }).join('') + '</div>' : '')
      : '<div class="scheda__pista"><div class="scheda__foto">' + figura(p, 'scheda__ill') + '</div></div>';
    var bimbo = p.linea === 'bambino' ? '<span class="bimbo">Bambino</span>' : p.linea === 'entrambe' ? '<span class="bimbo bimbo--anche">Anche bambino</span>' : '';
    scheda.corpo.innerHTML =
      '<div class="scheda__galleria">' + galleria + bimbo +
        (p.modello3d ? '<button class="btn btn--pri btn--sm scheda__3d" type="button" data-3d="' + p.codice + '">' + icona('cubo', 'ico ico--s') + 'Vedi in 3D</button>' : '') + '</div>' +
      '<div class="scheda__testa"><p class="scheda__cod">Codice ' + p.codice + '</p><h3 class="scheda__nome">' + escH(p.nome) + '</h3>' +
        '<div class="scheda__riga"><p class="scheda__prezzo">' + euro(p.prezzo) + '</p><p class="disp disp--' + dispSlug(p.disponibilita) + '">' + escH(CAT.disponibilita[p.disponibilita]) + '</p>' +
        '<span class="scheda__linea">' + escH(CAT.linee[p.linea] || '') + '</span></div></div>' +
      '<p class="scheda__desc">' + escH(p.descrizione) + '</p>' +
      (esaurito ? '' : schedaHtmlTaglie(p)) +
      '<p class="scheda__msg" data-scheda-msg aria-live="polite"></p>' +
      '<div class="scheda__info"><p style="margin:0">' + escH(CAT.etichettaEsempio) + '.</p><p style="margin:0">Categoria: <a href="' + catUrl(s, c) + '">' + escH(c.titolo) + '</a></p></div>' +
      '<section class="insieme" data-insieme hidden aria-labelledby="ins-tit"><h3 class="insieme__tit" id="ins-tit">Spesso comprati insieme</h3><div class="insieme__lista" data-insieme-lista></div></section>';
    scheda.piede.hidden = false;
    scheda.piede.innerHTML = esaurito
      ? '<div class="scheda__az" style="grid-template-columns:1fr"><a class="btn btn--pri" href="' + waLink('Ciao ' + C.attivita.nome + ', il prodotto ' + p.codice + ' (' + p.nome + ') risulta esaurito: mi avvisate quando arriva?') + '" target="_blank" rel="noopener">' + icona('chat', 'ico ico--s') + 'Chiedi quando arriva</a></div>'
      : '<div class="scheda__az"><button class="btn btn--pri" type="button" data-scheda-agg>' + icona('sacchetto', 'ico ico--s') + 'Aggiungi alla borsa</button><a class="btn btn--sec scheda__wa" href="' + waLink('Ciao ' + C.attivita.nome + ', una domanda sul prodotto ' + p.codice + ' (' + p.nome + ').') + '" target="_blank" rel="noopener" aria-label="Fai una domanda su WhatsApp">' + icona('chat', 'ico ico--s') + '</a></div>';
    var agg = $('[data-scheda-agg]', scheda.piede), chips = $('[data-chip-taglie]', scheda.corpo), msg = $('[data-scheda-msg]', scheda.corpo);
    var tt = tutteTaglie(p);
    // taglia già scelta nella card della pagina
    var sCard = $('[data-prod="' + p.codice + '"] [data-taglia]');
    if (chips && sCard && sCard.value) { var pre = $('input[value="' + sCard.value.replace(/"/g, '\\"') + '"]', chips); if (pre) pre.checked = true; }
    if (chips) chips.addEventListener('change', function () { chips.classList.remove('is-err'); messaggio(msg, ''); aggiornaInsieme(); });
    if (agg) agg.addEventListener('click', function () {
      var sel = chips && $('input:checked', chips), t = sel ? sel.value : (tt.length === 1 ? tt[0] : '');
      if (chips && !sel) { chips.classList.add('is-err'); messaggio(msg, scegliTxt(p) + ' prima di aggiungere.', 'err'); var pr = $('input', chips); if (pr) pr.focus({ preventScroll: true }); return; }
      if (aggiungiBorsa(p.codice, t)) { fatto(agg, 'Aggiunto alla borsa'); messaggio(msg, 'Nella borsa' + (t ? ' · ' + t : '') + '. ', 'ok'); linkApriBorsa(msg); aggiornaInsieme(); }
    });
    galleriaAttiva(scheda.corpo);
    aggiornaInsieme();
    if (storico) { history.pushState({ prodotto: cod }, '', '#prodotto-' + cod); schedaStorico = true; }
    else if (HASH_P.test(location.hash) && location.hash !== '#prodotto-' + cod) history.replaceState(history.state, '', '#prodotto-' + cod);
    if (scheda.el.hidden) scheda.apri(da);
    else { scheda.corpo.scrollTop = 0; scheda.box.focus({ preventScroll: true }); }
  }
  function galleriaAttiva(box) {
    var pista = $('[data-pista]', box); if (!pista) return;
    var mini = $$('[data-mini]', box);
    mini.forEach(function (b) { b.addEventListener('click', function () { pista.scrollTo({ left: pista.clientWidth * +b.getAttribute('data-mini'), behavior: ridotto.matches ? 'auto' : 'smooth' }); }); });
    pista.addEventListener('scroll', function () {
      var i = Math.round(pista.scrollLeft / pista.clientWidth);
      mini.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }, { passive: true });
    // zoom: clic o tocco sulla foto, il punto toccato resta sotto il dito
    $$('.scheda__foto img', pista).forEach(function (im) {
      im.addEventListener('click', function (e) {
        var f = im.parentElement, on = !f.classList.contains('is-zoom'), r = im.getBoundingClientRect();
        im.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
        f.classList.toggle('is-zoom', on);
      });
    });
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-apri], a[href^="#prodotto-"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var m = HASH_P.exec(a.getAttribute('href')); if (!m || !PROD[m[1]]) return;
    e.preventDefault();
    apriScheda(m[1], a.closest('[data-prod]') ? $('.pc__nome a', a.closest('[data-prod]')) : a, !HASH_P.test(location.hash));
  });
  function daHash() {
    var m = HASH_P.exec(location.hash);
    if (m && PROD[m[1]]) { if (schedaCod !== m[1]) apriScheda(m[1], null, false); }
    else if (scheda && !scheda.el.hidden) { schedaStorico = false; scheda.chiudi(); }
  }
  addEventListener('popstate', function () { schedaStorico = false; daHash(); });
  addEventListener('hashchange', daHash);
  if (HASH_P.test(location.hash)) daHash();

  /* =====================================================================
     BORSA "Prenota e ritira": lista, modulo, codice, condivisione
     ===================================================================== */
  var B = C.borsa, borsaP, vista = 'lista', bozza = { nome: '', telefono: '', quando: '', note: '' }, ultimo = null, inArrivo = null;
  var GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var totale = function (b) { return b.reduce(function (a, x) { return a + PROD[x.c].p.prezzo * x.q; }, 0); };
  var nProd = function (n) { return n + (n === 1 ? ' prodotto' : ' prodotti'); };
  // date (ora italiana)
  var isoDa = function (y, m, g) { return y + '-' + pad(m) + '-' + pad(g); };
  function oggiRoma() { var p = partiRoma(new Date()); return { iso: isoDa(p.y, p.m, p.d), min: p.h * 60 + p.min }; }
  function giorno(iso) { var a = iso.split('-').map(Number), t = new Date(Date.UTC(a[0], a[1] - 1, a[2])); return { y: a[0], m: a[1], d: a[2], dow: t.getUTCDay(), ms: t.getTime() }; }
  var piuGiorni = function (iso, n) { var t = new Date(giorno(iso).ms + n * 864e5); return isoDa(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); };
  var distanza = function (a, b) { return Math.round((giorno(b).ms - giorno(a).ms) / 864e5); };
  var dataLunga = function (iso) { var g = giorno(iso); return GIORNI[g.dow] + ' ' + g.d + ' ' + MESI[g.m - 1]; };
  var fasceDi = function (iso) { var g = giorno(iso); return fasceGiorno(g.y, g.m, g.d, g.dow); };
  function controllaData(v) {
    var N = B.giorniMassimi || 7, o = oggiRoma();
    if (!v) return 'Scegli il giorno in cui pensi di passare.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Scrivi la data nel formato giorno/mese/anno.';
    var dd = distanza(o.iso, v);
    if (dd < 0) return 'Questa data è già passata: scegli oggi o uno dei prossimi ' + N + ' giorni.';
    if (dd > N) return 'Puoi scegliere al massimo i prossimi ' + N + ' giorni (fino a ' + dataLunga(piuGiorni(o.iso, N)) + ').';
    var f = fasceDi(v);
    if (!f.length) return dataLunga(v).replace(/^./, function (c) { return c.toUpperCase(); }) + ' il negozio è chiuso: scegli un altro giorno.';
    if (dd === 0 && o.min >= minuti(f[f.length - 1][1]) - 30) return 'Oggi il negozio sta chiudendo: scegli un altro giorno.';
    return '';
  }
  var REGOLE_B = {
    nome: function (v) { return v.trim().length >= 2 ? '' : 'Scrivi il tuo nome.'; },
    telefono: function (v) { return v.replace(/\D/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.'; },
    quando: controllaData,
    note: function () { return ''; }
  };
  // codice SL-XXXX senza 0, O, 1, I
  function nuovoCodice() {
    var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = new Uint32Array(4), s = '';
    (window.crypto || window.msCrypto).getRandomValues(r);
    for (var i = 0; i < 4; i++) s += A[r[i] % A.length];
    return (B.prefissoCodice || 'SL') + '-' + s;
  }
  function testoRichiesta(cod, v, b) {
    return 'Ciao ' + C.attivita.nome + ', vorrei verificare la disponibilità (' + B.nome + ').\n' +
      'Codice: ' + cod + '\nNome: ' + v.nome + '\nTelefono: ' + v.telefono + '\nPasso in negozio: ' + dataLunga(v.quando) + '\n\nProdotti:\n' +
      b.map(function (x, i) { var p = PROD[x.c].p; return (i + 1) + ') ' + p.codice + ' · ' + p.nome + (x.t ? ' · ' + nomeTaglia(p) + ' ' + x.t : '') + ' · quantità ' + x.q; }).join('\n') +
      '\n\nTotale di esempio: ' + euro(totale(b)) + (v.note ? '\nNote: ' + v.note : '');
  }
  // link per condividere la borsa: #borsa=CODICE~TAGLIA~Q!...
  function linkBorsa(b) {
    var h = b.map(function (x) { return [x.c, x.t, x.q].map(encodeURIComponent).join('~'); }).join('!');
    return location.href.split('#')[0] + '#borsa=' + h;
  }
  function leggiLink(h) {
    try {
      return pulisciBorsa(h.replace(/^#borsa=/, '').split('!').filter(Boolean).map(function (v) { var a = v.split('~').map(decodeURIComponent); return { c: a[0], t: a[1] || '', q: +a[2] || 1 }; }));
    } catch (e) { return []; }
  }
  function copia(testo, bt, ok) {
    var fatto2 = function () { var p = bt.innerHTML; bt.innerHTML = icona('ok', 'ico ico--s') + (ok || 'Copiato'); setTimeout(function () { bt.innerHTML = p; }, 1800); };
    var vecchio = function () {
      var t = d.createElement('textarea'); t.value = testo; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      body.appendChild(t); t.select(); var r = false; try { r = d.execCommand('copy'); } catch (e) {} body.removeChild(t);
      if (r) fatto2(); else window.prompt('Copia questo testo:', testo);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(testo).then(fatto2, vecchio); else vecchio();
  }

  function rigaBorsa(x) {
    var r = PROD[x.c], p = r.p, k = x.c + '|' + x.t;
    return '<li class="bv" data-k="' + escH(k) + '" style="--acc:' + r.s.accento + '">' +
      '<a class="bv__media" href="#prodotto-' + p.codice + '" tabindex="-1" aria-hidden="true">' + figura(p, 'bv__ill') + '</a>' +
      '<div class="bv__info"><p class="bv__cod">' + p.codice + '</p><p class="bv__nome"><a href="#prodotto-' + p.codice + '">' + escH(p.nome) + '</a></p>' +
      '<p class="bv__det">' + (x.t ? escH(nomeTaglia(p)) + ' <b>' + escH(x.t) + '</b>' + (tagliaBimbo(p, x.t) && p.linea !== 'adulto' ? ' · bambino' : '') + ' · ' : '') + euro(p.prezzo) + '</p></div>' +
      '<div class="bv__az"><div class="passi" role="group" aria-label="Quantità di ' + escH(p.nome) + '">' +
        '<button type="button" data-q="-1"' + (x.q <= 1 ? ' aria-disabled="true"' : '') + ' aria-label="Uno in meno">' + icona('meno', 'ico ico--s') + '</button>' +
        '<output aria-live="polite">' + x.q + '</output>' +
        '<button type="button" data-q="1"' + (x.q >= 9 ? ' aria-disabled="true"' : '') + ' aria-label="Uno in più">' + icona('piu', 'ico ico--s') + '</button></div>' +
      '<button class="bv__togli" type="button" data-togli>Rimuovi</button></div>' +
      '<p class="bv__tot">' + euro(p.prezzo * x.q) + '</p></li>';
  }
  function campoB(id, nome, etich, tipo, extra, aiuto) {
    var v = escH(bozza[nome] || '');
    var input = tipo === 'textarea' ? '<textarea id="' + id + '" name="' + nome + '" rows="3" maxlength="400"' + (extra || '') + '>' + v + '</textarea>'
      : '<input id="' + id + '" name="' + nome + '" type="' + tipo + '" value="' + v + '"' + (extra || '') + '>';
    return '<div class="campo"><label for="' + id + '">' + etich + '</label>' + input + (aiuto || '') + '<p class="campo__err" id="' + id + '-err" hidden></p></div>';
  }
  function chipGiorni() {
    var o = oggiRoma(), N = B.giorniMassimi || 7, h = '';
    for (var i = 0; i <= N; i++) {
      var iso = piuGiorni(o.iso, i), g = giorno(iso), f = fasceDi(iso), chiuso = !f.length || (i === 0 && o.min >= minuti(f[f.length - 1][1]) - 30);
      h += '<button type="button" class="giorni__b" data-giorno="' + iso + '"' + (chiuso ? ' disabled' : '') + ' aria-pressed="' + (bozza.quando === iso) + '" aria-label="' + dataLunga(iso) + (chiuso ? ', chiuso' : '') + '">' +
        '<span>' + (i === 0 ? 'oggi' : i === 1 ? 'domani' : GG[g.dow]) + '</span><b>' + g.d + '</b><span>' + (chiuso ? 'chiuso' : MESI[g.m - 1].slice(0, 3)) + '</span></button>';
    }
    return '<div class="giorni" role="group" aria-label="Scegli velocemente il giorno">' + h + '</div>';
  }
  function disegnaBorsa(focusSu) {
    if (!borsaP) return;
    var b = leggiBorsa(), P = borsaP;
    P.el.setAttribute('data-vista', vista);
    if (vista === 'lista' && !b.length) {
      P.tit.textContent = B.nome;
      P.corpo.innerHTML = '<div class="borsa__vuota"><span class="borsa__ico">' + icona('sacchetto', 'ico') + '</span><p class="borsa__vtit">La borsa è vuota</p>' +
        '<p>Scegli i prodotti e la taglia: ci mandi la borsa, ti diciamo cosa c\'è e lo ritiri in negozio.</p>' +
        '<ul class="borsa__sport">' + C.sport.map(function (s) { return '<li><a class="chip" href="' + REL + 'sport/' + s.slug + '/index.html" style="--acc:' + s.accento + '">' + escH(s.nome) + '</a></li>'; }).join('') + '</ul></div>';
      P.piede.hidden = true;
    } else if (vista === 'lista') {
      P.tit.textContent = B.nome + ' · ' + nProd(pezzi(b));
      P.corpo.innerHTML = '<p class="borsa__intro">' + escH(B.testoBorsa) + '</p>' +
        '<ul class="borsa__lista">' + b.map(rigaBorsa).join('') + '</ul>' +
        '<div class="borsa__strumenti"><button class="link-borsa" type="button" data-condividi>Condividi la borsa</button><button class="link-borsa link-borsa--grigio" type="button" data-svuota>Svuota</button></div>' +
        '<section class="insieme" data-borsa-ins hidden aria-labelledby="bins-tit"><h3 class="insieme__tit" id="bins-tit">Ti potrebbe servire anche</h3><div class="insieme__lista" data-insieme-lista></div></section>';
      P.piede.hidden = false;
      P.piede.innerHTML = '<div class="borsa__tot"><span>Totale di esempio</span><b>' + euro(totale(b)) + '</b></div><button class="btn btn--pri borsa__vai" type="button" data-vista="modulo">Verifica disponibilità in negozio ' + icona('dx', 'ico ico--s') + '</button>';
      suggerimentiBorsa();
    } else if (vista === 'modulo') {
      P.tit.textContent = 'Verifica disponibilità';
      var o = oggiRoma();
      P.corpo.innerHTML = '<button class="link-borsa borsa__indietro" type="button" data-vista="lista">' + icona('sx', 'ico ico--s') + 'Torna alla borsa (' + nProd(pezzi(b)) + ', ' + euro(totale(b)) + ')</button>' +
        '<h3 class="borsa__h" tabindex="-1" data-h>Dove ti rispondiamo e quando passi</h3>' +
        '<form class="borsa__form" id="borsa-form" novalidate>' +
        campoB('b-nome', 'nome', 'Nome', 'text', ' autocomplete="name" required') +
        campoB('b-tel', 'telefono', 'Telefono', 'tel', ' autocomplete="tel" inputmode="tel" required') +
        campoB('b-quando', 'quando', 'Quando pensi di passare', 'date', ' min="' + o.iso + '" max="' + piuGiorni(o.iso, B.giorniMassimi || 7) + '" required aria-describedby="b-quando-aiuto"',
          '<p class="campo__aiuto" id="b-quando-aiuto" data-quando-aiuto>Entro ' + (B.giorniMassimi || 7) + ' giorni, nei giorni di apertura.</p>' + chipGiorni()) +
        campoB('b-note', 'note', 'Note (facoltative)', 'textarea', ' placeholder="Es. vorrei provare anche il numero più grande"') +
        '<p class="form__privacy">I dati inviati servono solo per rispondere alla tua richiesta. <a href="' + REL + 'privacy.html">Leggi l\'informativa privacy</a></p>' +
        '</form><p class="borsa__esito" data-esito-b role="status"></p>';
      P.piede.hidden = false;
      P.piede.innerHTML = '<button class="btn btn--pri borsa__vai" type="submit" form="borsa-form">' + (C.modulo.modalita === 'web3forms' && C.modulo.web3formsAccessKey ? 'Invia la richiesta' : 'Invia la richiesta su WhatsApp') + '</button>';
      attivaModulo();
    } else if (vista === 'fatto' && ultimo) {
      P.tit.textContent = 'Richiesta pronta';
      P.corpo.innerHTML = '<div class="codice"><p class="codice__et">Il tuo codice</p><p class="codice__val" data-h tabindex="-1">' + ultimo.codice + '</p>' +
        '<button class="btn btn--sec btn--sm" type="button" data-copia-cod>Copia</button></div>' +
        '<p class="codice__testo">' + escH(B.testoConferma) + '</p>' +
        (ultimo.wa ? '<p class="codice__testo">Se WhatsApp non si è aperto: <a class="link" href="' + ultimo.wa + '" target="_blank" rel="noopener">apri il messaggio</a>.</p>' : '') +
        '<p class="codice__riep">' + escH(ultimo.riepilogo) + '</p>';
      P.piede.hidden = false;
      P.piede.innerHTML = '<div class="borsa__due"><button class="btn btn--sec" type="button" data-svuota-fine>Svuota la borsa</button><button class="btn btn--pri" type="button" data-pan-chiudi>Fatto</button></div>';
    } else if (vista === 'importa' && inArrivo) {
      P.tit.textContent = 'Borsa condivisa';
      P.corpo.innerHTML = '<h3 class="borsa__h" tabindex="-1" data-h>Ti hanno mandato una borsa con ' + nProd(pezzi(inArrivo)) + '</h3>' +
        '<p class="borsa__intro">Nella tua borsa ci sono già ' + nProd(pezzi(b)) + '. Cosa vuoi fare?</p>' +
        '<ul class="borsa__lista borsa__lista--mini">' + inArrivo.map(function (x) { var p = PROD[x.c].p; return '<li>' + escH(p.nome) + (x.t ? ' · ' + escH(x.t) : '') + ' × ' + x.q + '</li>'; }).join('') + '</ul>';
      P.piede.hidden = false;
      P.piede.innerHTML = '<div class="borsa__tre"><button class="btn btn--pri" type="button" data-importa="sostituisci">Sostituisci la mia borsa</button><button class="btn btn--sec" type="button" data-importa="unisci">Aggiungi alla mia</button><button class="link-borsa" type="button" data-importa="no">Tieni la mia borsa</button></div>';
    }
    if (focusSu) {
      var f = focusSu === 'h' ? $('[data-h]', P.corpo) : $('[data-k="' + focusSu.k.replace(/"/g, '\\"') + '"] ' + focusSu.sel, P.corpo);
      (f || P.box).focus({ preventScroll: true });   // aria-disabled lascia il pulsante raggiungibile
    }
  }
  function attivaModulo() {
    var f = $('#borsa-form'), aiuto = $('[data-quando-aiuto]');
    var mostraErr = function (c) {
      var msg = REGOLE_B[c.name](c.value), e = d.getElementById(c.id + '-err');
      c.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) c.setAttribute('aria-errormessage', c.id + '-err'); else c.removeAttribute('aria-errormessage');
      e.textContent = msg; e.hidden = !msg;
      return !msg;
    };
    var orariGiorno = function () {
      var v = f.elements.quando.value;
      if (v && !controllaData(v)) aiuto.textContent = dataLunga(v).replace(/^./, function (c) { return c.toUpperCase(); }) + ': aperti ' + fasceDi(v).map(function (x) { return ora(x[0]) + '–' + ora(x[1]); }).join(' e ') + '.';
      else aiuto.textContent = 'Entro ' + (B.giorniMassimi || 7) + ' giorni, nei giorni di apertura.';
      $$('[data-giorno]', f).forEach(function (g) { g.setAttribute('aria-pressed', g.getAttribute('data-giorno') === v ? 'true' : 'false'); });
    };
    $$('input, textarea', f).forEach(function (c) {
      c.addEventListener('input', function () { bozza[c.name] = c.value; if (c.getAttribute('aria-invalid') === 'true' || c.name === 'quando') mostraErr(c); if (c.name === 'quando') orariGiorno(); });
      c.addEventListener('blur', function () { if (c.value) mostraErr(c); });
    });
    f.elements.quando.addEventListener('change', function () { bozza.quando = this.value; mostraErr(this); orariGiorno(); });
    $$('[data-giorno]', f).forEach(function (g) {
      g.addEventListener('click', function () { var q = f.elements.quando; q.value = g.getAttribute('data-giorno'); bozza.quando = q.value; mostraErr(q); orariGiorno(); });
    });
    orariGiorno();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var campi = $$('input, textarea', f), ok = campi.map(mostraErr).every(Boolean), esito = $('[data-esito-b]');
      if (!ok) { esito.textContent = 'Controlla i campi evidenziati.'; var pr = $('[aria-invalid="true"]', f); if (pr) pr.focus({ preventScroll: true }); return; }
      var b = leggiBorsa(); if (!b.length) { vista = 'lista'; disegnaBorsa('h'); return; }
      var v = { nome: f.elements.nome.value.trim(), telefono: f.elements.telefono.value.trim(), quando: f.elements.quando.value, note: f.elements.note.value.trim() };
      var cod = nuovoCodice(), testo = testoRichiesta(cod, v, b);
      var riep = nProd(pezzi(b)) + ' · ' + euro(totale(b)) + ' (prezzo di esempio) · passi ' + dataLunga(v.quando);
      if (C.modulo.modalita === 'web3forms' && C.modulo.web3formsAccessKey) {
        esito.textContent = 'Invio in corso…';
        var bt = $('.borsa__vai', borsaP.piede); bt.setAttribute('aria-disabled', 'true');
        fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: C.modulo.web3formsAccessKey, subject: B.nome + ' ' + cod + ' – ' + v.nome, from_name: 'Sito ' + C.attivita.nome, codice: cod, nome: v.nome, telefono: v.telefono, giorno: dataLunga(v.quando), note: v.note, message: testo }) })
          .then(function (r) { return r.json(); })
          .then(function (j) { if (!j.success) throw 0; ultimo = { codice: cod, riepilogo: riep, wa: '' }; vista = 'fatto'; disegnaBorsa('h'); })
          .catch(function () { bt.removeAttribute('aria-disabled'); esito.innerHTML = 'Invio non riuscito. <a href="' + waLink(testo) + '" target="_blank" rel="noopener">Manda la richiesta su WhatsApp</a> o chiama il <a href="tel:' + C.contatti.telefonoLink + '">' + C.contatti.telefono + '</a>.'; });
        return;
      }
      var url = waLink(testo);
      ultimo = { codice: cod, riepilogo: riep, wa: url };
      window.open(url, '_blank', 'noopener');
      vista = 'fatto'; disegnaBorsa('h');
    });
  }
  function creaBorsa() {
    if (borsaP) return;
    borsaP = Pannello('borsa', { cls: 'pan--borsa', onChiudi: function () { if (vista !== 'modulo') vista = 'lista'; inArrivo = null; } });
    borsaP.el.addEventListener('click', function (e) {
      var t = e.target.closest('button, a'); if (!t || !borsaP.el.contains(t)) return;
      var li = t.closest('[data-k]'), b = leggiBorsa();
      if (t.hasAttribute('data-q') && li) {
        if (t.getAttribute('aria-disabled') === 'true') return;
        var k = li.getAttribute('data-k');
        b.forEach(function (x) { if (x.c + '|' + x.t === k) x.q = Math.max(1, Math.min(9, x.q + +t.getAttribute('data-q'))); });
        salvaBorsa(b); disegnaBorsa({ k: k, sel: '[data-q="' + t.getAttribute('data-q') + '"]' });
      } else if (t.hasAttribute('data-togli') && li) {
        var i = $$('[data-k]', borsaP.corpo).indexOf(li), k2 = li.getAttribute('data-k');
        salvaBorsa(b.filter(function (x) { return x.c + '|' + x.t !== k2; }));
        var resto = leggiBorsa();
        disegnaBorsa(resto.length ? { k: resto[Math.min(i, resto.length - 1)].c + '|' + resto[Math.min(i, resto.length - 1)].t, sel: '[data-togli]' } : 'h');
        mostraAvviso('Prodotto tolto dalla borsa');
      } else if (t.hasAttribute('data-vista')) {
        vista = t.getAttribute('data-vista'); disegnaBorsa('h'); borsaP.corpo.scrollTop = 0;
      } else if (t.hasAttribute('data-condividi')) {
        copia(linkBorsa(b), t, 'Link copiato');
      } else if (t.hasAttribute('data-svuota')) {
        if (window.confirm('Vuoi svuotare la borsa?')) { salvaBorsa([]); disegnaBorsa('h'); }
      } else if (t.hasAttribute('data-svuota-fine')) {
        salvaBorsa([]); bozza.note = ''; vista = 'lista'; borsaP.chiudi();
      } else if (t.hasAttribute('data-copia-cod') && ultimo) {
        copia(ultimo.codice, t);
      } else if (t.hasAttribute('data-importa') && inArrivo) {
        var m = t.getAttribute('data-importa');
        if (m === 'sostituisci') salvaBorsa(inArrivo);
        else if (m === 'unisci') { inArrivo.forEach(function (x) { var y = b.filter(function (z) { return z.c === x.c && z.t === x.t; })[0]; if (y) y.q = Math.min(9, y.q + x.q); else b.push(x); }); salvaBorsa(b); }
        inArrivo = null; vista = 'lista'; disegnaBorsa('h');
      } else if (t.matches('a[href^="#prodotto-"]')) {
        // la scheda si apre sopra la borsa (gestito dal clic globale)
      }
    });
  }
  apriBorsa = function (da) {
    creaBorsa();
    if (vista === 'fatto' || vista === 'importa') vista = 'lista';
    disegnaBorsa();
    borsaP.apri(da);
  };
  $$('[data-borsa-apri]').forEach(function (bt) { bt.addEventListener('click', function () { apriBorsa(bt); }); });
  ascolta.push(function () { if (borsaP && !borsaP.el.hidden && vista === 'lista') disegnaBorsa(); });
  // borsa ricevuta con un link
  function daLinkBorsa() {
    if (!/^#borsa=/.test(location.hash)) return;
    var arrivo = leggiLink(location.hash);
    history.replaceState(null, '', location.pathname + location.search);
    if (!arrivo.length) { mostraAvviso('Il link della borsa non contiene prodotti disponibili.'); return; }
    var mia = leggiBorsa();
    creaBorsa();
    if (!mia.length) { salvaBorsa(arrivo); vista = 'lista'; disegnaBorsa(); borsaP.apri(); mostraAvviso('Borsa ricevuta: ' + nProd(pezzi(arrivo))); }
    else { inArrivo = arrivo; vista = 'importa'; disegnaBorsa(); borsaP.apri(); }
  }
  addEventListener('hashchange', daLinkBorsa);
  daLinkBorsa();
  /* =====================================================================
     "SPESSO COMPRATI INSIEME" (scheda) e "TI POTREBBE SERVIRE ANCHE" (borsa)
     Regole: campo insieme di ogni categoria in config.js ("categoria" o "sport/categoria").
     ===================================================================== */
  function catDaRegola(s, k) {
    var sp = s, slug = k;
    if (k.indexOf('/') > -1) { var a = k.split('/'); sp = C.sport.filter(function (x) { return x.slug === a[0]; })[0]; slug = a[1]; }
    return sp ? sp.categorie.filter(function (c) { return c.slug === slug; })[0] : null;
  }
  // fonti: [{ p, s, c, bimbo }]  bimbo: true = bambino, false = adulto, null = non si sa
  function suggerisci(fonti, quanti) {
    var no = {};
    leggiBorsa().forEach(function (x) { no[x.c] = 1; });
    fonti.forEach(function (f) { no[f.p.codice] = 1; });
    var code = [];
    fonti.forEach(function (f) {
      (f.c.insieme || []).forEach(function (k) {
        var c = catDaRegola(f.s, k); if (!c) return;
        code.push({ f: f, lista: c.prodotti.filter(function (q) {
          if (no[q.codice] || q.disponibilita === 'esaurito' || q.illustrazione === f.p.illustrazione) return false;
          return f.bimbo === true ? q.linea !== 'adulto' : f.bimbo === false ? q.linea !== 'bambino' : true;
        }) });
      });
    });
    var out = [], visti = {}, preso = true;
    while (out.length < quanti && preso) {
      preso = false;
      code.forEach(function (x) {
        if (out.length >= quanti) return;
        var q = x.lista.filter(function (y) { return !visti[y.codice]; })[0];
        if (q) { visti[q.codice] = 1; out.push({ p: q, bimbo: x.f.bimbo }); preso = true; }
      });
    }
    return out;
  }
  function htmlSuggerimenti(lista) {
    return lista.map(function (x) {
      var p = x.p, r = PROD[p.codice], tutte = gruppiTaglia(p);
      var g = tutte.filter(function (y) { return x.bimbo === true ? y.linea !== 'adulto' : x.bimbo === false ? y.linea !== 'bambino' : true; });
      if (!g.length) g = tutte;
      var tt = g.reduce(function (a, y) { return a.concat(y.valori); }, []);
      var opt = function (v) { return '<option>' + escH(v) + '</option>'; };
      var scelta = tt.length > 1 ? '<label class="sr-only" for="ins-' + p.codice + '">' + escH(nomeTaglia(p)) + ' – ' + escH(p.nome) + '</label><select class="pc__taglia" id="ins-' + p.codice + '" data-ins-taglia><option value="">' + escH(nomeTaglia(p)) + '</option>' +
        (g.length > 1 ? g.map(function (y) { return '<optgroup label="' + (y.linea === 'bambino' ? 'Bambino' : 'Adulto') + '">' + y.valori.map(opt).join('') + '</optgroup>'; }).join('') : tt.map(opt).join('')) + '</select>' : '';
      return '<div class="ins" data-ins="' + p.codice + '" data-unica="' + (tt.length === 1 ? escH(tt[0]) : '') + '" style="--acc:' + r.s.accento + '">' +
        '<div class="ins__media">' + figura(p, 'ins__ill') + '</div>' +
        '<div class="ins__txt"><p class="ins__nome"><a href="#prodotto-' + p.codice + '">' + escH(p.nome) + '</a></p><p class="ins__prezzo">' + euro(p.prezzo) + (p.linea === 'bambino' ? ' <span class="ins__bimbo">Bambino</span>' : '') + '</p></div>' +
        '<div class="ins__az' + (scelta ? '' : ' ins__az--solo') + '">' + scelta + '<button class="btn btn--pri btn--sm" type="button" data-ins-agg>' + icona('piu', 'ico ico--s') + 'Aggiungi</button></div>' +
        '<p class="ins__msg" data-ins-msg aria-live="polite"></p></div>';
    }).join('');
  }
  function aggiornaInsieme() {
    if (!scheda || !schedaCod) return;
    var sez = $('[data-insieme]', scheda.corpo); if (!sez) return;
    var r = PROD[schedaCod], p = r.p, ch = $('[data-chip-taglie] input:checked', scheda.corpo);
    var bimbo = p.linea === 'bambino' ? true : p.linea === 'adulto' ? false : ch ? tagliaBimbo(p, ch.value) : null;
    var l = suggerisci([{ p: p, s: r.s, c: r.c, bimbo: bimbo }], 3);
    sez.hidden = !l.length;
    $('[data-insieme-lista]', sez).innerHTML = htmlSuggerimenti(l);
  }
  function suggerimentiBorsa() {
    if (!borsaP) return;
    var sez = $('[data-borsa-ins]', borsaP.corpo); if (!sez) return;
    var visti = {}, fonti = [];
    leggiBorsa().slice().reverse().forEach(function (x) {
      if (visti[x.c]) return; visti[x.c] = 1;
      var r = PROD[x.c], p = r.p;
      fonti.push({ p: p, s: r.s, c: r.c, bimbo: p.linea === 'bambino' ? true : p.linea === 'adulto' ? false : x.t ? tagliaBimbo(p, x.t) : null });
    });
    var l = suggerisci(fonti, 3);
    sez.hidden = !l.length;
    $('[data-insieme-lista]', sez).innerHTML = htmlSuggerimenti(l);
  }
  d.addEventListener('change', function (e) {
    var s = e.target.closest('[data-ins-taglia]'); if (!s) return;
    s.classList.remove('is-err'); messaggio($('[data-ins-msg]', s.closest('[data-ins]')), '');
  });
  d.addEventListener('click', function (e) {
    var bt = e.target.closest('[data-ins-agg]'); if (!bt) return;
    var box = bt.closest('[data-ins]'), cod = box.getAttribute('data-ins'), s = $('[data-ins-taglia]', box), msg = $('[data-ins-msg]', box);
    var t = s ? s.value : box.getAttribute('data-unica');
    if (s && !t) { s.classList.add('is-err'); messaggio(msg, scegliTxt(PROD[cod].p) + ', poi tocca Aggiungi.', 'err'); s.focus({ preventScroll: true }); return; }
    var nellaBorsa = !!bt.closest('#borsa');
    if (!aggiungiBorsa(cod, t)) return;
    if (nellaBorsa) {
      // la borsa si ridisegna da sola: porto il focus sulla riga nuova
      var riga = $('#borsa [data-k="' + (cod + '|' + t).replace(/"/g, '\\"') + '"] .bv__nome a');
      if (riga) riga.focus({ preventScroll: true });
      mostraAvviso('Aggiunto: ' + PROD[cod].p.nome + (t ? ' · ' + t : ''));
    } else {
      fatto(bt, 'Aggiunto'); messaggio(msg, 'Nella borsa' + (t ? ' · ' + t : ''), 'ok');
      setTimeout(aggiornaInsieme, 1500);
    }
  });

  /* =====================================================================
     GUIDA TAGLIE (pannello con schede + calcolatore scarpe)
     ===================================================================== */
  var G = C.guidaTaglie, guidaP;
  var SCHEDE_G = [
    { id: 'scarpe', nome: 'Scarpe' },
    { id: 'abb-adulto', nome: 'Abbigliamento adulto', k: 'abbAdulto' },
    { id: 'abb-bambino', nome: 'Abbigliamento bambino', k: 'abbBambino' },
    { id: 'guantoni', nome: 'Guantoni', k: 'guantoni' },
    { id: 'palloni', nome: 'Palloni', k: 'palloni' },
    { id: 'caschi', nome: 'Caschi', k: 'caschi' }
  ];
  // numero europeo dalla lunghezza del piede (cm): si aggiunge circa 1,5 cm di spazio per le dita
  var numeroEU = function (cm) { return Math.round(1.5 * (cm + 1.5)); };
  var cmDaEU = function (n) { return n / 1.5 - 1.5; };
  var virgola = function (v) { return String(Math.round(v * 10) / 10).replace('.', ','); };
  function tabellaG(t) {
    return '<div class="tab-g__scorri"><table class="tab-g"><thead><tr>' + t.colonne.map(function (c) { return '<th scope="col">' + escH(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.righe.map(function (r) { return '<tr>' + r.map(function (c, i) { return i ? '<td>' + escH(c) + '</td>' : '<th scope="row">' + escH(c) + '</th>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
      (t.nota ? '<p class="guida__nota">' + escH(t.nota) + '</p>' : '');
  }
  function schedaScarpe() {
    var righe = function (da, a) { var h = ''; for (var n = da; n <= a; n++) h += '<tr><th scope="row">' + n + '</th><td>' + virgola(cmDaEU(n - .5)) + '–' + virgola(cmDaEU(n + .5) - .1) + ' cm</td></tr>'; return h; };
    return '<div class="calc">' +
      '<p class="calc__tit">Trova il numero</p>' +
      '<div class="calc__riga"><div class="campo calc__campo"><label for="g-cm">Lunghezza del piede (cm)</label><input id="g-cm" type="text" inputmode="decimal" autocomplete="off" placeholder="Es. 24,5" aria-describedby="g-ris"></div>' +
      '<output class="calc__ris" id="g-ris" for="g-cm" aria-live="polite"><span class="calc__n">–</span><span class="calc__t">Scrivi la misura del piede</span></output></div>' +
      '<p class="calc__nota">Il calcolo aggiunge già circa 1,5 cm di spazio per le dita.</p></div>' +
      '<h3 class="guida__h">Come misurare il piede</h3><ol class="guida__passi">' + G.scarpe.comeMisurare.map(function (x) { return '<li>' + escH(x) + '</li>'; }).join('') + '</ol>' +
      '<p class="guida__nota">' + escH(G.scarpe.nota) + '</p>' +
      '<div class="guida__due"><div><h3 class="guida__h">Bambino</h3><div class="tab-g__scorri"><table class="tab-g"><thead><tr><th scope="col">Numero</th><th scope="col">Piede</th></tr></thead><tbody>' + righe(24, 35) + '</tbody></table></div></div>' +
      '<div><h3 class="guida__h">Adulto</h3><div class="tab-g__scorri"><table class="tab-g"><thead><tr><th scope="col">Numero</th><th scope="col">Piede</th></tr></thead><tbody>' + righe(36, 47) + '</tbody></table></div></div></div>';
  }
  function calcola(v) {
    var cm = parseFloat(String(v).replace(',', '.'));
    if (!String(v).trim()) return { n: '–', t: 'Scrivi la misura del piede' };
    if (isNaN(cm) || cm < 10 || cm > 33) return { n: '!', t: 'Scrivi una misura tra 10 e 33 cm', err: true };
    var n = numeroEU(cm);
    return { n: n, t: 'Numero europeo indicativo · ' + (n <= 35 ? 'bambino' : 'adulto') + (n > 47 ? ' (numero grande: chiedici)' : '') };
  }
  function creaGuida() {
    if (guidaP) return;
    guidaP = Pannello('guida-taglie', { cls: 'pan--largo pan--guida' });
    guidaP.tit.textContent = 'Guida taglie';
    guidaP.corpo.innerHTML = '<p class="guida__avviso">' + escH(G.avviso) + '</p>' +
      '<div class="guida__tabs" role="tablist" aria-label="Tipo di prodotto">' + SCHEDE_G.map(function (s) { return '<button type="button" role="tab" id="gt-' + s.id + '" aria-controls="gp-' + s.id + '" aria-selected="false" tabindex="-1">' + s.nome + '</button>'; }).join('') + '</div>' +
      SCHEDE_G.map(function (s) { return '<div class="guida__pan" role="tabpanel" id="gp-' + s.id + '" aria-labelledby="gt-' + s.id + '" tabindex="0" hidden>' + (s.k ? tabellaG(G[s.k]) : schedaScarpe()) + '</div>'; }).join('');
    guidaP.piede.hidden = false;
    guidaP.piede.innerHTML = '<div class="guida__piede"><p>Tra due misure? Prova in negozio o chiedici.</p><a class="btn btn--sec btn--sm" href="' + waLink('Ciao ' + C.attivita.nome + ', ho un dubbio sulla taglia giusta.') + '" target="_blank" rel="noopener">' + icona('chat', 'ico ico--s') + 'Chiedi su WhatsApp</a></div>';
    var tabs = $$('[role="tab"]', guidaP.corpo);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { guidaTab(t.id.slice(3)); });
      t.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (j === null) return;
        e.preventDefault(); j = (j + tabs.length) % tabs.length; guidaTab(tabs[j].id.slice(3)); tabs[j].focus();
      });
    });
    var cm = $('#g-cm', guidaP.corpo), ris = $('#g-ris', guidaP.corpo);
    cm.addEventListener('input', function () {
      var r = calcola(cm.value);
      $('.calc__n', ris).textContent = r.n; $('.calc__t', ris).textContent = r.t;
      ris.classList.toggle('is-err', !!r.err); ris.classList.toggle('is-ok', typeof r.n === 'number');
      cm.setAttribute('aria-invalid', r.err ? 'true' : 'false');
    });
  }
  function guidaTab(id) {
    if (!SCHEDE_G.some(function (s) { return s.id === id; })) id = 'scarpe';
    $$('[role="tab"]', guidaP.corpo).forEach(function (t) {
      var on = t.id === 'gt-' + id;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      if (on && t.parentElement.scrollWidth > t.parentElement.clientWidth) t.parentElement.scrollLeft = t.offsetLeft - 16;
    });
    $$('[role="tabpanel"]', guidaP.corpo).forEach(function (p) { p.hidden = p.id !== 'gp-' + id; });
  }
  function apriGuida(tab, da) {
    creaGuida(); guidaP.apri(da); guidaTab(tab || 'scarpe');   // prima visibile, poi scorre la scheda attiva in vista
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-guida]'); if (!a) return;
    e.preventDefault();
    apriGuida(a.getAttribute('data-guida-tab'), a);
  });
  if (location.hash === '#guida-taglie') { history.replaceState(null, '', location.pathname + location.search); apriGuida(); }
  window.SLANCIO.numeroScarpa = numeroEU;

  /* =====================================================================
     VEDI IN 3D: <model-viewer> ospitato nel sito, caricato solo al clic
     ===================================================================== */
  var v3d, mvPronto = null;
  function caricaMV() {
    if (mvPronto) return mvPronto;
    mvPronto = new Promise(function (ok, ko) {
      if (window.customElements && customElements.get('model-viewer')) return ok();
      var sc = d.createElement('script');
      sc.src = REL + 'assets/js/vendor/model-viewer.min.js';
      sc.onload = function () { customElements.whenDefined('model-viewer').then(ok); };
      sc.onerror = function () { mvPronto = null; ko(); };
      d.head.appendChild(sc);
    });
    return mvPronto;
  }
  function apri3D(cod, da) {
    var r = PROD[cod]; if (!r || !r.p.modello3d) return;
    var p = r.p;
    if (!v3d) v3d = Pannello('vista-3d', { cls: 'pan--largo pan--3d', onChiudi: function () { $('.v3d__scena', v3d.corpo).innerHTML = ''; } });
    v3d.el.style.setProperty('--acc', r.s.accento);
    v3d.tit.textContent = 'Vedi in 3D';
    v3d.corpo.innerHTML = '<div class="v3d"><div class="v3d__scena" data-scena><p class="v3d__stato" data-stato>Carico il modello 3D…</p></div>' +
      '<p class="v3d__et">Anteprima 3D di esempio</p>' +
      '<p class="v3d__nome">' + escH(p.nome) + ' <span>' + p.codice + '</span></p>' +
      '<p class="v3d__aiuto">Trascina per ruotare · pizzica o usa la rotella per ingrandire · doppio tocco per tornare all\'inizio</p></div>';
    v3d.piede.hidden = true;
    v3d.apri(da);
    var scena = $('[data-scena]', v3d.corpo), stato = $('[data-stato]', v3d.corpo);
    if (location.protocol === 'file:') {
      stato.innerHTML = 'Il 3D si vede aprendo il sito da internet.<br>Aprendo il file dal computer il browser blocca il caricamento del modello.';
      return;
    }
    caricaMV().then(function () {
      if (v3d.el.hidden) return;
      var mv = d.createElement('model-viewer');
      mv.setAttribute('src', REL + p.modello3d);
      mv.setAttribute('alt', 'Modello 3D di esempio: ' + p.nome);
      mv.setAttribute('camera-controls', '');
      mv.setAttribute('touch-action', 'pan-y');
      mv.setAttribute('interaction-prompt', 'none');
      mv.setAttribute('shadow-intensity', '1');
      mv.setAttribute('exposure', '1.05');
      mv.setAttribute('min-camera-orbit', 'auto auto 40%');
      mv.setAttribute('max-camera-orbit', 'auto auto 180%');
      if (!ridotto.matches) { mv.setAttribute('auto-rotate', ''); mv.setAttribute('auto-rotate-delay', '0'); mv.setAttribute('rotation-per-second', '14deg'); }
      // al primo tocco la rotazione automatica si ferma
      var ferma = function () { mv.removeAttribute('auto-rotate'); };
      mv.addEventListener('pointerdown', ferma, { once: true });
      mv.addEventListener('camera-change', function (e) { if (e.detail && e.detail.source === 'user-interaction') ferma(); });
      mv.addEventListener('dblclick', function () { mv.cameraOrbit = 'auto auto auto'; mv.fieldOfView = 'auto'; mv.jumpCameraToGoal(); });
      mv.addEventListener('load', function () { stato.hidden = true; });
      mv.addEventListener('error', function () { stato.hidden = false; stato.textContent = 'Il modello 3D non si è caricato. Riprova più tardi.'; });
      scena.appendChild(mv);
    }, function () { stato.textContent = 'Il visore 3D non si è caricato. Riprova più tardi.'; });
  }
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-3d]'); if (!b) return;
    apri3D(b.getAttribute('data-3d'), b);
  });

  /* ---------------- Mappa solo al clic ---------------- */
  var mappa = $('[data-mappa]');
  if (mappa) $('[data-mappa-btn]', mappa).addEventListener('click', function () {
    var area = $('[data-mappa-area]', mappa);
    var f = d.createElement('iframe');
    f.src = mappa.getAttribute('data-mappa-src');
    f.title = 'Mappa: ' + C.contatti.indirizzo + ', ' + C.contatti.citta;
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.setAttribute('allowfullscreen', '');
    area.innerHTML = '';
    area.appendChild(f);
  });

  /* =====================================================================
     ANIMAZIONI (GSAP + ScrollTrigger) – solo transform, opacity, clip-path
     ===================================================================== */
  if (!hasGsap) { html.classList.remove('anim'); return; }
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  var larghezza = innerWidth, tRes;
  addEventListener('resize', function () {
    if (innerWidth === larghezza) return;   // la tastiera dell'iPhone cambia solo l'altezza
    larghezza = innerWidth; clearTimeout(tRes); tRes = setTimeout(function () { ST.refresh(); }, 200);
  });

  var mm = gsap.matchMedia();
  mm.add({ moto: '(prefers-reduced-motion: no-preference)', computer: '(min-width: 1024px) and (hover: hover)' }, function (ctx) {
    if (!ctx.conditions.moto) { html.classList.remove('anim'); return; }
    var computer = ctx.conditions.computer;

    /* Intro hero */
    if (html.classList.contains('anim')) {
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: .1 });
      var righe = $$('[data-tit-hero] .m > span');
      var piccoli = $$('.hero .badge-orario, .hs .briciole, .hs__num, .hc .briciole'), extra = $$('[data-hero-a]');
      if (righe.length) tl.fromTo(righe, { yPercent: 110, y: 0 }, { yPercent: 0, duration: 1.15, stagger: .09 }, 0);
      if (piccoli.length) tl.fromTo(piccoli, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .8, stagger: .06 }, .05);
      if (extra.length) tl.fromTo(extra, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .1 }, .45);
      var campoHero = $('.hs__campo');
      if (campoHero) tl.fromTo(campoHero, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.8, ease: 'power2.inOut' }, .2);
    }

    /* Parallax hero */
    $$('[data-parallax]').forEach(function (el) {
      gsap.to(el, { y: computer ? 48 : 24, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
    });

    /* Titoli di sezione riga per riga */
    $$('[data-tit]').forEach(function (el) {
      gsap.fromTo($$('.m > span', el), { yPercent: 110 }, { yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Parole giganti */
    $$('[data-parola]').forEach(function (el) {
      gsap.fromTo(el, { xPercent: 6 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });

    /* Tessere a cascata + linee di campo */
    var tessere = $$('.tessere:not(.tessere--carosello) .tessera, .tessere--carosello .tessera');
    if (tessere.length) gsap.set(tessere, { clipPath: 'inset(100% 0% 0% 0%)' });
    if ($$('.tessera__campo').length) gsap.set($$('.tessera__campo'), { clipPath: 'inset(0% 100% 0% 0%)' });
    if (tessere.length) ST.batch(tessere, {
      start: 'top 92%', once: true,
      onEnter: function (b) {
        gsap.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', stagger: .07 });
        gsap.fromTo(b.map(function (t) { return $('.tessera__foto img', t); }).filter(Boolean), { scale: 1.18 }, { scale: 1.001, duration: 1.6, ease: 'expo.out', stagger: .07, clearProps: 'transform' });
        gsap.to(b.map(function (t) { return $('.tessera__campo', t); }), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut', stagger: .07, delay: .35 });
      }
    });

    /* Foto che si rivelano e si assestano */
    $$('[data-foto]').forEach(function (box) {
      var im = $('img', box);
      gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 90%', once: true } })
        .fromTo(box, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out' }, 0)
        .fromTo(im, { scale: 1.16 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0);
    });

    /* Schede, punti, blocchi */
    ST.batch($$('[data-cat], .punto, .numero, .acc, .orari tr, .mappa, .modulo'), {
      start: 'top 92%', once: true,
      onEnter: function (b) { gsap.fromTo(b, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .06, clearProps: 'transform' }); }
    });

    /* Linee di campo grandi e maglia */
    $$('.fine__campo, .maglia__svg').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: el.parentElement, start: 'top 80%', once: true } });
    });

    /* Contatori */
    $$('[data-conta]').forEach(function (el) {
      var fine = +el.getAttribute('data-conta'), o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, { v: fine, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });

    /* Computer: tessere che seguono appena il mouse */
    if (computer) {
      var pulizie = [];
      $$('.tessera__link').forEach(function (t) {
        var im = $('.tessera__foto', t), cp = $('.tessera__campo', t);
        var qx = gsap.quickTo(im, 'x', { duration: .6, ease: 'power3' }), qy = gsap.quickTo(im, 'y', { duration: .6, ease: 'power3' });
        var cx = gsap.quickTo(cp, 'x', { duration: .8, ease: 'power3' }), cy = gsap.quickTo(cp, 'y', { duration: .8, ease: 'power3' });
        var muovi = function (e) {
          var r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          qx(px * -10); qy(py * -10); cx(px * 8); cy(py * 8);
        };
        var esci = function () { qx(0); qy(0); cx(0); cy(0); };
        t.addEventListener('pointermove', muovi); t.addEventListener('pointerleave', esci);
        pulizie.push(function () { t.removeEventListener('pointermove', muovi); t.removeEventListener('pointerleave', esci); });
      });
      return function () { pulizie.forEach(function (f) { f(); }); };
    }
  });
  addEventListener('load', function () { ST.refresh(); }, { once: true });
})();
