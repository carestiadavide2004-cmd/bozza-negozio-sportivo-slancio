/* =====================================================================
   SLANCIO – maglia.js
   Maglia personalizzata: texture disegnata in un <canvas> 2048×2048,
   applicata al modello 3D (model-viewer, caricato solo vicino alla sezione)
   oppure alla versione 2,5D (fronte e retro disegnati, girano con CSS 3D).
   Tutto ciò che scrive l'utente è usato SOLO come testo (mai HTML).
   Lo stemma caricato resta nel browser: non viene mai inviato.
   ===================================================================== */
(function () {
  'use strict';
  var C = window.SITO, S = window.SLANCIO;
  if (!C || !S || !C.maglia) return;
  var M = C.maglia, d = document, $ = S.$, $$ = S.$$;
  var CHIAVE = 'slancio-maglia';
  var FONT = 'Graduate';

  /* ---------------- dati e stato ---------------- */
  var squadra = function (id) { return M.squadre.filter(function (q) { return q.id === id; })[0]; };
  var nomeColore = function (hex) { var c = M.colori.filter(function (x) { return x.hex.toLowerCase() === String(hex).toLowerCase(); })[0]; return c ? c.nome : hex; };
  var nomeMotivo = function (id) { var m = M.motivi.filter(function (x) { return x.id === id; })[0]; return m ? m.nome : id; };
  var HEX = /^#[0-9a-f]{6}$/i;
  function pulisciNome(v) {
    var t = String(v || '').replace(/’/g, '\'');
    try { t = t.replace(/[^\p{L}' .\-]/gu, ''); } catch (e) { t = t.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' .\-]/g, ''); }
    return t.replace(/\s{2,}/g, ' ').slice(0, M.maxNome);
  }
  var pulisciNumero = function (v) { return String(v || '').replace(/[^0-9+\-.]/g, '').slice(0, M.maxNumero); };
  function statoIniziale() {
    var q = squadra(M.iniziale.squadra) || M.squadre[0];
    return { squadra: q.id, motivo: q.motivo, colori: q.colori.slice(), stemma: { tipo: 'squadra', id: q.id }, nome: M.iniziale.nome, numero: M.iniziale.numero, davanti: false, quantita: M.quantitaIniziale };
  }
  function valida(s) {
    if (!s || typeof s !== 'object') return null;
    var b = statoIniziale();
    var o = {
      squadra: squadra(s.squadra) ? s.squadra : '',
      motivo: M.motivi.some(function (m) { return m.id === s.motivo; }) ? s.motivo : b.motivo,
      colori: Array.isArray(s.colori) && s.colori.length === 3 && s.colori.every(function (c) { return HEX.test(c); }) ? s.colori.slice() : b.colori,
      stemma: null,
      nome: pulisciNome(s.nome), numero: pulisciNumero(s.numero), davanti: !!s.davanti,
      quantita: Math.max(1, Math.min(999, parseInt(s.quantita, 10) || M.quantitaIniziale))
    };
    if (s.usaNelKit === true) o.usaNelKit = true;
    if (s.stemma && s.stemma.tipo === 'squadra' && squadra(s.stemma.id)) o.stemma = { tipo: 'squadra', id: s.stemma.id };
    if (s.stemma && s.stemma.tipo === 'file' && /^data:image\/(png|jpeg|webp|svg\+xml)[;,]/.test(s.stemma.dato || '')) o.stemma = { tipo: 'file', dato: s.stemma.dato, nomeFile: String(s.stemma.nomeFile || 'stemma').slice(0, 60) };
    return o;
  }
  function leggi() { try { return valida(JSON.parse(localStorage.getItem(CHIAVE))); } catch (e) { return null; } }
  function salva(s) { try { localStorage.setItem(CHIAVE, JSON.stringify(s)); return true; } catch (e) { return false; } }

  /* ---------------- colori ---------------- */
  function rgb(hex) { var n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function lum(hex) { var c = rgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrasto(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function scurisci(hex, k) { var c = rgb(hex); return 'rgb(' + c.map(function (v) { return Math.round(v * k); }).join(',') + ')'; }
  // scritte: colore dei dettagli se si legge sul principale, altrimenti bianco o nero
  function coloriScritte(s) {
    var c1 = s.colori[0], c3 = s.colori[2];
    var t = contrasto(c3, c1) >= 2.4 ? c3 : (lum(c1) > 0.35 ? '#15161B' : '#F6F5F1');
    // contorno nel colore principale: stacca le cifre da strisce, bande e quarti
    return { testo: t, bordo: s.motivo === 'tinta' || s.motivo === 'sfumato' ? '' : c1 };
  }

  /* ---------------- immagini dello stemma (in memoria) ---------------- */
  var immagini = {};
  function svgStemma(q, px) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="' + (px || 200) + '" height="' + Math.round((px || 200) * 1.2) + '">' + q.stemma + '</svg>');
  }
  function immagineStemma(st, pronto) {
    if (!st) return null;
    var k = st.tipo === 'file' ? st.dato : 'sq:' + st.id;
    var x = immagini[k];
    if (x) return x.ok ? x.im : null;
    var im = new Image();
    x = immagini[k] = { im: im, ok: false };
    im.onload = function () { x.ok = true; if (pronto) pronto(); };
    im.onerror = function () { delete immagini[k]; };
    im.src = st.tipo === 'file' ? st.dato : svgStemma(squadra(st.id), 400);
    return null;
  }

  /* =====================================================================
     TEXTURE 2048×2048 (stessa mappa UV di _strumenti/maglia3d.mjs)
     busto: fronte x 0–1024, retro x 1024–2048, y 0–1516 · maniche y 1536–2000 · colletto y 2010–2040
     ===================================================================== */
  var W = 2048, BH = 1516, MY = 1536, MH = 464;
  var SX = 0.77;   // la UV del busto è più "larga" del vero: le forme si disegnano strette per sembrare giuste
  var trama = null;
  function pattern(g) {
    if (trama) return g.createPattern(trama, 'repeat');
    trama = d.createElement('canvas'); trama.width = trama.height = 96;
    var t = trama.getContext('2d'), im = t.createImageData(96, 96), seme = 7;
    var rnd = function () { seme = (seme * 16807) % 2147483647; return seme / 2147483647; };
    for (var i = 0; i < im.data.length; i += 4) {
      var p = i / 4, x = p % 96, y = (p / 96) | 0;
      // filo del tessuto: leggera griglia + rumore
      var v = 128 + (rnd() - 0.5) * 70 + ((x % 6 < 1) ? 18 : 0) + ((y % 6 < 1) ? 14 : 0);
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
    }
    t.putImageData(im, 0, 0);
    return g.createPattern(trama, 'repeat');
  }
  function testoAdattato(g, testo, maxW, size, min) {
    g.font = size + 'px ' + FONT + ', "Arial Black", Impact, sans-serif';
    var w = g.measureText(testo).width;
    if (w > maxW) { size = Math.max(min, Math.floor(size * maxW / w)); g.font = size + 'px ' + FONT + ', "Arial Black", Impact, sans-serif'; w = g.measureText(testo).width; }
    return { size: size, sx: w > maxW ? maxW / w : 1 };   // se non entra neanche al minimo, si stringe
  }
  function scritta(g, testo, cx, base, maxW, size, min, col, spazio) {
    if (!testo) return;
    g.save();
    g.translate(cx, base); g.scale(SX, 1);
    if ('letterSpacing' in g) g.letterSpacing = (spazio || 0) + 'px';
    var f = testoAdattato(g, testo, maxW, size, min);
    g.scale(f.sx, 1);
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    if (col.bordo) { g.lineJoin = 'round'; g.lineWidth = Math.max(6, f.size * 0.07); g.strokeStyle = col.bordo; g.strokeText(testo, 0, 0); }
    g.fillStyle = col.testo; g.fillText(testo, 0, 0);
    g.restore();
  }
  function motivo(g, s, lato) {
    var x0 = lato * 1024, cx = x0 + 512, c1 = s.colori[0], c2 = s.colori[1], c3 = s.colori[2], k, y;
    g.fillStyle = c2;
    switch (s.motivo) {
      case 'strisce':
        for (k = -3; k <= 3; k++) g.fillRect(cx + k * 196 - 50, 0, 100, BH);
        break;
      case 'bande':
        for (y = 250; y < BH; y += 290) g.fillRect(x0, y, 1024, 145);
        break;
      case 'diagonale':
        g.save(); g.translate(cx, 0); g.scale(SX * (lato ? -1 : 1), 1);
        g.translate(10, 690); g.rotate(Math.atan2(1130, 880));
        g.fillRect(-1600, -125, 3200, 250);
        g.fillStyle = c3; g.fillRect(-1600, -125, 3200, 16); g.fillRect(-1600, 109, 3200, 16);
        g.restore();
        break;
      case 'quarti':
        if (!lato) { g.fillRect(cx, 0, 512, 720); g.fillRect(x0, 720, 512, BH - 720); }
        else { g.fillRect(x0, 0, 512, 720); g.fillRect(cx, 720, 512, BH - 720); }
        break;
      case 'sfumato':
        // retino a punti che si infittisce verso il basso
        g.save(); g.translate(cx, 0); g.scale(SX, 1);
        for (y = 320, k = 0; y < BH + 30; y += 30, k++) {
          var t = Math.min(1, Math.max(0, (y - 320) / 980)), r = 3 + 19 * Math.pow(t, 1.15);
          for (var x = -700 + (k % 2) * 15; x < 700; x += 30) { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
        }
        g.restore();
        break;
    }
  }
  function dipingi(g, s) {
    var c1 = s.colori[0], c2 = s.colori[1], c3 = s.colori[2];
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.fillStyle = c1; g.fillRect(0, 0, W, W);
    for (var lato = 0; lato < 2; lato++) { g.save(); g.beginPath(); g.rect(lato * 1024, 0, 1024, BH); g.clip(); motivo(g, s, lato); g.restore(); }
    // maniche: nei quarti la manica sinistra di chi indossa prende il secondario
    if (s.motivo === 'quarti') { g.fillStyle = c2; g.fillRect(1024, MY, 1024, MH); }
    if (s.motivo === 'bande') { g.fillStyle = c2; g.fillRect(0, MY + 210, W, 90); }
    // filetto sopra il polsino, polsini e colletto
    g.fillStyle = s.motivo === 'quarti' ? c3 : c2; g.fillRect(0, MY + MH - 96, W, 14);
    g.fillStyle = c3; g.fillRect(0, MY + MH - 66, W, W - (MY + MH - 66));
    // linea di cucitura dell'orlo
    g.fillStyle = 'rgba(0,0,0,.10)'; g.fillRect(0, BH - 40, W, 3); g.fillRect(0, BH - 30, W, 3);

    var col = coloriScritte(s);
    var nome = (s.nome || '').toLocaleUpperCase('it-IT'), num = s.numero || '';
    // retro: nome in alto, numero grande
    scritta(g, nome, 1536, 440, 540, 118, 58, col, 3);
    scritta(g, num, 1536, 990, num.length > 2 ? 560 : 440, 450, 200, col, 0);
    // fronte: stemma sul cuore (sinistra di chi indossa = destra di chi guarda) e numero piccolo
    var im = immagineStemma(s.stemma, s.__ridisegna);
    if (im) {
      var iw = im.naturalWidth || 300, ih = im.naturalHeight || 300, box = 210, k = Math.min(box / iw, box / ih);
      g.save(); g.translate(512 + 205, 470); g.scale(SX, 1);
      g.drawImage(im, -iw * k / 2, -ih * k / 2, iw * k, ih * k);
      g.restore();
    }
    if (s.davanti && num) scritta(g, num, 512 - 205, 545, 230, 170, 80, col, 0);

    // trama del tessuto su tutto
    g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.10;
    g.fillStyle = pattern(g); g.fillRect(0, 0, W, W);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }

  /* =====================================================================
     2,5D: fronte e retro disegnati (pieghe, ombre, interno del collo)
     ===================================================================== */
  function pathCorpo(g, retro) {
    g.beginPath();
    g.moveTo(262, 58);
    g.quadraticCurveTo(320, retro ? 72 : 104, 378, 58);
    g.quadraticCurveTo(440, 68, 490, 92);
    g.quadraticCurveTo(484, 150, 472, 214);
    g.quadraticCurveTo(458, 420, 472, 642);
    g.quadraticCurveTo(320, 656, 168, 642);
    g.quadraticCurveTo(182, 420, 168, 214);
    g.quadraticCurveTo(156, 150, 150, 92);
    g.quadraticCurveTo(200, 68, 262, 58);
    g.closePath();
  }
  function pathManica(g, dx) {   // dx = 1 destra di chi guarda, -1 sinistra
    var X = function (x) { return dx > 0 ? x : 640 - x; };
    g.beginPath();
    g.moveTo(X(488), 90);
    g.quadraticCurveTo(X(556), 118, X(596), 210);
    g.lineTo(X(540), 268);
    g.quadraticCurveTo(X(504), 232, X(470), 216);
    g.quadraticCurveTo(X(484), 150, X(488), 90);
    g.closePath();
  }
  function faccia(out, tela, s, retro) {
    var g = out.getContext('2d'), k = out.width / 640, c1 = s.colori[0], c3 = s.colori[2];
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, out.width, out.height);
    g.setTransform(k, 0, 0, k, 0, 0);
    // maniche: centro della parte visibile nella texture
    [1, -1].forEach(function (dx) {
      var cxTex = retro ? (dx > 0 ? 768 : 1792) : (dx > 0 ? 1280 : 256);
      g.save(); pathManica(g, dx); g.clip();
      g.fillStyle = c1; g.fillRect(0, 0, 640, 320);
      var jx = dx > 0 ? 476 : 164, jy = 150, ex = dx > 0 ? 568 : 72, ey = 240;
      g.translate(jx, jy); g.rotate(Math.atan2(ey - jy, ex - jx) - Math.PI / 2);
      g.drawImage(tela, cxTex - 230, MY, 460, MH, -95, -40, 190, 170);
      g.restore();
    });
    // busto
    g.save(); pathCorpo(g, retro); g.clip();
    g.drawImage(tela, (retro ? 1024 : 0) + 177, 0, 670, BH, 150, 54, 340, 592);
    g.restore();

    // ombre e luci: tutta la sagoma
    g.save();
    g.beginPath(); pathCorpo(g, retro); pathManica(g, 1); pathManica(g, -1); g.clip();
    var lx = retro ? -1 : 1;
    var gl = g.createLinearGradient(lx > 0 ? 120 : 520, 0, lx > 0 ? 520 : 120, 0);
    gl.addColorStop(0, 'rgba(255,255,255,.10)'); gl.addColorStop(0.45, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(0,0,0,.16)');
    g.fillStyle = gl; g.fillRect(0, 0, 640, 700);
    // fianchi più scuri
    [[168, 1], [472, -1]].forEach(function (f) {
      var gr = g.createLinearGradient(f[0], 0, f[0] + f[1] * 46, 0);
      gr.addColorStop(0, 'rgba(0,0,0,.26)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(Math.min(f[0], f[0] + f[1] * 46), 180, 46, 480);
    });
    // in basso un po' più scuro (luce dall'alto)
    var gv = g.createLinearGradient(0, 380, 0, 660); gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(1, 'rgba(0,0,0,.12)');
    g.fillStyle = gv; g.fillRect(0, 380, 640, 300);
    // pieghe morbide (tratti larghi e trasparenti = sfumati anche su Safari)
    var piega = function (pts, c, a) {
      for (var w = 26; w >= 6; w -= 5) {
        g.beginPath(); g.moveTo(pts[0], pts[1]); g.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]);
        g.strokeStyle = c; g.globalAlpha = a; g.lineWidth = w; g.lineCap = 'round'; g.stroke();
      }
      g.globalAlpha = 1;
    };
    piega([196, 214, 236, 300, 226, 380], '#000', 0.018);
    piega([444, 214, 404, 300, 414, 380], '#000', 0.018);
    piega([214, 520, 300, 560, 410, 600], '#000', 0.014);
    piega([250, 470, 320, 500, 390, 470], '#fff', 0.016);
    piega([212, 120, 250, 170, 238, 230], '#fff', 0.02);
    piega([428, 120, 390, 170, 402, 230], '#000', 0.016);
    // ombra sotto le maniche e cuciture spalla
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(488, 90); g.quadraticCurveTo(484, 150, 470, 216); g.moveTo(152, 90); g.quadraticCurveTo(156, 150, 170, 216); g.stroke();
    [[470, 216, 540, 268], [170, 216, 100, 268]].forEach(function (a) {
      var gr = g.createLinearGradient(a[0], a[1], a[0] + (a[2] - a[0]) * 0.3, a[1] - 30);
      gr.addColorStop(0, 'rgba(0,0,0,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[2], a[3]); g.lineTo(a[2] + (a[0] < 320 ? 30 : -30), a[3] - 70); g.closePath(); g.fill();
    });
    // cuciture dell'orlo
    g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = 1; g.setLineDash([4, 3]);
    g.beginPath(); g.moveTo(172, 630); g.quadraticCurveTo(320, 643, 468, 630); g.stroke();
    g.setLineDash([]);
    g.restore();

    // collo: interno visibile (fronte) e costina
    if (!retro) {
      g.beginPath(); g.moveTo(262, 58); g.quadraticCurveTo(320, 40, 378, 58); g.quadraticCurveTo(320, 104, 262, 58); g.closePath();
      var gi = g.createLinearGradient(0, 44, 0, 96); gi.addColorStop(0, scurisci(c1, 0.32)); gi.addColorStop(1, scurisci(c1, 0.55));
      g.fillStyle = gi; g.fill();
      g.beginPath(); g.moveTo(264, 56); g.quadraticCurveTo(320, 38, 376, 56);
      g.strokeStyle = scurisci(c3, 0.7); g.lineWidth = 8; g.stroke();
      g.beginPath(); g.moveTo(262, 58); g.quadraticCurveTo(320, 104, 378, 58);
      g.strokeStyle = c3; g.lineWidth = 11; g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; g.stroke();
    } else {
      g.beginPath(); g.moveTo(262, 58); g.quadraticCurveTo(320, 72, 378, 58);
      g.strokeStyle = c3; g.lineWidth = 11; g.stroke();
    }
    // apertura delle maniche: si intravede l'interno
    [[596, 210, 540, 268], [44, 210, 100, 268]].forEach(function (a) {
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + a[2]) / 2 + (a[0] > 320 ? 8 : -8), (a[1] + a[3]) / 2 + 6, a[2], a[3]);
      g.strokeStyle = scurisci(c3, 0.45); g.lineWidth = 3; g.stroke();
    });
  }

  /* ---------------- anteprime per il kit (fronte e retro come immagini) ---------------- */
  function fontPronto() { try { return d.fonts && d.fonts.load ? d.fonts.load('100px ' + FONT).catch(function () {}) : Promise.resolve(); } catch (e) { return Promise.resolve(); } }
  function stemmaPronto(st) {
    return new Promise(function (ok) {
      if (!st) return ok();
      if (immagineStemma(st, ok)) ok();
      setTimeout(ok, 1500);
    });
  }
  function anteprime(s, larghezza) {
    return Promise.all([fontPronto(), stemmaPronto(s.stemma)]).then(function () {
      var tela = d.createElement('canvas'); tela.width = tela.height = W;
      dipingi(tela.getContext('2d'), s);
      return [false, true].map(function (retro) {
        var o = d.createElement('canvas'); o.width = larghezza || 480; o.height = Math.round(o.width * 700 / 640);
        faccia(o, tela, s, retro);
        try { return o.toDataURL('image/webp', 0.9); } catch (e) { return ''; }
      });
    });
  }
  function righe(s) {
    var st = !s.stemma ? 'nessuno' : s.stemma.tipo === 'file' ? 'stemma vostro (da mandare in chat)' : squadra(s.stemma.id).nome + ' (squadra inventata del sito)';
    return [
      'Motivo: ' + nomeMotivo(s.motivo),
      'Colori: principale ' + nomeColore(s.colori[0]) + ', secondario ' + nomeColore(s.colori[1]) + ', colletto e maniche ' + nomeColore(s.colori[2]),
      'Stemma: ' + st,
      'Nome sul retro: ' + (s.nome || '—'),
      'Numero: ' + (s.numero || '—') + (s.davanti && s.numero ? ' (anche piccolo davanti)' : '')
    ];
  }
  S.maglia = { leggi: leggi, salva: salva, anteprime: anteprime, righe: righe, nomeColore: nomeColore, nomeMotivo: nomeMotivo, squadra: squadra, svgStemma: svgStemma };

  /* =====================================================================
     CONFIGURATORE (solo in home)
     ===================================================================== */
  var form = $('[data-cfg]');
  if (!form) return;
  var scena = $('[data-cfg-scena]'), stato = $('[data-cfg-stato]'), poster = $('.cfg__poster', scena);
  var linkWa = $('[data-cfg-wa]'), descr = $('[data-cfg-desc]');
  var s = leggi() || statoIniziale(), toccata = !!leggi();
  delete s.usaNelKit;
  var tela = d.createElement('canvas'); tela.width = tela.height = W;
  var g = tela.getContext('2d');
  var modo = '', tex = null, mv = null, carta = null, facce = [];
  var ruolo = 0, tRid = null;

  /* ----- form → stato ----- */
  function scriviForm() {
    $$('input[name="squadra"]', form).forEach(function (r) { r.checked = r.value === s.squadra; });
    $$('input[name="motivo"]', form).forEach(function (r) { r.checked = r.value === s.motivo; });
    form.elements.nome.value = s.nome; form.elements.numero.value = s.numero;
    form.elements.davanti.checked = s.davanti; form.elements.quantita.value = s.quantita;
    aggiornaRuoli(); aggiornaStemma();
  }
  function aggiornaRuoli() {
    $$('[data-ruolo-pallino]', form).forEach(function (p, i) { p.style.background = s.colori[i]; });
    var sez = form.closest('.cfg'); if (sez) s.colori.forEach(function (c, i) { sez.style.setProperty('--m' + (i + 1), c); });
    $$('[data-ruolo-nome]', form).forEach(function (p, i) { p.textContent = nomeColore(s.colori[i]); });
    $$('input[name="ruolo"]', form).forEach(function (r) { r.checked = +r.value === ruolo; });
    $$('input[name="colore"]', form).forEach(function (r) { r.checked = r.value.toLowerCase() === s.colori[ruolo].toLowerCase(); });
  }
  function aggiornaStemma() {
    var box = $('[data-stemma-ora]', form), st = s.stemma;
    var im = $('img', box), txt = $('[data-stemma-txt]', box), togli = $('[data-stemma-togli]', form);
    if (!st) { im.hidden = true; im.removeAttribute('src'); txt.textContent = 'Nessuno stemma'; }
    else { im.hidden = false; im.src = st.tipo === 'file' ? st.dato : svgStemma(squadra(st.id), 120); txt.textContent = st.tipo === 'file' ? 'Il tuo stemma · ' + st.nomeFile : squadra(st.id).nome; }
    togli.hidden = !st;
  }
  function errore(id, msg) { var c = d.getElementById(id); if (c) S.erroreCampo(c, msg); }

  form.addEventListener('submit', function (e) { e.preventDefault(); });
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'squadra') {
      var q = squadra(t.value); s.squadra = q.id; s.motivo = q.motivo; s.colori = q.colori.slice(); s.stemma = { tipo: 'squadra', id: q.id };
      scriviForm();
    } else if (t.name === 'motivo') s.motivo = t.value;
    else if (t.name === 'ruolo') { ruolo = +t.value; aggiornaRuoli(); return; }
    else if (t.name === 'colore') { s.colori[ruolo] = t.value; aggiornaRuoli(); }
    else if (t.name === 'davanti') s.davanti = t.checked;
    else if (t.name === 'quantita') { s.quantita = Math.max(1, Math.min(999, parseInt(t.value, 10) || 1)); t.value = s.quantita; }
    else if (t.name === 'stemma-file') { caricaFile(t); return; }
    else return;
    cambiato();
  });
  form.addEventListener('input', function (e) {
    var t = e.target, v, pos;
    if (t.name === 'nome') {
      v = pulisciNome(t.value);
      errore('m-nome', v !== t.value.replace(/’/g, '\'').slice(0, M.maxNome) ? 'Puoi usare lettere (anche accentate), spazi, apostrofo, punto e trattino.' : '');
      if (v !== t.value) { pos = t.selectionStart - (t.value.length - v.length); t.value = v; try { t.setSelectionRange(pos, pos); } catch (er) {} }
      s.nome = v; cambiato();
    } else if (t.name === 'numero') {
      v = pulisciNumero(t.value);
      errore('m-num', v !== t.value.slice(0, M.maxNumero) ? 'Solo cifre e i segni + - .' : '');
      if (v !== t.value) { pos = t.selectionStart - (t.value.length - v.length); t.value = v; try { t.setSelectionRange(pos, pos); } catch (er) {} }
      s.numero = v; cambiato();
    } else if (t.name === 'quantita') { var q = parseInt(t.value, 10); if (q >= 1 && q <= 999) { s.quantita = q; aggiornaLink(); } }
  });
  // stemma caricato: resta nel browser (ridotto a 512 px e salvato solo qui)
  function caricaFile(inp) {
    var f = inp.files && inp.files[0];
    errore('m-file', '');
    if (!f) return;
    var tipoOk = /^image\/(png|jpeg|svg\+xml)$/.test(f.type) || /\.(png|jpe?g|svg)$/i.test(f.name);
    if (!tipoOk) { inp.value = ''; return errore('m-file', 'Formato non valido: usa un file PNG, JPG o SVG.'); }
    if (f.size > M.stemmaMaxMB * 1048576) { inp.value = ''; return errore('m-file', 'Il file pesa ' + (f.size / 1048576).toFixed(1).replace('.', ',') + ' MB: il massimo è ' + M.stemmaMaxMB + ' MB.'); }
    var fr = new FileReader();
    fr.onload = function () {
      var url = String(fr.result), im = new Image();
      if (/\.svg$/i.test(f.name) && !/^data:image\/svg\+xml/.test(url)) url = url.replace(/^data:[^;,]*/, 'data:image/svg+xml');
      im.onload = function () {
        var w = im.naturalWidth || 400, h = im.naturalHeight || 400, k = Math.min(1, 512 / Math.max(w, h));
        var c = d.createElement('canvas'); c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
        var dato = url;
        try { c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); dato = c.toDataURL('image/png'); } catch (e) {}
        s.stemma = { tipo: 'file', dato: dato, nomeFile: f.name.slice(0, 60) };
        s.squadra = '';
        $$('input[name="squadra"]', form).forEach(function (r) { r.checked = false; });
        inp.value = '';
        aggiornaStemma(); cambiato();
      };
      im.onerror = function () { inp.value = ''; errore('m-file', 'Non riesco a leggere questa immagine: prova con un PNG o un JPG.'); };
      im.src = url;
    };
    fr.onerror = function () { errore('m-file', 'Non riesco a leggere il file.'); };
    fr.readAsDataURL(f);
  }
  $('[data-stemma-togli]', form).addEventListener('click', function () { s.stemma = null; aggiornaStemma(); cambiato(); });

  /* ----- aggiornamenti ----- */
  function testoWa() {
    return 'Ciao ' + C.attivita.nome + ', vorrei un preventivo per questa maglia (dal configuratore del sito).\n' +
      righe(s).join('\n') + '\nQuantità indicativa: ' + s.quantita + (s.quantita === 1 ? ' maglia' : ' maglie') +
      (s.stemma && s.stemma.tipo === 'file' ? '\n\nLo stemma ve lo mando qui in chat.' : '');
  }
  function aggiornaLink() { linkWa.href = S.waLink(testoWa()); }
  function aggiornaDescr() {
    var t = 'Maglia ' + nomeMotivo(s.motivo).toLowerCase() + ', ' + nomeColore(s.colori[0]) + ' e ' + nomeColore(s.colori[1]) +
      (s.nome ? ', nome ' + s.nome : '') + (s.numero ? ', numero ' + s.numero : '');
    descr.textContent = t;
  }
  function cambiato() {
    toccata = true; salva(s);
    aggiornaLink(); aggiornaDescr();
    clearTimeout(tRid); tRid = setTimeout(ridisegna, 90);   // piccolo ritardo: niente lavoro a ogni tasto
  }
  s.__ridisegna = function () { clearTimeout(tRid); tRid = setTimeout(ridisegna, 30); };
  function ridisegna() {
    var gg = modo === '3d' && tex ? tex.source.element.getContext('2d') : g;
    dipingi(gg, s);
    if (modo === '3d' && tex) tex.source.update();
    if (modo === '25d') facce.forEach(function (c, i) { faccia(c, tela, s, i === 1); });
    scena.setAttribute('data-pronta', String(Date.now()));
  }

  /* ----- vista: Fronte / Retro ----- */
  var angolo = 0;
  function vista(retro) {
    $$('[data-vista-m]').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-vista-m') === 'retro') === retro)); });
    if (modo === '3d' && mv) { mv.removeAttribute('auto-rotate'); mv.cameraOrbit = (retro ? '180deg' : '0deg') + ' 84deg 112%'; }
    if (modo === '25d' && carta) { angolo = retro ? 180 : 0; carta.classList.add('is-anima'); carta.style.transform = 'rotateY(' + angolo + 'deg)'; }
  }
  $$('[data-vista-m]').forEach(function (b) { b.addEventListener('click', function () { vista(b.getAttribute('data-vista-m') === 'retro'); }); });

  /* ----- 3D ----- */
  function webgl() {
    try { var c = d.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }
  function mostraStato(t) { stato.textContent = t; stato.hidden = !t; }
  function avvia() {
    if (modo) return;
    if (!webgl()) return avvia25('Il tuo browser non mostra il 3D: ecco la maglia disegnata, trascinala per girarla.');
    modo = 'carico'; mostraStato('Carico la maglia 3D…');
    S.caricaMV().then(function () {
      mv = d.createElement('model-viewer');
      var a = {
        src: S.REL + M.modello, alt: 'Maglia personalizzata in 3D', 'camera-controls': '', 'disable-pan': '', 'touch-action': 'pan-y',
        'interaction-prompt': 'none', 'shadow-intensity': '1', 'shadow-softness': '0.85', exposure: '1.05', 'environment-image': 'neutral',
        'camera-orbit': '0deg 84deg 112%', 'camera-target': '0m -0.03m 0m', 'field-of-view': '27deg', 'min-camera-orbit': 'auto 55deg 88%', 'max-camera-orbit': 'auto 105deg 128%',
        'min-field-of-view': '27deg', 'max-field-of-view': '27deg', 'interpolation-decay': '120'
      };
      Object.keys(a).forEach(function (k) { mv.setAttribute(k, a[k]); });
      if (!S.ridotto.matches) { mv.setAttribute('auto-rotate', ''); mv.setAttribute('auto-rotate-delay', '0'); mv.setAttribute('rotation-per-second', '16deg'); }
      var ferma = function () { mv.removeAttribute('auto-rotate'); };
      mv.addEventListener('pointerdown', ferma, { once: true });
      mv.addEventListener('camera-change', function (e) { if (e.detail && e.detail.source === 'user-interaction') ferma(); });
      mv.addEventListener('load', function () {
        try {
          tex = mv.createCanvasTexture();
          var cv = tex.source.element; cv.width = cv.height = W;
          mv.model.materials.forEach(function (m) { m.pbrMetallicRoughness.baseColorTexture.setTexture(tex); });
          modo = '3d'; ridisegna();
          scena.classList.add('is-3d'); mostraStato('');
          if (poster) poster.setAttribute('aria-hidden', 'true');
        } catch (e) { mv.remove(); mv = null; avvia25('La maglia 3D non si è caricata: ecco la versione disegnata.'); }
      });
      mv.addEventListener('error', function () { if (mv) mv.remove(); mv = null; avvia25(location.protocol === 'file:' ? 'Aprendo il file dal computer il browser blocca il 3D: ecco la maglia disegnata.' : 'La maglia 3D non si è caricata: ecco la versione disegnata.'); });
      scena.insertBefore(mv, scena.firstChild);
    }, function () { avvia25('Il visore 3D non si è caricato: ecco la maglia disegnata.'); });
  }
  /* ----- 2,5D ----- */
  function avvia25(msg) {
    modo = '25d'; tex = null;
    var box = d.createElement('div'); box.className = 'm25'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<div class="m25__carta"><canvas class="m25__f" width="768" height="840"></canvas><canvas class="m25__f m25__f--retro" width="768" height="840"></canvas></div><div class="m25__ombra"></div>';
    scena.insertBefore(box, scena.firstChild);
    carta = $('.m25__carta', box); facce = $$('canvas', box);
    scena.classList.add('is-25d');
    if (poster) poster.setAttribute('aria-hidden', 'true');
    mostraStato(''); $('[data-cfg-aiuto]').textContent = msg || 'Trascina per girare la maglia.';
    ridisegna();
    // trascinamento a 360°
    var x0 = null, a0 = 0;
    box.addEventListener('pointerdown', function (e) { x0 = e.clientX; a0 = angolo; carta.classList.remove('is-anima'); try { box.setPointerCapture(e.pointerId); } catch (er) {} });
    box.addEventListener('pointermove', function (e) { if (x0 === null) return; angolo = a0 + (e.clientX - x0) * 0.6; carta.style.transform = 'rotateY(' + angolo + 'deg)'; });
    var fine = function () {
      if (x0 === null) return; x0 = null;
      var n = ((angolo % 360) + 360) % 360, retro = n > 90 && n < 270;
      $$('[data-vista-m]').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-vista-m') === 'retro') === retro)); });
    };
    box.addEventListener('pointerup', fine); box.addEventListener('pointercancel', fine);
  }
  S.maglia.forza25 = function () { if (mv) { mv.remove(); mv = null; } scena.classList.remove('is-3d'); modo = ''; avvia25(); };

  /* ----- "Usala nel kit squadra" ----- */
  $('[data-cfg-kit]').addEventListener('click', function () {
    var x = JSON.parse(JSON.stringify(s)); delete x.__ridisegna; x.usaNelKit = true;
    if (!salva(x)) { S.mostraAvviso('Il browser non permette di salvare la maglia: scrivici su WhatsApp.'); return; }
    location.href = S.REL + 'squadre/index.html#kit';
  });

  /* ----- avvio ----- */
  scriviForm(); aggiornaLink(); aggiornaDescr();
  fontPronto().then(function () { if (modo) ridisegna(); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (v) { if (v[0].isIntersecting) { io.disconnect(); avvia(); } }, { rootMargin: '500px 0px' });
    io.observe(scena);
  } else avvia();
})();
