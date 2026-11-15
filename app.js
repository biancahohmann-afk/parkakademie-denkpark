"use strict";

const TOTAL_SQUIRRELS = 5;
const POSITIONS = [
  { left: 20, top: 40 },
  { left: 42, top: 68 },
  { left: 62, top: 52 },
  { left: 79, top: 71 },
  { left: 56, top: 84 },
];

const squirrelLayer = document.getElementById("squirrelLayer");
const score = document.getElementById("score");
const status = document.getElementById("status");
const successOverlay = document.getElementById("successOverlay");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

let found = 0;

function renderGame() {
  found = 0;
  score.textContent = `0 von ${TOTAL_SQUIRRELS}`;
  status.textContent = "Entdecke die Eichhörnchen im Park.";
  successOverlay.hidden = true;
  squirrelLayer.replaceChildren();

  POSITIONS.forEach((position, index) => {
    const squirrel = document.createElement("button");
    squirrel.type = "button";
    squirrel.className = "squirrel";
    squirrel.style.left = `${position.left}%`;
    squirrel.style.top = `${position.top}%`;
    squirrel.setAttribute("aria-label", `Eichhörnchen ${index + 1} entdecken`);
    squirrel.innerHTML = `
      <span class="tail" aria-hidden="true"></span>
      <span class="body" aria-hidden="true"></span>
      <span class="head" aria-hidden="true"></span>
      <span class="face" aria-hidden="true"></span>
      <span class="muzzle" aria-hidden="true"></span>
      <span class="acorn" aria-hidden="true">🌰</span>
    `;

    squirrel.addEventListener("click", () => collectSquirrel(squirrel));
    squirrelLayer.appendChild(squirrel);
  });
}

function collectSquirrel(squirrel) {
  if (squirrel.disabled) {
    return;
  }

  squirrel.disabled = true;
  squirrel.classList.add("collected");
  found += 1;
  score.textContent = `${found} von ${TOTAL_SQUIRRELS}`;

  if (found === TOTAL_SQUIRRELS) {
    status.textContent = "Alle Eichhörnchen gefunden – fantastisch!";
    window.setTimeout(() => {
      successOverlay.hidden = false;
      playAgainBtn.focus();
    }, 500);
    return;
  }

  status.textContent =
    found === 1
      ? "Ein Eichhörnchen gefunden. Schau dich noch ruhig um."
      : `${found} Eichhörnchen gefunden. Noch ${TOTAL_SQUIRRELS - found} bleiben versteckt.`;
}

restartBtn.addEventListener("click", renderGame);
playAgainBtn.addEventListener("click", renderGame);
renderGame();
