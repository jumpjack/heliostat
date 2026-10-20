const T0 = performance.now();
const DBG = { on: true, always: false };      // DBG.on: log passo-passo attivo per la ricostruzione corrente
const CTX = { where: '' };                    // contesto corrente, aggiunto ai messaggi d'errore delle espressioni
const seenMsgs = new Set(), seenBanner = new Set();

function banner(tag, text) {
  const key = tag + '|' + text;
  if (seenBanner.has(key)) return;
  seenBanner.add(key);
  let b = document.getElementById('errBanner');
  if (!b) {
    b = document.createElement('div'); b.id = 'errBanner'; b.title = 'Clic per chiudere';
    b.onclick = () => { b.remove(); seenBanner.clear(); };
    (document.body || document.documentElement).append(b);
  }
  const line = document.createElement('div');
  line.textContent = `[${tag}] ${text}`;
  b.append(line);
}
function step(tag, msg, ...rest) {
  if (DBG.on) console.log(`%c[${tag}]%c ${msg}`, 'color:#d9b45a;font-weight:bold', 'color:inherit', ...rest);
}
function warn(tag, msg, ...rest) {
  const k = tag + '|' + msg;
  if (seenMsgs.has(k)) return;
  seenMsgs.add(k);
  console.warn(`[${tag}] ⚠ ${msg}`, ...rest);
}
function fail(tag, msg, ...rest) {
  console.error(`[${tag}] ✖ ${msg}`, ...rest);
  banner(tag, msg);
}
function reportError(where, e) {
  const msg = (e && e.message) || String(e);
  console.error(`[ERRORE: ${where}] ✖ ${msg}`, e);
  banner(where, msg);
}
addEventListener('error', ev => reportError('window.onerror', ev.error || ev.message));
addEventListener('unhandledrejection', ev => reportError('promise', ev.reason));