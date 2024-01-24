const cacheName = 'portfolio-v1';
const staticAssets = [
    '/',
    '/index.css',
    '/index.js',
    '/favicon.ico',
];

self.addEventListener('install', async (e: Event) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('fetch', (e: FetchEvent) => {
    e.respondWith(cacheFirst(e.request));
});

async function cacheFirst(request: RequestInfo | URL) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}
