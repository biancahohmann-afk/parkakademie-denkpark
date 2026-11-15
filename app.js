"use strict";

const LEVELS = [
  { name: "Der erste Spaziergang", title: "Entdecken Sie die Eichhörnchen", target: "squirrel", label: "Eichhörnchen", count: 5, description: "Am Wegesrand zeigen sich nach und nach fünf Eichhörnchen. Beobachten Sie die Szene aufmerksam und wählen Sie jedes Tier aus.", positions: [[47,42],[61,58],[77,39],[86,69],[55,78],[35,54],[71,82]] },
  { name: "Die Spur der Eicheln", title: "Folgen Sie der kleinen Spur", target: "acorn", label: "Eichel", count: 6, description: "Im nächsten Abschnitt erscheinen sechs Eicheln. Einige liegen näher am Weg, andere sind zwischen Blättern und Wurzeln verborgen.", positions: [[39,68],[53,56],[70,72],[83,52],[59,82],[32,45],[75,38],[46,83]] },
  { name: "Vögel im Abendlicht", title: "Beobachten Sie die Vögel", target: "bird", label: "Vogel", count: 7, description: "Zum Abschluss suchen Sie sieben Vögel. Lassen Sie den Blick von den Baumkronen bis zum Weg schweifen.", positions: [[28,33],[44,44],[61,31],[78,42],[88,57],[68,65],[48,73],[34,61],[82,78]] },
];
const $ = (id) => document.getElementById(id);
const parkView = $("parkView"), targetLayer = $("targetLayer"), resultOverlay = $("resultOverlay");
let levelIndex = 0, found = 0, levelScores = LEVELS.map(() => 0), resultTimer;

const squirrelSvg = '<svg viewBox="0 0 64 76" aria-hidden="true"><path class="target-body" d="M22 51C8 49 4 38 10 27c4-8 13-9 17-3-7-1-10 5-7 10 3 4 9 4 13 0 1-7-2-15 3-22 4-6 12-8 18-3-5-1-9 2-9 6 0 3 3 5 6 5 7 0 12 6 12 15 0 6-2 10-6 14 2 7 6 12 5 19H22c3-5 5-11 0-17Z"/><path class="target-belly" d="M34 43c7-3 15 1 17 8 2 5 0 11-2 17H31c4-7 6-17 3-25Z"/><path class="target-body" d="M31 29c0-9 7-15 16-14 8 1 12 7 11 15-1 7-7 11-16 10-7-1-11-5-11-11Z"/><circle class="target-eye" cx="51" cy="26" r="1.7"/></svg>';

function renderLevel() {
  clearTimeout(resultTimer); resultOverlay.hidden = true; found = 0;
  const level = LEVELS[levelIndex];
  parkView.dataset.level = String(levelIndex + 1);
  $("levelMarker").textContent = `LEVEL ${levelIndex + 1}`;
  $("levelName").textContent = level.name;
  $("taskTitle").textContent = level.title;
  $("taskDescription").textContent = level.description;
  $("progressText").textContent = `Gefunden: 0 von ${level.count}`;
  $("levelProgressText").textContent = `Aufgabe ${levelIndex + 1} von ${LEVELS.length}`;
  $("progressBar").style.width = "0%";
  const bar = document.querySelector(".progress-track");
  bar.setAttribute("aria-valuemax", level.count); bar.setAttribute("aria-valuenow", 0);
  $("status").textContent = "Der Spaziergang geht weiter. Achten Sie auf Bewegung am Wegesrand.";
  targetLayer.replaceChildren();
  const positions = shuffle(level.positions).slice(0, level.count);
  positions.forEach(([left, top], index) => {
    const target = document.createElement("button");
    target.type = "button"; target.className = `park-target target-${level.target}`;
    target.style.left = `${left}%`; target.style.top = `${top}%`;
    target.style.setProperty("--reveal-delay", `${0.35 + index * 0.48}s`);
    target.setAttribute("aria-label", `${level.label} ${index + 1} entdecken`);
    target.innerHTML = level.target === "squirrel" ? squirrelSvg : level.target === "acorn" ? '<span class="target-acorn" aria-hidden="true">🌰</span>' : '<span class="target-bird" aria-hidden="true">🐦</span>';
    target.addEventListener("click", () => collect(target)); targetLayer.appendChild(target);
  });
}
function shuffle(items) { const result = [...items]; for (let i=result.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; } return result; }
function collect(target) {
  if (target.disabled || !resultOverlay.hidden) return;
  target.disabled = true; target.classList.add("collected"); found++;
  const level = LEVELS[levelIndex];
  $("progressText").textContent = `Gefunden: ${found} von ${level.count}`;
  $("progressBar").style.width = `${found / level.count * 100}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", found);
  $("status").textContent = found === level.count ? "Alle gefunden – ausgezeichnet beobachtet!" : `Gut entdeckt. Noch ${level.count - found} ${level.label.toLowerCase()}${level.target === "squirrel" ? "chen" : level.count - found === 1 ? "" : "n"} warten im Park.`;
  if (found === level.count) { levelScores[levelIndex] = found; resultTimer = setTimeout(showResult, 750); }
}
function showResult() {
  const finalLevel = levelIndex === LEVELS.length - 1;
  $("resultKicker").textContent = finalLevel ? "Rundgang beendet" : `Level ${levelIndex + 1} abgeschlossen`;
  $("resultTitle").textContent = finalLevel ? "Ein ausgezeichneter Rundgang" : "Gut beobachtet!";
  $("resultMessage").textContent = finalLevel ? `Sie haben alle drei Aufgaben gemeistert und insgesamt ${levelScores.reduce((a,b)=>a+b,0)} Fundstücke entdeckt.` : `Sie haben alle ${levelScores[levelIndex]} ${plural(LEVELS[levelIndex])} entdeckt. Bereit für den nächsten Abschnitt?`;
  const breakdown = $("resultBreakdown"); breakdown.replaceChildren();
  LEVELS.slice(0, finalLevel ? LEVELS.length : levelIndex + 1).forEach((item, i) => {
    const row = document.createElement("div"); row.className = "result-row";
    const name = document.createElement("span"); name.textContent = `Level ${i+1}: ${item.name}`;
    const value = document.createElement("strong"); value.textContent = `${levelScores[i]} / ${item.count}`;
    row.append(name, value); breakdown.append(row);
  });
  if (finalLevel) { const total = document.createElement("div"); total.className="result-row result-total"; total.innerHTML=`<span>Gesamtpunktzahl</span><strong>${levelScores.reduce((a,b)=>a+b,0)} von ${LEVELS.reduce((a,l)=>a+l.count,0)}</strong>`; breakdown.append(total); }
  $("continueBtn").textContent = finalLevel ? "Rundgang noch einmal" : "Weitergehen";
  $("replayBtn").hidden = finalLevel; resultOverlay.hidden = false; $("continueBtn").focus();
}
function plural(level) { return level.target === "squirrel" ? "Eichhörnchen" : level.target === "acorn" ? "Eicheln" : "Vögel"; }
function restart() { levelIndex = 0; levelScores = LEVELS.map(() => 0); renderLevel(); }
$("restartBtn").addEventListener("click", restart);
$("continueBtn").addEventListener("click", () => { if (levelIndex === LEVELS.length-1) restart(); else { levelIndex++; renderLevel(); } });
$("replayBtn").addEventListener("click", () => { levelScores[levelIndex] = 0; renderLevel(); });
renderLevel();
