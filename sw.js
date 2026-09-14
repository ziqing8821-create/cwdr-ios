/* 单词萝卜 iOS PWA · 离线缓存：游戏是单文件自包含（词库/精灵全内嵌），缓存一个页面即可离线玩 */
const CACHE = 'cwdr-v97-' + '1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const cp = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp));   // 网络优先，顺手刷新缓存
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))  // 断网回缓存
  );
});



