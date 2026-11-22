// Vantage — procedural 3D seat-view engine.
// Every venue is generated from a handful of parameters (sport, shape, tiers, capacity),
// down to individual seats, so a new stadium can be demoed in minutes. For production,
// the venue's official seating manifest replaces the procedural layout.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { VENUES } from './stadiums.js';

// ───────────────────────── constants ─────────────────────────
const ROW_D = 0.85, SEAT_W = 0.5, AISLE = 1.2, MAX_ROWS = 40, MAX_TIERS = 5, N_CURVE = 720;
const RISER = [0.36, 0.45, 0.53, 0.58, 0.62];
const GAP_Y = [0, 4.5, 4.5, 4, 4];
const OVERHANG = [0, 3, 4, 4, 4];
const SHAPE_N = { grounds: 10, bowl: 3.2, oval: 2, arena: 3.6 };
const SPORTS = {
  football:   { fx: 52.5, fz: 34, mx: 8, mz: 7, shape: 'bowl', base: 55, label: 'Football' },
  rugby:      { fx: 60, fz: 35, mx: 5, mz: 7, shape: 'bowl', base: 60, label: 'Rugby' },
  gaelic:     { fx: 72.5, fz: 42.5, mx: 5, mz: 6, shape: 'bowl', base: 45, label: 'Gaelic games' },
  nfl:        { fx: 54.86, fz: 24.38, mx: 6, mz: 9, shape: 'bowl', base: 120, label: 'American football' },
  basketball: { fx: 14, fz: 7.5, mx: 3.5, mz: 3.5, shape: 'arena', base: 90, label: 'Basketball & concerts', arena: true },
  hockey:     { fx: 30.5, fz: 13, mx: 2, mz: 2, shape: 'arena', base: 80, label: 'Ice hockey', arena: true },
  cricket:    { fixed: { a: 80, b: 72, n: 2 }, base: 45, label: 'Cricket' },
  afl:        { fixed: { a: 90, b: 74, n: 2 }, base: 40, label: 'Aussie rules & cricket' },
  athletics:  { fixed: { a: 94, b: 52, n: 2.4 }, base: 40, label: 'Athletics & football' },
  baseball:   { base: 45, label: 'Baseball' },
};
const COL = {
  bands: ['#27408f', '#2f5fd0', '#4c8dff', '#8cc2ff'].map(c => new THREE.Color(c)),
  club: new THREE.Color('#e0773c'),
  sold: new THREE.Color('#161b2c'),
  hover: new THREE.Color('#ffffff'),
  sel: new THREE.Color('#ffcf3a'),
};
const ROW_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const rowLabel = r => r < 24 ? ROW_LETTERS[r] : ROW_LETTERS[Math.floor(r / 24) - 1] + ROW_LETTERS[r % 24];

// ───────────────────────── helpers ─────────────────────────
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function currency(v) {
  if (v.region === 'uk') return v.country === 'Ireland' ? '€' : '£';
  if (v.region === 'europe') return '€';
  return { Australia: 'A$', Canada: 'C$', 'New Zealand': 'NZ$' }[v.country] || '$';
}
const fmt = n => n.toLocaleString('en-GB');
const params = new URLSearchParams(location.search);

// ───────────────────────── geometry: bowl curves ─────────────────────────
function makeCurve(g) {
  const N = N_CURVE, px = new Float64Array(N), pz = new Float64Array(N), nx = new Float64Array(N), nz = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    px[i] = g.cx + g.a * Math.sign(c) * Math.abs(c) ** (2 / g.n);
    pz[i] = g.cz + g.b * Math.sign(s) * Math.abs(s) ** (2 / g.n);
  }
  for (let i = 0; i < N; i++) {
    const p = (i - 1 + N) % N, q = (i + 1) % N, tx = px[q] - px[p], tz = pz[q] - pz[p], l = Math.hypot(tx, tz) || 1;
    nx[i] = tz / l; nz[i] = -tx / l;
  }
  Object.assign(g, { N, px, pz, nx, nz });
  g.cum = cumLen(px, pz, 0, g);
  return g;
}
function cumLen(px, pz, d, g) {
  const N = g.N, cum = new Float64Array(N + 1);
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const ax = px[i] + d * g.nx[i], az = pz[i] + d * g.nz[i], bx = px[j] + d * g.nx[j], bz = pz[j] + d * g.nz[j];
    cum[i + 1] = cum[i] + Math.hypot(bx - ax, bz - az);
  }
  return cum;
}
const lenAt = (cum, N, u) => { const k = Math.floor(u), f = u - k, w = Math.floor(k / N), kk = ((k % N) + N) % N; return w * cum[N] + cum[kk] + f * (cum[kk + 1] - cum[kk]); };
function uAtLen(cum, N, L) {
  const T = cum[N], w = Math.floor(L / T); let l = L - w * T, lo = 0, hi = N;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= l) lo = m; else hi = m; }
  return w * N + lo + (l - cum[lo]) / ((cum[lo + 1] - cum[lo]) || 1);
}
function sampleAt(g, u, d) {
  const N = g.N, k = Math.floor(u), f = u - k, i = ((k % N) + N) % N, j = (i + 1) % N;
  let nx = g.nx[i] + (g.nx[j] - g.nx[i]) * f, nz = g.nz[i] + (g.nz[j] - g.nz[i]) * f; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
  const x = g.px[i] + (g.px[j] - g.px[i]) * f + d * nx, z = g.pz[i] + (g.pz[j] - g.pz[i]) * f + d * nz;
  return { x, z, nx, nz };
}

function buildGroups(v) {
  const sp = SPORTS[v.sport];
  if (v.sport === 'baseball') {
    return [
      { a: 45, b: 45, n: 2, cx: 25, cz: 0, share: 0.82, tiers: v.tiers || 3, filter: (x, z) => Math.abs(z) > x + 3 },
      { a: 124, b: 124, n: 2, cx: 0, cz: 0, share: 0.18, tiers: 1, filter: (x, z) => x > 0 && Math.abs(z) < x * 0.84 },
    ].map(makeCurve);
  }
  let a, b, n;
  if (sp.fixed) ({ a, b, n } = sp.fixed);
  else {
    n = SHAPE_N[v.shape || sp.shape];
    a = sp.fx + sp.mx; b = sp.fz + sp.mz;
    const k = ((sp.fx / a) ** n + (sp.fz / b) ** n) ** (1 / n);
    if (k > 0.97) { a *= k / 0.97; b *= k / 0.97; }
  }
  const corners = v.corners !== false;
  return [makeCurve({ a, b, n, cx: 0, cz: 0, share: 1, tiers: v.tiers || 2,
    filter: corners ? null : (x, z, nx, nz) => !(Math.abs(nx) > 0.35 && Math.abs(nz) > 0.35) })];
}

