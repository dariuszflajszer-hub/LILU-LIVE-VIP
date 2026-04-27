const APP_HOME = 'https://dariuszflajszer-hub.github.io/LILU-LIVE-VIP/';
const LIVE_REDIRECT = APP_HOME + 'open-live.html?url=';

function normalizeTargetUrl(rawUrl) {
  if (!rawUrl) return APP_HOME;
  const url = String(rawUrl).trim();
  if (url.startsWith('https://dariuszflajszer-hub.github.io/') && !url.startsWith(APP_HOME)) return APP_HOME;
  if (url.startsWith('https://www.facebook.com/') || url.startsWith('https://facebook.com/') || url.startsWith('https://fb.watch/')) return LIVE_REDIRECT + encodeURIComponent(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return APP_HOME;
}

self.addEventListener('push', (event) => {
  event.stopImmediatePropagation();

  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = {};
  }

  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || data.title || 'LILU VIP CLUB LIVE';
  const body = notification.body || data.body || 'Kliknij i dołącz do transmisji.';
  const targetUrl = normalizeTargetUrl(data.url || data.URL || data.click_action || payload.fcmOptions?.link || payload.webpush?.fcm_options?.link || '');

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: 'lilu-icon-192.png',
      badge: 'lilu-icon-192.png',
      tag: 'lilu-live',
      renotify: true,
      data: { url: targetUrl }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || APP_HOME;
  event.waitUntil(clients.openWindow(targetUrl));
});
