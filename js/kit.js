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
  var K = C.kit, d = document, $ = S.$, $$ = S.$$, escH = S.escH;
  // euro con il punto delle migliaia anche sotto 10.000 (1.459,77 €)
  var euro = function (n) { var s = Math.abs(n).toFixed(2).split('.'); return (n < 0 ? '−' : '') + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1] + ' €'; };
  var CHIAVE = 'slancio-kit';
  var TITOLI = ['Sport', 'Pacchetto', 'Squadra', 'Riepilogo'];
  var CAMPI = ['sport', 'pacchetto', 'squadra', 'adulti', 'bambini', 'nomi', 'stemma', 'grafiche', 'maglia', 'referente', 'telefono', 'email', 'note'];

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
    mostraGrafiche();
  }
  function mostraPacchetti() {
    $$('[data-pacchetti]', form).forEach(function (g) {
      var si = g.getAttribute('data-pacchetti') === stato.sport;
      g.hidden = !si;
      $$('input', g).forEach(function (i) { i.disabled = !si; i.checked = si && i.value === stato.pacchetto; });
    });
    var s = sportDi(stato.sport);
    $('[data-kit-sport-nome]').textContent = s ? '· ' + s.nome : '';
    disegnaCapi();
  }
  form.addEventListener('input', function (e) { leggiCampo(e.target); });
  form.addEventListener('change', function (e) {
    leggiCampo(e.target);
    if (e.target.name === 'sport') mostraPacchetti();
    if (e.target.name === 'pacchetto') disegnaCapi();
    if (e.target.name === 'grafiche') mostraGrafiche();
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
    grafiche: function (v) {
      if (!v) return 'Scegli se caricare i file adesso o sceglierli in negozio.';
      if (v !== 'carico') return '';
      if (!FILE.length) return 'Carica almeno un file, oppure scegli "Scegli in negozio".';
      return FILE.every(function (f) { return f.pos; }) ? '' : 'Scegli dove mettere ogni file.';
    },
    maglia: function (v) { if (!v) return 'Scegli come vuoi la maglia.'; return v === 'configuratore' && !maglia() ? 'Non c\'è una maglia salvata: creala nel configuratore o scegli "in negozio".' : ''; },
    referente: function (v) { return String(v || '').trim().length >= 2 ? '' : 'Scrivi il nome del referente.'; },
    telefono: function (v) { return String(v || '').replace(/\D/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.'; },
    email: function (v) { v = String(v || '').trim(); return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Controlla l\'email (oppure lasciala vuota).'; }
  };
  var ID = { squadra: 'k-squadra', adulti: 'k-adulti', bambini: 'k-bambini', nomi: 'k-nomi', stemma: 'k-stemma', grafiche: 'k-grafiche', maglia: 'k-maglia', referente: 'k-ref', telefono: 'k-tel', email: 'k-email' };
  function controlla(n) {
    var el = d.getElementById(ID[n]); if (!el) return true;
    if (n === 'grafiche' && stato.grafiche === 'carico') FILE.forEach(function (f) { var s = d.getElementById('kf-pos-' + f.id); if (s) S.erroreCampo(s, f.pos ? '' : 'Scegli dove metterlo.'); });
    return S.erroreCampo(el, REGOLE[n](stato[n]));
  }
  var CAMPI_PASSO = { 3: ['squadra', 'adulti', 'bambini', 'nomi', 'stemma', 'grafiche', 'maglia'], 4: ['referente', 'telefono', 'email'] };
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

  /* ---------------- capi e materiali (passo 2) ----------------
     per ogni capo del pacchetto: prima il tipo, poi il materiale. Vuoto = si decide in negozio. */
  var CAPI = K.capi || [];
  if (!stato.capi || typeof stato.capi !== 'object') stato.capi = {};
  var gruppoDi = function (voce) { return CAPI.filter(function (c) { return c.voci.indexOf(voce) > -1; })[0]; };
  var matDi = function (g, id) { return g.materiali.filter(function (m) { return m.id === id; })[0]; };
  // piccole icone delle trame (SVG originali, solo tratto)
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
  function sceltaCapo(voce) {
    var g = gruppoDi(voce), sc = stato.capi[voce] || {}, m = g && sc.mat ? matDi(g, sc.mat) : null;
    return { g: g, tipo: sc.tipo || '', mat: m, txt: !sc.tipo ? 'Da scegliere in negozio' : sc.tipo + ' · ' + (m ? m.nome : 'materiale da scegliere') };
  }
  function disegnaCapi() {
    var p = pacDi(), box = $('[data-capi]', form), l = $('[data-capi-lista]', form);
    if (!box) return;
    box.hidden = !p; if (!p) { l.innerHTML = ''; return; }
    if (l.getAttribute('data-per') === stato.sport + '/' + p.id) return;   // già disegnato per questo pacchetto
    l.setAttribute('data-per', stato.sport + '/' + p.id);
    var altri = [], primo = true;
    var h = p.include.map(function (voce, n) {
      var g = gruppoDi(voce); if (!g) { altri.push(voce); return ''; }
      var sc = stato.capi[voce] || (stato.capi[voce] = {});
      if (g.tipi.length === 1) sc.tipo = g.tipi[0];
      if (sc.tipo && g.tipi.indexOf(sc.tipo) < 0) sc.tipo = '';
      if (sc.tipo && g.materiali.length === 1) sc.mat = g.materiali[0].id;
      if (sc.mat && !matDi(g, sc.mat)) sc.mat = '';
      var q = 'capo' + n, apri = primo; primo = false;
      return '<details class="capo" data-voce="' + escH(voce) + '"' + (apri ? ' open' : '') + '>' +
        '<summary><span class="capo__nome">' + escH(voce) + '</span><span class="capo__scelta" data-capo-scelta>' + escH(sceltaCapo(voce).txt) + '</span>' + S.icona('giu', 'ico ico--s capo__giu') + '</summary>' +
        '<div class="capo__corpo"><p class="capo__gruppo">' + escH(g.nome) + '</p>' +
        '<fieldset class="capo__tipi"><legend>1 · Tipo</legend>' + g.tipi.map(function (t) {
          return '<label class="kit__sc"><input type="radio" name="' + q + '-tipo" value="' + escH(t) + '"' + (sc.tipo === t ? ' checked' : '') + '><span>' + escH(t) + '</span></label>';
        }).join('') + '</fieldset>' +
        '<fieldset class="capo__mat"' + (sc.tipo ? '' : ' disabled') + '><legend>2 · Materiale</legend><p class="campo__aiuto capo__prima"' + (sc.tipo ? ' hidden' : '') + '>Scegli prima il tipo.</p>' +
        g.materiali.map(function (m) {
          return '<label class="mat"><input type="radio" name="' + q + '-mat" value="' + m.id + '"' + (sc.mat === m.id ? ' checked' : '') + '><span class="mat__box">' + trama(m.trama) +
            '<span class="mat__testi"><span class="mat__nome">' + escH(m.nome) + '</span><span class="mat__txt">' + escH(m.testo) + '</span>' + (m.preventivo ? '<span class="mat__prev">Prezzo su preventivo</span>' : '') + '</span></span></label>';
        }).join('') + '</fieldset></div></details>';
    }).join('');
    if (altri.length) h += '<p class="capi__altri">' + S.icona('taglia', 'ico ico--s') + escH(altri.join(', ')) + ': modello e taglia li scegliamo insieme in negozio.</p>';
    l.innerHTML = h; salva();
  }
  form.addEventListener('change', function (e) {
    var t = e.target, det = t.closest && t.closest('.capo'); if (!det || t.type !== 'radio') return;
    var voce = det.getAttribute('data-voce'), g = gruppoDi(voce), sc = stato.capi[voce] || (stato.capi[voce] = {});
    if (/-tipo$/.test(t.name)) {
      sc.tipo = t.value;
      var fs = $('.capo__mat', det); fs.disabled = false; $('.capo__prima', det).hidden = true;
      if (g.materiali.length === 1 && !sc.mat) { sc.mat = g.materiali[0].id; $('.capo__mat input', det).checked = true; }
    } else sc.mat = t.value;
    if (stato.inviato) delete stato.inviato;
    salva();
    $('[data-capo-scelta]', det).textContent = sceltaCapo(voce).txt;
  });
  function capiScelti() {
    var p = pacDi(); if (!p) return [];
    return p.include.filter(gruppoDi).map(function (v) { var c = sceltaCapo(v); c.voce = v; return c; });
  }

  /* ---------------- stemma, sponsor e grafiche (passo 3) ----------------
     DEMO: i file restano nel browser (in memoria), non vengono caricati su nessun server. */
  var G = K.grafiche || { formati: ['png', 'jpg', 'jpeg', 'svg', 'pdf'], maxMB: 10, maxFile: 12, posizioni: ['Petto sinistro', 'Centro petto', 'Schiena', 'Manica', 'Pantaloncino'] };
  var FILE = [], nId = 0;
  var boxCarica = $('[data-carica]', form), inFile = $('#k-file'), zona = $('[data-zona]', form), listaF = $('[data-file-lista]', form), avvisoF = $('[data-file-avviso]', form);
  var est = function (n) { var m = /\.([a-z0-9]+)$/i.exec(n); return m ? m[1].toLowerCase() : ''; };
  var peso = function (b) { return b < 1048576 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(1).replace('.', ',') + ' MB'; };
  function mostraGrafiche() {
    if (!boxCarica) return;
    boxCarica.hidden = stato.grafiche !== 'carico';
    $('[data-graf-neg]', form).hidden = stato.grafiche !== 'negozio';
  }
  function aggiungi(files) {
    var scarti = [];
    Array.prototype.forEach.call(files || [], function (f) {
      var e = est(f.name);
      if (G.formati.indexOf(e) < 0) return scarti.push(f.name + ' (formato non accettato)');
      if (f.size > G.maxMB * 1048576) return scarti.push(f.name + ' (più di ' + G.maxMB + ' MB)');
      if (FILE.length >= G.maxFile) return scarti.push(f.name + ' (massimo ' + G.maxFile + ' file)');
      if (FILE.some(function (x) { return x.nome === f.name && x.size === f.size; })) return scarti.push(f.name + ' (già caricato)');
      FILE.push({ id: ++nId, file: f, nome: f.name, size: f.size, pdf: e === 'pdf', url: e === 'pdf' ? '' : URL.createObjectURL(f), pos: '' });
    });
    avvisoF.textContent = scarti.length ? 'Non aggiunti: ' + scarti.join(', ') + '.' : '';
    if (inFile) inFile.value = '';
    disegnaFile();
    if ($('#k-grafiche').getAttribute('aria-invalid') === 'true') controlla('grafiche');
    if (stato.inviato) { delete stato.inviato; salva(); }
  }
  function disegnaFile() {
    listaF.innerHTML = FILE.map(function (f) {
      var q = 'kf-pos-' + f.id;
      return '<li class="carica__file" data-id="' + f.id + '">' +
        '<span class="carica__ant">' + (f.pdf ? '<span class="carica__pdf">PDF</span>' : '<img src="' + f.url + '" alt="" width="56" height="56">') + '</span>' +
        '<span class="carica__dati"><span class="carica__nome">' + escH(f.nome) + '</span><span class="carica__peso">' + peso(f.size) + '</span></span>' +
        '<span class="campo carica__pos"><label for="' + q + '">Dove lo mettiamo?</label><select id="' + q + '" data-pos="' + f.id + '"><option value="">Scegli…</option>' +
        G.posizioni.map(function (p) { return '<option' + (f.pos === p ? ' selected' : '') + '>' + escH(p) + '</option>'; }).join('') + '</select><span class="campo__err" id="' + q + '-err" hidden></span></span>' +
        '<button class="carica__elimina" type="button" data-elimina="' + f.id + '" aria-label="Elimina ' + escH(f.nome) + '">' + S.icona('chiudi', 'ico ico--s') + '<span>Elimina</span></button></li>';
    }).join('');
  }
  if (boxCarica) {
    inFile.addEventListener('change', function () { aggiungi(inFile.files); });
    ['dragenter', 'dragover'].forEach(function (t) { zona.addEventListener(t, function (e) { e.preventDefault(); zona.classList.add('is-sopra'); }); });
    ['dragleave', 'drop'].forEach(function (t) { zona.addEventListener(t, function () { zona.classList.remove('is-sopra'); }); });
    zona.addEventListener('drop', function (e) { e.preventDefault(); aggiungi(e.dataTransfer && e.dataTransfer.files); });
    // un file lasciato fuori dalla zona non deve aprirsi al posto della pagina
    ['dragover', 'drop'].forEach(function (t) { d.addEventListener(t, function (e) { if (!boxCarica.hidden && e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') > -1 && !zona.contains(e.target)) e.preventDefault(); }); });
    listaF.addEventListener('change', function (e) {
      var s = e.target.closest('[data-pos]'); if (!s) return;
      var f = FILE.filter(function (x) { return x.id === +s.getAttribute('data-pos'); })[0]; if (!f) return;
      f.pos = s.value; S.erroreCampo(s, f.pos ? '' : 'Scegli dove metterlo.');
      if ($('#k-grafiche').getAttribute('aria-invalid') === 'true') S.erroreCampo($('#k-grafiche'), REGOLE.grafiche(stato.grafiche));
    });
    listaF.addEventListener('click', function (e) {
      var b = e.target.closest('[data-elimina]'); if (!b) return;
      var id = +b.getAttribute('data-elimina'), k = FILE.map(function (x) { return x.id; }).indexOf(id); if (k < 0) return;
      if (FILE[k].url) URL.revokeObjectURL(FILE[k].url);
      var nomeF = FILE[k].nome; FILE.splice(k, 1); disegnaFile();
      avvisoF.textContent = nomeF + ' eliminato.';
      var dopo = $$('[data-elimina]', listaF)[Math.min(k, FILE.length - 1)];
      (dopo || inFile).focus({ preventScroll: true });
    });
  }
  function svuotaFile() { FILE.forEach(function (f) { if (f.url) URL.revokeObjectURL(f.url); }); FILE = []; if (listaF) disegnaFile(); }

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
    // capi e materiali
    var capi = capiScelti(), speciali = capi.filter(function (c) { return c.mat && c.mat.preventivo; });
    if (capi.length) h += '<div class="kit__riep-blocco"><p class="kit__riep-et">Capi e materiali</p><ul>' + capi.map(function (c) {
      return '<li><span>' + escH(c.voce) + '</span><b>' + escH(c.txt) + '</b></li>';
    }).join('') + '</ul></div>';
    if (speciali.length) h += riga('Materiali speciali (' + speciali.map(function (c) { return escH(c.mat.nome); }).join(', ') + ')', 'Prezzo su preventivo');
    // grafiche caricate
    if (stato.grafiche === 'carico' && FILE.length) h += '<div class="kit__riep-blocco"><p class="kit__riep-et">Grafiche · ' + FILE.length + (FILE.length === 1 ? ' file' : ' file') + '</p><ul>' + FILE.map(function (f) {
      return '<li><span>' + escH(f.nome) + '</span><b>' + escH(f.pos) + '</b></li>';
    }).join('') + '</ul><p class="kit__riep-nota">' + S.icona('ok', 'ico ico--s') + 'I file verranno inviati con la richiesta.</p></div>';
    else h += riga('Stemma, sponsor e grafiche', 'Li scegliamo in negozio');
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
      (capiScelti().length ? 'Capi e materiali:\n' + capiScelti().map(function (c) { return '- ' + c.voce + ': ' + c.txt + (c.mat && c.mat.preventivo ? ' (prezzo su preventivo)' : ''); }).join('\n') + '\n' : '') +
      (stato.grafiche === 'carico' && FILE.length
        ? 'Grafiche (' + FILE.length + ' file, li alleghiamo alla richiesta):\n' + FILE.map(function (f) { return '- ' + f.nome + ' → ' + f.pos.toLowerCase(); }).join('\n') + '\n'
        : 'Stemma, sponsor e grafiche: li scegliamo in negozio\n') +
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
      (stato.grafiche === 'carico' && FILE.length ? '<p class="kit__allega">' + S.icona('carica', 'ico ico--s') + (x.wa ? 'Allega nella chat WhatsApp i ' : 'Tieni pronti i ') + FILE.length + ' file delle grafiche: ' + FILE.map(function (f) { return escH(f.nome); }).join(', ') + '.</p>' : '') +
      '<button class="btn btn--sec" type="button" data-kit-nuovo>Prepara un altro kit</button>';
    $('[data-copia-kit]', f).addEventListener('click', function () { S.copia(x.codice, this); });
    $('[data-kit-nuovo]', f).addEventListener('click', function () { stato = { capi: {} }; salva(); form.reset(); svuotaFile(); $('[data-capi-lista]', form).removeAttribute('data-per'); scriviForm(); passo = 1; render(true); });
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
