/* =====================================================================
   SLANCIO – maglia-svg.js · ANTEPRIMA DELLA MAGLIA (componente riutilizzabile)
   Disegno originale in SVG, fronte e retro, con ombre e pieghe leggere.
   Usato da: configuratore kit (anteprima grande, proposte, riepilogo, PDF)
             e sezione a scorrimento "Il tuo kit prende forma" in home.

   window.MagliaSVG:
     svg(design, lato, opz)       → stringa SVG ('fronte' | 'retro'); opz.mini = senza dettagli
     pantaloncino(design)         → stringa SVG
     calzettoni(design)           → stringa SVG
     componente(el, opz)          → anteprima con rotazione (trascina o "Gira")
     png(design, lato, larghezza) → Promise con l'immagine PNG (data URL) per il PDF
     norm(design), contrasto(a, b), mescola(a, b, t)

   design = { c1, c2, c3, disegno: tinta|strisce|diagonale|sfumato|maniche,
              collo: girocollo|v|polo, stile: classico|moderno|geometrico|vintage,
              maniche: corte|lunghe|canotta, stemma: { src } | null, sigla: 'MS',
              sponsor: [{ src, nome, pos }], nome, numero }
   Le immagini (stemma, sponsor) devono essere data URL per finire nel PDF.
   ===================================================================== */
