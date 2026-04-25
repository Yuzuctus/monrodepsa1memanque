/* ==========================================================================
   BSOD — Fake repair attempt popup + system error messages
   ========================================================================== */

// Shared state
window.terminalOpen = false;
var bsodTimer = null;

// Error messages displayed after the fake progress fails
var erreurs = [
  {
    header: "RODE_PSA1.SYS - ERREUR FATALE",
    body: "Le pilote du bras de micro a cessé de fonctionner.\nCode erreur: 0xDEAD_BRAS\nAdresse: 0x00000000\n\nAppuyez sur cette fenêtre pour fermer.",
  },
  {
    header: "KERNEL PANIC",
    body: "panic(cpu 0): RodePSA1_unmount failed\n\nDebugger called: <panic>\nBacktrace:\n 0xffffff8000a1b2c3: bras_died+0x42\n 0xffffff8000a1b456: mic_float+0x13\n\nSystem halted.",
  },
  {
    header: "SEGFAULT",
    body: 'Segmentation fault (core dumped)\n\nThread 1 "RodePSA1" received signal SIGSEGV.\n0x00007f8a2c3d1e in bras_support () from /lib/libtristesse.so\n\n(gdb) bt\n#0  0x00007f8a2c3d1e in bras_support ()\n#1  0x0000000000000000 in ?? ()\n\nNo stack. Le bras est littéralement tombé dans le vide.',
  },
  {
    header: "BSOD - BRAS_SYSTEM_FAILURE",
    body: "*** STOP: 0x000000BRAS (0xR0DE_PSA1, 0x00000000)\n\nLe système a détecté une absence critique de matériel.\n\nSi c'est la première fois que vous voyez cet écran,\nc'est que votre Rode PSA1 est bel et bien mort.\n\n*** RODE_PSA1.SYS - Address F7B8A2C3 base at F7B8A000",
  },
  {
    header: "ERREUR 404",
    body: "GET /bras-de-micro HTTP/1.1\nHost: bureau.local\n\nHTTP/1.1 404 Not Found\nContent-Type: text/tristesse\n\nLe bras de micro demandé est introuvable sur ce bureau.\nVérifiez l'URL ou achetez-en un nouveau.\n\nConsole: > ping RodePSA1\nPING RodePSA1.local: 56 data bytes\nRequest timeout.\nRequest timeout.\nRequest timeout.\n\n--- RodePSA1 ping statistics ---\n3 packets transmitted, 0 received, 100% packet loss",
  },
  {
    header: "NULL POINTER EXCEPTION",
    body: "java.lang.NullPointerException\n    at Bureau.microSupport(Bureau.java:42)\n    at Setup.getBras(Setup.java:13)\n    at Audio.record(Audio.java:7)\n\nCause : Le micro flotte dans le vide. Aucun support détecté.\nRésolution : Acheter un nouveau Rode PSA1.\n\n(Le garbage collector ne peut rien pour toi.)",
  },
  {
    header: "STACK OVERFLOW",
    body: "Fatal error: Allowed memory size exhausted.\n\nStack trace:\n#0 tristesse() called at line 1\n#1 tristesse() called at line 1\n#2 tristesse() called at line 1\n...\n#413612 tristesse() called at line 1\n\nMaximum tristesse depth exceeded.",
  },
  {
    header: "CONNEXION PERDUE",
    body: 'ssh bureau.local -p 22\nConnected to bureau.local.\nLast login: Thu Apr 23 19:53:42 2026\n\n$ systemctl status rodepsa1\n● rodepsa1.service - Rode PSA1 Microphone Arm\n   Loaded: loaded (/etc/systemd/system/rodepsa1.service)\n   Active: failed (Result: core-dump) since Thu 2026-04-23 19:54:00 CEST\n\n$ systemctl restart rodepsa1\nJob for rodepsa1.service failed.\nSee "systemctl status rodepsa1.service" and "journalctl -xe" for details.\n\nConnection to bureau.local closed.',
  },
];

// ---------- Start the repair attempt (opens BSOD popup) ----------

function tenterReparation() {
  if (window.terminalOpen) return;
  window.terminalOpen = true;

  document.getElementById("bsod-overlay").style.display = "block";
  document.getElementById("bsod-popup").style.display = "block";

  var fill = document.getElementById("bsod-progress-fill");
  var label = document.getElementById("bsod-progress-label");
  fill.style.width = "0%";
        label.textContent = "0% terminé";

  // Reset popup to initial progress state (in case it was previously showing an error)
  document.getElementById("bsod-progress-label").style.display = "";
  document.querySelector("#bsod-popup .bsod-progress-bar").style.display = "";

  animateBSODProgress(67);
}

