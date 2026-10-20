if (typeof BABYLON === 'undefined') throw new Error('babylon.js non caricato');
if (typeof MACHINE === 'undefined') throw new Error('MACHINE non definito (errore di sintassi nel blocco MACHINE: guarda gli errori sopra in console)');
const DEFAULT_MACHINE = JSON.parse(JSON.stringify(MACHINE));   // copia della macchina precaricata, per "Macchina predefinita"
step('avvio', `Babylon ${BABYLON.Engine.Version} · MACHINE "${MACHINE.title}": ${MACHINE.axes.length} assi e ${MACHINE.gears.length} ingranaggi definiti (tutte le varianti)`);

/* =====================================================================
   0. STRUTTURA DATI  (tutto ciò che serve per costruire e far girare la macchina)
   ---------------------------------------------------------------------
   Per aggiungere un asse o un ingranaggio basta aggiungere un elemento in "axes" o in "gears".
   Sistema di riferimento del modello: X destra, Y profondità (verso il fondo), Z alto. Millimetri.
   Ovunque un numero è atteso si può scrivere un'espressione tra virgolette (es. "gears.gear_F.pr+4+8"):
     • costanti di "consts" e valori dei cursori di "controls" (per nome)
     • gears[ID].z, gears[ID].m, gears[ID].pr, gears[ID].d  = denti, modulo, raggio primitivo, diametro dell'ingranaggio ID (anche gears.ID.pr)
     • axes[ID].ox, axes[ID].oy, axes[ID].oz = coordinate dell'origine dell'asse ID (dopo il posizionamento) (anche axes.ID.ox)
     • pi, sin, cos, tan, atan, atan2, sqrt, abs, min, max
   Ogni elemento può avere  variant:{nome:valore}  e viene incluso solo se quella variante è attiva.
   Ingranaggi conici senza ingranaggio accoppiato (nessun meshWith): aggiungere  "delta": gradi  (semi-angolo del cono primitivo).
   Asse con  "rest":"carrier": se nulla ne determina la velocità, resta solidale al suo carrier.
*/

/* =====================================================================
   1. UTILITÀ: vettori, valutatore di espressioni, formattazione
   ===================================================================== */
const PI = Math.PI, cos = Math.cos, sin = Math.sin;
const $ = id => document.getElementById(id);
const esc = v => String(v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));  // il JSON può arrivare da un file esterno: niente HTML dai suoi testi

const fmt = (v, d) => v.toLocaleString('it', { maximumFractionDigits: d });
const fmtV = v => '(' + v.map(x => Number.isFinite(x) ? +x.toFixed(2) : x).join(', ') + ')';

const V = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]),
  unit: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  perp: (a, d) => V.sub(a, V.mul(d, V.dot(a, d))),
  anyPerp: d => V.unit(V.cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])),
  toB: a => [a[0], a[2], -a[1]]
};

class NotPlaced extends Error {}

function makeEvaluator(M, state, resolving, gTeeth, gModule, gRadius) {
  const FN = { sin: Math.sin, cos: Math.cos, tan: Math.tan, atan: Math.atan, atan2: Math.atan2, sqrt: Math.sqrt, abs: Math.abs, min: Math.min, max: Math.max };
  const cache = {};

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const ch = src[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let j = i + 1;
        let str = "";
        while (j < src.length) {
          const c = src[j];
          if (c === "\\" && j + 1 < src.length) {
            const nxt = src[j+1];
            if (nxt === quote || nxt === "\\") { str += nxt; j += 2; continue; }
          }
          if (c === quote) break;
          str += c; j++;
        }
        if (j >= src.length) throw new Error('Stringa non chiusa: ' + src);
        tokens.push({type:'string', value:str});
        i = j + 1;
        continue;
      }
      if (/[0-9]/.test(ch) || (ch === '.' && i+1 < src.length && /[0-9]/.test(src[i+1]))) {
        const m = src.slice(i).match(/^\d*\.?\d+(?:[eE][+-]?\d+)?/);
        if (m) {
          tokens.push({type:'number', value:parseFloat(m[0])});
          i += m[0].length;
          continue;
        }
      }
      if (/[A-Za-z_]/.test(ch)) {
        let j = i;
        while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
        tokens.push({type:'identifier', name:src.slice(i,j)});
        i = j;
        continue;
      }
      if (',.+-*/^()[]'.indexOf(ch) >= 0) {
        tokens.push({type:'op', value:ch});
        i++;
        continue;
      }
      throw new Error('Carattere inatteso: ' + ch + ' in ' + src);
    }
    return tokens;
  }

  class Parser {
    constructor(tokens){ this.tokens=tokens; this.pos=0; }
    peek(){ return this.tokens[this.pos]; }
    consume(){ return this.tokens[this.pos++]; }
    parseExpression(){ return this.parseAddSub(); }
    parseAddSub(){
      let left=this.parseMulDiv();
      while (this.peek() && this.peek().type==='op' && (this.peek().value==='+'||this.peek().value==='-')){
        const op=this.consume().value;
        const right=this.parseMulDiv();
        left={type:'bin', op, left, right};
      }
      return left;
    }
    parseMulDiv(){
      let left=this.parseUnary();
      while (this.peek() && this.peek().type==='op' && (this.peek().value==='*'||this.peek().value==='/')){
        const op=this.consume().value;
        const right=this.parseUnary();
        left={type:'bin', op, left, right};
      }
      return left;
    }
    parseUnary(){
      const t=this.peek();
      if (t && t.type==='op' && (t.value==='+'||t.value==='-')){
        const op=this.consume().value;
        const operand=this.parseUnary();
        return {type:'unary', op, operand};
      }
      return this.parsePower();
    }
    parsePower(){
      let left=this.parsePostfix();
      const t=this.peek();
      if (t && t.type==='op' && t.value==='^'){
        this.consume();
        const right=this.parseUnary();
        left={type:'bin', op:'^', left, right};
      }
      return left;
    }
    parsePostfix(){
      let node=this.parsePrimary();
      while (true){
        const t=this.peek();
        if (!t) break;
        if (t.type==='op' && t.value==='.'){
          this.consume();
          const id=this.peek();
          if (!id || id.type!=='identifier') throw new Error('Atteso identificatore dopo .');
          this.consume();
          node={type:'member_dot', base:node, prop:id.name};
        } else if (t.type==='op' && t.value==='['){
          this.consume();
          const key=this.parseExpression();
          const closing=this.peek();
          if (!closing || closing.type!=='op' || closing.value!==']') throw new Error('Atteso ]');
          this.consume();
          node={type:'member_bracket', base:node, key};
        } else break;
      }
      return node;
    }
    parsePrimary(){
      const t=this.peek();
      if (!t) throw new Error('Espressione incompleta');
      if (t.type==='number'){ this.consume(); return {type:'number', value:t.value}; }
      if (t.type==='string'){ this.consume(); return {type:'string', value:t.value}; }
      if (t.type==='identifier'){
        const name=t.name;
        this.consume();
        const nxt=this.peek();
        if (nxt && nxt.type==='op' && nxt.value==='('){
          this.consume();
          const args=[];
          if (!(this.peek() && this.peek().type==='op' && this.peek().value===')')){
            while (true){
              args.push(this.parseExpression());
              const sep=this.peek();
              if (sep && sep.type==='op' && sep.value===','){ this.consume(); continue; }
              break;
            }
          }
          const closing=this.peek();
          if (!closing || closing.type!=='op' || closing.value!==')') throw new Error('Atteso )');
          this.consume();
          return {type:'call', name, args};
        }
        return {type:'identifier', name};
      }
      if (t.type==='op' && t.value==='('){
        this.consume();
        const expr=this.parseExpression();
        const closing=this.peek();
        if (!closing || closing.type!=='op' || closing.value!==')') throw new Error('Atteso )');
        this.consume();
        return expr;
      }
      throw new Error('Token inatteso: '+JSON.stringify(t));
    }
  }

  function parse(src){
    if (cache[src]) return cache[src];
    const tokens=tokenize(src);
    const parser=new Parser(tokens);
    const ast=parser.parseExpression();
    if (parser.pos !== tokens.length) throw new Error('Espressione non completa: ' + src);
    cache[src]=ast;
    return ast;
  }

  function evalNode(node, extra){
    switch(node.type){
      case 'number': return node.value;
      case 'string': return node.value;
      case 'identifier': {
        const name=node.name;
        if (name==='gears') return {__type:'gears_proxy'};
        if (name==='axes') return {__type:'axes_proxy'};
        if (name==='pi') return PI;
        if (extra && name in extra) return extra[name];
        if (name in state.params) return state.params[name];
        if (name in M.constVal) return M.constVal[name];
        if (name in MACHINE.consts){
          if (resolving.has(name)) throw new Error('Costante circolare: '+name);
          resolving.add(name);
          try {
            const v = ev(MACHINE.consts[name], extra);
            M.constVal[name]=v;
            return v;
          } finally { resolving.delete(name); }
        }
        throw new Error('Simbolo sconosciuto: '+name);
      }
      case 'member_dot': {
        const base=evalNode(node.base, extra);
        const prop=node.prop;
        if (base && base.__type==='gears_proxy'){
          const g=M.gearBy[prop];
          if (!g) throw new Error('Ingranaggio sconosciuto (o non attivo in questa variante): '+prop);
          return {__type:'gear', id:prop, ref:g};
        }
        if (base && base.__type==='gear'){
          const g=base.ref;
          if (prop==='z') return gTeeth(g);
          if (prop==='m') return gModule(g);
          if (prop==='pr') return gRadius(g);
          if (prop==='d') return 2*gRadius(g);
          throw new Error('Proprietà ingranaggio sconosciuta: '+prop);
        }
        if (base && base.__type==='axes_proxy'){
          const a=M.axisBy[prop];
          if (!a) throw new Error('Asse sconosciuto (o non attivo in questa variante): '+prop);
          return {__type:'axis', id:prop, ref:a};
        }
        if (base && base.__type==='axis'){
          const a=base.ref;
          if (!a.O) throw new NotPlaced(a.id);
          if (prop==='ox') return a.O[0];
          if (prop==='oy') return a.O[1];
          if (prop==='oz') return a.O[2];
if (prop === 'dx') return a.dir[0];
if (prop === 'dy') return a.dir[1];
if (prop === 'dz') return a.dir[2];
          throw new Error('Proprietà asse sconosciuta: '+prop);
        }
        throw new Error('Accesso . non valido');
      }
      case 'member_bracket': {
        const base=evalNode(node.base, extra);
        let keyVal;
        try { keyVal=evalNode(node.key, extra); }
        catch(e){
          if (node.key.type==='identifier') keyVal=node.key.name;
          else throw e;
        }
        const keyStr = typeof keyVal==='string' ? keyVal : String(keyVal);
        if (base && base.__type==='gears_proxy'){
          const g=M.gearBy[keyStr];
          if (!g) throw new Error('Ingranaggio sconosciuto (o non attivo in questa variante): '+keyStr);
          return {__type:'gear', id:keyStr, ref:g};
        }
        if (base && base.__type==='axes_proxy'){
          const a=M.axisBy[keyStr];
          if (!a) throw new Error('Asse sconosciuto (o non attivo in questa variante): '+keyStr);
          return {__type:'axis', id:keyStr, ref:a};
        }
        if (base && base.__type==='gear'){
          const g=base.ref;
          if (keyStr==='z') return gTeeth(g);
          if (keyStr==='m') return gModule(g);
          if (keyStr==='pr') return gRadius(g);
          if (keyStr==='d') return 2*gRadius(g);
          throw new Error('Proprietà ingranaggio sconosciuta: '+keyStr);
        }
        if (base && base.__type==='axis'){
          const a=base.ref;
          if (!a.O) throw new NotPlaced(a.id);
          if (keyStr==='ox') return a.O[0];
          if (keyStr==='oy') return a.O[1];
          if (keyStr==='oz') return a.O[2];
if (keyStr === 'dx') return a.dir[0];
if (keyStr === 'dy') return a.dir[1];
if (keyStr === 'dz') return a.dir[2];
          throw new Error('Proprietà asse sconosciuta: '+keyStr);
        }
        throw new Error('Accesso [] non valido');
      }
      case 'bin': {
        const l=evalNode(node.left, extra);
        const r=evalNode(node.right, extra);
        switch(node.op){
          case '+': return l+r;
          case '-': return l-r;
          case '*': return l*r;
          case '/': return l/r;
          case '^': return Math.pow(l,r);
          default: throw new Error('Operatore sconosciuto: '+node.op);
        }
      }
      case 'unary': {
        const v=evalNode(node.operand, extra);
        return node.op==='+' ? +v : -v;
      }
      case 'call': {
        const fn=FN[node.name];
        if (!fn) throw new Error('Funzione sconosciuta: '+node.name);
        const args=node.args.map(a=>evalNode(a, extra));
        return fn(...args);
      }
      default: throw new Error('Nodo sconosciuto');
    }
  }

  // Valuta un numero o un'espressione. Gli errori vengono arricchiti con l'espressione e con il contesto (CTX.where).
  function ev(e, extra){
    if (typeof e==='number') return e;
    if (typeof e!=='string') throw new Error('valore non valido (atteso un numero o un\'espressione tra virgolette): ' + JSON.stringify(e) + (CTX.where ? '  [' + CTX.where + ']' : ''));
    try { return evalNode(parse(e), extra); }
    catch (err) {
      if (err instanceof NotPlaced) throw err;
      if (!err.__ctx) { err.message += `  ⟵ espressione "${e}"` + (CTX.where ? `  [${CTX.where}]` : ''); err.__ctx = true; }
      throw err;
    }
  }
  return ev;
}

function template(str, ev, extra) {
  return str.replace(/\{([^{}|]+)(?:\|(\d+))?\}/g, (_, e, d) => fmt(ev(e, extra), d === undefined ? 1 : +d));
}

/* =====================================================================
   2. GEOMETRIA: dentatura a evolvente, ruote cilindriche e coniche, solidi semplici
   ===================================================================== */
const PRESSURE = 20 * PI / 180;
const BACKLASH = 0.05;
const inv = a => Math.tan(a) - a;

function toothProfile(z, m, nFlank) {
  const rp = m * z / 2, rb = rp * cos(PRESSURE), ra = rp + m, rf = rp - 1.25 * m;
  const halfBase = PI / (2 * z) + inv(PRESSURE), rStart = Math.max(rb, rf), pitch = 2 * PI / z;
  const r = [], half = [];
  for (let i = 0; i < nFlank; i++) {
    const q = rStart + (ra - rStart) * i / (nFlank - 1);
    r.push(q);
    half.push(halfBase - inv(Math.acos(Math.min(1, rb / q))) - BACKLASH * m / (2 * rp));
  }
  const out = [];
  for (let i = 0; i < nFlank; i++) out.push([r[i], -half[i]]);
  out.push([ra, 0]);
  for (let i = nFlank - 1; i >= 0; i--) out.push([r[i], half[i]]);
  if (rf < rb) out.push([rf, half[0]]);
  out.push([rf, half[0] + (pitch - 2 * half[0]) / 3], [rf, half[0] + (pitch - 2 * half[0]) * 2 / 3]);
  if (rf < rb) out.push([rf, pitch - half[0]]);
  return out;
}

function loft(A, B, capA, capB) {
  const n = A.length, T = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    T.push([i, j, n + j], [i, n + j, n + i], [2 * n, j, i], [2 * n + 1, n + i, n + j]);
  }
  return { P: [...A, ...B, capA, capB], T };
}

// function spurGear(z, m, rho, w0, w1) {
//   const prof = toothProfile(z, m, z > 120 ? 6 : 8), pitch = 2 * PI / z, A = [], B = [];
//   for (let k = 0; k < z; k++) {
//     for (const [r, d] of prof) {
//       const a = rho + k * pitch + d, x = r * cos(a), y = r * sin(a);
//       A.push([x, y, w0]); B.push([x, y, w1]);
//     }
//   }
//   return loft(A, B, [0, 0, w0], [0, 0, w1]);
// }

function spurGear(z, m, rho, w0, w1, degStart, degEnd) { /* deepseek */
  const prof = toothProfile(z, m, z > 120 ? 6 : 8), pitch = 2 * PI / z;

  // Modalità settore: degStart/degEnd in gradi. Se omessi (o span ≥ 360°) → ruota completa.
  let s, e, sector = false;
  if (degStart !== undefined && degEnd !== undefined) {
    s = degStart * PI / 180;
    e = degEnd   * PI / 180;
    if (e <= s) e += 2 * PI;          // gestisce l'attraversamento di 0°
    if (e - s < 2 * PI - 1e-6) sector = true;
  }

  const A = [], B = [];
  const pushPt = (r, a) => {
    const x = r * cos(a), y = r * sin(a);
    A.push([x, y, w0]); B.push([x, y, w1]);
  };

  if (!sector) {
    // ── Ruota completa (comportamento originale) ──
    for (let k = 0; k < z; k++) {
      for (const [r, d] of prof) {
        pushPt(r, rho + k * pitch + d);
      }
    }
    return loft(A, B, [0, 0, w0], [0, 0, w1]);
  }

  // ── Settore circolare ──
  // Contorno (in ordine antiorario):
  //   origine → (rbase, s) → punti del profilo in (s, e) → (rbase, e) → [chiusura implicita verso l'origine]
  // L'origine è il vertice di chiusura: i due lati radiali dello spicchio si incontrano sull'asse
  // dell'ingranaggio, quindi il settore è pieno (a spicchio) e non anulare.
  // I denti sono inclusi solo se il loro angolo assoluto cade in (s, e); i denti che attraversano
  // il bordo vengono quindi tagliati al bordo stesso (l'ultimo/primo punto utile è il più vicino al bordo).
  const rbase = prof[0][0];

  pushPt(0, 0);        // origine (vertice di chiusura dello spicchio)
  pushPt(rbase, s);    // inizio del bordo esterno

  const kLo = Math.floor((s - rho) / pitch) - 1;
  const kHi = Math.ceil ((e - rho) / pitch) + 1;
  for (let k = kLo; k <= kHi; k++) {
    for (const [r, d] of prof) {
      const a = rho + k * pitch + d;
      if (a > s && a < e) pushPt(r, a);
    }
  }

  pushPt(rbase, e);    // fine del bordo esterno

  return loft(A, B, [0, 0, w0], [0, 0, w1]);
}

function bevelGear(z, m, delta, rho, k0) {
  const R = m * z / 2, wp = R / Math.tan(delta);
  const zVirtual = z / cos(delta), rVirtual = R / cos(delta);
  const prof = toothProfile(zVirtual, m, 8), pitchV = 2 * PI / zVirtual, P = [];
  for (let k = 0; k < z; k++) {
    for (const [r, d] of prof) {
      const t = rho + (k * pitchV + d) / cos(delta);
      const s = r - rVirtual;
      const q = R + s * cos(delta);
      P.push([q * cos(t), q * sin(t), wp - s * sin(delta)]);
    }
  }
  const wMean = P.reduce((a, p) => a + p[2], 0) / P.length;
  return loft(P.map(p => p.map(v => v * k0)), P, [0, 0, k0 * wMean], [0, 0, wMean]);
}

function ringsLoft(rings, capA, capB) {
  const nr = rings.length, n = rings[0].length, P = [], T = [];
  for (const r of rings) P.push(...r);
  const cA = P.length; P.push(capA);
  const cB = P.length; P.push(capB);
  for (let i = 0; i < nr - 1; i++) for (let j = 0; j < n; j++) {
    const j2 = (j + 1) % n, a = i * n + j, b = i * n + j2, c = (i + 1) * n + j2, d = (i + 1) * n + j;
    T.push([a, b, c], [a, c, d]);
  }
  for (let j = 0; j < n; j++) {
    const j2 = (j + 1) % n;
    T.push([cA, j2, j], [cB, (nr - 1) * n + j, (nr - 1) * n + j2]);
  }
  return { P, T };
}

function wormParams(m, q, starts, hand, L) {
  const rp = q * m / 2;
  return { m, rp, ra: rp + m, rr: rp - 1.2 * m, px: PI * m, lead: starts * PI * m, starts, hand, L };
}

function wormRadius(wp, u) {
  const au = Math.abs(u), t = Math.tan(PRESSURE);
  const tipHalf = (wp.px / 2 - 2 * (wp.ra - wp.rp) * t) / 2, rootHalf = (wp.px / 2 + 2 * (wp.rp - wp.rr) * t) / 2;
  if (au <= tipHalf) return wp.ra;
  if (au >= rootHalf) return wp.rr;
  return wp.ra - (au - tipHalf) * (wp.ra - wp.rr) / (rootHalf - tipHalf);
}

function wormSolid(wp, rho, w0, w1) {
  const n = 96, nx = Math.max(2, Math.ceil((w1 - w0) / (wp.px / 20))), wc = (w0 + w1) / 2, k = wp.hand * wp.lead / (2 * PI);
  const rings = [];
  for (let i = 0; i <= nx; i++) {
    const x = w0 + (w1 - w0) * i / nx, ring = [];
    for (let j = 0; j < n; j++) {
      const psi = 2 * PI * j / n;
      let u = x - wc - k * psi; u -= wp.px * Math.round(u / wp.px);
      const r = wormRadius(wp, u), a = rho + psi;
      ring.push([r * cos(a), r * sin(a), x]);
    }
    rings.push(ring);
  }
  return ringsLoft(rings, [0, 0, w0], [0, 0, w1]);
}

const wheelFace = (m, wp) => 1.7 * Math.sqrt(4.5 * m * wp.rp);

function wormWheelSolid(z, m, wp, sg, rho, w0, w1) {
  const rg = z * m / 2, a = wp.rp + rg, t = Math.tan(PRESSURE), e = 0.03 * m;
  const rc = wp.ra + 0.25 * m, rBlank = rg + m;
  const inCutter = (Y, Zc, xt) => {
    const r = Math.hypot(Y, Zc);
    if (r > rc) return false;
    if (r <= wp.rr) return true;
    let u = xt - wp.hand * wp.lead / (2 * PI) * Math.atan2(Zc, Y); u -= wp.px * Math.round(u / wp.px);
    return Math.abs(u) <= wp.px / 4 - (r - wp.rp) * t + e;
  };
  const cut = (r, phiP, zP) => {
    const lim = (a - rc) / r;
    if (lim >= 1) return false;
    const Pm = Math.acos(Math.max(-1, lim)), NS = 90;
    for (let s = 0; s <= NS; s++) {
      const Phi = -Pm + 2 * Pm * s / NS, X = sg * r * Math.sin(Phi);
      if (Math.abs(X) > wp.L / 2) continue;
      if (inCutter(a - r * Math.cos(Phi), sg * zP, X - sg * rg * (Phi - phiP))) return true;
    }
    return false;
  };
  const nPhi = 40, nZ = 17, pitch = 2 * PI / z, rLo = a - rc - 0.5 * m, table = [];
  for (let iz = 0; iz < nZ; iz++) {
    const zP = w0 + (w1 - w0) * iz / (nZ - 1), row = [];
    for (let ip = 0; ip < nPhi; ip++) {
      const phiP = pitch * ip / nPhi;
      let r = rBlank;
      if (cut(rBlank, phiP, zP)) {
        let lo = rLo, hi = rBlank;
        for (let b = 0; b < 16; b++) { const mid = (lo + hi) / 2; if (cut(mid, phiP, zP)) hi = mid; else lo = mid; }
        r = lo;
      }
      row.push(r);
    }
    table.push(row);
  }
  const rings = table.map((row, iz) => {
    const zP = w0 + (w1 - w0) * iz / (nZ - 1), ring = [];
    for (let k = 0; k < z; k++) for (let ip = 0; ip < nPhi; ip++) {
      const ang = rho + (k * nPhi + ip) * 2 * PI / (z * nPhi);
      ring.push([row[ip] * cos(ang), row[ip] * sin(ang), zP]);
    }
    return ring;
  });
  return ringsLoft(rings, [0, 0, w0], [0, 0, w1]);
}

