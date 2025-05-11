// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const NEXT_PUBLIC_FIREBASE_API_KEY = 'AIzaSyCWr-2GCWYWgw_QEeNRCQCmalzxdO6HoOs';
const NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'next-template-c3d4d.firebaseapp.com';
const NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'next-template-c3d4d';
const NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'next-template-c3d4d.firebasestorage.app';
const NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '16277904475';
const NEXT_PUBLIC_FIREBASE_APP_ID = '1:16277904475:web:4473c447b3d39c0e48b37e';
const NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'G-R1F366FVFW';

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});