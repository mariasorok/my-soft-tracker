const CACHE_NAME = 'soft-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './caveat-v23-cyrillic_latin-600.woff2',
  './caveat-v23-cyrillic_latin-700.woff2',
  './nunito-v32-cyrillic_latin-regular.woff2',
  './nunito-v32-cyrillic_latin-600.woff2',
  './nunito-v32-cyrillic_latin-700.woff2'
];

// Устанавливаем и кэшируем все файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Удаляем старый кэш, если обновили версию
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Перехватываем запросы и отдаем из кэша, если интернета нет
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});