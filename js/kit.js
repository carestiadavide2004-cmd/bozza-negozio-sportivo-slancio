/* =====================================================================
   SLANCIO – kit.js · KIT SQUADRA: configuratore a 8 passi
   1 Sport e capi · 2 Marca · 3 Materiali · 4 Grafiche · 5 Stile · 6 Rosa · 7 Proposte · 8 Preventivo
   - Prezzi, marche, sconti, spedizione, acconto, tempi e taglie: js/listino.js
   - Testi e regole: config.js (kit). Anteprima della maglia: js/maglia-svg.js
   - Ordini salvati con js/dati.js (oggi nel browser, domani Firebase)
   - Avanzamento salvato nel browser: chiave "slancio-kit2" (+ "slancio-kit2-img" per le miniature delle grafiche)
   I testi scritti dall'utente sono usati solo come testo (mai come HTML).
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO, S = window.SLANCIO, LI = window.LISTINO, MS = window.MagliaSVG, DT = window.DATI;
  var form = S && S.$('[data-kit]');
  if (!C || !S || !form || !LI || !MS || !C.kit) return;
  var K = C.kit, d = document, $ = S.$, $$ = S.$$, escH = S.escH;
  var CAPI = LI.capi, MARCHE = LI.marche, P = LI.personalizzazioni, G = K.grafiche;
  var N = 8, TITOLI = ['Sport e capi', 'Marca', 'Materiali', 'Grafiche', 'Stile', 'Rosa', 'Proposte', 'Preventivo'];
  var SUPERIORI = ['maglia', 'rappresentanza', 'allenamento', 'tecnica', 'giubbino'];
  var TAGLIE_A = LI.taglie.adulti.map(function (t) { return t.taglia; }), TAGLIE_B = LI.taglie.bambini.map(function (t) { return t.taglia; });
  var TAGLIE = TAGLIE_A.concat(TAGLIE_B);
  var HEX = /^#[0-9A-F]{6}$/i;
  // euro con il punto delle migliaia (1.459,50 €)
  var euro = function (n) { var s = Math.abs(n).toFixed(2).split('.'); return (n < 0 ? '−' : '') + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1] + ' €'; };
  var arrot = function (n) { return Math.round(n * 100) / 100; };
  var intero = function (v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
  var str = function (v, n) { return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, n); };
  var capoDi = function (id) { return CAPI.filter(function (c) { return c.id === id; })[0]; };
  var marcaDi = function (id) { return MARCHE.filter(function (m) { return m.id === id; })[0]; };
  var sportDi = function (id) { return C.sport.filter(function (s) { return s.slug === id; })[0]; };
  var trova = function (lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; };

  /* =====================================================================
     STATO (salvato nel browser, sempre dentro try/catch)
     ===================================================================== */
  var CHIAVE = 'slancio-kit2', CHIAVE_IMG = 'slancio-kit2-img', CHIAVE_PRIMA = 'slancio-kit2-prima';
  function leggiJ(k) { try { var x = JSON.parse(localStorage.getItem(k)); if (x && typeof x === 'object') return x; } catch (e) {} return null; }
  function scriviJ(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  var pulisciNome = function (v) { return str(v, K.maxNome).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'’. \-]/g, '').replace(/\s{2,}/g, ' '); };
  var pulisciNum = function (v) { return String(v == null ? '' : v).replace(/\D/g, '').slice(0, K.maxNumero); };
  function listaFile(l, max, conPos) {
    return (Array.isArray(l) ? l : []).slice(0, max).filter(function (f) { return f && f.id; }).map(function (f) {
      return { id: intero(f.id), nome: str(f.nome, 80) || 'file', size: intero(f.size), pdf: !!f.pdf, pos: conPos && G.posizioni.indexOf(f.pos) > -1 ? f.pos : '' };
    });
  }
  function pulisciDesign(x) {
    if (!x || typeof x !== 'object' || !HEX.test(x.c1) || !HEX.test(x.c2)) return null;
    return { c1: x.c1.toUpperCase(), c2: x.c2.toUpperCase(), c3: HEX.test(x.c3) ? x.c3.toUpperCase() : undefined,
      disegno: MS.DISEGNI.indexOf(x.disegno) > -1 ? x.disegno : 'tinta', collo: MS.COLLI.indexOf(x.collo) > -1 ? x.collo : 'girocollo', stile: MS.STILI.indexOf(x.stile) > -1 ? x.stile : 'classico' };
  }
  function pulisci(x) {
    x = x && typeof x === 'object' ? x : {};
    var o = { v: 2 }, tra = function (v, a, b) { v = intero(v); return v < a ? a : v > b ? b : v; };
    o.passo = tra(x.passo || 1, 1, N); o.max = Math.max(o.passo, tra(x.max || 1, 1, N));
    o.squadra = str(x.squadra, 60);
    o.sport = sportDi(x.sport) ? x.sport : '';
    o.capi = {};
    CAPI.forEach(function (c) {
      var y = x.capi && x.capi[c.id]; if (!y) return;
      var q = intero(y.q);
      o.capi[c.id] = { on: !!y.on, q: q >= 1 && q <= K.maxPezzi ? q : K.quantitaIniziale, tipoAuto: !!y.tipoAuto,
        tipo: c.tipi.some(function (t) { return t.nome === y.tipo; }) ? y.tipo : '', mat: c.materiali.some(function (m) { return m.id === y.mat; }) ? y.mat : '' };
    });
    o.capiToccati = !!x.capiToccati;
    o.marca = marcaDi(x.marca) ? x.marca : '';
    o.stemma = x.stemma === 'file' || x.stemma === 'negozio' ? x.stemma : '';
    var f = x.file || {};
    o.file = { stemma: listaFile(f.stemma, 1, false), sponsor: listaFile(f.sponsor, G.maxFile, true), altre: listaFile(f.altre, G.maxFile, false) };
    o.palette = (Array.isArray(x.palette) ? x.palette : []).filter(function (c, i, a) { return HEX.test(c) && a.indexOf(c) === i; }).slice(0, 4).map(function (c) { return c.toUpperCase(); });
    o.paletteAuto = !!x.paletteAuto;
    o.stile = trova(K.stili, x.stile) ? x.stile : '';
    o.disegno = trova(K.disegni, x.disegno) ? x.disegno : '';
    o.collo = trova(K.colli, x.collo) ? x.collo : '';
    o.col1 = HEX.test(x.col1) ? x.col1.toUpperCase() : ''; o.col2 = HEX.test(x.col2) ? x.col2.toUpperCase() : '';
    o.rosa = (Array.isArray(x.rosa) ? x.rosa : []).slice(0, K.maxRosa).map(function (r) {
      r = r || {}; return { nome: pulisciNome(r.nome), num: pulisciNum(r.num), taglia: TAGLIE.indexOf(r.taglia) > -1 ? r.taglia : '' };
    });
    o.seme = intero(x.seme) || 1;
    o.scelta = pulisciDesign(x.scelta); o.sceltaK = o.scelta ? str(x.sceltaK, 60) : '';
    o.consegna = x.consegna === 'ritiro' || x.consegna === 'spedizione' ? x.consegna : '';
    ['via', 'citta', 'referente', 'telefono', 'email'].forEach(function (k) { o[k] = str(x[k], 80); });
    o.cap = str(x.cap, 5); o.prov = str(x.prov, 2); o.note = String(x.note == null ? '' : x.note).slice(0, 500);
    o.condizioni = x.condizioni === true;
    o.codice = /^KIT-[A-Z0-9]{4}$/.test(x.codice || '') ? x.codice : '';
    o.ordine = x.ordine && typeof x.ordine === 'object' && /^KIT-[A-Z0-9]{4}$/.test(x.ordine.numero || '') ? x.ordine : null;
    return o;
  }
  var stato = pulisci(leggiJ(CHIAVE));
  var IMG = leggiJ(CHIAVE_IMG) || {};
  var nId = 0;
  ['stemma', 'sponsor', 'altre'].forEach(function (z) { stato.file[z].forEach(function (f) { nId = Math.max(nId, f.id); }); });
  var avvisatoMemoria = false;
  function salva() {
    if (!scriviJ(CHIAVE, stato) && !avvisatoMemoria) { avvisatoMemoria = true; S.mostraAvviso('Il browser non permette di salvare: il kit resta finché la pagina è aperta.'); }
  }
  function salvaImg() {
    // tengo solo le miniature dei file ancora in lista
    var vivi = {};
    ['stemma', 'sponsor', 'altre'].forEach(function (z) { stato.file[z].forEach(function (f) { if (IMG[f.id]) vivi[f.id] = IMG[f.id]; }); });
    IMG = vivi;
    if (!scriviJ(CHIAVE_IMG, IMG) && !avvisatoMemoria) { avvisatoMemoria = true; S.mostraAvviso('Le immagini sono troppo pesanti per restare salvate: le vedi finché la pagina è aperta.'); }
  }

  /* =====================================================================
     CONTI (tutti i prezzi da listino.js; IVA compresa)
     ===================================================================== */
  var capiOn = function () { return CAPI.filter(function (c) { return stato.capi[c.id] && stato.capi[c.id].on; }); };
  var qDi = function (id) { var s = stato.capi[id]; return s && s.on ? s.q : 0; };
  function conto(perMarca) {
    var mid = perMarca || stato.marca || MARCHE[0].id, m = marcaDi(mid), righe = [], sub = 0;
    capiOn().forEach(function (c) {
      var s = stato.capi[c.id], t = c.tipi.filter(function (x) { return x.nome === s.tipo; })[0], ma = trova(c.materiali, s.mat);
      var base = c.prezzi[mid], pT = t ? t.piu : 0, pM = ma ? ma.piu : 0, un = base + pT + pM;
      righe.push({ id: c.id, nome: c.nome, q: s.q, tipo: t ? t.nome : '', mat: ma ? ma.nome : '', base: base, piuT: pT, piuM: pM, un: un, tot: un * s.q });
      sub += un * s.q;
    });
    var qM = qDi('maglia'), kit = qM || righe.reduce(function (a, r) { return Math.max(a, r.q); }, 0);
    var petto = qM || (righe.filter(function (r) { return SUPERIORI.indexOf(r.id) > -1; })[0] || {}).q || 0;
    var pers = [], nn = qM ? stato.rosa.filter(function (r) { return r.nome || r.num; }).length : 0;
    if (nn) pers.push({ nome: 'Nome e numero sul retro', q: nn, un: P.nomeNumero, tot: nn * P.nomeNumero });
    if (stato.stemma && petto) pers.push({ nome: 'Stemma sul petto', q: petto, un: P.stemma, tot: petto * P.stemma });
    stato.file.sponsor.forEach(function (f) {
      if (!f.pos) return;
      var q = f.pos === 'Pantaloncino' ? qDi('pantaloncini') : petto; if (!q) return;
      pers.push({ nome: 'Sponsor «' + nomeBreve(f.nome) + '» · ' + f.pos.toLowerCase(), q: q, un: P.sponsor, tot: q * P.sponsor });
    });
    pers.forEach(function (p) { sub += p.tot; });
    var sc = LI.sconti.filter(function (x) { return kit > x.oltre; }).sort(function (a, b) { return b.percento - a.percento; })[0] || null;
    var sconto = sc ? arrot(sub * sc.percento / 100) : 0;
    var sped = stato.consegna === 'spedizione' && sub > 0 ? LI.spedizione.costo : 0;
    var tot = arrot(sub - sconto + sped), acc = arrot(tot * LI.acconto / 100);
    return { marca: m, righe: righe, pers: pers, sub: arrot(sub), kit: kit, sc: sc, sconto: sconto, sped: sped, tot: tot, iva: arrot(tot - tot / (1 + LI.iva / 100)), acconto: acc, saldo: arrot(tot - acc), da: !stato.marca };
  }
  var nomeBreve = function (n) { return String(n || '').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').slice(0, 24); };
  // giorni lavorativi da oggi (sabato e domenica esclusi)
  function lavorativi(n) {
    var iso = S.oggiRoma().iso, k = 0;
    while (k < n) { iso = S.piuGiorni(iso, 1); var g = S.giorno(iso).dow; if (g && g !== 6) k++; }
    return iso;
  }
  var dataBreve = function (iso) { var g = S.giorno(iso); return g.d + ' ' + S.MESI[g.m - 1]; };
  function tempi(m) {
    m = m || conto().marca;
    var extra = stato.consegna === 'spedizione' ? 3 : 0;
    return { da: lavorativi(m.produzione[0] + extra), a: lavorativi(m.produzione[1] + extra), testo: m.produzione[0] + '–' + m.produzione[1] + ' giorni lavorativi' };
  }

  /* =====================================================================
     NAVIGAZIONE TRA I PASSI
     ===================================================================== */
  var passo = 1;
  var box = $('[data-kit-box]'), barra = $('[data-kit-barra]'), bar = $('.kit__barra'), dove = $('[data-kit-dove]');
  var btIndietro = $('[data-indietro]', form), btAvanti = $('[data-avanti]', form), esitoK = $('[data-kit-esito]', form);
  function vediSe(el) {
    // scorre solo dopo un clic su Avanti/Indietro (mai al tocco di un campo) e solo se serve
    var r = el.getBoundingClientRect(), top = (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--hdr-c')) || 54) + 12;
    if (r.top < top || r.top > innerHeight * 0.6) scrollTo({ top: scrollY + r.top - top - 12, behavior: S.ridotto.matches ? 'auto' : 'smooth' });
  }
  function render(focus) {
    var fatto = !!stato.ordine;
    $$('[data-passo]', form).forEach(function (f) {
      var on = !fatto && +f.getAttribute('data-passo') === passo;
      if (on && f.hidden) { f.classList.remove('is-entra'); void f.offsetWidth; f.classList.add('is-entra'); }
      f.hidden = !on;
    });
    $('[data-kit-fatto]', form).hidden = !fatto;
    $('[data-kit-nav]', form).hidden = fatto;
    box.classList.toggle('is-fatto', fatto);
    $$('[data-vai]').forEach(function (b) {
      var n = +b.getAttribute('data-vai');
      b.disabled = fatto || n > stato.max || n === passo;
      if (n === passo && !fatto) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('is-fatto', fatto || n < passo || (n <= stato.max && n !== passo && valido(n, true)));
    });
    var q = fatto ? N : passo;
    barra.style.transform = 'scaleX(' + (q / N) + ')';
    bar.setAttribute('aria-valuenow', q);
    bar.setAttribute('aria-valuetext', fatto ? 'Ordine confermato' : 'Passo ' + passo + ' di ' + N + ': ' + TITOLI[passo - 1]);
    dove.textContent = fatto ? 'Ordine confermato' : 'Passo ' + passo + ' di ' + N + ' · ' + TITOLI[passo - 1];
    btIndietro.hidden = passo === 1;
    btAvanti.hidden = passo === N;
    btAvanti.innerHTML = (passo === 6 ? 'Vedi le proposte ' : passo === 7 ? 'Vai al preventivo ' : 'Avanti ') + S.icona('dx', 'ico ico--s');
    esitoK.textContent = '';
    entraPasso(passo);
    aggiorna();
    if (fatto) mostraFatto();
    if (focus) {
      var h = fatto ? $('[data-kit-fatto] [data-h]', form) : $('[data-passo="' + passo + '"] .kit__h', form);
      if (h) { h.focus({ preventScroll: true }); vediSe(box); }
    }
  }
  function vai(n, focus) {
    passo = Math.max(1, Math.min(N, n));
    stato.passo = passo; stato.max = Math.max(stato.max, passo);
    salva(); render(focus !== false);
  }
  function avanti() {
    if (stato.ordine) return;
    if (passo === N) return paga();
    if (passo === 6) puliziaRosa();
    if (!valido(passo)) { primoErrore(); return; }
    vai(passo + 1);
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); avanti(); });
  btIndietro.addEventListener('click', function () { vai(passo - 1); });
  $$('[data-vai]').forEach(function (b) { b.addEventListener('click', function () { vai(+b.getAttribute('data-vai')); }); });

  // quello che serve quando si entra in un passo
  function entraPasso(p) {
    if (p === 1) disegnaCapi1();
    if (p === 3) disegnaMat();
    if (p === 4) { mostraStemma(); disegnaPalette(); ['stemma', 'sponsor', 'altre'].forEach(disegnaFile); }
    if (p === 5) { colStile(); stileVivo(); }
    if (p === 6) disegnaRosa();
    if (p === 7) disegnaProposte(false);
    if (p === 8) { if (!stato.codice) { stato.codice = S.codice(K.prefissoCodice); salva(); } mostraIndirizzo(); }
  }

  /* =====================================================================
     CONTROLLI: messaggio chiaro sotto il campo, mai alert()
     ===================================================================== */
  function regole(p) {
    // anche se il campo non è ancora disegnato la regola conta (serve per riprendere dal passo giusto)
    var e = [], q = function (sel, msg) { var el = typeof sel === 'string' ? d.querySelector(sel) : sel; e.push([el, msg]); };
    if (p === 1) {
      q('#k-squadra', stato.squadra.trim().length >= 2 ? '' : 'Scrivi il nome della squadra o dell\'associazione.');
      q('#k-sport', stato.sport ? '' : 'Scegli lo sport della squadra.');
      q('#k-capi', capiOn().length ? '' : 'Scegli almeno un capo.');
      CAPI.forEach(function (c) {
        var s = stato.capi[c.id], inp = d.getElementById('q-' + c.id);
        q(inp, !s || !s.on || (s.q >= 1 && s.q <= K.maxPezzi) ? '' : 'Scrivi un numero da 1 a ' + K.maxPezzi + '.');
      });
    }
    if (p === 2) q('#k-marca', stato.marca ? '' : 'Scegli una delle tre marche.');
    if (p === 3) capiOn().forEach(function (c) {
      var s = stato.capi[c.id];
      q('#m-' + c.id, !s.tipo ? 'Scegli il tipo di ' + c.nome.toLowerCase() + '.' : !s.mat ? 'Scegli il materiale di ' + c.nome.toLowerCase() + '.' : '');
    });
    if (p === 4) {
      q('#k-stemma', !stato.stemma ? 'Carica lo stemma oppure scegli «Scegli in negozio».' : stato.stemma === 'file' && !stato.file.stemma.length ? 'Carica il file dello stemma (o scegli «Scegli in negozio»).' : '');
      q('#k-palette', stato.palette.length >= 2 ? '' : 'Servono almeno 2 colori: aggiungili qui sotto.');
      stato.file.sponsor.forEach(function (f) { q('#sp-pos-' + f.id, f.pos ? '' : 'Scegli dove mettere questo sponsor.'); });
    }
    if (p === 5) {
      q('#k-stile', stato.stile ? '' : 'Scegli uno stile.');
      q('#k-disegno', stato.disegno ? '' : 'Scegli il disegno della maglia.');
      q('#k-collo', stato.collo ? '' : 'Scegli il collo.');
      q('#k-colori', !stato.col1 || !stato.col2 ? 'Scegli il colore principale e il secondario.' : stato.col1 === stato.col2 ? 'Il secondario deve essere diverso dal principale.' : '');
    }
    if (p === 6) {
      var dop = doppi();
      q('#k-rosa', !stato.rosa.length ? 'Aggiungi almeno un giocatore (o incolla la lista).' : dop.length ? 'Ci sono numeri doppi: ' + dop.join(', ') + '.' : stato.rosa.some(function (r) { return !r.taglia; }) ? 'Manca la taglia in qualche riga.' : '');
      stato.rosa.forEach(function (r, i) {
        q('#r' + i + '-taglia', r.taglia ? '' : 'Scegli la taglia.');
        q('#r' + i + '-num', r.num && dop.indexOf(+r.num) > -1 ? 'Numero già usato.' : '');
      });
    }
    if (p === 7) q('#k-prop', stato.scelta ? '' : 'Tocca «Scegli questa» su una delle proposte.');
    if (p === 8) {
      q('#k-consegna', stato.consegna ? '' : 'Scegli ritiro in negozio o spedizione.');
      if (stato.consegna === 'spedizione') {
        q('#k-via', stato.via.trim().length >= 4 ? '' : 'Scrivi via e numero civico.');
        q('#k-cap', /^\d{5}$/.test(stato.cap) ? '' : 'Il CAP ha 5 cifre.');
        q('#k-citta', stato.citta.trim().length >= 2 ? '' : 'Scrivi la città.');
        q('#k-prov', /^[A-Za-z]{2}$/.test(stato.prov) ? '' : 'Due lettere, es. PE.');
      }
      q('#k-ref', stato.referente.trim().length >= 2 ? '' : 'Scrivi nome e cognome del referente.');
      q('#k-tel', stato.telefono.replace(/\D/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.');
      q('#k-email', !stato.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(stato.email.trim()) ? '' : 'Controlla l\'email (oppure lasciala vuota).');
      q('#k-cond', stato.condizioni ? '' : 'Per confermare l\'ordine accetta le condizioni di vendita.');
    }
    return e;
  }
  function valido(p, muto) {
    var e = regole(p);
    if (!muto) e.forEach(function (x) { if (x[0]) S.erroreCampo(x[0], x[1]); });
    return e.every(function (x) { return !x[1]; });
  }
  // dopo un errore, il messaggio sparisce (o si aggiorna) appena si corregge il dato
  function ricontrolla() {
    if (!$('[data-passo="' + passo + '"] [aria-invalid="true"]', form)) return;
    regole(passo).forEach(function (x) { if (x[0] && x[0].getAttribute('aria-invalid') === 'true') S.erroreCampo(x[0], x[1]); });
  }
  function primoErrore() {
    var el = $('[data-passo="' + passo + '"] [aria-invalid="true"]', form); if (!el) return;
    var det = el.closest('details'); if (det) det.open = true;
    var f = /^(FIELDSET|DIV|DETAILS)$/.test(el.tagName) ? ($('input:not([disabled]), select, button', el) || el) : el;
    f.focus({ preventScroll: true }); vediSe(el);
  }

  /* =====================================================================
     CAMPI DI TESTO E SCELTE
     ===================================================================== */
  var TESTI = { squadra: 'k-squadra', via: 'k-via', cap: 'k-cap', citta: 'k-citta', prov: 'k-prov', referente: 'k-ref', telefono: 'k-tel', email: 'k-email', note: 'k-note' };
  var RADIO = ['sport', 'marca', 'stemma', 'stile', 'disegno', 'collo', 'consegna'];
  function scriviForm() {
    Object.keys(TESTI).forEach(function (k) { var el = d.getElementById(TESTI[k]); if (el) el.value = stato[k] || ''; });
    RADIO.forEach(function (n) { $$('input[name="' + n + '"]', form).forEach(function (i) { i.checked = i.value === stato[n]; }); });
    $('#k-cond').checked = stato.condizioni;
    disegnaCapi1();
  }
  form.addEventListener('input', function (e) {
    var t = e.target, k = null;
    Object.keys(TESTI).forEach(function (x) { if (TESTI[x] === t.id) k = x; });
    if (k) {
      if (k === 'prov') { var up = t.value.toUpperCase(); if (up !== t.value) t.value = up; }
      stato[k] = k === 'note' ? t.value.slice(0, 500) : str(t.value, k === 'cap' ? 5 : k === 'prov' ? 2 : 80);
      if (k === 'squadra') aggiornaVivo();
      cambiato(); return;
    }
    if (t.hasAttribute('data-q-campo')) { var s = stato.capi[t.getAttribute('data-q-campo')]; if (s) { s.q = intero(t.value); cambiato(); } return; }
    if (t.hasAttribute('data-r')) return rosaInput(t);
    if (t.hasAttribute('data-pal')) return paletteInput(t);
  });
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.type === 'radio' && RADIO.indexOf(t.name) > -1) {
      stato[t.name] = t.value;
      if (t.name === 'sport') sportScelto();
      if (t.name === 'stemma') mostraStemma();
      if (t.name === 'consegna') mostraIndirizzo();
      if (t.name === 'stile' || t.name === 'disegno' || t.name === 'collo') { togliScelta(); stileVivo(); }
      cambiato(); return;
    }
    if (t.name === 'col1' || t.name === 'col2') { stato[t.name] = t.value; togliScelta(); stileVivo(); cambiato(); return; }
    if (t.name === 'capo') { capoOnOff(t.value, t.checked); stato.capiToccati = true; cambiato(); return; }
    if (t.id === 'k-cond') { stato.condizioni = t.checked; cambiato(); return; }
    if (t.hasAttribute('data-r')) return rosaInput(t);
    if (t.hasAttribute('data-pos')) return posSponsor(t);
    if (/^[tm]-/.test(t.name)) return matScelto(t);
  });
  function cambiato() { salva(); aggiorna(); ricontrolla(); }

  /* ---------------- aggiornamenti dal vivo (totale, prezzi marche, anteprime) ---------------- */
  var rafA = 0;
  function aggiorna() {
    if (rafA) return;
    rafA = requestAnimationFrame(function () {
      rafA = 0;
      totale();
      if (passo === 2) prezziMarche();
      if (passo === 8) { preventivo(); condividi(); }
      mini();
    });
  }
  var rafV = 0;
  function aggiornaVivo() {
    // nome squadra, stemma, sponsor, rosa: cambiano l'anteprima ma non le proposte
    if (rafV) return;
    rafV = requestAnimationFrame(function () { rafV = 0; if (passo === 5) stileVivo(); if (passo === 7) propVivo(); if (passo === 8) anteprimaPrev(); });
  }

  /* =====================================================================
     PASSO 1 · SPORT E CAPI
     ===================================================================== */
  function disegnaCapi1() {
    $$('[data-capo]', form).forEach(function (li) {
      var id = li.getAttribute('data-capo'), s = stato.capi[id], on = !!(s && s.on);
      $('input[name="capo"]', li).checked = on;
      li.classList.toggle('is-on', on);
      var inp = $('[data-q-campo]', li); inp.value = s ? s.q : K.quantitaIniziale; inp.disabled = !on;
      $$('[data-q]', li).forEach(function (b) { b.disabled = !on; });
      if (!on) S.erroreCampo(inp, '');
    });
    var intro = $('[data-capi-intro]', form), sp = sportDi(stato.sport), cons = K.consigliati[stato.sport] || [];
    if (sp && cons.length) intro.textContent = 'Per ' + sp.nome.toLowerCase() + ' di solito servono: ' + cons.map(function (id) { return capoDi(id).nome.toLowerCase(); }).join(', ') + '. Puoi aggiungere o togliere capi.';
  }
  function capoOnOff(id, on) {
    var s = stato.capi[id] || (stato.capi[id] = { on: false, q: K.quantitaIniziale, tipo: '', mat: '' });
    s.on = on;
    if (on) {
      // stessa quantità degli altri capi, se ci sono
      var altri = capiOn().filter(function (c) { return c.id !== id; });
      if (altri.length) s.q = stato.capi[altri[0].id].q;
      var c = capoDi(id);
      if (!s.tipo && c.tipi.length === 1) s.tipo = c.tipi[0].nome;
      if (s.tipo && !s.mat && c.materiali.length === 1) s.mat = c.materiali[0].id;
    }
    disegnaCapi1(); aggiornaVivo();
  }
  function sportScelto() {
    if (!stato.capiToccati) {
      var cons = K.consigliati[stato.sport] || ['maglia'];
      CAPI.forEach(function (c) { if (stato.capi[c.id]) stato.capi[c.id].on = false; });
      cons.forEach(function (id) { capoOnOff(id, true); });
    }
    var mg = stato.capi.maglia;
    if (mg && (!mg.tipo || mg.tipoAuto)) { mg.tipo = K.canotta.indexOf(stato.sport) > -1 ? 'Canotta' : 'Maniche corte'; mg.tipoAuto = true; }
    disegnaCapi1(); aggiornaVivo();
  }
  form.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    var li = b.closest('[data-capo]'), id = li.getAttribute('data-capo'), s = stato.capi[id]; if (!s) return;
    s.q = Math.max(1, Math.min(K.maxPezzi, (s.q || 0) + +b.getAttribute('data-q')));
    $('[data-q-campo]', li).value = s.q; cambiato();
  });

  /* =====================================================================
     PASSO 2 · MARCA
     ===================================================================== */
  function prezziMarche() {
    MARCHE.forEach(function (m) { var el = $('[data-marca-prezzo="' + m.id + '"]', form); if (el) el.textContent = euro(conto(m.id).tot); });
  }

  /* =====================================================================
     PASSO 3 · TIPO E MATERIALE DI OGNI CAPO
     ===================================================================== */
  function righeSvg(f) { var h = ''; for (var k = 0; k < 5; k++) h += f(k); return h; }
  var TRAME = {
    tecnico: '<path d="M0 10 10 0M0 20 20 0M0 30 30 0M0 40 40 0M10 40 40 10M20 40 40 20M30 40 40 30"/>',
    rete: righeSvg(function (r) { var h = ''; for (var c = 0; c < 5; c++) h += '<circle cx="' + (4 + c * 8) + '" cy="' + (4 + r * 8) + '" r="2.2"/>'; return h; }),
    interlock: righeSvg(function (r) { return '<path d="M2 ' + (6 + r * 7) + 'h36" stroke-dasharray="' + (r % 2 ? '3 2' : '6 2') + '"/>'; }),
    sublimato: '<circle cx="12" cy="13" r="6"/><path d="M0 30c8-7 14 4 22-2s12-8 18-4M26 5l8 8-8 8"/>',
    rinforzo: '<path d="M0 10 10 0M0 20 20 0M10 20 30 0M20 20 40 0"/><path d="M0 28h40M0 36h40" stroke-width="3"/>',
    pioggia: '<path d="M11 5c3 5 4 7 4 9a4 4 0 0 1-8 0c0-2 1-4 4-9zM29 15c3 5 4 7 4 9a4 4 0 0 1-8 0c0-2 1-4 4-9zM12 25c2 4 3 5 3 7a3 3 0 0 1-6 0c0-2 1-3 3-7z"/>',
    softshell: righeSvg(function (r) { return r > 3 ? '' : '<path d="M0 ' + (8 + r * 9) + 'c7-4 13 4 20 0s13-4 20 0"/>'; }),
    piumino: '<path d="M2 6h36v28H2z"/><path d="M2 15.5c6 4 12 4 18 0s12 4 18 0M2 25c6 4 12 4 18 0s12 4 18 0"/>',
    elastico: righeSvg(function (r) { return r > 3 ? '' : '<path d="M0 ' + (10 + r * 8) + 'l5-4 5 4 5-4 5 4 5-4 5 4 5-4 5 4"/>'; }),
    strutturato: righeSvg(function (c) { return '<path d="M' + (2 + c * 8) + ' 4l5 6-5 6 5 6-5 6 5 6"/>'; }),
    felpa: righeSvg(function (r) { var h = ''; for (var c = 0; c < 5; c++) h += '<circle cx="' + (4 + c * 8 + (r % 2) * 4) + '" cy="' + (4 + r * 8) + '" r=".9"/>'; return h; }) + '<path d="M0 20c10-3 30-3 40 0" opacity=".5"/>',
    borsa: '<path d="M7 15h26l-2.5 20h-21z"/><path d="M14 15v-3a6 6 0 0 1 12 0v3M7 22h26"/>'
  };
  var trama = function (k) { return '<svg class="mat__ico" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false">' + (TRAME[k] || TRAME.tecnico) + '</svg>'; };
  var piuTxt = function (n) { return n ? '+' + euro(n).replace(',00', '') + ' a capo' : 'Compreso'; };
  function sceltaTxt(c) {
    var s = stato.capi[c.id], m = trova(c.materiali, s.mat);
    return !s.tipo ? 'Da scegliere' : s.tipo + ' · ' + (m ? m.nome : 'scegli il materiale');
  }
  function disegnaMat() {
    var l = $('[data-capi-lista]', form), on = capiOn(), chiave = on.map(function (c) { return c.id; }).join(',');
    if (l.getAttribute('data-per') === chiave) { on.forEach(function (c) { var x = $('[data-capo-mat="' + c.id + '"] [data-capo-q]', l); if (x) x.textContent = stato.capi[c.id].q + ' pezzi'; }); return; }
    l.setAttribute('data-per', chiave);
    var aperto = false;
    l.innerHTML = on.map(function (c) {
      var s = stato.capi[c.id], ok = s.tipo && s.mat, apri = !ok && !aperto; if (apri) aperto = true;
      var ico = $('[data-capo="' + c.id + '"] .capo2__ico', form);
      return '<details class="capo" data-capo-mat="' + c.id + '" id="m-' + c.id + '" tabindex="-1"' + (apri ? ' open' : '') + '>' +
        '<summary>' + (ico ? ico.outerHTML.replace('capo2__ico', 'capo__ico') : '') + '<span class="capo__testa"><span class="capo__nome">' + escH(c.nome) + ' <span class="capo__q" data-capo-q>' + s.q + ' pezzi</span></span>' +
        '<span class="capo__scelta" data-capo-scelta>' + escH(sceltaTxt(c)) + '</span></span>' + S.icona('giu', 'ico ico--s capo__giu') + '</summary>' +
        '<div class="capo__corpo">' +
        '<fieldset class="capo__tipi"><legend>1 · Tipo</legend>' + c.tipi.map(function (t) {
          return '<label class="kit__sc"><input type="radio" name="t-' + c.id + '" value="' + escH(t.nome) + '"' + (s.tipo === t.nome ? ' checked' : '') + '><span>' + escH(t.nome) + (t.piu ? ' <em>+' + euro(t.piu).replace(',00', '') + '</em>' : '') + '</span></label>';
        }).join('') + '</fieldset>' +
        '<fieldset class="capo__mat"' + (s.tipo ? '' : ' disabled') + '><legend>2 · Materiale</legend><p class="campo__aiuto capo__prima"' + (s.tipo ? ' hidden' : '') + '>Scegli prima il tipo.</p>' +
        c.materiali.map(function (m) {
          return '<label class="mat"><input type="radio" name="m-' + c.id + '" value="' + m.id + '"' + (s.mat === m.id ? ' checked' : '') + '><span class="mat__box">' + trama(m.trama) +
            '<span class="mat__testi"><span class="mat__nome">' + escH(m.nome) + '</span><span class="mat__txt">' + escH(m.testo) + '</span></span><span class="mat__piu' + (m.piu ? '' : ' is-zero') + '">' + piuTxt(m.piu) + '</span></span></label>';
        }).join('') + '</fieldset>' +
        '<p class="campo__err" id="m-' + c.id + '-err" hidden></p></div></details>';
    }).join('');
  }
  function matScelto(t) {
    var det = t.closest('[data-capo-mat]'), id = det.getAttribute('data-capo-mat'), c = capoDi(id), s = stato.capi[id];
    if (t.name.charAt(0) === 't') {
      s.tipo = t.value; s.tipoAuto = false;
      var fs = $('.capo__mat', det); fs.disabled = false; $('.capo__prima', det).hidden = true;
      if (c.materiali.length === 1 && !s.mat) { s.mat = c.materiali[0].id; $('.capo__mat input', det).checked = true; }
      if (id === 'maglia') aggiornaVivo();
    } else s.mat = t.value;
    $('[data-capo-scelta]', det).textContent = sceltaTxt(c);
    cambiato();
  }

  /* =====================================================================
     PASSO 4 · STEMMA, SPONSOR, ALTRE GRAFICHE + PALETTE DELLA SQUADRA
     DEMO: i file restano nel browser. Si salva solo una miniatura (max 320 px).
     ===================================================================== */
  var ZONE = { stemma: { max: 1 }, sponsor: { max: G.maxFile, pos: true }, altre: { max: G.maxFile } };
  var est = function (n) { var m = /\.([a-z0-9]+)$/i.exec(n); return m ? m[1].toLowerCase() : ''; };
  var peso = function (b) { return b < 1048576 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(1).replace('.', ',') + ' MB'; };
  var totFile = function () { return stato.file.stemma.length + stato.file.sponsor.length + stato.file.altre.length; };
  function mostraStemma() {
    $('[data-stemma-file]', form).hidden = stato.stemma !== 'file';
    $('[data-stemma-neg]', form).hidden = stato.stemma !== 'negozio';
  }
  // miniatura PNG da un file immagine (anche SVG)
  function miniatura(file) {
    return new Promise(function (ok, ko) {
      var fr = new FileReader();
      fr.onerror = ko;
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          try {
            var w = im.naturalWidth || 320, h = im.naturalHeight || 320, k = Math.min(1, 320 / Math.max(w, h));
            var cv = d.createElement('canvas'); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
            cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
            ok({ url: cv.toDataURL('image/png'), cv: cv });
          } catch (e) { ko(e); }
        };
        im.onerror = ko;
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  function aggiungi(zona, files) {
    var z = ZONE[zona], box = $('[data-carica="' + zona + '"]', form), avv = $('[data-avviso]', box), scarti = [], nuovi = [];
    Array.prototype.forEach.call(files || [], function (f) {
      var e = est(f.name);
      if (G.formati.indexOf(e) < 0) return scarti.push(f.name + ' (formato non accettato)');
      if (f.size > G.maxMB * 1048576) return scarti.push(f.name + ' (più di ' + G.maxMB + ' MB)');
      if (zona !== 'stemma' && totFile() + nuovi.length >= G.maxFile) return scarti.push(f.name + ' (massimo ' + G.maxFile + ' file in tutto)');
      if (stato.file[zona].some(function (x) { return x.nome === f.name && x.size === f.size; })) return scarti.push(f.name + ' (già caricato)');
      nuovi.push({ f: f, x: { id: ++nId, nome: str(f.name, 80), size: f.size, pdf: e === 'pdf', pos: '' } });
    });
    if (zona === 'stemma' && nuovi.length) { nuovi = nuovi.slice(-1); stato.file.stemma = []; }
    var lavori = nuovi.map(function (n) {
      stato.file[zona].push(n.x);
      if (z.pos && !n.x.pos) n.x.pos = posLibera();
      if (n.x.pdf) return Promise.resolve();
      return miniatura(n.f).then(function (r) {
        IMG[n.x.id] = r.url;
        if (zona === 'stemma') daStemma(r.cv);
      }).catch(function () { scarti.push(n.f.name + ' (non riesco a leggere l\'immagine)'); stato.file[zona] = stato.file[zona].filter(function (x) { return x.id !== n.x.id; }); });
    });
    Promise.all(lavori).then(function () {
      if (zona === 'stemma' && nuovi.length && nuovi[0].x.pdf) $('[data-palette-txt]', form).textContent = 'Dai PDF non possiamo leggere i colori: sceglili qui sotto.';
      avv.textContent = scarti.length ? 'Non aggiunti: ' + scarti.join(', ') + '.' : nuovi.length ? (nuovi.length === 1 ? 'File aggiunto.' : nuovi.length + ' file aggiunti.') : '';
      avv.classList.toggle('is-err', !!scarti.length);
      salvaImg(); salva(); disegnaFile(zona); aggiornaVivo(); aggiorna(); ricontrolla();
    });
    var inp = $('.carica__input', box); if (inp) inp.value = '';
  }
  // la prima posizione non ancora usata da un altro sponsor
  function posLibera() {
    var usate = stato.file.sponsor.map(function (f) { return f.pos; });
    return ['Centro petto', 'Schiena', 'Manica', 'Pantaloncino', 'Petto sinistro'].filter(function (p) { return usate.indexOf(p) < 0; })[0] || '';
  }
  function disegnaFile(zona) {
    var box = $('[data-carica="' + zona + '"]', form); if (!box) return;
    var z = ZONE[zona], l = $('[data-lista]', box);
    l.innerHTML = stato.file[zona].map(function (f) {
      var q = 'sp-pos-' + f.id, src = IMG[f.id];
      return '<li class="carica__file" data-id="' + f.id + '">' +
        '<span class="carica__ant">' + (f.pdf ? '<span class="carica__pdf">PDF</span>' : src ? '<img src="' + src + '" alt="" width="56" height="56">' : '<span class="carica__pdf">IMG</span>') + '</span>' +
        '<span class="carica__dati"><span class="carica__nome">' + escH(f.nome) + '</span><span class="carica__peso">' + peso(f.size) + (src || f.pdf ? '' : ' · anteprima non salvata') + '</span></span>' +
        (z.pos ? '<span class="campo carica__pos"><label for="' + q + '">Posizione</label><select id="' + q + '" data-pos="' + f.id + '"><option value="">Scegli…</option>' +
          G.posizioni.map(function (p) { return '<option' + (f.pos === p ? ' selected' : '') + '>' + escH(p) + '</option>'; }).join('') + '</select><span class="campo__err" id="' + q + '-err" hidden></span></span>' : '') +
        '<button class="carica__elimina" type="button" data-elimina="' + zona + ':' + f.id + '" aria-label="Elimina ' + escH(f.nome) + '">' + S.icona('chiudi', 'ico ico--s') + '<span>Elimina</span></button></li>';
    }).join('');
    // lo stemma è uno solo: la zona si nasconde quando c'è già
    if (zona === 'stemma') $('[data-zona]', box).hidden = !!stato.file.stemma.length;
  }
  function posSponsor(s) {
    var f = stato.file.sponsor.filter(function (x) { return x.id === +s.getAttribute('data-pos'); })[0]; if (!f) return;
    f.pos = s.value; S.erroreCampo(s, ''); salva(); aggiornaVivo(); aggiorna();
  }
  $$('[data-carica]', form).forEach(function (box) {
    var zona = box.getAttribute('data-carica'), inp = $('.carica__input', box), z = $('[data-zona]', box);
    inp.addEventListener('change', function () { aggiungi(zona, inp.files); });
    ['dragenter', 'dragover'].forEach(function (t) { z.addEventListener(t, function (e) { e.preventDefault(); z.classList.add('is-sopra'); }); });
    ['dragleave', 'drop'].forEach(function (t) { z.addEventListener(t, function () { z.classList.remove('is-sopra'); }); });
    z.addEventListener('drop', function (e) { e.preventDefault(); aggiungi(zona, e.dataTransfer && e.dataTransfer.files); });
    $('[data-lista]', box).addEventListener('click', function (e) {
      var b = e.target.closest('[data-elimina]'); if (!b) return;
      var id = +b.getAttribute('data-elimina').split(':')[1], lista = stato.file[zona], k = lista.map(function (x) { return x.id; }).indexOf(id); if (k < 0) return;
      var nome = lista[k].nome; lista.splice(k, 1); delete IMG[id];
      if (zona === 'stemma') $('[data-palette-txt]', form).textContent = 'Carica lo stemma: prendiamo da lì i colori principali. Puoi sempre cambiarli a mano.';
      salvaImg(); salva(); disegnaFile(zona); aggiornaVivo(); aggiorna();
      $('[data-avviso]', box).textContent = nome + ' eliminato.'; $('[data-avviso]', box).classList.remove('is-err');
      var dopo = $$('[data-elimina]', box)[Math.min(k, lista.length - 1)];
      (dopo || inp).focus({ preventScroll: true });
    });
  });
  // un file lasciato fuori dalle zone non deve aprirsi al posto della pagina
  ['dragover', 'drop'].forEach(function (t) {
    d.addEventListener(t, function (e) { if (passo === 4 && e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') > -1 && !e.target.closest('[data-zona]')) e.preventDefault(); });
  });

  /* ---------------- palette: colori presi dallo stemma (canvas), modificabili ---------------- */
  function hexDi(r, g, b) { return '#' + [r, g, b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
  function dist(a, b) { return Math.sqrt(Math.pow(a[0] - b[0], 2) * 0.3 + Math.pow(a[1] - b[1], 2) * 0.59 + Math.pow(a[2] - b[2], 2) * 0.11) * 1.7; }
  function coloriDa(cv) {
    var W = 72, H = Math.max(1, Math.round(W * cv.height / cv.width)), c = d.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d'); x.drawImage(cv, 0, 0, W, H);
    var px = x.getImageData(0, 0, W, H).data, sec = {}, bordo = {}, nB = 0;
    for (var i = 0; i < px.length; i += 4) {
      if (px[i + 3] < 140) continue;
      var k = (px[i] >> 4) + ',' + (px[i + 1] >> 4) + ',' + (px[i + 2] >> 4), p = i / 4, xx = p % W, yy = (p / W) | 0;
      var s = sec[k] || (sec[k] = { n: 0, r: 0, g: 0, b: 0 }); s.n++; s.r += px[i]; s.g += px[i + 1]; s.b += px[i + 2];
      if (xx < 2 || yy < 2 || xx > W - 3 || yy > H - 3) { bordo[k] = (bordo[k] || 0) + 1; nB++; }
    }
    // lo sfondo (colore che riempie quasi tutto il bordo) conta meno
    Object.keys(bordo).forEach(function (k) { if (bordo[k] > nB * 0.5) sec[k].n *= 0.2; });
    var lista = Object.keys(sec).map(function (k) { var s = sec[k]; return { n: s.n, c: [s.r / s.n, s.g / s.n, s.b / s.n] }; }).sort(function (a, b) { return b.n - a.n; });
    var tot = lista.reduce(function (a, s) { return a + s.n; }, 0), scelti = [];
    lista.forEach(function (s) {
      var vicino = scelti.filter(function (x) { return dist(x.c, s.c) < 70; })[0];
      if (vicino) vicino.n += s.n; else scelti.push({ n: s.n, c: s.c });
    });
    return scelti.sort(function (a, b) { return b.n - a.n; }).filter(function (s) { return s.n > tot * 0.03; }).slice(0, 4).map(function (s) { return hexDi(s.c[0], s.c[1], s.c[2]); });
  }
  function daStemma(cv) {
    var col = [];
    try { col = coloriDa(cv); } catch (e) {}
    var txt = $('[data-palette-txt]', form);
    if (col.length < 2) { txt.textContent = 'Dallo stemma non riusciamo a leggere abbastanza colori: completali qui sotto.'; if (col.length) setPalette(col, true); return; }
    setPalette(col, true);
    txt.textContent = 'Abbiamo preso ' + col.length + ' colori dallo stemma. Puoi cambiarli o aggiungerne.';
  }
  function setPalette(col, auto) {
    stato.palette = col.filter(function (c, i, a) { return a.indexOf(c) === i; }).slice(0, 4);
    stato.paletteAuto = !!auto;
    if (stato.palette.indexOf(stato.col1) < 0) stato.col1 = stato.palette[0] || '';
    if (stato.palette.indexOf(stato.col2) < 0 || stato.col2 === stato.col1) stato.col2 = stato.palette.filter(function (c) { return c !== stato.col1; })[0] || '';
    togliScelta(); disegnaPalette(); salva(); aggiorna(); ricontrolla();
  }
  function nomeColore(hex) {
    var c = MS.norm({ c1: hex }).c1, a = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5), 16)], best = null, bd = 1e9;
    K.colori.forEach(function (k) { var b = [parseInt(k.hex.slice(1, 3), 16), parseInt(k.hex.slice(3, 5), 16), parseInt(k.hex.slice(5), 16)], x = dist(a, b); if (x < bd) { bd = x; best = k.nome; } });
    return best || hex;
  }
  function disegnaPalette() {
    var ul = $('[data-palette]', form);
    ul.innerHTML = stato.palette.map(function (c, i) {
      return '<li class="palette__c"><label class="palette__campione" style="--c:' + c + '"><input type="color" value="' + c.toLowerCase() + '" data-pal="' + i + '"><span class="sr-only">Cambia il colore ' + (i + 1) + ' (' + escH(nomeColore(c)) + ')</span></label>' +
        '<span class="palette__nome">' + escH(nomeColore(c)) + '<small>' + c + '</small></span>' +
        '<button class="palette__via" type="button" data-pal-via="' + i + '" aria-label="Togli ' + escH(nomeColore(c)) + '">' + S.icona('chiudi', 'ico ico--s') + '</button></li>';
    }).join('') || '<li class="palette__vuota">Nessun colore ancora.</li>';
    $$('[data-rapido]', form).forEach(function (b) { b.setAttribute('aria-pressed', String(stato.palette.indexOf(b.getAttribute('data-rapido').toUpperCase()) > -1)); });
    colStile();
  }
  var tPal = 0;
  function paletteInput(t) {
    var i = +t.getAttribute('data-pal'), v = t.value.toUpperCase(), vecchio = stato.palette[i];
    if (!HEX.test(v)) return;
    stato.palette[i] = v; stato.paletteAuto = false;
    if (stato.col1 === vecchio) stato.col1 = v;
    if (stato.col2 === vecchio) stato.col2 = v;
    togliScelta(); salva(); aggiorna();
    var lab = t.closest('.palette__campione'); lab.style.setProperty('--c', v);
    clearTimeout(tPal); tPal = setTimeout(function () { var li = lab.closest('li'); $('.palette__nome', li).innerHTML = escH(nomeColore(v)) + '<small>' + v + '</small>'; }, 120);
  }
  form.addEventListener('click', function (e) {
    var r = e.target.closest('[data-rapido]'), v = e.target.closest('[data-pal-via]');
    if (r) {
      var c = r.getAttribute('data-rapido').toUpperCase(), k = stato.palette.indexOf(c), msg = $('#k-palette-err');
      if (k > -1) { stato.palette.splice(k, 1); setPalette(stato.palette.slice(), false); return; }
      if (stato.palette.length >= 4) { S.erroreCampo($('#k-palette'), 'Al massimo 4 colori: togline uno per aggiungerne un altro.'); return; }
      if (msg) S.erroreCampo($('#k-palette'), '');
      setPalette(stato.palette.concat([c]), false);
    }
    if (v) {
      var j = +v.getAttribute('data-pal-via'); stato.palette.splice(j, 1); setPalette(stato.palette.slice(), false);
      var dopo = $$('[data-pal-via]', form)[Math.min(j, stato.palette.length - 1)];
      (dopo || $('[data-rapido]', form)).focus({ preventScroll: true });
    }
  });

  /* =====================================================================
     PASSO 5 · STILE, DISEGNO, COLLO, COLORI  (anteprima dal vivo)
     ===================================================================== */
  var maniche = function () { var m = stato.capi.maglia, t = m && m.on ? m.tipo : ''; return t === 'Maniche lunghe' ? 'lunghe' : t === 'Canotta' ? 'canotta' : 'corte'; };
  function sigla() {
    var w = String(stato.squadra || '').replace(/\b(a\.?s\.?d\.?|s\.?s\.?d\.?|u\.?s\.?|a\.?c\.?|a\.?s\.?|f\.?c\.?|polisportiva|associazione|sportiva|dilettantistica|società|societa|club)(?=\s|$)/gi, ' ').trim().split(/\s+/).filter(Boolean);
    return (w.length > 1 ? w[0].charAt(0) + w[1].charAt(0) : (w[0] || '').slice(0, 2)).toUpperCase();
  }
  function primo() { return stato.rosa.filter(function (r) { return r.nome || r.num; })[0] || {}; }
  // parti "vive" della maglia: stemma, sponsor, nome e numero del primo della rosa, maniche
  function vivo(segnaNome) {
    var st = stato.file.stemma[0], r = primo();
    return {
      stemma: stato.stemma === 'file' && st && !st.pdf && IMG[st.id] ? { src: IMG[st.id] } : null,
      sigla: sigla(),
      sponsor: stato.file.sponsor.filter(function (f) { return f.pos; }).map(function (f) { return { src: f.pdf ? '' : IMG[f.id] || '', nome: f.nome, pos: f.pos }; }),
      nome: r.nome || (segnaNome ? 'NOME' : ''), numero: r.num || (segnaNome ? '10' : ''), maniche: maniche()
    };
  }
  function terzo(c1, c2) { return stato.palette.filter(function (c) { return c !== c1 && c !== c2; })[0]; }
  function designBase() {
    var c1 = stato.col1 || stato.palette[0] || '#1B2A5B', c2 = stato.col2 || stato.palette.filter(function (c) { return c !== c1; })[0] || '#F6F5F1';
    return { c1: c1, c2: c2, c3: terzo(c1, c2), disegno: stato.disegno || 'tinta', collo: stato.collo || 'girocollo', stile: stato.stile || 'classico' };
  }
  var unisci = function (a, b) { return Object.assign({}, a, b); };
  function togliScelta() { if (stato.scelta) { stato.scelta = null; stato.sceltaK = ''; } }
  function colStile() {
    ['col1', 'col2'].forEach(function (n) {
      var box = $('[data-colori="' + n + '"]', form); if (!box) return;
      box.innerHTML = stato.palette.map(function (c) {
        return '<label class="colore2" style="--c:' + c + '"><input type="radio" name="' + n + '" value="' + c + '"' + (stato[n] === c ? ' checked' : '') + '><span class="colore2__c"></span><span class="colore2__n">' + escH(nomeColore(c)) + '</span></label>';
      }).join('') || '<p class="campo__aiuto">Prima scegli i colori della squadra al passo 4.</p>';
    });
  }
  var compStile = null, compProp = null, chiaveOpz = '';
  function stileVivo() {
    if (passo !== 5) return;
    var el = $('[data-mgs-stile]', form);
    if (!compStile) compStile = MS.componente(el, { aiuto: true });
    compStile.aggiorna(unisci(designBase(), vivo(true)));
    // miniature delle opzioni con i colori della squadra
    var b = designBase(), k = [b.c1, b.c2, b.c3, b.stile, b.disegno, b.collo, maniche()].join('|');
    if (k === chiaveOpz) return; chiaveOpz = k;
    $$('[data-opz-ant]', form).forEach(function (s) {
      var p = s.getAttribute('data-opz-ant').split(':'), dz = unisci(b, { maniche: maniche() }); dz[p[0]] = p[1];
      var h = MS.svg(dz, 'fronte', { mini: true });
      if (p[0] === 'collo') h = h.replace('viewBox="0 0 400 460"', 'viewBox="110 0 180 150"');
      s.innerHTML = h;
    });
  }

  /* =====================================================================
     PASSO 6 · ROSA (nomi, numeri, taglie)
     ===================================================================== */
  var listaR = $('[data-rosa]', form);
  function opzTaglie(v) {
    var o = function (t) { return '<option' + (t === v ? ' selected' : '') + '>' + escH(t) + '</option>'; };
    return '<option value="">Taglia…</option><optgroup label="Adulto">' + TAGLIE_A.map(o).join('') + '</optgroup><optgroup label="Bambino">' + TAGLIE_B.map(o).join('') + '</optgroup>';
  }
  function disegnaRosa() {
    listaR.innerHTML = stato.rosa.map(function (r, i) {
      var n = i + 1, id = 'r' + i;
      return '<li class="rosa__riga" data-i="' + i + '"><span class="rosa__n" aria-hidden="true">' + n + '</span>' +
        '<span class="rosa__c rosa__c--nome"><label class="sr-only" for="' + id + '-nome">Nome sul retro, giocatore ' + n + '</label><input id="' + id + '-nome" data-r="nome" type="text" value="' + escH(r.nome) + '" maxlength="' + K.maxNome + '" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Nome sul retro"></span>' +
        '<span class="rosa__c rosa__c--num"><label class="sr-only" for="' + id + '-num">Numero, giocatore ' + n + '</label><input id="' + id + '-num" data-r="num" type="text" value="' + escH(r.num) + '" inputmode="numeric" maxlength="' + K.maxNumero + '" autocomplete="off" placeholder="N."><span class="campo__err" id="' + id + '-num-err" hidden></span></span>' +
        '<span class="rosa__c rosa__c--taglia"><label class="sr-only" for="' + id + '-taglia">Taglia, giocatore ' + n + '</label><select id="' + id + '-taglia" data-r="taglia">' + opzTaglie(r.taglia) + '</select><span class="campo__err" id="' + id + '-taglia-err" hidden></span></span>' +
        '<button class="rosa__guida" type="button" data-r-guida>Non sai la taglia?</button>' +
        '<button class="rosa__via" type="button" data-r-via aria-label="Togli il giocatore ' + n + '">' + S.icona('chiudi', 'ico ico--s') + '</button></li>';
    }).join('');
    $('[data-rosa-aggiungi]', form).disabled = stato.rosa.length >= K.maxRosa;
    contiRosa();
  }
  function doppi() {
    var visti = {}, dop = [];
    stato.rosa.forEach(function (r) { if (!r.num) return; var n = +r.num; if (visti[n] && dop.indexOf(n) < 0) dop.push(n); visti[n] = 1; });
    return dop;
  }
  function contiRosa() {
    var conti = {}, senza = 0;
    stato.rosa.forEach(function (r) { if (r.taglia) conti[r.taglia] = (conti[r.taglia] || 0) + 1; else senza++; });
    var box = $('[data-rosa-conti]', form), n = stato.rosa.length;
    box.innerHTML = n ? '<p class="rosa__tot"><b>' + n + '</b> ' + (n === 1 ? 'giocatore' : 'giocatori') + '</p><ul class="rosa__taglie">' +
      TAGLIE.filter(function (t) { return conti[t]; }).map(function (t) { return '<li><b>' + escH(t) + '</b> × ' + conti[t] + '</li>'; }).join('') +
      (senza ? '<li class="is-senza">senza taglia × ' + senza + '</li>' : '') + '</ul>' : '';
    // numeri doppi: segnalati subito
    var dop = doppi();
    stato.rosa.forEach(function (r, i) {
      var el = d.getElementById('r' + i + '-num'); if (!el) return;
      var x = r.num && dop.indexOf(+r.num) > -1;
      if (x) S.erroreCampo(el, 'Numero già usato.'); else if (el.getAttribute('aria-invalid') === 'true') S.erroreCampo(el, '');
    });
    // rosa e maglie: se non tornano, si possono allineare
    var diff = $('[data-rosa-diff]', form), qM = qDi('maglia');
    if (n && qM && n !== qM) {
      diff.hidden = false;
      diff.innerHTML = 'Nella rosa ci sono ' + n + ' giocatori, le maglie sono ' + qM + '. <button class="link" type="button" data-allinea>Porta tutti i capi a ' + n + ' pezzi</button>';
    } else diff.hidden = true;
  }
  function rosaInput(t) {
    var li = t.closest('[data-i]'), i = +li.getAttribute('data-i'), r = stato.rosa[i], k = t.getAttribute('data-r'); if (!r) return;
    if (k === 'nome') { var v = pulisciNome(t.value); if (v !== t.value) t.value = v; r.nome = v; }
    if (k === 'num') { var w = pulisciNum(t.value); if (w !== t.value) t.value = w; r.num = w; }
    if (k === 'taglia') { r.taglia = t.value; S.erroreCampo(t, ''); }
    contiRosa(); salva(); aggiorna(); ricontrolla();
    if (i === stato.rosa.indexOf(primo()) || k !== 'taglia') aggiornaVivo();
  }
  function aggiungiRighe(righe) {
    var spazio = K.maxRosa - stato.rosa.length;
    righe = righe.slice(0, Math.max(0, spazio));
    stato.rosa = stato.rosa.concat(righe);
    salva(); disegnaRosa(); aggiorna(); aggiornaVivo(); ricontrolla();
    return righe.length;
  }
  function puliziaRosa() {
    // le righe completamente vuote si tolgono da sole
    var prima = stato.rosa.length;
    stato.rosa = stato.rosa.filter(function (r) { return r.nome || r.num || r.taglia; });
    if (stato.rosa.length !== prima) { salva(); disegnaRosa(); }
  }
  // legge le righe incollate da Excel / Fogli Google: nome, numero e taglia in qualsiasi ordine
  function taglia(t) {
    t = String(t || '').trim().toUpperCase().replace(/\s+/g, ' ');
    if (!t) return '';
    var alias = { XXXL: '3XL', '2XL': 'XXL', 'XXS': 'XS' };
    if (alias[t]) t = alias[t];
    if (TAGLIE_A.indexOf(t) > -1) return t;
    var m = /^(\d{1,2})\s*(A|ANNI)?$/.exec(t);
    if (m && TAGLIE_B.indexOf(+m[1] + ' anni') > -1 && (m[2] || +m[1] <= 14)) return +m[1] + ' anni';
    return '';
  }
  function leggiIncolla(testo) {
    var righe = [], scarti = 0, senza = 0;
    String(testo || '').split(/\r?\n/).forEach(function (l) {
      if (!l.trim()) return;
      var p = l.split(/\t|;|,/).map(function (x) { return x.trim(); }).filter(Boolean);
      if (!p.length) return;
      // regola: il primo numero è il numero di maglia, un secondo numero è la taglia bambino (es. 10 = 10 anni);
      // lettere come S, M, XL o "10 anni" sono la taglia; il resto è il nome
      var r = { nome: '', num: '', taglia: '' }, resto = [];
      p.forEach(function (x) {
        if (/^\d{1,3}$/.test(x)) {
          if (!r.num) r.num = x; else if (!r.taglia && taglia(x)) r.taglia = taglia(x); else resto.push(x);
          return;
        }
        var tg = taglia(x);
        if (tg && !r.taglia) { r.taglia = tg; return; }
        resto.push(x);
      });
      r.nome = pulisciNome(resto.join(' '));
      if (/^(nome|cognome|giocatore)$/i.test(resto[0] || '') && !r.num) return;     // riga di intestazione
      if (!r.nome && !r.num && !r.taglia) { scarti++; return; }
      if (!r.taglia) senza++;
      righe.push(r);
    });
    return { righe: righe, scarti: scarti, senza: senza };
  }
  form.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-rosa-aggiungi]')) {
      if (aggiungiRighe([{ nome: '', num: '', taglia: '' }])) { var ult = d.getElementById('r' + (stato.rosa.length - 1) + '-nome'); if (ult) ult.focus({ preventScroll: false }); }
      return;
    }
    var via = t.closest('[data-r-via]');
    if (via) {
      var i = +via.closest('[data-i]').getAttribute('data-i');
      stato.rosa.splice(i, 1); salva(); disegnaRosa(); aggiorna(); aggiornaVivo(); ricontrolla();
      var dopo = $$('[data-r-via]', listaR)[Math.min(i, stato.rosa.length - 1)];
      (dopo || $('[data-rosa-aggiungi]', form)).focus({ preventScroll: true });
      return;
    }
    var gd = t.closest('[data-r-guida]');
    if (gd && S.apriGuida) {
      var li = gd.closest('[data-i]'), j = +li.getAttribute('data-i');
      S.apriGuida('divise', gd, { usa: function (tg) {
        if (!stato.rosa[j]) return;
        stato.rosa[j].taglia = tg; var sel = d.getElementById('r' + j + '-taglia');
        if (sel) { sel.value = tg; S.erroreCampo(sel, ''); }
        contiRosa(); salva(); aggiorna(); ricontrolla();
        S.mostraAvviso('Taglia ' + tg + ' inserita per il giocatore ' + (j + 1) + '.');
      } });
      return;
    }
    if (t.closest('[data-rosa-incolla]')) {
      var ta = $('#k-incolla'), es = $('[data-incolla-esito]', form), r = leggiIncolla(ta.value);
      if (!r.righe.length) { es.textContent = 'Non ho trovato giocatori: una riga per giocatore, con nome, numero e taglia.'; es.classList.add('is-err'); return; }
      var n = aggiungiRighe(r.righe);
      es.classList.remove('is-err');
      es.textContent = 'Aggiunti ' + n + (n === 1 ? ' giocatore' : ' giocatori') + '.' + (r.senza ? ' In ' + r.senza + (r.senza === 1 ? ' riga' : ' righe') + ' manca la taglia: sceglila tu.' : '') + (n < r.righe.length ? ' Massimo ' + K.maxRosa + ' giocatori.' : '');
      ta.value = '';
      return;
    }
    if (t.closest('[data-allinea]')) {
      var q = stato.rosa.length;
      capiOn().forEach(function (c) { stato.capi[c.id].q = q; });
      salva(); disegnaCapi1(); contiRosa(); aggiorna();
      S.mostraAvviso('Tutti i capi ora sono ' + q + ' pezzi.');
    }
  });

  /* =====================================================================
     PASSO 7 · PROPOSTE (6, generate dai colori della squadra)
     2 fedeli · 2 variazioni · 2 audaci. "Rigenera" cambia le ultime 4.
     ===================================================================== */
  function rnd(seme) { var a = seme >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var pesca = function (r, l) { return l[Math.floor(r() * l.length)]; };
  var altri = function (l, x) { return l.filter(function (v) { return v !== x; }); };
  function vivace(l) {
    // il colore più "acceso" della palette
    return l.slice().sort(function (a, b) {
      var s = function (h) { var c = [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); return Math.max.apply(0, c) - Math.min.apply(0, c); };
      return s(b) - s(a);
    })[0];
  }
  function proposte() {
    var b = designBase(), r = rnd(stato.seme * 7919 + 13), pal = stato.palette.length ? stato.palette : [b.c1, b.c2];
    var D = MS.DISEGNI, ST = MS.STILI, CO = MS.COLLI, l = [];
    l.push({ k: 'Fedele', d: b });
    l.push({ k: 'Fedele', d: unisci(b, MS.contrasto(b.c1, b.c2) > 1.6 ? { c1: b.c2, c2: b.c1 } : { collo: pesca(r, altri(CO, b.collo)) }) });
    var d1 = pesca(r, altri(D, b.disegno));
    l.push({ k: 'Variazione', d: unisci(b, { disegno: d1, collo: r() > 0.5 ? pesca(r, altri(CO, b.collo)) : b.collo }) });
    l.push({ k: 'Variazione', d: unisci(b, { disegno: pesca(r, altri(altri(D, b.disegno), d1)), stile: pesca(r, altri(ST, b.stile)), c2: b.c3 && r() > 0.4 ? b.c3 : b.c2, c3: b.c3 ? b.c2 : undefined }) });
    var acc = vivace(pal), scuro = pal.slice().sort(function (x, y) { return MS.lum(x) - MS.lum(y); })[0];
    var a1c2 = acc === b.c1 ? b.c2 : b.c1;
    l.push({ k: 'Audace', d: { c1: acc, c2: a1c2, c3: terzo(acc, a1c2), disegno: pesca(r, ['diagonale', 'sfumato']), stile: 'geometrico', collo: pesca(r, CO) } });
    var a2c1 = scuro === acc ? b.c2 : scuro, a2c2 = acc === a2c1 ? b.c1 : acc;
    l.push({ k: 'Audace', d: { c1: a2c1, c2: a2c2, c3: terzo(a2c1, a2c2), disegno: pesca(r, ['maniche', 'strisce', 'diagonale']), stile: 'moderno', collo: pesca(r, ['v', 'polo']) } });
    // niente doppioni
    var visti = {};
    l.forEach(function (p) {
      var k = function () { return [p.d.c1, p.d.c2, p.d.disegno, p.d.stile, p.d.collo].join('|'); };
      var g = 0; while (visti[k()] && g < 6) { p.d = unisci(p.d, { collo: CO[(CO.indexOf(p.d.collo) + 1) % 3], disegno: g > 2 ? D[(D.indexOf(p.d.disegno) + 1) % D.length] : p.d.disegno }); g++; }
      visti[k()] = 1;
    });
    return l;
  }
  var nomeDisegno = function (id) { return (trova(K.disegni, id) || {}).nome || id; };
  var nomeStile = function (id) { return (trova(K.stili, id) || {}).nome || id; };
  var nomeCollo = function (id) { return ((trova(K.colli, id) || {}).nome || id).toLowerCase(); };
  function descr(dz) { return nomeDisegno(dz.disegno) + ' · ' + nomeColore(dz.c1).toLowerCase() + ' e ' + nomeColore(dz.c2).toLowerCase(); }
  var PROP = [], vista = -1;
  var stessa = function (a, b) { return a && b && a.c1 === b.c1 && a.c2 === b.c2 && a.disegno === b.disegno && a.stile === b.stile && a.collo === b.collo; };
  function disegnaProposte(nuove) {
    PROP = proposte();
    var ul = $('[data-prop-lista]', form);
    if (vista < 0 || nuove) vista = 0;
    if (stato.scelta) { var k = PROP.map(function (p) { return stessa(p.d, stato.scelta); }).indexOf(true); if (k > -1 && !nuove) vista = k; }
    ul.innerHTML = PROP.map(function (p, i) {
      var sc = stessa(p.d, stato.scelta);
      return '<li class="propc' + (sc ? ' is-scelta' : '') + (i === vista ? ' is-vista' : '') + '" style="--i:' + i + '" data-p="' + i + '">' +
        '<button class="propc__ant" type="button" data-p-vedi aria-label="Vedi in grande la proposta ' + (i + 1) + '" aria-pressed="' + (i === vista) + '">' + MS.svg(unisci(p.d, vivo(false)), 'fronte', { mini: true }) + '</button>' +
        '<p class="propc__k">' + (i + 1) + ' · ' + p.k + '</p><p class="propc__t">' + escH(descr(p.d)) + '</p><p class="propc__s">' + escH(nomeStile(p.d.stile) + ' · collo ' + nomeCollo(p.d.collo)) + '</p>' +
        '<button class="btn btn--sm ' + (sc ? 'btn--pri' : 'btn--sec') + ' propc__sc" type="button" data-p-scegli aria-pressed="' + sc + '">' + (sc ? S.icona('ok', 'ico ico--s') + 'Scelta' : 'Scegli questa') + '</button></li>';
    }).join('');
    ul.classList.remove('is-entra'); void ul.offsetWidth; ul.classList.add('is-entra');
    if (!compProp) compProp = MS.componente($('[data-mgs-prop]', form), { aiuto: true });
    propVivo();
  }
  function propVivo() {
    if (!compProp || !PROP[vista]) return;
    compProp.aggiorna(unisci(PROP[vista].d, vivo(true)));
    var p = PROP[vista], sc = stessa(p.d, stato.scelta);
    $('[data-prop-ora]', form).innerHTML = '<b>Proposta ' + (vista + 1) + ' · ' + escH(p.k) + '</b> ' + escH(descr(p.d)) + (sc ? ' <span class="prop__ok">' + S.icona('ok', 'ico ico--s') + 'scelta</span>' : '');
  }
  $('[data-prop-lista]', form).addEventListener('click', function (e) {
    var li = e.target.closest('[data-p]'); if (!li) return;
    var i = +li.getAttribute('data-p');
    if (e.target.closest('[data-p-vedi]')) {
      vista = i;
      $$('[data-p]', form).forEach(function (x, j) { x.classList.toggle('is-vista', j === i); $('[data-p-vedi]', x).setAttribute('aria-pressed', String(j === i)); });
      propVivo();
      if (innerWidth < 1100) vediSe($('[data-mgs-prop]', form));
    }
    if (e.target.closest('[data-p-scegli]')) {
      stato.scelta = pulisciDesign(PROP[i].d); stato.sceltaK = PROP[i].k + ' · ' + descr(PROP[i].d);
      vista = i; salva();
      $$('[data-p]', form).forEach(function (x, j) {
        var sc = j === i, b = $('[data-p-scegli]', x);
        x.classList.toggle('is-scelta', sc); x.classList.toggle('is-vista', j === i);
        b.className = 'btn btn--sm ' + (sc ? 'btn--pri' : 'btn--sec') + ' propc__sc'; b.setAttribute('aria-pressed', String(sc));
        b.innerHTML = sc ? S.icona('ok', 'ico ico--s') + 'Scelta' : 'Scegli questa';
      });
      propVivo(); ricontrolla(); aggiorna();
      S.mostraAvviso('Proposta ' + (i + 1) + ' scelta: la trovi nel preventivo.', 'Vai al preventivo', function () { avanti(); });
    }
  });
  $('[data-prop-rigenera]', form).addEventListener('click', function () {
    stato.seme++; salva(); disegnaProposte(true);
    S.mostraAvviso('Nuove proposte pronte.');
  });

  /* =====================================================================
     PASSO 8 · PREVENTIVO, CONSEGNA, CONDIVIDI, PDF, PAGAMENTO DEMO
     ===================================================================== */
  function designFinale() { return unisci(stato.scelta || designBase(), vivo(false)); }
  function mostraIndirizzo() { var x = $('[data-indirizzo]', form); if (x) x.hidden = stato.consegna !== 'spedizione'; }
  var chiavePrev = '';
  function anteprimaPrev() {
    var box = $('[data-prev-ant]', form); if (!box) return;
    var dz = designFinale(), k = JSON.stringify(dz).length + JSON.stringify(dz).slice(0, 400) + stato.sceltaK;
    if (k === chiavePrev) return; chiavePrev = k;
    box.innerHTML = '<div class="prev__maglie"><figure>' + MS.svg(dz, 'fronte') + '<figcaption>Davanti</figcaption></figure><figure>' + MS.svg(dz, 'retro') + '<figcaption>Dietro</figcaption></figure></div>' +
      '<div class="prev__coord" aria-hidden="true">' + MS.pantaloncino(dz) + MS.calzettoni(dz) + '</div>' +
      '<p class="prev__scelta">' + escH(stato.sceltaK || 'Proposta da scegliere al passo 7') + '</p>';
  }
  function riga(a, b, c, e, cls) { return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><th scope="row">' + a + '</th><td>' + b + '</td><td>' + c + '</td><td>' + e + '</td></tr>'; }
  function preventivo() {
    anteprimaPrev();
    var r = conto(), t = tempi(r.marca), box = $('[data-prev-tab]', form), sp = sportDi(stato.sport);
    var h = '<dl class="prev__dati"><div><dt>Preventivo</dt><dd>' + escH(stato.codice) + '</dd></div><div><dt>Squadra</dt><dd>' + escH(stato.squadra.trim()) + '</dd></div>' +
      '<div><dt>Sport</dt><dd>' + escH(sp ? sp.nome : '') + '</dd></div><div><dt>Marca</dt><dd>' + escH(r.marca.nome) + '</dd></div></dl>' +
      '<div class="prev__scorri"><table class="prev__t"><caption class="sr-only">Prezzi del kit</caption><thead><tr><th scope="col">Capo</th><th scope="col">Q.tà</th><th scope="col">Prezzo</th><th scope="col">Totale</th></tr></thead><tbody>';
    r.righe.forEach(function (x) {
      var dett = [x.tipo + (x.piuT ? ' (+' + euro(x.piuT) + ')' : ''), x.mat + (x.piuM ? ' (+' + euro(x.piuM) + ' materiale)' : '')].filter(function (s) { return s && s.charAt(0) !== ' '; });
      h += riga(escH(x.nome) + '<small>' + escH(dett.join(' · ')) + '</small>', x.q, euro(x.un), euro(x.tot));
    });
    r.pers.forEach(function (x) { h += riga(escH(x.nome), x.q, euro(x.un), euro(x.tot), 'is-pers'); });
    h += '</tbody><tfoot>' +
      riga('Subtotale', '', '', euro(r.sub)) +
      (r.sc ? riga('Sconto quantità <small>oltre ' + r.sc.oltre + ' kit · −' + r.sc.percento + '%</small>', '', '', '−' + euro(r.sconto), 'is-sconto') : riga('Sconto quantità <small>da ' + (LI.sconti[0].oltre + 1) + ' kit: −' + LI.sconti[0].percento + '%</small>', '', '', '—')) +
      riga(stato.consegna === 'spedizione' ? 'Spedizione' : 'Ritiro in negozio', '', '', stato.consegna === 'spedizione' ? euro(r.sped) : stato.consegna ? 'Gratis' : '—') +
      riga('Totale IVA inclusa <small>di cui IVA ' + LI.iva + '% ' + euro(r.iva) + '</small>', '', '', euro(r.tot), 'is-tot') +
      riga('Acconto ' + LI.acconto + '% <small>oggi, per confermare</small>', '', '', euro(r.acconto), 'is-acc') +
      riga('Saldo <small>' + (stato.consegna === 'spedizione' ? 'alla consegna' : 'al ritiro') + '</small>', '', '', euro(r.saldo)) +
      '</tfoot></table></div>' +
      '<p class="prev__tempi">' + S.icona('ritiro', 'ico ico--s') + '<span><b>Pronto tra il ' + dataBreve(t.da) + ' e il ' + dataBreve(t.a) + '</b> (circa ' + t.testo + ' dall\'approvazione della grafica' + (stato.consegna === 'spedizione' ? ', più la spedizione' : '') + ').</span></p>' +
      '<p class="etichetta-esempio">' + escH(LI.avviso) + '</p>';
    box.innerHTML = h;
    var paga = $('[data-paga]', form); if (paga) paga.innerHTML = 'Paga l\'acconto · ' + euro(r.acconto);
  }

  /* ---------------- link condivisibile: tutta la configurazione nell'indirizzo (senza immagini e senza dati personali del referente) ---------------- */
  function b64(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function da64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); }
  function pacchetto() {
    var c = {}; capiOn().forEach(function (x) { var s = stato.capi[x.id]; c[x.id] = [s.q, s.tipo, s.mat]; });
    var dz = stato.scelta;
    return { v: 2, s: stato.squadra, sp: stato.sport, c: c, m: stato.marca, st: stato.stemma ? 'negozio' : '', so: stato.file.sponsor.filter(function (f) { return f.pos; }).map(function (f) { return [nomeBreve(f.nome), f.pos]; }),
      pl: stato.palette, y: [stato.stile, stato.disegno, stato.collo, stato.col1, stato.col2], r: stato.rosa.map(function (x) { return [x.nome, x.num, x.taglia]; }),
      d: dz ? [dz.c1, dz.c2, dz.c3 || '', dz.disegno, dz.stile, dz.collo] : null, dk: stato.sceltaK, k: stato.consegna, se: stato.seme };
  }
  function linkKit() { return location.href.split('#')[0].split('?')[0] + '#kit=' + b64(JSON.stringify(pacchetto())); }
  function daPacchetto(p) {
    var c = {}; Object.keys(p.c || {}).forEach(function (id) { var x = p.c[id] || []; c[id] = { on: true, q: x[0], tipo: x[1], mat: x[2] }; });
    var y = p.y || [], dz = p.d || null;
    var o = pulisci({ passo: N, max: N, squadra: p.s, sport: p.sp, capi: c, capiToccati: true, marca: p.m, stemma: p.st,
      palette: p.pl, stile: y[0], disegno: y[1], collo: y[2], col1: y[3], col2: y[4], seme: p.se,
      rosa: (p.r || []).map(function (x) { x = x || []; return { nome: x[0], num: x[1], taglia: x[2] }; }),
      scelta: dz ? { c1: dz[0], c2: dz[1], c3: dz[2], disegno: dz[3], stile: dz[4], collo: dz[5] } : null, sceltaK: p.dk, consegna: p.k });
    // sponsor: solo nome e posizione (il logo non viaggia nel link)
    o.file.sponsor = (Array.isArray(p.so) ? p.so : []).slice(0, G.maxFile).map(function (x, i) { x = x || []; return { id: 900 + i, nome: str(x[0], 40) || 'Sponsor', size: 0, pdf: true, pos: G.posizioni.indexOf(x[1]) > -1 ? x[1] : '' }; });
    return o;
  }
  function testoWa() {
    var r = conto(), sp = sportDi(stato.sport);
    return 'Ciao! Ecco la proposta per il kit di ' + stato.squadra.trim() + ' (' + (sp ? sp.nome.toLowerCase() : '') + ').\n' +
      'Capi: ' + r.righe.map(function (x) { return x.q + ' ' + x.nome.toLowerCase(); }).join(', ') + '\n' +
      'Marca: ' + r.marca.nome + ' · Maglia: ' + (stato.sceltaK || descr(designBase())) + '\n' +
      'Totale stimato: ' + euro(r.tot) + ' (' + LI.avviso.toLowerCase() + '), acconto ' + euro(r.acconto) + '\n' +
      'Guarda la maglia e il preventivo: ' + linkKit();
  }
  function condividi() {
    var a = $('[data-wa-squadra]', form); if (a) a.href = 'https://wa.me/?text=' + encodeURIComponent(testoWa());
  }
  var esitoC = $('[data-condividi-esito]', form);
  $('[data-link]', form).addEventListener('click', function () {
    var u = linkKit(), b = this;
    if (S.copia) S.copia(u, b, 'Link copiato');
    esitoC.textContent = 'Link copiato: chi lo apre vede la stessa proposta. Le immagini caricate non sono comprese.';
  });

  /* ---------------- PDF del preventivo (jsPDF ospitato nel sito, caricato solo al clic) ---------------- */
  var jsPdfP = null;
  function caricaJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve();
    if (jsPdfP) return jsPdfP;
    jsPdfP = new Promise(function (ok, ko) {
      var sc = d.createElement('script'); sc.src = S.REL + 'assets/js/vendor/jspdf.umd.min.js';
      sc.onload = function () { ok(); }; sc.onerror = function () { jsPdfP = null; ko(new Error('jspdf')); };
      d.head.appendChild(sc);
    });
    return jsPdfP;
  }
  function pdf(bt, esito) {
    if (bt.getAttribute('aria-busy') === 'true') return;
    var dz = designFinale(), r = conto(), t = tempi(r.marca), cod = (stato.ordine && stato.ordine.numero) || stato.codice || S.codice(K.prefissoCodice), sp = sportDi(stato.sport);
    bt.setAttribute('aria-busy', 'true'); esito.textContent = 'Preparo il PDF…';
    Promise.all([caricaJsPDF(), MS.png(dz, 'fronte', 560), MS.png(dz, 'retro', 560), MS.png(dz, null, 360, 'pantaloncino'), MS.png(dz, null, 240, 'calzettoni')]).then(function (im) {
      var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), L = C.legale || {}, Kc = C.contatti, X = 16, W = 178;
      var e = function (n) { return euro(n).replace('−', '-'); };
      function piede() {
        var n = doc.getNumberOfPages();
        for (var i = 1; i <= n; i++) {
          doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(110);
          doc.text([(L.ragioneSociale || C.attivita.nome) + ' – P.IVA ' + (L.partitaIva || '') + ' – ' + (L.sedeLegale || ''), 'Preventivo indicativo – demo · prezzi di esempio, nessun valore commerciale · pagina ' + i + ' di ' + n], X, 286);
        }
      }
      // intestazione
      doc.setTextColor(14, 15, 18); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text(C.attivita.nome.toUpperCase(), X, 20);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(92, 98, 108);
      doc.text(Kc.indirizzo + ', ' + Kc.cap + ' ' + Kc.citta + ' · ' + Kc.telefono, X, 26);
      doc.setTextColor(14, 15, 18); doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('Preventivo ' + cod, X + W, 20, { align: 'right' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(S.dataLunga(S.oggiRoma().iso), X + W, 26, { align: 'right' });
      doc.setFillColor(176, 16, 42); doc.rect(X, 31, W, 9, 'F'); doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
      doc.text('PREVENTIVO INDICATIVO – DEMO', X + 4, 37); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.text('prezzi di esempio, nessun pagamento reale', X + W - 4, 37, { align: 'right' });
      // maglia
      doc.addImage(im[1], 'PNG', X, 45, 54, 62.1); doc.addImage(im[2], 'PNG', X + 57, 45, 54, 62.1);
      doc.addImage(im[3], 'PNG', X + 117, 50, 34, 27.2); doc.addImage(im[4], 'PNG', X + 154, 46, 22, 29.9);
      doc.setTextColor(14, 15, 18); doc.setFontSize(8); doc.text('Davanti', X + 27, 110, { align: 'center' }); doc.text('Dietro', X + 84, 110, { align: 'center' });
      var info = [['Squadra', stato.squadra.trim()], ['Sport', sp ? sp.nome : ''], ['Marca', r.marca.nome + ' (fascia ' + r.marca.fascia.toLowerCase() + ')'], ['Maglia', stato.sceltaK || descr(dz)],
        ['Stile', nomeStile(dz.stile) + ' · collo ' + nomeCollo(dz.collo)], ['Stemma', stato.stemma === 'file' ? 'caricato dalla squadra' : 'da scegliere in negozio'], ['Consegna', stato.consegna === 'spedizione' ? 'Spedizione: ' + [stato.via, stato.cap + ' ' + stato.citta, stato.prov].filter(Boolean).join(', ') : 'Ritiro in negozio'],
        ['Tempi', 'pronto tra il ' + dataBreve(t.da) + ' e il ' + dataBreve(t.a) + ' (' + t.testo + ')']];
      var y = 84; doc.setFontSize(8.5);
      info.forEach(function (x) {
        var righe = doc.splitTextToSize(String(x[1]), 40);
        doc.setFont('helvetica', 'bold'); doc.text(x[0], X + 117, y); doc.setFont('helvetica', 'normal'); doc.text(righe, X + 137, y);
        y += righe.length * 3.7 + 1;
      });
      // tabella prezzi (sotto le immagini e sotto i dati, quello che finisce più in basso)
      y = Math.max(y + 6, 120);
      var col = [X, X + 112, X + 132, X + W];
      function intest(yy) { doc.setFillColor(23, 25, 29); doc.rect(X, yy - 5, W, 7, 'F'); doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.text('Capo', col[0] + 2, yy); doc.text('Q.tà', col[1], yy, { align: 'right' }); doc.text('Prezzo', col[2] + 18, yy, { align: 'right' }); doc.text('Totale', col[3] - 2, yy, { align: 'right' }); doc.setTextColor(14, 15, 18); }
      intest(y); y += 7;
      function rigaP(a, sub, q, un, tot, bold) {
        if (y > 268) { doc.addPage(); y = 22; intest(y); y += 7; }
        doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(9); doc.text(a, col[0] + 2, y);
        if (q !== '') doc.text(String(q), col[1], y, { align: 'right' }); if (un) doc.text(un, col[2] + 18, y, { align: 'right' }); doc.text(tot, col[3] - 2, y, { align: 'right' });
        if (sub) { doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(92, 98, 108); doc.text(sub, col[0] + 2, y + 3.6); doc.setTextColor(14, 15, 18); }
        y += sub ? 8.4 : 5.6; doc.setDrawColor(221, 217, 208); doc.line(X, y - 3.6, X + W, y - 3.6);
      }
      r.righe.forEach(function (x) { rigaP(x.nome, [x.tipo + (x.piuT ? ' (+' + e(x.piuT) + ')' : ''), x.mat + (x.piuM ? ' (+' + e(x.piuM) + ' materiale)' : '')].join(' · '), x.q, e(x.un), e(x.tot)); });
      r.pers.forEach(function (x) { rigaP(x.nome.replace(/[«»]/g, '"'), '', x.q, e(x.un), e(x.tot)); });
      y += 1;
      rigaP('Subtotale', '', '', '', e(r.sub));
      if (r.sc) rigaP('Sconto quantità (oltre ' + r.sc.oltre + ' kit, -' + r.sc.percento + '%)', '', '', '', '-' + e(r.sconto));
      rigaP(stato.consegna === 'spedizione' ? 'Spedizione' : 'Ritiro in negozio', '', '', '', stato.consegna === 'spedizione' ? e(r.sped) : 'Gratis');
      rigaP('Totale IVA inclusa', 'di cui IVA ' + LI.iva + '% ' + e(r.iva), '', '', e(r.tot), true);
      rigaP('Acconto ' + LI.acconto + '% all\'ordine', '', '', '', e(r.acconto), true);
      rigaP('Saldo ' + (stato.consegna === 'spedizione' ? 'alla consegna' : 'al ritiro'), '', '', '', e(r.saldo));
      doc.setFontSize(8); doc.setTextColor(92, 98, 108);
      doc.text(doc.splitTextToSize('I prodotti personalizzati non sono soggetti a reso. Prima della produzione inviamo la grafica da approvare. ' + LI.avviso + '.', W), X, y + 2);
      // rosa
      if (stato.rosa.length) {
        doc.addPage(); y = 22; doc.setTextColor(14, 15, 18); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text('Rosa e taglie · ' + stato.squadra.trim(), X, y); y += 8;
        var conti = {}; stato.rosa.forEach(function (x) { if (x.taglia) conti[x.taglia] = (conti[x.taglia] || 0) + 1; });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.text('Pezzi per taglia: ' + TAGLIE.filter(function (tg) { return conti[tg]; }).map(function (tg) { return tg + ' × ' + conti[tg]; }).join(' · '), X, y); y += 7;
        var c2 = [X, X + 12, X + 90, X + 115];
        var tit = function () { doc.setFillColor(23, 25, 29); doc.rect(X, y - 5, 140, 7, 'F'); doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.text('#', c2[0] + 2, y); doc.text('Nome sul retro', c2[1], y); doc.text('Numero', c2[2], y); doc.text('Taglia', c2[3], y); doc.setTextColor(14, 15, 18); doc.setFont('helvetica', 'normal'); y += 7; };
        tit();
        stato.rosa.forEach(function (x, i) {
          if (y > 274) { doc.addPage(); y = 22; tit(); }
          doc.text(String(i + 1), c2[0] + 2, y); doc.text(x.nome.toUpperCase() || '—', c2[1], y); doc.text(x.num || '—', c2[2], y); doc.text(x.taglia || '—', c2[3], y);
          doc.setDrawColor(221, 217, 208); doc.line(X, y + 2, X + 140, y + 2); y += 6.4;
        });
      }
      piede();
      doc.save('preventivo-' + cod + '.pdf');
      esito.textContent = 'PDF scaricato: preventivo-' + cod + '.pdf';
    }).catch(function () {
      esito.textContent = 'Non sono riuscito a creare il PDF. Riprova tra poco.';
    }).then(function () { bt.removeAttribute('aria-busy'); });
  }
  form.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pdf]'); if (!b) return;
    pdf(b, b.closest('[data-kit-fatto]') ? $('[data-fatto-esito]', form) : esitoC);
  });

  /* ---------------- pagamento DEMO dell'acconto ---------------- */
  var panPaga = null;
  $('[data-paga]', form).addEventListener('click', function () { paga(); });
  function paga() {
    // tutti i passi prima devono essere a posto
    for (var p = 1; p < N; p++) if (!valido(p, true)) { vai(p); valido(p); setTimeout(primoErrore, 30); return; }
    if (!valido(N)) { primoErrore(); return; }
    var r = conto();
    if (!S.Pannello) return;
    if (!panPaga) panPaga = S.Pannello('pagamento-demo', { cls: 'pan--paga' });
    panPaga.tit.textContent = 'Pagamento dell\'acconto';
    panPaga.corpo.innerHTML = '<p class="paga__demo" role="note">' + S.icona('ok', 'ico ico--s') + 'Demo – nessun pagamento reale</p>' +
      '<div class="paga__importo"><span>Acconto ' + LI.acconto + '% · ' + escH(stato.codice) + '</span><b>' + euro(r.acconto) + '</b><small>Totale ' + euro(r.tot) + ' · saldo ' + euro(r.saldo) + (stato.consegna === 'spedizione' ? ' alla consegna' : ' al ritiro') + '</small></div>' +
      '<div class="paga__carta" aria-label="Carta di prova"><span class="paga__chip" aria-hidden="true"></span><span class="paga__num">•••• •••• •••• 4242</span><span class="paga__riga"><span>CARTA DI PROVA</span><span>12/34</span></span></div>' +
      '<p class="paga__nota">È una simulazione: non serve inserire dati e non viene addebitato nulla. Nel sito vero qui ci sarà il pagamento sicuro della banca o di un servizio come Stripe.</p>' +
      '<button class="btn btn--pri btn--lg paga__ok" type="button" data-paga-ok>Conferma il pagamento di prova</button>' +
      '<p class="paga__esito" data-paga-esito role="status"></p>';
    $('[data-paga-ok]', panPaga.corpo).addEventListener('click', function () {
      var b = this; if (b.getAttribute('aria-disabled') === 'true') return;
      b.setAttribute('aria-disabled', 'true'); b.textContent = 'Pagamento di prova in corso…';
      setTimeout(function () { conferma(r); }, S.ridotto.matches ? 200 : 1100);
    });
    panPaga.apri($('[data-paga]', form));
  }
  function conferma(r) {
    var t = tempi(r.marca), ora = new Date(), iso = S.oggiRoma().iso;
    var hh = ('0' + ora.getHours()).slice(-2) + ':' + ('0' + ora.getMinutes()).slice(-2);
    var dz = designFinale();
    var ordine = {
      numero: stato.codice, data: iso + 'T' + hh, fase: 'ricevuto',
      storico: [{ fase: 'ricevuto', data: iso + 'T' + hh, nota: 'Acconto di prova registrato (demo).' }],
      squadra: stato.squadra.trim(), sport: stato.sport, marca: stato.marca, consegna: stato.consegna,
      indirizzo: stato.consegna === 'spedizione' ? { via: stato.via, cap: stato.cap, citta: stato.citta, prov: stato.prov } : null,
      referente: stato.referente.trim(), telefono: stato.telefono.trim(), email: stato.email.trim(), note: stato.note.trim(),
      capi: capiOn().map(function (c) { var s = stato.capi[c.id]; return { id: c.id, q: s.q, tipo: s.tipo, mat: s.mat }; }),
      design: { c1: dz.c1, c2: dz.c2, c3: dz.c3, disegno: dz.disegno, collo: dz.collo, stile: dz.stile, maniche: dz.maniche, sigla: dz.sigla, nome: dz.nome, numero: dz.numero, sponsor: dz.sponsor.map(function (s) { return { nome: s.nome, pos: s.pos }; }) },
      proposta: stato.sceltaK, stemma: stato.stemma, rosa: stato.rosa.slice(),
      totale: r.tot, acconto: r.acconto, saldo: r.saldo, sconto: r.sconto, spedizione: r.sped, pronto: [t.da, t.a]
    };
    var fine = function () {
      stato.ordine = { numero: ordine.numero, data: ordine.data, totale: r.tot, acconto: r.acconto, saldo: r.saldo, da: t.da, a: t.a };
      salva(); panPaga.chiudi(true); render(true);
    };
    if (DT) DT.ordini.salva(ordine).then(fine, fine); else fine();
  }
  function mostraFatto() {
    var f = $('[data-kit-fatto]', form), o = stato.ordine, url = S.REL + 'ordine/index.html?n=' + encodeURIComponent(o.numero);
    f.innerHTML = '<div class="conf">' +
      '<p class="conf__demo">Demo – nessun pagamento reale</p>' +
      '<h3 class="conf__tit" data-h tabindex="-1">' + S.icona('ok', 'ico') + 'Ordine confermato</h3>' +
      '<div class="codice"><p class="codice__et">Numero d\'ordine</p><p class="codice__val">' + escH(o.numero) + '</p><button class="btn btn--sec btn--sm" type="button" data-copia-ord>Copia</button></div>' +
      '<dl class="conf__dati"><div><dt>Acconto (prova)</dt><dd>' + euro(o.acconto) + '</dd></div><div><dt>Saldo ' + (stato.consegna === 'spedizione' ? 'alla consegna' : 'al ritiro') + '</dt><dd>' + euro(o.saldo) + '</dd></div>' +
      '<div><dt>Pronto</dt><dd>tra il ' + dataBreve(o.da) + ' e il ' + dataBreve(o.a) + '</dd></div></dl>' +
      '<p>Grazie! Entro 2 giorni lavorativi ti mandiamo la grafica definitiva da approvare. La produzione parte da lì.</p>' +
      '<div class="conf__az"><a class="btn btn--pri" href="' + url + '">Stato del tuo ordine ' + S.icona('dx', 'ico ico--s') + '</a>' +
      '<button class="btn btn--sec" type="button" data-pdf>Scarica il preventivo PDF</button>' +
      '<button class="btn btn--ghost" type="button" data-kit-nuovo>Prepara un altro kit</button></div>' +
      '<p class="condividi__esito" data-fatto-esito role="status"></p></div>';
    $('[data-copia-ord]', f).addEventListener('click', function () { S.copia(o.numero, this); });
    $('[data-kit-nuovo]', f).addEventListener('click', function () {
      stato = pulisci({}); IMG = {}; salva(); salvaImg(); scriviForm(); PROP = []; vista = -1; chiavePrev = ''; chiaveOpz = '';
      $('[data-capi-lista]', form).removeAttribute('data-per');
      ['stemma', 'sponsor', 'altre'].forEach(disegnaFile);
      passo = 1; render(true);
    });
  }

  /* =====================================================================
     TOTALE STIMATO: colonna a destra (computer) e barra in basso (telefono)
     ===================================================================== */
  var totEl = $('[data-tot]'), totSub = $('[data-tot-sub]'), totRighe = $('[data-tot-righe]');
  var mbar = d.createElement('div');
  mbar.className = 'kit-mbar'; mbar.hidden = true;
  mbar.innerHTML = '<div class="kit-mbar__tot"><span data-mbar-et>Totale stimato</span><b data-mbar-tot>—</b></div><button class="btn btn--pri kit-mbar__av" type="button" data-mbar-av>Avanti</button>';
  d.body.appendChild(mbar);                       // figlia diretta del body (iPhone)
  $('[data-mbar-av]', mbar).addEventListener('click', avanti);
  function totale() {
    var r = conto(), n = r.righe.length;
    if (!n) {
      totEl.textContent = '—'; totSub.textContent = 'Scegli sport e capi per vedere il prezzo.'; totRighe.innerHTML = '';
      $('[data-mbar-tot]', mbar).textContent = '—';
    } else {
      totEl.textContent = (r.da ? 'da ' : '') + euro(r.tot);
      totSub.textContent = r.kit + ' kit · ' + (r.da ? 'prezzi della ' + r.marca.nome : r.marca.nome) + (r.sc ? ' · sconto ' + r.sc.percento + '%' : '') + ' · IVA inclusa';
      totRighe.innerHTML = r.righe.map(function (x) { return '<li><span>' + x.q + ' × ' + escH(x.nome) + '</span><b>' + euro(x.tot) + '</b></li>'; }).join('') +
        (r.pers.length ? '<li><span>Personalizzazioni</span><b>' + euro(r.pers.reduce(function (a, x) { return a + x.tot; }, 0)) + '</b></li>' : '') +
        (r.sc ? '<li class="is-sconto"><span>Sconto −' + r.sc.percento + '%</span><b>−' + euro(r.sconto) + '</b></li>' : '') +
        (r.sped ? '<li><span>Spedizione</span><b>' + euro(r.sped) + '</b></li>' : '') +
        '<li class="is-acc"><span>Acconto ' + LI.acconto + '%</span><b>' + euro(r.acconto) + '</b></li>';
      $('[data-mbar-tot]', mbar).textContent = (r.da ? 'da ' : '') + euro(r.tot);
    }
    $('[data-mbar-av]', mbar).innerHTML = passo === N ? 'Paga l\'acconto' : passo === 7 ? 'Al preventivo' : 'Avanti ' + S.icona('dx', 'ico ico--s');
  }
  var chiaveMini = '';
  function mini() {
    var el = $('[data-kit-mini]'); if (!el) return;
    var dz = stato.palette.length || stato.scelta ? designFinale() : null, k = dz ? JSON.stringify([dz.c1, dz.c2, dz.c3, dz.disegno, dz.collo, dz.stile, dz.maniche, !!dz.stemma, dz.sigla]) : '';
    if (k === chiaveMini) return; chiaveMini = k;
    el.innerHTML = dz ? MS.svg(dz, 'fronte', { mini: true }) : '';
    el.hidden = !dz;
  }
  // barra in basso solo su telefono e tablet, quando il configuratore è in vista; nasconde la barra Chiama/WhatsApp
  var mq = matchMedia('(max-width: 1099px)'), inVista = false;
  function barraM() {
    var on = mq.matches && inVista && !stato.ordine;
    mbar.hidden = !on; d.body.classList.toggle('con-kit-mbar', on);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (v) { inVista = v[0].isIntersecting; barraM(); }, { rootMargin: '-30% 0px -10% 0px' }).observe(box);
  } else inVista = true;
  if (mq.addEventListener) mq.addEventListener('change', barraM); else if (mq.addListener) mq.addListener(barraM);

  /* =====================================================================
     AVVIO: link condiviso, maglia dal configuratore 3D, ripresa del lavoro
     ===================================================================== */
  // 1) link condiviso (#kit=…): si vede la stessa proposta; il kit di prima resta da parte
  var mKit = /^#kit=([A-Za-z0-9_-]+)$/.exec(location.hash);
  if (mKit) {
    try {
      var nuovo = daPacchetto(JSON.parse(da64(mKit[1])));
      var mio = leggiJ(CHIAVE);
      if (mio && (mio.sport || mio.squadra)) scriviJ(CHIAVE_PRIMA, { stato: mio, img: IMG });
      stato = nuovo; IMG = {}; salva(); salvaImg();
      S.mostraAvviso('Stai vedendo un kit condiviso con un link.', mio && (mio.sport || mio.squadra) ? 'Torna al mio kit' : '', function () {
        var pr = leggiJ(CHIAVE_PRIMA); if (!pr) return;
        scriviJ(CHIAVE, pr.stato); scriviJ(CHIAVE_IMG, pr.img || {}); scriviJ(CHIAVE_PRIMA, null);
        location.reload();
      });
    } catch (e) { S.mostraAvviso('Il link del kit non è valido o è incompleto.'); }
    history.replaceState(null, '', location.pathname + location.search + '#kit');
  }
  // 2) maglia creata nel configuratore 3D della home ("Usala nel kit squadra")
  var mg = leggiJ('slancio-maglia');
  if (mg && mg.usaNelKit === true) {
    delete mg.usaNelKit; scriviJ('slancio-maglia', mg);
    var col = (Array.isArray(mg.colori) ? mg.colori : []).filter(function (c) { return HEX.test(c); }).map(function (c) { return c.toUpperCase(); });
    var mot = { tinta: 'tinta', strisce: 'strisce', bande: 'strisce', diagonale: 'diagonale', quarti: 'maniche', sfumato: 'sfumato' }[mg.motivo];
    if (col.length >= 2) { stato.palette = col.filter(function (c, i, a) { return a.indexOf(c) === i; }).slice(0, 4); stato.col1 = col[0]; stato.col2 = col[1]; }
    if (mot) stato.disegno = mot;
    var stm = mg.stemma || {}, src = '';
    if (stm.tipo === 'file' && /^data:image\//.test(stm.dato || '')) src = stm.dato;
    if (stm.tipo === 'squadra') { var q = (C.maglia.squadre || []).filter(function (x) { return x.id === stm.id; })[0]; if (q) src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="200" height="240">' + q.stemma + '</svg>'); }
    if (src) { var idS = ++nId; IMG[idS] = src; stato.file.stemma = [{ id: idS, nome: stm.nomeFile || 'stemma.svg', size: 0, pdf: false, pos: '' }]; stato.stemma = 'file'; }
    if (mg.nome || mg.numero) {
      var r0 = stato.rosa[0] || (stato.rosa[0] = { nome: '', num: '', taglia: '' });
      if (!r0.nome) r0.nome = pulisciNome(mg.nome); if (!r0.num) r0.num = pulisciNum(mg.numero);
    }
    togliScelta(); salva(); salvaImg();
    S.mostraAvviso('La maglia del configuratore è nel kit: colori, disegno e stemma sono già pronti.');
  }
  // 3) ripresa dal passo salvato, ma solo se i passi prima sono completi
  scriviForm();
  var pp = 1, fino = stato.passo;
  while (pp < fino && valido(pp, true)) pp++;
  passo = pp;
  render(false);
  ['stemma', 'sponsor', 'altre'].forEach(disegnaFile);
  if (stato.file.stemma.length) $('[data-palette-txt]', form).textContent = stato.paletteAuto ? 'Colori presi dallo stemma. Puoi cambiarli o aggiungerne.' : 'Puoi cambiare i colori o aggiungerne.';
  if (mKit && !stato.ordine) setTimeout(function () { vediSe(box); }, 60);
  addEventListener('storage', function (e) { if (e.key === CHIAVE && !d.hasFocus()) { stato = pulisci(leggiJ(CHIAVE)); IMG = leggiJ(CHIAVE_IMG) || {}; scriviForm(); render(false); } });
})();
