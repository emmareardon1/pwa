var staticCacheName = 'static';
var version = 'v1::';

function updateStaticCache() {
  return caches.open(version + staticCacheName)
    .then(function (cache) {
      cache.addAll([
       '/images/strawberry.jpg'
      ]);
      return cache.addAll([
        '/interactions.js',
        '/styles.css',
        '/',
        '/offline.html'
      ]);
    });
};

self.addEventListener('install', function (event) {
  event.waitUntil(updateStaticCache());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (key) {
            return key.indexOf(version) !== 0;
          })
          .map(function (key) {
            return caches.delete(key);
          })
        );
      })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  
  if (request.method !== 'GET') {
	event.respondWith(
	    fetch(request)
	      .catch(function () {
		      return caches.match(request)
		        .then(function (response) {
		          return response || caches.match('/offline.html');
		        })
		    })
	);
	return;
  }
});