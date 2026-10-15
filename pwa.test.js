const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
const worker = fs.readFileSync('sw.js', 'utf8');
if (manifest.display !== 'standalone' || manifest.start_url !== './index.html') throw new Error('Manifest should launch as an installed app');
for (const [size, file] of [[192, 'icon-192.png'], [512, 'icon-512.png']]) {
  const icon = fs.readFileSync(file);
  if (icon.readUInt32BE(16) !== size || icon.readUInt32BE(20) !== size) throw new Error(`${file} dimensions are incorrect`);
  if (!manifest.icons.some(i => i.src === `./${file}` && i.sizes === `${size}x${size}`)) throw new Error(`${file} is missing from the manifest`);
}
for (const file of ['index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png']) {
  if (!fs.existsSync(file)) throw new Error(`App-shell asset missing: ${file}`);
}
if (!html.includes('rel="manifest"') || !html.includes("navigator.serviceWorker.register('./sw.js')") || !html.includes('id="installButton"')) throw new Error('HTML is missing PWA registration or install UI');
if (!html.includes('ZONA DE STRIKE') || !html.includes('pitch-in-zone') || !html.includes('pitch-outside') || !html.includes('touch?28:0') || !html.includes('touch?56:0')) throw new Error('Clear strike-zone, pitch-direction and touch-aim cues are missing');

const handlers = {};
const entries = new Map();
const cacheName = 'diamond-club-v2.0';
let skipWaiting = false, clientsClaimed = false, oldCacheDeleted = false;
const cache = {
  async addAll(paths) { for (const path of paths) entries.set(new URL(path, 'https://app.test/').href, new Response(`cached ${path}`)); },
  async match(request) { return entries.get(typeof request === 'string' ? request : request.url); },
  async put(request, response) { entries.set(typeof request === 'string' ? request : request.url, response); },
};
const cachesMock = {
  async open(name) { if (name !== cacheName) throw new Error('Unexpected cache name'); return cache; },
  async match(request) { return cache.match(request); },
  async keys() { return [cacheName, 'diamond-club-old']; },
  async delete(name) { if (name === 'diamond-club-old') oldCacheDeleted = true; return true; },
};
const selfMock = {
  location: { origin: 'https://app.test' },
  registration: { scope: 'https://app.test/' },
  clients: { async claim() { clientsClaimed = true; } },
  async skipWaiting() { skipWaiting = true; },
  addEventListener(name, fn) { handlers[name] = fn; },
};
vm.runInNewContext(worker, { self: selfMock, caches: cachesMock, URL, Response, Promise, fetch: async () => { throw new Error('offline'); } });
(async () => {
  let pending;
  handlers.install({ waitUntil(p) { pending = p; } }); await pending;
  if (!skipWaiting || entries.size !== 6) throw new Error('Install should cache the complete app shell');
  handlers.activate({ waitUntil(p) { pending = p; } }); await pending;
  if (!clientsClaimed || !oldCacheDeleted) throw new Error('Activation should claim clients and remove stale caches');
  let response;
  handlers.fetch({ request: { method: 'GET', mode: 'navigate', url: 'https://app.test/index.html' }, respondWith(p) { response = p; } });
  const offlinePage = await response;
  if (!(await offlinePage.text()).includes('cached ./index.html')) throw new Error('Offline navigation should fall back to the cached app');
  handlers.fetch({ request: { method: 'GET', mode: 'cors', url: 'https://app.test/icon.svg' }, respondWith(p) { response = p; } });
  if (!(await response)) throw new Error('Cached app assets should remain available offline');
  console.log('PWA manifest, icon sizes, app-shell cache, offline navigation and cache cleanup pass');
})().catch(error => { console.error(error); process.exitCode = 1; });
