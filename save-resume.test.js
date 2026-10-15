const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/showView\('lobbyView'\)\}\)\(\);\s*$/, 'showView(\'lobbyView\');globalThis.__test={s,save,endGame,advanceWalk};})();');
function boot(stored = null) {
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  const elements = {};
  for (const id of ids) elements[id] = {
    style: {}, classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {}, querySelectorAll() { return []; }, dataset: {}, onclick: null,
    getBoundingClientRect() { return { left: 0, top: 0, width: 700, height: 400 }; },
    setPointerCapture() {}, textContent: '', innerHTML: '', disabled: false,
  };
  const data = { value: stored };
  const context = {
    document: { getElementById: id => elements[id], querySelectorAll: () => [] }, window: { addEventListener() {} },
    localStorage: { getItem() { return data.value; }, setItem(k, v) { data.value = v; } },
    Math, console, performance: { now: () => 1000 }, clearTimeout() {}, setTimeout() { return 1; },
    requestAnimationFrame() {},
  };
  vm.runInNewContext(script, context);
  return { context, elements, data };
}
const first = boot();
Object.assign(first.context.__test.s, {
  gameActive: true, inning: 2, half: 1, outs: 1, balls: 2, strikes: 1, score: 3, awayScore: 2,
  bases: [true, false, true], coins: 315, matchHits: 4, matchWalk: false, awayHits: 2,
  homeInnings: [1, 2, 0], awayInnings: [0, 2, 0],
});
first.context.__test.save();
if (JSON.parse(first.data.value).version !== 3) throw new Error('Save schema version should reflect the added match objective');
const second = boot(first.data.value);
const s = second.context.__test.s;
if (second.elements.primaryGameBtn.textContent !== 'Continuar partido') throw new Error('Saved match should be resumable from the lobby');
for (const [key, expected] of Object.entries({ gameActive: true, inning: 2, half: 1, outs: 1, balls: 2, strikes: 1, score: 3, awayScore: 2, coins: 315, matchHits: 4, awayHits: 2, matchWalk: false })) {
  if (s[key] !== expected) throw new Error(`${key} did not restore: ${s[key]}`);
}
if (JSON.stringify(s.bases) !== JSON.stringify([true, false, true])) throw new Error('Base state did not restore');
if (second.elements.homeLabel.textContent !== 'LOCAL' || second.elements.awayLabel.textContent !== 'VISITA') throw new Error('Score labels must remain attached to their teams');
if (second.elements.halfLabel.textContent !== 'Turno visitante · Defiendes') throw new Error('Active turn label should reflect the resumed half');
if ((second.elements.ballLights.innerHTML.match(/count-dot/g)||[]).length !== 4 || (second.elements.strikeLights.innerHTML.match(/count-dot/g)||[]).length !== 3 || (second.elements.outLights.innerHTML.match(/count-dot/g)||[]).length !== 3) throw new Error('Visual count indicators were not rendered');
if (!second.elements.ballLights.innerHTML.includes('on') || !second.elements.strikeLights.innerHTML.includes('on')) throw new Error('Saved balls and strikes should appear in the count lights');
const localState = JSON.parse(first.data.value);
localState.match.half = 0;
second.data.value = JSON.stringify(localState);
const localTurn = boot(second.data.value);
if (localTurn.elements.halfLabel.textContent !== 'Turno local · Bateas tú') throw new Error('Local batting turn label is incorrect');
localTurn.context.__test.s.bases=[true,true,true]; const localBeforeWalk=localTurn.context.__test.s.score; localTurn.context.__test.advanceWalk();
if (!localTurn.context.__test.s.matchWalk || localTurn.context.__test.s.score!==localBeforeWalk+1) throw new Error('Local walk should complete the mission and score only when forced');
s.bases = [true, true, true];
const awayBeforeWalk = s.awayScore;
second.context.__test.advanceWalk();
if (s.matchWalk || s.walk) throw new Error('Visitor walk must not complete the local team mission');
if (s.awayScore !== awayBeforeWalk + 1 || JSON.stringify(s.bases) !== JSON.stringify([true, true, true])) throw new Error('Walk should force runners without advancing unforced runners');
s.score = 3; s.awayScore = 2; s.homeInnings = [1, 2, 0]; s.awayInnings = [0, 2, 0]; s.matchHits = 3; s.matchWalk = true; s.coins = 315;
second.context.__test.endGame();
if (!second.elements.modalScore.innerHTML.includes('<b>3</b>')) throw new Error('Final inning scorecard missing');
if (!second.elements.modalTitle.textContent.includes('Victoria')) throw new Error('Winner summary missing');
const coins = s.coins;
second.context.__test.endGame();
if (coins !== 430) throw new Error(`Base and objective rewards should total 115 coins, got ${coins - 315}`);
if (s.coins !== coins) throw new Error('Final reward was paid twice');
second.elements.modalBtn.onclick();
if (!s.gameActive || s.matchHits !== 0 || s.matchWalk || !s.pitch || s.pitch.name==='OBSOLETO') throw new Error('Rematch should reset match objectives and start a fresh pitch');

const corrupted = boot(JSON.stringify({version:2,profile:{coins:'mal dato',hits:-7,walk:'true',selectedBatter:'<script>',stadium:'unknown',roster:[{id:'alex',name:'<img src=x>',role:'x',level:999,contact:-50,power:999}]},match:{inning:99,half:4,outs:20,balls:40,strikes:-3,score:-10,awayScore:'bad',bases:['false',true],matchHits:-1,awayHits:2,homeInnings:[1],awayInnings:'bad'}}));
const safe = corrupted.context.__test.s;
if(safe.coins!==250||safe.hits!==0||safe.walk||safe.selectedBatter!=='alex'||safe.stadium!=='classic') throw new Error('Invalid profile save should fall back to safe defaults');
const safeAlex=safe.roster.find(p=>p.id==='alex');
if(safeAlex.name!=='Alex Rivera'||safeAlex.level!==10||safeAlex.contact!==0||safeAlex.power!==100||safe.roster.length!==3) throw new Error('Saved roster should be constrained to valid players and stat ranges');
if(safe.inning!==3||safe.half!==0||safe.outs!==3||safe.balls!==3||safe.strikes!==0||safe.score!==0||JSON.stringify(safe.bases)!==JSON.stringify([false,false,false])||safe.matchHits!==0||safe.homeInnings.length!==3) throw new Error('Malformed match save should be sanitized before resume');
console.log('Match resume, scorecard, winner, rewards, rematch and save recovery pass');
