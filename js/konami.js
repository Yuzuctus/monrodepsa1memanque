/* ==========================================================================
   Konami Code Easter Egg — ↑↑↓↓←→←→ B A Enter
   Triggers 2 seconds of party mode (color + sped-up music), then reverts.
   Each correct keypress flashes the page as feedback.
   ========================================================================== */

var konamiSeq = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
  "Enter"
];
var konamiIdx = 0;
var partyTimer = null;

// ---------- Party mode: 2s of color and sped-up music ----------

function triggerPartyMode() {
  if (partyTimer) return;
  var html = document.documentElement;
  html.classList.add("party-mode");
  var audio = document.getElementById("music");
  var origRate = audio.playbackRate;
  audio.playbackRate = 1.8;
  partyTimer = setTimeout(function () {
    html.classList.remove("party-mode");
    audio.playbackRate = origRate;
    partyTimer = null;
  }, 2000);
}

// ---------- Keydown listener ----------

function initKonami() {
  document.addEventListener("keydown", function (e) {
    var expected = konamiSeq[konamiIdx];
    if (e.key === expected) {
      konamiIdx++;
      // Visual feedback: yellow flash on the body
      document.body.classList.add("konami-step");
      setTimeout(function () {
        document.body.classList.remove("konami-step");
      }, 350);
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        triggerPartyMode();
      }
    } else {
      konamiIdx = 0;
    }
  });
}
