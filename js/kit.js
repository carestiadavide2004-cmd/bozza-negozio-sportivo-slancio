/* =====================================================================
   SLANCIO – kit.js · "Crea il tuo kit" per squadre e associazioni
   4 passi, dati tenuti solo nel browser (localStorage), preventivo INDICATIVO
   con i prezzi di esempio di config.js. Testi dell'utente usati solo come testo.
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO, S = window.SLANCIO;
  var form = S && S.$('[data-kit]');
  if (!C || !S || !form || !C.kit) return;
  var K = C.kit, d = document, $ = S.$, $$ = S.$$, escH = S.escH, euro = S.euro;
  var CHIAVE = 'slancio-kit';
  var TITOLI = ['Sport', 'Pacchetto', 'Squadra', 'Riepilogo'];
  var CAMPI = ['sport', 'pacchetto', 'squadra', 'adulti', 'bambini', 'nomi', 'stemma', 'maglia', 'referente', 'telefono', 'email', 'note'];

  function leggi() { try { var x = JSON.parse(localStorage.getItem(CHIAVE)); if (x && typeof x === 'object') return x; } catch (e) {} return {}; }
  var stato = leggi();
  function salva() { try { localStorage.setItem(CHIAVE, JSON.stringify(stato)); } catch (e) {} }
  var sportDi = function (id) { return K.sport.filter(function (s) { return s.id === id; })[0]; };
  var pacDi = function () { var s = sportDi(stato.sport); return s ? s.pacchetti.filter(function (p) { return p.id === stato.pacchetto; })[0] : null; };
  var intero = function (v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
  var maglia = function () { return S.maglia ? S.maglia.leggi() : null; };

  /* ---------------- preventivo indicativo ---------------- */
  function preventivo() {
    var p = pacDi(); if (!p) return null;
    var ad = Math.max(0, intero(stato.adulti)), bi = Math.max(0, intero(stato.bambini)), n = ad + bi;
    var pBi = Math.round(p.prezzo * (100 - K.scontoBambiniPercento)) / 100;
    var r = { p: p, ad: ad, bi: bi, n: n, pBi: pBi, kAd: ad * p.prezzo, kBi: bi * pBi };
    r.nomi = stato.nomi === 'si' ? n * K.personalizzazioni.nomeNumero : 0;
    r.stemma = stato.stemma === 'si' ? n * K.personalizzazioni.stemma : 0;
    r.sub = r.kAd + r.kBi + r.nomi + r.stemma;
    r.sc = K.scontiQuantita.filter(function (x) { return n >= x.da; }).sort(function (a, b) { return b.percento - a.percento; })[0] || null;
    r.sconto = r.sc ? Math.round(r.sub * r.sc.percento) / 100 : 0;
    r.tot = Math.round((r.sub - r.sconto) * 100) / 100;
    return r;
  }

  /* ---------------- form <-> stato ---------------- */
  function gruppoPac() { return $('[data-pacchetti="' + (stato.sport || '') + '"]', form); }
  function scriviForm() {
    CAMPI.forEach(function (n) {
      if (n === 'pacchetto') return;
      var els = $$('[name="' + n + '"]', form);
      els.forEach(function (el) {
        if (el.type === 'radio') el.checked = stato[n] === el.value;
        else if (stato[n] !== undefined) el.value = stato[n];
      });
    });
    mostraPacchetti();
  }
  function mostraPacchetti() {
    $$('[data-pacchetti]', form).forEach(function (g) {
      var si = g.getAttribute('data-pacchetti') === stato.sport;
      g.hidden = !si;
      $$('input', g).forEach(function (i) { i.disabled = !si; i.checked = si && i.value === stato.pacchetto; });
    });
    var s = sportDi(stato.sport);
    $('[data-kit-sport-nome]').textContent = s ? '· ' + s.nome : '';
  }
  form.addEventListener('input', function (e) { leggiCampo(e.target); });
  form.addEventListener('change', function (e) {
    leggiCampo(e.target);
    if (e.target.name === 'sport') mostraPacchetti();
    if (e.target.name === 'maglia' && e.target.value === 'configuratore') anteprimaMaglia();
  });
  function leggiCampo(t) {
    if (!t.name || CAMPI.indexOf(t.name) < 0) return;
    if (t.type === 'radio' && !t.checked) return;
    stato[t.name] = t.value;
    if (stato.inviato) delete stato.inviato;
    salva();
    // l'errore sparisce appena il campo è giusto
    if (t.getAttribute('aria-invalid') === 'true') controlla(t.name, true);
    var gr = t.type === 'radio' ? t.closest('fieldset[aria-invalid="true"]') : null;
    if (gr) controlla(t.name, true);
    if (t.name === 'sport') errGruppo('kit-sport-err', '');
    if (t.name === 'pacchetto') errGruppo('kit-pac-err', '');
    aggiornaTot();
  }

  /* ---------------- controlli (errori vicino al campo) ---------------- */
  function errGruppo(id, msg) { var e = d.getElementById(id); if (e) { e.textContent = msg; e.hidden = !msg; } return !msg; }
  var REGOLE = {
    squadra: function (v) { return String(v || '').trim().length >= 2 ? '' : 'Scrivi il nome della squadra o dell\'associazione.'; },
    adulti: function () {
      var a = intero(stato.adulti), b = intero(stato.bambini);
      if (a < 0 || a > K.maxAtleti) return 'Scrivi un numero da 0 a ' + K.maxAtleti + '.';
      return a + b >= 1 ? '' : 'Indica almeno un atleta, adulto o bambino.';
    },
    bambini: function () { var b = intero(stato.bambini); return b < 0 || b > K.maxAtleti ? 'Scrivi un numero da 0 a ' + K.maxAtleti + '.' : ''; },
    nomi: function (v) { return v ? '' : 'Scegli sì o no.'; },
    stemma: function (v) { return v ? '' : 'Scegli sì o no.'; },
    maglia: function (v) { if (!v) return 'Scegli come vuoi la maglia.'; return v === 'configuratore' && !maglia() ? 'Non c\'è una maglia salvata: creala nel configuratore o scegli "in negozio".' : ''; },
    referente: function (v) { return String(v || '').trim().length >= 2 ? '' : 'Scrivi il nome del referente.'; },
    telefono: function (v) { return String(v || '').replace(/\D/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.'; },
    email: function (v) { v = String(v || '').trim(); return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Controlla l\'email (oppure lasciala vuota).'; }
  };
  var ID = { squadra: 'k-squadra', adulti: 'k-adulti', bambini: 'k-bambini', nomi: 'k-nomi', stemma: 'k-stemma', maglia: 'k-maglia', referente: 'k-ref', telefono: 'k-tel', email: 'k-email' };
  function controlla(n) {
    var el = d.getElementById(ID[n]); if (!el) return true;
    return S.erroreCampo(el, REGOLE[n](stato[n]));
  }
  var CAMPI_PASSO = { 3: ['squadra', 'adulti', 'bambini', 'nomi', 'stemma', 'maglia'], 4: ['referente', 'telefono', 'email'] };
  function valido(p, muto) {
    if (p === 1) return muto ? !!sportDi(stato.sport) : errGruppo('kit-sport-err', sportDi(stato.sport) ? '' : 'Scegli uno sport per continuare.');
    if (p === 2) return muto ? !!pacDi() : errGruppo('kit-pac-err', pacDi() ? '' : 'Scegli un pacchetto per continuare.');
    var lista = CAMPI_PASSO[p] || [];
    if (muto) return lista.every(function (n) { return !REGOLE[n](stato[n]); });
    return lista.map(controlla).every(Boolean);
  }
  function primoErrore(p) {
    var el = p === 1 ? $('[name="sport"]', form) : p === 2 ? $('input[name="pacchetto"]:not(:disabled)', form) : $('[data-passo="' + p + '"] [aria-invalid="true"]', form);
    if (!el) return;
    if (el.tagName === 'FIELDSET') el = $('input', el) || el;
    el.focus({ preventScroll: true });
    vediSe(el);
  }
  // scorre solo se l'elemento è fuori dallo schermo (dopo un clic su Avanti, mai al tocco di un campo)
  function vediSe(el) {
    var r = el.getBoundingClientRect(), top = (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--hdr-c')) || 54) + 16;
    if (r.top < top || r.bottom > innerHeight - 80) scrollTo({ top: scrollY + r.top - top - 24, behavior: S.ridotto.matches ? 'auto' : 'smooth' });
  }

  /* ---------------- maglia dal configuratore ---------------- */
  var antChiave = '';
  function anteprimaMaglia() {
    var mg = maglia(), radio = $('[data-maglia-cfg]', form), box = $('[data-maglia-ant]', form), txt = $('[data-maglia-txt]', form), link = $('[data-maglia-link]', form);
    if (!mg) {
      radio.disabled = true; if (stato.maglia === 'configuratore') { stato.maglia = ''; radio.checked = false; salva(); }
      box.innerHTML = ''; txt.textContent = 'Non hai ancora creato una maglia.'; link.textContent = 'Crea la maglia nel configuratore';
      return Promise.resolve(null);
    }
    radio.disabled = false; link.textContent = 'Modifica la maglia';
    var r = S.maglia.righe(mg);
    txt.textContent = r[0] + ' · ' + r[3] + ' · ' + r[4];
    var k = JSON.stringify(mg);
    if (k === antChiave && box.children.length) return Promise.resolve(mg);
    antChiave = k;
    return S.maglia.anteprime(mg, 240).then(function (u) {
      box.innerHTML = '';
      u.forEach(function (src, i) { if (!src) return; var im = new Image(); im.src = src; im.alt = i ? 'Retro della maglia' : 'Fronte della maglia'; im.width = 96; im.height = 105; box.appendChild(im); });
      return mg;
    });
  }

  /* ---------------- navigazione ---------------- */
  var passo = 1;
  function render(focus) {
    var fatto = !!stato.inviato;
    $$('[data-passo]', form).forEach(function (f) { f.hidden = fatto || +f.getAttribute('data-passo') !== passo; });
    $('[data-kit-fatto]').hidden = !fatto;
    $('[data-kit-nav]').hidden = fatto;
    $$('[data-vai]').forEach(function (b) {
      var n = +b.getAttribute('data-vai');
      b.disabled = fatto || n > (stato.max || 1) || n === passo;
      if (n === passo && !fatto) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      if (n < passo || fatto) b.setAttribute('data-fatto', ''); else b.removeAttribute('data-fatto');
    });
    var bar = $('.kit__barra'), q = fatto ? 4 : passo;
    $('[data-kit-barra]').style.transform = 'scaleX(' + (q / 4) + ')';
    bar.setAttribute('aria-valuenow', q);
    bar.setAttribute('aria-valuetext', fatto ? 'Richiesta inviata' : 'Passo ' + passo + ' di 4: ' + TITOLI[passo - 1]);
    $('[data-indietro]').hidden = passo === 1;
    var av = $('[data-avanti]');
    av.innerHTML = passo < 3 ? 'Avanti ' + S.icona('dx', 'ico ico--s') : passo === 3 ? 'Vedi il riepilogo ' + S.icona('dx', 'ico ico--s')
      : (S.viaWeb3() ? 'Invia la richiesta' : 'Invia su WhatsApp ' + S.icona('chat', 'ico ico--s'));
    if (passo === 3) anteprimaMaglia();
    if (passo === 4) riepilogo();
    if (fatto) mostraFatto();
    aggiornaTot();
    if (focus) {
      var h = fatto ? $('[data-kit-fatto] [data-h]') : $('[data-passo="' + passo + '"] .kit__h', form);
      if (h) { h.focus({ preventScroll: true }); vediSe($('[data-kit-box]')); }
    }
  }
  function aggiornaTot() {
    var t = $('[data-kit-tot]'), r = preventivo();
    var vis = r && r.n > 0 && (passo === 2 || passo === 3);
    t.hidden = !vis;
    if (vis) t.innerHTML = 'Totale indicativo<b>' + euro(r.tot) + '</b>';
  }
  function vai(n, focus) {
    passo = Math.max(1, Math.min(4, n));
    stato.passo = passo; stato.max = Math.max(stato.max || 1, passo);
    salva(); render(focus !== false);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    $('[data-kit-esito]').textContent = '';
    if (!valido(passo)) { primoErrore(passo); return; }
    if (passo < 4) return vai(passo + 1);
    invia();
  });
  $('[data-indietro]').addEventListener('click', function () { vai(passo - 1); });
  $$('[data-vai]').forEach(function (b) { b.addEventListener('click', function () { vai(+b.getAttribute('data-vai')); }); });

  /* ---------------- riepilogo ---------------- */
  function riga(et, val, cls) { return '<div class="kit__riga' + (cls ? ' kit__riga--' + cls : '') + '"><span>' + et + '</span><b>' + val + '</b></div>'; }
  function riepilogo() {
    if (!stato.codice) { stato.codice = S.codice(K.prefissoCodice); salva(); }
    var r = preventivo(), s = sportDi(stato.sport), box = $('[data-kit-riep]');
    if (!r || !s) return;
    var h = riga('Codice richiesta', escH(stato.codice), 'cod') +
      riga('Squadra', escH(String(stato.squadra || '').trim())) +
      riga('Sport e pacchetto', escH(s.nome + ' · ' + r.p.nome)) +
      riga('Nel pacchetto', escH(r.p.include.join(', '))) +
      (r.ad ? riga(r.ad + (r.ad === 1 ? ' adulto' : ' adulti') + ' × ' + euro(r.p.prezzo), euro(r.kAd)) : '') +
      (r.bi ? riga(r.bi + (r.bi === 1 ? ' bambino' : ' bambini') + ' × ' + euro(r.pBi) + ' (−' + K.scontoBambiniPercento + '%)', euro(r.kBi)) : '') +
      riga('Nomi e numeri' + (r.nomi ? ' · ' + r.n + ' × ' + euro(K.personalizzazioni.nomeNumero) : ''), r.nomi ? euro(r.nomi) : 'No') +
      riga('Stemma' + (r.stemma ? ' · ' + r.n + ' × ' + euro(K.personalizzazioni.stemma) : ''), r.stemma ? euro(r.stemma) : 'No');
    var mg = stato.maglia === 'configuratore' ? maglia() : null;
    h += mg ? '<div class="kit__riep-maglia" data-riep-maglia><p><b>Maglia dal configuratore</b><br>' + S.maglia.righe(mg).map(escH).join('<br>') + '</p></div>'
      : riga('Maglia', 'La scegliamo in negozio');
    if (r.sc) h += riga('Sconto quantità (da ' + r.sc.da + ' atleti, −' + r.sc.percento + '%)', '−' + euro(r.sconto), 'sconto');
    else if (K.scontiQuantita[0]) h += riga('Sconto quantità', 'da ' + K.scontiQuantita[0].da + ' atleti');
    h += riga('Circa ' + euro(r.tot / Math.max(1, r.n)) + ' ad atleta', '');
    h += riga('Totale indicativo', euro(r.tot), 'tot');
    box.innerHTML = h;
    if (mg) S.maglia.anteprime(mg, 160).then(function (u) {
      var el = $('[data-riep-maglia]', box); if (!el || !u[0]) return;
      var im = new Image(); im.src = u[0]; im.alt = 'Fronte della maglia'; im.width = 64; im.height = 70; el.insertBefore(im, el.firstChild);
    });
  }
  function testo() {
    var r = preventivo(), s = sportDi(stato.sport), mg = stato.maglia === 'configuratore' ? maglia() : null;
    var t = 'Ciao ' + C.attivita.nome + ', vorrei un preventivo per il kit della squadra.\n' +
      'Codice: ' + stato.codice + '\n' +
      'Squadra: ' + String(stato.squadra || '').trim() + '\n' +
      'Sport: ' + s.nome + ' · pacchetto ' + r.p.nome + ' (' + r.p.include.join(', ') + ')\n' +
      'Atleti: ' + r.ad + ' adulti e ' + r.bi + ' bambini (' + r.n + ' in tutto)\n' +
      'Nomi e numeri sulle maglie: ' + (stato.nomi === 'si' ? 'sì' : 'no') + '\n' +
      'Stemma: ' + (stato.stemma === 'si' ? 'sì' : 'no') + '\n' +
      'Maglia: ' + (mg ? 'creata nel configuratore del sito\n  ' + S.maglia.righe(mg).join('\n  ') : 'la scegliamo insieme in negozio') + '\n' +
      'Preventivo indicativo: ' + euro(r.tot) + (r.sc ? ' (sconto quantità ' + r.sc.percento + '% compreso)' : '') + ' – prezzi di esempio\n' +
      'Le taglie le definiamo in negozio.\n\n' +
      'Referente: ' + String(stato.referente || '').trim() + '\n' +
      'Telefono: ' + String(stato.telefono || '').trim() +
      (String(stato.email || '').trim() ? '\nEmail: ' + String(stato.email).trim() : '') +
      (String(stato.note || '').trim() ? '\nNote: ' + String(stato.note).trim() : '');
    return t;
  }
  function invia() {
    var esito = $('[data-kit-esito]'), bt = $('[data-avanti]'), cod = stato.codice || (stato.codice = S.codice(K.prefissoCodice)), t = testo();
    if (S.viaWeb3()) { esito.textContent = 'Invio in corso…'; bt.setAttribute('aria-disabled', 'true'); }
    S.invia({
      oggetto: 'Kit squadra ' + cod + ' – ' + String(stato.squadra || '').trim(), testo: t,
      dati: { codice: cod, squadra: stato.squadra, referente: stato.referente, telefono: stato.telefono, email: stato.email || '', totale_indicativo: euro(preventivo().tot) },
      ok: function (url) { bt.removeAttribute('aria-disabled'); esito.textContent = ''; stato.inviato = { codice: cod, wa: url || '' }; salva(); render(true); },
      ko: function (html) { bt.removeAttribute('aria-disabled'); esito.innerHTML = html; }
    });
  }
  function mostraFatto() {
    var f = $('[data-kit-fatto]'), x = stato.inviato;
    f.innerHTML = '<div class="codice"><p class="codice__et">Codice della richiesta</p><p class="codice__val" data-h tabindex="-1">' + escH(x.codice) + '</p>' +
      '<button class="btn btn--sec btn--sm" type="button" data-copia-kit>Copia</button></div>' +
      '<p>Grazie! Controlliamo la richiesta e vi mandiamo il preventivo definitivo. Tenete il codice: serve quando passate in negozio per le taglie.</p>' +
      (x.wa ? '<p>Se WhatsApp non si è aperto: <a class="link" href="' + x.wa + '" target="_blank" rel="noopener">apri il messaggio</a>.</p>' : '') +
      '<button class="btn btn--sec" type="button" data-kit-nuovo>Prepara un altro kit</button>';
    $('[data-copia-kit]', f).addEventListener('click', function () { S.copia(x.codice, this); });
    $('[data-kit-nuovo]', f).addEventListener('click', function () { stato = {}; salva(); form.reset(); scriviForm(); passo = 1; render(true); });
  }

  /* ---------------- avvio ---------------- */
  scriviForm();
  // riprende dal passo salvato, ma solo se i passi prima sono completi
  var p = 1, fino = Math.min(4, Math.max(1, stato.passo || 1));
  while (p < fino && valido(p, true)) p++;
  passo = p;
  // arrivo da "Usala nel kit squadra"
  var mg = maglia();
  if (mg && mg.usaNelKit) {
    delete mg.usaNelKit; S.maglia.salva(mg);
    stato.maglia = 'configuratore'; salva(); scriviForm();
    var mgR = $('[data-maglia-cfg]', form); if (mgR) mgR.checked = true;
    S.mostraAvviso(passo >= 3 ? 'La maglia è nel kit.' : 'La maglia è nel kit: la ritrovi al passo 3.');
  }
  render(false);
  anteprimaMaglia();
  addEventListener('storage', function (e) { if (e.key === 'slancio-maglia') { antChiave = ''; anteprimaMaglia(); } });
})();
