const CACHE = "hebi-cache";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {

  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then(cacheRes => {

      const fetchPromise = fetch(e.request).then(networkRes => {

        if (
          networkRes &&
          networkRes.status === 200 &&
          networkRes.type === "basic"
        ) {
          const clone = networkRes.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }

        return networkRes;

      }).catch(() => cacheRes);

      return cacheRes || fetchPromise;

    })
  );

});
