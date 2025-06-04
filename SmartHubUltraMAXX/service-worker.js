self.addEventListener('install', function(e) {
    console.log('Installed Ultra MAXX Service Worker');
});
self.addEventListener('fetch', function(e) {
    e.respondWith(fetch(e.request));
});
