const CACHE = "hebi-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {

  // only cache same-origin files
  if (!e.request.url.startsWith(self.location.origin)) return;

  // HTML → always try network first
  if (e.request.headers.get("accept").includes("text/html")) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // CSS / JS / images → stale while revalidate
  e.respondWith(
    caches.match(e.request).then(cacheRes => {

      const fetchPromise = fetch(e.request).then(networkRes => {
        caches.open(CACHE).then(cache => {
          cache.put(e.request, networkRes.clone());
        });
        return networkRes;
      });

      return cacheRes || fetchPromise;
    })
  );

});