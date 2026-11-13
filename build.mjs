// =====================================================================
// SLANCIO – build.mjs
// Legge config.js e genera le pagine HTML vere del sito.
// Uso:  node build.mjs        (nessuna dipendenza esterna)
// =====================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
process.chdir(ROOT);
const require = createRequire(import.meta.url);
const C = require('./config.js');
const { ILLUSTRAZIONI } = await import('./_strumenti/illustrazioni.mjs');   // rigenera assets/img/prodotti.svg
const IMG = existsSync('assets/img/immagini.json') ? JSON.parse(readFileSync('assets/img/immagini.json', 'utf8')) : {};
const A = C.attivita, K = C.contatti, L = C.legale, S = C.sito;

const GSAP = [
  ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt'],
  ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 'sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d']
];

/* ---------------- utilità ---------------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = msg => `https://wa.me/${K.whatsapp}?text=${encodeURIComponent(msg)}`;
const tel = `tel:${K.telefonoLink}`;
const indirizzoCompleto = `${K.indirizzo}, ${K.cap} ${K.citta} (${K.provincia})`;
const mappaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(K.mappaRicerca)}`;
const NOME = A.nome.toUpperCase();
const nomeSport = s => s.nomeBreve || s.nome;
const nomeCorto = s => (s.nome.length > 16 && s.nomeBreve) ? s.nomeBreve : s.nome;
const pulisci = t => t.replace(/\s*\(.*?\)/g, '').trim();
const msgCategoria = (s, c) => {
  const t = pulisci(c.titolo).toLowerCase();
  const conSport = t.includes(s.nome.toLowerCase()) || t.includes(s.slug.split('-')[0]);
  return `Ciao, cerco ${t}${conSport ? '' : ` (${s.nome.toLowerCase()})`}. Mi dite cosa avete?`;
};
const msgSport = s => `Ciao ${A.nome}, ho una domanda sul reparto ${s.nome}.`;
const sportUrl = (s, rel) => `${rel}sport/${s.slug}/index.html`;
// link alla home: file esplicito (index.html) così funziona anche aprendo i file dal Mac; sulla home le ancore restano "#..."
let SU_HOME = false;
const vaiHome = (rel, hash = "") => SU_HOME ? (hash || "index.html") : `${rel}index.html${hash}`;
const catUrl = (s, c, rel) => `${rel}sport/${s.slug}/${c.slug}/index.html`;
const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const ordineGiorni = [1, 2, 3, 4, 5, 6, 0];

/* ---------------- catalogo ---------------- */
const CAT = C.catalogo, TAG = CAT.taglie;
const euro = n => Number(n).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
const dispSlug = d => d.replace(/\s+/g, '-');
const nN = (n, uno, piu) => `${n} ${n === 1 ? uno : piu}`;
// misure di un prodotto, divise per linea: [{ linea, valori }]
function gruppiTaglia(p) {
  const t = TAG[p.taglia] || TAG.nessuna;
  if (p.misure) return [{ linea: p.linea === 'entrambe' ? (t.linea || 'entrambe') : p.linea, valori: p.misure }];
  const g = t.gruppi ? t.gruppi.map(x => typeof x === 'string' ? { linea: TAG[x].linea, valori: TAG[x].valori } : x) : [{ linea: t.linea || p.linea, valori: t.valori }];
  return g.filter(x => x.valori.length);
}
const nTaglie = p => gruppiTaglia(p).reduce((a, x) => a + x.valori.length, 0);
const ARTICOLO = { Numero: 'il numero', Taglia: 'la taglia', Misura: 'la misura', Peso: 'il peso', Lunghezza: 'la lunghezza', Impugnatura: "l'impugnatura", Diametro: 'il diametro', Mondopoint: 'la misura' };
const nomeTaglia = p => (TAG[p.taglia] || {}).nome || 'Taglia';
const msgArrivo = (p, s) => `Ciao ${A.nome}, il prodotto ${p.codice} (${p.nome}) risulta esaurito: mi avvisate quando arriva?`;
const SPRITE = rel => `${rel}assets/img/prodotti.svg`;
function illustrazione(p, rel, cls = 'pc__ill', lazy = true) {
  if (p.foto && p.foto.length) return `<img class="${cls}" src="${rel}${p.foto[0]}" alt="${esc(p.nome)}" width="480" height="480"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
  return `<svg class="${cls}" viewBox="0 0 160 160" style="color:${p.colore}" aria-hidden="true" focusable="false"><use href="${SPRITE(rel)}#${p.illustrazione}"/></svg>`;
}
const badgeLinea = p => p.linea === 'bambino' ? '<span class="bimbo">Bambino</span>' : p.linea === 'entrambe' ? '<span class="bimbo bimbo--anche">Anche bambino</span>' : '';
function sceltaTaglia(p, id) {
  const g = gruppiTaglia(p), n = nTaglie(p);
  if (!n) return '';
  if (n === 1) return `<p class="pc__unica">${esc(g[0].valori[0])}</p>`;
  const opt = v => `<option>${esc(v)}</option>`;
  const corpo = g.length > 1 ? g.map(x => `<optgroup label="${x.linea === 'bambino' ? 'Bambino' : 'Adulto'}">${x.valori.map(opt).join('')}</optgroup>`).join('') : g[0].valori.map(opt).join('');
  return `<label class="sr-only" for="${id}">${esc(nomeTaglia(p))} – ${esc(p.nome)}</label><select class="pc__taglia" id="${id}" data-taglia><option value="">${esc(nomeTaglia(p))}</option>${corpo}</select>`;
}
// card prodotto: nell'HTML generato (filtri e borsa aggiunti da main.js)
function cardProdotto(p, rel, hTag = 'h3') {
  const esaurito = p.disponibilita === 'esaurito', n = nTaglie(p);
  const href = `#prodotto-${p.codice}`;
  const az = esaurito
    ? `<a class="btn btn--sec btn--sm pc__btn pc__btn--wa" href="${wa(msgArrivo(p))}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Chiedi quando arriva</a>`
    : `${sceltaTaglia(p, 't-' + p.codice)}<button class="btn btn--pri btn--sm pc__btn" type="button" data-aggiungi${n > 1 ? ' aria-disabled="true"' : ''}>${ico('sacchetto', 'ico ico--s')}Aggiungi</button>`;
  const msg = esaurito ? '' : n > 1 ? `Scegli ${ARTICOLO[nomeTaglia(p)] || 'la taglia'}` : '';
  return `<article class="pc${esaurito ? ' is-esaurito' : ''}" data-prod="${p.codice}" data-linea="${p.linea}" data-prezzo="${p.prezzo}" data-disp="${dispSlug(p.disponibilita)}">
  <a class="pc__media" href="${href}" data-apri tabindex="-1" aria-hidden="true">${illustrazione(p, rel)}${badgeLinea(p)}${p.modello3d ? '<span class="pc__3d">3D</span>' : ''}</a>
  <div class="pc__corpo">
    <p class="pc__cod">${p.codice}</p>
    <${hTag} class="pc__nome"><a href="${href}" data-apri>${esc(p.nome)}</a></${hTag}>
    <p class="pc__prezzo">${euro(p.prezzo)}</p>
    <p class="disp disp--${dispSlug(p.disponibilita)}">${esc(CAT.disponibilita[p.disponibilita])}</p>
    <div class="pc__az">${az}</div>
    <p class="pc__msg" data-msg aria-live="polite">${msg}</p>
  </div>
</article>`;
}
// fasce di prezzo della categoria (circa un terzo dei prodotti per fascia)
function fascePrezzo(prodotti) {
  const pr = prodotti.map(p => p.prezzo).sort((a, b) => a - b);
  if (pr.length < 3) return [];
  const tondo = v => v < 20 ? Math.ceil(v / 5) * 5 : v < 100 ? Math.ceil(v / 10) * 10 : Math.ceil(v / 50) * 50;
  const t1 = tondo(pr[Math.ceil(pr.length / 3) - 1]), t2 = tondo(pr[Math.ceil(pr.length * 2 / 3) - 1]);
  const f = [{ a: 0, b: t1, t: `Fino a ${t1} €` }];
  if (t2 > t1) f.push({ a: t1, b: t2, t: `${t1}–${t2} €` });
  const ult = Math.max(t1, t2);
  f.push({ a: ult, b: 99999, t: `Oltre ${ult} €` });
  return f.filter(x => pr.some(v => v > x.a && v <= x.b));
}
const fasciaTxt = f => f.map(([a, b]) => `${a.replace(/^0/, '')}–${b.replace(/^0/, '')}`).join(' · ');

/* ---------------- immagini ---------------- */
function srcset(file, rel) {
  const m = IMG[file]; if (!m) return null;
  return m.misure.map(w => `${rel}assets/img/${file}-${w}.webp ${w}w`).join(', ');
}
function img(file, alt, rel, { sizes = '100vw', cls = '', lazy = true, prio = false, stile = '' } = {}) {
  const m = IMG[file]; if (!m) return '';
  const w = m.misure[m.misure.length - 1], h = Math.round(w * m.rapporto);
  const mid = m.misure[Math.min(1, m.misure.length - 1)];
  return `<img${cls ? ` class="${cls}"` : ''} src="${rel}assets/img/${file}-${mid}.webp" srcset="${srcset(file, rel)}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async"${prio ? ' fetchpriority="high"' : ''}${stile ? ` style="${stile}"` : ''}>`;
}

/* ---------------- disegni SVG (originali) ---------------- */
// Linee di campo: viewBox 0 0 200 300, solo tratti.
const CAMPI = {
  calcio: `<rect x="12" y="12" width="176" height="276"/><path d="M12 150h176"/><circle cx="100" cy="150" r="26"/><circle cx="100" cy="150" r="1.5"/><path d="M52 12v44h96V12M78 12v16h44V12M82 56a22 22 0 0 0 36 0"/><path d="M52 288v-44h96v44M78 288v-16h44v16M82 244a22 22 0 0 1 36 0"/><path d="M12 20a8 8 0 0 0 8-8M180 12a8 8 0 0 0 8 8M12 280a8 8 0 0 1 8 8M180 288a8 8 0 0 1 8-8"/>`,
  calcetto: `<rect x="22" y="22" width="156" height="256"/><path d="M22 150h156"/><circle cx="100" cy="150" r="18"/><path d="M58 22a30 30 0 0 0 30 30h24a30 30 0 0 0 30-30"/><path d="M58 278a30 30 0 0 1 30-30h24a30 30 0 0 1 30 30"/><path d="M88 22v-6h24v6M88 278v6h24v-6"/><circle cx="100" cy="64" r="1.5"/><circle cx="100" cy="236" r="1.5"/>`,
  basket: `<rect x="16" y="16" width="168" height="268"/><path d="M16 150h168"/><circle cx="100" cy="150" r="20"/><path d="M72 16v66h56V16"/><circle cx="100" cy="82" r="20"/><path d="M30 16v30a70 70 0 0 0 140 0V16"/><path d="M88 28h24"/><circle cx="100" cy="33" r="4"/><path d="M72 284v-66h56v66"/><circle cx="100" cy="218" r="20"/><path d="M30 284v-30a70 70 0 0 1 140 0v30"/><path d="M88 272h24"/><circle cx="100" cy="267" r="4"/>`,
  pallavolo: `<rect x="32" y="30" width="136" height="240"/><path d="M18 150h164" stroke-width="3"/><path d="M32 110h136M32 190h136"/><path d="M18 146v8M182 146v8"/><path d="M32 30l-8-8M168 30l8-8M32 270l-8 8M168 270l8 8" opacity=".5"/>`,
  tennis: `<rect x="30" y="20" width="140" height="260"/><path d="M48 20v260M152 20v260"/><path d="M48 80h104M48 220h104M100 80v140"/><path d="M18 150h164" stroke-width="2.5"/><path d="M100 20v6M100 274v6"/>`,
  padel: `<rect x="35" y="20" width="130" height="260"/><path d="M28 150h144" stroke-width="2.5"/><path d="M35 60h130M35 240h130M100 60v180"/><path d="M29 14h142M29 286h142M29 14v40M171 14v40M29 286v-40M171 286v-40" stroke-width="2.5"/>`,
  ring: `<rect x="30" y="80" width="140" height="140"/><rect x="40" y="90" width="120" height="120"/><rect x="50" y="100" width="100" height="100"/><circle cx="30" cy="80" r="5"/><circle cx="170" cy="80" r="5"/><circle cx="30" cy="220" r="5"/><circle cx="170" cy="220" r="5"/><path d="M100 30v20M100 250v20M20 150h-10M190 150h-10" opacity=".5"/>`,
  sci: `<path d="M8 40L192 300"/><path d="M8 70L170 300" opacity=".45"/><path d="M60 30c90 30-70 80 30 110s-80 80 40 150" stroke-dasharray="4 5"/><path d="M95 60v-16l12 5-12 5M58 112v-16l12 5-12 5M120 168v-16l12 5-12 5M70 222v-16l12 5-12 5M140 274v-16l12 5-12 5"/>`,
  piscina: `<rect x="20" y="20" width="160" height="260"/><path d="M40 20v260M60 20v260M80 20v260M100 20v260M120 20v260M140 20v260M160 20v260" stroke-dasharray="2 4"/><path d="M50 40v220M70 40v220M90 40v220M110 40v220M130 40v220M150 40v220" opacity=".35"/><path d="M44 260h12M64 260h12M84 260h12M104 260h12M124 260h12M144 260h12"/><path d="M20 55h160M20 245h160" stroke-dasharray="6 6"/>`,
  pista: `<rect x="20" y="16" width="160" height="268" rx="80"/><rect x="30" y="26" width="140" height="248" rx="70"/><rect x="40" y="36" width="120" height="228" rx="60"/><rect x="50" y="46" width="100" height="208" rx="50"/><path d="M150 150h30" stroke-width="2.5"/><path d="M20 112h30" opacity=".5"/>`,
  fitness: `<path d="M44 150h112" stroke-width="3"/><rect x="48" y="112" width="12" height="76" rx="2"/><rect x="32" y="122" width="12" height="56" rx="2"/><rect x="140" y="112" width="12" height="76" rx="2"/><rect x="156" y="122" width="12" height="56" rx="2"/><path d="M20 240h160M20 252h160" opacity=".4"/><path d="M20 60h160" opacity=".4"/><circle cx="100" cy="150" r="70" opacity=".35"/>`,
  ciclismo: `<circle cx="55" cy="190" r="38"/><circle cx="145" cy="190" r="38"/><circle cx="55" cy="190" r="3"/><circle cx="145" cy="190" r="3"/><path d="M55 190l35-60h50l5 60M90 130l15 60H55M140 130l-6-20h14"/><path d="M84 118h18M90 130l-4-12"/><circle cx="105" cy="190" r="8"/><path d="M10 240h180" stroke-dasharray="10 8"/>`
};
const campo = (k, cls = 'campo') => `<svg class="${cls}" viewBox="0 0 200 300" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" aria-hidden="true" focusable="false">${CAMPI[k] || ''}</svg>`;

