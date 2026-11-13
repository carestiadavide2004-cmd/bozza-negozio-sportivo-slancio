/* =====================================================================
   SLANCIO – prenota.js · Servizi su prenotazione e Noleggio sci
   Dati in config.js (servizi, noleggio, orari). Testi dell'utente usati solo
   come testo. Disponibilità del noleggio SIMULATA: è una demo.
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO, S = window.SLANCIO, d = document, $ = S.$, $$ = S.$$, escH = S.escH;
  var euro = function (n) { var s = Math.abs(n).toFixed(2).split('.'); return (n < 0 ? '−' : '') + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1] + ' €'; };
  var su = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
  var O = S.oggiRoma(), OGGI = O.iso;
  var ISO = /^\d{4}-\d{2}-\d{2}$/;

  // scorre solo se l'elemento è fuori dallo schermo (dopo un invio o un pulsante, mai al tocco di un campo)
  function vediSe(el) {
    var r = el.getBoundingClientRect(), top = (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--hdr-c')) || 54) + 16;
    if (r.top < top || r.bottom > innerHeight - 80) scrollTo({ top: scrollY + r.top - top - 24, behavior: S.ridotto.matches ? 'auto' : 'smooth' });
  }
  function primoErrore(form) {
    var el = $('[aria-invalid="true"]', form); if (!el) return;
    el.focus({ preventScroll: true }); vediSe(el);
  }
  // giorno chiuso: festivi, chiusure, giorno senza orari, oppure oggi quando sta chiudendo
  function chiuso(iso) {
    var f = S.fasceDi(iso);
    return !f.length || (iso === OGGI && O.min >= S.minuti(f[f.length - 1][1]) - 30);
  }
  function scatolaFatto(box, form, cod, testo, url, etNuovo) {
    box.innerHTML = '<div class="codice"><p class="codice__et">Codice della richiesta</p><p class="codice__val" data-h tabindex="-1">' + escH(cod) + '</p>' +
      '<button class="btn btn--sec btn--sm" type="button" data-copia>Copia</button></div>' +
      '<p class="pren__grazie"><b>Grazie!</b> ' + escH(testo) + ' Tieni il codice: serve quando passi in negozio.</p>' +
      (url ? '<p>Se WhatsApp non si è aperto: <a class="link" href="' + url + '" target="_blank" rel="noopener">apri il messaggio</a>.</p>' : '') +
      '<button class="btn btn--sec" type="button" data-nuovo>' + etNuovo + '</button>';
    form.hidden = true; box.hidden = false;
    $('[data-copia]', box).addEventListener('click', function () { S.copia(cod, this); });
    var h = $('[data-h]', box); h.focus({ preventScroll: true }); vediSe(box);
    return $('[data-nuovo]', box);
  }

  /* =====================================================================
     SERVIZI SU PRENOTAZIONE
     ===================================================================== */
  var fs = $('[data-srv]');
  if (fs) (function (form) {
    var SV = C.servizi, N = SV.giorniMassimi || 21;
    var ig = $('#s-giorno', form), boxF = $('[data-fasce]', form), aiuto = $('[data-giorno-aiuto]', form), esito = $('[data-esito]', form);
    ig.min = OGGI; ig.max = S.piuGiorni(OGGI, N);
    var servizio = function () { var r = $('input[name="servizio"]:checked', form); return r ? SV.elenco.find(function (s) { return s.id === r.value; }) : null; };

    function controllaGiorno(v) {
      if (!v) return 'Scegli il giorno.';
      if (!ISO.test(v)) return 'Scrivi la data nel formato giorno/mese/anno.';
      var dd = S.distanza(OGGI, v);
      if (dd < 0) return 'Questa data è già passata: scegli oggi o uno dei prossimi ' + N + ' giorni.';
      if (dd > N) return 'Puoi prenotare al massimo nei prossimi ' + N + ' giorni (fino a ' + S.dataLunga(S.piuGiorni(OGGI, N)) + ').';
      if (!S.fasceDi(v).length) return su(S.dataLunga(v)) + ' il negozio è chiuso: scegli un altro giorno.';
      if (chiuso(v)) return 'Oggi il negozio sta chiudendo: scegli un altro giorno.';
      return '';
    }
    // fasce del giorno (mattina / pomeriggio) dagli orari del negozio
    function fasce(v) {
      var prima = ($('input[name="fascia"]:checked', form) || {}).value;
      if (controllaGiorno(v)) { boxF.innerHTML = '<p class="campo__aiuto">Scegli prima un giorno di apertura.</p>'; return; }
      boxF.innerHTML = S.fasceDi(v).map(function (f) {
        var nome = S.minuti(f[0]) < 13 * 60 ? 'mattina' : 'pomeriggio', finita = v === OGGI && O.min >= S.minuti(f[1]) - 30;
        return '<label class="kit__sc pren__fascia"><input type="radio" name="fascia" value="' + nome + '" data-dalle="' + f[0] + '" data-alle="' + f[1] + '"' +
          (finita ? ' disabled' : '') + (prima === nome && !finita ? ' checked' : '') + '><span><b>' + su(nome) + '</b>' + f[0] + '–' + f[1] + (finita ? ' · finita' : '') + '</span></label>';
      }).join('');
    }
    function chip() {
      var h = '';
      for (var i = 0; i <= 7; i++) {
        var iso = S.piuGiorni(OGGI, i), g = S.giorno(iso), no = chiuso(iso);
        h += '<button type="button" class="giorni__b" data-giorno="' + iso + '"' + (no ? ' disabled' : '') + ' aria-pressed="' + (ig.value === iso) + '" aria-label="' + S.dataLunga(iso) + (no ? ', chiuso' : '') + '">' +
          '<span>' + (i === 0 ? 'oggi' : i === 1 ? 'domani' : S.GG[g.dow]) + '</span><b>' + g.d + '</b><span>' + (no ? 'chiuso' : S.MESI[g.m - 1].slice(0, 3)) + '</span></button>';
      }
      $('[data-giorni]', form).innerHTML = h;
    }
    function giornoCambiato() {
      var v = ig.value, e = controllaGiorno(v);
      if (v) S.erroreCampo(ig, e);
      aiuto.textContent = v && !e ? su(S.dataLunga(v)) + '.' : 'Nei prossimi ' + N + ' giorni, nei giorni di apertura.';
      $$('.giorni__b', form).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-giorno') === v); });
      fasce(v);
      if ($('#s-fascia').getAttribute('aria-invalid') === 'true') S.erroreCampo($('#s-fascia'), REG['s-fascia']());
    }
    var REG = {
      's-servizio': function () { return servizio() ? '' : 'Scegli il servizio.'; },
      's-giorno': function () { return controllaGiorno(ig.value); },
      // se il giorno non va bene basta l'errore sul giorno
      's-fascia': function () { return controllaGiorno(ig.value) || $('input[name="fascia"]:checked', form) ? '' : 'Scegli mattina o pomeriggio.'; },
      's-nome': function () { return $('#s-nome').value.trim().length >= 2 ? '' : 'Scrivi il tuo nome.'; },
      's-tel': function () { return $('#s-tel').value.replace(/\D/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.'; }
    };
    function valida() { var ok = true; Object.keys(REG).forEach(function (id) { if (!S.erroreCampo($('#' + id), REG[id]())) ok = false; }); return ok; }

    chip(); fasce('');
    ig.addEventListener('change', giornoCambiato);
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-giorno]'); if (!b || b.disabled) return;
      ig.value = b.getAttribute('data-giorno'); giornoCambiato();
    });
    form.addEventListener('change', function (e) {
      if (e.target.name === 'servizio') S.erroreCampo($('#s-servizio'), '');
      if (e.target.name === 'fascia') S.erroreCampo($('#s-fascia'), '');
    });
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true' && REG[e.target.id]) S.erroreCampo(e.target, REG[e.target.id]()); });
    // "Prenota" sulle schede: sceglie il servizio e porta al modulo
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-srv-scegli]'); if (!b) return;
      var r = $('input[name="servizio"][value="' + b.getAttribute('data-srv-scegli') + '"]', form);
      if (form.hidden) return;
      if (r) { r.checked = true; S.erroreCampo($('#s-servizio'), ''); }
      $('#s-servizio').focus({ preventScroll: true }); vediSe($('#prenota .pren__testa'));
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); esito.textContent = '';
      if (!valida()) { primoErrore(form); return; }
      var sv = servizio(), f = $('input[name="fascia"]:checked', form), cod = S.codice(SV.prefissoCodice || 'SRV');
      var nome = $('#s-nome').value.trim(), tel = $('#s-tel').value.trim(), note = $('#s-note').value.trim();
      var fascia = su(f.value) + ' (' + f.getAttribute('data-dalle') + '–' + f.getAttribute('data-alle') + ')';
      var testo = 'Ciao ' + C.attivita.nome + ', vorrei prenotare un servizio.\n' +
        'Codice: ' + cod + '\nServizio: ' + sv.nome + '\nGiorno: ' + S.dataLunga(ig.value) + '\nFascia oraria: ' + fascia +
        '\nNome: ' + nome + '\nTelefono: ' + tel + (note ? '\nNote: ' + note : '') +
        '\n\nPrezzo di esempio: ' + euro(sv.prezzo) + ' (' + sv.notaPrezzo + ')\nSo che la prenotazione è confermata quando mi rispondete.';
      S.invia({
        oggetto: 'Prenotazione servizio ' + cod, testo: testo,
        dati: { codice: cod, servizio: sv.nome, giorno: ig.value, fascia: fascia, nome: nome, telefono: tel, note: note },
        ok: function (url) {
          scatolaFatto($('[data-fatto]'), form, cod, SV.testoConferma, url, 'Prenota un altro servizio').addEventListener('click', function () {
            form.reset(); ig.value = ''; giornoCambiato(); $('[data-fatto]').hidden = true; form.hidden = false; $('#s-servizio').focus({ preventScroll: true }); vediSe(form);
          });
        },
        ko: function (html) { esito.innerHTML = html; }
      });
    });
  })(fs);

  /* =====================================================================
     NOLEGGIO SCI E SNOWBOARD
     ===================================================================== */
  var fn = $('[data-nol]');
  if (fn) (function (form) {
    var NL = C.noleggio, ATT = NL.attrezzatura, MAXG = NL.giorniMassimi || 14, MAXP = NL.personeMassime || 8;
    var att = function (id) { return ATT.find(function (a) { return a.id === id; }); };
    var gruppi = ATT.map(function (a) { return a.gruppo; }).filter(function (g, i, A) { return A.indexOf(g) === i; });
    var LIV = ['principiante', 'intermedio', 'esperto'];
    var ida = $('#n-da', form), ia = $('#n-a', form), mostra = $('[data-mostra]', form), cal = $('[data-cal]', form), boxP = $('[data-persone]', form), boxD = $('[data-disp]', form), esito = $('[data-esito]', form);
    var codice = S.codice(NL.prefissoCodice || 'NOL'), mostraToccato = false;
    var persone = [nuova()];
    function nuova() { return { gruppo: '', eta: '', altezza: '', scarpa: '', livello: '', casco: false }; }

    /* ---- stagione, ritiro e restituzione ---- */
    function inStagione(iso) {
      var md = iso.slice(5), a = NL.stagione.da, b = NL.stagione.a;
      return a <= b ? md >= a && md <= b : md >= a || md <= b;
    }
    // ritiro: il pomeriggio di apertura più vicino prima del primo giorno (non prima di oggi)
    function ritiroPer(iso) {
      var dalle = S.minuti(NL.ritiro.dalle), alle = S.minuti(NL.ritiro.alle);
      for (var k = 1; k <= 7; k++) {
        var r = S.piuGiorni(iso, -k);
        if (r < OGGI) return null;
        var ok = S.fasceDi(r).some(function (f) { return S.minuti(f[0]) <= dalle && S.minuti(f[1]) >= alle; });
        if (ok && !(r === OGGI && O.min >= alle - 30)) return r;
      }
      return null;
    }
    // restituzione: entro l'ora fissata del primo giorno di apertura dopo l'ultimo
    function restituzionePer(iso) {
      var entro = S.minuti(NL.restituzione.entro);
      for (var k = 1; k <= 10; k++) {
        var r = S.piuGiorni(iso, k);
        if (S.fasceDi(r).some(function (f) { return S.minuti(f[1]) >= entro; })) return r;
      }
      return S.piuGiorni(iso, 1);
    }
    var PRIMO = (function () { var x = S.piuGiorni(OGGI, 1); for (var i = 0; i < 400 && !(inStagione(x) && ritiroPer(x)); i++) x = S.piuGiorni(x, 1); return x; })();
    var ULTIMO = (function () { var x = PRIMO; for (var i = 0; i < 300 && inStagione(S.piuGiorni(x, 1)); i++) x = S.piuGiorni(x, 1); return x; })();
    ida.min = ia.min = PRIMO; ida.max = ia.max = ULTIMO;

    /* ---- disponibilità DI ESEMPIO: pezzi meno prenotazioni simulate (più alte nel weekend e nelle feste) ---- */
    function hash(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return Math.abs(x); }
    function inPunta(md) { return (NL.punte || []).some(function (p) { return p[0] <= p[1] ? md >= p[0] && md <= p[1] : md >= p[0] || md <= p[1]; }); }
    function liberi(id, iso) {
      var g = S.giorno(iso), md = iso.slice(5), es = (NL.esempio || {})[id] || [0, 0, 0];
      var liv = g.dow === 0 || g.dow === 6 || inPunta(md) || (C.orari.festivi || []).indexOf(md) > -1 ? 2 : g.dow === 5 ? 1 : 0;
      return Math.max(0, att(id).pezzi - es[liv] - hash(id + iso) % 3);
    }
    function stato(n) { return n <= 0 ? 'esaurito' : n <= (NL.pochiPezzi || 2) ? 'pochi' : 'ok'; }
    var ETS = { ok: 'Disponibile', pochi: 'Pochi pezzi', esaurito: 'Esaurito' };

    /* ---- controlli date ---- */
    function controllaDa(v) {
      if (!v) return 'Scegli il primo giorno.';
      if (!ISO.test(v)) return 'Scrivi la data nel formato giorno/mese/anno.';
      if (v < OGGI) return 'Questa data è già passata.';
      if (!inStagione(v)) return 'Il noleggio è aperto ' + stagioneTxt() + ': scegli un giorno della stagione.';
      if (!ritiroPer(v)) return 'Troppo presto: il ritiro è il pomeriggio prima, in un giorno di apertura. Il primo giorno possibile è ' + S.dataLunga(PRIMO) + '.';
      return '';
    }
    function controllaA(v) {
      if (!v) return 'Scegli l\'ultimo giorno.';
      if (!ISO.test(v)) return 'Scrivi la data nel formato giorno/mese/anno.';
      if (v < OGGI) return 'Questa data è già passata.';
      if (!inStagione(v)) return 'Il noleggio è aperto ' + stagioneTxt() + ': scegli un giorno della stagione.';
      if (ida.value && ISO.test(ida.value) && v < ida.value) return 'L\'ultimo giorno deve essere uguale o dopo il primo.';
      if (ida.value && ISO.test(ida.value) && S.distanza(ida.value, v) + 1 > MAXG) return 'Al massimo ' + MAXG + ' giorni di noleggio.';
      return '';
    }
    function stagioneTxt() { var f = function (md) { var p = md.split('-'); return +p[1] + ' ' + S.MESI[+p[0] - 1]; }; return 'dal ' + f(NL.stagione.da) + ' al ' + f(NL.stagione.a); }
    var dateOk = function () { return !controllaDa(ida.value) && !controllaA(ia.value); };
    var nGiorni = function () { return S.distanza(ida.value, ia.value) + 1; };

    /* ---- persone ---- */
    function idDi(p) { var a = ATT.find(function (x) { return x.gruppo === p.gruppo && (!x.eta || x.eta === p.eta); }); return a ? a.id : ''; }
    var senzaEta = function (g) { return ATT.some(function (a) { return a.gruppo === g && !a.eta; }); };
    // pezzi che servono per tipo
    function servono() {
      var n = {};
      persone.forEach(function (p) {
        var id = idDi(p); if (id) n[id] = (n[id] || 0) + 1;
        if (p.casco && id !== NL.cascoAggiuntivo) n[NL.cascoAggiuntivo] = (n[NL.cascoAggiuntivo] || 0) + 1;
      });
      return n;
    }
    function pills(nome, i, valori, scelto, etich) {
      return valori.map(function (v) { return '<label class="kit__sc"><input type="radio" name="' + nome + '-' + i + '" value="' + v + '" data-i="' + i + '" data-k="' + nome + '"' + (scelto === v ? ' checked' : '') + '><span>' + (etich ? etich(v) : su(v)) + '</span></label>'; }).join('');
    }
    function disegnaPersone() {
      boxP.innerHTML = persone.map(function (p, i) {
        var q = 'n-p' + i, cas = att(NL.cascoAggiuntivo);
        return '<fieldset class="nol__p" data-p="' + i + '"><legend>Persona ' + (i + 1) + '</legend>' +
          (persone.length > 1 ? '<button class="nol__togli" type="button" data-togli="' + i + '" aria-label="Togli la persona ' + (i + 1) + '">' + S.icona('chiudi', 'ico ico--s') + 'Togli</button>' : '') +
          '<div class="campo"><label for="' + q + '-kit">Cosa noleggia</label><select id="' + q + '-kit" data-i="' + i + '" data-k="gruppo"><option value="">Scegli…</option>' +
          gruppi.map(function (g) { return '<option' + (p.gruppo === g ? ' selected' : '') + '>' + escH(g) + '</option>'; }).join('') + '</select><p class="campo__err" id="' + q + '-kit-err" hidden></p></div>' +
          '<fieldset class="kit__sn" id="' + q + '-eta" tabindex="-1"' + (senzaEta(p.gruppo) ? ' hidden' : '') + '><legend>Adulto o bambino</legend>' + pills('eta', i, ['adulto', 'bambino'], p.eta) + '<p class="campo__err" id="' + q + '-eta-err" hidden></p></fieldset>' +
          '<div class="kit__due nol__mis">' +
          '<div class="campo"><label for="' + q + '-alt">Altezza (cm)</label><input id="' + q + '-alt" type="text" inputmode="numeric" maxlength="3" autocomplete="off" value="' + escH(p.altezza) + '" data-i="' + i + '" data-k="altezza"><p class="campo__err" id="' + q + '-alt-err" hidden></p></div>' +
          '<div class="campo"><label for="' + q + '-scarpa">Numero di scarpa</label><input id="' + q + '-scarpa" type="text" inputmode="decimal" maxlength="4" autocomplete="off" value="' + escH(p.scarpa) + '" data-i="' + i + '" data-k="scarpa"><p class="campo__err" id="' + q + '-scarpa-err" hidden></p></div></div>' +
          '<fieldset class="kit__sn" id="' + q + '-liv" tabindex="-1"><legend>Livello</legend>' + pills('livello', i, LIV, p.livello) + '<p class="campo__err" id="' + q + '-liv-err" hidden></p></fieldset>' +
          (cas && p.gruppo !== cas.gruppo ? '<label class="nol__casco"><input type="checkbox" data-i="' + i + '" data-k="casco"' + (p.casco ? ' checked' : '') + '><span>Aggiungi il casco <small>+' + euro(cas.prezzoGiorno) + ' al giorno</small></span></label>' : '') +
          '</fieldset>';
      }).join('');
      $('[data-persona-piu]', form).hidden = persone.length >= MAXP;
    }
    function regolePersona(p, i) {
      var q = 'n-p' + i, alt = +p.altezza, sc = parseFloat(String(p.scarpa).replace(',', '.')), r = {};
      r[q + '-kit'] = p.gruppo ? '' : 'Scegli cosa noleggia.';
      r[q + '-eta'] = senzaEta(p.gruppo) || p.eta ? '' : 'Scegli adulto o bambino.';
      r[q + '-alt'] = /^\d{2,3}$/.test(p.altezza) && alt >= 80 && alt <= 220 ? '' : 'Scrivi l\'altezza in centimetri (da 80 a 220).';
      r[q + '-scarpa'] = /^\d{2}([.,]5)?$/.test(String(p.scarpa).trim()) && sc >= 24 && sc <= 50 ? '' : 'Scrivi il numero di scarpa (da 24 a 50, anche 42,5).';
      r[q + '-liv'] = p.livello ? '' : 'Scegli il livello.';
      return r;
    }

    /* ---- calendario ---- */
    var mese = PRIMO.slice(0, 7);
    function disegnaCal() {
      var id = mostra.value, y = +mese.slice(0, 4), m = +mese.slice(5, 7), primo = mese + '-01';
      var nG = new Date(Date.UTC(y, m, 0)).getUTCDate(), off = (S.giorno(primo).dow + 6) % 7, h = '';
      var da = ISO.test(ida.value) ? ida.value : '', a = ISO.test(ia.value) && ia.value >= da ? ia.value : da;
      for (var k = 0; k < off; k++) h += '<span class="cal__vuoto"></span>';
      for (var g = 1; g <= nG; g++) {
        var iso = mese + '-' + S.pad(g), fuori = iso < PRIMO || iso > ULTIMO || !inStagione(iso);
        if (fuori) { h += '<span class="cal__g is-fuori" aria-hidden="true">' + g + '</span>'; continue; }
        var n = liberi(id, iso), st = stato(n), sel = da && iso >= da && iso <= a;
        h += '<button type="button" class="cal__g is-' + st + (sel ? ' is-sel' : '') + (iso === da ? ' is-da' : '') + (iso === a ? ' is-a' : '') + '" data-cal-g="' + iso + '" data-stato="' + st + '" aria-pressed="' + !!sel + '" aria-label="' + S.dataLunga(iso) + ': ' + ETS[st] + (st === 'esaurito' ? '' : ', ' + n + ' pezzi') + '">' + g + '</button>';
      }
      var mp = S.giorno(primo), prec = mese > PRIMO.slice(0, 7), succ = mese < ULTIMO.slice(0, 7);
      cal.innerHTML = '<div class="cal__testa"><button class="cal__nav" type="button" data-mese="-1"' + (prec ? '' : ' disabled') + ' aria-label="Mese prima">' + S.icona('sx', 'ico') + '</button>' +
        '<p class="cal__mese" aria-live="polite">' + su(S.MESI[mp.m - 1]) + ' ' + mp.y + '</p>' +
        '<button class="cal__nav" type="button" data-mese="1"' + (succ ? '' : ' disabled') + ' aria-label="Mese dopo">' + S.icona('dx', 'ico') + '</button></div>' +
        '<div class="cal__sett" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span></div>' +
        '<div class="cal__griglia" role="group" aria-label="Disponibilità di ' + escH(att(id).nome) + ' – tocca il primo e l\'ultimo giorno">' + h + '</div>';
    }
    function spostaMese(n) { var y = +mese.slice(0, 4), m = +mese.slice(5, 7) - 1 + n; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; mese = y + '-' + S.pad(m + 1); disegnaCal(); }

    /* ---- disponibilità del periodo scelto e giorno libero più vicino ---- */
    function libero(da, len, n) {
      if (controllaDa(da)) return false;
      for (var k = 0; k < len; k++) {
        var x = S.piuGiorni(da, k);
        if (!inStagione(x)) return false;
        for (var id in n) if (liberi(id, x) < n[id]) return false;
      }
      return true;
    }
    function piuVicino(da, len, n) {
      for (var k = 1; k <= 60; k++) {
        var dopo = S.piuGiorni(da, k), prima = S.piuGiorni(da, -k);
        if (libero(prima, len, n)) return prima;
        if (libero(dopo, len, n)) return dopo;
      }
      return '';
    }
    var proposta = '';
    function controllaDisp() {
      proposta = '';
      if (!dateOk()) { boxD.innerHTML = ''; return ''; }
      var n = servono(), len = nGiorni(), buchi = [];
      if (!Object.keys(n).length) { boxD.innerHTML = ''; return ''; }
      Object.keys(n).forEach(function (id) {
        for (var k = 0; k < len; k++) {
          var x = S.piuGiorni(ida.value, k), l = liberi(id, x);
          if (l < n[id]) { buchi.push({ id: id, g: x, l: l, n: n[id] }); break; }
        }
      });
      var righe = Object.keys(n).map(function (id) {
        var min = Infinity; for (var k = 0; k < len; k++) min = Math.min(min, liberi(id, S.piuGiorni(ida.value, k)));
        var st = min < n[id] ? 'esaurito' : stato(min - n[id] + 1);
        return '<li class="is-' + st + '"><i></i>' + escH(att(id).nome) + ' × ' + n[id] + ' <span>' + (min < n[id] ? 'Esaurito' : ETS[st]) + '</span></li>';
      }).join('');
      if (!buchi.length) { boxD.innerHTML = '<ul class="nol__disp-l">' + righe + '</ul>'; return ''; }
      var b = buchi[0], msg = att(b.id).nome + ': esaurito ' + S.dataLunga(b.g) + (b.l ? ' (ne restano ' + b.l + ', ne servono ' + b.n + ')' : '') + '. Questo noleggio non si può prenotare.';
      proposta = piuVicino(ida.value, len, n);
      var fineP = proposta ? S.piuGiorni(proposta, len - 1) : '';
      boxD.innerHTML = '<ul class="nol__disp-l">' + righe + '</ul><div class="nol__avviso" data-esaurito><p><b>' + escH(msg) + '</b></p>' +
        (proposta ? '<p>' + (len === 1 ? 'Giorno libero più vicino: <b>' + S.dataLunga(proposta) + '</b>.' : 'Periodo libero più vicino: <b>dal ' + S.dataLunga(proposta) + ' al ' + S.dataLunga(fineP) + '</b>.') + '</p>' +
          '<button class="btn btn--sec btn--sm" type="button" data-proposta>Usa ' + (len === 1 ? 'questo giorno' : 'queste date') + '</button>' : '<p>Nessun giorno libero vicino: chiamaci, cerchiamo insieme una soluzione.</p>') + '</div>';
      return msg;
    }

    /* ---- riepilogo ---- */
    function riepilogo() {
      var r = $('[data-riep]', form), o = $('[data-orari]', form), righe = '', tot = 0;
      if (dateOk()) {
        var len = nGiorni(), rit = ritiroPer(ida.value), rest = restituzionePer(ia.value);
        o.innerHTML = S.icona('ritiro', 'ico ico--s') + '<span><b>Ritiro:</b> ' + S.dataLunga(rit) + ', dalle ' + NL.ritiro.dalle + ' alle ' + NL.ritiro.alle + '.<br><b>Restituzione:</b> entro le ' + NL.restituzione.entro + ' di ' + S.dataLunga(rest) + '.</span>';
        righe += '<div class="kit__riga kit__riga--cod"><span>Codice richiesta</span><b>' + codice + '</b></div>' +
          '<div class="kit__riga"><span>Giorni</span><b>' + (len === 1 ? S.dataLunga(ida.value) : 'dal ' + S.dataLunga(ida.value) + ' al ' + S.dataLunga(ia.value)) + ' · ' + len + (len === 1 ? ' giorno' : ' giorni') + '</b></div>';
        persone.forEach(function (p, i) {
          var id = idDi(p); if (!id) return;
          var a = att(id), c = p.casco && id !== NL.cascoAggiuntivo ? att(NL.cascoAggiuntivo) : null, prezzo = (a.prezzoGiorno + (c ? c.prezzoGiorno : 0)) * len;
          tot += prezzo;
          righe += '<div class="kit__riga"><span>' + (i + 1) + ' · ' + escH(a.nome) + (c ? ' + casco' : '') + ' · ' + len + ' × ' + euro(a.prezzoGiorno + (c ? c.prezzoGiorno : 0)) + '</span><b>' + euro(prezzo) + '</b></div>';
        });
        righe += '<div class="kit__riga kit__riga--tot"><span>Totale di esempio</span><b data-tot>' + euro(tot) + '</b></div>';
      } else {
        o.textContent = 'Ritiro il pomeriggio prima del primo giorno (' + NL.ritiro.dalle + '–' + NL.ritiro.alle + '), restituzione entro le ' + NL.restituzione.entro + ' del primo giorno di apertura dopo l\'ultimo.';
        righe = '<div class="kit__riga"><span>Scegli i giorni per vedere il totale</span><b></b></div>';
      }
      r.innerHTML = righe;
      return tot;
    }
    function aggiorna() { disegnaCal(); controllaDisp(); riepilogo(); }

    /* ---- eventi ---- */
    function dateCambiate(chi) {
      if (chi === ida && ida.value && (!ia.value || ia.value < ida.value)) ia.value = ida.value;
      [[ida, controllaDa], [ia, controllaA]].forEach(function (x) { if (x[0].value || x[0].getAttribute('aria-invalid') === 'true') S.erroreCampo(x[0], x[1](x[0].value)); });
      if (ISO.test(ida.value) && ida.value >= PRIMO && ida.value <= ULTIMO) mese = ida.value.slice(0, 7);
      aggiorna();
    }
    ida.addEventListener('change', function () { dateCambiate(ida); });
    ia.addEventListener('change', function () { dateCambiate(ia); });
    mostra.addEventListener('change', function () { mostraToccato = true; disegnaCal(); });
    form.addEventListener('click', function (e) {
      var g = e.target.closest('[data-cal-g]'), nav = e.target.closest('[data-mese]'), piu = e.target.closest('[data-persona-piu]'), tg = e.target.closest('[data-togli]'), pr = e.target.closest('[data-proposta]');
      if (nav) { spostaMese(+nav.getAttribute('data-mese')); return; }
      if (g) {
        // primo tocco = primo giorno, secondo tocco = ultimo giorno
        var v = g.getAttribute('data-cal-g');
        if (!ida.value || (ia.value && ia.value !== ida.value) || v < ida.value) { ida.value = v; ia.value = v; }
        else ia.value = v;
        dateCambiate();
        var b = $('[data-cal-g="' + v + '"]', cal); if (b) b.focus({ preventScroll: true });
        return;
      }
      if (piu && persone.length < MAXP) { persone.push(nuova()); disegnaPersone(); aggiorna(); $('#n-p' + (persone.length - 1) + '-kit').focus({ preventScroll: true }); vediSe($('[data-p="' + (persone.length - 1) + '"]')); return; }
      if (tg) { persone.splice(+tg.getAttribute('data-togli'), 1); disegnaPersone(); aggiorna(); return; }
      if (pr && proposta) { var len = nGiorni(); ida.value = proposta; ia.value = S.piuGiorni(proposta, len - 1); dateCambiate(); vediSe(cal); }
    });
    function campoPersona(e) {
      var t = e.target, i = t.getAttribute('data-i'), k = t.getAttribute('data-k'); if (i === null || !k) return;
      var p = persone[+i]; if (!p) return;
      p[k] = t.type === 'checkbox' ? t.checked : t.value;
      var q = 'n-p' + i, reg = regolePersona(p, +i), mappa = { gruppo: q + '-kit', eta: q + '-eta', altezza: q + '-alt', scarpa: q + '-scarpa', livello: q + '-liv' };
      if (k === 'gruppo') {
        if (senzaEta(p.gruppo)) p.eta = '';
        var fe = $('#' + q + '-eta'); if (fe) fe.hidden = senzaEta(p.gruppo);
        var cas = att(NL.cascoAggiuntivo);
        if (cas && p.gruppo === cas.gruppo) p.casco = false;
        if (e.type === 'change') { disegnaPersone(); var s = $('#' + q + '-kit'); if (s) s.focus({ preventScroll: true }); }
        if (!mostraToccato && +i === 0 && idDi(p)) mostra.value = idDi(p);
      }
      if (k === 'eta' && !mostraToccato && +i === 0 && idDi(p)) mostra.value = idDi(p);
      var el = $('#' + mappa[k]);
      if (el && (el.getAttribute('aria-invalid') === 'true' || e.type === 'change' && k !== 'altezza' && k !== 'scarpa')) S.erroreCampo(el, reg[mappa[k]]);
      if (e.type === 'change' || k === 'casco') aggiorna();
    }
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('data-k')) { campoPersona(e); return; }
      if (e.target.getAttribute('aria-invalid') === 'true' && REG[e.target.id]) S.erroreCampo(e.target, REG[e.target.id]());
    });
    form.addEventListener('change', function (e) { if (e.target.getAttribute('data-k')) campoPersona(e); });

    var REG = {
      'n-nome': function () { return $('#n-nome').value.trim().length >= 2 ? '' : 'Scrivi il tuo nome.'; },
      'n-tel': function () { return $('#n-tel').value.replace(/\D/g, '').length >= 6 ? '' : 'Scrivi un numero di telefono valido.'; }
    };
    function valida() {
      var ok = true;
      if (!S.erroreCampo(ida, controllaDa(ida.value))) ok = false;
      if (!S.erroreCampo(ia, controllaA(ia.value))) ok = false;
      persone.forEach(function (p, i) { var r = regolePersona(p, i); Object.keys(r).forEach(function (id) { var el = $('#' + id); if (el && !el.hidden && !S.erroreCampo(el, r[id])) ok = false; }); });
      Object.keys(REG).forEach(function (id) { if (!S.erroreCampo($('#' + id), REG[id]())) ok = false; });
      return ok;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault(); esito.textContent = '';
      if (!valida()) { primoErrore(form); return; }
      if (controllaDisp()) { var av = $('[data-esaurito]', form); vediSe(av); esito.textContent = 'Un\'attrezzatura è esaurita in uno dei giorni scelti: cambia le date.'; return; }
      var tot = riepilogo(), len = nGiorni(), nome = $('#n-nome').value.trim(), tel = $('#n-tel').value.trim(), note = $('#n-note').value.trim();
      var elenco = persone.map(function (p, i) {
        var a = att(idDi(p));
        return (i + 1) + ') ' + a.nome + (p.casco && a.id !== NL.cascoAggiuntivo ? ' + casco' : '') + (p.eta ? ' · ' + p.eta : '') + ' · ' + p.altezza + ' cm · scarpa ' + String(p.scarpa).replace('.', ',') + ' · ' + p.livello;
      }).join('\n');
      var testo = 'Ciao ' + C.attivita.nome + ', vorrei prenotare il noleggio sci e snowboard.\n' +
        'Codice: ' + codice + '\nGiorni: ' + (len === 1 ? S.dataLunga(ida.value) : 'dal ' + S.dataLunga(ida.value) + ' al ' + S.dataLunga(ia.value)) + ' (' + len + (len === 1 ? ' giorno' : ' giorni') + ')' +
        '\nRitiro: ' + S.dataLunga(ritiroPer(ida.value)) + ', ' + NL.ritiro.dalle + '–' + NL.ritiro.alle +
        '\nRestituzione: entro le ' + NL.restituzione.entro + ' di ' + S.dataLunga(restituzionePer(ia.value)) +
        '\n\nPersone:\n' + elenco + '\n\nTotale di esempio: ' + euro(tot) +
        '\nNome: ' + nome + '\nTelefono: ' + tel + (note ? '\nNote: ' + note : '') +
        '\nSo che la prenotazione è confermata quando mi rispondete.';
      var cod = codice;
      S.invia({
        oggetto: 'Noleggio sci ' + cod, testo: testo,
        dati: { codice: cod, dal: ida.value, al: ia.value, persone: elenco, totale: euro(tot), nome: nome, telefono: tel, note: note },
        ok: function (url) {
          scatolaFatto($('[data-fatto]'), form, cod, NL.testoConferma, url, 'Prepara un altro noleggio').addEventListener('click', function () {
            form.reset(); persone = [nuova()]; codice = S.codice(NL.prefissoCodice || 'NOL'); mostraToccato = false;
            disegnaPersone(); aggiorna(); $('[data-fatto]').hidden = true; form.hidden = false; vediSe(form);
          });
        },
        ko: function (html) { esito.innerHTML = html; }
      });
    });

    disegnaPersone(); aggiorna();
  })(fn);
})();
