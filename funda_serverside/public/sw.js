self.addEventListener('install', function(event){ //While installing serverworker
  event.waitUntil(
    caches.open('funda-v1-core')//Create a cache under this id
    .then(function(cache){//If that is a succes, cache
      return cache.addAll([//Add all these files to the cache
        '/offline/offline.html',
        '/js/autocomplete.js',
        '/js/bundle.js',
        '/js/favorite.js',
        '/js/showhidedescr.js',
        '/style/style.css',
        '/img/fundawonen-logo.svg'
      ])
    }).then(self.skipWaiting()));//Then skip waiting
});

self.addEventListener('fetch', function(event){//On fetching data
  var request = event.request;//save the page request in var
  if(request.mode === 'navigate'){//if its the same as 'navigate'
    event.respondWith(
      fetch(request)//use the request
      .then(function(response){
        return cachePage(request, response);
      })
      .catch(function(err){//If that didnt work
        return getCachedRequest(request);
      })
      .catch(function(err){
        return fetchCoreFile('/offline/offline.html');//If its not catched, give this page
      })
    )
  } else {//If it doesnt match navigate*/
    event.respondWith(
      fetch(request)//use the request
      .catch(function(err){
        return fetchCoreFile(request.url);
      })
      .catch(function(err){
        return fetchCoreFile('/offline/offline.html');//No match on url, give this page
      })
    );
  }
});

function fetchCoreFile(url) {
    return caches.open('funda-v1-core')
        .then(function(cache){
          return cache.match(url); //get the matching url
        })
        .then(function(response){
          return response ? response : Promise.reject();//No response reject, otherwise give page
        });
}

function getCachedPage(request) {
    return caches.open('funda-v1-pages')//Look into the cache
        .then(function(cache){
          return cache.match(request);//get the request that matches
        })
        .then(function(response){
          return response ? response : Promise.reject();//Is there a match? send match. no match? reject promise
        });
}

function cachePage(request, response) {
    var clonedResponse = response.clone();//clone the response
    caches.open('funda-v1-pages')//Open cache
        .then(function(cache){
          return cache.put(request, clonedResponse); //put the response of the request into the cache
        });
    return response;
}

//Credits to Timo Verkroost and Jasper Moelker
