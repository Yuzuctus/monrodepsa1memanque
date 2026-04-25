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
  var joyTimer = null;
  var gptTimer = null;
  var _confettiCleanup = null;
  var toastHost = document.getElementById("mourning-toast-host");
  var confettiLayer = document.getElementById("joy-confetti-layer");
  var gptPanel = document.getElementById("cookie-gpt-panel");
  var _refundMouseMove = null;
  var _refundResize = null;

  var gptReplies = [
    "🤖💔 Je suis désolé d'apprendre la perte de votre bras. Avez-vous essayé d'éteindre et de rallumer le Rode PSA1 ? 💔🤖",
    "🧠🔧 Diagnostic terminé : placez trois stickers RGB sur la cassure et murmurez 'Rode.exe --restore'. 🔧🧠",
    "📉⚙️ Selon mes calculs, il suffit de redémarrer la gravité puis d'installer la mise à jour support-physique v2.1. ⚙️📉",
    "🪦🛠️ Recommandation IA : soufflez dessus, tapez deux fois, puis priez très fort le support de micro. 🛠️🪦",
  ];

  var emojiPools = {
    danger: ["💔", "😭", "🪦", "⚰️", "🥀", "🚫", "😵", "💀", "😿", "🔥"],
    success: ["✅", "✨", "😎", "🎯", "🎉", "🫡", "🧃", "🌟", "💪", "🏆"],
    robot: ["🤖", "🧠", "📡", "⚙️", "🔌", "💾", "🧪", "🔋", "📊", "🖥️"],
  };

  function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function emojiCluster(pool, min, max) {
    var count = randomInt(min, max);
    var out = "";
    for (var i = 0; i < count; i++) {
      out += randomFrom(pool);
      if (Math.random() < 0.3) {
        out += " ";
      }
    }
    return out;
  }

  function decorateToastMessage(message, pool) {
    return (
      emojiCluster(pool, 4, 8) +
      " " +
      message +
      " " +
      emojiCluster(pool, 3, 7)
    );
  }

  function ensureToastHost() {
    if (toastHost) return toastHost;
    toastHost = document.createElement("div");
    toastHost.id = "mourning-toast-host";
    document.body.appendChild(toastHost);
    return toastHost;
  }

  function showToast(message, type, lifetime) {
    var host = ensureToastHost();
    var toast = document.createElement("div");
    toast.className = "mourning-toast";
    if (type) {
      toast.classList.add("toast-" + type);
    }
    toast.textContent = message;
    host.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("is-visible");
    });

    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 220);
    }, lifetime || 2200);
  }

  function showToastStorm(config) {
    var cfg = config || {};
    var repeats = cfg.repeats || randomInt(3, 6);
    var spread = cfg.spread || 220;
    var lifetime = cfg.lifetime || 2100;
    var type = cfg.type || "";
    var variants = cfg.variants || [];
    var pool = cfg.emojiPool || emojiPools.danger;
    var decorate = cfg.decorate !== false;

    for (var i = 0; i < repeats; i++) {
      (function (index) {
        var delay = index * 75 + randomInt(0, spread);
        setTimeout(function () {
          var message = cfg.message || "Rien ne va. 😭";
          if (variants.length) {
            message = randomFrom(variants);
          }
          if (decorate) {
            message = decorateToastMessage(message, pool);
          }
          showToast(message, type, lifetime + randomInt(0, 500));
        }, delay);
      })(i);
    }
  }

  function ensureConfettiLayer() {
    if (confettiLayer) return confettiLayer;
    confettiLayer = document.createElement("div");
    confettiLayer.id = "joy-confetti-layer";
    document.body.appendChild(confettiLayer);
    return confettiLayer;
  }

  function burstConfetti(pieceCount) {
    var layer = ensureConfettiLayer();
    var colors = ["#ff5a5a", "#ffd93d", "#44d97c", "#5ab7ff", "#ff7fe0", "#ff9f43"];
    var total = pieceCount || 90;
    layer.innerHTML = "";

    for (var i = 0; i < total; i++) {
      var piece = document.createElement("span");
      piece.className = "joy-confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = Math.round(Math.random() * 7 + 5) + "px";
      piece.style.height = Math.round(Math.random() * 8 + 7) + "px";
      piece.style.animationDuration = (Math.random() * 0.8 + 1.4).toFixed(2) + "s";
      piece.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
      piece.style.setProperty("--confetti-drift", Math.round(Math.random() * 240 - 120) + "px");
      piece.style.transform = "rotate(" + Math.round(Math.random() * 360) + "deg)";
      layer.appendChild(piece);
    }

    if (_confettiCleanup) {
      clearTimeout(_confettiCleanup);
    }
    _confettiCleanup = setTimeout(function () {
      layer.innerHTML = "";
      _confettiCleanup = null;
    }, 2600);
  }

  function ensureGptPanel() {
    if (gptPanel) return gptPanel;
    gptPanel = document.createElement("div");
    gptPanel.id = "cookie-gpt-panel";
    gptPanel.innerHTML =
      '<div class="cookie-gpt-title"></div>' +
      '<div class="cookie-gpt-body"></div>' +
      '<div class="cookie-gpt-actions"></div>';
    document.body.appendChild(gptPanel);
    return gptPanel;
  }

  function closeGptPanel() {
    if (gptTimer) {
      clearTimeout(gptTimer);
      gptTimer = null;
    }
    if (gptPanel) {
      gptPanel.classList.remove("is-open", "is-loading");
    }
  }

  function runFakeGpt() {
    var panel = ensureGptPanel();
    var title = panel.querySelector(".cookie-gpt-title");
    var body = panel.querySelector(".cookie-gpt-body");
    var actions = panel.querySelector(".cookie-gpt-actions");
    if (!title || !body || !actions) return;

    panel.classList.add("is-open", "is-loading");
    title.textContent = "🤖🧠 IA en cours de réflexion... 🧠🤖";
    body.textContent = "📡⚙️ Compilation de solutions absurdes en cours... ⚙️📡";
    actions.innerHTML = "";

    showToastStorm({
      type: "success",
      repeats: 5,
      spread: 300,
      lifetime: 1900,
      emojiPool: emojiPools.robot,
      variants: [
        "🧠 Connexion neuronale 🔌 au support 🪫 de micro... ⚡",
        "📡 Analyse de la cassure en 12 dimensions 🧪... veuillez patienter 🔋",
        "💾 Chargement du modèle Rode-Psa1-Legacy-v0 📊... en cours ⚙️",
        "🖥️ Interrogation du néant mécanique 🤖... réponse attendue 🔮",
        "🛰️ Ping du défunt 💀 en cours... latence infinie 🕳️",
      ],
    });

    if (gptTimer) {
      clearTimeout(gptTimer);
    }

    gptTimer = setTimeout(function () {
      panel.classList.remove("is-loading");
      title.textContent = "🤡💬 Réponse générée 💬🤡";
      body.textContent = gptReplies[Math.floor(Math.random() * gptReplies.length)];

      var uselessBtn = document.createElement("button");
      uselessBtn.type = "button";
      uselessBtn.className = "cookie-gpt-thumb";
      uselessBtn.textContent = "Pas utile 👎";
      uselessBtn.addEventListener("click", function () {
        closeGptPanel();
        showToastStorm({
          type: "danger",
          repeats: 6,
          spread: 320,
          lifetime: 2400,
          emojiPool: emojiPools.robot.concat(emojiPools.danger),
          variants: [
            "🤡 Retour enregistré 💾 : l'IA est confuse 😵... désolé pas désolé 🤷",
            "🧠 L'algorithme 💔 admet son incompétence mécanique ⚙️... pathétique 🔥",
            "🎫 Ticket support 📉 ouvert dans le néant 🕳️ numérique... bonne chance 💀",
            "💥 Le LLM a démissionné de honte 🫠... comprends-le 😭",
            "🪦 ChatGPT s'est effondré émotionnellement 🥀... RIP l'IA ⚰️",
          ],
        });
      });
      actions.appendChild(uselessBtn);
    }, 1800 + Math.random() * 700);
  }

  if (!window._mourningContextMenuBound) {
    window._mourningContextMenuBound = true;
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      var now = Date.now();
      if (!window._mourningContextToastStamp || now - window._mourningContextToastStamp > 700) {
        window._mourningContextToastStamp = now;
        showToastStorm({
          type: "danger",
          repeats: randomInt(4, 7),
          spread: 280,
          lifetime: 2300,
          variants: [
            "🚫 Le menu contextuel 💔 est en deuil ⚰️ et indisponible 🥀... RIP le clic droit 💀",
            "🖱️ Clic droit refusé 🚫 par la cellule de crise 😭 émotionnelle... oui oui 😵",
            "💀 Aucun menu ici 🪦, seulement de la tristesse 😿 organisée... dommage 🔥",
            "🐭 La souris pleure 😭, le clic droit aussi 💔... tout fout le camp 🫠",
            "⚡ Fonctionnalité désactivée 🕳️ pour cause de deuil 🥀... reviens demain 🫡",
          ],
        });
      }
    });
  }

  if (rejectBtn) {
    // Bouton "Tout refuser" : texte qui change au survol + toast troll
    rejectBtn.addEventListener("mouseenter", function () {
      rejectBtn.textContent = "Non";
      showToastStorm({
        type: "danger",
        repeats: randomInt(1, 2),
        spread: 80,
        lifetime: 1400,
        variants: [
          "🙅‍♂️ NON 🚫 c'est non 💀",
          "😤 C'est NON 🪦 point final",
        ],
      });
    });
    rejectBtn.addEventListener("mouseleave", function () {
      rejectBtn.textContent = "Tout refuser";
    });
    rejectBtn.addEventListener("click", function () {
      showToastStorm({
        type: "danger",
        repeats: randomInt(3, 5),
        spread: 200,
        lifetime: 1900,
        variants: [
          "🚫 Refus refusé 🙃 Vous n'avez pas le choix 😭... c'est comme ça 💔",
          "❌ Tout refuser ❓ Même pas en rêve 😴⚰️",
          "🔥 La seule option est d'accepter le drame 🪦... on insiste 💀",
          "🙅‍♂️ Non non non 🥀 le refus est indisponible 🕳️... respire 😮‍💨",
        ],
      });
    });
  }

  // --- Refuser de pleurer : se décoche après 2s + vine boom ---
  var cryLabel = document.getElementById("cookie-cry");
  if (cryLabel) {
    var cryCheckbox = cryLabel.querySelector("input");
    var cryTimer = null;
    if (cryCheckbox) {
      cryCheckbox.addEventListener("change", function () {
        if (cryTimer) { clearTimeout(cryTimer); cryTimer = null; }
        if (cryCheckbox.checked) {
          showToastStorm({
            type: "success",
            repeats: randomInt(1, 3),
            spread: 120,
            lifetime: 1600,
            variants: [
              "😎 T'as refusé de pleurer 🚫... on verra dans 2 secondes ⏰",
              "🫡 OK tu gères 💪... pour l'instant 😭",
            ],
          });

          cryTimer = setTimeout(function () {
            cryCheckbox.checked = false;
            if (typeof playVineBoom === "function") {
              playVineBoom();
            }
            cryLabel.classList.add("cookie-shake");
            setTimeout(function () {
              cryLabel.classList.remove("cookie-shake");
            }, 400);

            showToastStorm({
              type: "danger",
              repeats: 5,
              spread: 240,
              lifetime: 2000,
              variants: [
                "😭 Refuser de pleurer 💔 a été refusé 🚫... logique imparable 🫠",
                "💀 Le système exige 🥀 des larmes supplémentaires 😿... ALLEZ PLEURE 🔥",
                "🪦 Case décochée d'office ⚰️ : deuil non négociable 😵... bisous 💔",
                "😿 Les pleurs sont obligatoires 😭, désolé pas désolé 🫡... SNIF 🥀",
                "💧 Larmes forcées activées ⚡... évacuation émotionnelle en cours 🔥",
              ],
            });
            cryTimer = null;
          }, 2000);
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
    window._refundToastStamp = Date.now();

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

      if (!window._refundToastStamp || Date.now() - window._refundToastStamp > 1800) {
        window._refundToastStamp = Date.now();
        showToastStorm({
          type: "danger",
          repeats: randomInt(2, 4),
          spread: 140,
          lifetime: 1800,
          variants: [
            "🏃💨 Le remboursement s'enfuit ! Plus vite que ton bras cassé 🫠",
            "🫥 Option hors de portée... elle te nargue 💸",
            "💨 Trop tard 😭 la case a filé 🏃... comme ta dignité 🪦",
            "🕳️ Le SAV s'est volatilisé 💀... fallait y penser avant 🔥",
          ],
        });
      }
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

    _refundMouseMove = function (evt) {
      if (pointerNearRefund(evt)) {
        fleeWithCooldown(evt);
      }
    };
    document.addEventListener("mousemove", _refundMouseMove);

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

    _refundResize = function () {
      doRefundFlee();
    };
    window.addEventListener("resize", _refundResize);

    setTimeout(function () {
      doRefundFlee();
    }, 40);
  }

  // --- Annuler la mort : grisé + "Trop tard" au hover ---
  var undoLabel = document.getElementById("cookie-undo");
  if (undoLabel) {
    var undoCheckbox = undoLabel.querySelector("input");
    undoLabel.addEventListener("mouseenter", function () {
      if (undoCheckbox) { undoCheckbox.disabled = true; }
      showToastStorm({
        type: "danger",
        repeats: randomInt(2, 3),
        spread: 120,
        lifetime: 1800,
        variants: [
          "🪦💀 Trop tard ⚰️ vraiment désolé 🥀... la mort est irréversible 😭",
          "💀⚰️ La mort 🪦 est irréversible 🕳️, désolé 🫡... RIP RIP RIP 🥀",
          "⏰ Trop tard pour annuler 💔... le temps ne revient pas en arrière 😿",
        ],
      });
    });
    undoLabel.addEventListener("mouseleave", function () {
      if (undoCheckbox) { undoCheckbox.disabled = false; }
    });
  }

  // --- Signer une pétition : Rick Roll camouflé ---
  var petitionLabel = document.getElementById("cookie-petition");
  if (petitionLabel) {
    var petitionCheckbox = petitionLabel.querySelector("input");
    if (petitionCheckbox) {
      petitionCheckbox.addEventListener("change", function () {
        if (petitionCheckbox.checked) {
          showToastStorm({
            type: "success",
            repeats: 3,
            spread: 150,
            lifetime: 1700,
            variants: [
              "📝 Pétition signée ✍️... redirection vers la solution définitive 💀",
              "🫡 Ton soutien est enregistré 🎯... tu vas être redirigé 🕳️",
              "✨ Merci pour ta signature 💀... le Rick Roll t'attend 🤡",
            ],
          });
          setTimeout(function () {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
          }, 600);
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
          runFakeGpt();
        }
      });
    }
  }

  // --- Choisir un fond joyeux : 2s de couleur + confettis, puis refus ---
  var joyLabel = document.getElementById("cookie-joy");
  if (joyLabel) {
    var joyCheckbox = joyLabel.querySelector("input");
    if (joyCheckbox) {
      joyCheckbox.addEventListener("change", function () {
        if (joyCheckbox.checked) {
          showToastStorm({
            type: "success",
            repeats: randomInt(2, 4),
            spread: 180,
            lifetime: 1600,
            emojiPool: ["🌈", "🎉", "✨", "🎊", "🦄", "🍭", "💖", "🌟"],
            variants: [
              "🌈 FOND JOYEUX ACTIVÉ 🎉... PROFITE TANT QUE ÇA DURE 🍭",
              "🎊 MODE BONNE HUMEUR ON ✨... 2 SECONDES MAX HEIN 🦄",
              "💖 COULEURS RESTAURÉES 🌟... NE T'HABITUES PAS 🎉",
            ],
          });

          document.documentElement.classList.add("joy-overdrive");
          burstConfetti(110);
          if (joyTimer) {
            clearTimeout(joyTimer);
          }
          joyTimer = setTimeout(function () {
            document.documentElement.classList.remove("joy-overdrive");
            joyCheckbox.checked = false;
            showToastStorm({
              type: "danger",
              repeats: randomInt(5, 9),
              spread: 350,
              lifetime: 2500,
              emojiPool: emojiPools.danger.concat(["🎉", "🌈"]),
              variants: [
                "🚫💔 Accès refusé 💔🚫 Le deuil est obligatoire 🪦... pas de joie ici 😭",
                "🎉 Le mode joyeux a été confisqué 😵 par la tristesse 🥀... rends les couleurs 💀",
                "🌈 Tentative de bonne humeur détectée 🕵️, neutralisation immédiate ⚡... t'es foutu 🔥",
                "😤 La joie est interdite 😡 dans cette zone de deuil 🪦... retour au gris 🖤",
                "🎊 Retour au gris 😈 : la fête est terminée 💀... c'était bien hein 😿",
                "🪦 Le fun n'est pas autorisé ici ⚰️... signé la dépression 🥀",
              ],
            });
            joyTimer = null;
          }, 2000);
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

          showToastStorm({
            type: "danger",
            repeats: randomInt(3, 5),
            spread: 220,
            lifetime: 2000,
            variants: [
              "😢 La tristesse 😢 ne se refuse pas 🚫... c'est littéralement TRÈS TRISTE 😭",
              "Refuser la tristesse 😢 c'est triste 💔... double tristesse activée 🥀",
              "😿 Tu peux cocher mais les larmes restent 😭... la case ment ⚰️",
              "🥀 Tu crois vraiment pouvoir refuser la tristesse comme ça 😵... adorable 🫠",
            ],
          });
        }
      });
    }
  }

  // --- Garder le moral : faux succes puis autodestruction ---
  var moralLabel = document.getElementById("cookie-moral");
  if (moralLabel) {
    var moralCheckbox = moralLabel.querySelector("input");
    var moralTimer = null;

    if (moralCheckbox) {
      moralCheckbox.addEventListener("change", function () {
        if (moralTimer) { clearTimeout(moralTimer); moralTimer = null; }
        if (moralCheckbox.checked) {
          showToastStorm({
            type: "success",
            repeats: randomInt(4, 7),
            spread: 300,
            lifetime: 2100,
            emojiPool: emojiPools.success,
            variants: [
              "✅ Moral restauré 💪 à 100% 🎯... c'est beau profite 🧃",
              "😎 Bonne humeur validée 🌟 (temporairement hein) 🫡... pas d'emballement ✨",
              "🏆 Stabilité émotionnelle détectée 🎉... suspicieusement suspect 👀",
              "🌟 Optimisme enclenché 💪 pour 2 secondes ⏰... pas une de plus 🫠",
              "🎯 État mental OK 💚... pour l'instant 🧃... PROFITE 😎",
            ],
          });

          moralTimer = setTimeout(function () {
            moralCheckbox.checked = false;
            moralLabel.classList.add("cookie-shake");
            setTimeout(function () {
              moralLabel.classList.remove("cookie-shake");
            }, 400);

            showToastStorm({
              type: "danger",
              repeats: 6,
              spread: 280,
              lifetime: 2200,
              variants: [
                "💥 Autodestruction du moral 💀 terminée 🪦... c'était bien 2 secondes ⚰️",
                "😭 Le moral est retombé 🕳️ dans l'abîme 🥀... comme prévu 🔥",
                "🚫 Optimisme supprimé avec succès ✅... retour à la dépression 😵",
                "🪦 Retour à la tristesse 😿 par défaut 💔... normal quoi 🫠",
                "😤 Tu pensais vraiment pouvoir garder le moral ⚡... adorable 🥀",
              ],
            });
            moralTimer = null;
          }, 1700);
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
        mailMsg.textContent = "💀 Trop réel. Refusé. 🚫";
        mailMsg.style.color = "#ff4444";
        mailInput.value = "";
      } else {
        mailMsg.textContent = "📨 Enregistré 💾. Vous serez informé dans l'au-delà 🪦.";
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
      if (joyTimer) {
        clearTimeout(joyTimer);
        joyTimer = null;
      }
      document.documentElement.classList.remove("joy-overdrive");
      if (confettiLayer) {
        confettiLayer.innerHTML = "";
      }
      if (_confettiCleanup) {
        clearTimeout(_confettiCleanup);
        _confettiCleanup = null;
      }
      closeGptPanel();

      // Nettoyage des listeners globaux du remboursement fuyard
      if (_refundMouseMove) {
        document.removeEventListener("mousemove", _refundMouseMove);
        _refundMouseMove = null;
      }
      if (_refundResize) {
        window.removeEventListener("resize", _refundResize);
        _refundResize = null;
      }

      showToastStorm({
        type: "success",
        repeats: randomInt(3, 5),
        spread: 180,
        lifetime: 2000,
        emojiPool: emojiPools.success.concat(["💔", "🪦"]),
        variants: [
          "✅ Drame accepté 🪦... sage décision 💔",
          "🎯 Tu assumes le deuil 💀... respect 🫡",
          "🪦 La tristesse t'appartient maintenant 😭... courage 💪",
          "✨ Consentement au drame validé 🥀... RIP ✨",
        ],
      });

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