function cylinderSolid(r, w0, w1, n = 32, cx = 0, cy = 0) {
  const A = [], B = [];
  for (let i = 0; i < n; i++) {
    const a = 2 * PI * i / n, x = cx + r * cos(a), y = cy + r * sin(a);
    A.push([x, y, w0]); B.push([x, y, w1]);
  }
  return loft(A, B, [cx, cy, w0], [cx, cy, w1]);
}

function boxSolid(w0, w1, cx, cy, hx, hy) {
  const q = w => [[cx - hx, cy - hy, w], [cx + hx, cy - hy, w], [cx + hx, cy + hy, w], [cx - hx, cy + hy, w]];
  return loft(q(w0), q(w1), [cx, cy, w0], [cx, cy, w1]);
}

function prismSolid(poly, y0, y1) {
  const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length, cw = poly.reduce((a, p) => a + p[1], 0) / poly.length;
  return loft(poly.map(([x, w]) => [x, y0, w]), poly.map(([x, w]) => [x, y1, w]), [cx, y0, cw], [cx, y1, cw]);
}

/* =====================================================================
   3. STATO, VALIDAZIONE DEL JSON e RISOLUZIONE DEL MODELLO
   ===================================================================== */
const state = {
  variants: {}, params: {}, ctrl: {}, inputs: {},
  brakes: {}, groups: {}, driver: null, direction: 1, current: null, timeScale: 1,
  wheelInputs: {  }, wheelOffsets: { }
};

function getIndependentTuning(g){ return g?.def?.independentTuning ?? g?.independentTuning; }
function getTunableGears(M){ return (M.gears?? Object.values(M.gearBy)).filter(g => getIndependentTuning(g)); }
function ensureWheelState(M) {
  for (const g of getTunableGears(M)) {
console.log("Azzero input di ", g);
    state.wheelInputs[g.id]??= { rpm: 0 };
    state.wheelOffsets[g.id]??= 0;
  }
  // pulizia se togli independentTuning dal JSON
  for (const id of Object.keys(state.wheelInputs)) {
    if (!getIndependentTuning(M.gearBy[id])) {
      delete state.wheelInputs[id];
      delete state.wheelOffsets[id];
    }
  }

console.log(M);
}



/* Azzera tutto ciò che dipende dalla macchina (varianti, cursori, input, freni, gruppi visibili, ruota pilotata, selezione).
   Non tocca direzione e velocità del tempo. Gli oggetti vecchi vengono sostituiti, non modificati: chi li ha salvati può ripristinarli. */
function initStateFromMachine() {
  state.variants = {}; state.params = {}; state.ctrl = {}; state.inputs = {}; state.brakes = {}; state.groups = {};
  state.wheelInputs = {}; state.wheelOffsets = {}; state.driver = null; state.current = null;
  for (const k in MACHINE.variants) state.variants[k] = MACHINE.variants[k].active;
  for (const c of MACHINE.controls) {
    state.ctrl[c.id] = {};
    for (const v in c.ranges) state.ctrl[c.id][v] = c.ranges[v].value;
  }
  for (const inp of MACHINE.inputs) state.inputs[inp.id] = { rpm: 0 };
  state.keyOffset = 0;
  state.declination = 0;
  for (const g of MACHINE.groups) state.groups[g.id] = g.visible !== false;
  syncParams();
}

function syncParams() {
  for (const c of MACHINE.controls) state.params[c.id] = state.ctrl[c.id][c.variantKey ? state.variants[c.variantKey] : 'all'];
}
initStateFromMachine();

function isActive(el) {
  return !el.variant || Object.keys(el.variant).every(k => state.variants[k] === el.variant[k]);
}

/* id dell'ingranaggio a cui punta un meshWith (stringa oppure {id:...}) */
const meshId = g => g.meshWith && typeof g.meshWith === 'object' ? g.meshWith.id : g.meshWith;

/* Controllo strutturale del JSON per la variante attiva: riferimenti mancanti, campi obbligatori, tipi non supportati.
   Stampa ogni problema con "fail" (console + riquadro rosso); se ce ne sono, lancia un errore e la costruzione si ferma. */
function validateMachine() {
  const errs = [];
  const E = m => { errs.push(m); fail('json', m); };
  const W = m => warn('json', m);
  const act = l => (l || []).filter(isActive);
  const axes = act(MACHINE.axes), gears = act(MACHINE.gears), links = act(MACHINE.links);
  const axisBy = {}, gearBy = {};
  const isVec = (v, n) => Array.isArray(v) && v.length === n;
  step('json', `Controllo del JSON (variante attiva: ${JSON.stringify(state.variants)})`);

  // varianti: chiavi e valori devono esistere
  const checkVariant = (el, what) => {
    if (!el.variant) return;
    for (const k in el.variant) {
      if (!MACHINE.variants[k]) E(`${what}: "variant" usa la chiave sconosciuta "${k}"`);
      else if (!(el.variant[k] in MACHINE.variants[k].options)) E(`${what}: variant ${k}="${el.variant[k]}" non è fra le opzioni (${Object.keys(MACHINE.variants[k].options).join(', ')})`);
    }
  };
  for (const a of MACHINE.axes) { checkVariant(a, `asse "${a.id}"`); (a.parts || []).forEach((p, i) => checkVariant(p, `asse "${a.id}", parte #${i}`)); }
  for (const g of MACHINE.gears) checkVariant(g, `ingranaggio "${g.id}"`);
  for (const l of MACHINE.links) checkVariant(l, `link "${l.type}"`);
  for (const i of MACHINE.inputs) checkVariant(i, `input "${i.id}"`);
  for (const c of MACHINE.checks || []) checkVariant(c, `check "${c.type}"`);

  // id univoci (nella variante attiva)
  for (const a of axes) { if (!a.id) E('c\'è un asse senza "id"'); else if (axisBy[a.id]) E(`asse duplicato nella variante attiva: "${a.id}"`); else axisBy[a.id] = a; }
  for (const g of gears) { if (!g.id) E('c\'è un ingranaggio senza "id"'); else if (gearBy[g.id]) E(`ingranaggio duplicato nella variante attiva: "${g.id}"`); else gearBy[g.id] = g; }

  // assi
  for (const a of axes) {
    const w = `asse "${a.id}"`;
    if (!isVec(a.dir, 3)) E(`${w}: "dir" deve essere un array di 3 elementi`);
    if (a.view !== undefined && !isVec(a.view, 3)) E(`${w}: "view" deve essere un array di 3 elementi`);
    if (a.rest !== undefined && a.rest !== 'carrier' && a.rest !== 'world') E(`${w}: "rest" può essere solo "carrier" o "world"`);
    if (a.rest === 'carrier' && !a.carrier) W(`${w}: "rest":"carrier" senza "carrier": ignorato`);
    if (a.through !== undefined) {
      const okPt = q => (typeof q === 'string' && axisBy[q]) || isVec(q, 3);
      if (!Array.isArray(a.through) || a.through.length !== 2 || !a.through.every(okPt)) E(`${w}: "through" deve essere [P1, P2] con P = id di un asse oppure [x,y,z]`);
      if (a.carrier !== undefined) E(`${w}: un asse con "through" non può avere "carrier" (la sua posa è calcolata ogni frame)`);
    }
    if (a.spinPerpTo !== undefined) {
      const sp = a.spinPerpTo;
      if (!axisBy[sp.axis]) E(`${w}: spinPerpTo.axis "${sp.axis}" non esiste o non è attivo`);
      if (!(axisBy[sp.line] && axisBy[sp.line].through !== undefined)) E(`${w}: spinPerpTo.line deve riferire un asse con "through" (qui: "${sp.line}")`);
    }
    if (a.alignWith !== undefined && !(axisBy[a.alignWith] && axisBy[a.alignWith].through !== undefined)) E(`${w}: "alignWith" deve riferire un asse con "through" (qui: "${a.alignWith}")`);
    if (!a.place) { E(`${w}: manca "place"`); continue; }
    const p = a.place, kinds = ['at', 'coaxial', 'offset', 'byMesh', 'byApex'].filter(k => p[k] !== undefined);
    if (kinds.length !== 1) E(`${w}: "place" deve contenere esattamente una chiave fra at/coaxial/offset/byMesh/byApex (trovate: ${kinds.join(', ') || 'nessuna'})`);
    if (p.at !== undefined && !isVec(p.at, 3)) E(`${w}: place.at deve avere 3 elementi`);
    if (p.coaxial !== undefined && !axisBy[p.coaxial]) E(`${w}: place.coaxial riferisce l'asse "${p.coaxial}" che non esiste o non è attivo`);
    if (p.offset) {
      if (!axisBy[p.offset.from]) E(`${w}: place.offset.from riferisce l'asse "${p.offset.from}" che non esiste o non è attivo`);
      if (!isVec(p.offset.by, 3)) E(`${w}: place.offset.by deve avere 3 elementi`);
    }
    if (p.byMesh !== undefined) {
      const g = gearBy[p.byMesh];
      if (!g) E(`${w}: place.byMesh riferisce l'ingranaggio "${p.byMesh}" che non esiste o non è attivo`);
      else if (!meshId(g)) E(`${w}: place.byMesh="${p.byMesh}" ma quell'ingranaggio non ha "meshWith": impossibile calcolare l'interasse`);
      else if (!gearBy[meshId(g)]) E(`${w}: l'ingranaggio "${p.byMesh}" ha meshWith="${meshId(g)}" che non esiste o non è attivo`);
      if (!isVec(p.dir, 3)) E(`${w}: place.byMesh richiede "dir" con 3 elementi`);
    }
    if (p.byApex !== undefined) {
      const g = gearBy[p.byApex];
      if (!g) E(`${w}: place.byApex riferisce l'ingranaggio "${p.byApex}" che non esiste o non è attivo`);
      else if (g.apexW === undefined) E(`${w}: place.byApex="${p.byApex}" ma quell'ingranaggio non ha "apexW"`);
    }
    if (a.carrier !== undefined && !axisBy[a.carrier]) E(`${w}: carrier "${a.carrier}" non esiste o non è attivo`);
    for (const r of [].concat(a.rotate || [])) {
      if (r.around !== 'self' && !axisBy[r.around]) E(`${w}: rotate.around riferisce l'asse "${r.around}" che non esiste o non è attivo ("self" = attorno a se stesso)`);
      if (r.deg === undefined) E(`${w}: rotate senza "deg"`);
    }
    if (a.group && !(MACHINE.groups || []).some(g => g.id === a.group)) W(`${w}: group "${a.group}" non è definito in "groups"`);
    (a.parts || []).forEach((pt, i) => {
      if (!isActive(pt)) return;
      const pw = `${w}, parte #${i} (${pt.shape})`;
      if (pt.shape === 'cylinder') { if (pt.r === undefined) E(`${pw}: manca "r"`); if (!isVec(pt.w, 2)) E(`${pw}: "w" deve avere 2 elementi`); }
      else if (pt.shape === 'box') { if (!isVec(pt.w, 2)) E(`${pw}: "w" deve avere 2 elementi`); if (!isVec(pt.half, 2)) E(`${pw}: "half" deve avere 2 elementi`); }
      else if (pt.shape === 'prism') { if (!Array.isArray(pt.poly) || pt.poly.length < 3) E(`${pw}: "poly" deve avere almeno 3 punti`); }
      else E(`${pw}: forma sconosciuta (ammesse: cylinder, box, prism)`);
      if (pt.at !== undefined && !isVec(pt.at, 2)) E(`${pw}: "at" deve avere 2 elementi`);
    });

    if (a.refFrom !== undefined) {
      if (!axisBy[a.refFrom]) E(`${w}: "refFrom" riferisce l'asse "${a.refFrom}" che non esiste o non è attivo`);
      if (a.through === undefined) E(`${w}: "refFrom" ha senso solo su assi con "through"`);
    }

if (a.perpendicularTo && a.perpendicularTo.refFrom !== undefined) {
  const rf = a.perpendicularTo.refFrom;
  const ok = axisBy[rf] && (axisBy[rf].through !== undefined || true);
  if (!axisBy[rf]) E(`${w}: perpendicularTo.refFrom "${rf}" non esiste o non è attivo`);
}

  }

  // ingranaggi
  const partnerOf = {};
  for (const g of gears) if (meshId(g) && !partnerOf[meshId(g)]) partnerOf[meshId(g)] = g.id;
  for (const g of gears) {
    const w = `ingranaggio "${g.id}"`, type = g.type || 'spur';
    if (!g.axis) E(`${w}: manca "axis"`);
    else if (!axisBy[g.axis]) E(`${w}: asse "${g.axis}" non esiste o non è attivo`);
    if (!['spur', 'bevel', 'cylinder', 'worm', 'wormwheel'].includes(type)) { E(`${w}: tipo sconosciuto "${type}"`); continue; }
    if (g.meshWith !== undefined) {
      if (meshId(g) === g.id) E(`${w}: meshWith punta a sé stesso`);
      else if (!gearBy[meshId(g)]) E(`${w}: meshWith="${meshId(g)}" non esiste o non è attivo`);
      else {
        const pt = gearBy[meshId(g)].type || 'spur';
        const ok = (type === 'spur' && pt === 'spur') || (type === 'bevel' && pt === 'bevel') || (type === 'wormwheel' && pt === 'worm') || (type === 'worm' && pt === 'wormwheel');
        if (!ok) E(`${w} (${type}) in presa con "${meshId(g)}" (${pt}): combinazione non supportata`);
      }
    }
    if (type === 'spur') {
      if (g.teeth === undefined) E(`${w}: mancano i "teeth"`);
      if (g.module === undefined) E(`${w}: manca "module"`);
      if (!isVec(g.w, 2)) E(`${w}: "w" deve avere 2 elementi (larghezza lungo l'asse)`);
    }
    if (type === 'bevel') {
      if (g.teeth === undefined) E(`${w}: mancano i "teeth"`);
      if (g.module === undefined) E(`${w}: manca "module"`);
      if (g.apexW === undefined) E(`${w}: manca "apexW" (posizione dell'apice lungo l'asse)`);
      if (g.side !== undefined && g.side !== 1 && g.side !== -1) E(`${w}: "side" deve essere 1 oppure -1`);
      if (!g.meshWith && !partnerOf[g.id] && g.delta === undefined) W(`${w}: conico senza ingranaggio accoppiato e senza "delta": userò 45°. Aggiungi "delta": gradi nel JSON`);
    }
    if (type === 'cylinder') { if (g.r === undefined) E(`${w}: manca "r"`); if (!isVec(g.w, 2)) E(`${w}: "w" deve avere 2 elementi`); }
    if (type === 'worm') {
      if (g.q === undefined) E(`${w}: manca "q"`);
      if (g.module === undefined) E(`${w}: manca "module"`);
      if (!isVec(g.w, 2)) E(`${w}: "w" deve avere 2 elementi`);
    }
    if (type === 'wormwheel') {
      if (g.teeth === undefined) E(`${w}: mancano i "teeth"`);
      if (g.module === undefined) E(`${w}: manca "module"`);
      if (!g.meshWith) E(`${w}: una ruota per vite senza fine deve avere meshWith = la vite`);
    }
  }

  // link
  for (const l of links) {
    const w = `link "${l.type}"`, ax = (id, what) => { if (!axisBy[id]) E(`${w}: ${what} "${id}" non esiste o non è attivo`); };
    if (l.type === 'ratchet') {
      ax(l.driver, 'driver'); ax(l.driven, 'driven');
      for (const k of ['drives', 'winding', 'freewheel', 'blocks']) if (!l.messages || l.messages[k] === undefined) W(`${w}: manca messages.${k}`);
    } else if (l.type === 'pin_slot') {
      const dGear = gearBy[l.driver], sGear = gearBy[l.driven];
      if (!dGear) E(`${w}: driver "${l.driver}" non esiste o non è attivo`);
      else if (!sGear) E(`${w}: driven "${l.driven}" non esiste o non è attivo`);
      else if (dGear === sGear) E(`${w}: driver e driven devono essere diversi`);
      else {
        const d1 = axisBy[dGear.axis], d2 = axisBy[sGear.axis];
        if (d1 && d2 && Math.abs(Math.abs(V.dot(d1.dir, d2.dir)) - 1) > 1e-6)
          E(`${w}: gli assi di ${l.driver} e ${l.driven} devono essere paralleli`);
      }
      if (l.pinAxis) {
console.log("PINAXIS=",l.pinAxis);
        const pa = axisBy[l.pinAxis];
console.log("pa=",pa);
console.log("dGear=",dGear);
        if (!pa) E(`${w}: pinAxis "${l.pinAxis}" non esiste o non è attivo`);
        else if (dGear && pa.carrier !== dGear.axis)
          E(`${w}: pinAxis "${l.pinAxis}" deve avere carrier = "${dGear.axis}"`);
      } else if (l.pinRadius === undefined) {
        E(`${w}: specificare "pinAxis" oppure "pinRadius"`);
      }
    } else if (l.type === 'brake') {
      ax(l.axis, 'axis');
      if (!l.shoe || !isVec(l.shoe.at, 3) || !isVec(l.shoe.size, 3) || !isVec(l.shoe.released, 3)) E(`${w}: "shoe" richiede at, size e released con 3 elementi ciascuno`);
    } else if (l.type === 'rope') {
      ax(l.axis, 'axis');
      if (!isVec(l.at, 3)) E(`${w}: "at" deve avere 3 elementi`);
      for (const k of ['radius', 'len0', 'min', 'max']) if (l[k] === undefined) E(`${w}: manca "${k}"`);
    } else if (l.type === 'hooke') {
      ax(l.input, 'input'); ax(l.output, 'output');
      if (!l.arm) E(`${w}: manca "arm"`);
    } else if (l.type === 'rail') {
      ax(l.guide, 'guide'); ax(l.slider, 'slider');
      if (l.guide !== undefined && l.guide === l.slider) E(`${w}: guide e slider devono essere assi diversi`);
      if (!(axisBy[l.perpendicularTo] && axisBy[l.perpendicularTo].through !== undefined)) E(`${w}: "perpendicularTo" deve riferire un asse con "through" (qui: "${l.perpendicularTo}")`);
      if (axisBy[l.guide] && (axisBy[l.guide].through !== undefined || axisBy[l.guide].alignWith !== undefined)) E(`${w}: la guida "${l.guide}" non può avere "through" né "alignWith" (la sua direzione la calcola il binario)`);
    } else E(`link di tipo sconosciuto: "${l.type}"`);
  }
  for (const i of act(MACHINE.inputs)) if (!axisBy[i.axis]) E(`input "${i.id}": asse "${i.axis}" non esiste o non è attivo`);
  if (MACHINE.differential) {
    const d = MACHINE.differential;
    if (!axisBy[d.out]) E(`differential.out "${d.out}" non esiste o non è attivo`);
    for (const id of d.ins || []) if (!axisBy[id]) E(`differential.ins "${id}" non esiste o non è attivo`);
  }
  for (const r of MACHINE.ratios || []) { if (!axisBy[r.from]) E(`ratios.from "${r.from}" non esiste o non è attivo`); if (!axisBy[r.to]) E(`ratios.to "${r.to}" non esiste o non è attivo`); }
  for (const v of MACHINE.views || []) if (!v.auto && (!isVec(v.target, 3) || v.radius === undefined)) E(`vista "${v.id}": richiede "auto" oppure "target" (3 elementi) e "radius"`);
  for (const c of act(MACHINE.checks)) if (c.type === 'axisClearsGear') {
    if (!axisBy[c.axis]) E(`check axisClearsGear: asse "${c.axis}" non esiste o non è attivo`);
    if (!gearBy[c.gear]) E(`check axisClearsGear: ingranaggio "${c.gear}" non esiste o non è attivo`);
  }

  if (errs.length) throw new Error(`${errs.length} errore/i nel JSON (variante ${JSON.stringify(state.variants)}): ${errs[0]}${errs.length > 1 ? ` … (+${errs.length - 1}, vedi console)` : ''}`);
  step('json', `JSON ok: ${axes.length} assi, ${gears.length} ingranaggi, ${links.length} link attivi`);
}

/* =====================================================================
   3b. CINEMATICA DEI CORPI (assi con carrier)
   ---------------------------------------------------------------------
   Per ogni asse i la variabile di velocità è  w_i = Ω_i · dir_i  (componente, lungo l'asse, della velocità
   angolare ASSOLUTA del corpo). La velocità angolare assoluta si compone con quella del carrier c:
        Ω_i = Ω_c + s_i · dir_i ,   s_i = w_i − Ω_c·dir_i   (s_i = velocità RELATIVA al carrier)
   quindi Ω_i = Ω_c − dir_i (dir_i·Ω_c) + w_i dir_i.
   Se l'asse è parallelo al carrier (satelliti) Ω_c·dir = w_c e si ritrova la solita formula  s = w − w_c.
   Se è perpendicolare (asse di declinazione) Ω_c·dir = 0 e s = w: la ruota non "sente" la rotazione del carrier.
   Ω_i e la velocità dell'origine v(O_i) sono forme lineari nelle w_k: le memorizziamo come {k: vettore}.
   ===================================================================== */
function buildKinematics(M) {
  const n = M.axes.length, busy = new Set();
  const visit = a => {
    if (a.Om) return;
    if (busy.has(a)) throw new Error(`catena di carrier circolare attorno all'asse "${a.id}"`);
    busy.add(a);
    const c = a.carrier;
    if (!c) { a.Om = { [a.idx]: a.dir }; a.vO = {}; }
    else {
      visit(c);
      const Om = {}, vO = {}, d = V.sub(a.O, c.O);
      for (const k in c.Om) Om[k] = V.sub(c.Om[k], V.mul(a.dir, V.dot(c.Om[k], a.dir)));
      Om[a.idx] = a.dir;
      for (const k in c.vO) vO[k] = c.vO[k].slice();
      for (const k in c.Om) vO[k] = V.add(vO[k] || [0, 0, 0], V.cross(c.Om[k], d));
      a.Om = Om; a.vO = vO;
    }
    busy.delete(a);
  };
  M.axes.forEach(visit);
  // vincolo "debole" rest:"carrier":  s_i = 0  ⇔  w_i − Ω_c·dir_i = 0  (usato solo se nient'altro determina l'asse)
  for (const a of M.axes) {
    a.soft = null;
    if (a.def.rest === 'carrier' && a.carrier) {
      const r = new Array(n).fill(0);
      r[a.idx] = 1;
      for (const k in a.carrier.Om) r[k] -= V.dot(a.carrier.Om[k], a.dir);
      a.soft = r;
    }   else if (a.def.rest === 'world') { const r = new Array(n).fill(0); r[a.idx] = 1; a.soft = r; }
  }
}

/* velocità (come forma lineare nelle w_k) di un punto P solidale al corpo dell'asse a */
function pointVel(a, P) {
  const out = {}, r = V.sub(P, a.O);
  for (const k in a.vO) out[k] = a.vO[k].slice();
  for (const k in a.Om) out[k] = V.add(out[k] || [0, 0, 0], V.cross(a.Om[k], r));
  return out;
}

/* velocità angolare assoluta (vettore) del corpo dell'asse a, dati i w */
function omegaOf(a, w) {
  let o = [0, 0, 0];
  for (const k in a.Om) o = V.add(o, V.mul(a.Om[k], w[k]));
  return o;
}

