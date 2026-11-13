/* =====================================================================
   SLANCIO – dati.js · UNICO FILE CHE LEGGE E SCRIVE I DATI CONDIVISI
   (ordini del kit squadra, banner "Ordina entro…", giorni occupati del noleggio,
   accesso al pannello admin)

   MODALITÀ DEMO: i dati stanno nel localStorage di QUESTO browser (chiave "slancio-dati").
   Chi apre il sito da un altro telefono o computer non li vede.

   PER COLLEGARE FIREBASE (Authentication + Firestore) si cambia SOLO questo file:
   ogni funzione restituisce già una Promise, come le chiamate di Firestore.
     banner     → documento  impostazioni/banner
     ordini     → raccolta   ordini/{numero}          (storico delle fasi dentro l'ordine)
     noleggio   → raccolta   noleggio/{idArticolo}    { occupati: ['2026-12-27', ...] }
     accesso    → Firebase Authentication (email e password del negozio)
   Le regole di Firestore dovranno permettere: lettura del banner e del noleggio a tutti,
   lettura di UN ordine solo conoscendo il numero, scrittura solo al negozio autenticato.
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO || {}, K = C.kit || {}, NL = C.noleggio || {};
  var CHIAVE = 'slancio-dati', SESSIONE = 'slancio-admin';
  // password DEMO del pannello: "slancio-demo" (qui c'è solo l'impronta SHA-256). Con Firebase si usa Authentication.
  var IMPRONTA = '1717bcf4a76bcea12678bb09a8989313adf74742461b0af6b796a05f5b6f42e9';

  /* ---------------- archivio (oggi localStorage) ---------------- */
  var memoria = null;   // se il browser non permette di salvare, i dati restano solo finché la pagina è aperta
  function leggiTutto() {
    if (memoria) return JSON.parse(JSON.stringify(memoria));
    try { var x = JSON.parse(localStorage.getItem(CHIAVE)); if (x && typeof x === 'object') return x; } catch (e) {}
    return {};
  }
  function scriviTutto(x) {
    try { localStorage.setItem(CHIAVE, JSON.stringify(x)); memoria = null; avvisa(); return true; }
    catch (e) { memoria = JSON.parse(JSON.stringify(x)); avvisa(); return false; }
  }
  var ascoltatori = [];
  function avvisa() { ascoltatori.forEach(function (f) { try { f(); } catch (e) {} }); }
  addEventListener('storage', function (e) { if (e.key === CHIAVE) avvisa(); });
  function ok(v) { return Promise.resolve(JSON.parse(JSON.stringify(v === undefined ? null : v))); }

  /* ---------------- date (ora italiana) ---------------- */
  function oggi() {
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: (C.orari && C.orari.fusoOrario) || 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
    catch (e) { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  }
  function piuGiorni(iso, n) { var p = iso.split('-'), t = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n)); return t.toISOString().slice(0, 10); }
  var ISO = /^\d{4}-\d{2}-\d{2}$/;

  /* ---------------- banner "Ordina entro…" ---------------- */
  function bannerBase() {
    var b = K.banner || {}, o = oggi();
    return {
      attivo: b.attivo !== false,
      dal: ISO.test(b.dal || '') ? b.dal : piuGiorni(o, -7),
      al: ISO.test(b.al || '') ? b.al : piuGiorni(o, 75),
      scadenza: ISO.test(b.scadenza || '') ? b.scadenza : piuGiorni(o, 60),
      testo: b.testo || 'Ordina entro il {data} per avere il kit in tempo.'
    };
  }
  var banner = {
    leggi: function () { var t = leggiTutto(); return ok(t.banner || bannerBase()); },
    salva: function (b) {
      var t = leggiTutto();
      t.banner = { attivo: !!b.attivo, dal: String(b.dal || ''), al: String(b.al || ''), scadenza: String(b.scadenza || ''), testo: String(b.testo || '').slice(0, 160) };
      return ok(scriviTutto(t));
    },
    // il banner si vede se è attivo, oggi è nel periodo e la data limite non è passata
    visibile: function (b, iso) { iso = iso || oggi(); return !!(b && b.attivo && ISO.test(b.dal) && ISO.test(b.al) && iso >= b.dal && iso <= b.al && (!ISO.test(b.scadenza) || iso <= b.scadenza)); },
    predefinito: bannerBase
  };

  /* ---------------- ordini ---------------- */
  var FASI = [
    { id: 'ricevuto', nome: 'Ricevuto', testo: 'Abbiamo ricevuto l\'ordine e l\'acconto.' },
    { id: 'grafica', nome: 'Grafica approvata', testo: 'La grafica è approvata: si passa alla produzione.' },
    { id: 'produzione', nome: 'In produzione', testo: 'Stiamo stampando e preparando i capi.' },
    { id: 'pronto', nome: 'Pronto per il ritiro', nomeSpedito: 'Spedito', testo: 'Il kit è pronto.' }
  ];
  var idFasi = FASI.map(function (f) { return f.id; });
  function ordineDemo() {
    var d = K.ordineDemo; if (!d) return null;
    var o = oggi(), storico = [];
    idFasi.slice(0, idFasi.indexOf(d.fase) + 1).forEach(function (f) {
      storico.push({ fase: f, data: piuGiorni(o, (d.giorni || {})[f] || 0) + 'T10:00', nota: (d.note || {})[f] || '' });
    });
    return {
      numero: d.numero, demo: true, data: storico[0] ? storico[0].data : o + 'T10:00', fase: d.fase, storico: storico,
      squadra: d.squadra, sport: d.sport, marca: d.marca, consegna: d.consegna, referente: d.referente, telefono: d.telefono,
      capi: d.capi, design: d.design, rosa: (d.rosa || []).map(function (r) { return { nome: r[0], num: r[1], taglia: r[2] }; }),
      totale: null
    };
  }
  function tuttiGliOrdini(t) {
    var lista = Array.isArray(t.ordini) ? t.ordini.slice() : [];
    var demo = ordineDemo();
    if (demo) {
      var mod = (t.demo || {})[demo.numero];               // cambi di fase fatti dal pannello sull'ordine di esempio
      if (mod) { demo.fase = mod.fase; demo.storico = mod.storico; }
      lista.push(demo);
    }
    return lista.sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); });
  }
  var pulisciNum = function (n) { return String(n || '').trim().toUpperCase().replace(/\s+/g, ''); };
  var ordini = {
    FASI: FASI,
    elenco: function () { return ok(tuttiGliOrdini(leggiTutto())); },
    leggi: function (numero) {
      var n = pulisciNum(numero);
      return ok(tuttiGliOrdini(leggiTutto()).filter(function (o) { return pulisciNum(o.numero) === n; })[0] || null);
    },
    salva: function (ordine) {
      var t = leggiTutto(); t.ordini = Array.isArray(t.ordini) ? t.ordini : [];
      ordine.numero = pulisciNum(ordine.numero);
      t.ordini = t.ordini.filter(function (o) { return o.numero !== ordine.numero; });
      t.ordini.push(ordine);
      return ok(scriviTutto(t));
    },
    cambiaFase: function (numero, fase, nota) {
      var t = leggiTutto(), n = pulisciNum(numero);
      if (idFasi.indexOf(fase) < 0) return Promise.reject(new Error('fase'));
      var adesso = new Date(), data = oggi() + 'T' + ('0' + adesso.getHours()).slice(-2) + ':' + ('0' + adesso.getMinutes()).slice(-2);
      function aggiorna(o) {
        var k = idFasi.indexOf(fase);
        // le fasi dopo quella scelta si tolgono, quelle prima restano; la fase scelta prende data e nota nuove
        o.storico = (o.storico || []).filter(function (s) { return idFasi.indexOf(s.fase) < k; });
        o.storico.push({ fase: fase, data: data, nota: String(nota || '').slice(0, 200) });
        o.fase = fase;
        return o;
      }
      var demo = ordineDemo();
      if (demo && demo.numero === n) {
        var m = (t.demo || {})[n]; if (m) { demo.fase = m.fase; demo.storico = m.storico; }
        aggiorna(demo); t.demo = t.demo || {}; t.demo[n] = { fase: demo.fase, storico: demo.storico };
        return ok(scriviTutto(t));
      }
      var o = (t.ordini || []).filter(function (x) { return x.numero === n; })[0];
      if (!o) return Promise.reject(new Error('ordine'));
      aggiorna(o);
      return ok(scriviTutto(t));
    }
  };

  /* ---------------- noleggio: giorni occupati per articolo ---------------- */
  // i giorni di esempio in config.js sono MM-GG: diventano date della stagione in corso o della prossima
  function stagioneDi(md) {
    var o = oggi(), y = +o.slice(0, 4), da = (NL.stagione || {}).da || '12-01', a = (NL.stagione || {}).a || '04-15';
    var inizio = o.slice(5) > a ? y : y - 1;                   // anno in cui comincia la stagione
    if (da > a) return (md >= da ? inizio : inizio + 1) + '-' + md;
    return inizio + '-' + md;
  }
  function noleggioBase() {
    var es = NL.occupatiEsempio || {}, occ = {};
    (NL.attrezzatura || []).forEach(function (a) { occ[a.id] = (es[a.id] || []).map(stagioneDi).sort(); });
    return { occupati: occ };
  }
  var noleggio = {
    leggi: function () { var t = leggiTutto(); return ok(t.noleggio && t.noleggio.occupati ? t.noleggio : noleggioBase()); },
    cambia: function (id, iso, occupato) {
      var t = leggiTutto(); if (!ISO.test(iso)) return Promise.reject(new Error('data'));
      var n = t.noleggio && t.noleggio.occupati ? t.noleggio : noleggioBase(), l = n.occupati[id] || [];
      l = l.filter(function (x) { return x !== iso; }); if (occupato) l.push(iso);
      n.occupati[id] = l.sort(); t.noleggio = n;
      return ok(scriviTutto(t));
    },
    ripristina: function () { var t = leggiTutto(); delete t.noleggio; return ok(scriviTutto(t)); }
  };

  /* ---------------- accesso al pannello (DEMO) ---------------- */
  function sha256(testo) {
    if (!(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.resolve('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(testo)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  var accesso = {
    entra: function (password) {
      return sha256(String(password || '')).then(function (h) {
        var si = h === IMPRONTA || (!h && password === 'slancio-demo');   // senza crypto.subtle (es. vecchi browser) confronto diretto
        if (si) try { sessionStorage.setItem(SESSIONE, '1'); } catch (e) {}
        return si;
      });
    },
    esci: function () { try { sessionStorage.removeItem(SESSIONE); } catch (e) {} return ok(true); },
    dentro: function () { try { return ok(sessionStorage.getItem(SESSIONE) === '1'); } catch (e) { return ok(false); } }
  };

  window.DATI = {
    banner: banner, ordini: ordini, noleggio: noleggio, accesso: accesso,
    ascolta: function (f) { ascoltatori.push(f); },
    oggi: oggi, piuGiorni: piuGiorni,
    salvaOk: function () { return memoria === null; }
  };
})();
