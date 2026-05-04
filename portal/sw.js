// Service Worker for Mekong AgencyOS PWA

const CACHE_NAME = 'mekong-agencyos-v1';
const STATIC_CACHE_NAME = 'static-v1';
const API_CACHE_NAME = 'api-v1';

// Files to cache statically
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/offline.html'
];

// API endpoints that should be cached
const API_ENDPOINTS = [
  '/api/merchants',
  '/api/products',
  '/api/orders',
  '/api/notifications',
  '/province/stats'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');

  // Pre-cache static assets
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_FILES);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');

  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== API_CACHE_NAME &&
            cacheName !== CACHE_NAME
          ) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).catch(() => {
          // If network request fails, serve offline page
          return caches.match('/offline.html');
        });
      })
    );
  }
  // Handle API requests with network-first strategy
  else if (url.pathname.includes('/api/') ||
           url.pathname.includes('/province/') ||
           url.pathname.includes('/notifications/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(request).then((networkResponse) => {
          // Update cache with fresh response
          cache.put(request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Try to get from cache if network fails
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If no cache, return an appropriate fallback
            return new Response(JSON.stringify({ error: 'Offline: No cached data available' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        });
      })
    );
  }
  // Handle asset requests (CSS, JS, images) with cache-first strategy
  else if (request.destination === 'style' ||
           request.destination === 'script' ||
           request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((networkResponse) => {
          // Cache the new response for future requests
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
  // For all other requests, use network-first with fallback
  else {
    event.respondWith(
      fetch(request).then((response) => {
        // If response is valid, clone it and put in cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('Network Error', { status: 503 });
        });
      })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();

  const options = {
    body: payload.body || 'New notification',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    tag: payload.tag || 'default-tag',
    data: {
      url: payload.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Mekong AgencyOS', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Handle background sync (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data when connection is restored
async function syncData() {
  // Implementation for syncing data when back online
  console.log('Syncing data in background...');

  // This is where you would implement logic to sync any pending data
  // like unsent orders, updates, etc.
}