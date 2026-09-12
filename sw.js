/* 乒乓球 3D · Service Worker（PWA 离线缓存 v2）
   更新策略：页面导航请求 network-first（始终优先拿最新版本，离线才回落缓存），
   其余静态资产 cache-first；新 SW 安装后立即接管（skipWaiting + clients.claim）。 */
const CACHE = 'pp3d-v2';
const ASSETS = [
  './',
  './ping-pong-3d.html',
  './index.html',
  './manifest.json',
  './three.min.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // 页面导航 / HTML：network-first，保证代码更新即刻生效
  const isPage = e.request.mode === 'navigate' ||
    url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (isPage) {
    e.respondWith(
      fetch(e.request).then((resp) => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./')))
    );
    return;
  }

  // 其余资产：cache-first
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((res) => {
      if (res) return res;
      return fetch(e.request).then((resp) => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('./'));
    })
  );
});
