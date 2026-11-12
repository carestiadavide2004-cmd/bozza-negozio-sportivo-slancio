/* =====================================================================
   SLANCIO – genera assets/3d/maglia.glb (modello originale, nessuna licenza esterna)
   Maglia "su manichino invisibile": busto, maniche e colletto aperti, interno visibile.
   Mappa UV pensata per la texture disegnata nel <canvas> 2048×2048 del configuratore:
     - busto:   x 0–1024 = fronte, x 1024–2048 = retro, y 0–1516 = dal collo all'orlo
     - maniche: y 1536–2000 (sinistra x 0–1024, destra x 1024–2048), polsino in fondo
     - colletto: y 2010–2040
   Uso: node _strumenti/maglia3d.mjs
   ===================================================================== */
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const UV_BUSTO = 1516 / 2048, UV_MANICA = [1536 / 2048, 2000 / 2048], UV_COLLO = [2010 / 2048, 2040 / 2048];
const SEG = 96;              // divisioni intorno al busto
const lerp = (a, b, t) => a + (b - a) * t;
const bez = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const norm3 = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
// superellisse: fronte e retro un po' più piatti, come un busto vero
const sup = (c, n) => Math.sign(c) * Math.pow(Math.abs(c), 2 / n);

/* ---------------- busto ---------------- */
// profilo dal basso: [y, mezza larghezza, mezza profondità, centro z]
const PROF = [
  [0.000, 0.262, 0.150, 0.000],   // orlo un po' svasato
  [0.050, 0.252, 0.146, 0.000],
  [0.200, 0.236, 0.140, 0.000],   // vita
  [0.340, 0.242, 0.147, 0.004],
  [0.460, 0.252, 0.150, 0.006],   // petto
  [0.545, 0.254, 0.144, 0.003],   // ascelle
  [0.600, 0.248, 0.132, 0.000]    // inizio spalle
];
function profilo(y) {
  for (let i = 0; i < PROF.length - 1; i++) {
    const a = PROF[i], b = PROF[i + 1];
    if (y <= b[0]) { const t = smooth(0, 1, (y - a[0]) / (b[0] - a[0])) * 0.5 + (y - a[0]) / (b[0] - a[0]) * 0.5; return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)]; }
  }
  const l = PROF[PROF.length - 1]; return [l[1], l[2], l[3]];
}
const ANELLI_BASSI = 46, ANELLI_SPALLE = 20;
const anelli = [];   // { y(th), a, b, zc, n }
for (let i = 0; i <= ANELLI_BASSI; i++) {
  const y = 0.6 * i / ANELLI_BASSI, [a, b, zc] = profilo(y);
  anelli.push({ y: () => y, a, b, zc, n: 2.5 });
}
for (let i = 1; i <= ANELLI_SPALLE; i++) {
  const t = i / ANELLI_SPALLE;
  // spalle: curva che parte verticale e arriva al collo con una pendenza di circa 12°
  const a = bez(0.248, 0.242, 0.090, t), b = bez(0.132, 0.128, 0.080, t), zc = bez(0, 0, -0.014, t);
  const ys = bez(0.60, 0.660, 0.688, t), yf = bez(0.60, 0.642, 0.664, t), yb = bez(0.60, 0.662, 0.700, t);
  anelli.push({ y: th => { const c = Math.cos(th), s2 = Math.sin(th) ** 2; return s2 * ys + c * c * (c > 0 ? yf : yb); }, a, b, zc, n: lerp(2.5, 2.0, t) });
}
// pieghe leggere: vita, trascinamento dalle ascelle, un'onda morbida sul retro
function piega(th, y) {
  const lato = Math.abs(Math.sin(th));
  let d = 0;
  d += 0.0032 * Math.sin(y * 48 + th * 3.0) * smooth(0.02, 0.12, y) * (1 - smooth(0.26, 0.36, y));
  d += 0.0045 * Math.sin((y * 34 - Math.abs(th) * 2.2) * 2.0) * smooth(0.6, 0.95, lato) * smooth(0.30, 0.42, y) * (1 - smooth(0.50, 0.56, y));
  d += 0.0025 * Math.sin(th * 7 + y * 9) * (1 - smooth(0.0, 0.08, y));
  d -= 0.004 * Math.exp(-((y - 0.27) ** 2) / 0.004) * (0.6 + 0.4 * Math.cos(th));   // vita leggermente segnata
  return d;
}
function puntoBusto(r, k) {
  const A = anelli[r], th = -Math.PI / 2 + 2 * Math.PI * k / SEG;   // th=0 davanti (+z)
  const s = Math.sin(th), c = Math.cos(th);
  const y = A.y(th);
  let x = A.a * sup(s, A.n), z = A.zc + A.b * sup(c, A.n);
  const nr = norm3([x / (A.a * A.a), 0, (z - A.zc) / (A.b * A.b)]);
  const dd = r < ANELLI_BASSI ? piega(th, y) : 0;
  return [x + nr[0] * dd, y, z + nr[2] * dd];
}