// Icone categoria (24x24, solo tratti)
const ICO = {
  scarpa: '<path d="M3 17h18v2.5H3zM3 17V8.5l4 1.2 2.6-2.7h2.2l2 3.6 4.7 1.7A2.5 2.5 0 0 1 21 14.6V17"/><path d="M9.5 10l1 1M11.5 9l1 1"/>',
  maglia: '<path d="M8.5 3 3 6l2 5 3-1.2V21h8V9.8l3 1.2 2-5-5.5-3c-.6 1.6-1.9 2.6-3.5 2.6S9.1 4.6 8.5 3z"/>',
  canotta: '<path d="M8.5 3v2.5a3.5 3.5 0 0 0 7 0V3l2.5 1.5-1 5V21H7V9.5l-1-5z"/>',
  felpa: '<path d="M9 3a3 3 0 0 0 6 0l5 3v7l-2 1v7H6v-7l-2-1V6z"/><path d="M12 6v7M9.5 16h5"/>',
  giacca: '<path d="M8.5 3 4 6v15h7.5V8M15.5 3 20 6v15h-7.5V8M8.5 3 12 8l3.5-5"/><path d="M5 12h3M16 12h3"/>',
  strati: '<rect x="6" y="4" width="12" height="4" rx="1"/><rect x="5" y="10" width="14" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/>',
  calza: '<path d="M9 3h6v9l3.2 3.2a2.8 2.8 0 0 1-4 4L9 14V3z"/><path d="M9 7h6"/>',
  guanto: '<path d="M8 21v-5l-3.2-4.3a1.6 1.6 0 0 1 2.6-1.9L9 11.5V5.2a1.5 1.5 0 0 1 3 0V10V4a1.5 1.5 0 0 1 3 0v6V5.5a1.5 1.5 0 0 1 3 0V14c0 3.5-1.5 5.5-3 7z"/>',
  parastinchi: '<path d="M8 3h8l1.2 4v7.5a5.2 5.2 0 0 1-10.4 0V7z"/><path d="M9.5 9h5M9.5 12.5h5"/>',
  pallone: '<circle cx="12" cy="12" r="9"/><path d="m12 8 3 2.2-1.1 3.5h-3.8L9 10.2z"/><path d="M12 8V3.5M15 10.2l4.2-1.5M13.9 13.7l2.6 3.7M10.1 13.7l-2.6 3.7M9 10.2 4.8 8.7"/>',
  basket: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8"/>',
  volley: '<circle cx="12" cy="12" r="9"/><path d="M12 3c2.2 3 2.2 6 0 9M12 12c3.2 1 6.2.2 8.3-2M12 12c-2 3-5 4.8-8.2 4.6"/>',
  pallina: '<circle cx="12" cy="12" r="9"/><path d="M5 5.5c3 3 3 10 0 13M19 5.5c-3 3-3 10 0 13"/>',
  racchetta: '<ellipse cx="9.5" cy="9.5" rx="5.5" ry="6.5" transform="rotate(-45 9.5 9.5)"/><path d="m13.5 13.5 7 7M7 7l5 5M5.5 10l4.5 4.5M10 5.5l4.5 4.5"/>',
  padel: '<path d="M10 2.5a6.5 6.5 0 0 1 6.5 6.5c0 2-1 3.6-2.3 4.8l-1.7 1.7-5.6 5.6-2-2 5.6-5.6V12A6.5 6.5 0 0 1 10 2.5z"/><circle cx="8.5" cy="7.5" r=".6"/><circle cx="11.5" cy="7.5" r=".6"/><circle cx="10" cy="10" r=".6"/><circle cx="13" cy="10" r=".6"/>',
  grip: '<path d="M8 3h8v18H8z"/><path d="m8 6 8 3M8 11l8 3M8 16l8 3"/>',
  borsa: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M8.5 9V6.5h7V9M3 13.5h18"/>',
  guantone: '<path d="M6.5 11.5V8A5 5 0 0 1 11.5 3h2A4.5 4.5 0 0 1 18 7.5v7a4.5 4.5 0 0 1-4.5 4.5H13v2H8v-2.4a2.2 2.2 0 0 1-1.5-2.1v-1.8"/><path d="M6.5 11.5a2.2 2.2 0 0 1 4.4 0v1.8a2.2 2.2 0 0 1-4.4 0zM8 19h5"/>',
  casco: '<path d="M4 16a8 8 0 0 1 16 0v2H4z"/><path d="M12 8v4M8 9l1.2 3M16 9l-1.2 3M4 16h16"/>',
  sacco: '<path d="M12 2v3M8 5h8v13a4 4 0 0 1-8 0z"/><path d="M8 9h8M8 15h8"/>',
  corda: '<path d="M5 3v6M19 3v6M5 9c0 13 14 13 14 0"/>',
  maschera: '<path d="M3 9h18v4.5a3.5 3.5 0 0 1-3.5 3.5H15l-2-2h-2l-2 2H6.5A3.5 3.5 0 0 1 3 13.5z"/><path d="M3 11H1M21 11h2"/>',
  scarpone: '<path d="M7 3h7l1 6 4 4v5H5V9z"/><path d="M5 18h14v3H5zM8 7h6M8 11h7"/>',
  costume: '<path d="M7 3h2l3 5 3-5h2v6l-1 4 2 8h-4l-2-4-2 4H6l2-8-1-4z"/>',
  occhialini: '<circle cx="7" cy="12" r="4"/><circle cx="17" cy="12" r="4"/><path d="M11 12h2M3 12H1M21 12h2"/>',
  telo: '<path d="M6 3h12v18H6z"/><path d="M6 7h12M9 21v-4h6v4"/>',
  tavoletta: '<path d="M6 4h12a2 2 0 0 1 2 2v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2z"/><path d="M9 8h6"/>',
  orologio: '<rect x="6.5" y="6.5" width="11" height="11" rx="3"/><path d="M9 6.5V3h6v3.5M9 17.5V21h6v-3.5M12 10v2.2l1.6 1.4"/>',
  manubrio: '<path d="M2 10v4M5 7v10M8 8v8M8 12h8M16 8v8M19 7v10M22 10v4"/>',
  tappetino: '<circle cx="7" cy="12" r="4"/><circle cx="7" cy="12" r="1.5"/><path d="M7 8h13v8H7"/>',
  borraccia: '<path d="M10 2h4v3h-4zM9 5h6l1 3v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8z"/><path d="M8 11h8"/>',
  protezione: '<path d="M7 3h10v6.5a5 5 0 0 1-10 0z"/><path d="M7 15h10v6H7zM9.5 7h5"/>',
  // icone interfaccia e "Perché Slancio"
  consiglio: '<path d="M4 5h16v11H9l-5 4z"/><path d="m8.5 10.5 2.2 2.2 4.8-4.7"/>',
  taglia: '<path d="M3 8h18v8H3z"/><path d="M6 8v3M9 8v4.5M12 8v3M15 8v4.5M18 8v3"/>',
  squadra: '<path d="M6 5 2.5 7l1.4 3.4 2.1-.8V19h6V9.6l2.1.8L15.5 7 12 5c-.4 1.1-1.5 1.8-3 1.8S6.4 6.1 6 5z"/><path d="M15 5.5 18 5l3.5 2-1.4 3.4-2.1-.8V19h-3"/>',
  ritiro: '<path d="M4 9h16l-1 11H5z"/><path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2M9 14.5l2 2 4-4"/>',
  cerca: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  telefono: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z"/><path d="M8.5 10h7M8.5 13.5h4.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  freccia: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  giu: '<path d="m6 9 6 6 6-6"/>',
  chiudi: '<path d="M6 6l12 12M18 6 6 18"/>',
  sx: '<path d="M15 5l-7 7 7 7"/>',
  carica: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v5h16v-5"/>',
  dx: '<path d="m9 5 7 7-7 7"/>',
  sacchetto: '<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
  filtri: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  righello: '<path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  piu: '<path d="M12 5v14M5 12h14"/>',
  ok: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.5L16 9.5"/>'
};
const ico = (k, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICO[k] || ICO.borsa}</svg>`;

// Marchio: due barre inclinate (lo "slancio") + nome dall'attività
const marchio = `<svg class="logo__segno" viewBox="0 0 30 24" aria-hidden="true" focusable="false"><path d="M9 1h8L9 23H1z" fill="currentColor"/><path d="M21 1h8l-8 22h-8z" fill="var(--c-cobalto-vivo)"/></svg>`;
const logo = rel => `<a class="logo" href="${vaiHome(rel)}" aria-label="${esc(A.nome)} – pagina principale">${marchio}<span class="logo__nome">${esc(NOME)}</span></a>`;

/* ---------------- titoli a righe ---------------- */
const righe = arr => arr.map(r => `<span class="m"><span>${esc(r)}</span></span>`).join(' ');

/* ---------------- parti comuni ---------------- */
function head({ titolo, descrizione, rel, percorso, preload = '', extraHead = '', base = '' }) {
  const ogImg = S.urlBase + S.ogImmagine;
  const url = S.urlBase + (percorso || '');
  return `<!doctype html>
<html lang="${S.lingua}">
<head>
<meta charset="utf-8">
${base}<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titolo)}</title>
<meta name="description" content="${esc(descrizione)}">
${S.bozza ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#0E0F12">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="${esc(A.nome)}">
<meta property="og:title" content="${esc(titolo)}">
<meta property="og:description" content="${esc(descrizione)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${rel}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${rel}fonts/barlow-condensed-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${rel}fonts/barlow-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="${rel}css/style.css">
<script>(function(d){d.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.documentElement.classList.add('anim');setTimeout(function(){if(!window.__anim)d.documentElement.classList.remove('anim')},2500)}})(document)</script>
${extraHead}</head>`;
}

function header(rel, corrente) {
  const mega = C.sport.map(s => `<li><a class="mega__voce${corrente === s.slug ? ' is-corrente' : ''}" href="${sportUrl(s, rel)}" style="--acc:${s.accento}"${corrente === s.slug ? ' aria-current="page"' : ''}><span class="mega__num">${s.numero}</span>${campo(s.campo, 'mega__campo')}<span class="mega__nome">${esc(nomeCorto(s))}</span><span class="mega__cat">${s.categorie.length} categorie</span></a></li>`).join('');
  const mobile = C.sport.map(s => `<li><a href="${sportUrl(s, rel)}" style="--acc:${s.accento}"${corrente === s.slug ? ' aria-current="page"' : ''}><span class="mm__num">${s.numero}</span><span class="mm__nome">${esc(nomeCorto(s))}</span></a></li>`).join('');
  return `<header class="hdr" data-hdr>
  <div class="hdr__bg" aria-hidden="true"></div>
  <div class="hdr__in wrap">
    ${logo(rel)}
    <nav class="hdr__nav" aria-label="Principale">
      <div class="hdr__sport">
        <button class="hdr__link hdr__btn-sport" type="button" aria-expanded="false" aria-controls="mega" data-mega-btn>Sport ${ico('giu', 'ico ico--s')}</button>
        <div class="mega" id="mega" data-mega hidden>
          <div class="wrap mega__in">
            <p class="mega__tit">12 sport, un solo negozio</p>
            <ul class="mega__griglia">${mega}</ul>
          </div>
        </div>
      </div>
      <a class="hdr__link" href="${vaiHome(rel, '#perche')}">Perché ${esc(A.nome)}</a>
      <a class="hdr__link" href="${rel}squadre/index.html"${corrente === 'squadre' ? ' aria-current="page"' : ''}>Kit Squadra</a>
      <a class="hdr__link" href="${rel}servizi/index.html"${corrente === 'servizi' ? ' aria-current="page"' : ''}>Servizi</a>
      <a class="hdr__link" href="${rel}noleggio-sci/index.html"${corrente === 'noleggio' ? ' aria-current="page"' : ''}>Noleggio</a>
      <a class="hdr__link" href="${vaiHome(rel, '#negozio')}">Il negozio</a>
    </nav>
    <div class="hdr__az">
      <button class="hdr__ico" type="button" data-cerca-apri aria-label="Cerca uno sport, una categoria o un prodotto" aria-haspopup="dialog">${ico('cerca')}</button>
      <button class="hdr__ico hdr__borsa" type="button" data-borsa-apri aria-haspopup="dialog" aria-label="Apri la borsa (${esc(C.borsa.nome)})">${ico('sacchetto')}<span class="hdr__conta" data-borsa-conta hidden>0</span></button>
      <a class="btn btn--pri btn--sm hdr__wa" href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Chiedi su WhatsApp</a>
      <button class="hdr__ico hdr__burger" type="button" aria-expanded="false" aria-controls="menu-m" aria-label="Apri il menu" data-menu-btn><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mm" id="menu-m" data-menu hidden>
  <div class="mm__in">
    <p class="mm__tit">Sport</p>
    <ul class="mm__sport">${mobile}</ul>
    <ul class="mm__link">
      <li><a href="${vaiHome(rel, '#perche')}">Perché ${esc(A.nome)}</a></li>
      <li><a href="${rel}squadre/index.html"${corrente === 'squadre' ? ' aria-current="page"' : ''}>Kit Squadra</a></li>
      <li><a href="${vaiHome(rel, '#maglia')}">Disegna la maglia</a></li>
      <li><a href="${rel}servizi/index.html"${corrente === 'servizi' ? ' aria-current="page"' : ''}>Servizi</a></li>
      <li><a href="${rel}noleggio-sci/index.html"${corrente === 'noleggio' ? ' aria-current="page"' : ''}>Noleggio</a></li>
      <li><a href="${vaiHome(rel, '#negozio')}">Il negozio</a></li>
      <li><a href="${vaiHome(rel, '#chiedi')}">Chiedi disponibilità</a></li>
    </ul>
    <div class="mm__az">
      <a class="btn btn--pri" href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">Chiedi su WhatsApp</a>
      <a class="btn btn--ghost-l" href="${tel}">Chiama ${esc(K.telefono)}</a>
    </div>
  </div>
</div>
<div class="cerca" data-cerca role="dialog" aria-modal="true" aria-label="Cerca" hidden>
  <div class="cerca__box wrap">
    <div class="cerca__riga">
      ${ico('cerca', 'ico cerca__lente')}
      <label class="sr-only" for="cerca-campo">Cerca uno sport, una categoria o un prodotto</label>
      <input id="cerca-campo" class="cerca__campo" type="search" placeholder="Cerca: scarpe da calcio, guantoni bambino, CAL-SCA-01…" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="cerca-risultati" aria-autocomplete="list">
      <button class="hdr__ico cerca__chiudi" type="button" data-cerca-chiudi aria-label="Chiudi la ricerca">${ico('chiudi')}</button>
    </div>
    <ul class="cerca__ris" id="cerca-risultati" role="listbox" aria-label="Risultati"></ul>
    <p class="cerca__vuoto" data-cerca-vuoto hidden>Nessun risultato. Prova con un altro termine o <a href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">chiedi su WhatsApp</a>.</p>
  </div>
