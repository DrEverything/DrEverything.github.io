if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then(registration => console.log('Service Worker registered', registration))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}
const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(navigator.userAgent.toLowerCase());
let hElement = document.querySelector("h1");
fetch("https://127.0.0.1:8080").then(res => {
    res.json().then(json => {
        hElement.innerHTML = json.hey;
    });
});
export {};
