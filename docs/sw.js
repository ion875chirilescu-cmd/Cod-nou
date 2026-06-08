/* Service Worker — Select Academy CRM (PWA)
   Strategie: network-first pentru pagină (mereu ultima versiune când e net),
   cu rezervă din cache când ești offline. */
const CACHE = 'select-crm-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Navigare (deschiderea aplicației): network-first → cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        caches.open(CACHE).then(c => c.put('./index.html', res.clone())).catch(()=>{});
        return res;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Resurse proprii (iconițe, manifest): cache-first cu actualizare în fundal
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req).then(res => {
          caches.open(CACHE).then(c => c.put(req, res.clone())).catch(()=>{});
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    );
  }
});