</div>`;
}

function footer(rel) {
  const sport = C.sport.map(s => `<li><a href="${sportUrl(s, rel)}"><span>${s.numero}</span>${esc(nomeCorto(s))}</a></li>`).join('');
  // giorni consecutivi con lo stesso orario raggruppati (es. "Mar–Sab")
  const gruppi = [];
  for (const g of ordineGiorni) {
    const k = JSON.stringify(C.orari.settimana[g]);
    const ult = gruppi[gruppi.length - 1];
    if (ult && ult.k === k) ult.fine = g; else gruppi.push({ k, inizio: g, fine: g });
  }
  const orari = gruppi.map(({ inizio, fine }) => {
    const f = C.orari.settimana[inizio];
    const nomeG = giorni[inizio].slice(0, 3) + (fine !== inizio ? '–' + giorni[fine].slice(0, 3) : '');
    return `<li><span>${nomeG}</span><span>${f.length ? f.map(x => `<b>${fasciaTxt([x])}</b>`).join(' ') : 'Chiuso'}</span></li>`;
  }).join('');
  const social = K.social.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.nome)}</a></li>`).join('');
  return `<footer class="pie">
  <div class="wrap">
    <div class="pie__top">
      ${logo(rel)}
      <p class="pie__payoff">${esc(A.payoff)}</p>
    </div>
    <div class="pie__griglia">
      <div class="pie__col pie__col--sport">
        <h2 class="pie__tit">Sport</h2>
        <ul class="pie__sport">${sport}</ul>
      </div>
      <div class="pie__col">
        <h2 class="pie__tit">Negozio</h2>
        <address>${esc(K.indirizzo)}<br>${esc(K.cap)} ${esc(K.citta)} (${esc(K.provincia)})</address>
        <ul class="pie__lista">
          <li><a href="${tel}">${esc(K.telefono)}</a></li>
          <li><a href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:${K.email}">${esc(K.email)}</a></li>
        </ul>
      </div>
      <div class="pie__col">
        <h2 class="pie__tit">Orari</h2>
        <ul class="pie__orari">${orari}</ul>
      </div>
      <div class="pie__col">
        <h2 class="pie__tit">Seguici</h2>
        <ul class="pie__lista">${social}</ul>
        <h2 class="pie__tit">Info</h2>
        <ul class="pie__lista"><li><a href="${rel}servizi/index.html">Servizi su prenotazione</a></li><li><a href="${rel}noleggio-sci/index.html">Noleggio sci e snowboard</a></li><li><a href="${rel}squadre/index.html">Crea il kit squadra</a></li><li><a href="${vaiHome(rel, '#maglia')}">Disegna la maglia</a></li><li><a href="#guida-taglie" data-guida>Guida taglie</a></li><li><a href="${rel}privacy.html">Privacy</a></li></ul>
      </div>
    </div>
    <div class="pie__legale">
      <p>${esc(L.ragioneSociale)} – P.IVA ${esc(L.partitaIva)} – Sede: ${esc(L.sedeLegale)}</p>
      <p>Sito realizzato da ${esc(S.realizzatoDa)} · <a href="${rel}privacy.html">Privacy</a></p>
      ${S.notaDemo ? `<p class="pie__demo">${esc(S.notaDemo)}</p>` : ''}
    </div>
  </div>
</footer>`;
}

function barraMobile(rel) {
  return `<nav class="barra-m" aria-label="Contatti rapidi">
  <a href="${tel}">${ico('telefono')}<span>Chiama</span></a>
  <a class="barra-m__wa" href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">${ico('chat')}<span>WhatsApp</span></a>
  <a href="${vaiHome(rel, '#negozio')}">${ico('pin')}<span>Dove siamo</span></a>
</nav>`;
}

function scripts(rel, { gsap = true, script = [] } = {}) {
  return `<script src="${rel}config.js" defer></script>
${gsap ? GSAP.map(([u, h]) => `<script src="${u}" integrity="${h}" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>`).join('\n') + '\n' : ''}<script src="${rel}js/main.js" defer></script>${script.map(s => `\n<script src="${rel}${s}" defer></script>`).join('')}`;
}

function jsonLd() {
  const giorniEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const spec = [];
  for (const g of ordineGiorni) for (const [a, b] of C.orari.settimana[g]) spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: giorniEn[g], opens: a, closes: b });
  const d = {
    '@context': 'https://schema.org', '@type': 'SportingGoodsStore', name: A.nome, description: A.descrizione, slogan: A.payoff,
    url: S.urlBase, image: S.urlBase + S.ogImmagine, telephone: K.telefonoLink, email: K.email,
    address: { '@type': 'PostalAddress', streetAddress: K.indirizzo, postalCode: K.cap, addressLocality: K.citta, addressRegion: K.provincia, addressCountry: 'IT' },
    openingHoursSpecification: spec, sameAs: K.social.map(s => s.url)
  };
  return `<script type="application/ld+json">${JSON.stringify(d)}</script>\n`;
}

function pagina({ titolo, descrizione, rel, percorso, classe, stile = '', corpo, preload = '', corrente, extraHead = '', base = '', gsap = true, script = [] }) {
  SU_HOME = classe === 'p-home';
  return `${head({ titolo, descrizione, rel, percorso, preload, extraHead, base })}
<body class="${classe}" data-rel="${rel}"${stile ? ` style="${stile}"` : ''}>
<a class="salta" href="#contenuto">Vai al contenuto</a>
${header(rel, corrente)}
<main id="contenuto">
${corpo}
</main>
${footer(rel)}
${barraMobile(rel)}
${scripts(rel, { gsap, script })}
</body>
</html>
`;
}

/* ---------------- blocchi riutilizzati ---------------- */
function tessera(s, rel, { sizes = '(min-width: 1024px) 25vw, 50vw', classe = '' } = {}) {
  const f = s.tessera;
  return `<li class="tessera${classe}" style="--acc:${s.accento};--acc-ink:${s.testoAccento}">
  <a href="${sportUrl(s, rel)}" class="tessera__link">
    <span class="tessera__foto">${f ? img(f.file, f.alt, rel, { sizes }) : ''}</span>
    <span class="tessera__velo" aria-hidden="true"></span>
    ${campo(s.campo, 'tessera__campo')}
    <span class="tessera__num" aria-hidden="true">${s.numero}</span>
    <span class="tessera__testo"><span class="tessera__nome">${esc(s.nome)}</span><span class="tessera__cat">${s.categorie.length} categorie</span></span>
    <span class="tessera__freccia" aria-hidden="true">${ico('freccia')}</span>
  </a>
</li>`;
}

function badgeOrario() {
  return `<p class="badge-orario" data-orario><span class="badge-orario__punto" aria-hidden="true"></span><span data-orario-testo>Orari: ${esc(fasciaTxt(C.orari.settimana[2]))}</span></p>`;
}

function accordion(items, prefisso) {
  return items.map((it, i) => `<div class="acc">
  <h3 class="acc__h"><button class="acc__btn" type="button" id="${prefisso}-${i}-b" aria-expanded="false" aria-controls="${prefisso}-${i}"><span>${esc(it.titolo || it.d)}</span><span class="acc__segno" aria-hidden="true"></span></button></h3>
  <div class="acc__pan" id="${prefisso}-${i}" role="region" aria-labelledby="${prefisso}-${i}-b" hidden><div class="acc__testo"><p>${esc(it.testo || it.r)}</p></div></div>
</div>`).join('\n');
}

const nastroSport = () => {
  const voci = C.sport.map(s => `<span class="nastro__voce"><b>${s.numero}</b> ${esc(s.nome)}</span>`).join('<span class="nastro__sep" aria-hidden="true">/</span>');
  return `<div class="nastro nastro--sport" aria-hidden="true"><div class="nastro__traccia"><div class="nastro__gruppo">${voci}<span class="nastro__sep">/</span></div><div class="nastro__gruppo">${voci}<span class="nastro__sep">/</span></div></div></div>`;
};

/* =====================================================================
   MAGLIA PERSONALIZZATA (configuratore 3D) e KIT SQUADRE
   ===================================================================== */
