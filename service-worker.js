const CACHE_NAME = "break-tracker-v8";

// Files to cache (adjust based on your setup)
const FILES_TO_CACHE = [
  "/",                   // root
  "/index.html",         // main UI
  "/style.css",          // styles
  "/script.js",          // app logic
  "/logWorker.js",      // log worker
  "/timerWorker.js",     // web worker
  "/alarm.wav",          // alarm sound
  "/break.png",          // break button icon
  "/lunch.png",          // lunch button icon
  "/bio.png",            // bio button icon
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/site.webmanifest"
];

// Install event → cache core files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker caching files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});

// Activate event → cleanup old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker activating and claiming clients...");
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("Service Worker removing old cache:", key);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => {
            // Claim all clients immediately so the new Service Worker can control them
            return self.clients.claim();
        })
    );
});

// Fetch event → serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  // Only handle requests for the current origin to avoid issues with external assets
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});