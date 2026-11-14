/* WCA-style RANDOM-STATE scrambles for KKK Timer
   3x3: random cube state + Kociemba two-phase solver, scramble = inverse of solution
   2x2: random state + exact BFS table, scramble = inverse of optimal solution (min 4 moves)
   Exposes: WCA.scramble333(), WCA.scramble222() */
(function () {
  const FN = 'URFDLB', PW = ['', '2', "'"];
  // Cubie model. Corners: URF UFL ULB UBR DFR DLF DBL DRB. Edges: UR UF UL UB DR DF DL DB FR FL BL BR
  const MV = [
    { cp:[3,0,1,2,4,5,6,7], co:[0,0,0,0,0,0,0,0], ep:[3,0,1,2,4,5,6,7,8,9,10,11], eo:[0,0,0,0,0,0,0,0,0,0,0,0] },     // U
    { cp:[4,1,2,0,7,5,6,3], co:[2,0,0,1,1,0,0,2], ep:[8,1,2,3,11,5,6,7,4,9,10,0], eo:[0,0,0,0,0,0,0,0,0,0,0,0] },     // R
    { cp:[1,5,2,3,0,4,6,7], co:[1,2,0,0,2,1,0,0], ep:[0,9,2,3,4,8,6,7,1,5,10,11], eo:[0,1,0,0,0,1,0,0,1,1,0,0] },     // F
    { cp:[0,1,2,3,5,6,7,4], co:[0,0,0,0,0,0,0,0], ep:[0,1,2,3,5,6,7,4,8,9,10,11], eo:[0,0,0,0,0,0,0,0,0,0,0,0] },     // D
    { cp:[0,2,6,3,4,1,5,7], co:[0,1,2,0,0,2,1,0], ep:[0,1,10,3,4,5,9,7,8,2,6,11], eo:[0,0,0,0,0,0,0,0,0,0,0,0] },     // L
    { cp:[0,1,3,7,4,5,2,6], co:[0,0,1,2,0,0,2,1], ep:[0,1,2,11,4,5,6,10,8,9,3,7], eo:[0,0,0,1,0,0,0,1,0,0,1,1] }      // B
  ];
  const ID = () => ({ cp:[0,1,2,3,4,5,6,7], co:Array(8).fill(0), ep:[0,1,2,3,4,5,6,7,8,9,10,11], eo:Array(12).fill(0) });
  function mul(a, b) {
    const r = { cp:[], co:[], ep:[], eo:[] };
    for (let i = 0; i < 8; i++) { const p = b.cp[i]; r.cp[i] = a.cp[p]; r.co[i] = (a.co[p] + b.co[i]) % 3; }
    for (let i = 0; i < 12; i++) { const p = b.ep[i]; r.ep[i] = a.ep[p]; r.eo[i] = (a.eo[p] + b.eo[i]) & 1; }
    return r;
  }
  const M18 = [];                       // index = face*3 + (0:quarter, 1:half, 2:prime)
  MV.forEach(q => { const h = mul(q, q); M18.push(q, h, mul(h, q)); });

  const rnd = n => (Math.random() * n) | 0;
  function permIdx(a) { const n = a.length; let r = 0; for (let i = 0; i < n - 1; i++) { let c = 0; for (let j = i + 1; j < n; j++) if (a[j] < a[i]) c++; r = r * (n - i) + c; } return r; }
  function idxPerm(x, n) { const d = []; d[n - 1] = 0; for (let i = n - 2; i >= 0; i--) { d[i] = x % (n - i); x = (x - d[i]) / (n - i); } const av = [...Array(n).keys()], r = []; for (let i = 0; i < n; i++) r.push(av.splice(d[i], 1)[0]); return r; }
  const parity = a => { let p = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) p ^= 1; return p; };
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } }
  function bfs(size, start, nm, nxt) {
    const d = new Uint8Array(size).fill(255), q = new Int32Array(size); let h = 0, t = 0;
    d[start] = 0; q[t++] = start;
    while (h < t) { const s = q[h++], dd = d[s] + 1; for (let m = 0; m < nm; m++) { const n = nxt(s, m); if (d[n] === 255) { d[n] = dd; q[t++] = n; } } }
    return d;
  }
  function mkTable(n, moves, set, get) {
    const nm = moves.length, t = new Uint16Array(n * nm);
    for (let x = 0; x < n; x++) { const c = ID(); set(c, x); for (let m = 0; m < nm; m++) t[x * nm + m] = get(mul(c, moves[m])); }
    return t;
  }
  const invert = sol => sol.slice().reverse().map(m => ((m / 3) | 0) * 3 + 2 - (m % 3));
  const fmt = sol => sol.map(m => FN[(m / 3) | 0] + PW[m % 3]).join(' ');

  /* ---------------- 3x3 two-phase ---------------- */
  const masks = [], sliceOf = new Int16Array(4096).fill(-1);
  for (let m = 0; m < 4096; m++) { let b = 0; for (let i = 0; i < 12; i++) b += (m >> i) & 1; if (b === 4) { sliceOf[m] = masks.length; masks.push(m); } }
  const SOLVED_SL = sliceOf[3840];
  const getTw = c => { let t = 0; for (let i = 0; i < 7; i++) t = t * 3 + c.co[i]; return t; };
  const setTw = (c, t) => { let s = 0; for (let i = 6; i >= 0; i--) { c.co[i] = t % 3; s += c.co[i]; t = (t / 3) | 0; } c.co[7] = (3 - s % 3) % 3; };
  const getFl = c => { let t = 0; for (let i = 0; i < 11; i++) t = t * 2 + c.eo[i]; return t; };
  const setFl = (c, t) => { let s = 0; for (let i = 10; i >= 0; i--) { c.eo[i] = t & 1; s += c.eo[i]; t >>= 1; } c.eo[11] = s & 1; };
  const getSl = c => { let m = 0; for (let i = 0; i < 12; i++) if (c.ep[i] >= 8) m |= 1 << i; return sliceOf[m]; };
  const setSl = (c, x) => { const m = masks[x]; let a = 0, b = 8; for (let i = 0; i < 12; i++) c.ep[i] = (m >> i) & 1 ? b++ : a++; };
  const P2M = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];
  let T = null;
  function build3() {
    if (T) return; T = {};
    const m18 = M18, m10 = P2M.map(i => M18[i]);
    T.tw = mkTable(2187, m18, setTw, getTw);
    T.fl = mkTable(2048, m18, setFl, getFl);
    T.sl = mkTable(495, m18, setSl, getSl);
    T.cp = mkTable(40320, m10, (c, x) => { c.cp = idxPerm(x, 8); }, c => permIdx(c.cp));
    T.ep = mkTable(40320, m10, (c, x) => { c.ep = idxPerm(x, 8).concat([8, 9, 10, 11]); }, c => permIdx(c.ep.slice(0, 8)));
    T.sp = mkTable(24, m10, (c, x) => { c.ep = [0,1,2,3,4,5,6,7].concat(idxPerm(x, 4).map(v => v + 8)); }, c => permIdx(c.ep.slice(8).map(v => v - 8)));
    T.p1a = bfs(2187 * 495, 0 * 495 + SOLVED_SL, 18, (s, m) => T.tw[((s / 495) | 0) * 18 + m] * 495 + T.sl[(s % 495) * 18 + m]);
    T.p1b = bfs(2048 * 495, 0 * 495 + SOLVED_SL, 18, (s, m) => T.fl[((s / 495) | 0) * 18 + m] * 495 + T.sl[(s % 495) * 18 + m]);
    T.p2a = bfs(40320 * 24, 0, 10, (s, m) => T.cp[((s / 24) | 0) * 10 + m] * 24 + T.sp[(s % 24) * 10 + m]);
    T.p2b = bfs(40320 * 24, 0, 10, (s, m) => T.ep[((s / 24) | 0) * 10 + m] * 24 + T.sp[(s % 24) * 10 + m]);
  }
  function solve3(c) {
    const tw = getTw(c), fl = getFl(c), sl = getSl(c);
    let path, p2, res, maxLen;
    function s2(cp, ep, sp, d, lf) {
      if (d === 0) return cp === 0 && ep === 0 && sp === 0;
      for (let k = 0; k < 10; k++) {
        const m = P2M[k], f = (m / 3) | 0;
        if (f === lf || f === lf - 3) continue;
        const ncp = T.cp[cp * 10 + k], nep = T.ep[ep * 10 + k], nsp = T.sp[sp * 10 + k];
        if (T.p2a[ncp * 24 + nsp] > d - 1 || T.p2b[nep * 24 + nsp] > d - 1) continue;
        p2.push(m); if (s2(ncp, nep, nsp, d - 1, f)) return true; p2.pop();
      }
      return false;
    }
    function endP1() {
      let cc = c; for (const m of path) cc = mul(cc, M18[m]);
      const cp = permIdx(cc.cp), ep = permIdx(cc.ep.slice(0, 8)), sp = permIdx(cc.ep.slice(8).map(v => v - 8));
      const lf = path.length ? (path[path.length - 1] / 3) | 0 : -1;
      for (let d2 = 0; d2 <= maxLen - path.length; d2++) {
        p2 = []; if (s2(cp, ep, sp, d2, lf)) { res = path.concat(p2); return true; }
      }
      return false;
    }
    function s1(t, f, s, d, lf) {
      if (d === 0) return t === 0 && f === 0 && s === SOLVED_SL && endP1();
      for (let m = 0; m < 18; m++) {
        const fc = (m / 3) | 0;
        if (fc === lf || fc === lf - 3) continue;
        const nt = T.tw[t * 18 + m], nf = T.fl[f * 18 + m], ns = T.sl[s * 18 + m];
        if (T.p1a[nt * 495 + ns] > d - 1 || T.p1b[nf * 495 + ns] > d - 1) continue;
        path.push(m); if (s1(nt, nf, ns, d - 1, fc)) return true; path.pop();
      }
      return false;
    }
    for (maxLen = 21; maxLen < 30; maxLen++)
      for (let d1 = 0; d1 <= 12 && d1 <= maxLen; d1++) { path = []; if (s1(tw, fl, sl, d1, -1)) return res; }
    return [];
  }
  function randState333() {
    const c = ID(); shuffle(c.cp); shuffle(c.ep);
    if (parity(c.cp) !== parity(c.ep)) [c.ep[0], c.ep[1]] = [c.ep[1], c.ep[0]];
    let s = 0; for (let i = 0; i < 7; i++) { c.co[i] = rnd(3); s += c.co[i]; } c.co[7] = (3 - s % 3) % 3;
    s = 0; for (let i = 0; i < 11; i++) { c.eo[i] = rnd(2); s += c.eo[i]; } c.eo[11] = s & 1;
    return c;
  }
  function scramble333() {
    build3();
    for (;;) { const sol = solve3(randState333()); if (sol.length >= 2) return fmt(invert(sol)); }
  }

  /* ---------------- 2x2 (DBL corner fixed, moves R U F) ---------------- */
  const M2 = [0, 1, 2, 3, 4, 5, 6, 7, 8];            // U R F in M18 order: U=0..2, R=3..5, F=6..8
  const m2c = M2.map(i => M18[i]);
  let D2 = null, pM, tM;
  const gp = c => permIdx([0, 1, 2, 3, 4, 5, 7].map(i => c.cp[i] > 6 ? c.cp[i] - 1 : c.cp[i]));
  const sp7 = (c, x) => { const a = idxPerm(x, 7).map(v => v >= 6 ? v + 1 : v); c.cp = [a[0], a[1], a[2], a[3], a[4], a[5], 6, a[6]]; };
  const gt = c => { let t = 0; for (let i = 0; i < 6; i++) t = t * 3 + c.co[i]; return t; };
  const st = (c, t) => { let s = 0; for (let i = 5; i >= 0; i--) { c.co[i] = t % 3; s += c.co[i]; t = (t / 3) | 0; } c.co[7] = (3 - s % 3) % 3; };
  function build2() {
    if (D2) return;
    pM = mkTable(5040, m2c, sp7, gp); tM = mkTable(729, m2c, st, gt);
    D2 = bfs(5040 * 729, 0, 9, (s, m) => pM[((s / 729) | 0) * 9 + m] * 729 + tM[(s % 729) * 9 + m]);
  }
  function scramble222() {
    build2();
    for (;;) {
      let p = rnd(5040), t = rnd(729), D = D2[p * 729 + t];
      if (D < 4) continue;
      const sol = [];
      while (D > 0) for (let m = 0; m < 9; m++) {
        const np = pM[p * 9 + m], nt = tM[t * 9 + m];
        if (D2[np * 729 + nt] === D - 1) { sol.push(M2[m]); p = np; t = nt; D--; break; }
      }
      return fmt(invert(sol));
    }
  }

  window.WCA = { scramble333, scramble222, _t: { mul, M18, ID, solve3, randState333, build3 } };
})();
