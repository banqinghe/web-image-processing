import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from 'workbox-core'

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

self.addEventListener('message', e => {
  console.log('sw message', e);
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
})
