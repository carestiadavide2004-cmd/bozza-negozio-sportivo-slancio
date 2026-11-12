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
  var compatta = function () { if (hdr) hdr.classList.toggle('is-compatto', window.scrollY > 40); };
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
  var bloccaScroll = function (si) { html.style.overflow = si ? 'hidden' : ''; };

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
      var url = REL + 'sport/' + s.slug + '/';
      indice.push({ tit: s.nome, sotto: s.categorie.length + ' categorie', num: s.numero, acc: s.accento, url: url, testo: norm(s.nome + ' ' + (s.nomeBreve || '')), sport: true });
      s.categorie.forEach(function (c) {
        indice.push({ tit: c.titolo, sotto: s.nome, num: s.numero, acc: s.accento, url: url + '#' + c.slug, testo: norm(c.titolo + ' ' + s.nome + ' ' + c.tipologie.join(' ')) });
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
      }).sort(function (a, b) { return (norm(b.tit).indexOf(parole[0]) === 0) - (norm(a.tit).indexOf(parole[0]) === 0); }).slice(0, 10);
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
      if (a && a.getAttribute('href').indexOf('#') > -1 && a.pathname === location.pathname) { cercaApri(false); apriCategoria(a.hash.slice(1)); }
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
      tl.fromTo(righe, { yPercent: 110, y: 0 }, { yPercent: 0, duration: 1.15, stagger: .09 }, 0)
        .fromTo('.hero .badge-orario, .hs .briciole, .hs__num', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .8, stagger: .06 }, .05)
        .fromTo('[data-hero-a]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .1 }, .45);
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
    gsap.set(tessere, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set($$('.tessera__campo'), { clipPath: 'inset(0% 100% 0% 0%)' });
    ST.batch(tessere, {
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