function makeSections(g, arena) {
  const N = g.N, L = g.cum[N], target = arena ? 10 : 17;
  let ns = Math.max(8, Math.round(L / target)); ns = Math.round(ns / 4) * 4;
  const secs = [];
  for (let s = 0; s < ns; s++) {
    const u0 = uAtLen(g.cum, N, ((s - 0.5) / ns) * L + (s === 0 ? L : 0)) - (s === 0 ? N : 0);
    const u1 = uAtLen(g.cum, N, ((s + 0.5) / ns) * L);
    const uu1 = u1 < u0 ? u1 + N : u1;
    const m = sampleAt(g, (u0 + uu1) / 2, 0);
    const incl = !g.filter || g.filter(m.x, m.z, m.nx, m.nz);
    const a0 = sampleAt(g, u0, 0), a1 = sampleAt(g, uu1, 0);
    let turn = Math.atan2(a1.nz, a1.nx) - Math.atan2(a0.nz, a0.nx); while (turn < 0) turn += Math.PI * 2; if (turn > Math.PI) turn = 0;
    secs.push({ u0, u1: uu1, incl, len0: lenAt(g.cum, N, uu1) - lenAt(g.cum, N, u0), turn, mid: m });
  }
  return secs;
}

function tierPlan(rows, arena) {
  const plan = []; let endD = 0, endY = 0;
  rows.forEach((r, t) => {
    let d0, y0;
    if (t === 0) { d0 = arena ? 0.6 : 1.0; y0 = arena ? 0.6 : 1.1; }
    else { d0 = endD - Math.min(OVERHANG[t], rows[t - 1] * ROW_D * 0.35); y0 = endY + GAP_Y[t] * (arena ? 0.75 : 1); }
    const riser = RISER[t] * (arena ? 1.08 : 1);
    plan.push({ d0, y0, rows: r, riser });
    endD = d0 + (r - 1) * ROW_D; endY = y0 + (r - 1) * riser;
  });
  return plan;
}

function countSeats(secs, plan) {
  let c = 0;
  for (const tp of plan) for (let r = 0; r < tp.rows; r++) {
    const d = tp.d0 + r * ROW_D;
    for (const s of secs) if (s.incl) c += Math.max(0, Math.floor((s.len0 + s.turn * d - AISLE) / SEAT_W));
  }
  return c;
}

function allocateRows(secs, target, tiers, arena) {
  let w = tiers === 1 ? [1] : tiers === 2 ? [1.1, 1] : [1.25, 0.6, 1, 0.9, 0.9].slice(0, tiers);
  const rows = new Array(tiers).fill(3);
  for (let it = 0; it < 2000; it++) {
    if (countSeats(secs, tierPlan(rows, arena)) >= target) break;
    let best = -1, bv = Infinity;
    rows.forEach((r, t) => { if (r < MAX_ROWS && r / w[t] < bv) { bv = r / w[t]; best = t; } });
    if (best < 0) { if (rows.length >= MAX_TIERS) break; rows.push(3); w = [...w, 0.9]; continue; }
    rows[best]++;
  }
  return rows;
}

// ───────────────────────── layout: seats ─────────────────────────
function buildLayout(v) {
  const sp = SPORTS[v.sport], arena = !!sp.arena, R = rng(hash(v.id));
  const groups = buildGroups(v);
  const X = [], Y = [], Z = [], NX = [], NZ = [], SEC = [], ROW = [], NUM = [], PRICE = [], SOLD = [], TIER = [];
  const sections = [], tiersOut = [];
  const tierMultFor = n => n === 1 ? [1] : n === 2 ? [1.15, 0.8] : [1.1, 1.65, 0.75, 0.62, 0.55];
  const fieldA = groups[0].a;

  groups.forEach((g, gi) => {
    const secs = makeSections(g, arena);
    const rows = allocateRows(secs, v.cap * g.share, g.tiers, arena);
    const plan = tierPlan(rows, arena);
    const tm = tierMultFor(plan.length);
    g.secs = secs; g.plan = plan;
    plan.forEach((tp, t) => {
      const club = plan.length >= 3 && t === 1;
      let k = 0;
      const tierSecIdx = [];
      secs.forEach(s => {
        if (!s.incl) { tierSecIdx.push(-1); return; }
        const label = String((t + 1) * 100 + (gi ? 60 : 0) + (++k));
        tierSecIdx.push(sections.length);
        sections.push({ label, tier: t, club, idx: [], sold: 0.12 + R() * 0.55, min: Infinity, avail: 0, mid: s.mid });
      });
      for (let r = 0; r < tp.rows; r++) {
        const d = tp.d0 + r * ROW_D, y = tp.y0 + r * tp.riser;
        const cum = cumLen(g.px, g.pz, d, g);
        secs.forEach((s, si) => {
          if (!s.incl) return;
          const L0 = lenAt(cum, g.N, s.u0), L1 = lenAt(cum, g.N, s.u1), usable = L1 - L0 - AISLE, n = Math.floor(usable / SEAT_W);
          if (n <= 0) return;
          const secRef = sections[tierSecIdx[si]];
          let L = L0 + AISLE / 2 + (usable - n * SEAT_W) / 2 + SEAT_W / 2;
          for (let j = 0; j < n; j++, L += SEAT_W) {
            const u = uAtLen(cum, g.N, L), p = sampleAt(g, u, d);
            const side = Math.abs(p.nz), rowFrac = tp.rows > 1 ? r / (tp.rows - 1) : 0;
            const centre = side > 0.7 ? 1 - 0.28 * Math.min(1, Math.abs(p.x) / fieldA) : 0.85;
            let price = sp.base * tm[t] * (0.6 + 0.75 * side ** 1.5) * (1.08 - 0.45 * Math.abs(rowFrac - 0.3)) * centre;
            price = Math.max(10, Math.round(price / 5) * 5);
            const sold = R() < secRef.sold ? 1 : 0;
            const i = X.length;
            X.push(p.x); Y.push(y); Z.push(p.z); NX.push(p.nx); NZ.push(p.nz);
            SEC.push(tierSecIdx[si]); ROW.push(r); NUM.push(j + 1); PRICE.push(price); SOLD.push(sold); TIER.push(t);
            secRef.idx.push(i);
            if (!sold) { secRef.avail++; if (price < secRef.min) secRef.min = price; }
          }
        });
      }
      tiersOut.push({ g: gi, t, ...tp, club });
    });
  });

  const sortedPrices = PRICE.slice().sort((a, b) => a - b);
  const q = f => sortedPrices[Math.floor(f * (sortedPrices.length - 1))] || 0;
  const bands = [q(0.25), q(0.5), q(0.75)];
  return {
    groups, sections, tiers: tiersOut, bands, count: X.length,
    X: Float32Array.from(X), Y: Float32Array.from(Y), Z: Float32Array.from(Z), NX: Float32Array.from(NX), NZ: Float32Array.from(NZ),
    SEC: Int32Array.from(SEC), ROW: Int16Array.from(ROW), NUM: Int16Array.from(NUM), PRICE: Float32Array.from(PRICE),
    SOLD: Uint8Array.from(SOLD), TIER: Uint8Array.from(TIER),
    priceMin: sortedPrices[0], priceMax: sortedPrices[sortedPrices.length - 1],
  };
}

