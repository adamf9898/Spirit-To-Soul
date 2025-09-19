// Service Worker for Spirit To Soul PWA
const CACHE_NAME = 'spirit-to-soul-v1.0.0';
const STATIC_CACHE = 'spirit-static-v1.0.0';
const DYNAMIC_CACHE = 'spirit-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/scripture.js',
  '/js/character.js',
  '/js/game-world.js',
  '/js/ui.js',
  '/js/multiplayer.js',
  '/js/main.js',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (not same origin)
  if (url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            // Add to dynamic cache
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('Service Worker: Caching new resource', request.url);
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return a generic offline response for other requests
            return new Response('Offline - Spirit To Soul requires an internet connection for some features.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
  
  if (event.tag === 'sync-fellowship-messages') {
    event.waitUntil(syncFellowshipMessages());
  }
});

// Push notifications for fellowship events
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body || 'New activity in your fellowship!',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 'default'
    },
    actions: [
      {
        action: 'open-game',
        title: 'Open Game',
        icon: '/assets/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icon-96x96.png'
      }
    ],
    tag: 'spirit-to-soul-notification',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Spirit To Soul', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'open-game') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the game
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'CACHE_SCRIPTURE':
        cacheScriptureData(event.data.scripture);
        break;
      case 'SYNC_GAME_DATA':
        syncGameDataInBackground();
        break;
    }
  }
});

// Helper functions
async function syncGameData() {
  try {
    console.log('Service Worker: Syncing game data...');
    
    // Get pending sync data from IndexedDB or localStorage
    const gameData = await getStoredGameData();
    
    if (gameData) {
      // Send to server (in a real implementation)
      console.log('Service Worker: Game data synced successfully');
    }
  } catch (error) {
    console.error('Service Worker: Game data sync failed', error);
    throw error;
  }
}

async function syncFellowshipMessages() {
  try {
    console.log('Service Worker: Syncing fellowship messages...');
    
    // Get pending messages from storage
    const messages = await getStoredMessages();
    
    if (messages && messages.length > 0) {
      // Send to server (in a real implementation)
      console.log('Service Worker: Fellowship messages synced successfully');
    }
  } catch (error) {
    console.error('Service Worker: Fellowship message sync failed', error);
    throw error;
  }
}

async function getStoredGameData() {
  // In a real implementation, this would use IndexedDB
  return new Promise((resolve) => {
    // Simulate getting data from IndexedDB
    setTimeout(() => {
      resolve(null); // No pending data for now
    }, 100);
  });
}

async function getStoredMessages() {
  // In a real implementation, this would use IndexedDB
  return new Promise((resolve) => {
    // Simulate getting messages from IndexedDB
    setTimeout(() => {
      resolve([]); // No pending messages for now
    }, 100);
  });
}

function cacheScriptureData(scripture) {
  caches.open(DYNAMIC_CACHE)
    .then((cache) => {
      // Cache scripture content for offline access
      const scriptureResponse = new Response(JSON.stringify(scripture), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      cache.put(`/scripture/${scripture.reference}`, scriptureResponse);
      console.log('Service Worker: Scripture cached for offline access', scripture.reference);
    });
}

function syncGameDataInBackground() {
  // Register a background sync
  self.registration.sync.register('sync-game-data')
    .then(() => {
      console.log('Service Worker: Background sync registered');
    })
    .catch((error) => {
      console.error('Service Worker: Background sync registration failed', error);
    });
}

// Periodic background tasks (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-scripture-update') {
    event.waitUntil(updateDailyScripture());
  }
});

async function updateDailyScripture() {
  try {
    console.log('Service Worker: Updating daily scripture...');
    
    // In a real implementation, this would fetch new daily scripture
    // and cache it for offline access
    
    // Show notification about new daily verse
    self.registration.showNotification('New Daily Verse Available', {
      body: 'A new verse is ready for your daily meditation',
      icon: '/assets/icon-192x192.png',
      tag: 'daily-scripture'
    });
  } catch (error) {
    console.error('Service Worker: Daily scripture update failed', error);
  }
}

// Handle app shortcuts from manifest
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/' && url.searchParams.has('action')) {
    const action = url.searchParams.get('action');
    
    event.respondWith(
      caches.match('/index.html')
        .then((response) => {
          if (response) {
            // Modify response to include action parameter
            return response.text().then((html) => {
              const modifiedHtml = html.replace(
                '<body>',
                `<body data-shortcut-action="${action}">`
              );
              
              return new Response(modifiedHtml, {
                headers: response.headers
              });
            });
          }
          
          return fetch(event.request);
        })
    );
  }
});

console.log('Service Worker: Script loaded successfully');