/* velocità relative al carrier: s_i = w_i − Ω_carrier·dir_i  (per gli assi senza carrier s_i = w_i) */
function relSpins(M, w) {
  return M.axes.map((a, i) => a.carrier ? w[i] - V.dot(omegaOf(a.carrier, w), a.dir) : w[i]);
}

/* =====================================================================
   3c. ASSI "through": retta che passa SEMPRE per due punti
   ---------------------------------------------------------------------
   "through": [P1, P2]  con P = id di un asse (si usa l'origine di quell'asse, nel punto in cui si trova in quel momento: dipende
   dagli angoli di RA e declinazione) oppure [x,y,z] (punto fisso nel mondo, espressioni ammesse; si valuta dopo tutte le rotazioni).
   Ogni frame: origine = P1, direzione = da P1 verso P2.
   ===================================================================== */
const MAT = {
  rot(k, a) {
    const c = Math.cos(a), s = Math.sin(a), t = 1 - c, [x, y, z] = k;
    return [[t*x*x + c, t*x*y - s*z, t*x*z + s*y], [t*x*y + s*z, t*y*y + c, t*y*z - s*x], [t*x*z - s*y, t*y*z + s*x, t*z*z + c]];
  },
  mul: (A, B) => A.map(r => [0, 1, 2].map(j => r[0]*B[0][j] + r[1]*B[1][j] + r[2]*B[2][j])),
  mulV: (A, v) => A.map(r => r[0]*v[0] + r[1]*v[1] + r[2]*v[2])
};

/* Posa assoluta di un asse guidato dagli ingranaggi dagli angoli correnti a.theta (stessa composizione dei nodi Babylon). */
function axisFrame(a, cache) {
  let f = cache.get(a);
  if (f) return f;
  const Rs = MAT.rot(a.dir, a.theta);
  if (a.carrier) {
    const pc = axisFrame(a.carrier, cache);
    f = { R: MAT.mul(pc.R, Rs), O: V.add(pc.O, MAT.mulV(pc.R, V.sub(a.O, a.carrier.O))), dir: MAT.mulV(pc.R, a.dir) };
  } else f = { R: Rs, O: a.O, dir: a.dir };
  cache.set(a, f);
  return f;
}

function initThrough(M, ev) {
  M.through = [];
  for (const a of M.axes) if (a.def.through) {
    CTX.where = `asse "${a.id}", campo through`;
    const pts = a.def.through.map(q => typeof q === 'string'
      ? { axis: M.axisBy[q] }
      : { fixed: q.map(e => ev(e)) });
    for (const [i, p] of pts.entries()) if (p.fixed) {
      if (!p.fixed.every(Number.isFinite)) throw new Error(`asse "${a.id}": punto fisso non valido ${fmtV(p.fixed)}`);
      // assi da cui dipende il punto fisso (axes.ID.ox/oy/oz): durante la rotazione degli ingranaggi non devono spostarsi
      p.deps = [...new Set([...a.def.through[i].join(' ').matchAll(/axes\s*\.\s*([A-Za-z0-9_]+)\s*\.\s*o[xyz]/g)].map(m => m[1]))].map(id => M.axisBy[id]).filter(Boolean);
    }
    const t = { a, pts, ref: [0, 0, 1] };
    if (a.def.refFrom) {
      t.refFrom = M.axisBy[a.def.refFrom];
      if (!t.refFrom) throw new Error(`asse "${a.id}": refFrom "${a.def.refFrom}" non esiste o non è attivo`);
      step('through', `${a.id}: riferimento stabilizzato dall'asse ${t.refFrom.id}`);
    }

    a.aimed = true;
    M.through.push(t);
    const cache = new Map(), r = solveThrough(t, cache);
    a.O = r.O.slice(); a.dir = r.dir.slice(); a.ref = r.ref.slice(); a.yv = V.cross(a.dir, a.ref);
    step('through', `${a.id}: passa per ${pts.map(p => p.axis ? p.axis.id + ' ' + fmtV(axisFrame(p.axis, cache).O) : fmtV(p.fixed)).join(' e per ')}`);
  }
  // assi "alignWith": mantengono la propria origine (cinematica normale, portati dal loro carrier) ma hanno la direzione di un asse "through"
  M.aligned = [];
  for (const a of M.axes) if (a.def.alignWith) {
    const t = M.through.find(x => x.a.id === a.def.alignWith);
    if (!t) throw new Error(`asse "${a.id}": alignWith "${a.def.alignWith}" non è un asse con through`);
    a.aimed = a.aligned = true;
    a.dir = t.dir.slice(); a.ref = V.unit(V.perp(a.ref, a.dir)); a.yv = V.cross(a.dir, a.ref);   // posa iniziale (bounding box)
    const q = { a, t, ref: a.ref.slice() };
    // Se l'asse è portato da un carrier (es. il tubo sul barilotto), memorizzo il suo riferimento
    // nel sistema del carrier: la rotazione attorno al proprio asse seguirà così rigidamente il
    // carrier, invece dello "spin" apparente del trasporto parallelo lungo la coda.
    if (a.carrier) q.refLocal = a.ref.slice();
    M.aligned.push(q);
    step('allineato', `${a.id}: stessa direzione di ${t.a.id}, origine ${fmtV(a.O)}` + (a.carrier ? `, riferimento ancorato a ${a.carrier.id}` : ''));
  }
  // Assi solidali a una retta ma vincolati a restarle perpendicolari.
  M.perpendicular = [];
for (const a of M.axes) if (a.def.perpendicularTo) {
  const spec = a.def.perpendicularTo;
  const t = M.through.find(x => x.a.id === spec.line);
  const reference = M.axisBy[spec.reference];
  if (!t || !reference) throw new Error(`asse "${a.id}": perpendicularTo richiede una retta through e un asse reference validi`);
  a.aimed = true; a.aligned = true;
  const q = { a, t, reference };
  if (spec.refFrom) {
    const t2 = M.through.find(x => x.a.id === spec.refFrom);
    if (t2) q.refFromLine = t2;
    else {
      const a2 = M.axisBy[spec.refFrom];
      if (!a2) throw new Error(`asse "${a.id}": perpendicularTo.refFrom "${spec.refFrom}" non esiste o non è attivo`);
      q.refFromAxis = a2;
    }
    step('perpendicolare', `${a.id}: perpendicolare a ${t.a.id}, orientamento (ref) da ${spec.refFrom}`);
  } else {
    step('perpendicolare', `${a.id}: perpendicolare a ${t.a.id}, ref dalla verticale ${reference.id}`);
  }
  M.perpendicular.push(q);
}

  /* Binari ("rail"): link { "type":"rail", "guide": B, "slider": A, "perpendicularTo": T }.
     B passa per il proprio punto fisso P (la sua origine) e viene orientata ogni frame in modo che:
       1. intersechi sempre la retta di A (B giace nel piano che contiene P e la retta di A);
       2. sia perpendicolare in P alla retta T (di norma la coda, un asse "through").
     Il punto d'intersezione X non è un dato: si calcola e cambia di continuo (A scorre lungo B), quindi non servono "estremità". */
  M.rails = [];
  for (const l of MACHINE.links) if (l.type === 'rail' && isActive(l)) {
    CTX.where = `link rail ${l.guide} su ${l.slider}`;
    const a = M.axisBy[l.guide], slider = M.axisBy[l.slider], t = M.through.find(x => x.a.id === l.perpendicularTo);
    if (!a || !slider || !t) throw new Error(`link rail: guide "${l.guide}", slider "${l.slider}" e perpendicularTo "${l.perpendicularTo}" (asse con through) devono esistere`);
    const k = M.perpendicular.findIndex(q => q.a === a);
    if (k >= 0) { M.perpendicular.splice(k, 1); warn('rail', `${a.id}: il binario sostituisce il suo "perpendicularTo"`); }
    a.aimed = a.aligned = true;
    M.rails.push({ a, slider, t, def: l, prev: V.mul(V.unit(a.dir), l.sign < 0 ? -1 : 1) });
    step('rail', `${a.id}: passa per ${fmtV(a.O)}, interseca sempre ${slider.id} ed è perpendicolare a ${t.a.id}`);
  }
  CTX.where = '';
}

/* Assi "spinPerpTo": ruotano su se stessi (a.theta) in modo che l'asse figlio "axis" (perpendicolare a loro, come il barilotto sulla forcella)
   resti perpendicolare alla retta "line" (la coda). La retta passa per B (sull'asse di rotazione: la rotazione non lo sposta) e per M, quindi
   l'angolo si ricava in forma chiusa:  b(φ) = b0 cosφ + (f × b0) sinφ,  b(φ)·(M−B) = 0. */
function initSpins(M) {
  M.spins = [];
  for (const a of M.axes) if (a.def.spinPerpTo) {
    const sp = a.def.spinPerpTo, t = M.through.find(x => x.a.id === sp.line);
    if (!t) throw new Error(`asse "${a.id}": spinPerpTo.line "${sp.line}" non ha through`);
    M.spins.push({ a, child: M.axisBy[sp.axis], t, prev: 0 });
    step('spin', `${a.id}: ruota su se stesso perché ${sp.axis} resti perpendicolare a ${sp.line}`);
  }
}

function updateSpin(M) {
  if (!M.spins || !M.spins.length) return;
  const lines = [];
  for (const q of M.spins) {
    const keep = q.a.theta;
    q.a.theta = 0;                                              // con rotazione nulla: asse della forcella f, direzione b0 del figlio
    const c0 = new Map(), f = V.unit(axisFrame(q.a, c0).dir), b0 = V.unit(axisFrame(q.child, c0).dir);
    const P0 = q.t.pts[0].axis ? axisFrame(q.t.pts[0].axis, c0).O : q.t.pts[0].fixed;
    const P1 = q.t.pts[1].axis ? axisFrame(q.t.pts[1].axis, c0).O : q.t.pts[1].fixed;
    const c = V.sub(P1, P0), k = V.dot(b0, c), m = V.dot(V.cross(f, b0), c);
    if (Math.hypot(k, m) < 1e-9 * (V.len(c) || 1)) {
      q.a.theta = keep;
      warn('spin', `${q.a.id}: la retta ${q.t.a.id} è parallela all'asse della forcella, l'angolo di rotazione è indeterminato`);
      continue;
    }
    let phi = Math.atan2(-k, m);                                // due soluzioni: φ e φ+π (b e −b): si sceglie la più vicina alla precedente
    const wrap = x => Math.atan2(Math.sin(x), Math.cos(x));
    if (Math.abs(wrap(phi + PI - q.prev)) < Math.abs(wrap(phi - q.prev))) phi += PI;
    phi = q.prev + wrap(phi - q.prev);                          // senza salti di 2π
    q.prev = phi; q.a.theta = phi;
    lines.push(`${q.a.id}: ruota su se stessa di ${fmt(wrap(phi) * 180 / PI, 1)}° per tenere ${q.child.id} perpendicolare a ${q.t.a.id}.`);
  }
  M.spinText = lines.join(' ');
}

function solveThrough(t, cache) {
  const P = t.pts.map(p => p.axis ? axisFrame(p.axis, cache).O : p.fixed);
  const d = V.sub(P[1], P[0]), len = V.len(d);
  const dir = len > 1e-9 ? V.mul(d, 1 / len) : (t.dir || [0, 0, 1]);
// Il "ref" della coda (l'orientamento del suo frame attorno alla propria direzione) è derivato
  // dall'asse dichiarato in MACHINE con "refFrom": si prende la direzione CORRENTE di quell'asse
  // (che risente del suo carrier/rotazioni) e la si proietta perpendicolarmente alla coda. In questo
  // modo il frame della coda è ancorato a un vincolo fisico dichiarato nel JSON (la coda è solidale
  // allo specchio, lo specchio è solidale alla verticale) e non alla storia del proprio moto.
  const refSrc = t.refFrom ? V.unit(axisFrame(t.refFrom, cache).dir) : t.ref;
  let ref = V.perp(refSrc, dir);
  if (V.len(ref) < 1e-6) ref = V.perp([1, 0, 0], dir);
  ref = V.unit(ref);
  t.dir = dir; t.ref = ref;
  return { O: P[0], dir, ref, len, P };
}

function setNodePose(a, p) {
  const yv = V.cross(p.dir, p.ref), O = V.toB(p.O), fx = V.toB(p.ref), fy = V.toB(yv), fz = V.toB(p.dir);
  a.node.position.set(O[0], O[1], O[2]);
  a.node.rotationQuaternion = Quat.FromRotationMatrix(BABYLON.Matrix.FromValues(fx[0], fx[1], fx[2], 0, fy[0], fy[1], fy[2], 0, fz[0], fz[1], fz[2], 0, 0, 0, 0, 1));
}

/* Risolve un binario. Piano π = (P, retta di A); la guida è la perpendicolare a g (la retta T) in P dentro π:  b = n × g,  n = y × (O_A − P).
   Orientata verso il punto d'intersezione X = P + t·b = O_A + s·y  (t = distanza da P lungo la guida, s = posizione su A). */
function solveRail(q, cache) {
  const P = q.a.O, g = V.unit(q.t.dir);
  const fs = axisFrame(q.slider, cache), y = V.unit(fs.dir), d = V.sub(fs.O, P);
  let n = V.cross(y, d), degenerate = false;
  if (V.len(n) < 1e-9 * (V.len(d) || 1)) { n = V.cross(y, g); degenerate = true; }   // P sta sulla retta di A: piano (A, T)
  let b = V.cross(n, g);
  if (V.len(b) < 1e-9 * (V.len(n) || 1)) return q.last ? { ...q.last, stale: true } : null;  // T perpendicolare al piano: indeterminato, si tiene l'ultima posa
  b = V.unit(b);
  const bxy = V.cross(b, y), den = V.dot(bxy, bxy);
  let X = null, t = NaN, s = NaN, resid = NaN;
  if (den > 1e-12) {
    t = V.dot(V.cross(d, y), bxy) / den;
    s = V.dot(V.cross(d, b), bxy) / den;
    if (t < 0) { b = V.mul(b, -1); t = -t; }                       // la guida punta verso l'intersezione
    X = V.add(P, V.mul(b, t));
    resid = V.len(V.sub(X, V.add(fs.O, V.mul(y, s))));
  } else if (V.dot(b, q.prev) < 0) b = V.mul(b, -1);                // guida parallela ad A: nessuna intersezione, si tiene il verso precedente
  q.prev = b;
  q.last = { b, g, X, t, s, resid, degenerate, perp: V.dot(b, g) };
  return q.last;
}

function applyRail(q, r) {
  if (!r) return;
  setNodePose(q.a, { O: q.a.O, dir: r.b, ref: r.g });               // ref = coda (⟂ a b): la posa attorno a b è liscia
  q.a.dir = r.b.slice(); q.a.ref = r.g.slice(); q.a.yv = V.cross(q.a.dir, q.a.ref);
  if (q.marker && r.X) { const p = V.toB(r.X); q.marker.position.set(p[0], p[1], p[2]); q.marker.setEnabled(true); }
  else if (q.marker) q.marker.setEnabled(false);
}

function updateThrough(M) {
  if (!M.through || !M.through.length) return;
  const cache = new Map(), lines = [];
  for (const t of M.through) {
    const r = solveThrough(t, cache);
    setNodePose(t.a, r);
    // i binari che dipendono da questa retta si risolvono subito: le rette through successive possono avere "refFrom" sulla guida
    for (const q of M.rails || []) if (q.t === t) {
      const rr = solveRail(q, cache); applyRail(q, rr);
      if (!rr) { lines.push(`${q.a.id}: binario indeterminato (la retta ${t.a.id} è perpendicolare al piano di ${q.slider.id}), tenuta l'ultima posizione.`); continue; }
      lines.push(`${q.a.id}: binario su ${q.slider.id}, ` + (rr.X
        ? `intersezione a ${fmt(rr.t, 1)} mm da P e a ${fmt(rr.s, 1)} mm dall'origine di ${q.slider.id} (residuo ${rr.resid.toExponential(1)}), ` : `nessuna intersezione (parallela a ${q.slider.id}), `)
        + `angolo con ${t.a.id} ${fmt(Math.acos(Math.max(-1, Math.min(1, rr.perp))) * 180 / PI, 2)}°` + (rr.degenerate ? ' [P su ' + q.slider.id + ': piano da ' + t.a.id + ']' : '') + '.');
    }
    for (const p of t.pts) if (p.deps) {
      const moved = Math.max(0, ...p.deps.map(d => V.len(V.sub(axisFrame(d, cache).O, d.O))));
      p.moved = moved;
     // if (moved > 1e-6) fail('through', `${t.a.id}: il punto fisso dipende da ${p.deps.map(d => d.id).join(', ')}, che si è spostato di ${moved.toFixed(3)} mm durante la rotazione degli ingranaggi: il punto non è fisso, c'è un errore nella definizione`);
    }
    const fx = t.pts.find(p => p.deps);
    lines.push(`${t.a.id}: passa per ${t.pts.map(p => p.axis ? p.axis.id : 'il punto fisso').join(' e per ')}, distanza fra i due punti ${fmt(r.len, 1)} mm.` +
               (fx ? ` Spostamento del punto fisso durante la rotazione: ${fmt(fx.moved || 0, 3)} mm (deve essere 0).` : ''));
  }
  for (const q of M.aligned || []) {
    const f = axisFrame(q.a, cache), dir = q.t.dir;
    let ref;
    if (q.refLocal && q.a.carrier) {
      // Il riferimento dell'asse ruota rigidamente con il carrier (il barilotto): è lui a "portare"
      // l'orientamento del tubo attorno al proprio asse. La direzione invece resta imposta
      // geometricamente dalla coda (alignWith), quindi il riferimento va riportato nel piano
      // perpendicolare alla direzione corrente.
      const carR = axisFrame(q.a.carrier, cache).R;
      ref = V.perp(MAT.mulV(carR, q.refLocal), dir);
      if (V.len(ref) < 1e-6) ref = V.perp(q.ref, dir);
      if (V.len(ref) < 1e-6) ref = V.perp([1, 0, 0], dir);
    } else {
      ref = V.perp(q.ref, dir);
      if (V.len(ref) < 1e-6) ref = V.perp([1, 0, 0], dir);
    }
    ref = V.unit(ref); q.ref = ref;
    setNodePose(q.a, { O: f.O, dir, ref });
    if (q.a.carrier) {
      const cd = V.unit(axisFrame(q.a.carrier, cache).dir), tilt = Math.asin(Math.max(-1, Math.min(1, V.dot(dir, cd)))) * 180 / PI;
      q.tilt = tilt;
      lines.push(`${q.a.id}: coassiale a ${q.t.a.id}; inclinato di ${fmt(Math.abs(tilt), 1)}° rispetto al piano perpendicolare a ${q.a.carrier.id} (con la sola rotazione attorno al barilotto sarebbe 0°).`);
    }
  }
  // L'asse orizzontale dello specchio resta nel centro fisso e si orienta
  // come prodotto vettoriale fra la verticale di riferimento e la coda:
  // così è orizzontale, perpendicolare alla coda e ne segue l'orientamento.
for (const q of M.perpendicular || []) {
  const vertical = V.unit(axisFrame(q.reference, cache).dir);
  const tailDir  = V.unit(q.t.dir);
  let dir = V.cross(vertical, tailDir);
  if (V.len(dir) < 1e-8) dir = q.a.dir.slice();
  dir = V.unit(dir);

  // Riferimento del frame:
  //  – se "refFrom" punta a un asse "through" (tipicamente la coda stessa), uso il suo .ref
  //    (che è già stabile perché quell'asse ha il proprio refFrom);
  //  – se "refFrom" punta a un asse ordinario, uso il suo .ref (o .dir come fallback);
  //  – altrimenti comportamento storico: proiezione della verticale sul piano ⟂ a dir.
  let refSrc;
  if (q.refFromLine)      refSrc = q.refFromLine.ref;
  else if (q.refFromAxis) refSrc = q.refFromAxis.ref || q.refFromAxis.dir;
  else                    refSrc = vertical;

  let ref = V.perp(refSrc, dir);
  if (V.len(ref) < 1e-8) ref = V.perp([0, 1, 0], dir);
  ref = V.unit(ref);

  setNodePose(q.a, { O: q.a.O, dir, ref });
  q.a.dir = dir; q.a.ref = ref; q.a.yv = V.cross(dir, ref);
  lines.push(`${q.a.id}: perpendicolare a ${q.t.a.id}, ref da ${q.refFromLine ? q.refFromLine.a.id : q.refFromAxis ? q.refFromAxis.id : q.reference.id}.`);
}
  M.throughText = lines.join(' ');
}

function rotateVec(v, k, phi) {
  const c = cos(phi), s = sin(phi), kv = V.cross(k, v), kd = V.dot(k, v);
  return [v[0] * c + kv[0] * s + k[0] * kd * (1 - c), v[1] * c + kv[1] * s + k[1] * kd * (1 - c), v[2] * c + kv[2] * s + k[2] * kd * (1 - c)];
}

function dependentsOf(M, root) {
  const set = new Set([root]);
  const refsOf = a => {
    const out = [], p = a.def.place;
    if (a.carrier) out.push(a.carrier);
    if (p.coaxial) out.push(M.axisBy[p.coaxial]);
    if (p.offset) out.push(M.axisBy[p.offset.from]);
    if (p.byMesh) { const g = M.gearBy[p.byMesh], q = M.gearBy[meshId(g.def)]; out.push(M.axisBy[q.def.axis]); }
    if (p.byApex) out.push(M.axisBy[M.gearBy[p.byApex].def.axis]);
    return out;
  };
  for (let changed = true; changed;) {
    changed = false;
    for (const a of M.axes) if (!set.has(a) && refsOf(a).some(r => set.has(r))) { set.add(a); changed = true; }
  }
  return set;
}

