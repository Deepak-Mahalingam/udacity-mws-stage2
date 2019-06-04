var cacheName = 'sw_v1';
var cacheFiles = [
  '/',
  'index.html',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg',
  'js/dbhelper.js',
  'js/main.js',
  'data/restaurants.json'
]

self.addEventListener('install', event => {
  caches.open(cacheName)
    .then(function (cache) {
      console.log(cacheFiles);
      return cache.addAll(cacheFiles);
    })
    .catch((e)=>console.log(e));
  console.log('Installing service worker')
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      //console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then(function (response) {
        return caches.open(cacheName).then(function (cache) {
          //console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        }).catch((e)=>console.log(e));
      }).catch((e)=>console.log(e));
    }).catch((e)=>console.log(e))
  );
});


self.addEventListener('activate', event => {
  console.log('Activating the service worker');
});
