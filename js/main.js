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
  function linkBorsa(el) {
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
      (p.taglia !== 'unica' ? '<a class="link" href="#guida-taglie" data-guida data-guida-tab="' + guidaTabPer(p) + '">' + icona('righello', 'ico ico--s') + 'Guida taglie</a>' : '') +
      '</div><div class="chip-taglie" data-chip-taglie>' + gruppi + '</div></fieldset>';
  }
  function guidaTabPer(p) {
    var k = (TAG[p.taglia] || {}).guida || '';
    return k || (/scarp|calz/.test(p.taglia) ? 'scarpe' : /abb/.test(p.taglia) ? (p.linea === 'bambino' ? 'abbBambino' : 'abbAdulto') : '');
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
      if (aggiungiBorsa(p.codice, t)) { fatto(agg, 'Aggiunto alla borsa'); messaggio(msg, 'Nella borsa' + (t ? ' · ' + t : '') + '. ', 'ok'); linkBorsa(msg); aggiornaInsieme(); }
    });
    galleriaAttiva(scheda.corpo);
    aggiornaInsieme();
    if (storico) { history.pushState({ prodotto: cod }, '', '#prodotto-' + cod); schedaStorico = true; }
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
  var aggiornaInsieme = function () {};          // "Spesso comprati insieme" (blocco 4)
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
