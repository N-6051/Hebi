const CACHE_NAME = 'Hebi-V2';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/game.js',
  './js/math.js',
  './js/vector.js',
  './js/preloader.js',
  './res/icon-128.png',
  './res/icon-512.png',
  './res/pfp.jpg',
  './res/ps2p.ttf',
  './res/robotoCondensed.ttf'
];


// Install: cache essential files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
