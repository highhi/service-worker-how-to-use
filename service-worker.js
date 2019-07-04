'use strict';

const CACHE_KEY_NAME = 'cache-assets-v-1'
const assets = [
  '/stylesheets/normalize.css',
  '/stylesheets/style.css',
  '/'
]

self.addEventListener('install', event => {
  console.log('install')
  // const saving = caches.open(CACHE_KEY_NAME).then(cache => {
  //   return cache.addAll(assets);
  // })

  // event.waitUntil(saving)
  // event.waitUntil(self.skipWaiting())
  event.waitUntil(Promise.resolve())
})

self.addEventListener('activate', event => {
  console.log('activate')
  const deleting = caches.keys()
    .then(keys => keys.filter(key => key !== CACHE_KEY_NAME))
    .then(keys => Promise.all(keys.map(key => caches.delete(key))))

  // event.waitUntil(deleting.then(() => self.clients.claim()))
  event.waitUntil(deleting)
})

self.addEventListener('fetch', event => {
  const pathname = new URL(event.request.url).pathname

  if (!assets.some(asset => pathname === asset)) {
    return
  }

  const fetching = caches.match(event.request).then(response => {
    if (response) {
      return response
    }

    const requestClone = event.request.clone()

    return fetch(requestClone).then(response => {
      if (response.ok) {
        const responseClone = response.clone()
        caches.open(CACHE_KEY_NAME).then(cache => {
          cache.put(requestClone, responseClone)
        })
      }

      return response
    })
  })

  event.respondWith(fetching)
})