/* ---------------- costruzione delle griglie ---------------- */
const pos = [], uv = [], idx = [];
function griglia(righe, col, punto, coordUV, fuori) {
  const base = pos.length / 3;
  for (let r = 0; r < righe; r++) for (let k = 0; k <= col; k++) { pos.push(...punto(r, k)); const t = coordUV(r, k); uv.push(t[0], 1 - t[1]); }   // la texture del canvas ha flipY: la v va girata
  const w = col + 1, tri = [];
  for (let r = 0; r < righe - 1; r++) for (let k = 0; k < col; k++) {
    const a = base + r * w + k, b = a + 1, c = a + w, d = c + 1;
    tri.push(a, c, b, b, c, d);
  }
  // verso delle facce: la normale del primo triangolo "a metà" deve puntare fuori
  const m = (Math.floor(righe / 2) * col + Math.floor(col / 4)) * 6;
  const P = i => pos.slice(i * 3, i * 3 + 3);
  const [p0, p1, p2] = [P(tri[m]), P(tri[m + 1]), P(tri[m + 2])];
  const e1 = p1.map((v, i) => v - p0[i]), e2 = p2.map((v, i) => v - p0[i]);
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const o = fuori(p0);
  const giusto = n[0] * o[0] + n[1] * o[1] + n[2] * o[2] > 0;
  for (let i = 0; i < tri.length; i += 3) idx.push(tri[i], giusto ? tri[i + 1] : tri[i + 2], giusto ? tri[i + 2] : tri[i + 1]);
}
// v del busto: lunghezza dell'arco media dal collo all'orlo
const R = anelli.length;
const arco = [0];
for (let r = 1; r < R; r++) {
  let s = 0;
  for (let k = 0; k < SEG; k += 8) { const p = puntoBusto(r, k), q = puntoBusto(r - 1, k); s += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
  arco.push(arco[r - 1] + s / (SEG / 8));
}
const tot = arco[R - 1];
griglia(R, SEG, (r, k) => puntoBusto(r, k), (r, k) => [k / SEG, UV_BUSTO * (1 - arco[r] / tot)],
  p => [p[0], 0, p[2]]);

/* ---------------- maniche ---------------- */
const NJ = 26, NF = 48, BETA = 40 * Math.PI / 180, LUNG = 0.255;
for (const sx of [-1, 1]) {
  const J = [sx * 0.200, 0.548, -0.006];
  const dir = [sx * Math.cos(BETA), -Math.sin(BETA), 0], n1 = [sx * Math.sin(BETA), Math.cos(BETA), 0];
  const punto = (j, f) => {
    const t = j / (NJ - 1), ph = 2 * Math.PI * f / NF;
    const ra = lerp(0.104, 0.074, smooth(0, 1, t)) * (1 + 0.04 * smooth(0.9, 1, t)), rb = lerp(0.086, 0.064, t) * (1 + 0.04 * smooth(0.9, 1, t));
    const c = dir.map((v, i) => J[i] + v * LUNG * t);
    // piccole pieghe sotto l'ascella
    const pl = 0.003 * Math.sin(t * 22 + ph * 2) * smooth(0.1, 0.5, t) * (Math.cos(ph) < 0 ? 1 : 0.3);
    const cp = Math.cos(ph), sp = Math.sin(ph);
    return [c[0] + n1[0] * (ra + pl) * cp, c[1] + n1[1] * (ra + pl) * cp, c[2] + (rb + pl) * sp];
  };
  const u0 = sx < 0 ? 0 : 0.5;
  griglia(NJ, NF, punto, (j, f) => [u0 + 0.5 * f / NF, lerp(UV_MANICA[0], UV_MANICA[1], j / (NJ - 1))],
    p => { const t = ((p[0] - J[0]) * dir[0] + (p[1] - J[1]) * dir[1]); return [p[0] - (J[0] + dir[0] * t), p[1] - (J[1] + dir[1] * t), p[2] - J[2]]; });
}

/* ---------------- colletto (costina) ---------------- */
{
  const r = R - 1, A = anelli[r];
  const punto = (j, k) => {
    const p = puntoBusto(r, k), th = -Math.PI / 2 + 2 * Math.PI * k / SEG;
    const dentro = norm3([Math.sin(th), 0, Math.cos(th)]);
    const t = j / 3;
    return [p[0] - dentro[0] * 0.006 * t, p[1] + 0.022 * t, p[2] - dentro[2] * 0.006 * t];
  };
  griglia(4, SEG, punto, (j, k) => [k / SEG, lerp(UV_COLLO[1], UV_COLLO[0], j / 3)], p => [p[0], 0, p[2] - A.zc]);
}

/* ---------------- normali (saldando le cuciture con la stessa posizione) ---------------- */
function normali(pos, idx) {
  const acc = new Map(), chiave = i => pos.slice(i * 3, i * 3 + 3).map(v => v.toFixed(5)).join(',');
  for (let i = 0; i < idx.length; i += 3) {
    const [a, b, c] = [idx[i], idx[i + 1], idx[i + 2]].map(j => pos.slice(j * 3, j * 3 + 3));
    const e1 = b.map((v, k) => v - a[k]), e2 = c.map((v, k) => v - a[k]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    for (const j of [idx[i], idx[i + 1], idx[i + 2]]) { const k = chiave(j); const s = acc.get(k) || [0, 0, 0]; acc.set(k, [s[0] + n[0], s[1] + n[1], s[2] + n[2]]); }
  }
  const out = [];
  for (let i = 0; i < pos.length / 3; i++) out.push(...norm3(acc.get(chiave(i))));
  return out;
}
const nor = normali(pos, idx);

// interno: stessa forma spostata di 2,5 mm verso dentro, facce girate
const posI = [], norI = [], idxI = [];
for (let i = 0; i < pos.length; i += 3) { posI.push(pos[i] - nor[i] * 0.0025, pos[i + 1] - nor[i + 1] * 0.0025, pos[i + 2] - nor[i + 2] * 0.0025); norI.push(-nor[i], -nor[i + 1], -nor[i + 2]); }
for (let i = 0; i < idx.length; i += 3) idxI.push(idx[i], idx[i + 2], idx[i + 1]);
// coordinate per la trama del tessuto (ripetuta)
const uv1 = uv.map((v, i) => v * (i % 2 ? 54 : 44));

/* ---------------- PNG minimi (texture iniziale e normal map della trama) ---------------- */
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc = buf => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function png(w, h, rgb) {
  const chunk = (tipo, dati) => { const t = Buffer.from(tipo), l = Buffer.alloc(4), c = Buffer.alloc(4); l.writeUInt32BE(dati.length); c.writeUInt32BE(crc(Buffer.concat([t, dati]))); return Buffer.concat([l, t, dati, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; for (let x = 0; x < w * 3; x++) raw[y * (w * 3 + 1) + 1 + x] = rgb[y * w * 3 + x]; }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
const base = png(4, 4, new Uint8Array(48).fill(232));
// trama "mesh" da maglia tecnica: forellini in file sfalsate
const N = 128, alt = new Float32Array(N * N);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const cy = Math.floor(y / 16), ox = cy % 2 ? 8 : 0;
  const dx = ((x + ox) % 16) - 8, dy = (y % 16) - 8;
  const r = Math.hypot(dx, dy * 1.15);
  alt[y * N + x] = 1 - Math.exp(-(r * r) / 9) + 0.08 * Math.sin((x + y) * 0.8);
}
const nm = new Uint8Array(N * N * 3);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const h = (xx, yy) => alt[((yy + N) % N) * N + ((xx + N) % N)];
  const n = norm3([(h(x - 1, y) - h(x + 1, y)) * 1.6, (h(x, y - 1) - h(x, y + 1)) * 1.6, 1]);
  const i = (y * N + x) * 3; nm[i] = Math.round((n[0] * 0.5 + 0.5) * 255); nm[i + 1] = Math.round((n[1] * 0.5 + 0.5) * 255); nm[i + 2] = Math.round((n[2] * 0.5 + 0.5) * 255);
}
const normalMap = png(N, N, nm);

/* ---------------- scrittura GLB ---------------- */
const parti = [], viste = [], accessori = [];
let off = 0;
function aggiungi(buf, target) {
  const pad = (4 - (buf.length % 4)) % 4;
  parti.push(buf, Buffer.alloc(pad));
  viste.push({ buffer: 0, byteOffset: off, byteLength: buf.length, ...(target ? { target } : {}) });
  off += buf.length + pad;
  return viste.length - 1;
}
function acc(arr, tipo, comp, conta, extra = {}) {
  const T = comp === 5126 ? Float32Array : comp === 5125 ? Uint32Array : Uint16Array;
  const v = aggiungi(Buffer.from(new T(arr).buffer), tipo === 'SCALAR' ? 34963 : 34962);
  accessori.push({ bufferView: v, componentType: comp, count: conta, type: tipo, ...extra });
  return accessori.length - 1;
}
function primitiva(P, Nn, I, materiale) {
  const n = P.length / 3, min = [0, 1, 2].map(k => Math.min(...P.filter((_, i) => i % 3 === k))), max = [0, 1, 2].map(k => Math.max(...P.filter((_, i) => i % 3 === k)));
  return {
    attributes: { POSITION: acc(P, 'VEC3', 5126, n, { min, max }), NORMAL: acc(Nn, 'VEC3', 5126, n), TEXCOORD_0: acc(uv, 'VEC2', 5126, n), TEXCOORD_1: acc(uv1, 'VEC2', 5126, n) },
    indices: acc(I, 'SCALAR', n > 65535 ? 5125 : 5123, I.length), material: materiale
  };
}
// centro il modello sull'origine (y = 0 a metà altezza)
const ymax = Math.max(...pos.filter((_, i) => i % 3 === 1)), dy = -ymax / 2;
for (const P of [pos, posI]) for (let i = 1; i < P.length; i += 3) P[i] += dy;
const prim = [primitiva(pos, nor, idx, 0), primitiva(posI, norI, idxI, 1)];
const imgBase = aggiungi(base), imgNorm = aggiungi(normalMap);
const json = {
  asset: { version: '2.0', generator: 'Slancio _strumenti/maglia3d.mjs', copyright: 'Modello originale del sito Slancio' },
  scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: 'Maglia' }],
  meshes: [{ name: 'Maglia', primitives: prim }],
  materials: [
    { name: 'Maglia', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 0.82 }, normalTexture: { index: 1, texCoord: 1, scale: 0.55 } },
    { name: 'Interno', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, baseColorFactor: [0.62, 0.62, 0.62, 1], metallicFactor: 0, roughnessFactor: 0.9 }, normalTexture: { index: 1, texCoord: 1, scale: 0.35 } }
  ],
  textures: [{ source: 0, sampler: 0 }, { source: 1, sampler: 1 }],
  images: [{ bufferView: imgBase, mimeType: 'image/png' }, { bufferView: imgNorm, mimeType: 'image/png' }],
  samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }, { magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
  buffers: [{ byteLength: off }], bufferViews: viste, accessors: accessori
};
let js = Buffer.from(JSON.stringify(json));
js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)]);
const bin = Buffer.concat(parti);
const testa = Buffer.alloc(12); testa.writeUInt32LE(0x46546C67, 0); testa.writeUInt32LE(2, 4); testa.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8);
const h1 = Buffer.alloc(8); h1.writeUInt32LE(js.length, 0); h1.writeUInt32LE(0x4E4F534A, 4);
const h2 = Buffer.alloc(8); h2.writeUInt32LE(bin.length, 0); h2.writeUInt32LE(0x004E4942, 4);
writeFileSync('assets/3d/maglia.glb', Buffer.concat([testa, h1, js, h2, bin]));
console.log(`✔ assets/3d/maglia.glb · ${pos.length / 3} vertici per lato · ${Math.round((testa.length + 16 + js.length + bin.length) / 1024)} KB`);
