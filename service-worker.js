/**
 * Service Worker para News Entertainment Francia (PWA)
 * Implementa caché de archivos estáticos y estrategia de red
 * para permitir funcionamiento offline básico.
 * 
 * @author Sergio Armero Salazar
 */

// Nombre del caché y versión para facilitar actualizaciones (v3 fuerza la recarga de estilos)
const CACHE_NAME = "news-francia-v3";

// Lista de archivos estáticos que se almacenarán en caché
const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./Styles.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

/**
 * Evento 'install': Se ejecuta cuando el Service Worker se instala.
 * Almacena en caché todos los archivos estáticos necesarios para
 * que la aplicación funcione sin conexión.
 */
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service Worker] Cacheando archivos estáticos");
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Activar inmediatamente sin esperar a que se cierre la pestaña
    self.skipWaiting();
});

/**
 * Evento 'activate': Se ejecuta cuando el Service Worker se activa.
 * Limpia cachés antiguos si se ha actualizado la versión.
 */
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activado");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log("[Service Worker] Eliminando caché antiguo:", name);
                        return caches.delete(name);
                    })
            );
        })
    );
    // Tomar control de todas las pestañas abiertas
    self.clients.claim();
});

/**
 * Evento 'fetch': Intercepta las peticiones de red.
 * - Para archivos estáticos: Cache-first (primero busca en caché).
 * - Para peticiones a la API: Network-first (intenta la red, si falla usa caché).
 */
self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);

    // Estrategia para peticiones a la API: Network-first
    if (requestUrl.hostname === "api.thenewsapi.com") {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Guardar una copia de la respuesta en caché
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Si no hay red, intentar devolver la versión cacheada
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Si no hay caché de la API, devolver un JSON de error
                        return new Response(
                            JSON.stringify({
                                data: [],
                                error: "Sin conexión. Mostrando datos almacenados si están disponibles."
                            }),
                            {
                                headers: { "Content-Type": "application/json" }
                            }
                        );
                    });
                })
        );
        return;
    }

    // Estrategia para archivos estáticos: Cache-first
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((response) => {
                // Cachear nuevos recursos encontrados
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            });
        })
    );
});
