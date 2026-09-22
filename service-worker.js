const CACHE='kasam-net-v6';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./service-worker.js','./app-enhancements-v6.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function htmlWithEnhancement(request){
  const response=await fetch(request);
  if(!response.ok)return response;
  const html=await response.text();
  const injected=html.includes('app-enhancements-v6.js')?html:html.replace('</body>','<script src="./app-enhancements-v6.js?v=6"></script></body>');
  return new Response(injected,{status:response.status,statusText:response.statusText,headers:response.headers});
}
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin===self.location.origin&&(url.pathname.endsWith('/')||url.pathname.endsWith('/index.html'))){
    e.respondWith(htmlWithEnhancement(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&url.origin===self.location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