function contactGeometry(g, p) {
  if (g.type === 'wormwheel') {
    const uc = V.unit(V.perp(V.sub(g.ax.O, p.ax.O), p.ax.dir));
    const dist = V.len(V.perp(V.sub(g.ax.O, p.ax.O), p.ax.dir));
    step('ingranamento', `${g.id} (ruota, z=${g.z}) ⇄ ${p.id} (vite): interasse ${dist.toFixed(3)} mm (atteso ${(g.r + p.r).toFixed(3)})`);
    if (Math.abs(dist - (g.r + p.r)) > 1e-6) warn('ingranamento', `Vite ${p.id} – ruota ${g.id}: interasse ${dist.toFixed(3)} invece di ${(g.r + p.r).toFixed(3)}`);
    if (Math.abs(V.dot(g.ax.dir, p.ax.dir)) > 1e-6 || Math.abs(V.dot(g.ax.dir, uc)) > 1e-6) warn('ingranamento', `Vite ${p.id} – ruota ${g.id}: l'asse della ruota non è perpendicolare alla vite e all'interasse`);
    g.sprime = Math.sign(V.dot(g.ax.dir, V.cross(p.ax.dir, uc))) || 1;
    return { X: V.add(g.ax.O, V.mul(uc, -g.r)), cg: V.mul(uc, -1), cp: uc };
  }
  if (g.type === 'bevel' && p.type === 'bevel') {
    const gh = V.unit(V.add(V.mul(g.e, Math.sin(p.delta)), V.mul(p.e, Math.sin(g.delta))));
    const apexDist = V.len(V.sub(g.apex, p.apex));
    step('ingranamento', `${g.id} (conico, z=${g.z}, δ=${(g.delta * 180 / PI).toFixed(2)}°) ⇄ ${p.id} (conico, z=${p.z}, δ=${(p.delta * 180 / PI).toFixed(2)}°): distanza fra gli apici ${apexDist.toFixed(3)} mm`);
    if (apexDist > 1e-6) warn('ingranamento', `Coppia conica ${g.id}–${p.id}: gli apici non coincidono (distanza ${apexDist.toFixed(3)} mm): ${g.id} apice ${fmtV(g.apex)}, ${p.id} apice ${fmtV(p.apex)}`);
    return { X: V.add(g.apex, V.mul(gh, g.r / Math.sin(g.delta))), cg: V.unit(V.perp(gh, g.e)), cp: V.unit(V.perp(gh, p.e)) };
  }
  const v = V.sub(p.ax.O, g.ax.O), cg = V.unit(V.perp(v, g.ax.dir)), cp = V.unit(V.perp(V.mul(v, -1), p.ax.dir));
  const dist = V.len(V.perp(v, g.ax.dir));
  step('ingranamento', `${g.id} (z=${g.z}) ⇄ ${p.id} (z=${p.z}): interasse ${dist.toFixed(3)} mm (atteso ${(g.r + p.r).toFixed(3)})`);
  if (V.len(V.cross(g.ax.dir, p.ax.dir)) > 1e-6) warn('ingranamento', `Ingranaggi ${g.id}–${p.id}: gli assi (${g.ax.id}, ${p.ax.id}) non sono paralleli: la coppia cilindrica non ingrana correttamente`);
  if (Math.abs(dist - (g.r + p.r)) > 1e-6) warn('ingranamento', `Ingranaggi ${g.id}–${p.id}: interasse ${dist.toFixed(3)} invece di ${(g.r + p.r).toFixed(3)} (la velocità resta calcolata dal rapporto dei denti ${g.z}:${p.z})`);
  // Punto di contatto "cinematico": divide l'interasse reale in proporzione ai DENTI (non ai raggi primitivi).
  // Così il rapporto di velocità è sempre z_g : z_p, anche quando due ruote di denti diversi (a, a1) condividono lo stesso interasse.
  const dg = (g.z + p.z) > 0 ? dist * g.z / (g.z + p.z) : g.r;
  return { X: V.add(g.ax.O, V.mul(cg, dg)), cg, cp };
}

function describePlace(M, p) {
  if (p.at) return `posizione fissa ${JSON.stringify(p.at)}`;
  if (p.coaxial) return `coassiale a ${p.coaxial}`;
  if (p.offset) return `spostato da ${p.offset.from} di ${JSON.stringify(p.offset.by)}`;
  if (p.byMesh) {
    const g = M.gearBy[p.byMesh];
    return `interasse di ${p.byMesh} con ${g && meshId(g.def)}`;
  }
  if (p.byApex) return `apice di ${p.byApex}`;
  return 'sconosciuto';
}

