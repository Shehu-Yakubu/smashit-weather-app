if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            // Registration successful
            console.log('Service worker registration successful with scope: ', registration.scope);
        }, function( err) {
            // Registration failed :(
            console.log('Service worker registration failed: ', err);
        });
    });
} else {
    console.log('Service worker is not supported.');
}

var CACHE_NAME = 'smashit-cache-v1';
var urlsToCache = [
    '/',
    '/css/style.css',
    '/js/main.js'
];

self.addEventListener("install", function(event) {
    // Perform install steps
    event.waitUntil(
       caches.open(CACHE_NAME)
       .then(function(cache) {
           console.log('Opened cache');
           return cache.addAll(urlsToCache);
       })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
       caches.match(event.request)
       .then(function(response) {
           // Cache hit - return response
           if (response) {
               return response;
           }

           return fetch(event.request).then(
               function(response) {
                   // Check if we received a valid response
                   if (!response || response.status !== 200 || response.type !== 'basic') {
                       return response;
                   }

                   var responseToCache = response.clone();

                   caches.open(CACHE_NAME)
                   .then(function(cache) {
                       cache.put(event.request, responseToCache);
                   });

                   return response;
               }
           );
       })
   );
});

self.addEventListener("activate", function(event) {
    var cacheAllowlist = ['pages-cache-v1', ''];

    event.waitUntil(
        caches.keys()
        .then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});