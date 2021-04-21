const pushServerPublicKey =
  "BG_OYyPpjkLxXWTWKs9mOUSmn3a7-NesbIruvEB7PrzkImAg3ZXyaqdbzqmY92TvNv64Msaarn2GmaZPAk4uJtE";

function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

async function askUserPermission() {
  return await Notification.requestPermission();
}

async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;

  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey,
  });
}

function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function (serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function (pushSubscription) {
      return pushSubscription;
    });
}

export {
  isPushNotificationSupported,
  askUserPermission,
  createNotificationSubscription,
  getUserSubscription,
};
