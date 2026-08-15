/* ================================================
   Service Worker — Fleur's Portaal
   Zorgt voor offline werking en installeerbaarheid
================================================ */

const CACHE_NAAM = "fleur-portaal-v10";

const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./supabase-config.js",
    "./icons/icon.svg"
];


/* --- Installatie: sla app-bestanden op in cache --- */

self.addEventListener("install", function(event) {

    event.waitUntil(
        caches
            .open(CACHE_NAAM)
            .then(function(cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );

});


/* --- Activatie: verwijder oude caches --- */

self.addEventListener("activate", function(event) {

    event.waitUntil(
        caches.keys().then(function(sleutels) {
            return Promise.all(
                sleutels
                    .filter(function(s) { return s !== CACHE_NAAM; })
                    .map(function(s) { return caches.delete(s); })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );

});


/* --- Verzoeken: cache-eerst, achtergrond-update --- */

self.addEventListener("fetch", function(event) {

    const url = new URL(event.request.url);

    // Externe verzoeken (Supabase, CDN) gewoon doorlaten
    if (url.origin !== self.location.origin) {
        return;
    }

    // Alleen GET-verzoeken cachen
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(gecached) {

            // Altijd proberen te vernieuwen op de achtergrond
            const netwerkVerzoek = fetch(event.request).then(function(respons) {

                if (respons && respons.status === 200) {
                    caches.open(CACHE_NAAM).then(function(cache) {
                        cache.put(event.request, respons.clone());
                    });
                }

                return respons;

            }).catch(function() {
                // Stil falen als er geen netwerk is
            });

            // Geef gecachede versie terug als die er is, anders wacht op netwerk
            return gecached || netwerkVerzoek;

        })
    );

});
