/* ==========================================================================
   App — Entry point
   Handles the intro overlay (click-to-start) and initializes all modules.
   ========================================================================== */

var started = false;

function startSite() {
  if (started) return;
  started = true;

  document.getElementById("overlay").style.display = "none";

  var audio = document.getElementById("music");
  if (!audio) return;
  audio.currentTime = 4;
  audio.volume = 0;
  var p = audio.play();
  if (p !== undefined) {
    p.catch(function () {
      // Autoplay blocked — retry on next user interaction
      document.addEventListener(
        "click",
        function go() {
          audio.currentTime = 5;
          audio.volume = 0;
          audio.play();
          fadeInAudio(audio, 0.5, 2000);
        },
        { once: true }
      );
      return;
    });
  }

  // Fondu audio doux pour ne pas agresser
  fadeInAudio(audio, 0.5, 2000);
}

function fadeInAudio(audio, targetVolume, duration) {
  var start = performance.now();
  function step(now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    audio.volume = progress * targetVolume;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// ---------- Boot everything after DOM is ready ----------

document.addEventListener("DOMContentLoaded", function () {
  // Intro overlay click handler
  document.getElementById("overlay").addEventListener("click", startSite);

  // Init all modules
  initVineBoom();
  initCursor();
  initCounter();
  initRain();
  initMarquee();
  initSpeechTribute();
  initBSOD();
  initKonami();
  initCookies();
});
