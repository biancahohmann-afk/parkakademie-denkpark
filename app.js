"use strict";

// Each level changes the search target and requires a little more observation.
const LEVELS = [
  {
    name: "Der erste Spaziergang",
    title: "Entdecken Sie die Eichhörnchen",
    description: "Am Wegesrand haben sich fünf Eichhörnchen versteckt. Suchen Sie die ganze Aussicht aufmerksam ab und tippen Sie die Tiere an. Nehmen Sie sich Zeit – es gibt keinen Timer.",
    target: "squirrel",
    targetLabel: "Eichhörnchen",
    count: 5,
    positions: [[48, 43], [62, 58], [77, 42], [86, 69], [55, 78], [35, 54], [72, 81]],
  },
  {
    name: "Die Spur der Eicheln",
    title: "Folgen Sie der kleinen Spur",
    description: "Nun sind sechs Eicheln im Park zu entdecken. Einige liegen näher am Weg, andere sind zwischen Blättern und Wurzeln verborgen. Prüfen Sie die ganze Szene – ohne Eile.",
    target: "acorn",
    targetLabel: "Eichel",
    count: 6,
    positions: [[39, 68], [53, 56], [70, 72], [83, 52], [59, 82], [32, 45], [75, 38], [46, 83]],
  },
  {
    name: "Vögel im Abendlicht",
    title: "Beobachten Sie die Vögel",
    description: "Zum Abschluss sind sieben Vögel im Park zu finden. Sie sitzen höher und verteilen sich über die gesamte Aussicht. Lassen Sie den Blick von den Baumkronen bis zum Weg schweifen.",
    target: "bird",
    targetLabel: "Vogel",
    count: 7,
    positions: [[28, 33], [44, 44], [61, 31], [78, 42], [88, 57], [68, 65], [48, 73], [34, 61], [82, 78]],
  },
];

const parkView = document.getElementById("parkView");
const targetLayer = document.getElementById("targetLayer");
const score = document.getElementById("score");
const progressText = document.getElementById("progressText");
const levelProgressText = document.getElementById("levelProgressText");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.querySelector(".progress-track");
const status = document.getElementById("status");
const resultOverlay = document.getElementById("resultOverlay");
const resultKicker = document.getElementById("resultKicker");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultBreakdown = document.getElementById("resultBreakdown");
const continueBtn = document.getElementById("continueBtn");
const replayBtn = document.getElementById("replayBtn");

let levelIndex = 0;
let found = 0;
let levelScores = LEVELS.map(() => 0);
let resultTimer = null;

const SQUIRREL_SVG = `<svg viewBox="0 0 64 76" aria-hidden="true" focusable="false"><path class="target-body" d="M22 51C8 49 4 38 10 27c4-8 13-9 17-3-7-1-10 5-7 10 3 4 9 4 13 0 1-7-2-15 3-22 4-6 12-8 18-3-5-1-9 2-9 6 0 3 3 5 6 5 7 0 12 6 12 15 0 6-2 10-6 14 2 7 6 12 5 19H22c3-5 5-11 0-17Z"/><path class="target-belly" d="M34 43c7-3 15 1 17 8 2 5 0 11-2 17H31c4-7 6-17 3-25Z"/><path class="target-body" d="M31 29c0-9 7-15 16-14 8 1 12 7 11 15-1 7-7 11-16 10-7-1-11-5-11-11Z"/><path class="target-body" d="M36 19c-4-7-2-13 3-15 5 0 7 5 7 11m4 2c1-8 5-11 9-8 3 4 1 9-2 13"/><path class="target-belly" d="M43 32c4-3 9-2 11 1 1 3-2 5-6 5-3 0-6-2-5-6Z"/><circle class="target-eye" cx="51" cy="26" r="1.7"/></svg>`;