function resolveModel() {
  CTX.where = 'validazione del JSON';
  validateMachine();
  step('modello', 'Variante attiva', { ...state.variants }, 'parametri', { ...state.params });

  const M = { axes: [], axisBy: {}, gears: [], gearBy: {}, pairs: [], meshes: [], ratchets: [], brakes: [], ropes: [], hookes: [], inputs: [], constVal: {} };
  const resolving = new Set();
  let ev;
  const gTeeth = g => g.z !== undefined ? g.z : (g.z = g.def.teeth !== undefined ? ev(g.def.teeth) : g.def.type === 'worm' ? ev(g.def.starts === undefined ? 1 : g.def.starts) : 0);
  const gModule = g => g.m !== undefined ? g.m : (g.m = g.def.module !== undefined ? ev(g.def.module) : 0);
  const gRadius = g => g.def.r !== undefined ? ev(g.def.r) : g.def.q !== undefined ? ev(g.def.q) * gModule(g) / 2 : gTeeth(g) * gModule(g) / 2;
  const wMid = g => { const w = vec(g.def.w); return (w[0] + w[1]) / 2; };

  ev = M.ev = makeEvaluator(M, state, resolving, gTeeth, gModule, gRadius);
  const vec = arr => arr.map(e => ev(e));

  // ---- 1. registrazione di assi e ingranaggi attivi
  const skippedA = [], skippedG = [];
  for (const def of MACHINE.axes) {
    if (isActive(def)) { const a = { id: def.id, def, idx: M.axes.length, O: null, theta: 0 }; M.axes.push(a); M.axisBy[a.id] = a; }
    else skippedA.push(def.id);
  }
  for (const def of MACHINE.gears) {
    if (isActive(def)) { const g = { id: def.id, def, label: def.label || def.id }; M.gears.push(g); M.gearBy[g.id] = g; }
    else skippedG.push(def.id);
  }
  step('assi', `${M.axes.length} assi attivi: ${M.axes.map(a => a.id).join(', ')}` + (skippedA.length ? `  (saltati per variante: ${skippedA.join(', ')})` : ''));
  step('ingranaggi', `${M.gears.length} ingranaggi attivi: ${M.gears.map(g => g.id).join(', ')}` + (skippedG.length ? `  (saltati per variante: ${skippedG.join(', ')})` : ''));

  // ---- 2. costanti
  for (const name in MACHINE.consts) {
    CTX.where = `costante "${name}"`;
    try {
      const v = ev(name);
      if (typeof v === 'number' && !Number.isFinite(v)) throw new Error(`la costante "${name}" vale ${v} (espressione: ${JSON.stringify(MACHINE.consts[name])})`);
      step('costante', `${name} = ${typeof v === 'number' ? +v.toFixed(4) : v}`);
    } catch (e) {
      if (e instanceof NotPlaced) warn('costante', `"${name}" dipende dall'asse "${e.message}", non ancora posizionato: verrà valutata più tardi`);
      else if (/non finit|vale (NaN|Infinity|-Infinity)/.test(e.message)) throw e;
      else warn('costante', `"${name}" non valutabile: ${e.message}`);
    }
  }

  // ---- 3. direzioni degli assi
  for (const a of M.axes) {
    CTX.where = `asse "${a.id}", campi dir/view/ref`;
try {
  a.dir = V.unit(vec(a.def.dir));
  if (!a.dir.every(Number.isFinite) || V.len(a.dir) < 1e-9) throw new Error('dir non valida');
} catch (e) {
  if (e instanceof NotPlaced) { a.dir = [0,0,1]; a.cw = 1; a.deferredDir = true; }
  else throw e;
}
    a.view = V.unit(vec(a.def.view || [0, -1, 0]));
    a.cw = -Math.sign(V.dot(a.view, a.dir)) || 1;
    a.carrier = a.def.carrier ? M.axisBy[a.def.carrier] : null;
    a.ref = a.def.ref ? V.unit(V.perp(vec(a.def.ref), a.dir)) : null;
    step('asse', `${a.id} "${a.def.name}": dir=${fmtV(a.dir)}, visto ${a.def.viewLabel || 'da davanti'}` + (a.carrier ? `, portato da ${a.carrier.id}` : ''));
  }
  for (const l of MACHINE.links) if (l.type === 'hooke' && isActive(l)) {
    CTX.where = `link hooke ${l.input} → ${l.output}`;
    const ai = M.axisBy[l.input], ao = M.axisBy[l.output];
    const bend = V.unit(V.perp(ao.dir, ai.dir)), pinB = V.cross(ai.dir, bend);
    ai.ref = ai.ref || V.unit(V.cross(bend, ai.dir));
    ao.ref = ao.ref || V.unit(V.cross(pinB, ao.dir));
  }
  for (const a of M.axes) { a.ref = a.ref || V.anyPerp(a.dir); a.yv = V.cross(a.dir, a.ref); }

  // ---- 4. posizionamento degli assi (iterativo: un asse può dipendere da un altro non ancora posizionato)
  const originOf = a => {
    const p = a.def.place;
    if (p.at) return vec(p.at);
    if (p.coaxial) { const o = M.axisBy[p.coaxial]; if (!o.O) throw new NotPlaced(p.coaxial); return o.O.slice(); }
    if (p.offset) { const o = M.axisBy[p.offset.from]; if (!o.O) throw new NotPlaced(p.offset.from); return V.add(o.O, vec(p.offset.by)); }
    if (p.byMesh) {
      const g = M.gearBy[p.byMesh], q = M.gearBy[meshId(g.def)], qa = M.axisBy[q.def.axis];
      if (!qa.O) throw new NotPlaced(q.def.axis);
      let o = V.add(qa.O, V.mul(V.unit(vec(p.dir)), gRadius(g) + gRadius(q)));
      if (q.def.type === 'worm') o = V.add(o, V.mul(qa.dir, wMid(q)));
      if (g.def.type === 'worm') o = V.sub(o, V.mul(a.dir, wMid(g)));
      return o;
    }
    if (p.byApex) {
      const g = M.gearBy[p.byApex], ga = M.axisBy[g.def.axis];
      if (!ga.O) throw new NotPlaced(g.def.axis);
      return V.add(ga.O, V.mul(ga.dir, ev(g.def.apexW)));
    }
    throw new Error('Posizionamento mancante per l\'asse ' + a.id);
  };
  const waiting = {};
  for (let pass = 0, left = M.axes.length; left > 0 && pass < 50; pass++) {
    let progress = false;
    for (const a of M.axes) if (!a.O) {
      CTX.where = `posizionamento dell'asse "${a.id}" (${describePlace(M, a.def.place)})`;
      try {
        a.O = originOf(a); left--; progress = true; delete waiting[a.id];
        step('asse', `${a.id}: posizionato in ${fmtV(a.O)}  ← ${describePlace(M, a.def.place)}`);
      } catch (e) { if (!(e instanceof NotPlaced)) throw e; waiting[a.id] = e.message; }
    }
    if (!progress) break;
  }
  const unplaced = M.axes.filter(a => !a.O);
  if (unplaced.length) {
    for (const a of unplaced) fail('posizionamento', `asse "${a.id}": non posizionabile, attende l'asse "${waiting[a.id]}" che a sua volta non è posizionabile (dipendenza circolare o catena di riferimenti interrotta)`);
    throw new Error('Assi non posizionabili: ' + unplaced.map(a => a.id).join(', '));
  }

  // ---- 5. rotazioni di gruppo (rotate)
  for (const a of M.axes) for (const rot of [].concat(a.def.rotate || [])) {
    CTX.where = `rotate dell'asse "${a.id}"`;
    const self = rot.around === 'self', ar = self ? a : M.axisBy[rot.around];


    if (!ar) throw new Error('rotate.around sconosciuto: ' + rot.around);
    const group = dependentsOf(M, a);
    if (!self && group.has(ar)) throw new Error(`rotate: l'asse ${ar.id} dipende da ${a.id}, non si può ruotare ${a.id} attorno ad esso`);
    const deg = ev(rot.deg), phi = deg * PI / 180 * ar.cw, k = ar.dir, P = ar.O.slice();
    for (const b of group) {
      b.O = V.add(P, rotateVec(V.sub(b.O, P), k, phi));
      b.dir = rotateVec(b.dir, k, phi); b.ref = rotateVec(b.ref, k, phi); b.view = rotateVec(b.view, k, phi);
      b.yv = V.cross(b.dir, b.ref);
    }
    step('rotazione', `${a.id}: ${+deg.toFixed(2)}° attorno a ${self ? 'se stesso' : ar.id}; trascina: ${[...group].map(b => b.id).join(', ')}`);

for (const x of self ? [a] : [ar, a]) {
  const pa = x.def.place.at;
  if (!pa || !pa.some(e => typeof e === 'string' && /axes\s*[.\[]/.test(e))) continue;
  const dlt = V.sub(vec(pa), x.O);
  if (V.len(dlt) > 1e-12)
    for (const b of dependentsOf(M, x)) b.O = V.add(b.O, dlt);
}

  }

  // ---- 5b. cinematica dei corpi: velocità angolare assoluta e velocità dell'origine di ogni asse
  CTX.where = 'cinematica dei corpi';
  buildKinematics(M);
  for (const a of M.axes) if (a.carrier) {
    const par = Math.abs(V.dot(a.dir, a.carrier.dir));
    step('carrier', `${a.id} portato da ${a.carrier.id}: ` + (par > 1 - 1e-9 ? 'asse parallelo al carrier' : par < 1e-9 ? 'asse PERPENDICOLARE al carrier' : `asse inclinato (cos=${par.toFixed(3)})`) + (a.soft ? ' · a riposo: solidale al carrier' : ''));
  }

// ---- 5c. ri-valutazione dei place.at che dipendono da altri assi
for (const a of M.axes) {
  const p = a.def.place;
  if (!p.at) continue;
  if (!p.at.some(e => typeof e === 'string' && /axes\s*[.\[]/.test(e))) continue;
  CTX.where = `ri-posizionamento di "${a.id}" dopo le rotazioni`;
  a.O = vec(p.at);
}

// ---- 5d. ri-valutazione iterativa delle dir che dipendono da altri assi
let changed = true, guard = 0;
while (changed && guard++ < 10) {
  changed = false;
  for (const a of M.axes) {
    const d = a.def.dir;
    if (!Array.isArray(d) || !d.some(e => typeof e === 'string' && /\baxes\b/.test(e))) continue;
    CTX.where = `ri-orientamento di "${a.id}"`;
    const nd = V.unit(vec(d));
    if (Math.abs(nd[0]-a.dir[0])+Math.abs(nd[1]-a.dir[1])+Math.abs(nd[2]-a.dir[2]) > 1e-9) {
      a.dir = nd; changed = true;
    }
    if (Array.isArray(a.def.ref) && a.def.ref.some(e => typeof e === 'string' && /\baxes\b/.test(e))) {
      a.ref = V.unit(V.perp(vec(a.def.ref), a.dir));
    }
    a.cw = -Math.sign(V.dot(a.view, a.dir)) || 1;
    a.yv = V.cross(a.dir, a.ref);
  }
}

// ---- 5d-bis. Assi con "forceDir": direzione imposta dopo tutte le rotazioni
for (const a of M.axes) if (a.def.forceDir) {
  CTX.where = `forceDir dell'asse "${a.id}"`;
  a.dir = V.unit(vec(a.def.forceDir));
  let ref = V.perp(a.ref, a.dir);
  if (V.len(ref) < 1e-9) ref = V.anyPerp(a.dir);
  a.ref = V.unit(ref);
  a.yv = V.cross(a.dir, a.ref);
  a.cw = -Math.sign(V.dot(a.view, a.dir)) || 1;
  step('forceDir', `${a.id}: direzione imposta a ${fmtV(a.dir)}`);
}
CTX.where = '';

  // ---- 5e. assi con "through" (dopo tutte le rotazioni)
  initThrough(M, ev);
  initSpins(M);
  initSpinAlign(M);


  // ---- 6. ingranaggi
  for (const g of M.gears) {
    CTX.where = `ingranaggio "${g.id}"`;
    g.ax = M.axisBy[g.def.axis];
    if (!g.ax) throw new Error('Asse mancante per l\'ingranaggio ' + g.id);
    g.type = g.def.type || 'spur';
    g.z = gTeeth(g); g.m = gModule(g); g.r = gRadius(g);
    if (![g.z, g.m, g.r].every(Number.isFinite)) throw new Error(`ingranaggio "${g.id}": valori non validi z=${g.z} m=${g.m} r=${g.r}`);
    g.side = g.def.side || 1;
    g.w = g.def.w ? vec(g.def.w) : null;
    let extra = '';
    if (g.type === 'bevel') {
      g.apexW = ev(g.def.apexW);
      g.apex = V.add(g.ax.O, V.mul(g.ax.dir, g.apexW));
      g.e = V.mul(g.ax.dir, g.side);
      extra = `, apexW=${+g.apexW.toFixed(2)} (apice ${fmtV(g.apex)}), side=${g.side}`;
    }
    step('ingranaggio', `${g.id} [${g.type}] "${g.def.name}" su ${g.ax.id}: z=${g.z}, m=${+g.m.toFixed(5)}, r=${+g.r.toFixed(3)}` + (g.w ? `, w=[${g.w.map(x => +x.toFixed(2)).join(', ')}]` : '') + extra);
  }
  for (const g of M.gears) if (g.type === 'worm') {
    CTX.where = `vite "${g.id}"`;
    g.hand = g.def.hand || 1;
    g.wp = wormParams(g.m, ev(g.def.q), g.z, g.hand, g.w[1] - g.w[0]);
    step('vite', `${g.id}: principi=${g.z}, passo destro=${g.hand > 0}, rp=${+g.wp.rp.toFixed(3)}, passo assiale=${+g.wp.px.toFixed(3)}, lunghezza=${+g.wp.L.toFixed(2)}`);
  }

  // ---- 7. coppie di ingranaggi (ogni coppia una sola volta, anche se dichiarata da entrambi i lati)
  const seenPairs = new Set();
  for (const g of M.gears) if (meshId(g.def)) {
    const p = M.gearBy[meshId(g.def)];
    if (!p) throw new Error('meshWith sconosciuto: ' + meshId(g.def));
    const key = [g.id, p.id].sort().join('|');
    if (seenPairs.has(key)) { step('coppia', `${g.id} ⇄ ${p.id}: dichiarata due volte, ignoro il doppione`); continue; }
    seenPairs.add(key);
    g.partner = p; g.role = 'gap';
    if (!p.partner) { p.partner = g; p.role = 'tooth'; }
    M.pairs.push({ g, p });
    step('coppia', `${g.id} → ${p.id}`);
  }
  for (const g of M.gears) if (g.type === 'wormwheel') {
    CTX.where = `ruota della vite "${g.id}"`;
    if (!g.partner || g.partner.type !== 'worm') throw new Error(`${g.id}: una ruota per vite deve avere meshWith = una vite`);
    const f = g.def.face !== undefined ? ev(g.def.face) : wheelFace(g.m, g.partner.wp);
    g.w = g.def.w ? vec(g.def.w) : [-f / 2, f / 2];
    step('ruota-vite', `${g.id}: larghezza di fascia ${+f.toFixed(2)} mm`);
  }
  for (const g of M.gears) if (g.type === 'bevel' && g.partner) {
    const p = g.partner, cs = V.dot(g.e, p.e);
    g.delta = Math.atan2(Math.sqrt(Math.max(0, 1 - cs * cs)), p.z / g.z + cs);
    step('conico', `${g.id}: δ=${(g.delta * 180 / PI).toFixed(3)}° calcolato dalla coppia con ${p.id}`);
  }
  // conici senza ingranaggio accoppiato: "delta" in gradi dal JSON (default 45°). Senza questo la geometria diventerebbe NaN.
  for (const g of M.gears) if (g.type === 'bevel' && g.delta === undefined) {
    CTX.where = `conico "${g.id}" senza coppia`;
    if (g.def.delta !== undefined) {
      g.delta = ev(g.def.delta) * PI / 180;
      step('conico', `${g.id}: nessun ingranaggio accoppiato, uso "delta" del JSON = ${(g.delta * 180 / PI).toFixed(3)}°`);
    } else {
      g.delta = PI / 4;
      warn('conico', `${g.id}: nessun ingranaggio accoppiato e nessun "delta" nel JSON: uso 45° (aggiungi "delta": gradi per evitare questo avviso)`);
    }
  }
  for (const { g, p } of M.pairs) {
    CTX.where = `contatto ${g.id} ⇄ ${p.id}`;
    const c = contactGeometry(g, p);
    g.cdir = c.cg; p.cdir = c.cp;
    M.meshes.push({ g, p, X: c.X });
  }
  for (const g of M.gears) {
    g.rho = 0;
    if (g.cdir) {
      const phi = Math.atan2(V.dot(g.cdir, V.mul(g.ax.yv, g.side)), V.dot(g.cdir, g.ax.ref));
      g.rho = phi + (g.role === 'gap' && g.type !== 'worm' && g.type !== 'wormwheel' ? PI / g.z : 0);
    }
  }



// ---- 7b. link pin_slot (meccanismo Antikythera e simili)
M.pinSlots = [];
for (const l of MACHINE.links) if (l.type === 'pin_slot' && isActive(l)) {
  CTX.where = `link pin_slot ${l.driver} → ${l.driven}`;
  const g1 = M.gearBy[l.driver], g2 = M.gearBy[l.driven];
  if (!g1) throw new Error(`pin_slot: driver "${l.driver}" non esiste`);
  if (!g2) throw new Error(`pin_slot: driven "${l.driven}" non esiste`);

  let rPin, pinAxis = null;
  if (l.pinAxis) {
    pinAxis = M.axisBy[l.pinAxis];
    if (!pinAxis) throw new Error(`pin_slot: pinAxis "${l.pinAxis}" non esiste`);
    rPin = V.len(V.perp(V.sub(pinAxis.O, g1.ax.O), g1.ax.dir));
    if (rPin < 1e-6) throw new Error(`pin_slot: pinAxis coincide con l'asse di ${l.driver}`);
  } else {
    rPin = ev(l.pinRadius);
  }

  const slotAngle = l.slotAngle !== undefined ? ev(l.slotAngle) * PI / 180 : 0;
  const carrier = commonFrame(g1.ax, g2.ax);
  if (g1.ax.carrier !== g2.ax.carrier) {
    warn('pin_slot', `${g1.id} e ${g2.id} hanno carrier diversi: la cinematica potrebbe essere inaccurata`);
  }

  const relPerp = V.perp(V.sub(g2.ax.O, g1.ax.O), g1.ax.dir);
  const d = V.len(relPerp);
  if (d < 1e-6) throw new Error(`pin_slot: gli assi di ${l.driver} e ${l.driven} coincidono`);
  const dx = V.dot(relPerp, g1.ax.ref);
  const dy = V.dot(relPerp, g1.ax.yv);

  let initialPinAngle = 0;
  if (pinAxis) {
    const pinRel = V.perp(V.sub(pinAxis.O, g1.ax.O), g1.ax.dir);
    initialPinAngle = Math.atan2(V.dot(pinRel, g1.ax.yv), V.dot(pinRel, g1.ax.ref));
  }

  M.pinSlots.push({
    def: l, g1, g2, rPin, slotAngle, carrier,
    dx, dy, d, initialPinAngle, pinAxis,
    slotAxis: l.slotAxis ? M.axisBy[l.slotAxis] : null
  });
  step('pin_slot', `${g1.id} → ${g2.id}: rPin=${rPin.toFixed(3)}, d=${d.toFixed(3)}, slotAngle=${(slotAngle*180/PI).toFixed(2)}°`);
}


  // ---- 8. equazioni cinematiche degli ingranamenti
  // Condizione: nel punto di contatto X le velocità (assolute) dei due corpi hanno la stessa componente tangenziale.
  // Con la composizione corretta delle velocità angolari (sezione 3b) l'equazione vale in qualunque sistema di riferimento,
  // quindi non servono riferimenti "relativeTo": il moto del carrier è già incluso, anche per assi perpendicolari al carrier.
  const n = M.axes.length;
  for (const m of M.meshes) {
    m.frame = commonFrame(m.g.ax, m.p.ax);
    m.g.meshInfo = { partner: m.p, frame: m.frame };
    m.p.meshInfo = { partner: m.g, frame: m.frame };
    step('cinematica', `${m.g.id} ⇄ ${m.p.id}: rapporto denti ${m.g.z}:${m.p.z}, riferimento del rapporto: ${m.frame ? m.frame.id : 'mondo'}`);
    m.row = new Array(n).fill(0);
    if (m.g.type === 'wormwheel') {
      m.row[m.g.ax.idx] += m.g.z;
      m.row[m.p.ax.idx] += m.p.hand * m.g.sprime * m.p.z;
      continue;
    }
    const t = V.unit(V.cross(m.g.ax.dir, V.sub(m.X, m.g.ax.O)));
    const vg = pointVel(m.g.ax, m.X), vp = pointVel(m.p.ax, m.X);
    for (const k in vg) m.row[k] += V.dot(t, vg[k]);
    for (const k in vp) m.row[k] -= V.dot(t, vp[k]);
  }
  step('cinematica', `${M.meshes.length} equazioni di ingranamento su ${n} assi`);

  // ---- 9. link e input
  for (const l of MACHINE.links) if (isActive(l)) {
    CTX.where = `link ${l.type}`;
    if (l.type === 'ratchet') { M.ratchets.push({ def: l, driver: M.axisBy[l.driver].idx, driven: M.axisBy[l.driven].idx, sign: l.sign || 1 }); step('link', `nottolino: ${l.driver} → ${l.driven}`); }
    if (l.type === 'brake') { M.brakes.push({ def: l, idx: M.axisBy[l.axis].idx }); step('link', `freno su ${l.axis}`); }
    if (l.type === 'rope') { M.ropes.push({ def: l, idx: M.axisBy[l.axis].idx, at: vec(l.at), radius: ev(l.radius) }); step('link', `fune su ${l.axis}`); }
    if (l.type === 'hooke') {
      const ai = M.axisBy[l.input], ao = M.axisBy[l.output], cb = V.dot(ai.dir, ao.dir);
      M.hookes.push({ def: l, inIdx: ai.idx, outIdx: ao.idx, cb, sb: Math.sqrt(1 - cb * cb), bend: V.unit(V.perp(ao.dir, ai.dir)) });
      step('link', `snodo di Hooke: ${l.input} → ${l.output}, angolo ${(Math.acos(cb) * 180 / PI).toFixed(2)}°`);
    }
  }
  for (const def of MACHINE.inputs) if (isActive(def)) { M.inputs.push({ def, id: def.id, idx: M.axisBy[def.axis].idx }); step('input', `${def.id}: asse ${def.axis}`); }
  CTX.where = '';
  return M;
}

/* Verifica del modello risolto: valori non finiti, assi isolati. Lancia un errore se qualcosa renderebbe la scena inutilizzabile. */
function validateModel(M) {
  let bad = 0;
  const B = (m, ...r) => { bad++; fail('verifica', m, ...r); };
  for (const a of M.axes) if (![...a.O, ...a.dir, ...a.ref].every(Number.isFinite)) B(`asse ${a.id}: origine/direzione/riferimento non finiti`, a.O, a.dir, a.ref);
  for (const g of M.gears) {
    if (!(g.r > 0)) B(`ingranaggio ${g.id}: raggio non valido (${g.r})`);
    if (g.type === 'bevel' && !(Number.isFinite(g.delta) && g.delta > 0 && g.delta < PI)) B(`conico ${g.id}: delta non valido (${g.delta})`);
    if (g.type === 'bevel' && !g.apex.every(Number.isFinite)) B(`conico ${g.id}: apice non finito`, g.apex);
    if (g.w && !g.w.every(Number.isFinite)) B(`ingranaggio ${g.id}: w non valido`, g.w);
    if (['spur', 'bevel', 'wormwheel'].includes(g.type) && !(g.z >= 3)) B(`ingranaggio ${g.id}: numero di denti non valido (${g.z})`);
  }
  for (const m of M.meshes) if (!m.row.every(Number.isFinite)) B(`ingranamento ${m.g.id}⇄${m.p.id}: coefficienti cinematici non finiti`, m.row);

  const linked = new Set();
  for (const m of M.meshes) { linked.add(m.g.ax); linked.add(m.p.ax); }
  for (const r of M.ratchets) { linked.add(M.axes[r.driver]); linked.add(M.axes[r.driven]); }
  for (const h of M.hookes) { linked.add(M.axes[h.inIdx]); linked.add(M.axes[h.outIdx]); }
  for (const a of M.axes) if (a.carrier) { linked.add(a); linked.add(a.carrier); }
  for (const a of M.axes) if (!linked.has(a) && !a.aimed && !a.def.static) warn('verifica', `asse ${a.id}: nessun ingranamento, nottolino, snodo o portasatelliti lo collega al resto (${M.gears.filter(g => g.ax === a).length} ingranaggi): girerà solo se pilotato direttamente`);

  if (DBG.on) {
    console.groupCollapsed('[verifica] riepilogo assi e ingranaggi (clic per aprire)');
    console.table(M.axes.map(a => ({ asse: a.id, origine: fmtV(a.O), dir: fmtV(a.dir), portato_da: a.carrier ? a.carrier.id : '', a_riposo: a.soft ? 'solidale al carrier' : '', gruppo: a.def.group || '' })));
    console.table(M.gears.map(g => ({ id: g.id, tipo: g.type, asse: g.ax.id, denti: g.z, modulo: +g.m.toFixed(4), raggio: +g.r.toFixed(3), delta_gradi: g.delta !== undefined ? +(g.delta * 180 / PI).toFixed(2) : '', in_presa_con: g.partner ? g.partner.id : '' })));
    console.groupEnd();
  }
  if (bad) throw new Error(`${bad} problema/i nel modello risolto (vedi console)`);
  step('verifica', `modello risolto valido: ${M.axes.length} assi, ${M.gears.length} ingranaggi, ${M.meshes.length} ingranamenti`);
}

/* =====================================================================
   4. CINEMATICA
   ===================================================================== */
function makeSystem(n) {
  const rows = [];
  return {
    lastIndependent: false,
    add(c, b) {
      this.lastIndependent = false;
      c = c.slice();
      const s = Math.max(...c.map(Math.abs)) || 1; for (let j = 0; j < n; j++) c[j] /= s; b /= s;
      for (const r of rows) { const f = c[r.p]; if (Math.abs(f) > 1e-12) { for (let j = 0; j < n; j++) c[j] -= f * r.c[j]; b -= f * r.b; } }
      let p = -1, best = 1e-9;
      for (let j = 0; j < n; j++) if (Math.abs(c[j]) > best) { best = Math.abs(c[j]); p = j; }
      if (p < 0) return Math.abs(b) < 1e-7;
      const d = c[p]; for (let j = 0; j < n; j++) c[j] /= d; b /= d;
      for (const r of rows) { const f = r.c[p]; if (Math.abs(f) > 1e-12) { for (let j = 0; j < n; j++) r.c[j] -= f * c[j]; r.b -= f * b; } }
      rows.push({ p, c, b }); this.lastIndependent = true; return true;
    },
    solve() { const w = new Array(n).fill(0); for (const r of rows) w[r.p] = r.b; return w; },
    rows: () => rows
  };
}

const hookeRatio = (h, theta) => (1 - h.sb * h.sb * cos(theta) ** 2) / h.cb;
function hookePsi(h, phi) {
  const p = Math.atan2(sin(phi), h.cb * cos(phi));
  return p + 2 * PI * Math.round((phi - p) / (2 * PI));
}
const inputOmega = (ax, st) => ax.cw * st.rpm * PI / 30;

/* Elenco ordinato dei vincoli: i primi hanno la precedenza (quelli dopo, se incompatibili, vengono scartati). */
function buildConstraints(M, locked) {
  const n = M.axes.length, unit = i => { const r = new Array(n).fill(0); r[i] = 1; return r; };
  const L = [], push = (kind, label, row, b, extra = {}) => L.push({ kind, label, row, b,...extra });

  for (const b of M.brakes) if (state.brakes[b.def.axis]) push('freno', `freno su ${b.def.axis}`, unit(b.idx), 0, { axisIdx: b.idx });
  for (const m of M.meshes) push('presa', `ingranamento ${m.g.id} ⇄ ${m.p.id}`, m.row, 0);
  for (const h of M.hookes) { const r = new Array(n).fill(0); r[h.inIdx] = 1; r[h.outIdx] = -hookeRatio(h, M.axes[h.inIdx].theta); push('hooke', `snodo ${M.axes[h.inIdx].id} → ${M.axes[h.outIdx].id}`, r, 0); }
  for (const rt of locked) { const r = new Array(n).fill(0); r[rt.driven] = 1; r[rt.driver] = -1; push('nottolino', `nottolino ${M.axes[rt.driver].id} → ${M.axes[rt.driven].id} (bloccato)`, r, 0); }

  // data-driven: tutti i gear che dichiarano independentTuning
  for (const gear of getTunableGears(M)) {
    const st = state.wheelInputs[gear.id];
    if (!st) continue;
    push('wheelInput',
      `velocità indipendente ${getIndependentTuning(gear)} [${gear.id}] (asse ${gear.ax.id})`,
      unit(gear.ax.idx),
      gear.ax.cw * st.rpm * PI / 30,
      { axisIdx: gear.ax.idx }
    );
  }

  const dg = state.driver && M.gearBy[state.driver.gear];
  if (dg) push('driver', `ruota pilotata ${dg.id} (asse ${dg.ax.id})`, unit(dg.ax.idx), state.driver.w, { axisIdx: dg.ax.idx });
  for (const inp of M.inputs) push('input', `input "${inp.id}" (asse ${M.axes[inp.idx].id})`, unit(inp.idx), inputOmega(M.axes[inp.idx], state.inputs[inp.id]), { axisIdx: inp.idx });
  for (const a of M.axes) if (a.def.hold) push('hold', `asse ${a.id} fermo ("hold")`, unit(a.idx), 0, { axisIdx: a.idx });
  for (const a of M.axes) if (a.soft) push('rest', a.def.rest === 'world'? `${a.id} a riposo nel mondo` : `${a.id} a riposo, solidale a ${a.carrier.id}`, a.soft, 0, { axisIdx: a.idx });

// pin_slot: s2 = ratio * s1
for (const ps of M.pinSlots || []) {
  const row = new Array(n).fill(0);
  const alpha1 = ps.g1.ax.theta + ps.initialPinAngle;
  const A = ps.rPin * Math.cos(alpha1) - ps.dx;
  const B = ps.rPin * Math.sin(alpha1) - ps.dy;
  const den = A * A + B * B;
  if (den < 1e-20) {
    warn('pin_slot', `${ps.g1.id} → ${ps.g2.id}: pin a C₂, vincolo saltato`);
    continue;
  }
  const ratio = ps.rPin * (A * Math.cos(alpha1) + B * Math.sin(alpha1)) / den;

  row[ps.g2.ax.idx] += 1;
  row[ps.g1.ax.idx] -= ratio;
  if (ps.carrier) {
    for (const k in ps.carrier.Om) {
      const proj1 = V.dot(ps.carrier.Om[k], ps.g1.ax.dir);
      const proj2 = V.dot(ps.carrier.Om[k], ps.g2.ax.dir);
      row[+k] += -proj2 + ratio * proj1;
    }
  }
  push('pin_slot', `pin_slot ${ps.g1.id} → ${ps.g2.id} (rapporto ${ratio.toFixed(4)})`, row, 0);
}
  return L;
}

/* Risolve in ordine; bvals (opzionale) sostituisce i termini noti: serve a calcolare il contributo di ogni ingresso. */
function solveConstraints(M, L, bvals) {
  const sys = makeSystem(M.axes.length);
  L.forEach((c, i) => {
    const ok = sys.add(c.row, bvals ? bvals[i] : c.b);
    c.independent = sys.lastIndependent;
    if (!bvals) c.conflict = !ok;
  });
  return { w: sys.solve(), sys };
}

function solveSpeeds(M) {
  const locked = new Set();
  let L = buildConstraints(M, locked), r = solveConstraints(M, L), w = r.w;
  for (let i = 0; i <= M.ratchets.length; i++) {
    let changed = false;
    for (const rt of M.ratchets) if (!locked.has(rt) && rt.sign * (w[rt.driven] - w[rt.driver]) < -1e-9) { locked.add(rt); changed = true; }
    if (!changed) break;
    L = buildConstraints(M, locked); r = solveConstraints(M, L); w = r.w;
  }
  for (const c of L) if (c.conflict && ['freno', 'driver', 'wheelInput', 'input', 'hold'].includes(c.kind)) warn('cinematica', `vincoli in conflitto: ${c.label} contraddice gli altri vincoli`);
  return { w, locked, cons: L, sys: r.sys };
}

function relationCoeffs(M, outId, insIds) {
  if (!M.axisBy[outId]) throw new Error(`asse di uscita "${outId}" non esiste o non è attivo`);
  return insIds.map((_, k) => {
    const n = M.axes.length, sys = makeSystem(n);
    for (const m of M.meshes) sys.add(m.row, 0);
    insIds.forEach((id, j) => {
      if (!M.axisBy[id]) throw new Error(`asse di ingresso "${id}" non esiste o non è attivo`);
      const r = new Array(n).fill(0); r[M.axisBy[id].idx] = 1; sys.add(r, j === k ? 1 : 0);
    });
    return sys.solve()[M.axisBy[outId].idx];
  });
}

/* ---------- velocità di una ruota rispetto a mondo e a tutti i parent ---------- */
const axName = a => a.id.replace(/^axis_/, '');
const rpmOfW = (a, v) => v * a.cw * 30 / PI;
const fmtRpm = v => { const x = Math.abs(v); return x < 1e-6 ? '0' : (v > 0 ? '↻ ' : '↺ ') + fmt(x, x < 10 ? 4 : x < 1000 ? 2 : 0); };
const chainOf = a => { const o = []; for (let x = a.carrier; x; x = x.carrier) o.push(x); return o; };   // antenati stretti
function commonFrame(a, b) { const cb = new Set(chainOf(b)); for (const x of chainOf(a)) if (cb.has(x)) return x; return null; }   // null = mondo

/* rotazione del corpo di a rispetto al corpo ref (null = mondo): componente lungo l'asse di a e parte ortogonale */
function relToFrame(a, ref, w) {
  const rel = V.sub(omegaOf(a, w), ref ? omegaOf(ref, w) : [0, 0, 0]), raw = V.dot(rel, a.dir);
  return { raw, along: rpmOfW(a, raw), perp: V.len(V.sub(rel, V.mul(a.dir, raw))) * 30 / PI };
}

   function velocityLines(a, w) {
     const out = [{ ref: null, label: 'mondo', ...relToFrame(a, null, w) }], seen = new Set();
     for (const c of chainOf(a)) { seen.add(c); out.push({ ref: c, label: 'vs ' + axName(c), ...relToFrame(a, c, w) }); }
     for (const id of a.def.compare || []) { const c = M.axisBy[id]; if (c && c !== a && !seen.has(c)) out.push({ ref: c, label: 'vs ' + axName(c) + ' (confronto)', ...relToFrame(a, c, w) }); }
     return out;
   }

/* ---------- colonna della tabella ---------- */
function updateTable(w, cons) {
  const direct = {};
  for (const c of cons) if (c.axisIdx !== undefined && c.independent && !direct[c.axisIdx]) direct[c.axisIdx] = c.kind;
  const kindText = { driver: 'imposta (ruota pilotata)', input: 'imposta (input)', hold: 'imposta (hold: ferma)', freno: 'imposta (freno: ferma)', rest: 'a riposo: solidale al carrier' };
  for (const g of M.gears) {
    const row = rowOf[g.id];
    if (!row || row.cells.length < 6) continue;
    let markRef = null, markText = '';
    const k = direct[g.ax.idx];
       if (k) { const rc = k === 'rest' && g.ax.def.rest === 'carrier'; markRef = (rc || (k === 'driver' && g.ax.carrier)) ? g.ax.carrier : null; markText = k === 'rest' ? (rc ? kindText.rest : 'a riposo nel mondo') : kindText[k]; }
    else {
      const src = g.meshInfo ? g : M.gears.find(x => x.ax === g.ax && x.meshInfo);
      if (src) { markRef = src.meshInfo.frame; markText = `rapporto denti con ${src.meshInfo.partner.id}` + (src === g ? '' : ` (via ${src.id}, stesso asse)`); }
    }
    row.cells[5].innerHTML = velocityLines(g.ax, w).map(l => {
      const mk = markText && l.ref === markRef;
      return `<div class="${mk ? 'mk' : ''}">${esc(l.label)}: ${fmtRpm(l.along)}` +
             (l.perp > 1e-6 ? ` <span style="color:var(--bad)">(+⟂ ${fmt(l.perp, 3)})</span>` : '') + (mk ? ' ◀ ' + esc(markText) : '') + '</div>';
    }).join('');
  }
}

/* ---------- spiegazione in console ---------- */
const EXPL = { timer: null };
function explainSoon() { clearTimeout(EXPL.timer); EXPL.timer = setTimeout(explainSpeeds, 150); }

function explainSpeeds() {
  if (!M) return;
  const { w, cons, sys } = solveSpeeds(M);
  updateShowSpeeds();
  const rows = sys.rows(), pivot = new Map(rows.map(r => [r.p, r]));
  const free = M.axes.filter(a => !pivot.has(a.idx) && !a.aimed);
  const L = (...a) => console.log(...a);
  // contributo di ogni ingresso imposto (velocità ≠ 0): il sistema è lineare, quindi w = somma dei contributi
  const contrib = [];
  cons.forEach((c, i) => {
    if (c.b !== 0 && (c.kind === 'driver' || c.kind === 'input')) {
      const bv = cons.map(() => 0); bv[i] = c.b;
      contrib.push({ c, w: solveConstraints(M, cons, bv).w });
    }
  });
  const why = a => {
    const i = a.idx;
    const dir = cons.find(c => c.axisIdx === i && c.independent && c.kind !== 'rest');
    if (dir) return `imposta direttamente: ${dir.label}`;
    const r = pivot.get(i);
    if (!r) return '⚠ GRADO DI LIBERTÀ LIBERO: nessun vincolo la determina, quindi la velocità assoluta è posta a 0';
    const parts = contrib.filter(k => Math.abs(k.w[i]) > 1e-12).map(k => `${k.c.label}: ${fmtRpm(rpmOfW(a, k.w[i]))}`);
    let s = 'ricavata dai vincoli (ingranamenti, ecc.) — ' + (parts.length ? `contributi: ${parts.join(' + ')}` : 'nessun ingresso imposto la muove');
    const fr = free.filter(f => Math.abs(r.c[f.idx]) > 1e-9);
    if (fr.length) s += ` — ⚠ dipende da assi liberi posti a 0: ${fr.map(f => `${f.id} (coeff ${(-r.c[f.idx]).toFixed(3)})`).join(', ')}`; // `
    const rest = cons.find(c => c.axisIdx === i && c.kind === 'rest' && c.independent);
    if (rest) s += ` — fissata per default: ${rest.label}`;
    return s;
  };

  console.groupCollapsed('%c[velocità]%c come si ottiene la velocità di ogni ruota (clic per aprire)', 'color:#d9b45a;font-weight:bold', 'color:inherit');
  L('Vincoli attivi, nell\'ordine in cui vengono applicati (i primi hanno la precedenza):');
  cons.forEach((c, i) => {
    const ax = c.axisIdx !== undefined ? M.axes[c.axisIdx] : null;
    L(`  ${i + 1}. [${c.kind}] ${c.label}` + (ax && c.b !== 0 ? ` = ${fmtRpm(rpmOfW(ax, c.b))} giri/min` : '') +
      (c.independent ? '' : '  → già implicito nei precedenti (nessun effetto)') + (c.conflict ? '  ⚠ IN CONFLITTO con i precedenti' : ''));
  });
  L(free.length ? `⚠ Assi non determinati da nessun vincolo (velocità assoluta posta a 0): ${free.map(a => a.id).join(', ')}. Se uno di questi dovrebbe muoversi, manca un vincolo o un "rest".`
                : 'Tutti gli assi sono determinati dai vincoli.'); // `
  for (const g of M.gears) {
    const a = g.ax, vl = velocityLines(a, w);
    L(`%c${g.id}%c "${g.def.name}" · ${g.type}, z=${g.z}, su ${a.id}` + (a.carrier ? ` (portato da ${chainOf(a).map(c => c.id).join(' → ')})` : ' (asse senza carrier: fisso nel mondo)'),
      'color:#d9b45a;font-weight:bold', 'color:inherit');
    L('    velocità lungo l\'asse: ' + vl.map(l => `${l.label} ${fmtRpm(l.along)}` + (l.perp > 1e-6 ? ` [+⟂ ${fmt(l.perp, 3)}]` : '')).join(' · '));
    L('    asse: ' + why(a));
    if (g.meshInfo) {
      const p = g.meshInfo.partner, f = g.meshInfo.frame, fn = f ? axName(f) : 'mondo';
      const m = M.meshes.find(x => (x.g === g && x.p === p) || (x.g === p && x.p === g));
      const res = m ? m.row.reduce((s, c, k) => s + c * w[k], 0) : NaN;
      L(`    ingranamento con ${p.id} (z ${g.z}:${p.z}): le due velocità sono legate dal rapporto denti, misurate RISPETTO A «${fn}» (il corpo che porta entrambi gli assi). Residuo dell'equazione di presa: ${res.toExponential(2)}`);
      if ((g.ax.carrier || null) === f && (p.ax.carrier || null) === f) {
        const sg = relToFrame(g.ax, f, w), sp = relToFrame(p.ax, f, w), exp = p.z / g.z;
        const got = Math.abs(sp.raw) > 1e-12 ? Math.abs(sg.raw / sp.raw) : null;
        const ok = got === null ? Math.abs(sg.raw) < 1e-12 : Math.abs(got - exp) < 1e-6 * Math.max(1, exp);
        L(`    verifica rispetto a ${fn}: ω_${g.id} = ${fmtRpm(sg.along)}, ω_${p.id} = ${fmtRpm(sp.along)}; |ω_${g.id}/ω_${p.id}| atteso ${p.z}/${g.z} = ${exp.toFixed(5)}, ottenuto ${got === null ? 'n/d (ferme)' : got.toFixed(5)}  ${ok ? '✓' : '✗ ERRORE'}`);
      } else L('    (gli assi non sono portati direttamente dallo stesso corpo: il rapporto va letto sul punto di contatto, vedi il residuo)'); //`
    }
  }
  console.groupEnd();
}

/* =====================================================================
   5. SCENA BABYLON
   ===================================================================== */
const { Vector3: V3, Color3: C3, Quaternion: Quat } = BABYLON;
const canvas = $('stage');
const engine = new BABYLON.Engine(canvas, true, { antialias: true });
const scene  = new BABYLON.Scene(engine);
scene.useRightHandedSystem = true;
scene.clearColor = new BABYLON.Color4(.8, .8, .8, 1);

const camera = new BABYLON.ArcRotateCamera('cam', PI / 2 - .7, 1.1, 1000, V3.Zero(), scene);
camera.attachControl(canvas, false);
camera.lowerRadiusLimit = 30;
camera.wheelDeltaPercentage = .02;
camera.panningSensibility = 40;
camera.minZ = 1;
canvas.addEventListener('wheel', e => e.preventDefault(), { passive: false });
canvas.addEventListener('contextmenu', e => e.preventDefault());
new BABYLON.HemisphericLight('sky', new V3(.3, 1, .5), scene).intensity = .75;
new BABYLON.DirectionalLight('sun', new V3(.5, -1, -.7), scene).intensity = .8;

const matCache = {};
function material(hex) {
  if (!matCache[hex]) {
    const m = new BABYLON.StandardMaterial('m' + hex, scene);
    m.diffuseColor = C3.FromHexString(hex); m.specularColor = new C3(.28, .28, .28); m.backFaceCulling = false;
    matCache[hex] = m;
  }
  return matCache[hex];
}
const markerMat = material('#d4262e');
const toV3 = a => new V3(a[0], a[1], a[2]);

// Costruisce una mesh da uno o più solidi. I solidi con vertici non finiti (NaN/Infinity) vengono saltati e segnalati.
function buildMesh(name, solids, mapPoint, mat, pickable) {
  const pos = [], nor = [], idx = [];
  let n = 0;
  for (const { P, T } of solids) {
    const R = P.map(mapPoint);
    const badIdx = R.findIndex(p => !p.every(Number.isFinite));
    if (badIdx >= 0) {
      fail('mesh', `"${name}": vertice non finito (#${badIdx} su ${R.length}): solido saltato. Causa tipica: parametro mancante o non valido nel JSON (es. delta/apexW di un conico, denti, modulo, raggio, w)`, P[badIdx]);
      continue;
    }
    let vol = 0;
    for (const [a, b, c] of T) {
      const A = R[a], B = R[b], C = R[c];
      vol += A[0]*(B[1]*C[2]-B[2]*C[1]) + A[1]*(B[2]*C[0]-B[0]*C[2]) + A[2]*(B[0]*C[1]-B[1]*C[0]);
    }
    for (const t of T) {
      const [a, b, c] = vol < 0 ? [t[0], t[2], t[1]] : t;
      const A = R[a], B = R[b], C = R[c];
      const ux = B[0]-A[0], uy = B[1]-A[1], uz = B[2]-A[2], vx = C[0]-A[0], vy = C[1]-A[1], vz = C[2]-A[2];
      let x = uy*vz-uz*vy, y = uz*vx-ux*vz, z = ux*vy-uy*vx;
      const l = Math.hypot(x, y, z) || 1; x /= l; y /= l; z /= l;
      pos.push(...A, ...B, ...C);
      nor.push(x, y, z, x, y, z, x, y, z);
      idx.push(n, n + 1, n + 2); n += 3;
    }
  }
  const mesh = new BABYLON.Mesh(name, scene);
  if (pos.length) {
    const data = new BABYLON.VertexData();
    data.positions = pos; data.normals = nor; data.indices = idx; data.applyToMesh(mesh);
  } else warn('mesh', `"${name}": nessuna geometria valida, la mesh resta vuota`);
  mesh.material = mat; mesh.isPickable = !!pickable;
  return mesh;
}

function frameMap(side = 1, apexW = 0) {
  return p => [p[0], side * p[1], apexW + side * p[2]];
}

const wrapAngle = a => { const r = ((a % (2 * PI)) + 2 * PI) % (2 * PI); return r > 2 * PI - 1e-6 ? 0 : r; };
const cacheKey = obj => JSON.stringify(obj, (k, v) => typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v);

function gearSolids(g) {
  if (g.type === 'cylinder') return [cylinderSolid(g.r, g.w[0], g.w[1], g.def.n || 32)];
  if (g.type === 'worm') return [wormSolid(g.wp, g.rho, g.w[0], g.w[1])];
  if (g.type === 'wormwheel') return [wormWheelSolid(g.z, g.m, g.partner.wp, g.sprime, g.rho, g.w[0], g.w[1])];
  if (g.type === 'spur') return [spurGear(g.z, g.m, g.rho, g.w[0], g.w[1],g.def.degStart, g.def.degEnd)];
  const out = [bevelGear(g.z, g.m, g.delta, g.rho, g.def.k0 || 0.7)], pl = g.def.plate;
  if (pl) { const wp = g.r / Math.tan(g.delta); out.push(cylinderSolid(pl.k * g.r, wp + pl.from, wp + pl.to, pl.n || 48)); }
  return out;
}

function resolvePart(p, ev) {
  const k = { shape: p.shape, n: p.n || 32, color: p.color };
  if (p.r !== undefined) k.r = ev(p.r);
  if (p.w) k.w = p.w.map(e => ev(e));
  k.at = (p.at || [0, 0]).map(e => ev(e));
  if (p.half) k.half = p.half.map(e => ev(e));
  if (p.poly) { k.poly = p.poly.map(pt => pt.map(e => ev(e))); k.y = p.y || [-1, 1]; }
  const solid = k.shape === 'cylinder' ? cylinderSolid(k.r, k.w[0], k.w[1], k.n, k.at[0], k.at[1])
              : k.shape === 'box' ? boxSolid(k.w[0], k.w[1], k.at[0], k.at[1], k.half[0], k.half[1])
              : prismSolid(k.poly, k.y[0], k.y[1]);
  return { key: k, solid };
}

/* =====================================================================
   6. COSTRUZIONE DELLA SCENA A PARTIRE DAL MODELLO
   ===================================================================== */
let M = null;
const meshCache = new Map();

function buildScene(M) {
  step('scena', `Costruzione della scena: ${M.axes.length} assi, ${M.gears.length} ingranaggi`);
  const used = new Set();
  let built = false;
  const cached = (key, make) => {
    used.add(key);
    let m = meshCache.get(key);
    built = false;
    if (!m || m.isDisposed()) { m = make(); meshCache.set(key, m); built = true; }
    m.renderOverlay = false;
    return m;
  };
  M.nodes = []; M.extras = []; M.allMeshes = []; M.groupItems = {};
  const inGroup = (grp, item) => { if (grp) (M.groupItems[grp] = M.groupItems[grp] || []).push(item); };



  for (const a of M.axes) { a.node = new BABYLON.TransformNode('axis_' + a.id, scene); a.node.rotationQuaternion = Quat.Identity(); M.nodes.push(a.node); }
  for (const a of M.axes) {
    const Ob = V.toB(a.O);
    if (a.carrier) { a.node.parent = a.carrier.node; a.node.position = toV3(V.sub(Ob, V.toB(a.carrier.O))); }
    else a.node.position = toV3(Ob);
    a.axisB = toV3(V.toB(a.dir));
    inGroup(a.group || a.def.group, a.node);
    a.frame = new BABYLON.TransformNode('frame_' + a.id, scene); a.frame.parent = a.node; M.nodes.push(a.frame);
    const fx = V.toB(a.ref), fy = V.toB(a.yv), fz = V.toB(a.dir);
    a.frame.rotationQuaternion = Quat.FromRotationMatrix(BABYLON.Matrix.FromValues(fx[0], fx[1], fx[2], 0, fy[0], fy[1], fy[2], 0, fz[0], fz[1], fz[2], 0, 0, 0, 0, 1));
    if (a.aligned) a.node.parent = null;
    if (a.aimed) a.frame.rotationQuaternion = Quat.Identity();   // la posa degli assi "through" è assoluta (updateThrough)
    step('scena', `asse ${a.id}: nodo creato in ${fmtV(a.O)}` + (a.carrier ? ` (figlio di ${a.carrier.id})` : ''));
  }

  for (const g of M.gears) {
    CTX.where = `scena: ingranaggio ${g.id}`;
    g.sig = JSON.stringify([g.type, g.z, g.m, g.def.axis, g.apexW, g.w, g.side]);
    const key = 'g|' + cacheKey([g.type, g.z, g.m, wrapAngle(g.rho), g.w, g.apexW, g.side, g.delta, g.def.plate, g.r, g.def.n, g.def.k0, g.def.color || g.ax.def.color, g.wp, g.partner && g.partner.wp, g.sprime]);
    const t0 = performance.now();
    try {
      g.mesh = cached(key, () => buildMesh('gear_' + g.id, gearSolids(g), frameMap(g.side, g.apexW || 0), material(g.def.color || g.ax.def.color), true));
    } catch (e) { throw new Error(`ingranaggio ${g.id} (${g.type}): errore nella geometria: ${e.message}`); }
    const tri = g.mesh.getTotalIndices() / 3;
    step('ingranaggio', `${g.id} [${g.type}]: ${built ? `mesh costruita (${tri} triangoli, ${(performance.now() - t0).toFixed(0)} ms)` : `mesh riusata dalla cache (${tri} triangoli)`}`);
    if (!tri) warn('ingranaggio', `${g.id}: la mesh non contiene triangoli`); // `
    g.mesh.parent = g.ax.frame; g.mesh.metadata = g.id; g.mesh.setEnabled(true);
    M.allMeshes.push(g.mesh);
  }
  for (const a of M.axes) {
    const parts = a.def.parts || []; let count = 0;
    parts.forEach((pd, i) => {
      if (!isActive(pd)) return;
      CTX.where = `scena: asse ${a.id}, parte #${i} (${pd.shape})`;
      const { key, solid } = resolvePart(pd, M.ev);
      const mat = key.color === 'marker' ? markerMat : material(key.color || a.def.color);
      const mesh = cached('p|' + cacheKey([key, key.color || a.def.color]), () => buildMesh(`part_${a.id}_${i}_${pd.shape}`, [solid], frameMap(), mat, false));
      mesh.parent = a.frame; mesh.setEnabled(true);
      M.allMeshes.push(mesh); count++;
    });
    step('parti', `${a.id}: ${count} parti costruite` + (parts.length - count ? ` (${parts.length - count} saltate per variante)` : ''));
  }
  CTX.where = '';
  for (const [k, m] of meshCache) if (!used.has(k)) { m.dispose(); meshCache.delete(k); }

  for (const b of M.brakes) {
    const s = b.def.shoe, at = V.toB(s.at.map(e => M.ev(e))), rel = V.toB(s.released);
    b.mesh = BABYLON.MeshBuilder.CreateBox('shoe', { width: s.size[0], height: s.size[2], depth: s.size[1] }, scene);
    b.mesh.material = new BABYLON.StandardMaterial('shoeMat', scene); b.mesh.isPickable = false;
    b.engaged = toV3(at); b.released = toV3(V.add(at, rel));
    M.extras.push(b.mesh); inGroup(b.def.group, b.mesh);
    step('scena', `freno su ${b.def.axis}: ceppo creato`);
  }
  for (const r of M.ropes) {
    r.rope = BABYLON.MeshBuilder.CreateCylinder('rope', { height: 1, diameter: 4, tessellation: 12 }, scene);
    r.weight = BABYLON.MeshBuilder.CreateCylinder('weight', { height: 30, diameter: 24, tessellation: 24 }, scene);
    r.rope.material = material('#5a4630'); r.weight.material = material('#6b7280');
    r.rope.isPickable = r.weight.isPickable = false; r.top = V.toB(r.at);
    M.extras.push(r.rope, r.weight); inGroup(r.def.group, r.rope); inGroup(r.def.group, r.weight);
    step('scena', `fune su ${r.def.axis}: fune e peso creati`);
  }
  for (const q of M.rails || []) if (q.def.marker) {            // "marker": true (o il raggio in mm) → sferetta sul punto d'intersezione del binario
    q.marker = BABYLON.MeshBuilder.CreateSphere('rail_marker', { diameter: 2 * (q.def.marker === true ? 6 : +q.def.marker) }, scene);
    q.marker.material = markerMat; q.marker.isPickable = false;
    M.extras.push(q.marker); inGroup(q.def.group, q.marker);
    step('scena', `binario ${q.a.id}: marker dell'intersezione creato`);
  }




function createHooke(
    axis1,
    axis2,
    axis1side = 1,
    axis2side = 1,
    axis1rotate = false,
    leaderAxis = null,
    armDef = null
) {
    const arm = {
        r: armDef?.r ?? 2.3,
        len: armDef?.len ?? 13
    };

    const { r, len } = arm;
    const sceneRef = scene;

    // --------------------------------------------------
    // Utility geometriche
    // --------------------------------------------------

    const V3B = (v) => {
        const b = V.toB(v);
        return toV3(b);
    };

    const worldCenter = (v) => V3B(v);

// Estremi del cilindro che rappresenta l'albero.
// Se ci sono altri cilindri, ad esempio i marker, viene scelto
// quello con la maggiore estensione lungo Z.
const getAxisBounds = (axis) => {
    let shaft = null;

    for (const p of axis.def.parts || []) {
        if (
            !isActive(p) ||
            p.shape !== "cylinder" ||
            !Array.isArray(p.w)
        ) {
            continue;
        }

        // Risolve anche estremi espressi con formule o variabili.
        const { key } = resolvePart(p, M.ev);

        if (!Array.isArray(key.w) || key.w.length < 2) {
            continue;
        }

        const z0 = Number(key.w[0]);
        const z1 = Number(key.w[1]);

        if (!Number.isFinite(z0) || !Number.isFinite(z1)) {
            continue;
        }

        const candidate = {
            minZ: Math.min(z0, z1),
            maxZ: Math.max(z0, z1),
            length: Math.abs(z1 - z0)
        };

        if (!shaft || candidate.length > shaft.length) {
            shaft = candidate;
        }
    }

    if (!shaft || shaft.length < 1e-8) {
        throw new Error(
            `Impossibile trovare il cilindro dell'albero ${axis.id}`
        );
    }

    return {
        minZ: shaft.minZ,
        maxZ: shaft.maxZ
    };
};


// Coordinata lungo l'albero del punto di intersezione.
const shaftCoordinate = (axis, point) => {
    return V.dot(
        V.sub(point, axis.O),
        V.unit(axis.dir)
    );
};


// Sceglie automaticamente l'estremità più vicina
// al punto d'intersezione degli assi.
const getSideZ = (axis, intersection) => {
    const { minZ, maxZ } = getAxisBounds(axis);
    const centerZ = shaftCoordinate(axis, intersection);

    const distanceMin = Math.abs(centerZ - minZ);
    const distanceMax = Math.abs(centerZ - maxZ);

    return distanceMin <= distanceMax ? minZ : maxZ;
};

    const getWorldMatrix = (node) => {
        node.computeWorldMatrix(true);
        return node.getWorldMatrix();
    };

    const worldToLocal = (node, worldPoint) => {
        const inv = getWorldMatrix(node).clone();
        inv.invert();

        return BABYLON.Vector3.TransformCoordinates(worldPoint, inv);
    };

    const makeBox = (name, dimensions, parent, position, color) => {
        const mesh = BABYLON.MeshBuilder.CreateBox(
            name,
            dimensions,
            sceneRef
        );

        mesh.material = material(color);
        mesh.parent = parent;
        mesh.position.copyFrom(position);
        mesh.isPickable = false;

        return mesh;
    };

    // --------------------------------------------------
    // Punto di intersezione / minima distanza
    // --------------------------------------------------

    const getIntersection = (O1, D1, O2, D2) => {
        const w0 = V.sub(O1, O2);

        const a = V.dot(D1, D1);
        const b = V.dot(D1, D2);
        const c = V.dot(D2, D2);
        const d = V.dot(D1, w0);
        const e = V.dot(D2, w0);

        const denom = a * c - b * b;

        if (Math.abs(denom) < 1e-8) {
            // Assi paralleli: non esiste un'intersezione unica.
            // Usiamo il punto sull'asse 1 più vicino all'asse 2.
            const t = a > 1e-8 ? -d / a : 0;
            return V.add(O1, V.mul(D1, t));
        }

        const t = (b * e - c * d) / denom;
        const u = (a * e - b * d) / denom;

        const P1 = V.add(O1, V.mul(D1, t));
        const P2 = V.add(O2, V.mul(D2, u));

        return V.mul(V.add(P1, P2), 0.5);
    };

    const center = getIntersection(
        axis1.O, axis1.dir,
        axis2.O, axis2.dir
    );

// --------------------------------------------------
// DIREZIONE DEI DUE PERNI DELLA CROCIERA
// --------------------------------------------------

const d1 = V.unit(axis1.dir);
const d2 = V.unit(axis2.dir);

// Direzione del perno associato al primo albero.
const bendRaw = V.perp(d2, d1);

if (V.len(bendRaw) < 1e-8) {
    throw new Error(
        `Impossibile orientare lo snodo di Hooke: ` +
        `gli assi ${axis1.id} e ${axis2.id} sono paralleli`
    );
}

const pinDir1 = V.unit(bendRaw);

// Direzione del perno associato al secondo albero.
// È la stessa direzione usata da orientCross per yp.
const pinDir2 = V.unit(V.cross(d1, pinDir1));

    const centerWorld = worldCenter(center);
    const jointName = `hooke_${axis1.id}_${axis2.id}`;

    // --------------------------------------------------
    // CROCIERA CENTRALE
    // --------------------------------------------------

    const cross = new BABYLON.TransformNode(
        `cross_${axis1.id}_${axis2.id}`,
        sceneRef
    );

    cross.position.copyFrom(centerWorld);
    cross.rotationQuaternion = BABYLON.Quaternion.Identity();

    // Due perni ortogonali nel riferimento della crociera.
    // I cilindri sono centrati nel punto d'intersezione.
    const crossArm1 = BABYLON.MeshBuilder.CreateCylinder(
        `${jointName}_pin1`,
        {
            height: 2 * len,
            diameter: 2 * r,
            tessellation: 24
        },
        sceneRef
    );

    crossArm1.material = material("#00ff00");
    crossArm1.parent = cross;
    crossArm1.isPickable = false;

    const crossArm2 = BABYLON.MeshBuilder.CreateCylinder(
        `${jointName}_pin2`,
        {
            height: 2 * len,
            diameter: 2 * r,
            tessellation: 24
        },
        sceneRef
    );

    crossArm2.material = material("#00ff00");
    crossArm2.rotation.z = Math.PI / 2;
    crossArm2.parent = cross;
    crossArm2.isPickable = false;

    const core = BABYLON.MeshBuilder.CreateBox(
        `${jointName}_core`,
        { size: 2 * r },
        sceneRef
    );

    core.material = material("#ffff00");
    core.parent = cross;
    core.isPickable = false;

    // --------------------------------------------------
    // CREA UNA FORCELLA SULL'ESTREMITÀ SCELTA
    // --------------------------------------------------

const createYoke = (axis, pinDir, suffix, color) => {
    if (!axis.frame) {
        throw new Error(
            `L'asse ${axis.id} non possiede axis.frame`
        );
    }

    // Estremità dell'albero più vicina alla crociera.
    const endZ = getSideZ(axis, center);

    const yoke = new BABYLON.TransformNode(
        `yoke${suffix}_${axis.id}`,
        sceneRef
    );

    yoke.parent = axis.frame;
    yoke.position.set(0, 0, endZ);

    // --------------------------------------------------
    // ROTAZIONE AUTOMATICA ATTORNO ALL'ALBERO
    // --------------------------------------------------

    // Gli assi locali X e Y del frame corrispondono
    // rispettivamente a axis.ref e axis.yv.
    const localX = V.dot(pinDir, axis.ref);
    const localY = V.dot(pinDir, axis.yv);

    // Orienta l'asse X della forcella lungo il perno.
    const roll = Math.atan2(localY, localX);

    yoke.rotationQuaternion =
        BABYLON.Quaternion.RotationAxis(
            BABYLON.Axis.Z,
            roll
        );

    // Distanza assiale tra l'estremità e la crociera.
    const dz = shaftCoordinate(axis, center) - endZ;

    // --------------------------------------------------
    // GEOMETRIA DELLA FORCELLA: INVARIATA
    // --------------------------------------------------

    const forkLength = Math.max(r, Math.abs(dz));
    const middleZ = dz / 2;

    const forkOffset = 2.5 * r;
    const forkThickness = 1.5 * r;
    const forkWidth = 5 * r;

    const forkLeft = makeBox(
        `fork${suffix}Left_${axis.id}`,
        {
            width: forkThickness,
            height: forkWidth,
            depth: forkLength + 10
        },
        yoke,
        new BABYLON.Vector3(
            -2 * forkOffset,
            0,
            middleZ
        ),
        color
    );

    const forkRight = makeBox(
        `fork${suffix}Right_${axis.id}`,
        {
            width: forkThickness,
            height: forkWidth,
            depth: forkLength + 10
        },
        yoke,
        new BABYLON.Vector3(
            2 * forkOffset,
            0,
            middleZ
        ),
        color
    );

    const forkBase = makeBox(
        `fork${suffix}Base_${axis.id}`,
        {
            width: 4 * forkOffset + forkThickness,
            height: forkWidth,
            depth: 2 * r
        },
        yoke,
        new BABYLON.Vector3(0, 0, 0),
        color
    );

    return {
        yoke,
        forkLeft,
        forkRight,
        forkBase
    };
};

const result1 = createYoke(
    axis1,
    pinDir1,
    "1",
    "#2f6fe0"
);

const result2 = createYoke(
    axis2,
    pinDir2,
    "2",
    "#d4262e"
);

    return {
        cross,
        yoke1: result1.yoke,
        yoke2: result2.yoke
    };
}





for (const h of M.hookes) {
    const axis1 = M.axes[h.inIdx];
    const axis2 = M.axes[h.outIdx];

    const axis1side = h.def.axis1Side ?? h.def.axis1side ?? 1;
    const axis2side = h.def.axis2Side ?? h.def.axis2side ?? 1;
    const axis1rotate = h.def.axis1Rotate ?? h.def.axis1rotate ?? false;

const result = createHooke(
    axis1,
    axis2,
    h.def.arm
);

    h.cross = result.cross;
    h.yoke1 = result.yoke1;
    h.yoke2 = result.yoke2;

    M.nodes.push(
        result.cross,
        result.yoke1,
        result.yoke2
    );

    inGroup(h.def.group, result.cross);
    inGroup(h.def.group, result.yoke1);
    inGroup(h.def.group, result.yoke2);

    step(
        "scena",
        `snodo di Hooke ${h.def.input} → ${h.def.output}: crociera e forcelle create`
    );
}




  applyGroups();
  step('scena', `Scena completa: ${M.allMeshes.length} mesh, ${M.nodes.length} nodi, ${M.extras.length} elementi extra`);
}

function applyGroups() {
  if (!M) return;
  for (const g in M.groupItems) for (const it of M.groupItems[g]) it.setEnabled(state.groups[g] !== false);
}

function orientCross(h, phi) {
  const psi = hookePsi(h, phi), din = M.axes[h.inIdx].dir, yp = V.cross(din, h.bend);
  const A = V.add(V.mul(h.bend, cos(phi)), V.mul(yp, sin(phi)));
  const e1 = V.sub(V.mul(h.bend, h.cb), V.mul(din, h.sb));
  const B = V.add(V.mul(e1, -sin(psi)), V.mul(yp, cos(psi)));
  const nn = V.cross(A, B), a = V.toB(A), b = V.toB(B), c = V.toB(nn);
  h.cross.rotationQuaternion = Quat.FromRotationMatrix(BABYLON.Matrix.FromValues(
    a[0], a[1], a[2], 0, b[0], b[1], b[2], 0, c[0], c[1], c[2], 0, 0, 0, 0, 1));
}

// Ingombro del modello: ignora le mesh vuote o con bounding box non finito (e le segnala).
function modelBounds() {
  const min = [1e9, 1e9, 1e9], max = [-1e9, -1e9, -1e9];
  let skipped = 0;
  for (const m of M.allMeshes) {
    if (!m.getTotalVertices()) { skipped++; continue; }
    m.computeWorldMatrix(true);
    const bb = m.getBoundingInfo().boundingBox, vs = [bb.minimumWorld, bb.maximumWorld];
    if (!vs.every(v => Number.isFinite(v.x + v.y + v.z))) { skipped++; warn('ingombro', `bounding box non finito per la mesh "${m.name}"${m.metadata ? ` (ingranaggio ${m.metadata})` : ''}`); continue; }
    for (const v of vs) for (let i = 0; i < 3; i++) { const c = [v.x, v.y, v.z][i]; min[i] = Math.min(min[i], c); max[i] = Math.max(max[i], c); }
  }
  step('ingombro', `min=${fmtV(min)} max=${fmtV(max)}` + (skipped ? ` (${skipped} mesh ignorate)` : '')); // `
  return { min, max };
}


function initSpinAlign(M) { /* per giunti sferici "dissociati" in due assi ortogonali */
  M.spinAlign = [];

  const sourceVectors = new Set(["ref", "yv"]);
  const targetVectors = new Set(["dir", "ref", "yv"]);

  for (const axis of M.axes) {
    const spec = axis.def.spinAlignTo;
    if (!spec) continue;

    const target = M.axisBy[spec.target];

    if (!target) {
      throw new Error(
        `Asse "${axis.id}": spinAlignTo.target ` +
        `"${spec.target}" non esiste o non è attivo`
      );
    }

    const sourceVector = spec.sourceVector || "yv";
    const targetVector = spec.targetVector || "dir";
    const mode = spec.mode || "parallel";

    if (!sourceVectors.has(sourceVector)) {
      throw new Error(
        `Asse "${axis.id}": sourceVector deve essere "ref" oppure "yv"`
      );
    }

    if (!targetVectors.has(targetVector)) {
      throw new Error(
        `Asse "${axis.id}": targetVector non valido`
      );
    }

    if (!["parallel", "same"].includes(mode)) {
      throw new Error(
        `Asse "${axis.id}": mode deve essere "parallel" oppure "same"`
      );
    }

    if (axis.aimed || axis.aligned) {
      throw new Error(
        `Asse "${axis.id}": spinAlignTo richiede ` +
        `un asse orientabile tramite theta`
      );
    }

    M.spinAlign.push({
      axis,
      target,
      sourceVector,
      targetVector,
      mode
    });
  }
}



function currentWorldVector(axis, property) {
  // Gli assi aimed/aligned hanno già i riferimenti
  // aggiornati nel sistema di coordinate del modello.
  if (axis.aimed || axis.aligned) {
    return V.unit(axis[property]);
  }

  // Per gli altri assi, trasforma il vettore locale
  // nella posa corrente del modello.
  const frame = axisFrame(axis, new Map());

  if (property === "dir") {
    return V.unit(frame.dir);
  }

  return V.unit(MAT.mulV(frame.R, axis[property]));
}

function updateSpinAlign(M)  {  /* Per gestione giunti sferici dissociati */
//console.log("[updateSpinAlign]");
  const wrap = angle =>
    Math.atan2(Math.sin(angle), Math.cos(angle));

  for (const q of M.spinAlign || []) {
//console.log("[updateSpinAlign] vincolo ", q);

    const { axis, target, sourceVector, targetVector, mode } = q;

    const previous = axis.theta || 0;

    // Direzione obiettivo nella posa corrente.
    const targetDir = currentWorldVector(target, targetVector);

    // La sorgente viene valutata con theta = 0:
    // così ricaviamo la direzione di riferimento
    // prima della rotazione attorno all'asse.
    axis.theta = 0;

    const baseFrame = axisFrame(axis, new Map());
    const k = V.unit(baseFrame.dir);

    const sourceDir = V.unit(
      MAT.mulV(baseFrame.R, axis[sourceVector])
    );

    axis.theta = previous;

    // La rotazione attorno a k può allineare soltanto
    // direzioni perpendicolari a k.
    if (Math.abs(V.dot(targetDir, k)) > 1e-4) {
      if (!q.invalidGeometry) {
        warn(
          "spinAlign",
          `${axis.id}: il vettore obiettivo ${target.id}.${targetVector} ` +
          `non è perpendicolare all'asse di rotazione`
        );
        q.invalidGeometry = true;
      }
      continue;
    }

    const sourceProjected = V.perp(sourceDir, k);
    const targetProjected = V.perp(targetDir, k);

    if (
      V.len(sourceProjected) < 1e-8 ||
      V.len(targetProjected) < 1e-8
    ) {
      continue;
    }

    const from = V.unit(sourceProjected);
    const to = V.unit(targetProjected);

    // Angolo che ruota from verso to attorno a k.
    const t1 = Math.atan2(
      V.dot(to, V.cross(k, from)),
      V.dot(from, to)
    );

    // Una relazione "parallel" ammette anche
    // la direzione opposta, separata da 180°.
    const candidates =
      mode === "parallel" ? [t1, t1 + PI] : [t1];

    let best = candidates[0];

    for (const candidate of candidates.slice(1)) {
      if (
        Math.abs(wrap(candidate - previous)) <
        Math.abs(wrap(best - previous))
      ) {
        best = candidate;
      }
    }

    // Aggiorna theta senza salti di 2π.
    axis.theta = previous + wrap(best - previous);

    // Il nodo viene aggiornato subito, come nel codice attuale.
    if (axis.node) {
      axis.node.rotationQuaternion =
        Quat.RotationAxis(axis.axisB, axis.theta);
    }
  }
}


/* =====================================================================
5e LINEE DINAMICHE POST-ANIMAZIONE (es. Raggi riflessi, linee di mira)
===================================================================== */
const dynamicLines = [];

function _getWorldPos(id) {
    // prova axis -> node -> transform di scena
    const ax = M.axisBy?.[id];
    if (ax?.node) {
        ax.node.computeWorldMatrix(true);
        return ax.node.getAbsolutePosition().clone();
    }
    if (M.pointBy?.[id]?.node) {
        M.pointBy[id].node.computeWorldMatrix(true);
        return M.pointBy[id].node.getAbsolutePosition().clone();
    }
    // fallback diretto a Babylon - funziona se gli id sono nomi di TransformNode/Mesh
    const t = scene.getTransformNodeByName(id) || scene.getNodeByName(id) || scene.getMeshByName(id);
    if (t) {
        t.computeWorldMatrix(true);
        return t.getAbsolutePosition().clone();
    }
    throw new Error(`Nodo non trovato per id: ${id}`);
}

function _getWorldZ(id) {
    const ax = M.axisBy?.[id];
    if (ax?.frame) {
        ax.frame.computeWorldMatrix(true);
        const wm = ax.frame.getWorldMatrix();
        return new BABYLON.Vector3(wm.m[8], wm.m[9], wm.m[10]).normalize();
    }
    if (ax?.node) {
        // se è un asse senza frame, usa il suo Z locale
        ax.node.computeWorldMatrix(true);
        const wm = ax.node.getWorldMatrix();
        return new BABYLON.Vector3(wm.m[8], wm.m[9], wm.m[10]).normalize();
    }
    // punto puro -> non ha direzione, usiamo Y world per l'offset
    return new BABYLON.Vector3(0, 1, 0);
}

function createParallel(directionAxisId, baseAxisId, offsetAlongBase = 0, length = 500, color = "#ffff00") {
    if (!M) throw new Error("Modello non ancora costruito.");
    const meshName = "dynParallel_" + directionAxisId + "_" + baseAxisId + "_off" + offsetAlongBase;
    const lineMesh = BABYLON.MeshBuilder.CreateLines(meshName, {
        points: [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0,0.1,0)], updatable: true
    }, scene);
    lineMesh.color = BABYLON.Color3.FromHexString(color);
    lineMesh.isPickable = false;
    lineMesh.renderingGroupId = 1;
    lineMesh.alwaysSelectAsActiveMesh = true;

    dynamicLines.push({ mesh: lineMesh, type: 'offset_on_axis', directionAxisId, baseAxisId, offsetAlongBase, length });
    return lineMesh;
}


function updateDynamicLines() {
    if (!M) return;
    for (const entry of dynamicLines) {
        try {
            const { mesh, type, length } = entry;
            let worldDir, worldPos;

            if (type === 'offset_on_axis') {
                const dirAxis = M.axisBy[entry.directionAxisId];
                if (!dirAxis) continue;
                dirAxis.frame?.computeWorldMatrix(true);
                const wmDir = dirAxis.frame ? dirAxis.frame.getWorldMatrix() : dirAxis.node.getWorldMatrix();
                worldDir = new BABYLON.Vector3(wmDir.m[8], wmDir.m[9], wmDir.m[10]).normalize();

                const basePos = _getWorldPos(entry.baseAxisId);
                const baseDir = _getWorldZ(entry.baseAxisId);
                worldPos = basePos.add(baseDir.scale(entry.offsetAlongBase));

            } else if (type === 'parallel_by_points') {
                const pos1 = _getWorldPos(entry.point1Id);
                const pos2 = _getWorldPos(entry.point2Id);

                let dir = pos2.subtract(pos1);
                if (dir.lengthSquared() < 1e-10) continue; // punti coincidenti
                worldDir = dir.normalize();

                const basePos = _getWorldPos(entry.baseAxisId);
                const baseDir = _getWorldZ(entry.baseAxisId);
                worldPos = basePos.add(baseDir.scale(entry.offsetAlongBase));
            } else continue;

            const half = length / 2;
            const p1 = worldPos.subtract(worldDir.scale(half));
            const p2 = worldPos.add(worldDir.scale(half));

            BABYLON.MeshBuilder.CreateLines(null, { points: [p1, p2], instance: mesh }, scene);

        } catch (err) {
            console.warn(`[updateDynamicLines] skip ${entry.mesh?.name}:`, err.message);
        }
    }
}



function rebuild(verbose = true, fresh = false) {   // fresh: macchina nuova, non si riportano gli angoli del modello precedente
  DBG.on = verbose || DBG.always;
  if (verbose) seenMsgs.clear();
  const t0 = performance.now();
  step('rebuild', '════════ ricostruzione del modello ════════');
  syncParams();
  const newM = resolveModel();   // se fallisce lancia un errore e resta il modello precedente
  validateModel(newM);

  const prevTheta = {}, prevSig = {};
  if (M) {
    if (!fresh) {
      for (const a of M.axes) prevTheta[a.id] = a.theta;
      for (const g of M.gears) prevSig[g.id] = g.sig;
    }
    for (const m of meshCache.values()) { m.parent = null; m.renderOverlay = false; }
    (M.nodes || []).forEach(n => n.dispose(true)); (M.extras || []).forEach(m => m.dispose());   // M può essere a metà (buildScene fallita)
  }
  M = newM;
  buildScene(M);


  for (const a of M.axes) a.theta = prevTheta[a.id] || 0;
  const dirty = a => { const gs = M.gears.filter(g => g.ax === a); return gs.length > 0 && gs.every(g => prevSig[g.id] !== g.sig); };
  for (const a of M.axes) if (dirty(a)) for (const m of M.meshes) {
    const other = m.g.ax === a ? m.p.ax : m.p.ax === a ? m.g.ax : null;
    if (!other || dirty(other)) continue;
    const nz = m.row.map((v, i) => Math.abs(v) > 1e-9 ? i : -1).filter(i => i >= 0);
    if (nz.length === 2) { a.theta = -m.row[other.idx] / m.row[a.idx] * other.theta; break; }
  }
  M.spins.forEach(q => { q.prev = q.a.theta; });
  updateSpin(M);
  updateThrough(M);
  // chiamala subito dopo aver costruito M
ensureWheelState(M);

  CTX.where = 'differential';
  try {
    M.differential = MACHINE.differential && relationCoeffs(M, MACHINE.differential.out, MACHINE.differential.ins);
    if (M.differential) step('differenziale', `w_${MACHINE.differential.out} = ${M.differential.map((c, i) => `${+c.toFixed(4)}·w_${MACHINE.differential.ins[i]}`).join(' + ')}`); // `
  } catch (e) { M.differential = null; warn('differenziale', `non calcolabile: ${e.message}`); }
  CTX.where = 'ratios';
  M.ratioVals = (MACHINE.ratios || []).map(r => {
    try { const v = Math.abs(relationCoeffs(M, r.to, [r.from, r.from])[0]); step('rapporto', `${r.from} → ${r.to}: ${+v.toFixed(4)}`); return v; }
    catch (e) { warn('rapporto', `${r.from} → ${r.to} non calcolabile: ${e.message}`); return NaN; }
  });
  CTX.where = '';
  step('rebuild', `completata in ${(performance.now() - t0).toFixed(0)} ms`); //`
}

/* =====================================================================
   7. INTERFACCIA
   ===================================================================== */
const rpmOf = exp => Math.pow(10, exp);
let sinceTable = 0;
let rowOf = {};

function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  e.append(...kids);
  return e;
}