// ───────────────────────── pitch textures ─────────────────────────
const W = 'rgba(255,255,255,0.9)';
function line(c, x1, z1, x2, z2) { c.beginPath(); c.moveTo(x1, z1); c.lineTo(x2, z2); c.stroke(); }
function circ(c, x, z, r, a0 = 0, a1 = Math.PI * 2) { c.beginPath(); c.arc(x, z, r, a0, a1); c.stroke(); }
function dot(c, x, z, r) { c.beginPath(); c.arc(x, z, r, 0, Math.PI * 2); c.fill(); }
function grass(c, ext, step = 5.5, cols = ['#2b7434', '#31803b']) {
  c.fillStyle = cols[0]; c.fillRect(-ext.x, -ext.z, ext.x * 2, ext.z * 2);
  c.fillStyle = cols[1]; for (let x = -ext.x, k = 0; x < ext.x; x += step, k++) if (k % 2) c.fillRect(x, -ext.z, step, ext.z * 2);
}
function stadiumPath(c, r, h = 42.195) { c.beginPath(); c.moveTo(-h, -r); c.lineTo(h, -r); c.arc(h, 0, r, -Math.PI / 2, Math.PI / 2); c.lineTo(-h, r); c.arc(-h, 0, r, Math.PI / 2, Math.PI * 1.5); c.closePath(); }

const DRAW = {
  football(c, ext) {
    grass(c, ext);
    c.strokeStyle = W; c.fillStyle = W; c.lineWidth = 0.14;
    c.strokeRect(-52.5, -34, 105, 68); line(c, 0, -34, 0, 34); circ(c, 0, 0, 9.15); dot(c, 0, 0, 0.25);
    for (const s of [-1, 1]) {
      const gx = s * 52.5;
      c.strokeRect(Math.min(gx, gx - s * 16.5), -20.16, 16.5, 40.32);
      c.strokeRect(Math.min(gx, gx - s * 5.5), -9.16, 5.5, 18.32);
      dot(c, gx - s * 11, 0, 0.22);
      const a = 0.9273; s > 0 ? circ(c, gx - 11, 0, 9.15, Math.PI - a, Math.PI + a) : circ(c, gx + 11, 0, 9.15, -a, a);
      c.lineWidth = 0.25; c.strokeRect(Math.min(gx, gx + s * 2), -3.66, 2, 7.32); c.lineWidth = 0.14;
    }
  },
  rugby(c, ext) {
    grass(c, ext, 5, ['#2a7334', '#307d3a']);
    c.strokeStyle = W; c.lineWidth = 0.14;
    c.strokeRect(-60, -35, 120, 70);
    for (const x of [-50, -28, 0, 28, 50]) line(c, x, -35, x, 35);
    c.setLineDash([2, 2]); for (const x of [-10, 10]) line(c, x, -35, x, 35); for (const z of [-30, 30]) line(c, -50, z, 50, z); c.setLineDash([]);
    c.lineWidth = 0.35; for (const s of [-1, 1]) line(c, s * 50, -2.8, s * 50, 2.8);
  },
  gaelic(c, ext) {
    grass(c, ext, 6);
    c.strokeStyle = W; c.lineWidth = 0.15; c.strokeRect(-72.5, -42.5, 145, 85); line(c, 0, -42.5, 0, 42.5);
    for (const s of [-1, 1]) {
      for (const d of [13, 20, 45]) line(c, s * (72.5 - d), -42.5, s * (72.5 - d), 42.5);
      c.strokeRect(Math.min(s * 72.5, s * 68), -7, 4.5, 14); c.strokeRect(Math.min(s * 72.5, s * 59.5), -9.5, 13, 19);
      s > 0 ? circ(c, 52.5, 0, 13, Math.PI / 2, Math.PI * 1.5) : circ(c, -52.5, 0, 13, -Math.PI / 2, Math.PI / 2);
      c.lineWidth = 0.35; line(c, s * 72.5, -3.25, s * 72.5, 3.25); c.lineWidth = 0.15;
    }
  },
  nfl(c, ext) {
    grass(c, ext, 4.572, ['#28692f', '#2e7536']);
    for (const s of [-1, 1]) { c.fillStyle = s > 0 ? '#7a1f2b' : '#1f3b7a'; c.fillRect(Math.min(s * 45.72, s * 54.86), -24.38, 9.14, 48.76); }
    c.strokeStyle = W; c.lineWidth = 0.15; c.strokeRect(-54.86, -24.38, 109.72, 48.76);
    for (let x = -45.72; x <= 45.73; x += 4.572) line(c, x, -24.38, x, 24.38);
    c.lineWidth = 0.08; for (let x = -45.72; x <= 45.72; x += 0.9144) { line(c, x, -3.1, x, -2.5); line(c, x, 2.5, x, 3.1); line(c, x, -24.2, x, -23.6); line(c, x, 23.6, x, 24.2); }
    c.fillStyle = 'rgba(255,255,255,0.16)'; dot(c, 0, 0, 4.5);
  },
  basketball(c, ext) {
    c.fillStyle = '#1b1612'; c.fillRect(-ext.x, -ext.z, ext.x * 2, ext.z * 2);
    c.fillStyle = '#c58a52'; c.fillRect(-14, -7.5, 28, 15);
    c.strokeStyle = 'rgba(90,45,10,0.14)'; c.lineWidth = 0.03; for (let z = -7.5; z < 7.5; z += 0.4) line(c, -14, z, 14, z);
    c.fillStyle = '#20368f'; for (const s of [-1, 1]) c.fillRect(Math.min(s * 14, s * 8.2), -2.45, 5.8, 4.9);
    dot(c, 0, 0, 1.8);
    c.strokeStyle = W; c.lineWidth = 0.06; c.strokeRect(-14, -7.5, 28, 15); line(c, 0, -7.5, 0, 7.5); circ(c, 0, 0, 1.8);
    for (const s of [-1, 1]) {
      c.strokeRect(Math.min(s * 14, s * 8.2), -2.45, 5.8, 4.9); circ(c, s * 8.2, 0, 1.8);
      const bx = s * (14 - 1.575), R = 6.75, pm = Math.asin(6.6 / R);
      c.beginPath(); for (let k = 0; k <= 48; k++) { const p = -pm + (2 * pm * k) / 48, x = bx - s * R * Math.cos(p), z = R * Math.sin(p); k ? c.lineTo(x, z) : c.moveTo(x, z); } c.stroke();
      for (const z of [-6.6, 6.6]) line(c, s * 14, z, bx - s * R * Math.cos(pm), z);
      line(c, s * 12.8, -0.9, s * 12.8, 0.9);
      c.strokeStyle = '#ff7a2a'; circ(c, bx, 0, 0.23); c.strokeStyle = W;
    }
  },
  hockey(c, ext) {
    c.fillStyle = '#121620'; c.fillRect(-ext.x, -ext.z, ext.x * 2, ext.z * 2);
    c.fillStyle = '#e8f0f6'; c.beginPath(); c.roundRect(-30.5, -13, 61, 26, 8.5); c.fill();
    c.lineWidth = 0.3; c.strokeStyle = '#c8202f'; line(c, 0, -13, 0, 13);
    c.strokeStyle = '#2346c8'; for (const x of [-7.62, 7.62]) line(c, x, -13, x, 13);
    c.lineWidth = 0.06; circ(c, 0, 0, 4.57);
    c.strokeStyle = '#c8202f'; for (const s of [-1, 1]) { line(c, s * 26.5, -11.7, s * 26.5, 11.7); for (const z of [-6.7, 6.7]) circ(c, s * 20.1, z, 4.57); }
    c.lineWidth = 0.25; c.strokeStyle = '#ffffff'; c.beginPath(); c.roundRect(-30.5, -13, 61, 26, 8.5); c.stroke();
  },
  cricket(c, ext) {
    grass(c, ext, 6, ['#2d7a36', '#33823d']);
    c.strokeStyle = W; c.lineWidth = 0.18; c.setLineDash([0.9, 0.9]); c.beginPath(); c.ellipse(0, 0, 31, 27.4, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    c.lineWidth = 0.45; c.beginPath(); c.ellipse(0, 0, ext.x - 5, ext.z - 5, 0, 0, Math.PI * 2); c.stroke();
    c.fillStyle = '#cdb985'; c.fillRect(-10.06, -1.52, 20.12, 3.04);
    c.lineWidth = 0.08; for (const x of [-10.06, -8.84, 8.84, 10.06]) line(c, x, -1.6, x, 1.6);
  },
  afl(c, ext) {
    grass(c, ext, 6);
    const A = ext.x - 4, B = ext.z - 4;
    c.strokeStyle = W; c.lineWidth = 0.15; c.beginPath(); c.ellipse(0, 0, A, B, 0, 0, Math.PI * 2); c.stroke();
    c.strokeRect(-25, -25, 50, 50); circ(c, 0, 0, 5); circ(c, 0, 0, 1.5);
    for (const s of [-1, 1]) {
      c.strokeRect(Math.min(s * A, s * (A - 9)), -3.2, 9, 6.4);
      s > 0 ? circ(c, A, 0, 50, Math.PI - 0.95, Math.PI + 0.95) : circ(c, -A, 0, 50, -0.95, 0.95);
      c.fillStyle = W; for (const z of [-9.6, -3.2, 3.2, 9.6]) dot(c, s * A, z, 0.3);
    }
  },
  athletics(c, ext) {
    c.fillStyle = '#2b7434'; c.fillRect(-ext.x, -ext.z, ext.x * 2, ext.z * 2);
    c.fillStyle = '#b5452f'; stadiumPath(c, 46.26); c.fill();
    c.fillStyle = '#2b7434'; stadiumPath(c, 36.5); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.65)'; c.lineWidth = 0.05; for (let k = 0; k <= 8; k++) { stadiumPath(c, 36.5 + k * 1.22); c.stroke(); }
    DRAW.football(c, { x: 52.5, z: 34 });
  },
  baseball(c, ext, R) {
    c.fillStyle = '#2c7a37'; c.fillRect(R.x0, R.z0, R.x1 - R.x0, R.z1 - R.z0);
    c.fillStyle = '#33843e'; for (let r = 30, k = 0; r < 125; r += 6, k++) if (k % 2) { c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r + 6, -Math.PI / 4, Math.PI / 4); c.arc(0, 0, r, Math.PI / 4, -Math.PI / 4, true); c.fill(); }
    c.strokeStyle = '#a8744a'; c.lineWidth = 4; circ(c, 0, 0, 119, -Math.PI / 4 - 0.05, Math.PI / 4 + 0.05);
    c.fillStyle = '#b47a4a'; dot(c, 18.44, 0, 28.5);
    c.fillStyle = '#2c7a37'; c.beginPath(); c.moveTo(4, 0); c.lineTo(19.4, -15.4); c.lineTo(34.8, 0); c.lineTo(19.4, 15.4); c.closePath(); c.fill();
    c.fillStyle = '#b47a4a'; dot(c, 18.44, 0, 2.74); dot(c, 0, 0, 4);
    c.fillStyle = '#fff'; for (const [x, z] of [[19.4, -19.4], [38.8, 0], [19.4, 19.4], [0, 0]]) c.fillRect(x - 0.25, z - 0.25, 0.5, 0.5);
    c.strokeStyle = W; c.lineWidth = 0.12; line(c, 0, 0, 125 * Math.SQRT1_2, -125 * Math.SQRT1_2); line(c, 0, 0, 125 * Math.SQRT1_2, 125 * Math.SQRT1_2);
  },
};

