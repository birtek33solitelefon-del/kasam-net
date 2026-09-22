const CACHE_NAME = 'kasam-net-v4';
const SHELL = ['./','./index.html','./manifest.webmanifest','./service-worker.js','./icon.svg','./edit-cancel-repair.js'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

async function freshHtml(request) {
  const response = await fetch(request);
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  if (html.includes('edit-cancel-repair.js')) return new Response(html, { headers: response.headers });
  const injected = html.replace('</body>', '<script src="./edit-cancel-repair.js?v=4"></script></body>');
  return new Response(injected, { status: response.status, statusText: response.statusText, headers: response.headers });
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'))) {
    event.respondWith(freshHtml(event.request).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && url.origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
});
