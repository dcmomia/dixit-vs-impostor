const CACHE_NAME = 'dixit-impostor-v39';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './data/words.json',
    './manifest.json',
    './assets/IMG/UI/menu/logo_dixit.png'
];

// Instalar y Precargar
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Cache First Strategy
self.addEventListener('fetch', event => {
    // Solo manejamos peticiones GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // Devolvemos de cache primero
            }
            
            // Si no estÃƒÂ¡ en cachÃƒÂ©, lo pedimos a la red
            return fetch(event.request).then(networkResponse => {
                // Solo guardamos si vale la pena (no es opaco, no hay error)
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                
                // Clonamos porque se consume al guardar o leer
                let responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                      cache.put(event.request, responseToCache);
                  });
                return networkResponse;
            }).catch(() => {
                // Fallback de offline
                return caches.match('./index.html');
            });
        })
    );
});

// Limpiar caches antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});


