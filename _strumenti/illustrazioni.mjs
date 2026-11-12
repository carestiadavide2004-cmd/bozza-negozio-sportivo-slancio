// =====================================================================
// SLANCIO – illustrazioni dei prodotti (disegni originali)
// Genera assets/img/prodotti.svg: uno sprite con un <symbol> per tipo di articolo.
// Stile: campiture piatte, contorno inchiostro 3px, colore del prodotto = currentColor,
// dettagli bianco carta e ombra a terra. Nessun marchio, nessuna scritta.
// Uso:  node _strumenti/illustrazioni.mjs   (lo lancia anche build.mjs)
// =====================================================================
import { writeFileSync } from 'node:fs';

const K = '#0E0F12', W = '#FBFAF7';
const cc = 'currentColor';
const f = (d, fill = cc, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;   // forma piena con contorno
const l = (d, stroke = K, w = 3, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}"${extra}/>`; // solo linea
const ombraF = (d, o = '.16') => `<path d="${d}" fill="${K}" fill-opacity="${o}" stroke="none"/>`; // ombreggiatura
const luce = (d, o = '.55', w = 4) => `<path d="${d}" fill="none" stroke="${W}" stroke-opacity="${o}" stroke-width="${w}"/>`;
const terra = (rx = 54, cy = 146) => `<ellipse cx="80" cy="${cy}" rx="${rx}" ry="5" fill="${K}" opacity=".12" stroke="none"/>`;
const r = (n, d = 1) => +n.toFixed(d);

/* --- pezzi calcolati --- */
function poligono(cx, cy, raggio, lati, rot = -90) {
  return Array.from({ length: lati }, (_, i) => { const a = (rot + i * 360 / lati) * Math.PI / 180; return `${r(cx + raggio * Math.cos(a))},${r(cy + raggio * Math.sin(a))}`; }).join(' ');
}
function palloneCalcio() {
  const cx = 80, cy = 76, R = 56;
  let s = terra(46) + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${W}"/>`;
  // pentagono centrale e cinque pentagoni esterni (colore prodotto)
  const est = [];
  for (let i = 0; i < 5; i++) {
    const a = (-54 + i * 72) * Math.PI / 180;
    const ex = cx + 41 * Math.cos(a), ey = cy + 41 * Math.sin(a);
    est.push([ex, ey, (-54 + i * 72)]);
  }
  // cuciture: dai vertici del pentagono centrale verso il bordo, tra i pentagoni esterni
  for (let i = 0; i < 5; i++) {
    const a = (-90 + i * 72) * Math.PI / 180;
    s += `<path d="M${r(cx + 15 * Math.cos(a))} ${r(cy + 15 * Math.sin(a))} L${r(cx + 34 * Math.cos(a))} ${r(cy + 34 * Math.sin(a))}" stroke="${K}" stroke-width="2.2" fill="none"/>`;
    // biforcazione verso i due pentagoni vicini
    const bx = cx + 34 * Math.cos(a), by = cy + 34 * Math.sin(a);
    for (const d of [-1, 1]) { const b = a + d * 0.42; s += `<path d="M${r(bx)} ${r(by)} L${r(cx + 50 * Math.cos(b))} ${r(cy + 50 * Math.sin(b))}" stroke="${K}" stroke-width="2.2" fill="none"/>`; }
  }
  for (const [ex, ey, rot] of est) s += `<polygon points="${poligono(ex, ey, 11, 5, rot)}" fill="${cc}" stroke="${K}" stroke-width="2.2" stroke-linejoin="round"/>`;
  s += `<polygon points="${poligono(cx, cy, 15, 5, -90)}" fill="${K}"/>`;
  s += `<clipPath id="pc-clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`;
  s += `<path d="M${cx + R} ${cy} a${R} ${R} 0 0 1 -${R} ${R}" fill="none" stroke="${K}" stroke-opacity=".12" stroke-width="16" clip-path="url(#pc-clip)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${K}" stroke-width="3"/>`;
  s += luce('M44 50 A46 46 0 0 1 70 28', '.7', 5);
  return s;
}
function pallaVolley() {
  const cx = 80, cy = 76, R = 56;
  let s = terra(46) + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${W}"/>`;
  s += `<clipPath id="pv-clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><g clip-path="url(#pv-clip)">`;
  for (let i = 0; i < 3; i++) {
    s += `<g transform="rotate(${i * 120} ${cx} ${cy})"><path d="M${cx} ${cy} C${cx + 8} ${cy - 22} ${cx + 26} ${cy - 40} ${cx + 52} ${cy - 46} L${cx + 70} ${cy - 20} C${cx + 44} ${cy - 22} ${cx + 18} ${cy - 10} ${cx} ${cy} Z" fill="${i === 1 ? K : cc}" fill-opacity="${i === 1 ? '.85' : '1'}" stroke="${K}" stroke-width="2.4" stroke-linejoin="round"/>`;
    s += `<path d="M${cx} ${cy} C${cx - 4} ${cy - 24} ${cx + 4} ${cy - 46} ${cx + 22} ${cy - 62}" fill="none" stroke="${K}" stroke-width="2.4"/></g>`;
  }
  s += `<path d="M${cx + R} ${cy} a${R} ${R} 0 0 1 -${R} ${R}" fill="none" stroke="${K}" stroke-opacity=".1" stroke-width="16"/></g>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${K}" stroke-width="3"/>`;
  s += luce('M42 54 A46 46 0 0 1 66 28', '.7', 5);
  return s;
}
function corde(cx, cy, rx, ry, passo) {
  let s = '';
  for (let x = cx - rx + passo; x < cx + rx; x += passo) { const h = ry * Math.sqrt(1 - ((x - cx) / rx) ** 2); s += `M${r(x)} ${r(cy - h)}V${r(cy + h)}`; }
  for (let y = cy - ry + passo; y < cy + ry; y += passo) { const w = rx * Math.sqrt(1 - ((y - cy) / ry) ** 2); s += `M${r(cx - w)} ${r(y)}H${r(cx + w)}`; }
  return s;
}
function fori(cx, cy, rx, ry, passo, raggio) {
  let s = '';
  for (let y = cy - ry + passo; y < cy + ry - 4; y += passo)
    for (let x = cx - rx + passo; x < cx + rx - 4; x += passo)
      if (((x - cx) / (rx - 8)) ** 2 + ((y - cy) / (ry - 8)) ** 2 < 1) s += `<circle cx="${r(x)}" cy="${r(y)}" r="${raggio}"/>`;
  return s;
}
const zigzag = (x, y, n, passo = 5, h = 4) => 'M' + x + ' ' + y + Array.from({ length: n }, (_, i) => ` l${passo} ${i % 2 ? -h : h}`).join('');

/* --- disegni (viewBox 0 0 160 160) --- */
const D = {
  'scarpa-tacchetti': () => terra(60, 140) +
    f('M24 112V97C24 83 30 73 40 67l12-6c6-3 12-1 16 4l12 15c16 6 38 10 52 14 10 3 14 10 12 18Z') +
    ombraF('M24 112V98c10-2 22 0 30 14Z', '.18') + ombraF('M118 92c12 4 22 9 26 20h-28Z', '.14') +
    luce('M44 104 112 94', '.9', 5) +
    l('M66 70l10-4M72 77l10-4M78 84l10-4', W, 3) + l('M40 67c6 4 16 2 24-4') +
    f('M24 112h120v6c0 3-2 5-5 5H29c-3 0-5-2-5-5Z', K) +
    f('M33 123l2 10h8l2-10ZM58 123l2 9h7l2-9ZM96 123l2 9h7l2-9ZM119 123l2 10h8l2-10Z', K),
  'scarpa-calcetto': () => terra(60, 138) +
    f('M22 110V99c0-12 6-22 16-28l12-6c6-3 12-1 16 4l12 14c16 6 38 10 52 14 10 3 14 8 13 13Z') +
    ombraF('M116 96c12 3 24 7 27 14h-26Z', '.2') +
    l('M64 74l10-4M70 81l10-4M76 88l10-4', W, 3) + l('M38 71c6 4 16 2 24-4') +
    f('M20 110h125v8c0 4-3 7-7 7H27c-4 0-7-3-7-7Z', '#E9E3D6') +
    l('M30 119h10M50 119h10M70 119h10M90 119h10M110 119h10M128 119h8', K, 2),
  'scarpa-running': () => terra(62, 140) +
    f('M26 104c-2-16 4-28 16-36l12-6c6-3 12-1 16 4l14 14c16 4 34 8 46 12 10 3 14 8 12 12Z') +
    ombraF('M84 80c16 4 34 8 46 12-2 4-6 6-10 6-14-2-28-6-38-10Z', '.14') +
    l('M64 70l10-4M70 77l10-4M76 84l10-4', W, 3) + l('M24 86l-8-6 4-6 10 4') +
    f('M20 104h124c2 6 0 12-6 14l-98 2c-10 0-18-4-20-10Z', W) +
    f('M22 116c4 6 10 8 18 8h96c4 0 6-2 4-6Z', K),
  'scarpa-campo': () => terra(62, 140) +
    f('M24 106V96c0-14 6-24 18-30l12-5c6-3 12-1 16 4l12 15c16 5 36 9 48 13 10 3 14 8 13 13Z') +
    ombraF('M114 89c12 3 26 7 29 17h-27Z', '.2') +
    luce('M40 98c20-6 44-6 64 2', '.85', 4) +
    l('M66 70l10-4M72 77l10-4M78 84l10-4', W, 3) +
    f('M20 106h125v8c0 3-2 5-5 5H25c-3 0-5-2-5-5Z', W) +
    l(zigzag(26, 120, 22, 5, 4), K, 2),
  'scarpa-alta': () => terra(60, 140) +
    f('M30 108V52c0-6 4-10 10-10h18c6 0 8 4 10 10l6 24c18 6 42 12 56 16 10 3 14 9 13 16Z') +
    f('M30 64l40-6 2 10-42 8Z', K) +
    l('M64 54l9-3M66 62l9-3M68 72l9-3M74 81l9-3', W, 3) + l('M30 52h36') +
    ombraF('M118 90c12 3 22 8 25 18h-26Z', '.18') +
    f('M24 108h122v9c0 3-2 5-5 5H29c-3 0-5-2-5-5Z', W) + l('M26 122h116', K, 4),
  'scarpa-boxe': () => terra(54, 140) +
    f('M42 112V27c0-4 3-7 7-7h21c4 0 6 3 6 7v47c16 8 38 14 50 20 10 5 12 11 10 18Z') +
    ombraF('M42 92c18-4 40-2 60 6l-2 14H42Z', '.16') + l('M42 40h16') +
    l('M66 30h12M66 40h12M66 50h12M66 60h12M68 70h12M76 79h10', W, 3) +
    f('M38 112h100v6c0 2-2 4-4 4H42c-2 0-4-2-4-4Z', K),
  'scarpa-bici': () => terra(60, 136) +
    f('M24 104V94c0-12 6-22 18-28l14-6c6-2 12 0 16 4l14 14c16 6 34 10 46 14 9 3 13 8 12 12Z') +
    l('M62 64c10 6 22 14 30 24', W, 7) + l('M80 62c10 6 20 12 28 22', W, 7) +
    `<circle cx="50" cy="78" r="8" fill="${K}"/><circle cx="50" cy="78" r="3" fill="${W}" stroke="none"/>` +
    f('M22 104h124v6c0 3-2 5-5 5H27c-3 0-5-2-5-5Z', K) + f('M70 115l6 9h20l6-9Z', '#5C626C'),
  'scarpone-sci': () => terra(54, 136) +
    f('M40 122V70l12-10h34l10 32c16 4 30 8 34 16v14Z') +
    f('M42 74V25c0-4 3-7 7-7h35c4 0 6 3 6 7v35l-4 2H52Z') +
    ombraF('M74 22h16v38H74Z', '.14') +
    f('M42 18h48v9H42Z', K) +
    `<rect x="86" y="32" width="12" height="7" rx="1.5" fill="${W}" stroke="${K}" stroke-width="2.5"/><rect x="86" y="48" width="12" height="7" rx="1.5" fill="${W}" stroke="${K}" stroke-width="2.5"/><rect x="100" y="90" width="12" height="7" rx="1.5" fill="${W}" stroke="${K}" stroke-width="2.5" transform="rotate(14 106 93)"/>` +
    f('M36 122h98v9H36Z', K),
  'maglia': () => terra(46) +
    f('M58 26 38 32 16 56l16 18 12-10v72h72V64l12 10 16-18-22-24-20-6c-4 10-12 16-22 16s-18-6-22-16Z') +
    ombraF('M44 64v72h10V70Z', '.12') +
    f('M58 26c4 10 12 16 22 16s18-6 22-16l-6-1c-3 7-9 11-16 11s-13-4-16-11Z', K) +
    f('M20 52l16 18-4 4-16-18Z', W) + f('M140 52l-16 18 4 4 16-18Z', W) +
    f('M44 100l72-14v10l-72 14Z', W, ' stroke="none" opacity=".92"'),
  'maglia-lunga': () => terra(46) +
    f('M58 26 40 32c-8 4-12 12-14 22l-8 66 16 2 10-50v64h72V72l10 50 16-2-8-66c-2-10-6-18-14-22l-18-6c-4 10-12 16-22 16s-18-6-22-16Z') +
    ombraF('M44 72v64h10V78Z', '.12') +
    f('M58 26c4 10 12 16 22 16s18-6 22-16l-6-1c-3 7-9 11-16 11s-13-4-16-11Z', K) +
    f('M19 112l16 2-1 8-16-2Z', W) + f('M141 112l-16 2 1 8 16-2Z', W) +
    l('M58 28 47 70M102 28l11 42', K, 2, ' stroke-opacity=".45"'),
  'canotta': () => terra(44) +
    f('M56 22c0 16 10 26 24 26s24-10 24-26l14 4c-4 16-2 30 6 38v72H36V64c8-8 10-22 6-38Z') +
    f('M36 82h12v54H36ZM112 82h12v54h-12Z', W) +
    ombraF('M100 48c8 6 16 12 24 16v8c-10-4-18-12-24-24Z', '.14'),
  'pantaloncino': () => terra(54, 140) +
    f('M34 40h92l12 72-44 8-14-38-14 38-44-8Z') +
    f('M34 40h92l1 10H33Z', K) +
    l('M31 58l-6 50M129 58l6 50', W, 5) + l('M76 52l-3 10M84 52l3 10', W, 2.5) +
    ombraF('M80 82 94 120l-8 1-10-31Z', '.14'),
  'gonna': () => terra(54, 140) +
    f('M42 36h76l22 84c-20 8-40 10-60 10s-40-2-60-10Z') +
    f('M42 36h76l1 10H41Z', K) +
    l('M62 48 52 126M80 48v82M98 48l10 78', K, 2, ' stroke-opacity=".35"') +
    luce('M46 112c22 6 46 6 68 0', '.8', 4),
  'pantalone': () => terra(50, 144) +
    f('M48 20h64l8 118H88L80 58l-8 80H40Z') +
    f('M48 20h64v10H48Z', K) +
    l('M54 32 46 128M106 32l8 96', W, 4) +
    f('M40 130h32v8H40ZM88 130h32v8H88Z', K) +
    ombraF('M80 58 88 138h6l-6-84Z', '.14'),
  'calzettone': () => terra(42, 142) +
    f('M62 14h36v82l22 14c10 6 10 22-2 26-4 1-8 1-12 0l-36-10c-10-3-14-12-10-20l2-6Z') +
    f('M62 14h36v20H62Z', W) + l('M62 22h36M62 28h36', cc, 2.5) +
    ombraF('M106 136c8 1 16-2 18-10l-12-14-8 20Z', '.2') + ombraF('M60 106c-4 8 0 17 10 20l4-10Z', '.2'),
  'calza': () => terra(42, 138) +
    f('M64 54h34v38l22 14c10 6 10 22-2 26H106l-36-10c-10-3-14-12-10-20l4-8Z') +
    f('M64 54h34v12H64Z', W) +
    ombraF('M106 132c8 0 16-2 18-10l-12-14-8 20Z', '.2') + ombraF('M60 102c-4 8 0 17 10 20l4-10Z', '.2'),
  'felpa': () => terra(48) +
    f('M58 30c0-16 44-16 44 0l2 10H56Z') +
    f('M56 36 36 44c-8 4-12 12-14 22l-6 54 16 2 10-46v60h76V76l10 46 16-2-6-54c-2-10-6-18-14-22l-20-8c-6 10-14 14-24 14s-18-4-24-14Z') +
    f('M64 34c0-10 32-10 32 0-4 8-28 8-32 0Z', K) +
    l('M72 44v22M88 44v22', W, 2.5) +
    f('M58 104h44l6 24H52Z', K, ' fill-opacity=".14"') +
    f('M42 128h76v8H42Z', K, ' fill-opacity=".2"'),
  'giacca-tuta': () => terra(48) +
    f('M58 24 38 32c-8 4-12 12-14 22l-8 66 16 2 10-50v64h76V72l10 50 16-2-8-66c-2-10-6-18-14-22l-20-8Z') +
    f('M60 14h40l2 12-22 8-22-8Z') +
    l('M34 42 22 116M126 42l12 74', W, 5) +
    l('M80 30v106', K, 3) + l('M52 108l12-4M108 108l-12-4', K, 2.5) +
    f('M42 130h76v6H42Z', K),
  'giacca-sci': () => terra(50) +
    f('M56 30 38 38c-10 4-16 14-18 26l-6 58 18 2 10-44v58h76V80l10 44 18-2-6-58c-2-12-8-22-18-26l-18-8Z') +
    f('M58 36V16c0-4 4-6 8-6h28c4 0 8 2 8 6v20Z') +
    l('M42 60h76M42 84h76M42 108h76', K, 2, ' stroke-opacity=".5"') +
    l('M24 80l16 2M20 100l18 2M136 80l-16 2M140 100l-18 2', K, 2, ' stroke-opacity=".5"') +
    l('M80 10v128', K, 3) + f('M14 118l18 2v4l-18-2ZM146 118l-18 2v4l18-2Z', K) +
    f('M104 64h10v10h-10Z', W),
  'accappatoio': () => terra(50) +
    f('M54 22 36 30c-8 4-12 12-14 22l-6 52 18 4 8-38v70h76V70l8 38 18-4-6-52c-2-10-6-18-14-22l-18-8-26 44Z') +
    f('M58 22l22 38 22-38h4L80 66 54 22Z', W) +
    l('M80 66l16 74', K, 2.5) +
    f('M42 86h76v8H42Z', W) + f('M72 94l-6 22 6 1 5-23ZM86 94l6 21-6 2-4-23Z', W) +
    l('M48 106h18v14H48Z', K, 2.5),
  'costume': () => terra(40, 144) +
    f('M58 22h8v14c4 8 24 8 28 0V22h8v26c-4 12-4 26 2 38l8 40c-14-4-24 0-32 10-8-10-18-14-32-10l8-40c6-12 6-26 2-38Z') +
    f('M60 74l40-8v9l-40 8Z', W, ' stroke="none"') +
    ombraF('M94 36V22h8v26c-4 12-4 26 2 38l8 40c-6-2-12-2-16-1l-4-40c-4-12-2-30 2-49Z', '.14') +
    l('M66 36c4 8 24 8 28 0', K, 2, ' stroke-opacity=".5"'),
  'telo': () => terra(58, 136) +
    f('M30 104h100v24H30Z', W) + l('M30 116h100', K, 2, ' stroke-opacity=".3"') +
    f('M26 66h104c4 0 6 2 6 6v32c0 4-2 6-6 6H26c-4 0-6-2-6-6V72c0-4 2-6 6-6Z') +
    l('M20 92h116', W, 4) + l('M20 100h116', W, 2) +
    ombraF('M20 72c0-4 2-6 6-6h10v44H26c-4 0-6-2-6-6Z', '.16'),
  'cappellino': () => terra(56, 120) +
    f('M30 96c0-40 24-58 50-58s48 18 48 58Z') +
    l('M80 38c-10 18-14 38-14 58M80 38c16 18 24 38 26 58', K, 2, ' stroke-opacity=".5"') +
    f('M70 96h76c4 0 4 8 0 10-20 6-50 6-74 0Z') + ombraF('M70 96h76c4 0 4 8 0 10-20 6-50 6-74 0Z', '.25') +
    `<circle cx="80" cy="38" r="4" fill="${cc}" stroke="${K}" stroke-width="2.5"/>` +
    luce('M44 70c4-12 12-20 22-24', '.6', 4),
  'fascia': () => terra(56, 120) +
    f('M24 74v22c0 14 25 26 56 26s56-12 56-26V74Z') +
    `<ellipse cx="80" cy="74" rx="56" ry="26" fill="${cc}" stroke="${K}" stroke-width="3"/><ellipse cx="80" cy="76" rx="42" ry="17" fill="${K}" fill-opacity=".78" stroke="${K}" stroke-width="2.5"/>` +
    l('M24 86c0 14 25 26 56 26s56-12 56-26', W, 4),
  'guanti': () => terra(40) +
    f('M54 136v-22l-10-30c-4-10 0-18 8-18 6 0 8 6 10 12V42c0-6 4-10 9-10s8 4 8 10v-6c0-6 4-10 9-10s8 4 8 10v6c0-5 4-8 8-8 5 0 8 4 8 9v11c0-5 4-8 8-8 5 0 8 4 8 9v45c0 14-8 24-20 30v8Z') +
    l('M79 42v34M96 42v34M112 53v28', K, 2.5) + luce('M66 88c18-4 38-4 58 2', '.6', 4) +
    f('M52 120h60v18H52Z', K) + l('M56 128h52', W, 3),
  'guanto-portiere': () => terra(44) +
    f('M50 136v-24l-12-32c-4-12 2-20 10-20 7 0 10 6 12 12V36c0-7 5-12 11-12s10 5 10 12v-6c0-7 5-12 11-12s10 5 10 12v6c0-6 5-10 10-10 6 0 10 5 10 11v12c0-6 4-10 9-10 6 0 10 5 10 11v48c0 16-10 28-24 34v8Z') +
    f('M60 36c0-7 5-12 11-12s10 5 10 12v4H60ZM81 30c0-7 5-12 11-12s10 5 10 12v4H81ZM102 36c0-6 5-10 10-10 6 0 10 5 10 11v3h-20ZM122 49c0-6 4-10 9-10 6 0 10 5 10 11v3h-19Z', W) +
    l('M81 40v36M102 40v36M122 52v30', K, 2.5) +
    f('M46 108h82v20H46Z', K) + f('M98 110h26v16H98Z', W) + l('M50 118h40', cc, 3),
  'guantone': () => terra(48, 148) +
    f('M42 96V62c0-28 20-42 46-42h8c24 0 40 18 40 44v28c0 18-12 28-28 28H58c-9 0-16-8-16-16Z') +
    f('M42 70c-12 0-16 10-14 20 2 10 10 14 18 12l12-4c6-2 8-10 4-16-4-6-12-12-20-12Z') +
    l('M60 40c20-10 50-6 64 12', K, 2, ' stroke-opacity=".45"') + luce('M70 32c14-6 30-4 40 2', '.6', 5) +
    f('M58 120h50v22H58Z') + f('M58 126h50v10H58Z', K) + l('M64 131h38', W, 2),
  'colpitore': () => terra(46, 146) +
    f('M80 22c26 0 46 22 46 50 0 26-20 46-46 46S34 98 34 72c0-28 20-50 46-50Z') +
    `<circle cx="80" cy="68" r="20" fill="${W}" stroke="${K}" stroke-width="3"/><circle cx="80" cy="68" r="7" fill="${cc}" stroke="${K}" stroke-width="2.5"/>` +
    f('M44 108c8 22 64 22 72 0-10 8-22 10-36 10s-26-2-36-10Z', K) +
    f('M50 118c10 16 50 16 60 0l-2 12c-10 10-46 10-56 0Z', K, ' fill-opacity=".8"') +
    luce('M50 52c6-12 16-20 28-22', '.6', 5),
  'parastinchi': () => terra(48, 144) +
    f('M76 18h42c4 0 6 3 6 7v66c0 22-12 36-27 36s-27-14-27-36V25c0-4 2-7 6-7Z') + ombraF('M76 18h42c4 0 6 3 6 7v66c0 22-12 36-27 36s-27-14-27-36V25c0-4 2-7 6-7Z', '.22') +
    f('M42 30h42c4 0 6 3 6 7v66c0 22-12 36-27 36s-27-14-27-36V37c0-4 2-7 6-7Z') +
    l('M48 50h30M48 62h30M48 74h30', W, 3) + luce('M46 96c2 14 8 24 18 28', '.55', 4),
  'ginocchiera': () => terra(40, 148) +
    f('M50 20c0-4 4-6 8-6h44c4 0 8 2 8 6l6 116c0 4-4 6-8 6H52c-4 0-8-2-8-6Z') +
    f('M50 20c0-4 4-6 8-6h44c4 0 8 2 8 6v8H50ZM45 130h70v6c0 4-4 6-8 6H53c-4 0-8-2-8-6Z', W) +
    f('M52 58c0-10 10-18 28-18s28 8 28 18v38c0 14-12 22-28 22s-28-8-28-22Z', K) +
    l('M60 70h40M58 84h44M60 98h40', cc, 2.5),
  'paradenti': () => terra(54, 136) +
    f('M28 56c0 50 24 74 52 74s52-24 52-74l-20-4c0 38-14 56-32 56S48 90 48 52Z') +
    luce('M36 64c2 26 14 46 30 54', '.6', 4) + ombraF('M112 52c0 38-14 56-32 56v22c28 0 52-24 52-74Z', '.14'),
  'caschetto-boxe': () => terra(48) +
    f('M36 70c0-34 20-50 44-50s44 16 44 50v42c0 12-8 20-20 20h-8v-28c0-8-6-12-16-12s-16 4-16 12v28h-8c-12 0-20-8-20-20Z') +
    f('M52 60c0-12 12-18 28-18s28 6 28 18v24c0 4-4 8-8 8H60c-4 0-8-4-8-8Z', K) +
    f('M64 124h32v8H64Z', K) + luce('M46 48c8-12 20-18 34-18', '.6', 5) +
    l('M36 100h16M108 100h16', K, 2, ' stroke-opacity=".5"'),
  'casco-sci': () => terra(58, 132) +
    f('M22 104c0-44 26-68 58-68s58 24 58 68Z') + ombraF('M110 44c18 12 28 32 28 60h-16c0-26-6-46-12-60Z', '.16') +
    l('M62 50h14M86 48h14', K, 5) + l('M118 66c12 8 20 20 22 34', K, 4) +
    f('M20 104h120v6c0 3-2 5-5 5H25c-3 0-5-2-5-5Z', K) +
    `<ellipse cx="52" cy="112" rx="15" ry="17" fill="${K}"/>` + l('M46 106h12M45 112h14M46 118h12', '#5C626C', 2) +
    `<rect x="20" y="82" width="9" height="14" rx="2" fill="${K}"/>` + luce('M40 72c6-16 18-26 34-28', '.6', 5),
  'casco-bici': () => terra(60, 132) +
    f('M20 96c0-30 26-54 64-54 32 0 56 20 58 50 0 6-4 8-10 8H24c-3 0-4-2-4-4Z') +
    f('M44 66c10-8 20-12 30-12l-2 12c-8 0-16 2-22 6ZM84 54h18l2 12H82ZM112 56c10 4 18 10 22 18l-14 2c-4-6-8-8-12-10Z', K) +
    l('M24 92h116', W, 3) + l('M44 100l14 26 26-26', K, 3),
  'maschera-sci': () => terra(56, 124) +
    `<rect x="8" y="72" width="144" height="14" rx="3" fill="${K}"/>` + l('M14 79h20M126 79h20', cc, 3) +
    f('M26 60c0-8 6-12 14-12h80c8 0 14 4 14 12v36c0 8-6 12-14 12h-20c-6 0-10-10-20-10s-14 10-20 10H40c-8 0-14-4-14-12Z', K) +
    f('M32 62c0-6 4-8 10-8h76c6 0 10 2 10 8v32c0 6-4 8-10 8h-16c-6 0-10-10-22-10s-16 10-22 10H42c-6 0-10-2-10-8Z', cc, ' stroke="none"') +
    luce('M46 60 38 90M60 60l-8 30', '.65', 4),
  'occhialini': () => terra(56, 116) +
    l('M8 82c22-10 36-10 40-6M112 76c4-4 18-4 40 6', K, 5) +
    `<ellipse cx="60" cy="80" rx="21" ry="15" fill="${cc}" stroke="${K}" stroke-width="4"/><ellipse cx="100" cy="80" rx="21" ry="15" fill="${cc}" stroke="${K}" stroke-width="4"/>` +
    l('M80 80c0-6 0-6 0 0', K, 4) + l('M78 81q2-6 4 0', K, 3) +
    luce('M50 74l8-4M90 74l8-4', '.8', 4),
  'occhiali': () => terra(56, 118) +
    f('M26 62c4 30 26 38 44 30 6-4 8-10 10-12 2 2 4 8 10 12 18 8 40 0 44-30Z') + ombraF('M80 80c2 2 4 8 10 12 18 8 40 0 44-30H80Z', '.18') +
    l('M24 62c16-8 96-8 112 0', K, 6) + l('M24 62 10 74M136 62l14 12', K, 4) +
    luce('M40 70l8 14M52 68l8 14', '.6', 4),
  'cuffia': () => terra(56, 128) +
    f('M24 106c0-44 24-70 56-70s56 26 56 70c-16 6-36 8-56 8s-40-2-56-8Z') +
    luce('M44 72c8-16 22-26 36-28', '.6', 5) + ombraF('M136 106c0-30-12-52-30-62 14 16 20 38 20 66Z', '.14'),
  'frontale': () => terra(56, 128) +
    `<ellipse cx="80" cy="84" rx="56" ry="24" fill="none" stroke="${K}" stroke-width="13"/><ellipse cx="80" cy="84" rx="56" ry="24" fill="none" stroke="${cc}" stroke-width="8"/>` +
    `<rect x="56" y="88" width="48" height="32" rx="9" fill="${K}"/><circle cx="80" cy="104" r="11" fill="${W}"/><circle cx="80" cy="104" r="5" fill="#FFE58A"/>` +
    l('M64 92h32', '#5C626C', 2),
  'pallone-calcio': palloneCalcio,
  'pallone-basket': () => terra(46) +
    `<circle cx="80" cy="76" r="56" fill="${cc}" stroke="${K}" stroke-width="3"/>` +
    l('M24 76h112M80 20v112M44 34c18 20 18 64 0 84M116 34c-18 20-18 64 0 84', K, 3) +
    ombraF('M136 76a56 56 0 0 1-56 56v-8a48 48 0 0 0 48-48Z', '.15') + luce('M42 52a46 46 0 0 1 26-26', '.6', 5),
  'pallone-volley': pallaVolley,
  'palla': () => terra(48) +
    `<circle cx="80" cy="78" r="56" fill="${cc}" stroke="${K}" stroke-width="3"/>` +
    ombraF('M136 78a56 56 0 0 1-56 56v-10a46 46 0 0 0 46-46Z', '.16') + luce('M40 56a44 44 0 0 1 26-28', '.65', 6) +
    `<circle cx="80" cy="26" r="3" fill="${K}"/>`,
  'palline': () => terra(58, 134) + [[56, 104], [104, 104], [80, 62]].map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="27" fill="${cc}" stroke="${K}" stroke-width="3"/>` +
    l(`M${x - 23} ${y - 13}c12 8 14 20 6 32M${x + 23} ${y - 13}c-12 8-14 20-6 32`, W, 3.5) +
    ombraF(`M${x + 27} ${y}a27 27 0 0 1-27 27v-6a21 21 0 0 0 21-21Z`, '.16')).join(''),
  'racchetta-tennis': () => terra(40, 146) + `<g transform="rotate(-32 80 80)">` +
    `<ellipse cx="80" cy="52" rx="32" ry="41" fill="${cc}" stroke="${K}" stroke-width="3"/><ellipse cx="80" cy="52" rx="24" ry="33" fill="${W}" stroke="${K}" stroke-width="2.5"/>` +
    `<path d="${corde(80, 52, 24, 33, 6)}" stroke="${K}" stroke-opacity=".45" stroke-width="1.3" fill="none"/>` +
    l('M66 89l9 22M94 89l-9 22', cc, 7) + l('M66 89l9 22M94 89l-9 22', K, 1.5) +
    `<rect x="73" y="108" width="14" height="44" rx="3" fill="${K}"/>` + l('M73 118l14-4M73 128l14-4M73 138l14-4', '#5C626C', 2) + `</g>`,
  'racchetta-padel': () => terra(40, 148) + `<g transform="rotate(-28 80 80)">` +
    f('M80 10c26 0 40 20 40 44 0 22-14 38-26 46l-4 8H70l-4-8C54 92 40 76 40 54c0-24 14-44 40-44Z') +
    `<g fill="${W}" stroke="none">${fori(80, 54, 34, 40, 9, 2.6)}</g>` +
    f('M68 98c4 6 8 8 12 8s8-2 12-8', 'none') +
    `<rect x="73" y="106" width="14" height="40" rx="3" fill="${K}"/>` + l('M80 146c-10 6-10 14 0 14s10-8 0-14', K, 2.5) +
    luce('M52 40c4-12 14-22 26-24', '.55', 4) + `</g>`,
  'grip': () => terra(56, 134) +
    f('M40 64h80c10 0 16 12 16 24s-6 24-16 24H40Z') +
    l('M60 64l-8 48M80 64l-8 48M100 64l-8 48M118 66l-6 44', K, 2, ' stroke-opacity=".3"') +
    `<ellipse cx="40" cy="88" rx="12" ry="24" fill="${cc}" stroke="${K}" stroke-width="3"/><ellipse cx="40" cy="88" rx="6" ry="12" fill="none" stroke="${K}" stroke-width="2"/>` +
    f('M120 112l20 16-8 6-20-16Z'),
  'matassa': () => terra(56, 126) +
    [52, 44, 36].map((rx, i) => `<ellipse cx="80" cy="84" rx="${rx}" ry="${rx * .62}" fill="none" stroke="${K}" stroke-width="9"/><ellipse cx="80" cy="84" rx="${rx}" ry="${rx * .62}" fill="none" stroke="${cc}" stroke-width="5"/>`).join('') +
    `<rect x="70" y="46" width="20" height="76" rx="2" fill="${W}" stroke="${K}" stroke-width="3"/>`,
  'bende': () => terra(60, 134) +
    f('M56 106h76c4 0 6 3 6 6v12c0 3-2 6-6 6H56Z') + f('M116 106h22v24h-22Z', K) +
    `<circle cx="56" cy="76" r="34" fill="${cc}" stroke="${K}" stroke-width="3"/><circle cx="56" cy="76" r="22" fill="none" stroke="${K}" stroke-width="2" stroke-opacity=".4"/><circle cx="56" cy="76" r="9" fill="${W}" stroke="${K}" stroke-width="2.5"/>` +
    luce('M34 62a26 26 0 0 1 14-14', '.6', 4),
  'corda': () => terra(56, 140) +
    l('M38 44c-8 50 12 88 42 88s50-38 42-88', K, 7) + l('M38 44c-8 50 12 88 42 88s50-38 42-88', cc, 4) +
    `<rect x="30" y="12" width="16" height="38" rx="7" fill="${K}" transform="rotate(-8 38 31)"/><rect x="114" y="12" width="16" height="38" rx="7" fill="${K}" transform="rotate(8 122 31)"/>` +
    l('M31 22l15-2M129 22l-15-2', cc, 3),
  'elastico': () => terra(58, 128) +
    `<ellipse cx="80" cy="82" rx="56" ry="28" fill="none" stroke="${K}" stroke-width="17"/><ellipse cx="80" cy="82" rx="56" ry="28" fill="none" stroke="${cc}" stroke-width="11"/>` +
    `<ellipse cx="88" cy="74" rx="42" ry="20" fill="none" stroke="${K}" stroke-width="13"/><ellipse cx="88" cy="74" rx="42" ry="20" fill="none" stroke="${W}" stroke-width="7"/>`,
  'sacco': () => terra(36, 148) +
    l('M80 6v8M80 14 60 30M80 14l20 16M80 14v16', K, 3) + `<circle cx="80" cy="8" r="4" fill="none" stroke="${K}" stroke-width="3"/>` +
    f('M52 30h56v10H52Z', K) +
    f('M52 40h56v90c0 8-6 12-14 12H66c-8 0-14-4-14-12Z') +
    l('M52 56h56M52 118h56', W, 4) + ombraF('M94 40h14v90c0 8-6 12-14 12Z', '.16'),
  'borsa': () => terra(60, 138) +
    f('M28 72c0-10 8-16 18-16h68c10 0 18 6 18 16v52c0 4-2 6-6 6H34c-4 0-6-2-6-6Z') +
    ombraF('M28 72c0-8 6-14 16-16v74H34c-4 0-6-2-6-6Z', '.2') +
    l('M60 56c0-22 40-22 40 0', K, 5) + l('M48 68h76', K, 2.5) + `<rect x="112" y="65" width="8" height="12" rx="2" fill="${K}"/>` +
    l('M28 114h104', W, 4),
  'zaino': () => terra(42, 144) +
    l('M70 24c0-12 20-12 20 0', K, 4) +
    f('M44 46c0-14 14-22 36-22s36 8 36 22v82c0 6-4 10-10 10H54c-6 0-10-4-10-10Z') +
    f('M54 86h52v38c0 4-2 6-6 6H60c-4 0-6-2-6-6Z') + ombraF('M54 86h52v38c0 4-2 6-6 6H60c-4 0-6-2-6-6Z', '.14') +
    l('M58 94h44M50 52c10-12 50-12 60 0', K, 2) + l('M60 114h40', W, 3),
  'sacca': () => terra(46, 144) +
    f('M38 40h84l-4 92c0 4-2 6-6 6H48c-4 0-6-2-6-6Z') + ombraF('M38 40h84l-1 12H39Z', '.2') +
    l('M38 46 28 136M122 46l10 90', K, 3) + l('M42 132 28 136M118 132l14 4', K, 3) +
    f('M50 98l60-12v8l-60 12Z', W, ' stroke="none"'),
  'borsa-racchette': () => terra(64, 136) +
    f('M18 92c0-22 14-34 36-34h66c16 0 26 12 26 28v30c0 6-4 10-10 10H28c-6 0-10-4-10-10Z') +
    ombraF('M18 92c0-22 14-34 36-34 20 0 32 12 32 34v34H28c-6 0-10-4-10-10Z', '.15') +
    l('M86 60v66', K, 2.5) + l('M66 58c0-18 34-18 34 0', K, 5) + l('M28 72c10-6 30-8 50-8', K, 2) + l('M18 110h128', W, 4),
  'marsupio': () => terra(56, 128) +
    l('M6 82c40 12 108 12 148 0', K, 7) +
    f('M44 70c0-6 4-10 10-10h52c6 0 10 4 10 10v30c0 6-4 10-10 10H54c-6 0-10-4-10-10Z') +
    l('M52 72h56', K, 2) + l('M54 100h52', W, 3) + `<rect x="136" y="74" width="12" height="14" rx="2" fill="${K}"/>`,
  'borraccia': () => terra(32, 148) +
    f('M74 4h12v10H74Z', K) + f('M66 14h28v12H66Z', K) +
    f('M60 30h40c6 0 10 4 10 10v88c0 8-6 14-14 14H64c-8 0-14-6-14-14V40c0-6 4-10 10-10Z') +
    l('M50 78c6 6 6 14 0 20M110 78c-6 6-6 14 0 20', K, 2.5) + f('M50 54h60v12H50Z', W) +
    ombraF('M94 30h6c6 0 10 4 10 10v88c0 8-6 14-14 14h-6c6-2 8-8 8-14V40c0-6-2-8-4-10Z', '.16'),
  'manubrio': () => terra(60, 128) +
    `<rect x="50" y="74" width="60" height="12" rx="3" fill="#A3A7AE" stroke="${K}" stroke-width="3"/>` +
    f('M22 56h18l8 8v32l-8 8H22l-8-8V64Z') + f('M120 56h18l8 8v32l-8 8h-18l-8-8V64Z') +
    ombraF('M22 56h18l8 8v32l-8 8H31V56Z', '.18') + ombraF('M120 56h18l8 8v32l-8 8h-9V56Z', '.18') +
    f('M46 70h6v20h-6ZM108 70h6v20h-6Z', K),
  'kettlebell': () => terra(46, 146) +
    f('M50 66V44c0-18 12-28 30-28s30 10 30 28v22H98V46c0-12-6-18-18-18s-18 6-18 18v20Z') +
    `<circle cx="80" cy="96" r="44" fill="${cc}" stroke="${K}" stroke-width="3"/>` + f('M56 134h48v6H56Z', K) +
    ombraF('M124 96a44 44 0 0 1-44 44v-8a36 36 0 0 0 36-36Z', '.18') + luce('M50 82a32 32 0 0 1 18-20', '.55', 5),
  'tappetino': () => terra(60, 138) +
    f('M36 70h82c12 0 20 14 20 30s-8 30-20 30H36Z') +
    `<ellipse cx="36" cy="100" rx="14" ry="30" fill="${cc}" stroke="${K}" stroke-width="3"/><ellipse cx="36" cy="100" rx="8" ry="19" fill="none" stroke="${K}" stroke-width="2"/><ellipse cx="36" cy="100" rx="3" ry="8" fill="none" stroke="${K}" stroke-width="2"/>` +
    f('M80 70h8v60h-8Z', K) + luce('M44 78h72', '.5', 4),
  'blocco': () => terra(54, 136) +
    f('M36 64h72v64H36Z') + f('M36 64l20-20h72l-20 20Z') + luce('M42 60l16-12h64', '.5', 3) +
    f('M108 64l20-20v64l-20 20Z') + ombraF('M108 64l20-20v64l-20 20Z', '.22') +
    l('M48 80h44M48 96h44M48 112h44', K, 1.5, ' stroke-opacity=".25"'),
  'tavoletta': () => terra(40, 148) +
    f('M44 30c0-8 8-14 18-14h36c10 0 18 6 18 14v98c0 8-8 14-16 14H60c-8 0-16-6-16-14Z') +
    `<rect x="56" y="30" width="16" height="22" rx="7" fill="${W}" stroke="${K}" stroke-width="3"/><rect x="88" y="30" width="16" height="22" rx="7" fill="${W}" stroke="${K}" stroke-width="3"/>` +
    f('M44 108l72-14v12l-72 14Z', W, ' stroke="none"') + ombraF('M100 16c10 0 16 6 16 14v98c0 8-8 14-16 14 4-4 6-8 6-14V30c0-6-2-10-6-14Z', '.16'),
  'pullbuoy': () => terra(44, 148) +
    `<ellipse cx="80" cy="46" rx="36" ry="30" fill="${cc}" stroke="${K}" stroke-width="3"/><ellipse cx="80" cy="110" rx="36" ry="30" fill="${cc}" stroke="${K}" stroke-width="3"/>` +
    f('M56 70h48v16H56Z', cc, ' stroke="none"') + l('M56 70h48M56 86h48', K, 2.5) +
    luce('M54 36a26 22 0 0 1 18-12M54 100a26 22 0 0 1 18-12', '.55', 4),
  'palette': () => terra(40, 148) +
    f('M46 28c0-8 6-14 14-14h40c8 0 14 6 14 14v84c0 16-14 28-34 28s-34-12-34-28Z') +
    `<g fill="${W}" stroke="${K}" stroke-width="2">${[[62, 34], [80, 34], [98, 34], [62, 52], [80, 52], [98, 52], [71, 112], [89, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g>` +
    `<rect x="54" y="70" width="52" height="10" rx="3" fill="${K}"/><rect x="66" y="92" width="28" height="8" rx="3" fill="${K}"/>`,
  'pinne': () => terra(46, 148) +
    f('M58 66h44l22 70c0 4-4 6-8 6H44c-4 0-8-2-8-6Z') +
    f('M58 20c0-6 4-10 10-10h24c6 0 10 4 10 10v50H58Z', K) + `<ellipse cx="80" cy="34" rx="12" ry="8" fill="${cc}" opacity=".5"/>` +
    l('M66 80 54 136M94 80l12 56', K, 2.5) + luce('M44 128h72', '.5', 3),
  'sci': () => terra(56, 146) + `<g transform="rotate(-18 80 80)">` +
    f('M58 22c0-10 4-14 7-14s7 4 7 14v124H58Z') + f('M84 22c0-10 4-14 7-14s7 4 7 14v124H84Z') +
    f('M54 76h22v22H54ZM80 76h22v22H80Z', K) + l('M65 30v108M91 30v108', W, 2, ' stroke-opacity=".6"') + `</g>` +
    l('M30 30l8 110M128 30l-8 110', K, 3) + `<circle cx="38" cy="132" r="6" fill="none" stroke="${K}" stroke-width="2.5"/><circle cx="120" cy="132" r="6" fill="none" stroke="${K}" stroke-width="2.5"/>`
};

const simboli = Object.entries(D).map(([id, fn]) =>
  `<symbol id="${id}" viewBox="0 0 160 160"><g stroke="${K}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${fn()}</g></symbol>`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- Slancio – illustrazioni originali dei prodotti (generate da _strumenti/illustrazioni.mjs). Colore del prodotto = currentColor. -->\n${simboli.join('\n')}\n</svg>\n`;
writeFileSync(new URL('../assets/img/prodotti.svg', import.meta.url), svg);
// copia per l'apertura da file:// (i browser bloccano <use> verso file esterni): caricata solo in quel caso
writeFileSync(new URL('../js/prodotti-svg.js', import.meta.url), `/* generato da _strumenti/illustrazioni.mjs: usato solo aprendo il sito come file */\nwindow.SLANCIO_SVG=${JSON.stringify(svg)};\n`);
export const ILLUSTRAZIONI = Object.keys(D);
if (process.argv[1] && process.argv[1].endsWith('illustrazioni.mjs')) console.log(`prodotti.svg: ${simboli.length} disegni, ${(svg.length / 1024).toFixed(1)} KB`);