function buildTable() {
  const tb = $('gearRows'); tb.innerHTML = ''; rowOf = {};
  for (const g of M.gears) {
    const row = tb.insertRow(); row.tabIndex = 0; row.dataset.gear = g.id; rowOf[g.id] = row;
    row.innerHTML = `<td>${esc(g.label)}</td><td>${esc(g.def.name)}${g.def.note ? ` <span style="color:var(--muted)">(${esc(g.def.note)})</span>` : ''}</td>` +
                    `<td>${esc(g.ax.id)}</td><td>${esc(g.z || '—')}</td><td>${fmt(2 * g.r, 1)}</td><td></td>`; // `
    row.onclick = () => selectGear(g.id);
    row.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectGear(g.id); } };
  }
}

function highlight(id) {
  if (state.current && M.gearBy[state.current]) M.gearBy[state.current].mesh.renderOverlay = false;
  state.current = id;
  const g = M.gearBy[id];
  g.mesh.renderOverlay = true; g.mesh.overlayColor = new C3(1, .85, 1); g.mesh.overlayAlpha = .85;
  $('selected').textContent = `${g.label} — ${g.ax.id}`;
  $('selected').title = `${g.label} — ${g.def.name}${g.z ? ', ' + g.z + ' denti' : ''}. Asse: ${g.ax.id}. Sensi visti ${g.ax.def.viewLabel || 'da davanti'}.`;
  for (const r of document.querySelectorAll('#gearRows tr')) r.classList.toggle('sel', r.dataset.gear === id);
}

