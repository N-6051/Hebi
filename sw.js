const CACHE_NAME = 'Hebi-V1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/game.js',
  '/js/math.js',
  '/js/vector.js',
  '/js/preloader.js',
  '/res/icon-128.png',
  '/res/icon-512.png',
  '/res/pfp.jpg',
  '/res/ps2p.ttf',
  '/manifest.json'
];

// 1. Install Phase: Populate the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become active
});

// 2. Activate Phase: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Phase: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update the cache with the new version from the network
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Return the cached response if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
    
