function receivePushNotification(event) {
  console.log("[Service Worker] Push Received from source file.");
  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
    vibrate: [200, 100, 200],
    tag: tag,
    badge: "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
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
    "[Service Worker] Notification click Received.",
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);

const staticCacheName = "site-static-v49";
const dynamicCacheName = "site-dynamic-v49";

const assets = [
  "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
  "/ShopLocoLoco Logo_Symbol Orange No BG.png",
  "/ShopLocoLoco Logo_Symbol White No BG.png",
  "./utils_pages/Landing.jsx",
  "./utils_pages/Landing.css",
  "./utils_pages/NoInternet.jsx",
  "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
  "https://fonts.googleapis.com/css?family=Montserrat",
  "https://fonts.googleapis.com/css?family=Lato:300,400,700,900",
  "https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png",
  "https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+Orange.png",
  "https://dciv99su0d7r5.cloudfront.net/Avenir-Black.otf",
  "https://dciv99su0d7r5.cloudfront.net/Poppins-Regular.otf",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_1.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_2.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_3.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_4.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_5.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_6.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_7.png",
  "https://dciv99su0d7r5.cloudfront.net/profile_pic_loco_8.png",
  "https://dciv99su0d7r5.cloudfront.net/computer_no_bg.png",
  "https://dciv99su0d7r5.cloudfront.net/vosh_qr.png",
];

function addToCache(event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
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
      console.log("deleting cache that is not", staticCacheName);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName || key !== dynamicCacheName)
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
        return (
          cacheRes ||
          fetch(event.request)
            .then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                if (
                  event.request.url.indexOf("google-analytics") > -1 ||
                  event.request.url.indexOf("service-worker") > -1 ||
                  event.request.url.indexOf("hot-update") > -1 ||
                  event.request.url.indexOf("manifest.json") > -1 ||
                  event.request.url.indexOf("api.shoplocoloco") > -1 ||
                  event.request.url.indexOf("stripe") > -1 ||
                  event.request.url.indexOf("pay.google.com") > -1 ||
                  event.request.destination === "video" ||
                  event.request.url.indexOf("http") !== 0
                ) {
                  console.log(
                    "not cacheing these",
                    event.request.url,
                    fetchRes
                  );
                  return fetchRes;
                }

                cache.put(event.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 100);
                return fetchRes;
              });
            })
            .catch((err) => {
              console.log(err);
              console.log(event.request);
            })
        );
      })
      .catch(() => {
        if (
          event.request.url &&
          event.request.url.indexOf("vosh.club") > -1 &&
          event.request.url.indexOf(".css") < 0 &&
          event.request.url.indexOf(".js") < 0
        ) {
          console.log("conditional offline", event.request.url);
        }
      })
  );
}

self.addEventListener("install", addToCache);

self.addEventListener("install", deleteOldCache);
// self.addEventListener("activate", deleteOldCache);

self.addEventListener("fetch", getCacheOrFetch);