function updateDriver() {
  const rpm = +$('speed').value;
  $('rpmLabel').textContent = fmt(rpm, 1);
  const g = state.current && M.gearBy[state.current];
  state.driver = g ? { gear: g.id, w: g.ax.cw * rpm * PI / 30 } : null;
  explainSoon();
}
function selectGear(id) {
  if (state.current === id) { releaseGear(); return; }
  highlight(id); updateDriver();
}

function releaseGear() {
  if (state.current && M.gearBy[state.current]) M.gearBy[state.current].mesh.renderOverlay = false;
  state.current = null; state.driver = null;
  $('selected').textContent = 'Nessun ingranaggio selezionato';
  $('selected').title = 'Seleziona un ingranaggio nella scena o nella tabella.';
  for (const r of document.querySelectorAll('#gearRows tr')) r.classList.remove('sel');
  explainSoon();
}

/* Gira la chiave di dphi: ogni asse si sposta di quanto prescrive la cinematica (soluzione con la sola chiave a velocità 1). */
function applyKeyOffset(deg) {
  const dphi = (deg - state.keyOffset) * PI / 180;
  state.keyOffset = deg;
  if (!M || !M.inputs.length || !dphi) return;
  const keyIdx = M.inputs[0].idx, { cons } = solveSpeeds(M);
  const bv = cons.map(c => (c.kind === 'input' && c.axisIdx === keyIdx) ? M.axes[keyIdx].cw : 0);
  const s = relSpins(M, solveConstraints(M, cons, bv).w);
  M.axes.forEach((a, i) => { a.theta += s[i] * dphi; });
}


/* Imposta la declinazione: ruota axis_Decli (e tutta la forcella che ne è portata) dell'angolo richiesto.
   Il segno è scelto in modo che +° corrisponda al senso "positivo" attorno all'asse; se in scena risulta
   invertito, cambia in `-dphi` nella riga `a.theta += dphi`. */
function applyDeclination(deg) {
  const dphi = (deg - state.declination) * PI / 180;
  state.declination = deg;
  if (!M || !dphi) return;
  const a = M.axisBy.axis_Decli;
  if (!a) return;
  a.theta += dphi;
  if (!a.aimed && a.node) a.node.rotationQuaternion = Quat.RotationAxis(a.axisB, a.theta);
  updateThrough(M);
}

function updateTexts() {
  const lines = []; let bad = false;
  try {
    for (const c of MACHINE.checks || []) if (isActive(c)) {
      if (c.type === 'axisClearsGear') {
        const a = M.axisBy[c.axis], g = M.gearBy[c.gear];
        const dist = V.len(V.perp(V.sub(a.O, g.ax.O), a.dir)), gap = dist - c.shaftR - (g.r + g.m), ex = { dist, gap, miss: c.min - gap };
        lines.push(template(c.text, M.ev, ex) + template(gap < c.min ? c.bad : c.ok, M.ev, ex));
        if (gap < c.min) bad = true;
      } else if (c.type === 'info') lines.push(template(c.text, M.ev));
    }
    const notes = (MACHINE.ratios || []).map((r, i) => template(r.text, M.ev, { r: M.ratioVals[i] }));
    $('note').textContent = notes.concat((MACHINE.notes || []).map(t => template(t, M.ev))).join(' ');
  } catch (e) { warn('testi', `errore nei testi di "checks"/"ratios"/"notes": ${e.message}`); }
  $('check').textContent = lines.join(' ');
  $('check').className = 'small' + (bad ? ' bad' : '');
}

function statusText(w, locked) {
  const lines = [], E = 1e-9;
  for (const r of M.ratchets) {
    const wd = w[r.driver], wa = w[r.driven], m = r.def.messages;
    if (locked.has(r)) lines.push(r.sign * wd > E ? m.drives : m.blocks);
    else if (Math.abs(wd) > E && Math.abs(wa) < E) lines.push(m.winding);
    else if (Math.abs(wa) > E && Math.abs(wd) < E) lines.push(m.freewheel);
  }
  for (const b of M.brakes) if (state.brakes[b.def.axis] && b.def.message) lines.push(b.def.message);
  for (const h of M.hookes) if (Math.abs(w[h.inIdx]) > E) lines.push(template(h.def.message, M.ev, { beta: Math.acos(h.cb) * 180 / PI, lo: h.cb, hi: 1 / h.cb }));
  if (M.differential) {
    const d = MACHINE.differential, [a, b] = M.differential;
    lines.push(template(d.text, M.ev, { a, b }) + ` Uscita: ${fmt(Math.abs(w[M.axisBy[d.out].idx]) * 30 / PI, 3)} giri/min.`);
  }
  if (M.spinText) lines.push(M.spinText);
  if (M.throughText) lines.push(M.throughText);
  return lines.join('\n');
}

function afterRebuild() {
  for (const [btn, gear] of [['siderealTime', 'gear_A1_upper'], ['siderealTimeRegulator', 'gear_M']]) {   // i due pulsanti presuppongono questi ingranaggi
    const b = $(btn); if (b) b.disabled = !M.gearBy[gear];
  }
  buildTable();
  const cur = state.current;
  if (cur && M.gearBy[cur]) highlight(cur);
  else {
    state.current = null;
    if (state.driver && !M.gearBy[state.driver.gear]) state.driver = null;
    $('selected').textContent = 'Nessun ingranaggio selezionato';
    $('selected').title = 'Seleziona un ingranaggio nella scena o nella tabella.';
  }
  updateTexts();
  sinceTable = 1;
  explainSoon();
  if (typeof updateDynamicLines === 'function') updateDynamicLines();
}


let rebuildQueued = false;
function onModelChange() {
  if (rebuildQueued) return;
  rebuildQueued = true;
  requestAnimationFrame(() => {
    rebuildQueued = false;
    try { rebuild(false); afterRebuild(); }
    catch (e) { reportError('ricostruzione (cursore)', e); console.warn('[rebuild] il modello precedente resta visualizzato'); }
  });
}

function onVariantChange() {
  try { rebuild(true); buildPanel(); afterRebuild(); return true; }
  catch (e) { reportError('cambio variante', e); console.warn('[rebuild] il modello precedente resta visualizzato (la variante selezionata ha errori)'); return false; }
}

/* Selettore delle varianti, costruito da MACHINE.variants:
     "variants": { "mirror_drive": { "label": "Comando dello specchio", "options": { "originale": "Originale", "alternativa": "Alternativa" }, "active": "originale" } }
   Un gruppo di radio per ogni variante (un valore di "options" per radio; l'etichetta è il valore della voce, o la chiave se manca).
   Con esattamente due opzioni e  "ui": "checkbox"  si ha invece una sola casella: spenta = prima opzione, accesa = seconda.
   Se la variante scelta dà errori il modello precedente resta visibile e la scelta viene annullata. */
function buildVariantPanel() {
  let box = $('variantsBox');
  if (!box) {                                    // la pagina non ha il contenitore: lo crea sotto i gruppi
    box = el('div', { id: 'variantsBox' }, el('h2', { textContent: 'Varianti' }), el('div', { id: 'variants' }));
    $('groups').insertAdjacentElement('afterend', box);
  }
  const host = $('variants'); host.innerHTML = '';
  const keys = Object.keys(MACHINE.variants || {});
  box.hidden = !keys.length;
  const choose = (k, value) => {
    const prev = state.variants[k]; state.variants[k] = value;
    if (!onVariantChange()) { state.variants[k] = prev; buildVariantPanel(); }
  };
  for (const k of keys) {
    const v = MACHINE.variants[k], opts = v.options || {}, names = Object.keys(opts);
    const nice = o => (typeof opts[o] === 'string' ? opts[o] : opts[o] && opts[o].label) || o;
    const row = el('div', { className: 'variant-row' }, el('div', { className: 'small', textContent: v.label || k }));
    if (v.ui === 'checkbox' && names.length === 2) {
      const inp = el('input', { type: 'checkbox', checked: state.variants[k] === names[1] });
      inp.onchange = () => choose(k, inp.checked ? names[1] : names[0]);
      row.append(el('label', {}, inp, ' ' + nice(names[1])));
    } else for (const o of names) {
      const inp = el('input', { type: 'radio', name: 'variant_' + k, value: o, checked: state.variants[k] === o });
      inp.onchange = () => { if (inp.checked) choose(k, o); };
      row.append(el('label', { style: 'margin-right:10px' }, inp, ' ' + nice(o)));
    }
    host.append(row);
  }
}

function goView(v) {
  let target, radius;
  CTX.where = `vista "${v.id}"`;
  if (v.auto) {
    const b = modelBounds();
    target = V3.Zero();                                   // l'origine sta al centro del pannello 3D
    let R = 0;
    for (const x of [b.min[0], b.max[0]]) for (const y of [b.min[1], b.max[1]]) for (const z of [b.min[2], b.max[2]]) R = Math.max(R, Math.hypot(x, y, z));
    const half = Math.min(camera.fov / 2, Math.atan(Math.tan(camera.fov / 2) * engine.getAspectRatio(camera)));
    radius = R / Math.sin(half) * (v.scale || 1);         // raggio che fa stare tutto il modello nella metà sinistra
  } else { target = toV3(V.toB(v.target.map(e => M.ev(e)))); radius = v.radius; }
  CTX.where = '';
  if (![target.x, target.y, target.z, radius].every(Number.isFinite) || radius <= 0) { fail('vista', `vista "${v.id}": target/raggio non validi`, target, radius); return; }
  camera.setTarget(target);
  camera.alpha = M.ev(v.alpha); camera.beta = M.ev(v.beta); camera.radius = radius;
  step('vista', `"${v.id}": target=(${target.x.toFixed(1)}, ${target.y.toFixed(1)}, ${target.z.toFixed(1)}) raggio=${radius.toFixed(1)}`);
}

function buildShowSpeeds() {
  const box = $('showSpeeds');
  box.innerHTML = '<div class="small" style="color:var(--muted);margin-bottom:4px">Velocità (giri/min)</div>';
  for (const item of (MACHINE.show || [])) {
    const row = el('div', { className: 'shown-speed' });
    const label = el('span', { className: 'shown-speed-label', textContent: item.label || item.gear || item.axis || '' });
    const value = el('span', { className: 'shown-speed-value', textContent: '—' });
    row.append(label, value);
    box.append(row);
    item._valueElement = value;
  }
  updateShowSpeeds();
}