(function () {
  'use strict';
  var uid = 0;

  /* ---------------- colori ---------------- */
  var HEX = /^#[0-9a-f]{6}$/i;
  function rgb(h) { h = String(h || '#888888').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hex(c) { return '#' + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join('').toUpperCase(); }
  function mescola(a, b, t) { var x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }
  function lum(h) { var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrasto(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function migliore(fondo, lista) { return lista.slice().sort(function (a, b) { return contrasto(fondo, b) - contrasto(fondo, a); })[0]; }
  var BIANCO = '#F6F5F1', NERO = '#15161B';
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  var DISEGNI = ['tinta', 'strisce', 'diagonale', 'sfumato', 'maniche'];
  var COLLI = ['girocollo', 'v', 'polo'];
  var STILI = ['classico', 'moderno', 'geometrico', 'vintage'];
  function norm(d) {
    d = d || {};
    var o = {
      c1: HEX.test(d.c1) ? d.c1 : '#1B2A5B',
      c2: HEX.test(d.c2) ? d.c2 : BIANCO,
      disegno: DISEGNI.indexOf(d.disegno) > -1 ? d.disegno : 'tinta',
      collo: COLLI.indexOf(d.collo) > -1 ? d.collo : 'girocollo',
      stile: STILI.indexOf(d.stile) > -1 ? d.stile : 'classico',
      maniche: ['corte', 'lunghe', 'canotta'].indexOf(d.maniche) > -1 ? d.maniche : 'corte',
      stemma: d.stemma && d.stemma.src ? d.stemma : null,
      segnaposto: d.segnaposto !== false,
      sigla: String(d.sigla || '').slice(0, 3).toUpperCase(),
      sponsor: (d.sponsor || []).filter(function (s) { return s && s.pos; }),
      nome: String(d.nome || '').toUpperCase().slice(0, 14),
      numero: String(d.numero || '').slice(0, 3)
    };
    o.c3 = HEX.test(d.c3) && d.c3 !== o.c1 && d.c3 !== o.c2 ? d.c3 : migliore(o.c1, [o.c2, BIANCO, NERO].filter(function (c) { return c !== o.c1; }));
    if (o.stile === 'vintage') { o.c1 = mescola(o.c1, '#EADFC6', 0.14); o.c2 = mescola(o.c2, '#EADFC6', 0.14); o.c3 = mescola(o.c3, '#EADFC6', 0.14); }
    return o;
  }

  /* ---------------- sagome (viewBox 0 0 400 460) ---------------- */
  var SAGOME = {
    corte: {
      t: 'M155 28Q200 40 245 28L312 50C340 60 360 80 372 104L394 158L340 184C330 170 318 156 304 146C300 200 296 260 298 320L304 432Q200 452 96 432L102 320C104 260 100 200 96 146C82 156 70 170 60 184L6 158L28 104C40 80 60 60 88 50Z',
      m: ['M88 50C60 60 40 80 28 104L6 158L60 184C70 170 82 156 96 146C94 112 91 80 88 50Z', 'M312 50C340 60 360 80 372 104L394 158L340 184C330 170 318 156 304 146C306 112 309 80 312 50Z'],
      p: ['M6 158L60 184L63.5 171.5L9.5 145.5Z', 'M394 158L340 184L336.5 171.5L390.5 145.5Z'],
      cuc: ['M88 50C91 80 94 112 96 146', 'M312 50C309 80 306 112 304 146'],
      manica: { x: 50, y: 128, r: -26 }
    },
    lunghe: {
      t: 'M155 28Q200 40 245 28L312 50C338 58 356 76 366 100L392 318L354 326L326 182C318 166 312 154 304 146C300 200 296 260 298 320L304 432Q200 452 96 432L102 320C104 260 100 200 96 146C88 154 82 166 74 182L46 326L8 318L34 100C44 76 62 58 88 50Z',
      m: ['M88 50C62 58 44 76 34 100L8 318L46 326L74 182C82 166 88 154 96 146C94 112 91 80 88 50Z', 'M312 50C338 58 356 76 366 100L392 318L354 326L326 182C318 166 312 154 304 146C306 112 309 80 312 50Z'],
      p: ['M8 318L46 326L48 312L10 304Z', 'M392 318L354 326L352 312L390 304Z'],
      cuc: ['M88 50C91 80 94 112 96 146', 'M312 50C309 80 306 112 304 146'],
      manica: { x: 52, y: 150, r: -8 }
    },
    canotta: {
      t: 'M128 22L166 22Q200 34 234 22L272 22C277 78 290 122 306 150C300 200 296 260 298 320L304 432Q200 452 96 432L102 320C104 260 100 200 94 150C110 122 123 78 128 22Z',
      m: [], p: [], cuc: [],
      giro: ['M128 22C123 78 110 122 94 150', 'M272 22C277 78 290 122 306 150'],
      manica: null
    }
  };
  // collo: interno (si vede il dietro della maglia), bordino davanti, bordino dietro
  var COLLO = {
    girocollo: { i: 'M158 30Q200 40 242 30C236 52 220 64 200 64C180 64 164 52 158 30Z', b: 'M156 30C163 55 180 67 200 67C220 67 237 55 244 30', r: 'M156 30Q200 44 244 30' },
    v: { i: 'M158 30Q200 40 242 30L200 92Z', b: 'M155 30L200 97L245 30', r: 'M156 30Q200 44 244 30' },
    polo: { i: 'M164 30Q200 40 236 30L200 56Z', b: '', r: 'M152 28Q200 46 248 28' }
  };
  var COLLO_CANOTTA = {
    girocollo: { i: 'M166 22Q200 34 234 22C230 66 218 92 200 94C182 92 170 66 166 22Z', b: 'M164 22C168 68 182 96 200 96C218 96 232 68 236 22', r: 'M164 22Q200 36 236 22' },
    v: { i: 'M166 22Q200 34 234 22L200 100Z', b: 'M164 22L200 104L236 22', r: 'M164 22Q200 36 236 22' }
  };

  /* ---------------- pezzi ---------------- */
  function img(src, x, y, w, h) { return '<image href="' + esc(src) + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" preserveAspectRatio="xMidYMid meet"/>'; }
  function scudo(o, x, y, w, h) {
    // stemma segnaposto: scudo con le iniziali della squadra
    var s = Math.min(w / 40, h / 48);
    return '<g transform="translate(' + (x + (w - 40 * s) / 2) + ' ' + (y + (h - 48 * s) / 2) + ') scale(' + s + ')">' +
      '<path d="M20 1 39 7v18c0 12-8 19-19 22C9 44 1 37 1 25V7Z" fill="' + o.c3 + '" stroke="' + mescola(o.c3, NERO, 0.35) + '" stroke-width="1.2"/>' +
      '<path d="M20 5 35 10v15c0 9-6 15-15 18C11 40 5 34 5 25V10Z" fill="none" stroke="' + o.c1 + '" stroke-width="1.4" opacity=".7"/>' +
      (o.sigla ? '<text x="20" y="30" text-anchor="middle" font-family="Graduate, serif" font-size="' + (o.sigla.length > 2 ? 10 : 13) + '" fill="' + o.c1 + '">' + esc(o.sigla) + '</text>' : '') + '</g>';
  }
  function scritta(testo, x, y, w, h, fondo) {
    // sponsor senza immagine (es. PDF): riquadro con il nome
    var pezza = migliore(fondo, [BIANCO, NERO]), col = pezza === BIANCO ? NERO : BIANCO, t = String(testo || 'SPONSOR').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').toUpperCase().slice(0, 12);
    var fs = Math.min(h * 0.5, (w * 0.86) / Math.max(4, t.length * 0.8));
    return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + pezza + '" opacity=".92"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + fs * 0.36) + '" text-anchor="middle" font-family="Graduate, serif" font-size="' + fs.toFixed(1) + '" fill="' + col + '">' + esc(t) + '</text></g>';
  }
  function sponsorIn(sp, x, y, w, h, fondo) { return sp.src ? img(sp.src, x, y, w, h) : scritta(sp.nome, x, y, w, h, fondo); }
  function triangoli(id, colore) {
    return '<pattern id="' + id + '" width="36" height="31" patternUnits="userSpaceOnUse"><path d="M0 31 18 0 36 31Z" fill="' + colore + '"/></pattern>';
  }

  /* ---------------- maglia ---------------- */
  function svg(design, lato, opz) {
    opz = opz || {};
    var o = norm(design), retro = lato === 'retro', mini = !!opz.mini, id = 'mg' + (++uid);
    var S = SAGOME[o.maniche], canotta = o.maniche === 'canotta';
    var K = canotta ? (COLLO_CANOTTA[o.collo] || COLLO_CANOTTA.v) : COLLO[o.collo];
    var dy = canotta ? 14 : 0;
    var manicaCol = o.disegno === 'maniche' ? o.c2 : o.c1;
    var contrastoBordi = manicaCol === o.c2 ? o.c1 : o.c2;
    var trimCol = o.stile === 'moderno' ? o.c2 : contrastoBordi;
    var interno = mescola(o.c1, '#000000', 0.45);
    var def = '<defs><clipPath id="' + id + 'c"><path d="' + S.t + '"/></clipPath>' +
      '<linearGradient id="' + id + 'l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' +
      '<radialGradient id="' + id + 'r" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>' +
      (o.disegno === 'sfumato' ? '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1"><stop offset=".22" stop-color="' + o.c1 + '"/><stop offset="1" stop-color="' + o.c2 + '"/></linearGradient>' : '') +
      (o.stile === 'geometrico' ? triangoli(id + 'g', lum(o.c1) > 0.35 ? '#000' : '#fff') : '') +
      (o.stile === 'vintage' ? '<pattern id="' + id + 'w" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5H4" stroke="#000" stroke-width=".6"/></pattern>' : '') +
      '</defs>';

    /* tessuto e disegno */
    var h = '<g clip-path="url(#' + id + 'c)">';
    h += '<rect width="400" height="460" fill="' + (o.disegno === 'sfumato' ? 'url(#' + id + 's)' : o.c1) + '"/>';
    if (o.disegno === 'strisce') { for (var i = -5; i <= 5; i++) h += '<rect x="' + (200 + i * 38 - 10) + '" y="0" width="20" height="460" fill="' + o.c2 + '"/>'; }
    if (o.disegno === 'diagonale') h += '<path d="M70 37L410 487L350 533L10 83Z" fill="' + o.c2 + '"' + (retro ? ' transform="translate(400 0) scale(-1 1)"' : '') + '/>';
    if (o.stile === 'geometrico') h += '<rect width="400" height="460" fill="url(#' + id + 'g)" opacity=".07"/>';
    // maniche (sopra al disegno del corpo)
    if (o.disegno !== 'sfumato') S.m.forEach(function (p) { h += '<path d="' + p + '" fill="' + manicaCol + '"/>'; });
    // stile
    if (o.stile === 'moderno') {
      h += '<path d="M304 146C300 200 296 260 298 320L304 432L282 436L278 320C276 260 282 200 292 150Z" fill="' + o.c2 + '"/>' +
        '<path d="M96 146C100 200 104 260 102 320L96 432L118 436L122 320C124 260 118 200 108 150Z" fill="' + o.c2 + '"/>';
      if (!canotta) h += '<path d="M232 40L304 146M168 40L96 146" stroke="' + o.c2 + '" stroke-width="3" fill="none"/>';
    }
    if (o.stile === 'geometrico' && !retro) h += '<path d="M112 262 200 306 288 262V286L200 330 112 286Z" fill="' + o.c3 + '" opacity=".92"/>';
    if (o.stile === 'geometrico' && retro) h += '<path d="M112 330 200 374 288 330V354L200 398 112 354Z" fill="' + o.c3 + '" opacity=".92"/>';
    if (o.stile === 'vintage') h += '<rect width="400" height="460" fill="url(#' + id + 'w)" opacity=".06"/>';
    // polsini e giromanica
    if (o.stile === 'classico' || o.stile === 'geometrico') S.p.forEach(function (p) { h += '<path d="' + p + '" fill="' + (o.stile === 'geometrico' ? o.c3 : contrastoBordi) + '"/>'; });
    if (o.stile === 'vintage') S.p.forEach(function (p) { h += '<path d="' + p + '" fill="' + contrastoBordi + '" opacity=".95"/>'; });
    if (S.giro) S.giro.forEach(function (p) { h += '<path d="' + p + '" stroke="' + trimCol + '" stroke-width="' + (o.stile === 'moderno' ? 5 : 8) + '" fill="none"/>'; });

    /* ombre e pieghe */
    h += '<rect width="400" height="460" fill="url(#' + id + 'l)"/><rect width="400" height="460" fill="url(#' + id + 'r)"/><rect width="400" height="460" fill="url(#' + id + 'v)"/>';
    S.m.forEach(function (p) { h += '<path d="' + p + '" fill="#000" opacity=".07"/>'; });
    if (!mini) {
      var pieghe = ['M300 160C282 190 266 206 250 222', 'M100 160C118 190 134 206 150 222', 'M292 360C276 382 270 400 268 428', 'M118 380C126 398 128 414 126 432', 'M206 300C202 340 203 380 208 430'];
      pieghe.forEach(function (p, k) {
        h += '<path d="' + p + '" stroke="#000" stroke-opacity="' + (k === 4 ? 0.04 : 0.08) + '" stroke-width="10" stroke-linecap="round" fill="none"/>' +
          '<path d="' + p + '" stroke="#fff" stroke-opacity="' + (k === 4 ? 0.04 : 0.07) + '" stroke-width="3" stroke-linecap="round" fill="none" transform="translate(-4 -3)"/>';
      });
      S.cuc.forEach(function (p) { h += '<path d="' + p + '" stroke="#000" stroke-opacity=".22" stroke-width="1.4" fill="none"/>'; });
      h += '<path d="M99 423Q200 443 301 423" stroke="#000" stroke-opacity=".26" stroke-width="1.2" stroke-dasharray="4 4" fill="none"/>';
    }
    h += '</g>';

    /* collo */
    if (!retro) {
      h += '<path d="' + K.i + '" fill="' + interno + '"/>';
      h += '<path d="' + (canotta ? 'M164 22Q200 36 236 22' : 'M158 31Q200 41 242 31') + '" stroke="' + mescola(trimCol, '#000', 0.3) + '" stroke-width="5" fill="none"/>';
      if (K.b) {
        var sw = o.stile === 'moderno' ? 6 : o.stile === 'vintage' ? 11 : 9;
        h += '<path d="' + K.b + '" stroke="' + trimCol + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="' + (o.collo === 'v' ? 'miter' : 'round') + '" fill="none"/>';
        if (o.stile === 'vintage') h += '<path d="' + K.b + '" stroke="' + o.c1 + '" stroke-width="2" fill="none"/>';
      }
      if (o.collo === 'polo' && !canotta) {
        var bordo = mescola(trimCol, '#000', 0.25);
        h += '<path d="M193 56H207V124H193Z" fill="' + mescola(o.c1, '#000', 0.12) + '" stroke="#000" stroke-opacity=".2"/>' +
          '<circle cx="200" cy="78" r="3.2" fill="' + trimCol + '"/><circle cx="200" cy="102" r="3.2" fill="' + trimCol + '"/>' +
          '<path d="M156 27Q170 30 199 57L181 83Q162 60 146 38Z" fill="' + trimCol + '" stroke="' + bordo + '" stroke-width="1.2"/>' +
          '<path d="M244 27Q230 30 201 57L219 83Q238 60 254 38Z" fill="' + trimCol + '" stroke="' + bordo + '" stroke-width="1.2"/>';
      }
    } else {
      h += '<path d="' + K.r + '" stroke="' + trimCol + '" stroke-width="' + (o.collo === 'polo' ? 12 : o.stile === 'vintage' ? 10 : 8) + '" stroke-linecap="round" fill="none"/>';
    }
    h += '<path d="' + S.t + '" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.5" stroke-linejoin="round"/>';

    /* stemma, sponsor, nome e numero */
    var pos = function (p) { return o.sponsor.filter(function (s) { return s.pos === p; }); };
    if (!retro && !mini) {
      var spPetto = pos('Petto sinistro'), spCentro = pos('Centro petto'), spManica = pos('Manica');
      var cx = spPetto.length ? 124 : 236, cy = 90 + dy;
      if (o.stemma) h += img(o.stemma.src, cx, cy, 40, 48);
      else if (o.segnaposto) h += scudo(o, cx, cy, 40, 48);
      if (spPetto[0]) h += sponsorIn(spPetto[0], 232, 98 + dy, 48, 34, o.c1);
      if (spCentro[0]) h += sponsorIn(spCentro[0], 128, 166 + dy, 144, 50, o.c1);
      if (spCentro[1]) h += sponsorIn(spCentro[1], 150, 224 + dy, 100, 30, o.c1);
      if (spManica[0] && S.manica) h += '<g transform="rotate(' + S.manica.r + ' ' + S.manica.x + ' ' + S.manica.y + ')">' + sponsorIn(spManica[0], S.manica.x - 20, S.manica.y - 11, 40, 22, manicaCol) + '</g>';
    }
    if (retro) {
      // colore del numero: leggibile sul colore principale; con strisce o fascia un bordo più spesso lo stacca anche dal secondo colore
      var colN = migliore(o.c1, [o.c2, o.c3, BIANCO, NERO]), bordoN = migliore(colN, [o.c1, NERO, BIANCO]);
      var fantasia = o.disegno === 'strisce' || o.disegno === 'diagonale';
      var spSch = pos('Schiena');
      if (spSch[0] && !mini) h += sponsorIn(spSch[0], 130, 52 + dy, 140, 36, o.c1);
      if (o.nome) {
        var fsn = Math.min(30, 236 / Math.max(1, o.nome.length * 0.82));
        h += '<text x="200" y="' + (130 + dy) + '" text-anchor="middle" font-family="Graduate, serif" font-size="' + fsn.toFixed(1) + '" letter-spacing="1.5" fill="' + colN + '" stroke="' + bordoN + '" stroke-width="' + (fantasia ? 4 : o.disegno === 'tinta' ? 0 : 1.4) + '" stroke-linejoin="round" paint-order="stroke">' + esc(o.nome) + '</text>';
      }
      if (o.numero) {
        var fsN = o.numero.length > 2 ? 96 : 132;
        h += '<text x="200" y="' + (o.nome ? 288 : 272) + '" text-anchor="middle" font-family="Graduate, serif" font-size="' + fsN + '" fill="' + colN + '" stroke="' + bordoN + '" stroke-width="' + (fantasia ? 9 : o.disegno === 'tinta' ? 2 : 4) + '" stroke-linejoin="round" paint-order="stroke">' + esc(o.numero) + '</text>';
      }
    }
    return '<svg class="mgs__svg" viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg"' + (opz.w ? ' width="' + opz.w + '" height="' + Math.round(opz.w * 1.15) + '"' : '') + ' aria-hidden="true" focusable="false">' + (opz.stile || '') + def + h + '</svg>';
  }

  /* ---------------- pantaloncino e calzettoni coordinati ---------------- */
  function pantaloncino(design, opz) {
    opz = opz || {};
    var o = norm(design), id = 'pt' + (++uid), col = o.c2, banda = o.c1 === col ? o.c3 : o.c1, n = migliore(col, [o.c1, o.c3, BIANCO, NERO]);
    var sp = o.sponsor.filter(function (s) { return s.pos === 'Pantaloncino'; })[0];
    var t = 'M24 12H176L190 140Q150 152 112 146L100 74L88 146Q50 152 10 140Z';
    return '<svg class="mgs__svg" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"' + (opz.w ? ' width="' + opz.w + '" height="' + Math.round(opz.w * 0.8) + '"' : '') + ' aria-hidden="true" focusable="false">' + (opz.stile || '') +
      '<defs><clipPath id="' + id + 'c"><path d="' + t + '"/></clipPath><linearGradient id="' + id + 'l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>' +
      '<g clip-path="url(#' + id + 'c)"><rect width="200" height="160" fill="' + col + '"/>' +
      '<path d="M176 24L192 142L180 144L166 26ZM24 24L8 142L20 144L34 26Z" fill="' + banda + '"/>' +
      '<rect y="12" width="200" height="14" fill="' + mescola(col, '#000', 0.22) + '"/>' +
      '<rect width="200" height="160" fill="url(#' + id + 'l)"/><path d="M100 74V30" stroke="#000" stroke-opacity=".12" stroke-width="3"/>' +
      '<path d="M14 134Q50 144 86 138M114 138Q150 144 186 134" stroke="#000" stroke-opacity=".25" stroke-dasharray="3 3" fill="none"/></g>' +
      (o.numero ? '<text x="52" y="122" text-anchor="middle" font-family="Graduate, serif" font-size="22" fill="' + n + '">' + esc(o.numero) + '</text>' : '') +
      (sp ? sponsorIn(sp, 122, 96, 50, 26, col) : '') +
      '<path d="' + t + '" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4"/></svg>';
  }
  function calzettoni(design, opz) {
    opz = opz || {};
    var o = norm(design), id = 'cz' + (++uid), col = o.c1, b = o.c2 === col ? o.c3 : o.c2;
    var c = 'M14 6H50V126Q52 140 70 150Q84 158 80 172Q76 184 58 182H22Q12 182 12 170V126Z';
    var una = function (dx) {
      return '<g transform="translate(' + dx + ' 0)"><clipPath id="' + id + dx + '"><path d="' + c + '"/></clipPath><g clip-path="url(#' + id + dx + ')">' +
        '<rect width="100" height="200" fill="' + col + '"/><rect y="16" width="100" height="9" fill="' + b + '"/><rect y="31" width="100" height="5" fill="' + b + '"/>' +
        '<rect y="0" width="100" height="10" fill="' + mescola(col, '#000', 0.2) + '"/><path d="M50 150Q66 152 80 172L80 200H44Z" fill="#000" opacity=".12"/>' +
        '<rect width="22" height="200" fill="#fff" opacity=".07" x="18"/></g><path d="' + c + '" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.3"/></g>';
    };
    return '<svg class="mgs__svg" viewBox="0 0 140 190" xmlns="http://www.w3.org/2000/svg"' + (opz.w ? ' width="' + opz.w + '" height="' + Math.round(opz.w * 1.36) + '"' : '') + ' aria-hidden="true" focusable="false">' + (opz.stile || '') + una(0) + una(44) + '</svg>';
  }

  /* ---------------- immagine PNG (PDF, ordine) ---------------- */
  var fontDato = null;
  function font() {
    if (fontDato !== null) return Promise.resolve(fontDato);
    var rel = (document.body && document.body.getAttribute('data-rel')) || '';
    return fetch(rel + 'fonts/graduate-latin-400-normal.woff2').then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) {
      return new Promise(function (ok) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.onerror = function () { ok(''); }; f.readAsDataURL(b); });
    }).catch(function () { return ''; }).then(function (u) { fontDato = u; return u; });
  }
  function png(design, lato, larghezza, tipo) {
    larghezza = larghezza || 600;
    return font().then(function (f) {
      var stile = f ? '<style>@font-face{font-family:Graduate;src:url(' + f + ') format("woff2")}</style>' : '';
      var w = larghezza, s = tipo === 'pantaloncino' ? pantaloncino(design, { w: w, stile: stile }) : tipo === 'calzettoni' ? calzettoni(design, { w: w, stile: stile }) : svg(design, lato, { w: w, stile: stile });
      return new Promise(function (ok, ko) {
        var im = new Image();
        im.onload = function () {
          try {
            var cv = document.createElement('canvas'); cv.width = im.width || w; cv.height = im.height || Math.round(w * 1.15);
            var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, cv.width, cv.height);
            ok(cv.toDataURL('image/png'));
          } catch (e) { ko(e); }
        };
        im.onerror = ko;
        im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
      });
    });
  }

  /* ---------------- componente con rotazione ---------------- */
  var ridotto = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function componente(el, opz) {
    opz = opz || {};
    el.classList.add('mgs');
    el.innerHTML = '<div class="mgs__palco" tabindex="0" role="img" aria-roledescription="anteprima girevole" aria-label="Anteprima della maglia, lato davanti">' +
      '<div class="mgs__carta"><div class="mgs__faccia mgs__faccia--fronte"></div><div class="mgs__faccia mgs__faccia--retro"></div><i class="mgs__luce" aria-hidden="true"></i></div>' +
      '<span class="mgs__ombra" aria-hidden="true"></span></div>' +
      (opz.coordinati !== false ? '<div class="mgs__extra" aria-hidden="true"><div class="mgs__pant"></div><div class="mgs__calze"></div></div>' : '') +
      '<div class="mgs__az"><button class="mgs__gira" type="button" data-gira><svg class="ico ico--s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></svg><span data-gira-txt>Gira: vedi il retro</span></button>' +
      (opz.aiuto !== false ? '<span class="mgs__aiuto">Trascina per girarla</span>' : '') + '</div>';
    var palco = el.querySelector('.mgs__palco'), carta = el.querySelector('.mgs__carta'), luce = el.querySelector('.mgs__luce'), ombra = el.querySelector('.mgs__ombra');
    var fr = el.querySelector('.mgs__faccia--fronte'), re = el.querySelector('.mgs__faccia--retro'), btn = el.querySelector('[data-gira]'), btnT = el.querySelector('[data-gira-txt]');
    var ang = 0, design = null, trascina = null, raf = 0;
    function applica(anim) {
      carta.style.transition = anim && !ridotto.matches ? 'transform .7s cubic-bezier(.16,1,.3,1)' : 'none';
      carta.style.transform = 'rotateY(' + ang + 'deg)';
      var c = Math.abs(Math.cos(ang * Math.PI / 180));
      luce.style.transition = carta.style.transition.replace('transform', 'opacity');
      luce.style.opacity = ((1 - c) * 0.55).toFixed(3);
      ombra.style.transition = carta.style.transition;
      ombra.style.transform = 'scaleX(' + (0.55 + c * 0.45).toFixed(3) + ')';
    }
    function lato() { var a = ((ang % 360) + 360) % 360; return a > 90 && a < 270 ? 'retro' : 'fronte'; }
    function etichette() {
      var r = lato() === 'retro';
      btnT.textContent = r ? 'Gira: vedi il davanti' : 'Gira: vedi il retro';
      palco.setAttribute('aria-label', 'Anteprima della maglia, lato ' + (r ? 'dietro' : 'davanti') + (design && r && (design.nome || design.numero) ? ': ' + [design.nome, design.numero].filter(Boolean).join(' ') : ''));
    }
    function scatta() { ang = Math.round(ang / 180) * 180; applica(true); etichette(); }
    function gira() { ang = Math.round(ang / 180) * 180 + 180; applica(true); etichette(); }
    btn.addEventListener('click', gira);
    palco.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); gira(); }
    });
    // trascinare: solo i movimenti orizzontali girano la maglia, quelli verticali fanno scorrere la pagina
    palco.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      trascina = { x: e.clientX, y: e.clientY, a: ang, id: e.pointerId, via: false };
    });
    palco.addEventListener('pointermove', function (e) {
      if (!trascina || e.pointerId !== trascina.id) return;
      var dx = e.clientX - trascina.x, dy = e.clientY - trascina.y;
      if (!trascina.via) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) { if (Math.abs(dy) > 10) trascina = null; return; }
        trascina.via = true; palco.classList.add('is-trascina');
        try { palco.setPointerCapture(e.pointerId); } catch (x) {}
      }
      ang = trascina.a + dx * 0.7;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; applica(false); });
    });
    function fine(e) {
      if (!trascina || (e && e.pointerId !== trascina.id)) return;
      var via = trascina.via; trascina = null; palco.classList.remove('is-trascina');
      if (via) scatta();
    }
    palco.addEventListener('pointerup', fine); palco.addEventListener('pointercancel', fine);
    palco.addEventListener('lostpointercapture', fine);
    var C = {
      el: el,
      aggiorna: function (d) {
        design = norm(d);
        fr.innerHTML = svg(d, 'fronte'); re.innerHTML = svg(d, 'retro');
        var p = el.querySelector('.mgs__pant'), z = el.querySelector('.mgs__calze');
        if (p) p.innerHTML = pantaloncino(d); if (z) z.innerHTML = calzettoni(d);
        etichette();
      },
      vista: function (l) { ang = l === 'retro' ? 180 : 0; applica(true); etichette(); },
      gira: gira,
      lato: lato
    };
    applica(false);
    return C;
  }

  window.MagliaSVG = { svg: svg, pantaloncino: pantaloncino, calzettoni: calzettoni, componente: componente, png: png, norm: norm, contrasto: contrasto, mescola: mescola, migliore: migliore, lum: lum, DISEGNI: DISEGNI, COLLI: COLLI, STILI: STILI };
})();
