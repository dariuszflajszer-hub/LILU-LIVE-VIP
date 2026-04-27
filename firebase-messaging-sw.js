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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isAppHome = url.origin + url.pathname === APP_HOME || url.href === APP_HOME;
  if (!isAppHome || event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).then(response => response.text()).then(html => {
      const code = `<script>(()=>{let n=0,t=null;document.addEventListener('click',e=>{if(!e.target.closest('.logo'))return;n++;clearTimeout(t);t=setTimeout(()=>n=0,2500);if(n>=7){location.href='admin.html';}});})();</script>`;
      return new Response(html.replace('</body>', code + '</body>'), {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }).catch(() => fetch(event.request))
  );
});
