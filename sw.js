const CACHE_NAME = 'grindset-v3'
const STATIC_ASSETS = ['/', '/index.html']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase') || e.request.url.includes('/api/')) return
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)))
})

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data?.json() || {}
  const title = data.title || 'Grindset'
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: '/' }
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

// Click on notification opens app
self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'))
})