const MG = C.maglia, KIT = C.kit;
const stemmaSvg = (q, cls = '') => `<svg class="${cls}" viewBox="0 0 100 120" aria-hidden="true" focusable="false">${q.stemma}</svg>`;
// icone dei motivi: piccola maglia con i colori correnti (--m1, --m2, --m3 impostati da maglia.js)
const MOTIVI_ICO = {
  tinta: '',
  strisce: '<path d="M9 0h3.4v40H9zM15.3 0h3.4v40h-3.4zM21.6 0H25v40h-3.4z" fill="var(--m2)"/>',
  bande: '<path d="M0 12h40v4H0zM0 21h40v4H0zM0 30h40v4H0z" fill="var(--m2)"/>',
  diagonale: '<path d="M2 6 10 2 34 34 26 38Z" fill="var(--m2)"/>',
  quarti: '<path d="M17 0h20v18H17zM0 18h17v22H0z" fill="var(--m2)"/>',
  sfumato: '<rect width="34" height="40" fill="url(#cfg-sf)"/>'
};
function icoMotivo(id) {
  return `<svg class="cfg__mot-ico" viewBox="0 0 34 36" aria-hidden="true" focusable="false"><clipPath id="cfg-c-${id}"><path d="M11 2q6 4 12 0l9 5-3.5 7-3-1.5V34H8.5V12.5l-3 1.5L2 7Z"/></clipPath><g clip-path="url(#cfg-c-${id})"><rect width="34" height="40" fill="var(--m1)"/>${MOTIVI_ICO[id]}<path d="M11 2q6 4 12 0" stroke="var(--m3)" stroke-width="3" fill="none"/></g></svg>`;
}
function configuratore(rel) {
  const q0 = MG.squadre.find(q => q.id === MG.iniziale.squadra) || MG.squadre[0];
  const squadre = MG.squadre.map(q => `<label class="cfg__sq"><input type="radio" name="squadra" value="${q.id}"${q === q0 ? ' checked' : ''}><span class="cfg__sq-box">${stemmaSvg(q, 'cfg__sq-stemma')}<span class="cfg__sq-nome">${esc(q.nome)}</span><span class="cfg__sq-sport">${esc(q.sport)}</span></span></label>`).join('');
  const motivi = MG.motivi.map(m => `<label class="cfg__mot"><input type="radio" name="motivo" value="${m.id}"${m.id === q0.motivo ? ' checked' : ''}><span class="cfg__mot-box">${icoMotivo(m.id)}<span>${esc(m.nome)}</span></span></label>`).join('');
  const ruoli = ['Principale', 'Secondario', 'Colletto e maniche'].map((r, i) => `<label class="cfg__ruolo"><input type="radio" name="ruolo" value="${i}"${i ? '' : ' checked'}><span class="cfg__ruolo-box"><span class="cfg__ruolo-pallino" data-ruolo-pallino style="background:${q0.colori[i]}"></span><span class="cfg__ruolo-tit">${r}</span><span class="cfg__ruolo-nome" data-ruolo-nome>${esc((MG.colori.find(c => c.hex === q0.colori[i]) || {}).nome || '')}</span></span></label>`).join('');
  const colori = MG.colori.map(c => `<label class="colore" style="--c:${c.hex}" title="${esc(c.nome)}"><input type="radio" name="colore" value="${c.hex}"${c.hex === q0.colori[0] ? ' checked' : ''}><span class="colore__pallino" aria-hidden="true"></span><span class="sr-only">${esc(c.nome)}</span></label>`).join('');
  const ant = MG.anteprima;
  return `<section class="sez cfg" id="maglia" aria-labelledby="tit-maglia" style="--m1:${q0.colori[0]};--m2:${q0.colori[1]};--m3:${q0.colori[2]}">
  <svg width="0" height="0" class="sr-only" aria-hidden="true" focusable="false"><linearGradient id="cfg-sf" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="var(--m1)"/><stop offset="1" stop-color="var(--m2)"/></linearGradient></svg>
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div>
        <p class="occhiello">Maglie personalizzate</p>
        <h2 class="tit-sez" id="tit-maglia" data-tit>${righe(['Disegna la', 'tua maglia'])}</h2>
      </div>
      <p class="sez-testa__testo">Motivo, colori, stemma, nome e numero: la maglia si aggiorna mentre scegli. Girala, poi chiedici il preventivo o portala nel kit della squadra.</p>
    </header>
    <div class="cfg__in">
      <div class="cfg__palco">
        <div class="cfg__scena" data-cfg-scena role="img" aria-labelledby="cfg-desc">
          <img class="cfg__poster" src="${rel}${ant}-960.webp" srcset="${rel}${ant}-480.webp 480w, ${rel}${ant}-960.webp 960w" sizes="(min-width: 1024px) 46vw, 100vw" width="960" height="960" alt="" loading="lazy" decoding="async">
          <p class="cfg__stato" data-cfg-stato role="status" hidden></p>
          <div class="cfg__viste" role="group" aria-label="Vista della maglia">
            <button type="button" data-vista-m="fronte" aria-pressed="true">Fronte</button><button type="button" data-vista-m="retro" aria-pressed="false">Retro</button>
          </div>
        </div>
        <p class="sr-only" id="cfg-desc" data-cfg-desc>Anteprima della maglia</p>
        <div class="cfg__sotto">
          <span class="etichetta-esempio">Anteprima indicativa</span>
          <p class="cfg__aiuto" data-cfg-aiuto>Trascina per girarla a 360°.</p>
        </div>
      </div>
      <form class="cfg__pannello" data-cfg novalidate>
        <fieldset class="cfg__gruppo">
          <legend class="cfg__leg"><span class="cfg__n">01</span>Parti da una squadra <span class="cfg__nota">Squadre e stemmi inventati</span></legend>
          <div class="cfg__squadre">${squadre}</div>
        </fieldset>
        <fieldset class="cfg__gruppo">
          <legend class="cfg__leg"><span class="cfg__n">02</span>Motivo</legend>
          <div class="cfg__motivi">${motivi}</div>
        </fieldset>
        <fieldset class="cfg__gruppo">
          <legend class="cfg__leg"><span class="cfg__n">03</span>Colori</legend>
          <div class="cfg__ruoli">${ruoli}</div>
          <div class="cfg__tav" role="radiogroup" aria-label="Tavolozza">${colori}</div>
        </fieldset>
        <fieldset class="cfg__gruppo">
          <legend class="cfg__leg"><span class="cfg__n">04</span>Stemma sul petto</legend>
          <div class="cfg__stemma">
            <p class="cfg__stemma-ora" data-stemma-ora><img alt="" width="40" height="48" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" hidden><span data-stemma-txt>${esc(q0.nome)}</span></p>
            <div class="cfg__stemma-az">
              <label class="btn btn--sec btn--sm cfg__carica">${ico('carica', 'ico ico--s')}Carica il tuo stemma<input class="sr-only" id="m-file" name="stemma-file" type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" aria-describedby="m-file-aiuto"></label>
              <button class="link-borsa link-borsa--grigio" type="button" data-stemma-togli>Senza stemma</button>
            </div>
          </div>
          <p class="campo__aiuto" id="m-file-aiuto">PNG, JPG o SVG, massimo ${MG.stemmaMaxMB} MB. Il file resta nel tuo browser: non viene inviato a nessuno.</p>
          <p class="campo__err" id="m-file-err" hidden></p>
        </fieldset>
        <fieldset class="cfg__gruppo">
          <legend class="cfg__leg"><span class="cfg__n">05</span>Nome e numero</legend>
          <div class="cfg__riga">
            <div class="campo">
              <label for="m-nome">Nome sul retro</label>
              <input id="m-nome" name="nome" type="text" maxlength="${MG.maxNome}" autocomplete="off" autocapitalize="words" spellcheck="false" value="${esc(MG.iniziale.nome)}" aria-describedby="m-nome-aiuto">
              <p class="campo__err" id="m-nome-err" hidden></p>
              <p class="campo__aiuto" id="m-nome-aiuto">Fino a ${MG.maxNome} caratteri, anche D'Angelo o De Santis</p>
            </div>
            <div class="campo campo--num">
              <label for="m-num">Numero</label>
              <input id="m-num" name="numero" type="text" inputmode="tel" maxlength="${MG.maxNumero}" autocomplete="off" value="${esc(MG.iniziale.numero)}" aria-describedby="m-num-aiuto">
              <p class="campo__err" id="m-num-err" hidden></p>
              <p class="campo__aiuto" id="m-num-aiuto">Anche 1+8</p>
            </div>
          </div>
          <label class="spunta"><input type="checkbox" name="davanti"><span>Numero piccolo anche davanti</span></label>
        </fieldset>
        <div class="cfg__fine">
          <div class="campo campo--q">
            <label for="m-q">Quantità indicativa</label>
            <input id="m-q" name="quantita" type="number" inputmode="numeric" min="1" max="999" value="${MG.quantitaIniziale}">
          </div>
          <a class="btn btn--pri cfg__wa" data-cfg-wa href="${wa('Ciao, vorrei un preventivo per una maglia personalizzata.')}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Chiedi un preventivo per questa maglia</a>
          <button class="btn btn--sec cfg__kit" type="button" data-cfg-kit>Usala nel kit squadra ${ico('freccia', 'ico ico--s')}</button>
          <p class="cfg__piede">Disegno indicativo: tessuto, font e posizioni finali li vedi in negozio prima di confermare.</p>
        </div>
      </form>
    </div>
  </div>
</section>`;
}
function fasciaSquadre(rel) {
  const sport = KIT.sport.map(s => `<li>${esc(s.nome)}</li>`).join('');
  const min = Math.min(...KIT.sport.map(s => s.pacchetti[0].prezzo));
  return `<section class="fascia-sq" aria-labelledby="tit-fsq">
  <div class="wrap fascia-sq__in">
    <div class="fascia-sq__testo">
      <p class="occhiello">Squadre e associazioni sportive</p>
      <h2 class="tit-sez" id="tit-fsq" data-tit>${righe(['Crea il kit', 'della squadra'])}</h2>
      <p class="fascia-sq__lead">Quattro passi: sport, pacchetto, squadra, riepilogo. Ricevi un preventivo indicativo e un codice richiesta; le taglie le proviamo insieme in negozio.</p>
      <a class="btn btn--pri btn--lg" href="${rel}squadre/index.html">Crea il kit squadra ${ico('freccia', 'ico ico--s')}</a>
    </div>
    <div class="fascia-sq__lato">
      <ol class="fascia-sq__passi">
        <li><b>01</b>Sport</li><li><b>02</b>Pacchetto</li><li><b>03</b>Squadra</li><li><b>04</b>Riepilogo</li>
      </ol>
      <ul class="fascia-sq__sport" aria-label="Sport disponibili">${sport}</ul>
      <p class="fascia-sq__prezzo">Da <b>${euro(min)}</b> ad atleta <span class="etichetta-esempio">Prezzi di esempio</span></p>
    </div>
  </div>
</section>`;
}
function paginaSquadre() {
  const rel = '../';
  const accento = slug => (C.sport.find(s => s.slug === slug || s.slug.startsWith(slug + '-')) || { accento: '#B9C0CC', numero: '··', campo: '' });
  const sport = KIT.sport.map(s => {
    const sp = accento(s.id);
    return `<label class="kit__sport" style="--acc:${sp.accento}"><input type="radio" name="sport" value="${s.id}" required><span class="kit__sport-box">${sp.campo ? campo(sp.campo, 'kit__sport-campo') : ''}<span class="kit__sport-nome">${esc(s.nome)}</span><span class="kit__sport-da">da ${euro(s.pacchetti[0].prezzo)}</span></span></label>`;
  }).join('');
  const pacchetti = KIT.sport.map(s => `<div class="kit__pacchetti" data-pacchetti="${s.id}" hidden>${s.pacchetti.map((p, i) => {
    const prima = i ? s.pacchetti[i - 1].include : [];
    return `<label class="kit__pac${i === 1 ? ' kit__pac--consigliato' : ''}"><input type="radio" name="pacchetto" value="${p.id}"><span class="kit__pac-box">${i === 1 ? '<span class="kit__pac-badge">Il più scelto</span>' : ''}<span class="kit__pac-nome">${esc(p.nome)}</span><span class="kit__pac-prezzo"><b>${euro(p.prezzo)}</b> ad atleta</span><ul class="kit__pac-lista">${p.include.map(x => `<li${prima.includes(x) ? '' : ' class="is-nuovo"'}>${esc(x)}</li>`).join('')}</ul></span></label>`;
  }).join('')}</div>`).join('');
  const sconti = KIT.scontiQuantita.map(x => `da ${x.da} atleti −${x.percento}%`).join(', ');
  const corpo = `
<section class="hk" data-sfondo="KIT">
  <div class="wrap hk__in">
    <nav class="briciole" aria-label="Percorso"><ol><li><a href="${rel}index.html">Home</a></li><li aria-current="page">Kit Squadra</li></ol></nav>
    <p class="occhiello">Squadre e associazioni sportive</p>
    <h1 class="hk__tit">${righe(['Crea il', 'kit squadra'])}</h1>
    <p class="hk__lead">Scegli sport e pacchetto, raccontaci la squadra: ti diamo subito un preventivo indicativo e un codice richiesta. Poi vi aspettiamo in negozio per le taglie.</p>
    <ul class="hk__punti">
      <li>${ico('squadra', 'ico ico--s')}8 sport, 3 pacchetti ciascuno</li>
      <li>${ico('taglia', 'ico ico--s')}Taglie provate in negozio</li>
      <li>${ico('maglia', 'ico ico--s')}<a href="${rel}index.html#maglia">Disegna prima la maglia</a></li>
    </ul>
  </div>
</section>

<section class="sez kit" id="kit" aria-labelledby="kit-tit">
  <div class="wrap">
    <h2 class="sr-only" id="kit-tit">Crea il tuo kit in 4 passi</h2>
    <noscript><p class="kit__nojs">Per creare il kit serve JavaScript. Puoi chiederci un preventivo su <a href="${wa('Ciao, vorrei un preventivo per il kit della mia squadra.')}">WhatsApp</a>.</p></noscript>
    <div class="kit__in" data-kit-box>
      <div class="kit__testa">
        <ol class="kit__passi" data-kit-passi>
          ${['Sport', 'Pacchetto', 'Squadra', 'Riepilogo'].map((t, i) => `<li><button type="button" data-vai="${i + 1}"${i ? ' disabled' : ' aria-current="step"'}><b>0${i + 1}</b><span>${t}</span></button></li>`).join('')}
        </ol>
        <div class="kit__barra" role="progressbar" aria-label="Avanzamento" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1" aria-valuetext="Passo 1 di 4: Sport"><span data-kit-barra></span></div>
      </div>
      <form class="kit__form" data-kit novalidate>
        <fieldset class="kit__passo" data-passo="1">
          <legend class="kit__h" tabindex="-1">Che sport fate?</legend>
          <div class="kit__sports">${sport}</div>
          <p class="campo__err" id="kit-sport-err" data-err="sport" hidden></p>
        </fieldset>
        <fieldset class="kit__passo" data-passo="2" hidden>
          <legend class="kit__h" tabindex="-1">Scegli il pacchetto <span class="kit__h-sport" data-kit-sport-nome></span></legend>
          <p class="kit__intro">Prezzi di esempio per atleta, maglia compresa. I kit bambino costano il ${KIT.scontoBambiniPercento}% in meno.</p>
          ${pacchetti}
          <p class="campo__err" id="kit-pac-err" data-err="pacchetto" hidden></p>
          <div class="capi" data-capi hidden>
            <h3 class="kit__h3">Capi e materiali</h3>
            <p class="kit__intro">Per ogni capo scegli prima il tipo, poi il materiale. Se non sei sicuro lascia vuoto: lo decidiamo insieme in negozio.</p>
            <div class="capi__lista" data-capi-lista></div>
          </div>
        </fieldset>
        <fieldset class="kit__passo" data-passo="3" hidden>
          <legend class="kit__h" tabindex="-1">La vostra squadra</legend>
          <div class="campo"><label for="k-squadra">Nome della squadra o associazione</label><input id="k-squadra" name="squadra" type="text" maxlength="60" autocomplete="organization"><p class="campo__err" id="k-squadra-err" hidden></p></div>
          <div class="kit__due">
            <div class="campo"><label for="k-adulti">Atleti adulti</label><input id="k-adulti" name="adulti" type="number" inputmode="numeric" min="0" max="${KIT.maxAtleti}" value="0"><p class="campo__err" id="k-adulti-err" hidden></p></div>
            <div class="campo"><label for="k-bambini">Atleti bambini</label><input id="k-bambini" name="bambini" type="number" inputmode="numeric" min="0" max="${KIT.maxAtleti}" value="0" aria-describedby="k-bambini-aiuto"><p class="campo__err" id="k-bambini-err" hidden></p><p class="campo__aiuto" id="k-bambini-aiuto">Fino a 14 anni</p></div>
          </div>
          <fieldset class="kit__sn" id="k-nomi" tabindex="-1"><legend>Nomi e numeri sulle maglie <span>+${euro(KIT.personalizzazioni.nomeNumero)} ad atleta</span></legend>
            <label class="kit__sc"><input type="radio" name="nomi" value="si"><span>Sì</span></label><label class="kit__sc"><input type="radio" name="nomi" value="no"><span>No</span></label>
            <p class="campo__err" id="k-nomi-err" hidden></p></fieldset>
          <fieldset class="kit__sn" id="k-stemma" tabindex="-1"><legend>Stemma della squadra <span>+${euro(KIT.personalizzazioni.stemma)} ad atleta</span></legend>
            <label class="kit__sc"><input type="radio" name="stemma" value="si"><span>Sì</span></label><label class="kit__sc"><input type="radio" name="stemma" value="no"><span>No</span></label>
            <p class="campo__err" id="k-stemma-err" hidden></p></fieldset>
          <fieldset class="kit__sn kit__graf" id="k-grafiche" tabindex="-1"><legend>Stemma, sponsor e altre grafiche</legend>
            <label class="kit__sc"><input type="radio" name="grafiche" value="carico"><span>Le carico adesso</span></label><label class="kit__sc"><input type="radio" name="grafiche" value="negozio"><span>Scegli in negozio</span></label>
            <div class="carica" data-carica hidden>
              <input class="carica__input" id="k-file" type="file" multiple accept=".png,.jpg,.jpeg,.svg,.pdf,image/png,image/jpeg,image/svg+xml,application/pdf" aria-describedby="k-file-aiuto">
              <label class="carica__zona" for="k-file" data-zona>
                ${ico('carica', 'ico carica__ico')}
                <span class="carica__tit"><b>Trascina qui i file</b> o <u>clicca per sceglierli</u></span>
                <span class="carica__info" id="k-file-aiuto">PNG, JPG, SVG o PDF · massimo ${KIT.grafiche.maxMB} MB a file · anche più file insieme</span>
              </label>
              <p class="carica__nota">${ico('ok', 'ico ico--s')}I file restano nel tuo browser: non li carichiamo su nessun server. Li alleghi tu alla richiesta.</p>
              <p class="carica__avviso" data-file-avviso role="status"></p>
              <ul class="carica__lista" data-file-lista></ul>
            </div>
            <p class="campo__aiuto kit__graf-neg" data-graf-neg hidden>Porta i file in negozio o mandaceli dopo: li scegliamo e sistemiamo insieme.</p>
            <p class="campo__err" id="k-grafiche-err" hidden></p></fieldset>
          <fieldset class="kit__maglia" id="k-maglia" tabindex="-1"><legend>La maglia</legend>
            <label class="kit__mo"><input type="radio" name="maglia" value="configuratore" data-maglia-cfg><span class="kit__mo-box"><span class="kit__mo-tit">Quella creata nel configuratore</span><span class="kit__mo-anteprima" data-maglia-ant></span><span class="kit__mo-txt" data-maglia-txt>Non hai ancora creato una maglia.</span></span></label>
            <label class="kit__mo"><input type="radio" name="maglia" value="negozio"><span class="kit__mo-box"><span class="kit__mo-tit">La scegliamo insieme in negozio</span><span class="kit__mo-txt">Ti mostriamo modelli, tessuti e colori dal vivo.</span></span></label>
            <p class="campo__err" id="k-maglia-err" hidden></p>
            <a class="link-borsa kit__mo-link" href="${rel}index.html#maglia" data-maglia-link>Crea o modifica la maglia</a>
          </fieldset>
          <p class="kit__taglie">${ico('taglia', 'ico ico--s')}${esc(KIT.testoTaglie)}</p>
        </fieldset>
        <fieldset class="kit__passo" data-passo="4" hidden>
          <legend class="kit__h" tabindex="-1">Riepilogo e preventivo indicativo</legend>
          <div class="kit__riep" data-kit-riep></div>
          <p class="etichetta-esempio kit__etic">Prezzi di esempio: il preventivo definitivo lo fa il negozio</p>
          <h3 class="kit__h3">Chi è il referente?</h3>
          <div class="kit__due">
            <div class="campo"><label for="k-ref">Referente</label><input id="k-ref" name="referente" type="text" maxlength="60" autocomplete="name"><p class="campo__err" id="k-ref-err" hidden></p></div>
            <div class="campo"><label for="k-tel">Telefono</label><input id="k-tel" name="telefono" type="tel" inputmode="tel" maxlength="30" autocomplete="tel"><p class="campo__err" id="k-tel-err" hidden></p></div>
          </div>
          <div class="campo"><label for="k-email">Email (facoltativa)</label><input id="k-email" name="email" type="email" maxlength="80" autocomplete="email"><p class="campo__err" id="k-email-err" hidden></p></div>
          <div class="campo"><label for="k-note">Note (facoltative)</label><textarea id="k-note" name="note" rows="3" maxlength="500" placeholder="Es. ci servono per l'inizio del campionato a settembre"></textarea></div>
          <p class="form__privacy">I dati inviati servono solo per rispondere alla tua richiesta. <a href="${rel}privacy.html">Leggi l'informativa privacy</a></p>
        </fieldset>
        <div class="kit__fatto" data-kit-fatto hidden></div>
        <div class="kit__nav" data-kit-nav>
          <button class="btn btn--sec" type="button" data-indietro hidden>${ico('sx', 'ico ico--s')}Indietro</button>
          <p class="kit__tot" data-kit-tot hidden></p>
          <button class="btn btn--pri" type="submit" data-avanti>Avanti ${ico('dx', 'ico ico--s')}</button>
        </div>
        <p class="kit__esito" data-kit-esito role="status"></p>
      </form>
    </div>
  </div>
</section>

<section class="sez sez--scura kit-come" aria-labelledby="tit-come">
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div><p class="occhiello">Dopo la richiesta</p><h2 class="tit-sez" id="tit-come" data-tit>${righe(['Come', 'funziona'])}</h2></div>
      <p class="sez-testa__testo">Sconti quantità di esempio: ${esc(sconti)}.</p>
    </header>
    <ol class="kit-come__passi">
      <li><b>01</b><h3>Vi richiamiamo</h3><p>Con il codice KIT controlliamo la richiesta e vi mandiamo il preventivo definitivo.</p></li>
      <li><b>02</b><h3>Prova taglie</h3><p>Portate la squadra in negozio, o i genitori per i più piccoli: proviamo tutto e segniamo le taglie.</p></li>
      <li><b>03</b><h3>Stampa e consegna</h3><p>Nomi, numeri e stemma li stampiamo noi. Vi avvisiamo quando il kit è pronto da ritirare.</p></li>
    </ol>
  </div>
</section>`;
  return pagina({
    titolo: `Crea il tuo kit – squadre e associazioni sportive a ${A.citta} | ${A.nome}`,
    descrizione: `Kit per squadre e associazioni sportive da ${A.nome}, ${A.citta}: scegli sport e pacchetto, ricevi un preventivo indicativo e un codice richiesta.`,
    rel, percorso: 'squadre/', classe: 'p-squadre', corpo, corrente: 'squadre', script: ['js/maglia.js', 'js/kit.js']
  });
}

