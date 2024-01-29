const cacheName = 'portfolio-v1';
const staticAssets = [
    '/',
    '/index.css',
    '/index.js',
    '/favicon.ico',
];

self.addEventListener('install', async (e) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('fetch', (e) => {
    e.respondWith(networkFirst(e.request));
});

async function networkFirst(request) {
    try {
        // Try to get the response from the network
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        // If the network request fails, try to get the response from the cache
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Not found', { status: 404 });
    }
}