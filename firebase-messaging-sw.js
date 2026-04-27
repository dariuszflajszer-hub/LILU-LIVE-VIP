importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBltvLoVpGmLKNojphA60RxeVRbClqpnIQ',
  authDomain: 'lilu-vip-club.firebaseapp.com',
  projectId: 'lilu-vip-club',
  storageBucket: 'lilu-vip-club.firebasestorage.app',
  messagingSenderId: '1032950167061',
  appId: '1:1032950167061:web:fe66d06c8411241a6a401c'
});

const messaging = firebase.messaging();
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

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const targetUrl = normalizeTargetUrl(data.url || data.click_action || '');
  self.registration.showNotification(payload.notification?.title || 'LILU VIP CLUB LIVE', {
    body: payload.notification?.body || 'Kliknij i dołącz do transmisji.',
    icon: 'lilu-icon-192.png',
    badge: 'lilu-icon-192.png',
    tag: 'lilu-live-custom',
    renotify: true,
    data: { url: targetUrl }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || APP_HOME;
  event.waitUntil(clients.openWindow(targetUrl));
});
