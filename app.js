"use strict";

const TOTAL_SQUIRRELS = 5;
const POSITIONS = [
  { left: 47, top: 43 },
  { left: 62, top: 59 },
  { left: 76, top: 40 },
  { left: 86, top: 68 },
  { left: 56, top: 77 },
];

const squirrelLayer = document.getElementById("squirrelLayer");
const score = document.getElementById("score");
const status = document.getElementById("status");
const successOverlay = document.getElementById("successOverlay");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
let found = 0;

const squirrelArtwork = `
  <svg viewBox="0 0 64 76" aria-hidden="true" focusable="false">
    <path class="fur" d="M22 51C8 49 4 38 10 27c4-8 13-9 17-3-7-1-10 5-7 10 3 4 9 4 13 0 1-7-2-15 3-22 4-6 12-8 18-3-5-1-9 2-9 6 0 3 3 5 6 5 7 0 12 6 12 15 0 6-2 10-6 14 2 7 6 12 5 19H22c3-5 5-11 0-17Z"/>
    <path class="belly" d="M34 43c7-3 15 1 17 8 2 5 0 11-2 17H31c4-7 6-17 3-25Z"/>
    <path class="fur" d="M31 65c-5 2-10 2-14 0-2-1-2-4 0-5 5-2 10-1 15 1m21 0c5-2 9-2 12 0 2 2 1 4-1 5-4 1-8 1-12-1"/>
    <path class="fur" d="M31 29c0-9 7-15 16-14 8 1 12 7 11 15-1 7-7 11-16 10-7-1-11-5-11-11Z"/>
    <path class="fur" d="M36 19c-4-7-2-13 3-15 5 0 7 5 7 11m4 2c1-8 5-11 9-8 3 4 1 9-2 13"/>
    <path class="belly" d="M43 32c4-3 9-2 11 1 1 3-2 5-6 5-3 0-6-2-5-6Z"/>
    <circle class="eye" cx="51" cy="26" r="1.7"/>
    <path d="M54 33l4 1-3 2" fill="none" stroke="#241a13" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

function renderGame() {
  found = 0;
  score.innerHTML = `0 <span>von ${TOTAL_SQUIRRELS}</span>`;
  status.textContent = "Nehmen Sie sich Zeit und erkunden Sie den Park.";
  successOverlay.hidden = true;
  squirrelLayer.replaceChildren();

  POSITIONS.forEach((position, index) => {
    const squirrel = document.createElement("button");
    squirrel.type = "button";
    squirrel.className = "squirrel";
    squirrel.style.left = `${position.left}%`;
    squirrel.style.top = `${position.top}%`;
    squirrel.setAttribute("aria-label", `Verstecktes Eichhörnchen ${index + 1} einsammeln`);
    squirrel.innerHTML = squirrelArtwork;
    squirrel.addEventListener("click", () => collectSquirrel(squirrel));
    squirrelLayer.appendChild(squirrel);
  });
}

function collectSquirrel(squirrel) {
  if (squirrel.disabled) return;
  squirrel.disabled = true;
  squirrel.classList.add("collected");
  found += 1;
  score.innerHTML = `${found} <span>von ${TOTAL_SQUIRRELS}</span>`;

  if (found === TOTAL_SQUIRRELS) {
    status.textContent = "Alle fünf Eichhörnchen sind entdeckt. Gut beobachtet!";
    window.setTimeout(() => {
      successOverlay.hidden = false;
      playAgainBtn.focus();
    }, 500);
  } else {
    status.textContent = found === 1
      ? "Ein Eichhörnchen entdeckt. Schauen Sie in Ruhe weiter."
      : `${found} Eichhörnchen entdeckt. Noch ${TOTAL_SQUIRRELS - found} sind im Park.`;
  }
}

restartBtn.addEventListener("click", renderGame);
playAgainBtn.addEventListener("click", renderGame);
renderGame();
