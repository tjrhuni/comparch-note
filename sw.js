// 오프라인용: 처음 열 때 노트를 저장해 두고, 인터넷이 있으면 새 버전을 받아 다음 실행 때 반영
const CACHE = "comparch-202610191201";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-600.png", "./cram/", "./cram/index.html", "./cram/manifest.webmanifest", "./quiz/", "./quiz/index.html", "./quiz/manifest.webmanifest", "./recall/", "./recall/index.html", "./recall/manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, {cache: "reload"}))))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => hit || Response.error());
    return hit || net;
  }));
});
