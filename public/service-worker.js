function receivePushNotification(event) {
  console.log("[Service Worker] Push Received from public file.");
  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: "https://dciv99su0d7r5.cloudfront.net/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: tag,
    badge: "https://dciv99su0d7r5.cloudfront.net/favicon.ico",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://dciv99su0d7r5.cloudfront.net/icon-192x192.png",
      },
    ],
  };
  const notificationPromise = self.registration.showNotification(
    title,
    options
  );

  event.waitUntil(notificationPromise);
}

function openPushNotification(event) {
  console.log(
    "[Service Worker] Notification click Received public.",
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);

const staticCacheName = "site-static-v3";
const dynamicCacheName = "site-dynamic-v3";

const assets = [
  "/",
  "/index.html",
  "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
  "https://fonts.googleapis.com/css?family=Montserrat",
  "https://fonts.googleapis.com/css?family=Lato:300,400,700,900",
  "https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png",
  "https://dciv99su0d7r5.cloudfront.net/Avenir-Black.otf",
  "https://dciv99su0d7r5.cloudfront.net/Poppins-Regular.otf",
  "https://dciv99su0d7r5.cloudfront.net/computer_no_bg.png",
  "https://dciv99su0d7r5.cloudfront.net/locoQR.png",
  "/favicon.ico",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/ShopLocoLoco Logo_Symbol Orange No BG.png",
  "/ShopLocoLoco Logo_Symbol White No BG.png",
  "/utils_pages/Landing.jsx",
  "/utils_pages/Landing.css",
  "/offline.html",
];

function addToCache(event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("cacheing assets");
      cache.addAll(assets);
    })
  );
}

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

function deleteOldCache(event) {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
}

function getCacheOrFetch(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then((cacheRes) => {
        console.log(cacheRes, "cache res value");
        console.log(event.request, "asdsadsad");

        return (
          cacheRes ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              if (
                event.request.url.indexOf("static/js") > -1 ||
                event.request.url.indexOf("google-analytics") > -1 ||
                event.request.url.indexOf("service-worker") > -1 ||
                event.request.url.indexOf("hot-update") > -1 ||
                event.request.url.indexOf("manifest.json") > -1 ||
                event.request.url.indexOf("localhost:5000") > -1 ||
                event.request.url.indexOf("stripe") > -1 ||
                event.request.url.indexOf("dciv99su0d7r5") > -1 ||
              ) {
                console.log("not cacheing these", event.request.url, fetchRes);
                return fetchRes;
              }

              console.log("cacheing these");
              console.log("sw-url", event.request.url, fetchRes);

              cache.put(event.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 40);

              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (event.request.url) {
          console.log("conditional offline", event.request.url);
          return caches.match("/offline.html");
        }
      })
  );
}

// self.addEventListener("install", addToCache);
// self.addEventListener("activate", deleteOldCache);
// self.addEventListener("fetch", getCacheOrFetch);
