/* ==========================================================================
   Effects — Vine Boom, Cursor, Counter, Rain, Marquee
   ========================================================================== */

// ---------- Vine Boom Sound on Every Click ----------

var _vineBoomPool = [];
var _vineBoomIdx = 0;

function initVineBoom() {
  var poolSize = 4;
  for (var i = 0; i < poolSize; i++) {
    var a = new Audio("assets/vine-boom-onclic.mp3");
    a.volume = 0.6;
    _vineBoomPool.push(a);
  }

  document.addEventListener("click", function () {
    playVineBoom();
  });
}

function playVineBoom() {
  if (!_vineBoomPool.length) return;
  var boom = _vineBoomPool[_vineBoomIdx];
  _vineBoomIdx = (_vineBoomIdx + 1) % _vineBoomPool.length;
  boom.currentTime = 0;
  boom.play().catch(function () {});
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

// ---------- Speech Tribute Player ----------

function initSpeechTribute() {
  var speechBtn = document.getElementById("speech-btn");
  var speechStatus = document.getElementById("speech-status");
  var speechAudio = document.getElementById("tribute-speech");
  if (!speechBtn || !speechStatus || !speechAudio) return;

  var music = document.getElementById("music");
  var initialBtnText = speechBtn.textContent;
  var speechLines = [
    "Discours lancé : veuillez respecter une minute de silence (sauf pour le vine boom).",
    "Lecture solennelle en cours : ce héros articulé mérite nos meilleurs sanglots.",
    "Hommage audio activé : le bras de micro vous écoute depuis le paradis du setup.",
  ];

  function randomSpeechLine() {
    return speechLines[Math.floor(Math.random() * speechLines.length)];
  }

  function duckMusic() {
    if (!music || music.paused) return;
    music.dataset.prevVolume = String(music.volume);
    music.volume = Math.min(music.volume, 0.16);
  }

  function restoreMusic() {
    if (!music || music.paused) return;
    var prev = parseFloat(music.dataset.prevVolume || "");
    if (!isNaN(prev)) {
      music.volume = prev;
    }
  }

  function setSpeechPlaying(isPlaying) {
    speechBtn.classList.toggle("is-playing", isPlaying);
    speechBtn.textContent = isPlaying
      ? "⏸️ METTRE LE DISCOURS EN PAUSE"
      : initialBtnText;
  }

  speechBtn.addEventListener("click", function () {
    if (speechAudio.paused) {
      var p = speechAudio.play();
      if (p !== undefined) {
        p.catch(function () {
          speechStatus.textContent =
            "Lecture bloquée par le navigateur. Reclique et le bras t'entendra.";
          setSpeechPlaying(false);
        });
      }
    } else {
      speechAudio.pause();
    }
  });

  speechAudio.addEventListener("play", function () {
    duckMusic();
    setSpeechPlaying(true);
    speechStatus.textContent = randomSpeechLine();
  });

  speechAudio.addEventListener("pause", function () {
    setSpeechPlaying(false);
    if (!speechAudio.ended) {
      speechStatus.textContent =
        "Discours en pause. Le bras attend ton signal pour la suite de l'hommage.";
    }
    restoreMusic();
  });

  speechAudio.addEventListener("ended", function () {
    setSpeechPlaying(false);
    speechStatus.textContent =
      "Discours terminé. Merci d'avoir honoré la mémoire de ce bras légendaire.";
    restoreMusic();
  });

  speechAudio.addEventListener("error", function () {
    setSpeechPlaying(false);
    speechStatus.textContent =
      "Impossible de lire le discours. Même le destin n'assume plus cette tragédie.";
    restoreMusic();
  });
}

// ---------- Cookie Banner Troll ----------

function initCookies() {
  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  var rejectBtn = document.getElementById("cookie-reject");
  var acceptBtn = document.getElementById("cookie-accept");
  var refundZone = document.getElementById("cookie-refund-zone");

  if (rejectBtn) {
    // Bouton "Tout refuser" : texte qui change au survol
    rejectBtn.addEventListener("mouseenter", function () {
      rejectBtn.textContent = "Non";
    });
    rejectBtn.addEventListener("mouseleave", function () {
      rejectBtn.textContent = "Tout refuser";
    });
    rejectBtn.addEventListener("click", function () {
      // Ne fait strictement rien
    });
  }

  // --- Refuser de pleurer : se décoche après 1s ---
  var cryLabel = document.getElementById("cookie-cry");
  if (cryLabel) {
    var cryCheckbox = cryLabel.querySelector("input");
    var cryTimer = null;
    if (cryCheckbox) {
      cryCheckbox.addEventListener("change", function () {
        if (cryTimer) clearTimeout(cryTimer);
        if (cryCheckbox.checked) {
          cryTimer = setTimeout(function () {
            cryCheckbox.checked = false;
            cryLabel.classList.add("cookie-shake");
            setTimeout(function () {
              cryLabel.classList.remove("cookie-shake");
            }, 400);
          }, 1000);
        }
      });
    }
  }

  // --- Exiger un remboursement : mode impossible, la case fuit hors pop-up ---
  var refundLabel = document.getElementById("cookie-refund");
  if (refundLabel && refundZone) {
    var refundCheckbox = refundLabel.querySelector("input");
    var refundPlaceholder = document.createElement("div");
    refundPlaceholder.className = "cookie-refund-placeholder";
    refundPlaceholder.textContent =
      "Exiger un remboursement à Rode (option impossible : cette case prend la fuite).";

    var refundParent = refundLabel.parentNode;
    if (refundParent) {
      if (refundLabel.nextSibling) {
        refundParent.insertBefore(refundPlaceholder, refundLabel.nextSibling);
      } else {
        refundParent.appendChild(refundPlaceholder);
      }
    }

    refundZone.appendChild(refundLabel);
    refundLabel.classList.add("cookie-refund-fugitif");

    var refundCooldown = 0;
    var refundPanicTimer = null;

    function rectsOverlap(a, b) {
      return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
      );
    }

    function getRefundSpot(pointerX, pointerY) {
      var rect = refundLabel.getBoundingClientRect();
      var width = Math.max(Math.ceil(rect.width), 220);
      var height = Math.max(Math.ceil(rect.height), 34);
      var margin = 10;
      var viewW = window.innerWidth;
      var viewH = window.innerHeight;
      var bannerRect = banner.getBoundingClientRect();
      var marquee = document.querySelector(".marquee-bar");
      var marqueeReserve = marquee
        ? Math.ceil(marquee.getBoundingClientRect().height) + 8
        : 56;

      var minX = margin;
      var maxX = Math.max(minX, viewW - width - margin);
      var minY = margin;
      var maxY = Math.max(minY, viewH - height - marqueeReserve);

      var x = minX;
      var y = minY;
      for (var i = 0; i < 80; i++) {
        x = minX + Math.random() * (maxX - minX || 1);
        y = minY + Math.random() * (maxY - minY || 1);

        var candidate = {
          left: x,
          top: y,
          right: x + width,
          bottom: y + height,
        };

        if (rectsOverlap(candidate, bannerRect)) {
          continue;
        }

        if (typeof pointerX === "number" && typeof pointerY === "number") {
          var centerX = x + width / 2;
          var centerY = y + height / 2;
          var distX = centerX - pointerX;
          var distY = centerY - pointerY;
          var distance = Math.sqrt(distX * distX + distY * distY);
          if (distance < 160) {
            continue;
          }
        }

        return { x: x, y: y };
      }

      return {
        x: bannerRect.left > viewW / 2 ? margin : maxX,
        y: minY + Math.random() * (maxY - minY || 1),
      };
    }

    function doRefundFlee(evt) {
      var pointerX;
      var pointerY;
      if (evt && typeof evt.clientX === "number" && typeof evt.clientY === "number") {
        pointerX = evt.clientX;
        pointerY = evt.clientY;
      }

      var pos = getRefundSpot(pointerX, pointerY);
      refundLabel.style.left = Math.round(pos.x) + "px";
      refundLabel.style.top = Math.round(pos.y) + "px";
      if (refundCheckbox) {
        refundCheckbox.checked = false;
      }

      refundLabel.classList.add("cookie-refund-panique");
      if (refundPanicTimer) {
        clearTimeout(refundPanicTimer);
      }
      refundPanicTimer = setTimeout(function () {
        refundLabel.classList.remove("cookie-refund-panique");
      }, 180);
    }

    function fleeWithCooldown(evt) {
      var now = Date.now();
      if (now - refundCooldown < 95) return;
      refundCooldown = now;
      doRefundFlee(evt);
    }

    function pointerNearRefund(evt) {
      var r = refundLabel.getBoundingClientRect();
      var padding = 22;
      return (
        evt.clientX >= r.left - padding &&
        evt.clientX <= r.right + padding &&
        evt.clientY >= r.top - padding &&
        evt.clientY <= r.bottom + padding
      );
    }

    refundLabel.addEventListener("mouseenter", fleeWithCooldown);
    refundLabel.addEventListener("mousemove", fleeWithCooldown);
    refundLabel.addEventListener("click", function (e) {
      e.preventDefault();
      fleeWithCooldown(e);
    });

    if (refundCheckbox) {
      refundCheckbox.addEventListener("click", function (e) {
        e.preventDefault();
        refundCheckbox.checked = false;
        fleeWithCooldown(e);
      });
    }

    document.addEventListener("mousemove", function (evt) {
      if (pointerNearRefund(evt)) {
        fleeWithCooldown(evt);
      }
    });

    refundLabel.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        var t = e.touches && e.touches[0] ? e.touches[0] : null;
        if (t) {
          fleeWithCooldown(t);
        } else {
          doRefundFlee();
        }
      },
      { passive: false }
    );

    window.addEventListener("resize", function () {
      doRefundFlee();
    });

    setTimeout(function () {
      doRefundFlee();
    }, 40);
  }

  // --- Annuler la mort : grisé + "Trop tard" au hover ---
  var undoLabel = document.getElementById("cookie-undo");
  if (undoLabel) {
    var undoCheckbox = undoLabel.querySelector("input");
    var undoText = undoLabel.querySelector(".undo-text");
    undoLabel.addEventListener("mouseenter", function () {
      undoCheckbox.disabled = true;
    });
    undoLabel.addEventListener("mouseleave", function () {
      undoCheckbox.disabled = false;
    });
  }

  // --- Signer une pétition : Rick Roll camouflé ---
  var petitionLabel = document.getElementById("cookie-petition");
  if (petitionLabel) {
    var petitionCheckbox = petitionLabel.querySelector("input");
    if (petitionCheckbox) {
      petitionCheckbox.addEventListener("change", function () {
        if (petitionCheckbox.checked) {
          window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }
      });
    }
  }

  // --- Demander à ChatGPT ---
  var gptLabel = document.getElementById("cookie-gpt");
  if (gptLabel) {
    var gptCheckbox = gptLabel.querySelector("input");
    if (gptCheckbox) {
      gptCheckbox.addEventListener("change", function () {
        if (gptCheckbox.checked) {
          gptCheckbox.checked = false;
          alert(
            "ChatGPT est actuellement en timeout émotionnel.\nVeuillez réessayer dans l'au-delà."
          );
        }
      });
    }
  }

  // --- Choisir un fond joyeux : invert temporaire ---
  var joyLabel = document.getElementById("cookie-joy");
  if (joyLabel) {
    var joyCheckbox = joyLabel.querySelector("input");
    if (joyCheckbox) {
      joyCheckbox.addEventListener("change", function () {
        if (joyCheckbox.checked) {
          document.body.style.filter = "invert(1) hue-rotate(180deg)";
          setTimeout(function () {
            document.body.style.filter = "";
            joyCheckbox.checked = false;
          }, 400);
        }
      });
    }
  }

  // --- Refuser la tristesse : devient emoji 😢 ---
  var sadLabel = document.getElementById("cookie-sad");
  if (sadLabel) {
    var sadCheckbox = sadLabel.querySelector("input");
    if (sadCheckbox) {
      sadCheckbox.addEventListener("change", function () {
        if (sadCheckbox.checked) {
          sadCheckbox.style.display = "none";
          var emoji = document.createElement("span");
          emoji.textContent = "😢";
          emoji.style.fontSize = "1.2rem";
          emoji.style.marginLeft = "4px";
          sadLabel.appendChild(emoji);
        }
      });
    }
  }

  // --- Garder le moral : se décoche toutes les 3s ---
  var moralLabel = document.getElementById("cookie-moral");
  if (moralLabel) {
    var moralCheckbox = moralLabel.querySelector("input");
    var moralTimer = null;
    function startMoralTimer() {
      if (moralTimer) clearInterval(moralTimer);
      moralTimer = setInterval(function () {
        if (moralCheckbox && moralCheckbox.checked) {
          moralCheckbox.checked = false;
          moralLabel.classList.add("cookie-shake");
          setTimeout(function () {
            moralLabel.classList.remove("cookie-shake");
          }, 400);
        }
      }, 3000);
    }

    if (moralCheckbox) {
      moralCheckbox.addEventListener("change", function () {
        if (moralCheckbox.checked) {
          startMoralTimer();
        } else if (moralTimer) {
          clearInterval(moralTimer);
        }
      });
    }
  }

  // --- Email funérailles : refuse les vraies adresses ---
  var funeralRow = document.getElementById("cookie-funeral");
  if (funeralRow) {
    var mailInput = funeralRow.querySelector(".cookie-mail");
    var mailMsg = funeralRow.querySelector(".cookie-mail-msg");
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function checkMail() {
      if (!mailInput || !mailMsg) return;
      var val = mailInput.value.trim();
      if (!val) { mailMsg.textContent = ""; return; }
      if (emailRegex.test(val)) {
        mailMsg.textContent = "Trop réel. Refusé.";
        mailMsg.style.color = "#ff4444";
        mailInput.value = "";
      } else {
        mailMsg.textContent = "Enregistré. Vous serez informé dans l'au-delà.";
        mailMsg.style.color = "#66ff66";
      }
    }
    if (mailInput && mailMsg) {
      mailInput.addEventListener("blur", checkMail);
      mailInput.addEventListener("change", checkMail);
      mailInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          mailInput.blur();
        }
      });
    }
  }

  // --- Accepter le drame : ferme la bannière ---
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      banner.style.transition = "transform 0.5s ease-in, opacity 0.5s ease-in";
      banner.style.transform = "translateY(150%)";
      banner.style.opacity = "0";
      if (refundZone) {
        refundZone.style.transition = "opacity 0.35s ease-in";
        refundZone.style.opacity = "0";
      }
      setTimeout(function () {
        banner.style.display = "none";
        if (refundZone) {
          refundZone.style.display = "none";
        }
      }, 500);
    });
  }
}
