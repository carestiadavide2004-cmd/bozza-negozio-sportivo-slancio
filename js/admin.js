/* =====================================================================
   SLANCIO – admin.js · Pannello negozio DEMO (admin.html)
   Tutto passa da js/dati.js (window.DATI): oggi i dati stanno in questo
   browser (localStorage), con Firebase si cambia solo dati.js.
   Sezioni: Ordini (elenco, dettaglio, cambio fase con nota),
   Banner "Ordina entro…", Noleggio (giorni occupati per articolo).
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO || {}, D = window.DATI, M = window.MagliaSVG, LI = window.LISTINO || {}, NL = C.noleggio || {};
  var d = document;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  if (!D) return;

  /* ---------------- piccoli aiuti ---------------- */
  var GG = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var ISO = /^\d{4}-\d{2}-\d{2}$/;
  function escH(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function euro(n) { var s = Math.abs(n).toFixed(2).split('.'); return (n < 0 ? '−' : '') + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1] + ' €'; }
  function giorno(iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function dataLunga(iso) { var t = giorno(iso); return GG[t.getUTCDay()] + ' ' + t.getUTCDate() + ' ' + MESI[t.getUTCMonth()] + ' ' + t.getUTCFullYear(); }
  function quando(s) { s = String(s || ''); var iso = s.slice(0, 10), h = s.slice(11, 16); return ISO.test(iso) ? dataLunga(iso) + (h ? ', ore ' + h : '') : ''; }
  function breve(s) { var iso = String(s || '').slice(0, 10); if (!ISO.test(iso)) return ''; var t = giorno(iso); return t.getUTCDate() + ' ' + MESI[t.getUTCMonth()].slice(0, 3) + ' ' + t.getUTCFullYear(); }
  function trova(l, id) { return (l || []).filter(function (x) { return x.id === id; })[0]; }
  function errore(c, msg) {
    var e = d.getElementById(c.id + '-err');
    c.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) c.setAttribute('aria-errormessage', c.id + '-err'); else c.removeAttribute('aria-errormessage');
    if (e) { e.textContent = msg || ''; e.hidden = !msg; }
    return !msg;
  }
  var SX = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg>';
  var DX = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7"/></svg>';

  /* ---------------- accesso ---------------- */
  var login = $('[data-login]'), app = $('[data-app]'), esci = $('[data-esci]'), pw = $('#a-pw');
  function mostraApp(si) {
    login.hidden = !!si; app.hidden = !si; esci.hidden = !si;
    if (si) avvia();
  }
  D.accesso.dentro().then(mostraApp);
  $('[data-login-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!pw.value) { errore(pw, 'Scrivi la password.'); pw.focus(); return; }
    D.accesso.entra(pw.value).then(function (si) {
      if (!si) { errore(pw, 'Password sbagliata. Riprova.'); pw.select(); return; }
      errore(pw, ''); pw.value = ''; mostraApp(true); $('[data-tab-b][aria-selected="true"]').focus();
    });
  });
  pw.addEventListener('input', function () { if (pw.getAttribute('aria-invalid') === 'true') errore(pw, ''); });
  esci.addEventListener('click', function () { D.accesso.esci().then(function () { mostraApp(false); pw.focus(); }); });

  /* ---------------- schede ---------------- */
  var tabs = $$('[data-tab-b]');
  function apriTab(id, focus) {
    tabs.forEach(function (b) {
      var on = b.getAttribute('data-tab-b') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    $$('[data-tab]').forEach(function (s) { s.hidden = s.getAttribute('data-tab') !== id; });
    try { sessionStorage.setItem('slancio-admin-scheda', id); } catch (e) {}
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { apriTab(b.getAttribute('data-tab-b')); });
    b.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
      e.preventDefault(); apriTab(tabs[(i + k + tabs.length) % tabs.length].getAttribute('data-tab-b'), true);
    });
  });

  var avviato = false;
  function avvia() {
    if (avviato) return; avviato = true;
    var t = ''; try { t = sessionStorage.getItem('slancio-admin-scheda') || ''; } catch (e) {}
    if (t && $('[data-tab="' + t + '"]')) apriTab(t);
    ordini(); banner(); noleggio();
  }

  /* =====================================================================
     ORDINI
     ===================================================================== */
  function ordini() {
    var FASI = D.ordini.FASI, idFasi = FASI.map(function (f) { return f.id; });
    var sez = $('[data-tab="ordini"]'), ul = $('[data-o-lista]'), dett = $('[data-o-dett]'), cerca = $('[data-o-cerca]'), filtro = $('[data-o-filtro]');
    var lista = [], scelto = '', esitoDett = null;
    var sportDi = function (slug) { var s = (C.sport || []).filter(function (x) { return x.slug === slug; })[0]; return s ? s.nome : slug; };
    function nomeFase(id, o) { var f = trova(FASI, id) || FASI[0]; return f.id === 'pronto' && o && o.consegna === 'spedizione' ? f.nomeSpedito || f.nome : f.nome; }

    function carica() {
      return D.ordini.elenco().then(function (l) {
        lista = l || [];
        $('[data-n-ordini]').textContent = lista.length;
        disegnaLista();
        var o = scelto && lista.filter(function (x) { return x.numero === scelto; })[0];
        if (o) disegnaDett(o, true);
      });
    }
    function disegnaLista() {
      var q = cerca.value.trim().toLowerCase(), f = filtro.value;
      var l = lista.filter(function (o) { return (!f || o.fase === f) && (!q || [o.numero, o.squadra, o.referente].join(' ').toLowerCase().indexOf(q) > -1); });
      ul.innerHTML = l.length ? l.map(function (o) {
        var on = o.numero === scelto;
        return '<li><button class="adm-o' + (on ? ' is-on' : '') + '" type="button" data-o="' + escH(o.numero) + '" aria-pressed="' + on + '">' +
          '<span class="adm-o__num">' + escH(o.numero) + (o.demo ? ' <small>esempio</small>' : '') + '</span>' +
          '<span class="adm-o__sq">' + escH(o.squadra || '—') + '</span>' +
          '<span class="adm-o__meta">' + escH(breve(o.data)) + (typeof o.totale === 'number' ? ' · ' + euro(o.totale) : '') + '</span>' +
          '<span class="adm-fase adm-fase--' + escH(o.fase) + '">' + escH(nomeFase(o.fase, o)) + '</span></button></li>';
      }).join('') : '<li class="adm-vuoto">' + (lista.length ? 'Nessun ordine con questi filtri.' : 'Ancora nessun ordine.') + '</li>';
    }
    function disegnaDett(o, mantieni) {
      var vecchiaNota = mantieni && $('#o-nota') ? $('#o-nota').value : '';
      var k = Math.max(0, idFasi.indexOf(o.fase)), prossima = idFasi[Math.min(k + 1, idFasi.length - 1)];
      var marca = trova(LI.marche, o.marca);
      var capi = (o.capi || []).map(function (c) { var x = trova(LI.capi, c.id); return '<li><b>' + c.q + ' ×</b> ' + escH(x ? x.nome : c.id) + (c.tipo ? ' · ' + escH(c.tipo) : '') + '</li>'; }).join('');
      var taglie = {}; (o.rosa || []).forEach(function (r) { if (r.taglia) taglie[r.taglia] = (taglie[r.taglia] || 0) + 1; });
      var conti = Object.keys(taglie).map(function (t) { return escH(t) + ' × ' + taglie[t]; }).join(' · ');
      var rosa = (o.rosa || []).map(function (r, i) { return '<tr><td>' + (i + 1) + '</td><td>' + escH(r.nome || '—') + '</td><td>' + escH(r.num || '—') + '</td><td>' + escH(r.taglia || '—') + '</td></tr>'; }).join('');
      var ind = o.indirizzo ? [o.indirizzo.via, [o.indirizzo.cap, o.indirizzo.citta, o.indirizzo.prov ? '(' + o.indirizzo.prov + ')' : ''].join(' ').trim()].filter(Boolean).join(', ') : '';
      var dati = [
        ['Sport', sportDi(o.sport)], ['Marca', marca ? marca.nome : o.marca],
        ['Consegna', o.consegna === 'spedizione' ? 'Spedizione' + (ind ? ': ' + ind : '') : 'Ritiro in negozio'],
        ['Referente', o.referente], ['Telefono', o.telefono ? '<a href="tel:' + escH(String(o.telefono).replace(/[^\d+]/g, '')) + '">' + escH(o.telefono) + '</a>' : '', true],
        ['Email', o.email ? '<a href="mailto:' + escH(o.email) + '">' + escH(o.email) + '</a>' : '', true], ['Note', o.note],
        ['Importi', typeof o.totale === 'number' ? 'Totale ' + euro(o.totale) + ' · acconto ' + euro(o.acconto) + ' · saldo ' + euro(o.saldo) : '']
      ].filter(function (r) { return r[1]; }).map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + (r[2] ? r[1] : escH(r[1])) + '</dd></div>'; }).join('');
      var tl = FASI.map(function (f, i) {
        var s = (o.storico || []).filter(function (x) { return x.fase === f.id; }).pop();
        var cl = i < k ? 'is-fatto' : i === k ? 'is-ora' : 'is-dopo';
        return '<li class="tl__p ' + cl + '"><span class="tl__pallino" aria-hidden="true">' + (i + 1) + '</span><div class="tl__testo"><p class="tl__nome">' + escH(nomeFase(f.id, o)) + (i === k ? ' <span class="tl__ora">Fase attuale</span>' : '') + '</p>' +
          (s ? '<p class="tl__data">' + escH(quando(s.data)) + '</p>' + (s.nota ? '<p class="tl__nota">' + escH(s.nota) + '</p>' : '') : '<p class="tl__nota">Non ancora.</p>') + '</div></li>';
      }).join('');
      var opz = FASI.map(function (f) { return '<option value="' + f.id + '"' + (f.id === prossima ? ' selected' : '') + '>' + escH(nomeFase(f.id, o)) + (f.id === o.fase ? ' (attuale)' : '') + '</option>'; }).join('');
      var maglie = M && o.design ? '<div class="adm-dett__maglie" aria-hidden="true"><div>' + M.svg(o.design, 'fronte') + '</div><div>' + M.svg(o.design, 'retro') + '</div></div>' : '';
      dett.innerHTML =
        '<button class="adm-torna" type="button" data-o-torna>' + SX + 'Tutti gli ordini</button>' +
        '<header class="adm-dett__testa"><p class="occhiello">Ordine ' + escH(o.numero) + (o.demo ? ' · esempio' : '') + ' · ' + escH(quando(o.data)) + '</p>' +
        '<h2 class="adm-h2">' + escH(o.squadra || '—') + '</h2><span class="adm-fase adm-fase--' + escH(o.fase) + '">' + escH(nomeFase(o.fase, o)) + '</span></header>' +
        '<div class="adm-dett__griglia">' + maglie + '<dl class="adm-dl">' + dati + '</dl></div>' +
        '<form class="adm-box adm-cambia" data-o-cambia novalidate><h3 class="adm-h3">Cambia fase</h3>' +
        '<div class="campo"><label for="o-fase">Nuova fase</label><select id="o-fase">' + opz + '</select></div>' +
        '<div class="campo"><label for="o-nota">Nota per il cliente (facoltativa)</label><textarea id="o-nota" rows="2" maxlength="200" placeholder="Es. Grafica inviata per email: aspettiamo l\'ok."></textarea></div>' +
        '<div class="adm-az"><button class="btn btn--pri" type="submit">Aggiorna la fase</button><a class="btn btn--sec" href="ordine/index.html?n=' + encodeURIComponent(o.numero) + '" target="_blank" rel="noopener">Vedi la pagina del cliente</a></div>' +
        '<p class="adm-esito" role="status" data-o-esito>' + (esitoDett && esitoDett.n === o.numero ? escH(esitoDett.t) : '') + '</p></form>' +
        '<h3 class="adm-h3">Fasi</h3><ol class="tl adm-tl">' + tl + '</ol>' +
        (capi ? '<h3 class="adm-h3">Capi</h3><ul class="adm-capi">' + capi + '</ul>' : '') +
        (rosa ? '<details class="adm-rosa"><summary>Rosa e taglie · ' + (o.rosa || []).length + ' giocatori</summary>' + (conti ? '<p>' + conti + '</p>' : '') +
          '<div class="adm-rosa__scorri"><table><thead><tr><th>#</th><th>Nome</th><th>Numero</th><th>Taglia</th></tr></thead><tbody>' + rosa + '</tbody></table></div></details>' : '');
      if (vecchiaNota) $('#o-nota').value = vecchiaNota;
    }
    function scegli(n) {
      scelto = n; esitoDett = null;
      var o = lista.filter(function (x) { return x.numero === n; })[0]; if (!o) return;
      disegnaLista(); disegnaDett(o);
      sez.classList.add('is-dett');
      // sul telefono il dettaglio prende il posto dell'elenco: riparto dall'inizio della sezione
      if (innerWidth < 900) { var top = sez.getBoundingClientRect().top + scrollY - 70; if (scrollY > top) scrollTo(0, top); }
      dett.focus({ preventScroll: true });
    }
    ul.addEventListener('click', function (e) { var b = e.target.closest('[data-o]'); if (b) scegli(b.getAttribute('data-o')); });
    dett.addEventListener('click', function (e) {
      if (!e.target.closest('[data-o-torna]')) return;
      sez.classList.remove('is-dett');
      var b = $('[data-o="' + scelto + '"]', ul); if (b) b.focus({ preventScroll: false });
    });
    dett.addEventListener('submit', function (e) {
      if (!e.target.matches('[data-o-cambia]')) return;
      e.preventDefault();
      var fase = $('#o-fase').value, nota = $('#o-nota').value.trim(), o = lista.filter(function (x) { return x.numero === scelto; })[0];
      D.ordini.cambiaFase(scelto, fase, nota).then(function () {
        esitoDett = { n: scelto, t: 'Fase aggiornata: ' + nomeFase(fase, o) + '. Il cliente la vede subito nella pagina "Stato del tuo ordine".' };
        $('#o-nota').value = '';
        return carica();
      }).catch(function () { var es = $('[data-o-esito]'); if (es) es.textContent = 'Non riesco a salvare la fase. Riprova.'; });
    });
    cerca.addEventListener('input', disegnaLista);
    filtro.addEventListener('change', disegnaLista);
    D.ascolta(carica);
    carica();
  }

  /* =====================================================================
     BANNER "Ordina entro…"
     ===================================================================== */
  function banner() {
    var f = $('[data-b-form]'), att = $('#b-attivo'), dal = $('#b-dal'), al = $('#b-al'), sc = $('#b-scad'), tx = $('#b-testo');
    var ant = $('[data-b-anteprima]'), st = $('[data-b-stato]'), es = $('[data-b-esito]');
    function riempi(b) { att.checked = !!b.attivo; dal.value = b.dal || ''; al.value = b.al || ''; sc.value = b.scadenza || ''; tx.value = b.testo || ''; anteprima(); }
    function leggi() { return { attivo: att.checked, dal: dal.value, al: al.value, scadenza: sc.value, testo: tx.value.trim() }; }
    function regole(b) {
      return [
        [dal, ISO.test(b.dal) ? '' : 'Scegli il primo giorno.'],
        [al, !ISO.test(b.al) ? 'Scegli l\'ultimo giorno.' : ISO.test(b.dal) && b.al < b.dal ? 'Deve essere uguale o dopo il primo giorno.' : ''],
        [sc, !ISO.test(b.scadenza) ? 'Scegli la data limite.' : ISO.test(b.dal) && b.scadenza < b.dal ? 'La data limite deve essere dopo l\'inizio.' : ''],
        [tx, !b.testo ? 'Scrivi il testo del banner.' : b.testo.indexOf('{data}') < 0 ? 'Aggiungi {data}: lì compare la data limite.' : '']
      ];
    }
    function anteprima() {
      var b = leggi(), oggi = D.oggi();
      var t = escH(b.testo || '…').replace('{data}', '<b>' + (ISO.test(b.scadenza) ? escH(dataLunga(b.scadenza)) : '[data limite]') + '</b>');
      ant.innerHTML = '<div class="bnr bnr--qui"><p class="bnr__t">' + t + '</p>' + (ISO.test(b.scadenza) && b.scadenza >= oggi ? '<p class="bnr__cd">Mancano <b>' + Math.round((giorno(b.scadenza) - giorno(oggi)) / 864e5) + '</b> giorni</p>' : '') + '</div>';
      var perche = !b.attivo ? 'è spento' : !ISO.test(b.dal) || !ISO.test(b.al) ? 'mancano le date' : oggi < b.dal ? 'comincia ' + dataLunga(b.dal) : oggi > b.al ? 'il periodo è finito' : ISO.test(b.scadenza) && oggi > b.scadenza ? 'la data limite è passata' : '';
      st.textContent = D.banner.visibile(b) ? 'Con questi dati oggi il banner si vede sul sito.' : 'Con questi dati oggi il banner non si vede: ' + perche + '.';
      st.classList.toggle('is-on', D.banner.visibile(b));
    }
    f.addEventListener('input', function (e) { es.textContent = ''; if (e.target.getAttribute('aria-invalid') === 'true') errore(e.target, ''); anteprima(); });
    f.addEventListener('change', anteprima);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = leggi(), r = regole(b), primo = null;
      r.forEach(function (x) { if (!errore(x[0], x[1]) && !primo) primo = x[0]; });
      if (primo) { primo.focus(); es.textContent = ''; return; }
      D.banner.salva(b).then(function () { es.textContent = 'Banner salvato. ' + st.textContent; });
    });
    $('[data-b-base]').addEventListener('click', function () {
      riempi(D.banner.predefinito()); $$('[aria-invalid="true"]', f).forEach(function (c) { errore(c, ''); });
      es.textContent = 'Ho rimesso l\'esempio: premi "Salva il banner" per confermare.';
    });
    D.banner.leggi().then(riempi);
  }

  /* =====================================================================
     NOLEGGIO: giorni occupati
     ===================================================================== */
  function noleggio() {
    var sel = $('[data-n-art]'), box = $('[data-n-cal]'), conto = $('[data-n-conto]');
    var occ = {}, oggi = D.oggi(), msg = '';
    var stag = (function () {
      var y = +oggi.slice(0, 4), da = (NL.stagione || {}).da || '12-01', a = (NL.stagione || {}).a || '04-15';
      var ini = oggi.slice(5) > a ? y : y - 1;
      return { da: ini + '-' + da, a: (da > a ? ini + 1 : ini) + '-' + a };
    })();
    var primo = oggi > stag.da ? oggi : stag.da;
    var mese = primo.slice(0, 7);
    var nome = function () { var a = trova(NL.attrezzatura, sel.value); return a ? a.nome : sel.value; };
    function disegna() {
      var id = sel.value, l = occ[id] || [], y = +mese.slice(0, 4), m = +mese.slice(5, 7), uno = mese + '-01';
      var nG = new Date(Date.UTC(y, m, 0)).getUTCDate(), off = (giorno(uno).getUTCDay() + 6) % 7, h = '';
      for (var k = 0; k < off; k++) h += '<span class="cal__vuoto"></span>';
      for (var g = 1; g <= nG; g++) {
        var iso = mese + '-' + ('0' + g).slice(-2);
        if (iso < primo || iso > stag.a) { h += '<span class="cal__g is-fuori" aria-hidden="true">' + g + '</span>'; continue; }
        var o = l.indexOf(iso) > -1;
        h += '<button type="button" class="cal__g ' + (o ? 'is-esaurito' : 'is-ok') + '" data-n-g="' + iso + '" aria-pressed="' + o + '" aria-label="' + dataLunga(iso) + ': ' + (o ? 'occupato' : 'libero') + '">' + g + '</button>';
      }
      var prec = mese > primo.slice(0, 7), succ = mese < stag.a.slice(0, 7);
      box.innerHTML = '<div class="cal"><div class="cal__testa"><button class="cal__nav" type="button" data-n-mese="-1"' + (prec ? '' : ' disabled') + ' aria-label="Mese prima">' + SX + '</button>' +
        '<p class="cal__mese" aria-live="polite">' + MESI[m - 1].charAt(0).toUpperCase() + MESI[m - 1].slice(1) + ' ' + y + '</p>' +
        '<button class="cal__nav" type="button" data-n-mese="1"' + (succ ? '' : ' disabled') + ' aria-label="Mese dopo">' + DX + '</button></div>' +
        '<div class="cal__sett" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span></div>' +
        '<div class="cal__griglia" role="group" aria-label="Giorni di ' + escH(nome()) + '">' + h + '</div></div>';
      var n = l.filter(function (x) { return x >= oggi; }).length;
      conto.textContent = (msg ? msg + ' ' : '') + nome() + ': ' + (n === 1 ? '1 giorno occupato' : n + ' giorni occupati') + ' da oggi a fine stagione (' + dataLunga(stag.a) + ').';
    }
    function leggi() { return D.noleggio.leggi().then(function (n) { occ = (n && n.occupati) || {}; disegna(); }); }
    box.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-n-mese]'), g = e.target.closest('[data-n-g]');
      if (nav) {
        var y = +mese.slice(0, 4), m = +mese.slice(5, 7) - 1 + +nav.getAttribute('data-n-mese');
        y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; mese = y + '-' + ('0' + (m + 1)).slice(-2); msg = ''; disegna(); return;
      }
      if (!g) return;
      var iso = g.getAttribute('data-n-g'), ora = g.getAttribute('aria-pressed') !== 'true';
      D.noleggio.cambia(sel.value, iso, ora).then(function () {
        msg = (ora ? 'Segnato occupato: ' : 'Di nuovo libero: ') + dataLunga(iso) + '.';
        return leggi();
      }).then(function () { var b = $('[data-n-g="' + iso + '"]', box); if (b) b.focus(); });
    });
    sel.addEventListener('change', function () { msg = ''; disegna(); });
    $('[data-n-base]').addEventListener('click', function () { D.noleggio.ripristina().then(function () { msg = 'Giorni di esempio rimessi.'; return leggi(); }); });
    D.ascolta(leggi);
    leggi();
  }
})();
