// Name of cache
const CACHE_NAME = "break-tracker-v1";

// Files to cache (adjust based on your setup)
const FILES_TO_CACHE = [
  "/",                   // root
  "/index.html",         // main UI
  "/style.css",          // styles
  "/script.js",          // app logic
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  console.log("Service Worker installed & files cached.");
});

// Activate event → cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  console.log("Service Worker activated.");
});

// Fetch event → serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});