const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/showView\('lobbyView'\)\}\)\(\);\s*$/, 'showView(\'lobbyView\');globalThis.__test={s,nextInning,advanceRunners,fieldNow,startFielding,outsideStrikeZone,outsidePitchTarget,inZonePitchTarget,pitchBallChance,aiPitchPool,recordOut};})();');
new Function(source);
const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const elements = {}, handlers = {};
for (const id of ids) elements[id] = {
  style: {}, classList: { add() {}, remove() {}, toggle() {} },
  addEventListener(name, fn) { handlers[`${id}:${name}`] = fn; }, querySelectorAll() { return []; }, dataset: {}, onclick: null,
  setPointerCapture() {}, getBoundingClientRect() { return id==='strikeZone'?{left:306,top:192,right:394,bottom:264,width:88,height:72}:{left:0,top:0,right:700,bottom:400,width:700,height:400}; },
  textContent: '', innerHTML: '', disabled: false,
};
let now = 0, timers = [];
const fixedMath = Object.create(Math); fixedMath.random = () => .5;
const context = {
  document: { getElementById: id => elements[id], querySelectorAll: () => [] },
  window: { addEventListener(name, fn) { handlers[`window:${name}`] = fn; } },
  localStorage: { getItem() { return null; }, setItem() {} }, Math: fixedMath, console,
  performance: { now: () => now }, clearTimeout() {},
  setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; },
  requestAnimationFrame(fn) { fn(now += 100); },
};
vm.runInNewContext(source, context);
function runTimer(ms) {
  const i = timers.findIndex(t => t.ms === ms);
  if (i < 0) throw new Error(`Expected timer ${ms}; queued: ${timers.map(t => t.ms)}`);
  timers.splice(i, 1)[0].fn();
}
function runFlight() {
  const i = timers.findIndex(t => t.ms > 700);
  if (i < 0) throw new Error(`Expected flight timer; queued: ${timers.map(t => t.ms)}`);
  timers.splice(i, 1)[0].fn();
}
if (context.__test.outsideStrikeZone(.5,.5)) throw new Error('Center pitch should be inside the strike zone');
if (!context.__test.outsideStrikeZone(.5,.68) || !context.__test.outsideStrikeZone(.62,.5)) throw new Error('A pitch outside the visible zone must be called a ball');
const strikeTarget = context.__test.inZonePitchTarget();
if (context.__test.outsideStrikeZone(strikeTarget.x,strikeTarget.y)) throw new Error('Generated strike target must stay inside the visible zone');
const generatedBall = context.__test.outsidePitchTarget();
if (!context.__test.outsideStrikeZone(generatedBall.x,generatedBall.y)) throw new Error('Generated ball target must be outside the visible strike zone');
context.__test.s.balls=3; context.__test.s.strikes=0;
if (context.__test.pitchBallChance()!==.08 || !context.__test.aiPitchPool().every(p=>p.kind==='fast')) throw new Error('Pitcher should challenge a 3-ball count with more strikes');
context.__test.s.balls=0; context.__test.s.strikes=2;
if (context.__test.pitchBallChance()!==.25 || !context.__test.aiPitchPool().every(p=>p.kind!=='fast')) throw new Error('Two-strike count should favor slower chase pitches');
context.__test.s.balls=0; context.__test.s.strikes=0;
handlers['primaryGameBtn:click'](); runTimer(850); runFlight();
timers = [];
context.__test.nextInning();
if (context.__test.s.half !== 1) throw new Error('Failed to enter visitor half');
runTimer(900);
elements.pitchType.value = 'CURVA';
handlers['pitchType:change']();
if (elements.pitchControls.style.display !== 'flex') throw new Error('Pitch selection should appear for local defense');
if (elements.swing.textContent !== '⚾ LANZAR') throw new Error('Action button should be LANZAR');
handlers['swing:click']();
if (context.__test.s.pitch.name !== 'CURVA' || context.__test.s.pitch.mph !== 73) throw new Error('Selected curve was not used');
if (!elements.swing.disabled) throw new Error('Launch button should lock during the pitch flight');
runFlight();
if (elements.callout.textContent !== '¡BOLA EN JUEGO!') throw new Error(`AI should create a fielding play: ${elements.callout.textContent}`);
if (elements.fieldTargetMarker.style.display !== 'block' || elements.fieldClock.style.display !== 'block') throw new Error('Fielding target and clock should appear for a live ball');
if (!elements.fieldTargetMarker.style.left || !elements.fieldTargetMarker.style.top) throw new Error('Fielding target should show its destination');
now = context.__test.s.fieldStart + context.__test.s.fieldDuration * .8;
handlers['field:pointerdown']({pointerType:'touch',pointerId:1,clientX:350,clientY:228});
if (!context.__test.s.fielding) throw new Error('Touch pointer-down should let the player aim first');
handlers['field:pointermove']({pointerType:'touch',pointerId:1,clientX:context.__test.s.fieldTarget.x*700+28,clientY:context.__test.s.fieldTarget.y*400+56});
handlers['field:pointerup']({pointerType:'touch',pointerId:1});
if (elements.callout.textContent !== '¡ATRAPADA!') throw new Error(`Fielding catch failed: ${elements.callout.textContent}`);
if (elements.fieldTargetMarker.style.display !== 'none' || elements.fieldClock.style.display !== 'none') throw new Error('Fielding overlays should clear after the play');
if (elements.swing.disabled) throw new Error('Fielding action should be enabled for a catch opportunity');
context.__test.s.outs = 0; context.__test.s.bases = [false, false, false];
context.__test.startFielding(1); context.__test.s.mouse = {x: .5, y: .57};
now = context.__test.s.fieldStart + context.__test.s.fieldDuration * .8;
context.__test.fieldNow();
if (elements.callout.textContent !== 'SENCILLO VISITANTE' || !context.__test.s.bases[0]) throw new Error('Missed fielding play should produce a single');
context.__test.s.bases = [false, false, false];
context.__test.startFielding(2); context.__test.s.mouse = {x: .5, y: .57};
now = context.__test.s.fieldStart + context.__test.s.fieldDuration * .8; context.__test.fieldNow();
if (elements.callout.textContent !== 'DOBLE VISITANTE') throw new Error('Missed fielding play should report a double');
context.__test.s.bases = [false, false, false];
context.__test.startFielding(4); context.__test.s.mouse = {x: .5, y: .57};
now = context.__test.s.fieldStart + context.__test.s.fieldDuration * .8; context.__test.fieldNow();
if (elements.callout.textContent !== 'JONRÓN VISITANTE') throw new Error('Missed fielding play should report a home run');
context.__test.s.bases = [true, true, true];
const awayBefore = context.__test.s.awayScore;
context.__test.advanceRunners(4);
if (context.__test.s.awayScore !== awayBefore + 4) throw new Error('Visitor home run credited to the wrong score');
timers=[]; context.__test.s.outs=1;
if (context.__test.recordOut('Out dos')!==false || timers.length!==0) throw new Error('Non-final out should not schedule an inning transition');
context.__test.s.outs=2;
if (context.__test.recordOut('Out tres')!==true || timers.length!==1 || timers[0].ms!==700) throw new Error('Third out should schedule exactly one inning transition');
context.__test.s.half = 0; context.__test.s.bases = [true, true, true];
context.__test.s.fielding=true; context.__test.s.mouse={x:.5,y:.57};
for(let i=0;i<20;i++)handlers['window:keydown']({code:'',key:'ArrowUp',preventDefault(){}});
if(context.__test.s.mouse.y>.20)throw new Error('Keyboard aiming should reach the upper fielding area');
context.__test.s.fielding=false;
const homeBefore = context.__test.s.score;
context.__test.advanceRunners(4);
if (context.__test.s.score !== homeBefore + 4) throw new Error('Home run credited to the wrong score');
console.log('Visitor AI turn and side-specific scoring pass');
