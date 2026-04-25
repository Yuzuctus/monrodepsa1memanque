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
  audio.currentTime = 4;
  var p = audio.play();
  if (p !== undefined) {
    p.catch(function () {
      // Autoplay blocked — retry on next user interaction
      document.addEventListener(
        "click",
        function go() {
          audio.currentTime = 5;
          audio.play();
        },
        { once: true }
      );
    });
  }
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
  initBSOD();
  initKonami();
});
