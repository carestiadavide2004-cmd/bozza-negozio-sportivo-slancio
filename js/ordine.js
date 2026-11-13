/* =====================================================================
   SLANCIO – ordine.js · "Stato del tuo ordine" (ordine/index.html)
   Numero d'ordine (campo o ?n=…) → linea del tempo delle fasi da DATI.ordini
   (js/dati.js). Se il negozio cambia fase dal pannello admin in un'altra
   scheda, la pagina si aggiorna da sola.
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO, S = window.SLANCIO, D = window.DATI, M = window.MagliaSVG, LI = window.LISTINO || {};
  var form = document.querySelector('[data-ord-form]');
  if (!form || !S || !D) return;
  var $ = S.$, escH = S.escH, euro = S.euro;
  var campo = $('#o-num', form), box = $('[data-ord-esito]'), ora = '';
  var FASI = D.ordini.FASI;

  var pulito = function (v) { return String(v || '').trim().toUpperCase().replace(/\s+/g, ''); };
  var trova = function (lista, id) { return (lista || []).filter(function (x) { return x.id === id; })[0]; };
  function quando(s) {
    var iso = String(s || '').slice(0, 10), h = String(s || '').slice(11, 16);
    return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? S.dataLunga(iso) + (h ? ', ore ' + h : '') : '';
  }
  function nomeFase(f, o) { return f.id === 'pronto' && o.consegna === 'spedizione' ? f.nomeSpedito || f.nome : f.nome; }

  function disegna(o) {
    var k = Math.max(0, FASI.map(function (f) { return f.id; }).indexOf(o.fase));
    var sport = trova((C.sport || []).map(function (s) { return { id: s.slug, nome: s.nome }; }), o.sport);
    var marca = trova(LI.marche, o.marca);
    var capi = (o.capi || []).map(function (c) { var x = trova(LI.capi, c.id); return c.q + ' × ' + (x ? x.nome : c.id); }).join(' · ');
    var fine = FASI[FASI.length - 1], finito = k === FASI.length - 1;
    var tl = FASI.map(function (f, i) {
      var s = (o.storico || []).filter(function (x) { return x.fase === f.id; }).pop();
      var cl = i < k ? 'is-fatto' : i === k ? 'is-ora' : 'is-dopo';
      var testo = s ? (s.nota || f.testo) : i === k + 1 ? 'Prossimo passo.' : 'In attesa.';
      return '<li class="tl__p ' + cl + '"' + (i === k ? ' aria-current="step"' : '') + '><span class="tl__pallino" aria-hidden="true">' + (i < k || (i === k && finito) ? S.icona('ok', 'ico ico--s') : i + 1) + '</span>' +
        '<div class="tl__testo"><p class="tl__nome">' + escH(nomeFase(f, o)) + (i === k ? ' <span class="tl__ora">Fase attuale</span>' : '') + '</p>' +
        (s ? '<p class="tl__data">' + escH(quando(s.data)) + '</p>' : '') + '<p class="tl__nota">' + escH(testo) + '</p></div></li>';
    }).join('');
    var previsto = !finito && o.pronto && o.pronto[0] ? '<p class="ord__prev">' + S.icona('ritiro', 'ico ico--s') + '<span>' + (o.consegna === 'spedizione' ? 'Spedizione prevista' : 'Pronto') + ' tra ' + escH(S.dataLunga(o.pronto[0])) + ' e ' + escH(S.dataLunga(o.pronto[1])) + '.</span></p>' : '';
    var consegna = o.consegna === 'spedizione' ? 'Spedizione' + (o.indirizzo && o.indirizzo.citta ? ' a ' + o.indirizzo.citta : '') : 'Ritiro in negozio';
    var righe = [['Squadra', o.squadra], ['Sport', sport ? sport.nome : o.sport], ['Marca', marca ? marca.nome : o.marca], ['Capi', capi], ['Rosa', (o.rosa || []).length + ' giocatori'], ['Consegna', consegna], ['Ordinato', quando(o.data)]]
      .filter(function (r) { return r[1]; }).map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + escH(r[1]) + '</dd></div>'; }).join('');
    var soldi = typeof o.totale === 'number' ? '<p class="ord__soldi">Totale ' + euro(o.totale) + ' · acconto ' + euro(o.acconto) + ' · saldo ' + euro(o.saldo) + ' <span class="etichetta-esempio">Prezzi di esempio</span></p>' : '';
    var maglie = M && o.design ? '<div class="ord__maglie" aria-hidden="true"><div>' + M.svg(o.design, 'fronte') + '</div><div>' + M.svg(o.design, 'retro') + '</div></div>' : '';
    var wa = S.waLink('Ciao ' + C.attivita.nome + ', ho una domanda sull\'ordine ' + o.numero + (o.squadra ? ' (' + o.squadra + ')' : '') + '.');
    box.innerHTML = '<article class="ord__card">' +
      '<header class="ord__testa"><p class="occhiello">Ordine ' + escH(o.numero) + (o.demo ? ' · esempio' : '') + '</p><h2 class="ord__tit">' + escH(nomeFase(FASI[k], o)) + '</h2>' + previsto + '</header>' +
      '<div class="ord__corpo"><ol class="tl" aria-label="Fasi dell\'ordine">' + tl + '</ol>' +
      '<div class="ord__lato">' + maglie + '<dl class="ord__dati">' + righe + '</dl>' + soldi + '</div></div>' +
      '<div class="ord__az"><a class="btn btn--pri" href="' + wa + '" target="_blank" rel="noopener">' + S.icona('chat', 'ico ico--s') + 'Scrivici su WhatsApp</a>' +
      '<a class="btn btn--sec" href="tel:' + escH(C.contatti.telefonoLink) + '">Chiama ' + escH(C.contatti.telefono) + '</a></div>' +
      '<p class="ord__nota">Le fasi le aggiorna il negozio. Ultimo passo: ' + escH(nomeFase(fine, o).toLowerCase()) + '.</p></article>';
  }

  function cerca(n, vai) {
    n = pulito(n);
    if (!n) { S.erroreCampo(campo, 'Scrivi il numero d\'ordine (es. KIT-A1B2).'); box.innerHTML = ''; ora = ''; return; }
    D.ordini.leggi(n).then(function (o) {
      if (!o) {
        S.erroreCampo(campo, 'Nessun ordine ' + n + ' in questo browser. Controlla il numero o prova con DEMO-001.');
        box.innerHTML = ''; ora = ''; return;
      }
      S.erroreCampo(campo, ''); ora = o.numero; campo.value = o.numero; disegna(o);
      try { history.replaceState(null, '', location.pathname + '?n=' + encodeURIComponent(o.numero)); } catch (e) {}
      if (vai) {
        var top = box.getBoundingClientRect().top + scrollY - ((parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-c')) || 56) + 12);
        if (top > scrollY + 40) scrollTo({ top: top, behavior: S.ridotto.matches ? 'auto' : 'smooth' });
        box.focus({ preventScroll: true });
      }
    });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); cerca(campo.value, true); });
  $('[data-ord-prova]', form).addEventListener('click', function () { campo.value = 'DEMO-001'; cerca('DEMO-001', true); });
  campo.addEventListener('input', function () { if (campo.getAttribute('aria-invalid') === 'true') S.erroreCampo(campo, ''); });
  // il pannello admin aperto in un'altra scheda cambia la fase: ridisegno
  D.ascolta(function () { if (ora) D.ordini.leggi(ora).then(function (o) { if (o) disegna(o); }); });

  var q = ''; try { q = new URLSearchParams(location.search).get('n') || ''; } catch (e) {}
  if (q) cerca(q, false);
})();