function fieldRect(v, g) {
  if (v.sport === 'baseball') return { x0: -30, x1: 135, z0: -100, z1: 100 };
  return { x0: -g.a, x1: g.a, z0: -g.b, z1: g.b };
}

function makePitch(v, layout, maxAniso) {
  const g = layout.groups[0], R = fieldRect(v, g), Wd = R.x1 - R.x0, Hd = R.z1 - R.z0;
  const ppm = Math.min(2048 / Wd, 2048 / Hd);
  const cv = document.createElement('canvas'); cv.width = Math.round(Wd * ppm); cv.height = Math.round(Hd * ppm);
  const c = cv.getContext('2d');
  c.setTransform(ppm, 0, 0, ppm, -R.x0 * ppm, -R.z0 * ppm);
  c.fillStyle = '#0a0d18'; c.fillRect(R.x0, R.z0, Wd, Hd);
  c.lineCap = 'round'; c.lineJoin = 'round';
  const clip = v.sport !== 'baseball';
  if (!clip) { c.save(); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 124, -Math.PI / 4 - 0.12, Math.PI / 4 + 0.12); c.closePath(); c.moveTo(70, 0); c.arc(25, 0, 45, 0, Math.PI * 2); c.clip(); }
  if (clip) { c.save(); c.beginPath(); for (let i = 0; i < g.N; i++) i ? c.lineTo(g.px[i], g.pz[i]) : c.moveTo(g.px[i], g.pz[i]); c.closePath(); c.clip(); }
  DRAW[v.sport](c, { x: g.a, z: g.b }, R);
  c.restore();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = maxAniso;
  const geo = new THREE.PlaneGeometry(Wd, Hd); geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex }));
  m.position.set((R.x0 + R.x1) / 2, 0, (R.z0 + R.z1) / 2);
  return m;
}