/* =====================================================================
   SERVIZI SU PRENOTAZIONE e NOLEGGIO SCI
   ===================================================================== */
const SRV = C.servizi, NOL = C.noleggio;
const sportDa = slug => C.sport.find(s => s.slug === slug) || { accento: '#B9C0CC', campo: '' };
const mmgg = v => { const [m, g] = v.split('-').map(Number); return `${g} ${['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'][m - 1]}`; };
const stagioneTxt = () => `dal ${mmgg(NOL.stagione.da)} al ${mmgg(NOL.stagione.a)}`;
function fasciaServizi(rel) {
  // prezzo "da" solo tra i kit completi (non scarponi o casco da soli)
  const min = Math.min(...NOL.attrezzatura.filter(a => a.eta).map(a => a.prezzoGiorno));
  return `<section class="fascia-srv" aria-labelledby="tit-fsrv">
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div><p class="occhiello">Su prenotazione</p><h2 class="tit-sez" id="tit-fsrv" data-tit>${righe(['Servizi e', 'noleggio'])}</h2></div>
      <p class="sez-testa__testo">Prenoti online, ti confermiamo noi. Niente code: arrivi e il tuo turno è pronto.</p>
    </header>
    <div class="fascia-srv__griglia">
      <a class="fsrv" href="${rel}servizi/index.html">
        <span class="fsrv__n">${SRV.elenco.length} servizi</span>
        <h3 class="fsrv__tit">Servizi in negozio</h3>
        <ul class="fsrv__lista">${SRV.elenco.map(s => `<li>${esc(s.nome)}</li>`).join('')}</ul>
        <span class="fsrv__cta">Prenota un servizio ${ico('freccia', 'ico ico--s')}</span>
      </a>
      <a class="fsrv fsrv--neve" href="${rel}noleggio-sci/index.html" style="--acc:${sportDa('sci-e-snowboard').accento}">
        ${campo('sci', 'fsrv__campo')}
        <span class="fsrv__n">Stagione ${stagioneTxt()}</span>
        <h3 class="fsrv__tit">Noleggio sci e snowboard</h3>
        <p class="fsrv__testo">Kit adulto e bambino, scarponi e caschi. Guardi la disponibilità sul calendario e prenoti: ritiri il pomeriggio prima.</p>
        <span class="fsrv__prezzo">Kit da <b>${euro(min)}</b> al giorno <span class="etichetta-esempio">Prezzi di esempio</span></span>
        <span class="fsrv__cta">Prenota il noleggio ${ico('freccia', 'ico ico--s')}</span>
      </a>
    </div>
  </div>
</section>`;
}
// fascia noleggio nella pagina Sci e snowboard
function fasciaNoleggio(rel) {
  return `<section class="fascia-nol" aria-labelledby="tit-fnol">
  <div class="wrap fascia-nol__in">
    <div>
      <p class="occhiello">Stagione ${stagioneTxt()}</p>
      <h2 class="tit-sez" id="tit-fnol">Noleggio sci e snowboard</h2>
      <p class="fascia-nol__testo">Kit completi per adulti e bambini, scarponi e caschi. Guardi il calendario della disponibilità, prenoti e ritiri il pomeriggio prima di partire.</p>
    </div>
    <a class="btn btn--acc btn--lg" href="${rel}noleggio-sci/index.html">Prenota il noleggio ${ico('freccia', 'ico ico--s')}</a>
  </div>
</section>`;
}
const notaInvio = t => `<p class="pren__conferma">${ico('ok', 'ico ico--s')}${esc(t)}</p>`;
function paginaServizi() {
  const rel = '../';
  // card come le tessere sport della home: foto di sfondo, velo scuro, icona, titolo, descrizione, link
  const carte = SRV.elenco.map((s, i) => {
    const sp = sportDa(s.sport);
    return `<li class="tessera srv" style="--acc:${sp.accento};--acc-ink:${sp.testoAccento || '#0E0F12'}">
      <a class="tessera__link srv__link" href="#prenota" data-srv-scegli="${s.id}">
        <span class="tessera__foto">${s.foto ? img(s.foto.file, s.foto.alt, rel, { sizes: '(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 82vw' }) : ''}</span>
        <span class="tessera__velo srv__velo" aria-hidden="true"></span>
        <span class="srv__ico" aria-hidden="true">${ico(s.icona || 'consiglio')}</span>
        <span class="tessera__num" aria-hidden="true">0${i + 1}</span>
        <span class="srv__testi">
          <span class="srv__tit">${esc(s.nome)}</span>
          <span class="srv__testo">${esc(s.descrizione)}</span>
          <span class="srv__dati">${esc(s.durata)} · <b>${euro(s.prezzo)}</b> <span>(${esc(s.notaPrezzo)})</span></span>
          <span class="srv__cta">Scopri di più e prenota ${ico('freccia', 'ico ico--s')}</span>
        </span>
      </a>
    </li>`;
  }).join('');
  const scelte = SRV.elenco.map(s => `<label class="kit__mo"><input type="radio" name="servizio" value="${s.id}"><span class="kit__mo-box"><span class="kit__mo-tit">${esc(s.nome)}</span><span class="kit__mo-txt">${esc(s.durata)} · ${euro(s.prezzo)} (${esc(s.notaPrezzo)})</span></span></label>`).join('');
  const corpo = `
<section class="hk" data-sfondo="SERVIZI">
  <div class="wrap hk__in">
    <nav class="briciole" aria-label="Percorso"><ol><li><a href="${rel}index.html">Home</a></li><li aria-current="page">Servizi</li></ol></nav>
    <p class="occhiello">Su prenotazione</p>
    <h1 class="hk__tit">${righe(['Servizi', 'in negozio'])}</h1>
    <p class="hk__lead">Incordatura, prova racchette, analisi del passo, sciolinatura. Scegli giorno e fascia oraria: ti rispondiamo per confermare.</p>
    <ul class="hk__punti"><li>${ico('orologio', 'ico ico--s')}Mattina o pomeriggio, negli orari del negozio</li><li>${ico('chat', 'ico ico--s')}Conferma su WhatsApp</li></ul>
  </div>
</section>

<section class="sez srv-sez" aria-labelledby="tit-srv">
  <div class="parola-g" aria-hidden="true" data-parola>LAB</div>
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div>
        <p class="occhiello">${SRV.elenco.length} servizi · Il laboratorio</p>
        <h2 class="tit-sez" id="tit-srv" data-tit>${righe(['Fatti da chi', 'fa sport'])}</h2>
      </div>
      <div class="sez-testa__testo">
        <p>Racchette, scarpe, sci: li sistemiamo in negozio, con calma e con gli attrezzi giusti. Scegli il servizio e prenota il tuo turno.</p>
        <p class="etichetta-esempio srv__etic">Prezzi e durate di esempio</p>
      </div>
    </header>
    <ul class="srv__griglia">${carte}</ul>
  </div>
</section>

<section class="sez pren" id="prenota" aria-labelledby="tit-pren">
  <div class="wrap pren__in">
    <header class="pren__testa">
      <p class="occhiello">Richiesta di prenotazione</p>
      <h2 class="tit-sez" id="tit-pren">${righe(['Prenota il', 'servizio'])}</h2>
      <p class="pren__lead">Ti rispondiamo negli orari di apertura. ${esc(SRV.testoConferma)}</p>
    </header>
    <form class="pren__form" data-srv novalidate>
      <fieldset class="kit__maglia pren__scelte" id="s-servizio" tabindex="-1"><legend>Servizio</legend>${scelte}<p class="campo__err" id="s-servizio-err" hidden></p></fieldset>
      <div class="campo"><label for="s-giorno">Giorno</label><input id="s-giorno" name="giorno" type="date" aria-describedby="s-giorno-aiuto"><p class="campo__err" id="s-giorno-err" hidden></p><p class="campo__aiuto" id="s-giorno-aiuto" data-giorno-aiuto>Nei prossimi ${SRV.giorniMassimi} giorni, nei giorni di apertura.</p><div class="giorni" data-giorni role="group" aria-label="Scegli velocemente il giorno"></div></div>
      <fieldset class="kit__sn" id="s-fascia" tabindex="-1"><legend>Fascia oraria</legend><div data-fasce><p class="campo__aiuto">Scegli prima il giorno.</p></div><p class="campo__err" id="s-fascia-err" hidden></p></fieldset>
      <div class="kit__due">
        <div class="campo"><label for="s-nome">Nome</label><input id="s-nome" name="nome" type="text" maxlength="60" autocomplete="name"><p class="campo__err" id="s-nome-err" hidden></p></div>
        <div class="campo"><label for="s-tel">Telefono</label><input id="s-tel" name="telefono" type="tel" inputmode="tel" maxlength="30" autocomplete="tel"><p class="campo__err" id="s-tel-err" hidden></p></div>
      </div>
      <div class="campo"><label for="s-note">Note (facoltative)</label><textarea id="s-note" name="note" rows="3" maxlength="400" placeholder="Es. racchetta da 300 g, tensione 23 kg"></textarea></div>
      ${notaInvio(SRV.testoConferma)}
      <button class="btn btn--pri btn--lg pren__invia" type="submit">${C.modulo.modalita === 'web3forms' && C.modulo.web3formsAccessKey ? 'Invia la richiesta' : 'Invia la richiesta su WhatsApp'} ${ico('chat', 'ico ico--s')}</button>
      <p class="form__privacy">I dati inviati servono solo per rispondere alla tua richiesta. <a href="${rel}privacy.html">Leggi l'informativa privacy</a></p>
      <p class="kit__esito" data-esito role="status"></p>
    </form>
    <div class="pren__fatto" data-fatto hidden></div>
  </div>
</section>`;
  return pagina({
    titolo: `Servizi su prenotazione a ${A.citta} – incordatura, analisi del passo, sciolinatura | ${A.nome}`,
    descrizione: `Prenota un servizio da ${A.nome}, ${A.citta}: incordatura racchette, prova racchette, analisi del passo, sciolinatura e affilatura.`,
    rel, percorso: 'servizi/', classe: 'p-servizi', corpo, corrente: 'servizi', script: ['js/prenota.js']
  });
}
function paginaNoleggio() {
  const rel = '../', sci = sportDa('sci-e-snowboard');
  const tab = NOL.attrezzatura.map(a => `<li class="att"><h3 class="att__nome">${esc(a.nome)}</h3><p class="att__inc">${esc(a.include)}</p><p class="att__prezzo"><b>${euro(a.prezzoGiorno)}</b> al giorno</p></li>`).join('');
  const opz = NOL.attrezzatura.map(a => `<option value="${a.id}">${esc(a.nome)}</option>`).join('');
  const corpo = `
<section class="hk" data-sfondo="NEVE" style="--acc:${sci.accento}">
  <div class="wrap hk__in">
    <nav class="briciole" aria-label="Percorso"><ol><li><a href="${rel}index.html">Home</a></li><li><a href="${sportUrl(sci, rel)}">${esc(sci.nome)}</a></li><li aria-current="page">Noleggio</li></ol></nav>
    <p class="occhiello">Stagione ${stagioneTxt()}</p>
    <h1 class="hk__tit">${righe(['Noleggio', 'sci e snowboard'])}</h1>
    <p class="hk__lead">Scegli i giorni, guarda la disponibilità e indica per ogni persona kit, altezza, numero di scarpa e livello. Le regolazioni le facciamo noi in negozio.</p>
    <ul class="hk__punti"><li>${ico('ritiro', 'ico ico--s')}Ritiro il pomeriggio prima (${NOL.ritiro.dalle.replace(/^0/, '')}–${NOL.ritiro.alle})</li><li>${ico('orologio', 'ico ico--s')}Riconsegna entro le ${NOL.restituzione.entro} del primo giorno di apertura dopo l'ultimo</li></ul>
  </div>
</section>

<section class="sez att-sez" aria-labelledby="tit-att">
  <div class="wrap">
    <header class="sez-testa sez-testa--riga"><div><p class="occhiello">Attrezzatura</p><h2 class="tit-sez" id="tit-att">${righe(['Cosa', 'noleggiamo'])}</h2></div><p class="etichetta-esempio">Prezzi di esempio</p></header>
    <ul class="att__griglia">${tab}</ul>
  </div>
</section>

<section class="sez pren nol" id="prenota" aria-labelledby="tit-nol">
  <div class="wrap">
    <header class="pren__testa">
      <p class="occhiello">Richiesta di noleggio</p>
      <h2 class="tit-sez" id="tit-nol">${righe(['Prenota il', 'noleggio'])}</h2>
    </header>
    <form class="nol__form" data-nol novalidate>
      <div class="nol__in">
        <div class="nol__cal-box">
          <div class="nol__cal-testa">
            <h3 class="kit__h3">1 · I giorni</h3>
            <p class="etichetta-esempio nol__etic">Disponibilità di esempio</p>
          </div>
          <div class="campo"><label for="n-mostra">Mostra la disponibilità di</label><select id="n-mostra" data-mostra>${opz}</select></div>
          <div class="cal" data-cal></div>
          <ul class="cal__legenda" aria-label="Legenda"><li><i class="is-ok"></i>Disponibile</li><li><i class="is-pochi"></i>Pochi pezzi</li><li><i class="is-esaurito"></i>Esaurito</li></ul>
          <div class="kit__due">
            <div class="campo"><label for="n-da">Dal</label><input id="n-da" name="da" type="date"><p class="campo__err" id="n-da-err" hidden></p></div>
            <div class="campo"><label for="n-a">Al (compreso)</label><input id="n-a" name="a" type="date"><p class="campo__err" id="n-a-err" hidden></p></div>
          </div>
          <p class="nol__orari" data-orari></p>
        </div>
        <div class="nol__dx">
          <h3 class="kit__h3">2 · Chi scia</h3>
          <div data-persone></div>
          <button class="btn btn--sec btn--sm" type="button" data-persona-piu>${ico('piu', 'ico ico--s')}Aggiungi una persona</button>
          <p class="campo__aiuto nol__peso">Non serve il peso: altezza, numero di scarpa e livello bastano per preparare l'attrezzatura. Le regolazioni le facciamo in negozio.</p>
          <div class="nol__disp" data-disp role="status" aria-live="polite"></div>
          <h3 class="kit__h3">3 · Riepilogo</h3>
          <div class="kit__riep" data-riep><div class="kit__riga"><span>Scegli i giorni e le persone</span><b></b></div></div>
          <p class="etichetta-esempio kit__etic">Totale di esempio: il prezzo finale lo conferma il negozio</p>
          <div class="kit__due">
            <div class="campo"><label for="n-nome">Nome</label><input id="n-nome" name="nome" type="text" maxlength="60" autocomplete="name"><p class="campo__err" id="n-nome-err" hidden></p></div>
            <div class="campo"><label for="n-tel">Telefono</label><input id="n-tel" name="telefono" type="tel" inputmode="tel" maxlength="30" autocomplete="tel"><p class="campo__err" id="n-tel-err" hidden></p></div>
          </div>
          <div class="campo"><label for="n-note">Note (facoltative)</label><textarea id="n-note" name="note" rows="3" maxlength="400" placeholder="Es. prima volta sulla neve per il bambino"></textarea></div>
          ${notaInvio(NOL.testoConferma)}
          <button class="btn btn--pri btn--lg pren__invia" type="submit">${C.modulo.modalita === 'web3forms' && C.modulo.web3formsAccessKey ? 'Invia la richiesta' : 'Invia la richiesta su WhatsApp'} ${ico('chat', 'ico ico--s')}</button>
          <p class="form__privacy">I dati inviati servono solo per rispondere alla tua richiesta. <a href="${rel}privacy.html">Leggi l'informativa privacy</a></p>
          <p class="kit__esito" data-esito role="status"></p>
        </div>
      </div>
    </form>
    <div class="pren__fatto" data-fatto hidden></div>
  </div>
</section>`;
  return pagina({
    titolo: `Noleggio sci e snowboard a ${A.citta} – kit adulto e bambino | ${A.nome}`,
    descrizione: `Noleggio sci e snowboard da ${A.nome}, ${A.citta}: kit adulto e bambino, scarponi e caschi. Calendario della disponibilità e prenotazione online.`,
    rel, percorso: 'noleggio-sci/', classe: 'p-noleggio', stile: `--acc:${sci.accento};--acc-ink:${sci.testoAccento}`, corpo, corrente: 'noleggio', script: ['js/prenota.js']
  });
}

