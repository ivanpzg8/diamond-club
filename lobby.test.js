const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/showView\('lobbyView'\)\}\)\(\);\s*$/, `showView('lobbyView');globalThis.__test={s,selectBatter,selectStadium,trainActiveBatter,startOrResumeGame,pointerPos};})();`);
const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const elements = {}, handlers = {};
for (const id of ids) {
  const classes = new Set();
  elements[id] = {
    style: {}, classList: { add(x) { classes.add(x); }, remove(x) { classes.delete(x); }, toggle(x, on) { on ? classes.add(x) : classes.delete(x); }, contains(x) { return classes.has(x); } },
    addEventListener(name, fn) { handlers[`${id}:${name}`] = fn; }, querySelectorAll() { return []; }, dataset: {}, onclick: null,
    getBoundingClientRect() { return { left: 0, top: 0, width: 700, height: 400 }; }, setPointerCapture() {},
    textContent: '', innerHTML: '', disabled: false,
  };
  if (id === 'lobbyView') classes.delete('hidden');
}
const stored = { value: null }, windowHandlers = {};
let registeredWorker = null;
const context = {
  document: { getElementById: id => elements[id], querySelectorAll: () => [] }, window: { addEventListener(name, fn) { windowHandlers[name] = fn; } }, navigator: { serviceWorker: { register(path) { registeredWorker = path; return Promise.resolve({}); } } },
  localStorage: { getItem() { return stored.value; }, setItem(k, v) { stored.value = v; } },
  Math, console, performance: { now: () => 1000 }, clearTimeout() {}, setTimeout() { return 1; }, requestAnimationFrame() {},
};
vm.runInNewContext(script, context);
const t = context.__test;
if (elements.primaryGameBtn.textContent !== 'Jugar partido') throw new Error('New profile should start in the lobby');
t.s.coins = 100;
t.selectBatter('maya');
t.trainActiveBatter();
const maya = t.s.roster.find(p => p.id === 'maya');
if (t.s.selectedBatter !== 'maya' || maya.level !== 3 || maya.contact !== 70 || t.s.coins !== 50) throw new Error('Roster selection/training failed');
t.selectStadium('night');
if (t.s.stadium !== 'night' || !stored.value.includes('"stadium":"night"')) throw new Error('Stadium selection was not saved');
t.s.pitch={name:'PITCH OBSOLETO'}; t.s.active=true; t.s.fielding=true;
t.startOrResumeGame();
if (!t.s.gameActive || t.s.inning !== 1 || elements.matchView.classList.contains('hidden')) throw new Error('Starting a match failed');
if (!t.s.pitch || t.s.pitch.name==='PITCH OBSOLETO' || t.s.active || t.s.fielding) throw new Error('Fresh match should discard stale pitch and fielding state');
if (!elements.fieldScoreboard.textContent.includes('NOCHE ESTRELLADA')) throw new Error('Selected stadium name should appear on the field scoreboard');
t.pointerPos({clientX:350,clientY:300,pointerType:'touch'});
if (Math.abs(t.s.mouse.x-.46)>.001 || Math.abs(t.s.mouse.y-.61)>.001) throw new Error('Touch aiming should offset the reticle from under the finger');
t.s.half=1;t.pointerPos({clientX:500,clientY:300,pointerType:'touch'});
if (!elements.pitchInfo.innerHTML.includes('probable bola')) throw new Error('Pitching aim guide should explain an outside target');
t.pointerPos({clientX:350,clientY:300,pointerType:'mouse'});
if (Math.abs(t.s.mouse.x-.5)>.001 || Math.abs(t.s.mouse.y-.74)>.001) throw new Error('Mouse aim should remain aligned to the cursor');
windowHandlers.load();
if (registeredWorker !== './sw.js') throw new Error('App should register its offline service worker');
let prevented=false,prompted=false;
windowHandlers.beforeinstallprompt({preventDefault(){prevented=true;},async prompt(){prompted=true;},userChoice:Promise.resolve({outcome:'accepted'})});
if (!prevented || elements.installButton.hidden) throw new Error('Supported browsers should reveal the install button');
Promise.resolve(handlers['installButton:click']()).then(()=>{
  if (!prompted || !elements.installButton.hidden || elements.installButton.disabled) throw new Error('Install button should complete and reset after the browser prompt');
  windowHandlers.appinstalled();
  console.log('Lobby, training, stadium, fresh match and PWA install flow pass');
}).catch(error=>{console.error(error);process.exitCode=1});
