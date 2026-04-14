const CACHE_NAME = 'lmw-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.js',
    './peptides_data.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://d3js.org/d3.v7.min.js',
    'https://cdn.jsdelivr.net/gh/jasondavies/d3-cloud/build/d3.layout.cloud.js',
    'https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js',
    'https://3Dmol.org/build/3Dmol-min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/nouislider/15.7.0/nouislider.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/nouislider/15.7.0/nouislider.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