/* =====================================================================
   HOME
   ===================================================================== */
function home() {
  const rel = '';
  const H = C.home, V = H.video;
  const tessere = C.sport.map((s, i) => tessera(s, rel, { classe: i >= 6 ? ' tessera--extra' : '' })).join('\n');
  const punti = H.punti.map((p, i) => `<li class="punto" data-a style="--i:${i}"><span class="punto__ico">${ico(p.icona)}</span><h3 class="punto__tit">${esc(p.titolo)}</h3><p>${esc(p.testo)}</p></li>`).join('');
  const numeri = H.numeriEsempio.map(n => `<li class="numero"><span class="numero__val"><span data-conta="${n.valore}">${n.valore}</span>${n.suffisso ? `<span class="numero__suf">${esc(n.suffisso)}</span>` : ''}</span><span class="numero__etic">${esc(n.etichetta)}</span></li>`).join('');
  const marchi = C.marchi.map(m => `<span class="nastro__voce">${esc(m)}</span>`).join('<span class="nastro__sep" aria-hidden="true">·</span>');
  const orari = ordineGiorni.map(g => `<tr data-giorno="${g}"><th scope="row">${giorni[g]}</th><td>${C.orari.settimana[g].length ? fasciaTxt(C.orari.settimana[g]) : 'Chiuso'}</td></tr>`).join('');
  const opzioni = C.sport.map(s => `<option value="${esc(s.nome)}">${esc(s.nome)}</option>`).join('');
  const w3 = C.modulo.modalita === 'web3forms';

  const preload = `<link rel="preload" as="image" href="${V.poster}-m-720.webp" imagesrcset="${V.poster}-m-720.webp 720w, ${V.poster}-m-1080.webp 1080w" imagesizes="100vw" media="(max-width: 767px) and (orientation: portrait)" fetchpriority="high">
<link rel="preload" as="image" href="${V.poster}-1280.webp" imagesrcset="${V.poster}-1280.webp 1280w, ${V.poster}-1920.webp 1920w" imagesizes="100vw" media="(min-width: 768px), (orientation: landscape)" fetchpriority="high">
`;
  // loop della hero: sport 01 con il video attuale, poi gli altri sport (video se c'è, altrimenti foto con zoom lento).
  // Le foto degli sport dopo il primo hanno solo data-src: le carica main.js (quella in corso e la successiva).
  const P = 'assets/img/';
  const diapo = C.sport.slice(1).map((s, i) => {
    const f = s.hero.file, pos = s.hero.posizione || '50% 50%';
    return `<div class="hero__slide${s.video ? '' : ' hero__slide--foto'}" data-slide="${i + 1}" data-nome="${esc(s.nome)}" data-num="${s.numero}" data-url="${sportUrl(s, rel)}" data-acc="${s.accento}" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px) and (orientation: portrait)" data-srcset="${P}${f}-m-720.webp 720w, ${P}${f}-m-1080.webp 1080w" sizes="100vw">
        <img class="hero__foto" data-src="${P}${f}-1280.webp" data-srcset="${P}${f}-1280.webp 1280w, ${P}${f}-1920.webp 1920w" sizes="100vw" width="1920" height="1080" alt="" decoding="async" style="object-position:${pos}">
      </picture>${s.video ? `
      <video class="hero__video" muted loop playsinline preload="none" tabindex="-1" data-video-d="${s.video.computer}" data-video-m="${s.video.telefono}"></video>` : ''}
    </div>`;
  }).join('\n    ');
  const s0 = C.sport[0], HL = H.heroLoop || {};
  const corpo = `
<section class="hero" data-hero data-hero-loop data-durata="${HL.durata || 6.2}" data-dissolvenza="${HL.dissolvenza || 1.2}">
  <div class="hero__media" data-parallax>
    <div class="hero__slide is-attiva" data-slide="0" data-nome="${esc(s0.nome)}" data-num="${s0.numero}" data-url="${sportUrl(s0, rel)}" data-acc="${s0.accento}">
      <picture>
        <source media="(max-width: 767px) and (orientation: portrait)" srcset="${V.poster}-m-720.webp 720w, ${V.poster}-m-1080.webp 1080w" sizes="100vw">
        <img class="hero__poster hero__foto" src="${V.poster}-1280.webp" srcset="${V.poster}-1280.webp 1280w, ${V.poster}-1920.webp 1920w" sizes="100vw" width="1920" height="1080" alt="${esc(V.alt)}" fetchpriority="high" decoding="async">
      </picture>
      <video class="hero__video" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-video-d="${V.computer}" data-video-m="${V.telefono}"></video>
    </div>
    ${diapo}
    <div class="hero__velo" aria-hidden="true"></div>
  </div>
  <div class="hero__in wrap">
    ${badgeOrario()}
    <h1 class="hero__tit" data-tit-hero>${righe(H.heroTitolo)}</h1>
    <p class="hero__sub" data-hero-a>${esc(H.heroSottotitolo)}</p>
    <div class="hero__cta" data-hero-a>
      <a class="btn btn--pri btn--lg" href="#sport">Scegli il tuo sport ${ico('freccia', 'ico ico--s')}</a>
      <a class="btn btn--ghost-l btn--lg" href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Chiedi su WhatsApp</a>
    </div>
  </div>
  <div class="hero__tab" style="--acc:${s0.accento}" data-hero-tab>
    <a class="hero__tab-link" href="${sportUrl(s0, rel)}" data-hero-link>
      <span class="hero__tab-num" data-hero-num>${s0.numero}</span>
      <span class="hero__tab-barra" aria-hidden="true"><i data-hero-prog></i></span>
      <span class="hero__tab-tot" aria-hidden="true">${C.sport[C.sport.length - 1].numero}</span>
      <span class="hero__tab-nome"><span class="sr-only">Sport in primo piano: </span><span data-hero-nome>${esc(s0.nome)}</span></span>
      ${ico('freccia', 'ico ico--s')}
    </a>
    <button class="hero__pausa" type="button" aria-pressed="false" aria-label="Ferma lo scorrimento degli sport" data-hero-pausa hidden><span aria-hidden="true"></span></button>
  </div>
</section>

${nastroSport()}

<section class="sez sport-scelta" id="sport" aria-labelledby="tit-sport">
  <div class="parola-g" aria-hidden="true" data-parola>SPORT</div>
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div>
        <p class="occhiello">01 — 12 · Il catalogo</p>
        <h2 class="tit-sez" id="tit-sport" data-tit>${righe(['Scegli il', 'tuo sport'])}</h2>
      </div>
      <p class="sez-testa__testo">Ogni reparto ha le sue persone, le sue misure, i suoi consigli. Entra nello sport che fai e chiedi cosa c'è in negozio.</p>
    </header>
    <ul class="tessere" data-tessere>
${tessere}
    </ul>
    <div class="vedi-tutti"><button class="btn btn--sec" type="button" data-vedi-tutti aria-expanded="false">Vedi tutti gli sport <span class="vedi-tutti__n">+6</span></button></div>
  </div>
</section>

<section class="sez sez--scura perche" id="perche" aria-labelledby="tit-perche">
  <div class="parola-g parola-g--chiara" aria-hidden="true" data-parola>${esc(NOME)}</div>
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div>
        <p class="occhiello">Perché ${esc(A.nome)}</p>
        <h2 class="tit-sez" id="tit-perche" data-tit>${righe(['Ti ascoltiamo,', 'poi consigliamo.'])}</h2>
      </div>
      <p class="sez-testa__testo">Dal principiante al tesserato: prima capiamo come giochi, poi ti mostriamo poche cose giuste.</p>
    </header>
    <ul class="punti">${punti}</ul>
    <div class="numeri">
      <p class="etichetta-esempio">Numeri di esempio</p>
      <ul class="numeri__lista">${numeri}</ul>
    </div>
  </div>
</section>

${configuratore(rel)}

${fasciaSquadre(rel)}
${fasciaServizi(rel)}

<section class="marchi" aria-labelledby="tit-marchi">
  <div class="wrap marchi__testa"><h2 class="occhiello" id="tit-marchi">Marchi trattati (esempio)</h2></div>
  <div class="nastro nastro--marchi"><div class="nastro__traccia"><div class="nastro__gruppo">${marchi}<span class="nastro__sep" aria-hidden="true">·</span></div><div class="nastro__gruppo" aria-hidden="true">${marchi}<span class="nastro__sep">·</span></div></div></div>
</section>

<section class="sez negozio" id="negozio" aria-labelledby="tit-negozio">
  <div class="wrap negozio__in">
    <div class="negozio__info">
      <p class="occhiello">Il negozio · ${esc(K.citta)}</p>
      <h2 class="tit-sez" id="tit-negozio" data-tit>${righe(['Vieni a', 'provare.'])}</h2>
      ${badgeOrario()}
      <address class="negozio__indirizzo">${esc(K.indirizzo)}<br>${esc(K.cap)} ${esc(K.citta)} (${esc(K.provincia)})</address>
      <table class="orari">
        <caption class="sr-only">Orari di apertura</caption>
        <tbody>${orari}</tbody>
      </table>
      ${C.orari.nota ? `<p class="negozio__nota">${esc(C.orari.nota)}</p>` : ''}
      <div class="negozio__az">
        <a class="btn btn--pri" href="${wa(K.whatsappMessaggio)}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}WhatsApp</a>
        <a class="btn btn--sec" href="${tel}">${ico('telefono', 'ico ico--s')}${esc(K.telefono)}</a>
      </div>
    </div>
    <div class="mappa" data-mappa data-mappa-src="https://www.google.com/maps?q=${encodeURIComponent(K.mappaRicerca)}&amp;output=embed">
      <div class="mappa__area" data-mappa-area>
        <svg class="mappa__disegno" viewBox="0 0 400 300" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M0 70h400M0 150h400M0 230h400M70 0v300M170 0v300M260 0v300M340 0v300" opacity=".35"/><path d="M0 260L400 40" stroke-width="10" opacity=".22"/><path d="M0 110c80 10 120-30 200-20s120 50 200 40" stroke-width="3" opacity=".3"/><path d="M0 285h400" stroke-width="18" opacity=".12"/></g></svg>
        <div class="mappa__pin" aria-hidden="true">${ico('pin')}</div>
        <div class="mappa__testo">
          <button class="btn btn--pri btn--sm" type="button" data-mappa-btn>${ico('pin', 'ico ico--s')}Mostra la mappa</button>
          <p class="mappa__nota">Caricando la mappa, Google riceverà alcuni dati di navigazione.</p>
        </div>
      </div>
      <div class="mappa__piede">
        <p class="mappa__ind">${esc(indirizzoCompleto)}</p>
        <a class="link" href="${mappaUrl}" target="_blank" rel="noopener">Apri in Google Maps ${ico('freccia', 'ico ico--s')}</a>
      </div>
    </div>
  </div>
</section>

<section class="sez sez--carta chiedi" id="chiedi" aria-labelledby="tit-chiedi">
  <div class="wrap chiedi__in">
    <div class="chiedi__testo">
      <p class="occhiello">Chiedi disponibilità</p>
      <h2 class="tit-sez" id="tit-chiedi" data-tit>${righe(['Dicci cosa', 'cerchi.'])}</h2>
      <p>Ti rispondiamo con quello che c'è in negozio, le taglie disponibili e quando puoi passare a provarlo.</p>
      <div class="faq">
        <h3 class="faq__tit">Domande frequenti</h3>
        ${accordion(C.faq, 'faq')}
      </div>
    </div>
    <form class="modulo" data-modulo novalidate${w3 ? ' action="https://api.web3forms.com/submit" method="post"' : ''}>
      ${w3 ? `<input type="hidden" name="access_key" value="${esc(C.modulo.web3formsAccessKey)}"><input type="hidden" name="subject" value="${esc(C.modulo.oggettoEmail)}"><input type="hidden" name="from_name" value="Sito ${esc(A.nome)}"><input type="checkbox" name="botcheck" class="sr-only" tabindex="-1" autocomplete="off" aria-hidden="true">` : ''}
      <div class="campo">
        <label for="f-nome">Nome</label>
        <input id="f-nome" name="nome" type="text" autocomplete="name" required aria-describedby="f-nome-err">
        <p class="campo__err" id="f-nome-err" hidden></p>
      </div>
      <div class="campo">
        <label for="f-tel">Telefono</label>
        <input id="f-tel" name="telefono" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="f-tel-err">
        <p class="campo__err" id="f-tel-err" hidden></p>
      </div>
      <div class="campo">
        <label for="f-sport">Sport</label>
        <select id="f-sport" name="sport" required aria-describedby="f-sport-err"><option value="">Scegli uno sport</option>${opzioni}<option value="Altro">Altro</option></select>
        <p class="campo__err" id="f-sport-err" hidden></p>
      </div>
      <div class="campo">
        <label for="f-cosa">Cosa cerchi</label>
        <textarea id="f-cosa" name="richiesta" rows="4" required aria-describedby="f-cosa-err" placeholder="Es. scarpe da calcetto numero 42 per il sintetico"></textarea>
        <p class="campo__err" id="f-cosa-err" hidden></p>
      </div>
      <button class="btn btn--pri btn--lg modulo__invia" type="submit">${w3 ? 'Invia la richiesta' : `${ico('chat', 'ico ico--s')}Invia su WhatsApp`}</button>
      <p class="form__privacy">I dati inviati servono solo per rispondere alla tua richiesta. <a href="${rel}privacy.html">Leggi l'informativa privacy</a></p>
      <p class="modulo__esito" data-esito role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;

  return pagina({
    titolo: `${A.nome} – ${A.tipo} a ${A.citta}`,
    descrizione: `${A.descrizione} Chiedi disponibilità su WhatsApp.`,
    rel, percorso: '', classe: 'p-home', corpo, preload, extraHead: jsonLd(), script: ['js/maglia.js']
  });
}

/* =====================================================================
   PAGINA SPORT
   ===================================================================== */
function paginaSport(s) {
  const rel = '../../';
  const h = s.hero;
  const nCat = s.categorie.length;
  const preload = h ? `<link rel="preload" as="image" href="${rel}assets/img/${h.file}-m-720.webp" imagesrcset="${srcset(h.file + '-m', rel)}" imagesizes="100vw" media="(max-width: 767px) and (orientation: portrait)" fetchpriority="high">
<link rel="preload" as="image" href="${rel}assets/img/${h.file}-1280.webp" imagesrcset="${srcset(h.file, rel)}" imagesizes="100vw" media="(min-width: 768px), (orientation: landscape)" fetchpriority="high">
` : '';
  const heroImg = h ? `<picture>
      <source media="(max-width: 767px) and (orientation: portrait)" srcset="${srcset(h.file + '-m', rel)}" sizes="100vw">
      ${img(h.file, h.alt, rel, { sizes: '100vw', lazy: false, prio: true, cls: 'hs__img', stile: `object-position:${h.posizione || '50% 50%'}` })}
    </picture>` : '';
  const chips = s.categorie.map(c => `<li><a class="chip" href="#${c.slug}" data-chip>${esc(pulisci(c.titolo))}</a></li>`).join('');
  const cats = s.categorie.map((c, i) => {
    const url = catUrl(s, c, rel), n = c.prodotti.length, nb = c.prodotti.filter(p => p.linea !== 'adulto').length;
    const media = c.foto && IMG[c.foto.file]
      ? `<a class="cat__media" href="${url}" tabindex="-1" aria-hidden="true" data-foto>${img(c.foto.file, c.foto.alt, rel, { sizes: '(min-width: 1024px) 340px, 40vw' })}</a>`
      : `<a class="cat__media cat__media--ico" href="${url}" tabindex="-1" aria-hidden="true">${campo(s.campo, 'cat__campo')}${ico(c.icona, 'ico cat__ico')}</a>`;
    const anteprima = c.prodotti.slice(0, 4).map(p => `<li>${cardProdotto(p, rel, 'h4')}</li>`).join('');
    return `<section class="catb${i >= 5 ? ' cat--extra' : ''}" id="${c.slug}" data-cat aria-labelledby="cat-${c.slug}">
  <article class="cat">
    ${media}
    <div class="cat__corpo">
      <p class="cat__num">${String(i + 1).padStart(2, '0')}</p>
      <h3 class="cat__tit" id="cat-${c.slug}"><a href="${url}">${esc(c.titolo)}</a></h3>
      <p class="cat__desc">${esc(c.descrizione)}</p>
      <ul class="tipi" aria-label="Tipologie">${c.tipologie.map(t => `<li>${esc(t)}</li>`).join('')}${c.tipologie.length > 3 ? `<li class="tipi__piu" aria-hidden="true">+${c.tipologie.length - 3}</li>` : ''}</ul>
      <p class="cat__conta">${nN(n, 'prodotto', 'prodotti')}${nb ? ` · <span class="cat__bimbi">${nb} anche per bambini</span>` : ''}</p>
      <div class="cat__az">
        <a class="btn btn--acc btn--sm" href="${url}">Vedi tutti (${n}) ${ico('freccia', 'ico ico--s')}</a>
        <a class="link cat__wa" href="${wa(msgCategoria(s, c))}" target="_blank" rel="noopener">Chiedi disponibilità</a>
      </div>
    </div>
  </article>
  <div class="anteprima">
    <ul class="car-prod" aria-label="Anteprima ${esc(pulisci(c.titolo))}">${anteprima}${n > 4 ? `<li class="car-prod__altro"><a href="${url}"><span>Vedi tutti</span><b>${n}</b>${ico('freccia')}</a></li>` : ''}</ul>
  </div>
</section>`;
  }).join('\n');
  const altri = C.sport.filter(x => x !== s).map(x => tessera(x, rel, { sizes: '(min-width: 1024px) 22vw, 60vw' })).join('\n');

  const corpo = `
<section class="hs${s.heroLato === 'destra' ? ' hs--destra' : ''}" data-hero>
  <div class="hs__media" data-parallax>
    ${heroImg}
    <div class="hs__velo" aria-hidden="true"></div>
  </div>
  ${campo(s.campo, 'hs__campo')}
  <div class="hs__in wrap">
    <nav class="briciole" aria-label="Percorso"><ol><li><a href="${vaiHome(rel)}">Home</a></li><li><a href="${vaiHome(rel, '#sport')}">Sport</a></li><li aria-current="page">${esc(s.nome)}</li></ol></nav>
    <p class="hs__num" aria-hidden="true">${s.numero}</p>
    <h1 class="hs__tit${s.nome.length > 16 ? ' hs__tit--lungo' : ''}" data-tit-hero>${righe([s.nome])}</h1>
    <p class="hs__frase" data-hero-a>${esc(s.frase)}</p>
    <div class="hs__cta" data-hero-a>
      <a class="btn btn--acc btn--lg" href="${wa(msgSport(s))}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Chiedi su WhatsApp</a>
      <a class="btn btn--ghost-l btn--lg" href="${vaiHome(rel, '#negozio')}">${ico('pin', 'ico ico--s')}Dove siamo</a>
    </div>
  </div>
</section>

<nav class="catbar" aria-label="Categorie ${esc(s.nome)}" data-catbar>
  <div class="catbar__in wrap"><ul class="catbar__lista">${chips}</ul></div>
</nav>

<section class="sez categorie" aria-labelledby="tit-cat">
  <div class="parola-g" aria-hidden="true" data-parola>${esc(nomeSport(s).toUpperCase())}</div>
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div>
        <p class="occhiello">${s.numero} · ${esc(s.nome)} · ${nCat} categorie</p>
        <h2 class="tit-sez" id="tit-cat" data-tit>${righe(['Cosa trovi', 'in negozio'])}</h2>
      </div>
      <div class="sez-testa__testo">
        <p>Non vendiamo online: metti nella borsa quello che ti serve, ti confermiamo la disponibilità e lo ritiri in negozio.</p>
        <p class="etichetta-esempio">${esc(CAT.etichettaEsempio)}</p>
      </div>
    </header>
    <div class="cat-griglia" data-cat-griglia>
${cats}
    </div>
    ${nCat > 5 ? `<div class="vedi-tutti vedi-tutti--cat"><button class="btn btn--sec" type="button" data-vedi-cat aria-expanded="false">Vedi tutte le ${nCat} categorie</button></div>` : ''}
  </div>
</section>
${s.slug === 'sci-e-snowboard' ? fasciaNoleggio(rel) : ''}

<section class="sez sez--carta consigli" aria-labelledby="tit-consigli">
  <div class="wrap consigli__in">
    <div>
      <p class="occhiello">Come scegliere</p>
      <h2 class="tit-sez" id="tit-consigli" data-tit>${righe(['Tre consigli', 'prima di comprare'])}</h2>
      <p class="consigli__nota">Indicazioni generali: in negozio le adattiamo a te.</p>
    </div>
    <div class="consigli__acc">${accordion(s.consigli, 'consiglio')}</div>
  </div>
</section>

<section class="sez altri" aria-labelledby="tit-altri">
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div><p class="occhiello">Il catalogo</p><h2 class="tit-sez" id="tit-altri" data-tit>${righe(['Altri sport'])}</h2></div>
      <div class="carosello__frecce"><button class="hdr__ico carosello__btn" type="button" data-car="-1" aria-label="Sport precedenti">${ico('sx')}</button><button class="hdr__ico carosello__btn" type="button" data-car="1" aria-label="Sport successivi">${ico('dx')}</button></div>
    </header>
  </div>
  <ul class="tessere tessere--carosello" data-carosello tabindex="0" aria-label="Altri sport">
${altri}
  </ul>
</section>

<section class="fine">
  ${campo(s.campo, 'fine__campo')}
  <div class="wrap fine__in">
    <h2 class="fine__tit" data-tit>${righe(['Passa in negozio', 'o scrivici.'])}</h2>
    <div class="fine__info">
      ${badgeOrario()}
      <p>${esc(indirizzoCompleto)}</p>
      <div class="fine__az">
        <a class="btn btn--acc btn--lg" href="${wa(msgSport(s))}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Scrivici su WhatsApp</a>
        <a class="btn btn--ghost-l btn--lg" href="${tel}">${ico('telefono', 'ico ico--s')}Chiama</a>
        <a class="btn btn--ghost-l btn--lg" href="${vaiHome(rel, '#negozio')}">${ico('pin', 'ico ico--s')}Dove siamo</a>
      </div>
    </div>
  </div>
</section>`;

  const elenco = s.categorie.slice(0, 3).map(c => pulisci(c.titolo).toLowerCase()).join(', ');
  return pagina({
    titolo: `${s.nome} a ${A.citta} – articoli e attrezzatura | ${A.nome}`,
    descrizione: `${s.nome} da ${A.nome}, ${A.citta}: ${elenco} e altro. ${nCat} categorie, consigli per scegliere e disponibilità su WhatsApp.`,
    rel, percorso: `sport/${s.slug}/`, classe: 'p-sport', stile: `--acc:${s.accento};--acc-ink:${s.testoAccento}`,
    corpo, preload, corrente: s.slug
  });
}

/* =====================================================================
   PAGINA CATEGORIA  (sport/<sport>/<categoria>/index.html)
   ===================================================================== */
function paginaCategoria(s, c, i) {
  const rel = '../../../';
  const n = c.prodotti.length, nb = c.prodotti.filter(p => p.linea !== 'adulto').length;
  const num = String(i + 1).padStart(2, '0');
  const titolo = pulisci(c.titolo), suRichiesta = /su richiesta/i.test(c.titolo);
  const f = c.foto && IMG[c.foto.file] ? c.foto : null;
  const preload = f ? `<link rel="preload" as="image" href="${rel}assets/img/${f.file}-960.webp" imagesrcset="${srcset(f.file, rel)}" imagesizes="100vw" fetchpriority="high">\n` : '';
  const media = f
    ? img(f.file, f.alt, rel, { sizes: '100vw', lazy: false, prio: true, cls: 'hc__img' })
    : `${campo(s.campo, 'hc__campo')}${ico(c.icona, 'ico hc__ico')}`;
  const fasce = fascePrezzo(c.prodotti);
  // scheda della guida taglie adatta alla categoria (vuota se non serve, es. racchette)
  const tabG = (() => { for (const p of c.prodotti) { const g = (TAG[p.taglia] || {}).guida; if (g) return g === 'abb-bambino' && p.linea !== 'bambino' ? 'abb-adulto' : g; } return ''; })();
  const altre = s.categorie.filter(x => x !== c).map(x => {
    const k = s.categorie.indexOf(x);
    return `<li><a href="${catUrl(s, x, rel)}"><span class="altre__num">${String(k + 1).padStart(2, '0')}</span><span class="altre__tit">${esc(pulisci(x.titolo))}</span><span class="altre__n">${nN(x.prodotti.length, 'prodotto', 'prodotti')}</span>${ico('freccia', 'ico altre__fr')}</a></li>`;
  }).join('');

  const corpo = `
<section class="hc${f ? '' : ' hc--ico'}" data-hero>
  <div class="hc__media">${media}<div class="hc__velo" aria-hidden="true"></div></div>
  <div class="hc__in wrap">
    <nav class="briciole" aria-label="Percorso"><ol><li><a href="${vaiHome(rel)}">Home</a></li><li><a href="${sportUrl(s, rel)}">${esc(s.nome)}</a></li><li aria-current="page">${esc(titolo)}</li></ol></nav>
    <p class="hc__occ" data-hero-a><span class="hc__num">${s.numero}.${num}</span> ${esc(s.nome)} · ${nN(n, 'prodotto', 'prodotti')}${nb ? ` · <span class="hc__bimbi">${nb} anche per bambini</span>` : ''}</p>
    <h1 class="hc__tit${titolo.length > 22 ? ' hc__tit--lungo' : ''}" data-tit-hero>${righe([titolo])}</h1>
    <p class="hc__desc" data-hero-a>${esc(c.descrizione)}</p>
    ${suRichiesta ? '<p class="hc__nota" data-hero-a>Su richiesta: li ordiniamo per te dopo una prova in negozio.</p>' : ''}
    <ul class="tipi tipi--scuro" aria-label="Tipologie" data-hero-a>${c.tipologie.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <div class="hc__az" data-hero-a>
      <a class="btn btn--acc" href="${wa(msgCategoria(s, c))}" target="_blank" rel="noopener">${ico('chat', 'ico ico--s')}Chiedi disponibilità</a>
      ${tabG ? `<a class="btn btn--ghost-l" href="#guida-taglie" data-guida data-guida-tab="${tabG}">${ico('righello', 'ico ico--s')}Guida taglie</a>` : ''}
    </div>
  </div>
</section>

<div class="filtri" data-filtri>
  <div class="wrap filtri__in">
    <button class="filtri__apri" type="button" data-filtri-apri aria-controls="filtri-pan" aria-expanded="false">${ico('filtri', 'ico ico--s')}Filtri<span class="filtri__n" data-filtri-n hidden></span></button>
    <div class="filtri__pan" id="filtri-pan" data-filtri-pan aria-label="Filtri">
      <div class="filtri__velo" data-filtri-chiudi></div>
      <div class="filtri__box" tabindex="-1">
        <div class="filtri__testa"><p class="filtri__tit">Filtri</p><button class="hdr__ico filtri__x" type="button" data-filtri-chiudi aria-label="Chiudi i filtri">${ico('chiudi')}</button></div>
        <fieldset class="seg">
          <legend class="seg__leg">Per chi</legend>
          <div class="seg__op">
            <label><input type="radio" name="linea" value="tutti" checked><span>Tutti</span></label>
            <label><input type="radio" name="linea" value="adulto"><span>Adulto</span></label>
            <label class="seg__bimbo"><input type="radio" name="linea" value="bambino"><span>Bambino</span></label>
          </div>
        </fieldset>
        <label class="spunta"><input type="checkbox" name="negozio"><span>Solo disponibili in negozio</span></label>
        ${fasce.length > 1 ? `<label class="filtri__campo"><span>Prezzo</span><select name="prezzo"><option value="">Tutti i prezzi</option>${fasce.map(x => `<option value="${x.a}-${x.b}">${esc(x.t)}</option>`).join('')}</select></label>` : ''}
        <div class="filtri__piede">
          <button class="btn btn--sec btn--sm" type="button" data-azzera>Azzera</button>
          <button class="btn btn--pri btn--sm" type="button" data-filtri-chiudi>Mostra&nbsp;<span data-conta-btn>${nN(n, 'prodotto', 'prodotti')}</span></button>
        </div>
      </div>
    </div>
    <label class="filtri__ordina"><span class="sr-only">Ordina i prodotti</span><select name="ordina" data-ordina><option value="consigliati">Consigliati</option><option value="su">Prezzo crescente</option><option value="giu">Prezzo decrescente</option></select></label>
    <p class="filtri__conta" aria-live="polite"><b data-n-ris>${n}</b> <span data-conta-txt>${n === 1 ? 'prodotto' : 'prodotti'}</span></p>
  </div>
</div>

<section class="catalogo" aria-labelledby="tit-prod">
  <div class="wrap">
    <div class="catalogo__testa">
      <h2 class="catalogo__tit" id="tit-prod">${esc(titolo)}: tutti i prodotti</h2>
      <p class="etichetta-esempio">${esc(CAT.etichettaEsempio)}</p>
    </div>
    <ul class="griglia-prod" data-griglia>
${c.prodotti.map((p, k) => `<li data-ord="${k}">${cardProdotto(p, rel)}</li>`).join('\n')}
    </ul>
    <div class="vuoto" data-vuoto hidden><p>Nessun prodotto con questi filtri.</p><button class="btn btn--sec btn--sm" type="button" data-azzera>Azzera i filtri</button></div>
    <p class="catalogo__nota">Non vendiamo online: metti i prodotti nella borsa, ti confermiamo la disponibilità e paghi in negozio quando ritiri. Domande? <a href="${wa(msgCategoria(s, c))}" target="_blank" rel="noopener">Scrivici su WhatsApp</a>.</p>
  </div>
</section>

<section class="sez sez--carta altre" aria-labelledby="tit-altre">
  <div class="wrap">
    <header class="sez-testa sez-testa--riga">
      <div><p class="occhiello">${s.numero} · ${esc(s.nome)}</p><h2 class="tit-sez" id="tit-altre" data-tit>${righe(['Altre categorie', `di ${nomeSport(s)}`])}</h2></div>
      <p class="sez-testa__testo">Misure tra due taglie o un regalo per un bambino? <a class="link" href="#guida-taglie" data-guida data-guida-tab="${tabG || 'scarpe'}">Apri la guida taglie</a></p>
    </header>
    <ul class="altre__lista">${altre}</ul>
    <p class="altre__az"><a class="btn btn--sec" href="${sportUrl(s, rel)}">Tutto il reparto ${esc(s.nome)} ${ico('freccia', 'ico ico--s')}</a></p>
  </div>
</section>`;

  return pagina({
    titolo: `${titolo} – ${s.nome} a ${A.citta} | ${A.nome}`,
    descrizione: `${titolo} per ${s.nome.toLowerCase()} da ${A.nome}, ${A.citta}: ${nN(n, 'prodotto', 'prodotti')} per adulti${nb ? ' e bambini' : ''}, con taglie e disponibilità. Prenoti online e ritiri in negozio.`,
    rel, percorso: `sport/${s.slug}/${c.slug}/`, classe: 'p-cat', stile: `--acc:${s.accento};--acc-ink:${s.testoAccento}`,
    corpo, preload, corrente: s.slug
  });
}

/* =====================================================================
   PRIVACY (dal modello, con i blocchi scelti da config)
   ===================================================================== */
function privacy() {
  const rel = '';
  const fonte = readFileSync('modelli/privacy-modello.html', 'utf8');
  let m = fonte.slice(fonte.indexOf('<main'), fonte.indexOf('</main>') + 7);
  const tieni = new Set(['WHATSAPP', 'GOOGLE_MAPS', 'NESSUN_COOKIE']);
  if (C.modulo.modalita === 'web3forms') tieni.add('WEB3FORMS');
  // blocchi SE / FINE
  m = m.replace(/<!-- SE: ([A-Z_0-9]+) -->([\s\S]*?)<!-- FINE: \1 -->/g, (_, nome, dentro) => tieni.has(nome) ? dentro : '');
  // campi veri del modulo
  m = m.replace(/<li><strong>Dati del modulo\.<\/strong>[^<]*<\/li>/, '<li><strong>Dati del modulo.</strong> Solo quelli che scrivete voi nel modulo "Chiedi disponibilità": nome, numero di telefono, sport e cosa cercate.</li>');
  if (C.modulo.modalita !== 'web3forms') {
    m = m.replace(/(<strong>Dati dei contatti diretti\.<\/strong> Se ci scrivete per email)/, '$1 (anche usando il modulo "Chiedi disponibilità", che prepara il messaggio e lo apre in WhatsApp)');
  }
  // PEC assente
  if (!L.pec) {
    m = m.replace(/\s*PEC <a href="mailto:\{\{PEC\}\}">\{\{PEC\}\}<\/a><br>/g, '').replace(/ \(oppure via PEC a <a href="mailto:\{\{PEC\}\}">\{\{PEC\}\}<\/a>\)/g, '');
  }
  const val = {
    RAGIONE_SOCIALE: L.ragioneSociale, NOME_ATTIVITA: A.nome, PARTITA_IVA: L.partitaIva, CODICE_FISCALE: L.codiceFiscale,
    SEDE_LEGALE: L.sedeLegale, EMAIL: L.emailPrivacy, PEC: L.pec, TELEFONO: K.telefono, TELEFONO_LINK: K.telefonoLink,
    DOMINIO: S.dominio, DATA_AGGIORNAMENTO: L.dataAggiornamento
  };
  // borsa "Prenota e ritira": dati della richiesta e memoria locale del browser
  m = m.replace(/(<li><strong>Dati dei contatti diretti\.<\/strong>[\s\S]*?<\/li>)/, `$1
        <li><strong>Richiesta "${esc(C.borsa.nome)}".</strong> Se usate la borsa e il modulo "Verifica disponibilità in negozio" ci mandate: nome, numero di telefono, giorno in cui pensate di passare, eventuali note, i prodotti scelti (codice, taglia e quantità) e il codice della richiesta (per esempio ${esc(C.borsa.prefissoCodice)}-AB7K). Li usiamo solo per verificare la disponibilità e tenere da parte i prodotti; valgono la base giuridica e i tempi di conservazione delle richieste indicati sotto.</li>`);
  m = m.replace(/(<p>Questo sito <strong>non usa cookie<\/strong>[^<]*<\/p>)/, `$1
      <p>La borsa "${esc(C.borsa.nome)}" (i prodotti che scegliete, con taglia e quantità) è salvata <strong>solo nel vostro browser</strong>, nella sua memoria locale (localStorage). È strettamente necessaria al servizio che chiedete, non è un cookie di profilazione e non ci arriva finché non inviate la richiesta. Potete cancellarla con "Svuota" nella borsa o cancellando i dati del sito dal browser.</p>`);
  // maglia personalizzata e "Crea il tuo kit" (squadre e associazioni)
  m = m.replace(/(<li><strong>Richiesta "[^"]*"\.<\/strong>[\s\S]*?<\/li>)/, `$1
        <li><strong>Richiesta "Crea il tuo kit" (squadre e associazioni).</strong> Ci mandate: nome della squadra o associazione, nome del referente, numero di telefono, email se volete, eventuali note, sport, pacchetto, numero di atleti adulti e bambini, le scelte su nomi, numeri e stemma e la descrizione della maglia (motivo, colori, nome e numero). Non chiediamo nomi, età o taglie dei singoli atleti: le taglie si definiscono in negozio. Usiamo questi dati solo per preparare il preventivo e organizzare la prova taglie; li conserviamo per il tempo della trattativa e, se il kit viene ordinato, per i tempi previsti dalle norme fiscali.</li>
        <li><strong>Prenotazione di un servizio</strong> (incordatura, prova racchette, analisi del passo, sciolinatura). Ci mandate: servizio scelto, giorno, fascia oraria, nome, numero di telefono ed eventuali note. Li usiamo solo per organizzare il servizio e rispondervi; li cancelliamo entro 12 mesi.</li>
        <li><strong>Richiesta di noleggio sci e snowboard.</strong> Ci mandate: giorni del noleggio, nome, numero di telefono, eventuali note e, per ogni persona, l'attrezzatura, se è adulto o bambino, <strong>altezza, numero di scarpa e livello</strong>. Altezza, numero di scarpa e livello servono <strong>solo per preparare e regolare l'attrezzatura</strong>: non chiediamo il peso, non li usiamo per altro e li cancelliamo a fine stagione. La disponibilità mostrata sul sito è di esempio e non usa i vostri dati.</li>
        <li><strong>Preventivo per la maglia.</strong> Il pulsante "Chiedi un preventivo per questa maglia" prepara un messaggio WhatsApp con motivo, colori, nome, numero e quantità indicativa: lo inviate voi, se volete.</li>`);
  m = m.replace(/(<p>La borsa "[^"]*"[\s\S]*?<\/p>)/, `$1
      <p>Anche la <strong>maglia personalizzata</strong> e i passi di <strong>"Crea il tuo kit"</strong> restano salvati solo nel vostro browser (localStorage), per non perdere le scelte cambiando pagina. Lo <strong>stemma che caricate</strong> nel configuratore (PNG, JPG o SVG) viene letto e mostrato solo nel vostro browser: <strong>non viene inviato</strong> né a noi né ad altri. Se volete stamparlo sulle maglie, ce lo mandate voi su WhatsApp o per email. Lo stesso vale per <strong>stemma, loghi degli sponsor e grafiche</strong> che caricate in "Crea il kit squadra" (PNG, JPG, SVG o PDF): restano nella pagina aperta nel vostro browser e nella richiesta compaiono solo i nomi dei file e la posizione scelta; i file ce li allegate voi. Potete cancellare tutto svuotando i dati del sito dalle impostazioni del browser.</p>`);
  m = m.replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => esc(val[k] ?? ''));
  m = m.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n+/g, '\n');
  m = m.replace('<main id="contenuto" class="section privacy">', '').replace('</main>', '');
  m = m.replace('<h1 class="title">', `${S.bozza ? '<p class="privacy__demo etichetta-esempio">Informativa di esempio per un progetto dimostrativo.</p>\n' : ''}<h1 class="tit-sez privacy__tit">`);
  m = m.replace(/<a class="btn" href="\.\/">Torna al sito<\/a>/, `<a class="btn btn--pri" href="index.html">Torna al sito</a>`);
  const corpo = `<section class="privacy">${m}</section>`;
  return pagina({
    titolo: `Privacy | ${A.nome}`,
    descrizione: `Informativa privacy e cookie del sito di ${A.nome}: titolare, dati raccolti, servizi esterni e diritti.`,
    rel, percorso: 'privacy.html', classe: 'p-privacy', corpo, gsap: false
  });
}

/* =====================================================================
   404
   ===================================================================== */
function pagina404() {
  const base = new URL(S.urlBase).pathname;
  const corpo = `<section class="p404">
  <div class="wrap p404__in">
    <p class="p404__num" aria-hidden="true">404</p>
    <h1 class="tit-sez">Fuorigioco.</h1>
    <p>La pagina che cerchi non c'è più o non è mai esistita. Riparti da uno sport:</p>
    <ul class="p404__sport">${C.sport.map(s => `<li><a class="chip" href="sport/${s.slug}/index.html" style="--acc:${s.accento}">${esc(s.nome)}</a></li>`).join('')}</ul>
    <p><a class="btn btn--pri" href="index.html">Torna alla home</a></p>
  </div>
</section>`;
  return pagina({
    titolo: `Pagina non trovata | ${A.nome}`, descrizione: `La pagina che cerchi non esiste. Torna alla home di ${A.nome}.`,
    rel: '', percorso: '404.html', classe: 'p-404', corpo, gsap: false,
    // <base> solo online (su GitHub Pages la 404 si vede a qualsiasi indirizzo); aprendo il file dal Mac non serve
    base: `<script>if (location.protocol !== 'file:') document.write('<base href="${base}">')</script>\n`
  });
}

/* =====================================================================
   FAVICON, SITEMAP, ROBOTS
   ===================================================================== */
function favicon() {
  const ini = esc(A.nome.trim()[0].toUpperCase());
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0E0F12"/><path d="M38 10h14L36 54H22z" fill="#1E46F0"/><text x="26" y="47" font-family="'Arial Narrow', Arial, sans-serif" font-size="40" font-weight="900" font-style="italic" fill="#F4F2ED" text-anchor="middle">${ini}</text></svg>\n`;
}

function scrivi(file, contenuto) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contenuto);
}

