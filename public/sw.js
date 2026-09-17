const CACHE_NAME = "portfolio-runtime-v3";
const APP_SHELL = ["/", "/index.html"];
const MEDIA_MATCH = /\/assets\/.+\.(gif|webp|png|jpe?g|mp4|webm|mov)(\?.*)?$/i;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isAppShell = url.origin === self.location.origin && (
    url.pathname === "/" || url.pathname === "/index.html"
  );
  const isAppAsset = url.origin === self.location.origin && (
    MEDIA_MATCH.test(url.pathname) ||
    url.pathname.startsWith("/assets/") ||
    url.pathname === "/" ||
    url.pathname === "/index.html"
  );
  const isGitHubApi = url.origin === "https://api.github.com" && url.pathname.startsWith("/search/issues");
  if (!isAppAsset && !isGitHubApi) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      // Check for new HTML so a cached shell cannot pin an old JS bundle.
      // Hashed assets and media can continue using the cache first.
      if (cached && isAppAsset && !isAppShell) return cached;

      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }),
  );
});
