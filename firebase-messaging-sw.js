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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'LILU VIP CLUB';
  const notificationOptions = {
    body: payload.notification?.body || 'Nowe powiadomienie',
    icon: 'lilu-icon-192.png',
    badge: 'lilu-icon-192.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(clients.openWindow(targetUrl));
});
