// Service Worker — Academia de Jerónimo
const CACHE = 'academia-jeronimo-v2';
const ARCHIVOS = [
  './', './index.html',
  './css/estilos.css',
  './js/datos.js', './js/mascota.js', './js/lecciones.js', './js/minijuegos.js', './js/voz.js', './js/app.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(r => {
      // Cachear imágenes nuevas (PNG) sobre la marcha
      if (e.request.url.includes('/img/') && r.ok) {
        const clon = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clon));
      }
      return r;
    }).catch(()=>caches.match('./index.html')))
  );
});