// ───────────────────────── stands meshes ─────────────────────────
function stripGeometry(g, secs, pairs) {
  // pairs(p) → [[x,y,z], [x,y,z]] for inner/outer edge at sample p; builds a quad strip per included section.
  const pos = [], idx = [];
  for (const s of secs) {
    if (!s.incl) continue;
    const us = [s.u0]; for (let k = Math.ceil(s.u0 + 1e-6); k < s.u1; k++) us.push(k); us.push(s.u1);
    const base = pos.length / 3;
    us.forEach(u => { const [a, b] = pairs(u); pos.push(...a, ...b); });
    for (let k = 0; k < us.length - 1; k++) { const i = base + k * 2; idx.push(i, i + 1, i + 2, i + 1, i + 3, i + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

function buildStands(v, layout, root) {
  const concrete = new THREE.MeshLambertMaterial({ color: '#1b2031', side: THREE.DoubleSide });
  const wall = new THREE.MeshLambertMaterial({ color: '#0f1220', side: THREE.DoubleSide });
  const ledBlue = new THREE.MeshBasicMaterial({ color: '#2a54d8', side: THREE.DoubleSide });
  const ledClub = new THREE.MeshBasicMaterial({ color: '#d0612a', side: THREE.DoubleSide });
  const boards = new THREE.MeshBasicMaterial({ color: '#13204f', side: THREE.DoubleSide });
  const pickables = []; let outer = 0, top = 0;
  layout.tiers.forEach(tp => {
    const g = layout.groups[tp.g], secs = g.secs;
    const dIn = tp.d0 - 0.5, dOut = tp.d0 + (tp.rows - 1) * ROW_D + 0.5, yIn = tp.y0 - 0.25, yOut = tp.y0 + (tp.rows - 1) * tp.riser + 0.1;
    const slope = new THREE.Mesh(stripGeometry(g, secs, u => { const a = sampleAt(g, u, dIn), b = sampleAt(g, u, dOut); return [[a.x, yIn, a.z], [b.x, yOut, b.z]]; }), concrete);
    slope.userData.pick = true; pickables.push(slope); root.add(slope);
    root.add(new THREE.Mesh(stripGeometry(g, secs, u => { const b = sampleAt(g, u, dOut); return [[b.x, yOut + 1.1, b.z], [b.x, 0, b.z]]; }), wall));
    const fasciaTop = yIn, fasciaBot = tp.t === 0 ? 0 : yIn - 1.6;
    root.add(new THREE.Mesh(stripGeometry(g, secs, u => { const a = sampleAt(g, u, dIn); return [[a.x, fasciaTop, a.z], [a.x, fasciaBot, a.z]]; }), tp.t === 0 ? boards : tp.club ? ledClub : ledBlue));
    const ext = g.a + dOut; if (ext > outer) outer = ext; if (yOut > top) top = yOut;
    tp.dOut = dOut; tp.yOut = yOut;
  });
  if (v.roof) {
    const g = layout.groups[0], last = layout.tiers.filter(t => t.g === 0).at(-1), depth = Math.min(32, g.b * 0.45);
    const all = g.secs.map(s => ({ ...s, incl: true }));
    const roofMat = new THREE.MeshLambertMaterial({ color: '#2a3150', transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });
    root.add(new THREE.Mesh(stripGeometry(g, all, u => { const a = sampleAt(g, u, last.dOut + 1), b = sampleAt(g, u, last.dOut - depth); return [[a.x, last.yOut + 8, a.z], [b.x, last.yOut + 10, b.z]]; }), roofMat));
    const pts = []; for (let i = 0; i <= g.N; i += 2) { const p = sampleAt(g, i % g.N, last.dOut - depth); pts.push(new THREE.Vector3(p.x, last.yOut + 10, p.z)); }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#6f8dff', transparent: true, opacity: 0.55 })));
  }
  return { pickables, outer, top };
}

function seatGeometry() {
  const base = new THREE.BoxGeometry(0.46, 0.08, 0.42); base.translate(0, 0.42, -0.02);
  const back = new THREE.BoxGeometry(0.46, 0.5, 0.07); back.translate(0, 0.7, 0.2);
  return mergeGeometries([base, back]);
}

// ───────────────────────── app ─────────────────────────
const $ = s => document.querySelector(s);
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
const BG = new THREE.Color('#05070f'); scene.background = BG;
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 4000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI * 0.47; controls.screenSpacePanning = false;
scene.add(new THREE.HemisphereLight('#a9bcff', '#0a0c18', 1.1));
const sun = new THREE.DirectionalLight('#ffffff', 1.5); sun.position.set(60, 160, 40); scene.add(sun);
const fill = new THREE.DirectionalLight('#5b7bff', 0.5); fill.position.set(-80, 60, -60); scene.add(fill);
const ground = new THREE.Mesh(new THREE.CircleGeometry(1500, 64).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#070912' }));
ground.position.y = -0.05; scene.add(ground);
const SEAT_GEO = seatGeometry();
const seatMat = new THREE.MeshLambertMaterial({ color: '#ffffff' });

const accent = params.get('accent');
if (accent && /^[0-9a-f]{6}$/i.test(accent)) { COL.sel.set('#' + accent); document.documentElement.style.setProperty('--accent', '#' + accent); }

const S = {
  venue: null, L: null, root: null, seats: null, pickables: [], outer: 200, top: 40, focus: new THREE.Vector3(),
  mode: 'overview', sel: [], hoverSec: -1, anim: null, look: null, overviewCam: null, cine: null, region: 'uk', query: '',
};
const pin = new THREE.Group();
{
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 14, 8), new THREE.MeshBasicMaterial({ color: COL.sel, transparent: true, opacity: 0.85 }));
  beam.position.y = 8; const head = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), new THREE.MeshBasicMaterial({ color: COL.sel })); head.position.y = 15.5;
  pin.add(beam, head); pin.visible = false; scene.add(pin);
}

function seatColor(i, out) {
  const L = S.L;
  if (L.SOLD[i]) return out.copy(COL.sold);
  if (S.L.sections[L.SEC[i]].club) return out.copy(COL.club);
  const p = L.PRICE[i], b = L.bands; return out.copy(COL.bands[p <= b[0] ? 0 : p <= b[1] ? 1 : p <= b[2] ? 2 : 3]);
}

function disposeRoot() {
  if (!S.root) return;
  S.root.traverse(o => { if (o.geometry && o.geometry !== SEAT_GEO) o.geometry.dispose(); if (o.material && o.material !== seatMat) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
  scene.remove(S.root); S.root = null;
}

function loadVenue(id, { keepCine = false } = {}) {
  const v = VENUES.find(x => x.id === id) || VENUES[0];
  if (!keepCine) stopCine();
  $('#loading').hidden = false;
  requestAnimationFrame(() => setTimeout(() => {
    disposeRoot(); clearSelection(true);
    S.venue = v; S.mode = 'overview'; S.hoverSec = -1; S.anim = null; S.look = null; S.pause = 0;
    const t0 = performance.now();
    const L = S.L = buildLayout(v);
    const root = S.root = new THREE.Group(); scene.add(root);
    root.add(makePitch(v, L, renderer.capabilities.getMaxAnisotropy()));
    const st = buildStands(v, L, root);
    S.pickables = st.pickables; S.outer = st.outer; S.top = st.top;
    const mesh = new THREE.InstancedMesh(SEAT_GEO, seatMat, L.count);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), col = new THREE.Color();
    for (let i = 0; i < L.count; i++) {
      q.setFromAxisAngle(up, Math.atan2(L.NX[i], L.NZ[i])); p.set(L.X[i], L.Y[i], L.Z[i]);
      mesh.setMatrixAt(i, m4.compose(p, q, one)); mesh.setColorAt(i, seatColor(i, col));
    }
    mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true; mesh.computeBoundingSphere();
    root.add(mesh); S.seats = mesh;
    S.focus.set(v.sport === 'baseball' ? 30 : 0, 0, 0);
    scene.fog = new THREE.Fog(BG, S.outer * 2.2, S.outer * 5);
    controls.minDistance = S.outer * 0.25; controls.maxDistance = S.outer * 3.2;
    const ov = overviewPose(); camera.position.copy(ov.pos); controls.target.copy(ov.target); camera.fov = 50; camera.updateProjectionMatrix();
    controls.enabled = true; controls.autoRotate = false; controls.update();
    pin.visible = false;
    renderHeader(v, L, performance.now() - t0); renderLegend(); setupFinder(); renderList();
    $('#seatPanel').hidden = true; $('#viewCaption').hidden = true; document.body.classList.remove('seat-mode');
    $('#loading').hidden = true;
    try { history.replaceState(null, '', location.pathname + location.search + '#' + v.id); } catch { /* sandboxed */ }
    post({ type: 'venue', venue: v.id, name: v.name, seats: L.count });
    if (S.cine) cineStep();
  }, 16));
}

function overviewPose() {
  const R = S.outer * (SPORTS[S.venue.sport].arena ? 1.3 : 1);
  return { pos: new THREE.Vector3(S.focus.x + R * 0.18, R * 0.78 + S.top, R * 1.12), target: S.focus.clone() };
}

// ───────────────────────── UI rendering ─────────────────────────
function renderHeader(v, L, ms) {
  $('#vName').textContent = v.name;
  $('#vMeta').textContent = `${v.city}, ${v.country} · ${fmt(v.cap)} capacity · ${SPORTS[v.sport].label}`;
  $('#vStats').textContent = `${fmt(L.count)} seats modelled · ${L.sections.length} sections · ${L.tiers.length} tier${L.tiers.length > 1 ? 's' : ''} · built in ${Math.round(ms)} ms`;
  $('#cineName').textContent = v.name; $('#cineMeta').textContent = `${v.city} · ${fmt(v.cap)} seats`;
}
function renderLegend() {
  const L = S.L, cur = currency(S.venue), b = L.bands;
  const items = [
    ['#27408f', `up to ${cur}${b[0]}`], ['#2f5fd0', `${cur}${b[0] + 5}–${b[1]}`], ['#4c8dff', `${cur}${b[1] + 5}–${b[2]}`], ['#8cc2ff', `${cur}${b[2] + 5}+`],
  ];
  if (L.sections.some(s => s.club)) items.push(['#e0773c', 'Club level']);
  items.push(['#161b2c', 'Sold']);
  $('#legend').innerHTML = items.map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('');
}
function renderList() {
  const q = S.query.trim().toLowerCase();
  const list = VENUES.filter(v => v.region === S.region && (!q || `${v.name} ${v.city} ${v.country} ${v.tenant}`.toLowerCase().includes(q)));
  $('#count').textContent = `${list.length} venue${list.length === 1 ? '' : 's'}`;
  $('#list').innerHTML = list.map(v => `
    <li><button data-id="${v.id}" class="${S.venue && S.venue.id === v.id ? 'on' : ''}">
      <b>${v.name}</b><small>${v.city}, ${v.country}</small><em>${fmt(v.cap)}</em>
    </button></li>`).join('');
}
function setupFinder() {
  const L = S.L, r = $('#budget');
  r.min = L.priceMin; r.max = L.priceMax; r.step = 5; r.value = Math.round((L.priceMin + L.priceMax) / 2 / 5) * 5;
  updateBudgetLabel();
}
function updateBudgetLabel() { $('#budgetVal').textContent = `${currency(S.venue)}${$('#budget').value}`; }

function seatInfo(i) {
  const L = S.L, sec = L.sections[L.SEC[i]];
  const dx = L.X[i] - S.focus.x, dz = L.Z[i] - S.focus.z, dist = Math.round(Math.hypot(dx, dz));
  const side = Math.abs(L.NZ[i]) > 0.7 ? (Math.abs(L.X[i]) < S.L.groups[0].a * 0.3 ? 'Halfway, side-on' : 'Side-on') : Math.abs(L.NX[i]) > 0.7 ? 'Behind the end' : 'Corner';
  return { sec: sec.label, row: rowLabel(L.ROW[i]), num: L.NUM[i], price: L.PRICE[i], club: sec.club, dist, side, height: Math.round(L.Y[i]) };
}

function showSeatPanel() {
  const cur = currency(S.venue), infos = S.sel.map(seatInfo), first = infos[0];
  const seats = infos.length > 1 ? `Seats ${infos[0].num}–${infos.at(-1).num}` : `Seat ${first.num}`;
  const total = infos.reduce((a, b) => a + b.price, 0);
  $('#spTitle').textContent = `Section ${first.sec} · Row ${first.row} · ${seats}`;
  $('#spPrice').textContent = `${cur}${fmt(total)}`;
  $('#spEach').textContent = infos.length > 1 ? `${infos.length} × ${cur}${first.price}` : first.club ? 'Club level · lounge access' : 'per ticket';
  $('#spFacts').innerHTML = `<li><span>View</span>${first.side}</li><li><span>To centre</span>${first.dist} m</li><li><span>Height</span>${first.height} m</li>`;
  $('#viewBtn').hidden = S.mode === 'seat'; $('#backBtn').hidden = S.mode !== 'seat';
  $('#seatPanel').hidden = false;
  $('#viewCaption').textContent = `View from Section ${first.sec} · Row ${first.row} · ${seats}`;
}

// ───────────────────────── selection & camera ─────────────────────────
const tmpC = new THREE.Color();
function paint(i, c) { S.seats.setColorAt(i, c); }
function clearSelection(silent) {
  if (S.L && S.seats) { for (const i of S.sel) paint(i, seatColor(i, tmpC)); S.seats.instanceColor.needsUpdate = true; }
  S.sel = []; pin.visible = false;
  if (!silent) $('#seatPanel').hidden = true;
}
function select(indices) {
  clearSelection(true);
  S.sel = indices; for (const i of indices) paint(i, COL.sel); S.seats.instanceColor.needsUpdate = true;
  const L = S.L, mid = indices[Math.floor(indices.length / 2)];
  pin.position.set(L.X[mid], L.Y[mid], L.Z[mid]); pin.visible = S.mode !== 'seat';
  showSeatPanel();
  const cur = currency(S.venue);
  post({ type: 'select', venue: S.venue.id, currency: cur, seats: indices.map(i => { const s = seatInfo(i); return { section: s.sec, row: s.row, seat: s.num, price: s.price }; }) });
}

function eyeFor(i) {
  const L = S.L;
  return {
    pos: new THREE.Vector3(L.X[i] + L.NX[i] * 0.15, L.Y[i] + 1.18, L.Z[i] + L.NZ[i] * 0.15),
    target: new THREE.Vector3(S.focus.x * 0.85 + L.X[i] * 0.15, 0, S.focus.z * 0.85 + L.Z[i] * 0.15),
  };
}
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
function flyTo(pos, target, dur, done, lift = 0) {
  const look = new THREE.Vector3(); camera.getWorldDirection(look);
  const dist = controls.enabled ? camera.position.distanceTo(controls.target) : 60;
  const fromT = camera.position.clone().add(look.multiplyScalar(dist));
  S.anim = { p0: camera.position.clone(), p1: pos, t0: fromT, t1: target, start: performance.now(), dur, done, lift, fov0: camera.fov };
  controls.enabled = false;
}
function enterSeatView() {
  if (!S.sel.length) return;
  if (S.mode === 'overview') S.overviewCam = { pos: camera.position.clone(), target: controls.target.clone() };
  const e = eyeFor(S.sel[Math.floor(S.sel.length / 2)]);
  pin.visible = false; S.mode = 'flying';
  const i0 = S.sel[Math.floor(S.sel.length / 2)], L = S.L;
  const behind = new THREE.Vector3(L.X[i0] + L.NX[i0] * 2.6, L.Y[i0] + 2.3, L.Z[i0] + L.NZ[i0] * 2.6);
  const settle = () => flyTo(e.pos, e.target, prefersReduced ? 1 : 1300, () => {
    S.mode = 'seat'; document.body.classList.add('seat-mode');
    const d = e.target.clone().sub(e.pos);
    S.look = { pos: e.pos, yaw: Math.atan2(d.x, d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)), dyaw: 0, dpitch: 0 };
    $('#viewCaption').hidden = false; showSeatPanel();
  });
  flyTo(behind, e.target, prefersReduced ? 1 : 2100, () => { S.pause = performance.now() + (prefersReduced ? 0 : 900); S.afterPause = settle; }, S.outer * 0.12);
  camera.userData.fovTarget = 62;
}
function exitSeatView() {
  if (S.mode !== 'seat') return;
  const ov = S.overviewCam || overviewPose();
  S.mode = 'flying'; S.look = null; document.body.classList.remove('seat-mode'); $('#viewCaption').hidden = true;
  camera.userData.fovTarget = 50;
  flyTo(ov.pos, ov.target, prefersReduced ? 1 : 1700, () => {
    S.mode = 'overview'; controls.target.copy(ov.target); controls.enabled = !S.cine; pin.visible = S.sel.length > 0; showSeatPanel();
  }, S.outer * 0.1);
}

function findBest(qty, budget) {
  const L = S.L; let best = -1, score = -Infinity;
  for (let i = 0; i + qty <= L.count; i++) {
    if (L.SOLD[i] || L.PRICE[i] > budget) continue;
    let ok = true;
    for (let k = 1; k < qty; k++) { const j = i + k; if (L.SOLD[j] || L.SEC[j] !== L.SEC[i] || L.ROW[j] !== L.ROW[i] || L.PRICE[j] > budget) { ok = false; break; } }
    if (!ok) continue;
    let sc = 0; for (let k = 0; k < qty; k++) sc += L.PRICE[i + k];
    sc += Math.min(L.Y[i], 9) * 0.6 - Math.hypot(L.X[i] - S.focus.x, L.Z[i] - S.focus.z) * 0.03; // ties: a little elevation beats row A
    if (sc > score) { score = sc; best = i; }
  }
  return best < 0 ? null : Array.from({ length: qty }, (_, k) => best + k);
}

// ───────────────────────── picking ─────────────────────────
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function pickSeat(cx, cy) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(S.pickables, false)[0];
  if (!hit) return -1;
  const L = S.L, h = hit.point; let best = -1, bd = 36;
  for (let i = 0; i < L.count; i++) { const dx = L.X[i] - h.x, dy = L.Y[i] - h.y, dz = L.Z[i] - h.z, d = dx * dx + dy * dy + dz * dz; if (d < bd) { bd = d; best = i; } }
  return best;
}
function setHoverSection(si) {
  if (si === S.hoverSec) return;
  const L = S.L, selSet = new Set(S.sel);
  const recolor = (sec, on) => { if (sec < 0) return; for (const i of L.sections[sec].idx) { if (selSet.has(i)) continue; seatColor(i, tmpC); if (on && !L.SOLD[i]) tmpC.lerp(COL.hover, 0.38); paint(i, tmpC); } };
  recolor(S.hoverSec, false); recolor(si, true); S.hoverSec = si; S.seats.instanceColor.needsUpdate = true;
}

