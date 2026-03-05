const CACHE_NAME = 'Hebi-V2';
const urlsToCache = [
  '/'
  './Hebi/',
  './Hebi/index.html',
  './Hebi/css/style.css',
  './Hebi/js/game.js',
  './Hebi/js/math.js',
  './Hebi/js/vector.js',
  './Hebi/js/preloader.js',
  './Hebi/res/icon-128.png',
  './Hebi/res/icon-512.png',
  './Hebi/res/pfp.jpg',
  './Hebi/res/ps2p.ttf',
  './Hebi/res/robotoCondensed.ttf'
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
