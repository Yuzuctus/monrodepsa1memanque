/* ==========================================================================
   Effects — Vine Boom, Cursor, Counter, Rain, Marquee
   ========================================================================== */

// ---------- Vine Boom Sound on Every Click ----------

function initVineBoom() {
  var booms = [];
  document.addEventListener("click", function () {
    var boom = new Audio("assets/vine-boom-onclic.mp3");
    boom.volume = 0.6;
    booms.push(boom);
    boom.play().catch(function () {});
    boom.addEventListener("ended", function () {
      var idx = booms.indexOf(boom);
      if (idx > -1) booms.splice(idx, 1);
    });
  });
}

// ---------- Custom Heart Cursor (desktop only) ----------

function initCursor() {
  var cursor = document.getElementById("cursor");
  if (window.matchMedia("(min-width: 1024px)").matches) {
    cursor.style.display = "block";
  }
  document.addEventListener("mousemove", function (e) {
    if (cursor.style.display === "block") {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  });
}

// ---------- Live Counter (days / hours / minutes / seconds since death) ----------

function initCounter() {
  var datePanne = new Date("2026-04-23T19:54:00");

  function updateCounter() {
    var now = new Date();
    var diffMs = now - datePanne;
    if (diffMs < 0) diffMs = 0;

    var s = Math.floor(diffMs / 1000);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    var j = Math.floor(h / 24);

    s = s % 60;
    m = m % 60;
    h = h % 24;

    function p(n, word) {
      return n + " " + word + (n > 1 ? "S" : "");
    }

    document.getElementById("counter").innerHTML =
      "⏳ " +
      p(j, "JOUR") +
      " " +
      p(h, "HEURE") +
      " " +
      p(m, "MINUTE") +
      " " +
      p(s, "SECONDE") +
      " ⏳";
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

// ---------- Emoji Rain (self-replenishing pool) ----------

function initRain() {
  var emojis = ["😭", "😢", "💔", "🪦", "😿", "🥀", "⚰️", "🔧", "💀"];

  function spawnRainDrop() {
    var e = document.createElement("div");
    e.className = "emoji-rain";
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = Math.random() * 100 + "%";
    var dur = Math.random() * 4 + 4;
    var delay = Math.random() * 3;
    e.style.animation = "fall " + dur + "s linear " + delay + "s both";
    e.style.fontSize = Math.random() * 25 + 18 + "px";
    document.body.appendChild(e);

    e.addEventListener("animationend", function () {
      e.remove();
      spawnRainDrop();
    });
  }

  for (var i = 0; i < 45; i++) {
    spawnRainDrop();
  }
}

// ---------- Infinite Marquee Setup ----------

function initMarquee() {
  var marqueeSpan = document.querySelector(".marquee-bar span");
  marqueeSpan.setAttribute("data-text", marqueeSpan.textContent);
}