let down = null, hoverQueued = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: 0 }; if (S.mode === 'seat') canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  if (down) {
    const dx = e.clientX - down.x, dy = e.clientY - down.y; down.moved = Math.max(down.moved, Math.hypot(dx, dy));
    const mx = e.clientX - down.lx, my = e.clientY - down.ly; down.lx = e.clientX; down.ly = e.clientY;
    if (S.mode === 'seat' && S.look) { S.look.dyaw += mx * 0.0035; S.look.dpitch = Math.max(-0.6, Math.min(0.5, S.look.dpitch + my * 0.003)); }
    return;
  }
  if (S.mode !== 'overview' || e.pointerType === 'touch') return;
  hoverQueued = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointerleave', () => { if (S.mode === 'overview' && S.L) { setHoverSection(-1); $('#tooltip').hidden = true; } });
canvas.addEventListener('pointerup', e => {
  const d = down; down = null;
  if (!d || d.moved > 6 || S.cine || S.mode === 'flying') return;
  const i = pickSeat(e.clientX, e.clientY);
  if (i < 0) return;
  if (S.L.SOLD[i]) { toast('That seat is sold. Pick a highlighted one.'); return; }
  select([i]);
  if (S.mode === 'seat') { const e2 = eyeFor(i); S.mode = 'flying'; flyTo(e2.pos, e2.target, 900, () => { S.mode = 'seat'; const dd = e2.target.clone().sub(e2.pos); S.look = { pos: e2.pos, yaw: Math.atan2(dd.x, dd.z), pitch: Math.atan2(dd.y, Math.hypot(dd.x, dd.z)), dyaw: 0, dpitch: 0 }; showSeatPanel(); }); }
});
canvas.addEventListener('wheel', e => { if (S.mode === 'seat') { e.preventDefault(); camera.fov = Math.max(22, Math.min(80, camera.fov + e.deltaY * 0.03)); camera.userData.fovTarget = camera.fov; camera.updateProjectionMatrix(); } }, { passive: false });

