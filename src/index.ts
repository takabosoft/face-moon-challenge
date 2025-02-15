/**
 * Development Build: npx webpack -w
 * Development Server: npx live-server docs
 * Development Server(HTTPS): npx live-server docs --https=ssl/https.js
 * Release Build: npx webpack --mode=production
 */

$(async () => {
    console.log("OK");

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
    });
    const video = $(`<video class="video" autoplay playsinline>`);
    (video[0] as HTMLVideoElement).srcObject = stream;
    $("main").append(video);
});