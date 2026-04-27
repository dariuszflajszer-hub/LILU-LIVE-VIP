importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBltvLoVpGmLKNojphA60RxeVRbClqpnIQ',
  authDomain: 'lilu-vip-club.firebaseapp.com',
  projectId: 'lilu-vip-club',
  storageBucket: 'lilu-vip-club.firebasestorage.app',
  messagingSenderId: '1032950167061',
  appId: '1:1032950167061:web:e292a2d100d6e2816a401c'
});

firebase.messaging();

const APP_HOME = 'https://dariuszflajszer-hub.github.io/LILU-LIVE-VIP/';
const LIVE_REDIRECT = APP_HOME + 'open-live.html?url=';

function normalizeTargetUrl(rawUrl) {
  if (!rawUrl) return APP_HOME;

  const url = String(rawUrl).trim();

  if (url.startsWith('https://www.facebook.com/') || url.startsWith('https://facebook.com/') || url.startsWith('https://fb.watch/')) {
    return LIVE_REDIRECT + encodeURIComponent(url);
  }

  if (url.startsWith('https://dariuszflajszer-hub.github.io/LILU-LIVE-VIP/')) {
    return url;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return LIVE_REDIRECT + encodeURIComponent(url);
  }

  return APP_HOME;
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const fcmData = data.FCM_MSG?.data || {};
  const rawUrl = fcmData.url || data.url || data.click_action || fcmData.click_action || '';
  const targetUrl = normalizeTargetUrl(rawUrl);

  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});