function processHover() {
  if (!hoverQueued || S.mode !== 'overview' || !S.L) return;
  const { x, y } = hoverQueued; hoverQueued = null;
  const i = pickSeat(x, y), tt = $('#tooltip');
  if (i < 0) { setHoverSection(-1); tt.hidden = true; canvas.style.cursor = ''; return; }
  const si = S.L.SEC[i], sec = S.L.sections[si]; setHoverSection(si);
  const cur = currency(S.venue);
  tt.innerHTML = `<b>Section ${sec.label}</b>${sec.club ? ' · Club' : ''}<br>${sec.avail ? `from ${cur}${sec.min} · ${fmt(sec.avail)} left` : 'Sold out'}`;
  tt.style.transform = `translate(${x + 14}px, ${y + 14}px)`; tt.hidden = false; canvas.style.cursor = 'pointer';
}

// ───────────────────────── cinematic mode (for screen-recorded clips) ─────────────────────────
function startCine() {
  S.cine = { phase: 'idle', until: 0, n: 0 }; document.body.classList.add('cine');
  clearSelection(); if (S.mode === 'seat') { S.mode = 'overview'; S.look = null; }
  cineStep();
}
function stopCine() {
  if (!S.cine) return; S.cine = null; document.body.classList.remove('cine'); controls.autoRotate = false;
  if (S.mode !== 'flying') controls.enabled = S.mode === 'overview';
}
function cineStep() {
  const c = S.cine; if (!c) return;
  const ov = overviewPose(); camera.position.copy(ov.pos.clone().multiplyScalar(1.35)); controls.target.copy(ov.target);
  controls.enabled = true; controls.autoRotate = true; controls.autoRotateSpeed = 1.1; controls.update();
  c.phase = 'orbit'; c.until = performance.now() + 5500;
}
function cineTick(now) {
  const c = S.cine; if (!c || now < c.until) return;
  if (c.phase === 'orbit') {
    controls.autoRotate = false;
    const L = S.L, budget = L.bands[2] + (L.priceMax - L.bands[2]) * 0.5;
    const sel = findBest(1, budget) || [0];
    const pool = []; for (let i = 0; i < L.count; i += 7) if (!L.SOLD[i] && L.PRICE[i] >= L.bands[1] && L.PRICE[i] <= budget) pool.push(i);
    select(pool.length ? [pool[Math.floor(Math.random() * pool.length)]] : sel);
    c.phase = 'dive'; c.until = Infinity;
    S.overviewCam = { pos: camera.position.clone(), target: controls.target.clone() };
    enterSeatView();
    const wait = () => { if (!S.cine) return; if (S.mode === 'seat') { c.phase = 'hold'; c.until = performance.now() + 4200; } else requestAnimationFrame(wait); };
    wait();
  } else if (c.phase === 'hold') {
    c.phase = 'next'; c.until = Infinity;
    const list = VENUES.filter(v => v.region === S.region);
    const idx = list.findIndex(v => v.id === S.venue.id), next = list[(idx + 1) % list.length];
    if (params.get('loop') === '0') { exitSeatView(); stopCine(); return; }
    loadVenue(next.id, { keepCine: true });
  }
}