// ---------- Fake progress bar that always fails after 3 attempts ----------

function animateBSODProgress(target) {
  var fill = document.getElementById("bsod-progress-fill");
  var label = document.getElementById("bsod-progress-label");
  var current = 0;
  var loops = 0;
  var btn = document.querySelector("#bsod-popup .bsod-btn");
  btn.textContent = "FERMER";
  btn.onclick = bsodRetry;

  function step() {
    if (!window.terminalOpen) return;
    if (current < target) {
      var inc = Math.random() * 6 + 1.5;
      current = Math.min(current + inc, target);
      fill.style.width = current + "%";
      label.textContent = Math.floor(current) + "% terminé";
      bsodTimer = setTimeout(step, Math.random() * 180 + 40);
    } else if (loops < 2) {
      label.textContent = target + "% terminé — ÉCHEC, nouvel essai...";
      bsodTimer = setTimeout(function () {
        current = 0;
        loops++;
        fill.style.width = "0%";
  label.textContent = "0% terminé";
        step();
      }, 800);
    } else {
      label.textContent = target + "% terminé — ÉCHEC";
      btn.textContent = "ABANDON";
      btn.onclick = closeBSOD;
      bsodTimer = setTimeout(closeBSOD, 3000);
    }
  }
  step();
}

// ---------- Second fake progress bar (on "FERMER" click during first attempt) ----------

function bsodRetry() {
  var fill = document.getElementById("bsod-progress-fill");
  var label = document.getElementById("bsod-progress-label");
  var btn = document.querySelector("#bsod-popup .bsod-btn");

  fill.style.width = "0%";
  btn.textContent = "FERMETURE EN COURS...";
  label.textContent = "0% fermeture";

  var target = 69;
  var current = 0;
  var loops = 0;

  function step() {
    if (!window.terminalOpen) return;
    if (current < target) {
      var inc = Math.random() * 5 + 1;
      current = Math.min(current + inc, target);
      fill.style.width = current + "%";
      label.textContent = Math.floor(current) + "% fermeture";
      bsodTimer = setTimeout(step, Math.random() * 200 + 60);
    } else if (loops < 2) {
      label.textContent = target + "% fermeture — ÉCHEC, nouvel essai...";
      bsodTimer = setTimeout(function () {
        current = 0;
        loops++;
        fill.style.width = "0%";
        label.textContent = "0% fermeture";
        step();
      }, 800);
    } else {
      label.textContent = target + "% fermeture — ÉCHEC";
      btn.textContent = "FERMER DE FORCE";
      btn.onclick = closeBSOD;
      bsodTimer = setTimeout(closeBSOD, 3000);
    }
  }
  step();
}

// ---------- Replace BSOD content with a random error from erreurs[] ----------

function showBSODError() {
  var err = erreurs[Math.floor(Math.random() * erreurs.length)];
  var popup = document.getElementById("bsod-popup");
  popup.querySelector(".bsod-face").textContent = ":(";
  popup.querySelector(".bsod-title").textContent = err.header;
  popup.querySelector(".bsod-body").innerHTML = err.body.replace(/\n/g, "<br>");
  document.getElementById("bsod-progress-label").style.display = "none";
  document.querySelector("#bsod-popup .bsod-progress-bar").style.display = "none";
  popup.querySelector(".bsod-qr").innerHTML =
    '💡 Oh vous avez cassé, il lui en faut un autre :<br>rode.com/psa1 (@Yuzuctus sur discord)';
  var btn = popup.querySelector(".bsod-btn");
  btn.textContent = "FERMER";
  btn.onclick = closeAll;
}

// ---------- Close BSOD and show error ----------

function closeBSOD() {
  clearTimeout(bsodTimer);
  showBSODError();
}

// ---------- Fully close the BSOD popup ----------

function closeAll() {
  window.terminalOpen = false;
  clearTimeout(bsodTimer);
  document.getElementById("bsod-popup").style.display = "none";
  document.getElementById("bsod-overlay").style.display = "none";
}

// ---------- Event bindings ----------

function initBSOD() {
  document
    .getElementById("bsod-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) closeBSOD();
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && window.terminalOpen) {
      closeAll();
    }
  });

  // Bind the repair button
  document
    .querySelector(".repair-btn")
    .addEventListener("click", tenterReparation);
}
