/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) =>
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate()
);

self.addEventListener('install', () => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', () => {
  console.log('Service Worker activated');
});