// ───────────────────────── embedding (ticketing partners) ─────────────────────────
function post(msg) { if (window.parent !== window) try { window.parent.postMessage({ source: 'vantage-seatview', ...msg }, '*'); } catch { /* ignore */ } }
window.addEventListener('message', e => {
  const d = e.data; if (!d || d.target !== 'vantage-seatview') return;
  if (d.type === 'load' && d.venue) loadVenue(d.venue);
  if (d.type === 'best' && S.L) { const s = findBest(d.qty || 1, d.budget || Infinity); if (s) { select(s); enterSeatView(); } }
});

// ───────────────────────── wiring ─────────────────────────
let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2600); }
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-region]').forEach(b => b.addEventListener('click', () => {
  S.region = b.dataset.region; document.querySelectorAll('[data-region]').forEach(x => x.setAttribute('aria-selected', x === b)); renderList();
}));
$('#search').addEventListener('input', e => { S.query = e.target.value; renderList(); });
$('#list').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (!b) return; document.body.classList.remove('menu-open'); loadVenue(b.dataset.id); });
$('#menuBtn').addEventListener('click', () => document.body.classList.toggle('menu-open'));
$('#budget').addEventListener('input', updateBudgetLabel);
$('#findBtn').addEventListener('click', () => {
  const qty = +$('#qty').value, budget = +$('#budget').value, s = findBest(qty, budget);
  if (!s) { toast(`No ${qty} seats together under ${currency(S.venue)}${budget}. Raise the budget.`); return; }
  if (S.mode === 'seat') { select(s); const e = eyeFor(s[Math.floor(s.length / 2)]); S.mode = 'flying'; flyTo(e.pos, e.target, 1200, () => { S.mode = 'seat'; const d = e.target.clone().sub(e.pos); S.look = { pos: e.pos, yaw: Math.atan2(d.x, d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)), dyaw: 0, dpitch: 0 }; showSeatPanel(); }); }
  else { select(s); enterSeatView(); }
});
$('#viewBtn').addEventListener('click', enterSeatView);
$('#backBtn').addEventListener('click', exitSeatView);
$('#closeBtn').addEventListener('click', () => { if (S.mode === 'seat') exitSeatView(); clearSelection(); });
$('#buyBtn').addEventListener('click', () => { post({ type: 'checkout', venue: S.venue.id, seats: S.sel.map(i => seatInfo(i)) }); toast('Demo checkout: the selection goes to the venue’s ticketing system.'); });
$('#cineBtn').addEventListener('click', () => S.cine ? stopCine() : startCine());
$('#cineExit').addEventListener('click', stopCine);
addEventListener('keydown', e => { if (e.key === 'Escape') { if (S.cine) stopCine(); else if (S.mode === 'seat') exitSeatView(); } });
if (params.get('embed') === '1') document.body.classList.add('embed');

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

const tmpV = new THREE.Vector3();
function frame(now) {
  requestAnimationFrame(frame);
  if (canvas.width !== Math.floor(canvas.clientWidth * renderer.getPixelRatio())) resize();
  if (S.pause && now >= S.pause) { const f = S.afterPause; S.pause = 0; S.afterPause = null; f(); }
  if (S.anim) {
    const a = S.anim, t = Math.min(1, (now - a.start) / a.dur), k = ease(t);
    camera.position.lerpVectors(a.p0, a.p1, k); camera.position.y += Math.sin(Math.PI * k) * a.lift;
    tmpV.lerpVectors(a.t0, a.t1, k); camera.lookAt(tmpV);
    const ft = camera.userData.fovTarget || 50; camera.fov = a.fov0 + (ft - a.fov0) * k; camera.updateProjectionMatrix();
    if (t >= 1) { S.anim = null; a.done && a.done(); }
  } else if (S.mode === 'seat' && S.look) {
    const l = S.look;
    if (S.cine) l.dyaw = Math.sin(now / 1600) * 0.22;
    const yaw = l.yaw + l.dyaw, pitch = l.pitch + l.dpitch;
    camera.position.copy(l.pos);
    camera.lookAt(tmpV.set(l.pos.x + Math.sin(yaw) * Math.cos(pitch), l.pos.y + Math.sin(pitch), l.pos.z + Math.cos(yaw) * Math.cos(pitch)));
  } else if (S.mode === 'overview') {
    controls.update(); processHover();
  }
  if (pin.visible) pin.children[1].position.y = 15.5 + Math.sin(now / 300) * 0.6;
  cineTick(now);
  renderer.render(scene, camera);
}

// boot
const start = (location.hash.slice(1) || params.get('venue') || 'wembley');
const startVenue = VENUES.find(v => v.id === start) || VENUES[0];
S.region = startVenue.region;
document.querySelectorAll('[data-region]').forEach(x => x.setAttribute('aria-selected', x.dataset.region === S.region));
resize(); loadVenue(startVenue.id);
requestAnimationFrame(frame);
if (params.get('tour') === '1') setTimeout(startCine, 600);
addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id && (!S.venue || id !== S.venue.id) && VENUES.some(v => v.id === id)) loadVenue(id); });