function renderLevel() {
  clearTimeout(resultTimer);
  resultOverlay.hidden = true;
  const level = LEVELS[levelIndex];
  found = 0;
  parkView.dataset.level = String(levelIndex + 1);
  parkView.style.setProperty("--journey", ["54%", "62%", "70%"][levelIndex]);
  document.getElementById("levelMarker").textContent = `LEVEL ${levelIndex + 1}`;
  document.getElementById("levelName").textContent = level.name;
  document.getElementById("taskTitle").textContent = level.title;
  document.getElementById("taskDescription").textContent = level.description;
  score.innerHTML = `0 <span>von ${level.count}</span>`;
  progressText.textContent = `Gefunden: 0 von ${level.count}`;
  levelProgressText.textContent = `Aufgabe ${levelIndex + 1} von ${LEVELS.length}`;
  progressTrack.setAttribute("aria-valuemax", String(level.count));
  progressTrack.setAttribute("aria-valuenow", "0");
  progressBar.style.width = "0%";
  status.textContent = "Nehmen Sie sich Zeit und erkunden Sie den Park.";
  targetLayer.replaceChildren();

  const positions = shuffle(level.positions).slice(0, level.count);
  positions.forEach(([left, top], index) => {
    const target = document.createElement("button");
    target.type = "button";
    target.className = `park-target target-${level.target}`;
    target.style.left = `${left}%`;
    target.style.top = `${top}%`;
    target.setAttribute("aria-label", `${level.targetLabel} ${index + 1} finden`);
    target.innerHTML = level.target === "squirrel" ? SQUIRREL_SVG : level.target === "acorn" ? '<span class="target-acorn" aria-hidden="true">🌰</span>' : '<span class="target-bird" aria-hidden="true">🐦</span>';
    target.addEventListener("click", () => collectTarget(target));
    targetLayer.appendChild(target);
  });
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function collectTarget(target) {
  if (target.disabled || resultOverlay.hidden === false) return;
  target.disabled = true;
  target.classList.add("collected");
  found += 1;
  const level = LEVELS[levelIndex];
  score.innerHTML = `${found} <span>von ${level.count}</span>`;
  progressText.textContent = `Gefunden: ${found} von ${level.count}`;
  progressTrack.setAttribute("aria-valuenow", String(found));
  progressBar.style.width = `${(found / level.count) * 100}%`;

  if (found === level.count) {
    levelScores[levelIndex] = found;
    status.textContent = `Alle ${level.count} ${pluralTarget(level)} entdeckt. Ausgezeichnet beobachtet!`;
    resultTimer = window.setTimeout(showLevelResult, 650);
  } else {
    status.textContent = `Gut entdeckt. Noch ${level.count - found} ${level.targetLabel.toLowerCase()}${level.count - found === 1 ? "" : level.target === "squirrel" ? "chen" : "e"} sind zu finden.`;
  }
}

function pluralTarget(level) {
  if (level.target === "squirrel") return "Eichhörnchen";
  if (level.target === "acorn") return "Eicheln";
  return "Vögel";
}

function showLevelResult() {
  const level = LEVELS[levelIndex];
  const isFinal = levelIndex === LEVELS.length - 1;
  resultKicker.textContent = isFinal ? "DenkPark-Rundgang beendet" : `Level ${levelIndex + 1} abgeschlossen`;
  resultTitle.textContent = isFinal ? "Ein ausgezeichneter Rundgang" : "Gut beobachtet!";
  resultMessage.textContent = isFinal
    ? `Sie haben alle drei Aufgaben gemeistert und ${levelScores.reduce((sum, value) => sum + value, 0)} Fundstücke entdeckt.`
    : `Sie haben ${levelScores[levelIndex]} von ${level.count} ${pluralTarget(level)} entdeckt. Bereit für den nächsten Abschnitt des Spaziergangs?`;
  resultBreakdown.replaceChildren();

  LEVELS.slice(0, isFinal ? LEVELS.length : levelIndex + 1).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "result-row";
    const label = document.createElement("span");
    label.textContent = `Level ${index + 1}: ${item.name}`;
    const value = document.createElement("strong");
    value.textContent = `${levelScores[index]} / ${item.count}`;
    row.append(label, value);
    resultBreakdown.appendChild(row);
  });

  if (isFinal) {
    const total = document.createElement("div");
    total.className = "result-row result-total";
    total.innerHTML = `<span>Gesamtpunktzahl</span><strong>${levelScores.reduce((sum, value) => sum + value, 0)} von ${LEVELS.reduce((sum, item) => sum + item.count, 0)}</strong>`;
    resultBreakdown.appendChild(total);
  }

  continueBtn.textContent = isFinal ? "Rundgang noch einmal" : "Weitergehen";
  replayBtn.hidden = isFinal;
  resultOverlay.hidden = false;
  continueBtn.focus();
}

function restartCampaign() {
  levelIndex = 0;
  levelScores = LEVELS.map(() => 0);
  renderLevel();
}

function continueJourney() {
  if (levelIndex === LEVELS.length - 1) {
    restartCampaign();
    return;
  }
  levelIndex += 1;
  renderLevel();
  document.getElementById("parkView").scrollIntoView({ behavior: "smooth", block: "start" });
}

function replayLevel() {
  levelScores[levelIndex] = 0;
  renderLevel();
}

document.getElementById("restartBtn").addEventListener("click", restartCampaign);
continueBtn.addEventListener("click", continueJourney);
replayBtn.addEventListener("click", replayLevel);

// Subtle camera parallax makes the photographic scene feel like a viewpoint,
// while keeping controls stationary, large and usable on touch screens.
parkView.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const bounds = parkView.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  parkView.style.setProperty("--camera-x", `${-x * 9}px`);
  parkView.style.setProperty("--camera-y", `${-y * 6}px`);
});
parkView.addEventListener("pointerleave", () => {
  parkView.style.setProperty("--camera-x", "0px");
  parkView.style.setProperty("--camera-y", "0px");
});
renderLevel();