/* ---------------- esecuzione ---------------- */
// controllo dati del catalogo: codici unici, taglie e illustrazioni esistenti
{
  const visti = new Set();
  for (const s of C.sport) for (const c of s.categorie) for (const p of c.prodotti) {
    if (visti.has(p.codice)) throw new Error('Codice prodotto ripetuto: ' + p.codice);
    visti.add(p.codice);
    if (!TAG[p.taglia]) throw new Error(`Taglia sconosciuta "${p.taglia}" in ${p.codice}`);
    if (!(p.foto && p.foto.length) && !ILLUSTRAZIONI.includes(p.illustrazione)) throw new Error(`Illustrazione "${p.illustrazione}" mancante in ${p.codice}`);
  }
}
scrivi('index.html', home());
// rimuove pagine di sport non più presenti in config
if (existsSync('sport')) for (const d of readdirSync('sport')) if (!C.sport.some(s => s.slug === d)) rmSync(join('sport', d), { recursive: true });
let nPagCat = 0;
for (const s of C.sport) {
  scrivi(`sport/${s.slug}/index.html`, paginaSport(s));
  // pagine categoria (e pulizia delle cartelle di categorie tolte da config)
  for (const d of readdirSync(`sport/${s.slug}`, { withFileTypes: true })) if (d.isDirectory() && !s.categorie.some(c => c.slug === d.name)) rmSync(join('sport', s.slug, d.name), { recursive: true });
  s.categorie.forEach((c, i) => { scrivi(`sport/${s.slug}/${c.slug}/index.html`, paginaCategoria(s, c, i)); nPagCat++; });
}
scrivi('squadre/index.html', paginaSquadre());
scrivi('servizi/index.html', paginaServizi());
scrivi('noleggio-sci/index.html', paginaNoleggio());
scrivi('privacy.html', privacy());
scrivi('404.html', pagina404());
scrivi('assets/favicon.svg', favicon());

if (S.bozza) {
  for (const f of ['sitemap.xml', 'robots.txt']) if (existsSync(f)) rmSync(f);
} else {
  const oggi = new Date().toISOString().slice(0, 10);
  const urls = ['', 'squadre/', 'servizi/', 'noleggio-sci/',...C.sport.flatMap(s => [`sport/${s.slug}/`, ...s.categorie.map(c => `sport/${s.slug}/${c.slug}/`)]), 'privacy.html'];
  scrivi('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${S.urlBase}${u}</loc><lastmod>${oggi}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  scrivi('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${S.urlBase}sitemap.xml\n`);
}

const nIco = C.sport.reduce((a, s) => a + s.categorie.filter(c => !(c.foto && IMG[c.foto.file])).length, 0);
const nProd = C.sport.reduce((a, s) => a + s.categorie.reduce((b, c) => b + c.prodotti.length, 0), 0);
console.log(`✔ Generate ${C.sport.length + 6 + nPagCat} pagine (home, ${C.sport.length} sport, ${nPagCat} categorie, squadre, servizi, noleggio, privacy, 404) · ${nProd} prodotti · ${ILLUSTRAZIONI.length} illustrazioni · bozza=${S.bozza} · categorie con icona: ${nIco}`);
