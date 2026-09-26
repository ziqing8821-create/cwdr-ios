/* V10.59 自清缓存 Service Worker：接管旧版 SW → 删除所有旧缓存 → 强制刷新一次 → 之后全部走网络 */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    }).then(function(list){
      list.forEach(function(cl){ try { cl.navigate(cl.url); } catch(err){} });
    })
  );
});
self.addEventListener('fetch', function(e){ /* 不拦截：全部走真实网络 */ });
