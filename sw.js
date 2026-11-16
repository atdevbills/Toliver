const CACHE_NAME = 'toliver-v2';
const urlsToCache = [
  '/Toliver/',
  '/Toliver/index.html',
  '/Toliver/manifest.json',
  '/Toliver/icon-192.png',
  '/Toliver/icon-512.png'
];

// Install: cache files one by one so a single missing file doesn't break everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        urlsToCache.map(url => cache.add(url).catch(() => console.log('Skipped:', url)))
      )
    )
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: try the network first (so updates show), fall back to cache when offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match('/Toliver/index.html')))
  );
});