function updateShowSpeeds() {
  if (!M) return;
  let w;
  try { w = solveSpeeds(M).w; } catch (e) { return; }
  for (const item of (MACHINE.show || [])) {
    const out = item._valueElement;
    if (!out) continue;
    const axis = item.axis ? M.axisBy[item.axis] : item.gear && M.gearBy[item.gear] ? M.gearBy[item.gear].ax : null;
    if (!axis) { out.textContent = 'non disponibile'; continue; }
    out.textContent = fmtRpm(rpmOfW(axis, w[axis.idx]));
  }
}

function buildPanel() {
  const cb = $('controls'); cb.innerHTML = '';
  for (const c of MACHINE.controls) {
    if (c.hidden) continue;
    const vv = c.variantKey ? state.variants[c.variantKey] : 'all', rng = c.ranges[vv];
    if (!rng) continue;
    const out = el('b', { textContent: fmt(state.ctrl[c.id][vv], 1) });
    const inp = el('input', { type: 'range', min: rng.min, max: rng.max, step: c.step, value: state.ctrl[c.id][vv] });
    inp.oninput = () => { state.ctrl[c.id][vv] = +inp.value; out.textContent = fmt(+inp.value, 1); onModelChange(); };
    cb.append(el('label', {}, c.label + ': ', out, inp));
  }
  buildShowSpeeds();
  const wc = $('wheelControls'); wc.innerHTML = '';
//   for (const gearId of ['gear_U3', 'gear_Rp']) {
//     const title = gearId === 'gear_U3' ? 'Declinazione' : 'Ascensione retta';
//     const section = el('div', { className: 'wheel-controls' });
//     section.append(el('h2', { textContent: `${title} — pilotaggio indipendente` }));
//     const speedOut = el('b', { textContent: fmt(state.wheelInputs[gearId].rpm, 3) });
//     const speedSlider = el('input', { type: 'range', min: -100, max: 100, step: 1, value: state.wheelInputs[gearId].rpm, title: `Velocità indipendente di ${title}, in giri/min` });
//     speedSlider.oninput = () => { state.wheelInputs[gearId].rpm = +speedSlider.value; speedOut.textContent = fmt(+speedSlider.value, 3); explainSoon(); };
//     section.append(el('label', {}, 'Velocità angolare: ', speedOut, ' giri/min', speedSlider));
//     const offsetOut = el('b', { textContent: fmt(state.wheelOffsets[gearId], 1) });
//     const offsetSlider = el('input', { type: 'range', min: -360, max: 360, step: 1, value: state.wheelOffsets[gearId], title: `Offset angolare di ${title}, in gradi` });
//     offsetSlider.oninput = () => {
//       const v = +offsetSlider.value, delta = (v - state.wheelOffsets[gearId]) * PI / 180;
//       state.wheelOffsets[gearId] = v; offsetOut.textContent = fmt(v, 1);
//       const g = M && M.gearBy[gearId];
//       if (g && delta) { g.ax.theta += delta; updateThrough(M); updateSpin(M); }
//     };
//     section.append(el('label', {}, 'Offset angolare: ', offsetOut, '°', offsetSlider));
//     wc.append(section);
//   }

// data-driven: prendi tutti i gear che dichiarano independentTuning
// usa M.gears se è l'array sorgente (mantiene l'ordine del JSON), altrimenti gearBy
const tunableGears = getTunableGears(M);

for (const gear of tunableGears) {
  const gearId = gear.id;
  const title = typeof getIndependentTuning(gear) === 'string'
   ? getIndependentTuning(gear)
    : (gear.label || gearId); // fallback se metterai independentTuning: true

  // inizializza se manca - rende il tutto robusto a nuovi gear
  state.wheelInputs[gearId]??= { rpm: 0 };
  state.wheelOffsets[gearId]??= 0;

  const section = el('div', { className: 'wheel-controls' });
  section.append(el('h2', { textContent: `${title} — pilotaggio indipendente` }));

  const speedOut = el('b', { textContent: fmt(state.wheelInputs[gearId].rpm, 3) });
  const speedSlider = el('input', {
    type: 'range', min: -100, max: 100, step: 1,
    value: state.wheelInputs[gearId].rpm,
    title: `Velocità indipendente di ${title}, in giri/min`
  });
  speedSlider.oninput = () => {
    state.wheelInputs[gearId].rpm = +speedSlider.value;
    speedOut.textContent = fmt(+speedSlider.value, 3);
    explainSoon();
  };
  section.append(el('label', {}, 'Velocità angolare: ', speedOut, ' giri/min', speedSlider));

  const offsetOut = el('b', { textContent: fmt(state.wheelOffsets[gearId], 1) });
  const offsetSlider = el('input', {
    type: 'range', min: -360, max: 360, step: 1,
    value: state.wheelOffsets[gearId],
    title: `Offset angolare di ${title}, in gradi`
  });
  offsetSlider.oninput = () => {
    const v = +offsetSlider.value, delta = (v - state.wheelOffsets[gearId]) * PI / 180;
    state.wheelOffsets[gearId] = v;
    offsetOut.textContent = fmt(v, 1);
    // gear è già l'istanza, non serve più cercare per id
    if (delta) { gear.ax.theta += delta; updateThrough(M); updateSpin(M); }
  };
  section.append(el('label', {}, 'Offset angolare: ', offsetOut, '°', offsetSlider));

  wc.append(section);
}


  const bb = $('brakes'); bb.innerHTML = '';
  for (const b of M.brakes) {
    const c = el('input', { type: 'checkbox', checked: !!state.brakes[b.def.axis] });
    c.onchange = () => { state.brakes[b.def.axis] = c.checked; explainSoon(); };
    bb.append(el('label', {}, c, ' ' + b.def.label));
  }
 // if (M.inputs.length) $('keyTitle').textContent = M.inputs[0].def.label;
}


function buildStaticPanel() {
  $('title').textContent = MACHINE.title;
  $('groups').innerHTML = '';
  buildVariantPanel();
  for (const g of MACHINE.groups) {
    const c = el('input', { type: 'checkbox', checked: state.groups[g.id] });
    c.onchange = () => { state.groups[g.id] = c.checked; applyGroups(); };
    $('groups').append(el('label', {}, c, ' ' + g.label));
  }
  $('rpmLabel').textContent = fmt(+$('speed').value, 1);
  $('speed').oninput = updateDriver;
  $('siderealTime').onclick = () => {
    const gearId = 'gear_A1_upper';
    const g = M && M.gearBy[gearId];
    if (!g) { reportError('Sidereal time', new Error(`ingranaggio ${gearId} non trovato`)); return; }
    highlight(gearId);
    const rpm = 1 / 1440;
    $('speed').value = String(rpm);
    $('rpmLabel').textContent = rpm.toFixed(6);
    state.driver = { gear: gearId, w: g.ax.cw * rpm * PI / 30 };
    explainSoon();
  };

  $('siderealTimeRegulator').onclick = () => {
    const gearId = 'gear_M';
    const g = M && M.gearBy[gearId];
    if (!g) { reportError('Sidereal time', new Error(`ingranaggio ${gearId} non trovato`)); return; }
    highlight(gearId);
    const rpm = 1 / 1440;
    $('speed').value = String(rpm);
    $('rpmLabel').textContent = rpm.toFixed(6);
    state.driver = { gear: gearId, w: g.ax.cw * rpm * PI / 30 };
    explainSoon();
  };

//
//   $('keyRpmLabel').textContent = fmt(+$('keySpeed').value, 1);
//   $('keyOffLabel').textContent = fmt(+$('keyOffset').value, 0);
//   $('keySpeed').oninput = () => {
//     const v = +$('keySpeed').value;
//     for (const id in state.inputs) state.inputs[id].rpm = v;
//     $('keyRpmLabel').textContent = fmt(v, 1); explainSoon();
//   };
//   $('keyOffset').oninput = () => { const v = +$('keyOffset').value; $('keyOffLabel').textContent = fmt(v, 0); applyKeyOffset(v); };
//   $('decliLabel').textContent = fmt(state.declination, 1);
//   $('decliSlider').value = state.declination;
//   $('decliSlider').oninput = () => {
//     const v = +$('decliSlider').value;
//     $('decliLabel').textContent = fmt(v, 1);
//     applyDeclination(v);
//   };
}

let axesGizmo = [];
function drawAxes(len) {
  axesGizmo.forEach(o => o.dispose(false, true)); axesGizmo = [];
  const defs = [[[1, 0, 0], '#e5484d', 'X'], [[0, 1, 0], '#3fb950', 'Y'], [[0, 0, 1], '#58a6ff', 'Z']];
  for (const [d, hex, label] of defs) {
    const col = C3.FromHexString(hex), end = toV3(V.mul(V.toB(d), len));
    const line = BABYLON.MeshBuilder.CreateLines('axis', { points: [V3.Zero(), end] }, scene);
    line.color = col;
    const tip = BABYLON.MeshBuilder.CreateSphere('axisTip', { diameter: 8 }, scene);
    tip.position = end;
    const tm = new BABYLON.StandardMaterial('a', scene); tm.emissiveColor = col; tm.disableLighting = true; tip.material = tm;
    const tex = new BABYLON.DynamicTexture('t', { width: 64, height: 64 }, scene, false);
    tex.hasAlpha = true; tex.drawText(label, 14, 48, 'bold 44px sans-serif', hex, 'transparent', true);
    const plane = BABYLON.MeshBuilder.CreatePlane('axisLabel', { size: 24 }, scene), pm = new BABYLON.StandardMaterial('a', scene);
    pm.diffuseTexture = tex; pm.useAlphaFromDiffuseTexture = true; pm.emissiveColor = C3.White(); pm.disableLighting = true; pm.backFaceCulling = false;
    plane.material = pm; plane.billboardMode = 7; plane.position = end.add(new V3(0, 14, 0));
    for (const o of [line, tip, plane]) { o.renderingGroupId = 1; o.isPickable = false; axesGizmo.push(o); }
  }
}




/* =====================================================================
   7b. CARICAMENTO DELLA MACCHINA DA FILE
   ===================================================================== */
/* Il file può essere JSON puro oppure il file della macchina com'è: "var MACHINE = { ... };" con commenti di riga e di blocco e virgole finali.
   Commenti, virgole finali e il "var MACHINE =" vengono sostituiti da spazi, così le posizioni degli errori restano quelle del file.
   Il testo non viene mai eseguito: è solo JSON.parse (e le espressioni nelle stringhe le valuta il parser interno, non eval). */
function cleanMachineText(src) {
  const n = src.length, out = src.split('');
  const skipString = i => {                     // i punta all'apice di apertura; ritorna l'indice dopo quello di chiusura
    const q = src[i]; i++;
    while (i < n && src[i] !== q && src[i] !== '\n') i += src[i] === '\\' ? 2 : 1;
    return i + 1;
  };
  for (let i = 0; i < n;) {                      // 1) commenti
    const c = src[i];
    if (c === "'") { const b = src.slice(0, i); throw new Error(`apice singolo alla riga ${b.split('\n').length}, colonna ${i - b.lastIndexOf('\n')}: in JSON le stringhe vogliono i doppi apici`); }
    if (c === '"') i = skipString(i);
    else if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') out[i++] = ' '; }
    else if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2), stop = end < 0 ? n : end + 2;
      for (; i < stop; i++) if (src[i] !== '\n') out[i] = ' ';
    } else i++;
  }
  const t = out.join('');
  for (let i = 0; i < n;) {                      // 2) virgole finali (prima di ] o })
    const c = t[i];
    if (c === '"' || c === "'") i = skipString(i);
    else {
      if (c === ',') { let k = i + 1; while (k < n && /\s/.test(t[k])) k++; if (t[k] === ']' || t[k] === '}') out[i] = ' '; }
      i++;
    }
  }
  let text = out.join('');
  const first = text.indexOf('{'), last = text.lastIndexOf('}');   // 3) "var MACHINE =" davanti e ";" dietro
  if (first < 0 || last < first) throw new Error('nel file non c\'è nessun oggetto { … }');
  const blank = x => x.replace(/[^\n]/g, ' '), head = text.slice(0, first), tail = text.slice(last + 1);
  if (head.trim() && !/^\s*(?:(?:var|let|const)\s+)?(?:(?:window|globalThis)\.)?MACHINE\s*=\s*$/.test(head)) throw new Error(`prima dell'oggetto c'è del testo che non è "var MACHINE =": «${head.trim().slice(0, 40)}»`);
  if (tail.replace(/[;\s]/g, '')) throw new Error(`dopo l'oggetto c'è altro testo: «${tail.trim().slice(0, 40)}»`);
  return blank(head) + text.slice(first, last + 1) + blank(tail);
}

function parseMachineText(raw) {
  const text = cleanMachineText(raw.replace(/^\uFEFF/, ' '));
  try { return JSON.parse(text); }
  catch (e) {
    const m = /position (\d+)/.exec(e.message);
    let where = '';
    if (m) {
      const pos = +m[1], before = text.slice(0, pos), line = before.split('\n').length, col = pos - before.lastIndexOf('\n');
      where = ` (riga ${line}, colonna ${col}: «${(raw.split('\n')[line - 1] || '').trim().slice(0, 70)}»)`;
    }
    throw new Error('JSON non valido: ' + e.message.replace(/ in JSON at position \d+.*$/, '') + where);
  }
}

/* Completa i campi che il motore dà per scontati e controlla i tipi di base; il resto lo controlla validateMachine(). */
function normalizeMachine(m) {
  if (m && typeof m === 'object' && !Array.isArray(m) && !m.axes && m.MACHINE && typeof m.MACHINE === 'object') m = m.MACHINE;   // accetta anche { "MACHINE": {...} }
  if (!m || typeof m !== 'object' || Array.isArray(m)) throw new Error('il file non contiene un oggetto macchina');
  const out = { title: 'Macchina caricata', show: [], variants: {}, controls: [], consts: {}, axes: [], gears: [], links: [], inputs: [], groups: [], views: [], checks: [], ratios: [], notes: [], ...m };
  for (const k of ['show', 'controls', 'axes', 'gears', 'links', 'inputs', 'groups', 'views', 'checks', 'ratios', 'notes']) if (!Array.isArray(out[k])) throw new Error(`"${k}" deve essere un array`);
  for (const k of ['variants', 'consts']) if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k])) throw new Error(`"${k}" deve essere un oggetto`);
  if (!out.axes.length) throw new Error('"axes" è vuoto: la macchina non ha assi');
  if (!out.views.length) out.views = [{ id: 'all', label: 'Insieme', auto: true, alpha: 'pi/2-0.7', beta: 1.1, scale: 1.1 }];
  out.title = String(out.title);
  return out;
}

/* Inquadra il modello e ridisegna gli assi X/Y/Z (usata all'avvio e dopo ogni caricamento). */
function fitCameraToModel() {
  const b = modelBounds(), diag = Math.hypot(b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]);
  if (!Number.isFinite(diag) || diag <= 0 || diag > 1e7) throw new Error(`Dimensioni del modello non valide (diagonale = ${diag}): controlla i messaggi [mesh]/[verifica]/[ingombro] qui sopra`);
  camera.upperRadiusLimit = diag * 5; camera.maxZ = diag * 20;
  engine.resize();
  goView(MACHINE.views[0]);
  drawAxes(.4 * diag);
  return diag;
}

/* Sostituisce la macchina corrente con `data` (oggetto già letto). Se qualcosa fallisce, rimette la macchina precedente e rilancia l'errore. */
function applyMachine(data) {
  const next = normalizeMachine(data);
  const old = { machine: MACHINE, state: { ...state }, M };
  try {
    MACHINE = next;
    initStateFromMachine();
    buildStaticPanel();
    rebuild(true, true);
    buildPanel();
    afterRebuild();
    fitCameraToModel();
  } catch (e) {
    MACHINE = old.machine; Object.assign(state, old.state);
    try {
      buildStaticPanel();
      if (M !== old.M) rebuild(true, true);       // il nuovo modello era già stato costruito: si ricostruisce il vecchio
      buildPanel(); afterRebuild();
    } catch (e2) { console.error('[caricamento] impossibile ripristinare la macchina precedente', e2); }
    throw e;
  }
}

function setMachineMsg(text, isError) {
  const m = $('machineMsg'); if (!m) return;
  m.textContent = text; m.style.color = isError ? 'var(--bad)' : 'var(--muted)';
}

async function loadMachineFile(file) {
  setMachineMsg(`Caricamento di «${file.name}»…`);
  try {
    if (file.size > 8e6) throw new Error(`file troppo grande (${(file.size / 1e6).toFixed(1)} MB)`);
    applyMachine(parseMachineText(await file.text()));
    setMachineMsg(`Caricata «${file.name}»: ${MACHINE.axes.length} assi, ${MACHINE.gears.length} ingranaggi, ${MACHINE.links.length} link.`);
  } catch (e) {
    console.error('[caricamento]', e);
    setMachineMsg(`«${file.name}» non caricato: ${e.message}. La macchina precedente è rimasta attiva (dettagli nel pannello errori / console).`, true);
  }
}

function setupMachineLoader() {
  if (!$('machineLoader')) {                   // se la pagina non ha già i controlli, li crea sotto il titolo
    const box = el('div', { id: 'machineLoader' },
      el('button', { type: 'button', id: 'loadMachineBtn', className: 'sidereal-button', textContent: 'Carica macchina da file…', title: 'Sostituisce la macchina precaricata con quella di un file .json o .js (anche trascinandolo sulla pagina).' }),
      el('button', { type: 'button', id: 'resetMachineBtn', className: 'sidereal-button', textContent: 'Macchina predefinita', title: 'Ricarica la macchina con cui si è aperta la pagina.' }),
      el('input', { type: 'file', id: 'machineFile', accept: '.json,.js,.txt,application/json,text/plain', hidden: true }),
      el('div', { id: 'machineMsg', className: 'small' }));
    box.querySelector('#machineMsg').setAttribute('aria-live', 'polite');
    $('title').insertAdjacentElement('afterend', box);
  }
  const input = $('machineFile');
  $('loadMachineBtn').onclick = () => input.click();
  input.onchange = () => { const f = input.files[0]; input.value = ''; if (f) loadMachineFile(f); };
  $('resetMachineBtn').onclick = () => {
    try { applyMachine(JSON.parse(JSON.stringify(DEFAULT_MACHINE))); setMachineMsg('Macchina predefinita ripristinata.'); }
    catch (e) { console.error('[caricamento]', e); setMachineMsg(`Macchina predefinita non ripristinata: ${e.message}`, true); }
  };
  const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
  addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
  addEventListener('drop', e => { if (!hasFiles(e)) return; e.preventDefault(); if (e.dataTransfer.files[0]) loadMachineFile(e.dataTransfer.files[0]); });
}

/* =====================================================================
   8. AVVIO e ANIMAZIONE
   ===================================================================== */
setupMachineLoader();            // prima del resto: se la macchina precaricata ha errori, si può comunque caricarne un'altra
try {
  step('avvio', 'costruzione dell\'interfaccia e del modello');
  buildStaticPanel();
  rebuild(true);
  buildPanel();
  afterRebuild();
  const diag = fitCameraToModel();
  step('avvio', `modello pronto: diagonale ${diag.toFixed(0)} mm`);
} catch (e) { reportError('avvio', e); }

scene.onPointerObservable.add(info => {
  const hit = info.pickInfo;
  if (M && info.type === BABYLON.PointerEventTypes.POINTERTAP && hit && hit.hit && hit.pickedMesh.metadata) selectGear(hit.pickedMesh.metadata);
});

scene.onBeforeRenderObservable.add(() => {
  if (!M) return;
  const dt = Math.min(engine.getDeltaTime() / 1000, .05) * state.timeScale;
    const { w, locked, cons } = solveSpeeds(M);
  // s[i] = velocità dell'asse i RELATIVA al suo carrier: è quella che fa ruotare il nodo (figlio del nodo del carrier)
  const s = relSpins(M, w);
  M.axes.forEach((a, i) => { a.theta += s[i] * dt; });
  for (const h of M.hookes) M.axes[h.outIdx].theta = hookePsi(h, M.axes[h.inIdx].theta);
  updateSpin(M);

  for (const a of M.axes) if (!a.aimed) a.node.rotationQuaternion = Quat.RotationAxis(a.axisB, a.theta);
  updateThrough(M);

  // Applica tutti i vincoli di orientamento descritti nella macchina.
  updateSpinAlign(M);
updateDynamicLines();

for (const ps of M.pinSlots || []) {
  const alpha1 = ps.g1.ax.theta + ps.initialPinAngle;
  const A = ps.rPin * Math.cos(alpha1) - ps.dx;
  const B = ps.rPin * Math.sin(alpha1) - ps.dy;
  if (A * A + B * B < 1e-20) continue;
  const curA2 = ps.g2.ax.theta + ps.slotAngle;
  let target = Math.atan2(B, A);
  while (target - curA2 >  PI) target -= 2 * PI;
  while (target - curA2 < -PI) target += 2 * PI;
  ps.g2.ax.theta = target - ps.slotAngle;
  if (ps.slotAxis && ps.slotAxis !== ps.g2.ax) ps.slotAxis.theta = ps.g2.ax.theta;
}

const angleBox = $("siderostatAngles");

if (angleBox) {
  const deg = axis => {
    const v = ((axis.theta * 180 / PI) % 360 + 360) % 360;
    return v > 180 ? v - 360 : v;
};

  angleBox.innerHTML = (M.spinAlign || []).map(q => {
    const sourceName = q.axis.def.name || q.axis.id;
    const targetName = q.target.def.name || q.target.id;

    return (
      `<div><b>${esc(sourceName)}</b> rispetto a ` +
      `<b>${esc(targetName)}</b>: ${fmt(deg(q.axis), 2)}°</div>`
    );
  }).join("") || "Nessun vincolo di orientamento attivo.";
}


  for (const h of M.hookes) orientCross(h, M.axes[h.inIdx].theta);

  for (const r of M.ropes) {
    const len = Math.min(r.def.max, Math.max(r.def.min, r.def.len0 + r.radius * M.axes[r.idx].theta));
    r.rope.scaling.y = len; r.rope.position.set(r.top[0], r.top[1] - len / 2, r.top[2]);
    r.weight.position.set(r.top[0], r.top[1] - len - 15, r.top[2]);
  }

  for (const b of M.brakes) {
    const on = !!state.brakes[b.def.axis];
    b.mesh.position.copyFrom(on ? b.engaged : b.released);
    b.mesh.material.diffuseColor = C3.FromHexString(on ? '#d4262e' : '#6b7280');
  }
  sinceTable += dt;
  if (sinceTable > .1 || !dt) {
    sinceTable = 0;
    updateTable(w, cons);
    $('status').textContent = statusText(w, locked);
  }
});


createParallel("axis_forcella", "axis_coda_specchio", -35, 800, "#ffff00"); // sole
createParallel("axis_coda_specchio", "axis_coda_specchio", -35, 800, "#888888"); // bisettrice
createParallel("axis_direzione_riflesso", "axis_coda_specchio", -35, 5800, "#ff8800") // riflesso


let frames = 0;
engine.runRenderLoop(() => {
  try {
    scene.render();
    if (++frames === 1) console.log('%c[render]%c primo frame disegnato', 'color:#d9b45a;font-weight:bold', 'color:inherit');
  } catch (e) {
    reportError('render', e);
    engine.stopRenderLoop();
  }
});
addEventListener('resize', () => engine.resize());