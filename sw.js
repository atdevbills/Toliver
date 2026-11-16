const CACHE_NAME = 'dontoliver-v1';
const urlsToCache = [
  '/Toliver/',
  '/Toliver/index.html',
  '/Toliver/icon-192.png',
  '/Toliver/icon-512.png'
];

// Install the service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
