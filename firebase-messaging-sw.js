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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const fcmData = data.FCM_MSG?.data || {};
  const targetUrl = fcmData.url || data.url || 'https://dariuszflajszer-hub.github.io/LILU-LIVE-VIP/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
