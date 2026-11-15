"use strict";

const LEVELS = [
  { name: "Am Waldrand", title: "Beobachten und entdecken", mode: "find", target: "squirrel", label: "Eichhörnchen", count: 5, description: "Gehen Sie den Waldweg entlang. Finden Sie fünf Eichhörnchen, die zwischen Stamm und Unterholz hervorkommen. Vögel sind Ablenkungen. Bewegen Sie Maus oder Finger, um sich umzusehen.", spots: [[46,41],[62,56],[79,39],[88,68],[57,79],[34,55],[72,81],[25,71],[68,29]] },
  { name: "Die verborgene Spur", title: "Merken Sie sich die Reihenfolge", mode: "sequence", target: "acorn", label: "Fundstelle", count: 4, description: "Vier Fundstellen leuchten nacheinander auf. Merken Sie sich die Reihenfolge und wählen Sie danach die Stellen in derselben Reihenfolge aus.", spots: [[40,63],[55,48],[73,69],[85,48],[32,42],[65,82]] },
  { name: "Lichtung im Abendlicht", title: "Zählen und gezielt auswählen", mode: "count", target: "bird", label: "Vogel", count: 5, description: "Finden Sie genau fünf Vögel zwischen den Zweigen. Eichhörnchen lenken ab – beobachten Sie die ganze Lichtung sorgfältig.", spots: [[31,39],[47,51],[61,34],[76,52],[87,39],[39,72],[70,72],[53,80],[84,79]] },
];
const ART = {
  squirrel: "https://images.unsplash.com/photo-1695360422831-4deab4c17a86?auto=format&fit=crop&w=280&h=320&q=85",
  bird: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=280&h=320&q=85",
};
const $ = (id) => document.getElementById(id);
const view = $("parkView"), layer = $("targetLayer"), overlay = $("resultOverlay");
let levelIndex = 0, foundCount = 0, levelScores = LEVELS.map(() => 0), sequence = [], sequenceInput = [], timers = [];
let soundEnabled = false, audioContext;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clearTimers() { timers.forEach(clearTimeout); timers = []; }
function later(fn, ms) { const id = setTimeout(fn, ms); timers.push(id); return id; }
function shuffle(items) { const a = [...items]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function playRustle() {
  if (!soundEnabled) return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const duration = .32, buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * (Math.random() > .88 ? 1 : .24);
    const source = audioContext.createBufferSource(), filter = audioContext.createBiquadFilter(), gain = audioContext.createGain();
    source.buffer = buffer; filter.type = "lowpass"; filter.frequency.value = 1700; gain.gain.value = .2;
    source.connect(filter); filter.connect(gain); gain.connect(audioContext.destination); source.start();
  } catch (error) { console.info("Sound playback is unavailable in this browser.", error); }
}
function animalButton(type, label, index) {
  const button = document.createElement("button");
  button.type = "button"; button.className = `park-target animal-${type}`;
  button.setAttribute("aria-label", label);
  if (type === "acorn") {
    const acorn = document.createElement("span"); acorn.className = "target-acorn"; acorn.setAttribute("aria-hidden", "true"); button.append(acorn);
  } else {
    const image = document.createElement("img"); image.className = "animal-photo"; image.src = ART[type]; image.alt = ""; image.loading = "eager";
    image.onerror = () => { image.hidden = true; button.classList.add("image-unavailable"); };
    button.append(image);
  }
  button.style.setProperty("--delay", `${reducedMotion ? 0 : .25 + index * .42}s`);
  return button;
}
function renderLevel() {
  clearTimers(); overlay.hidden = true; foundCount = 0; sequence = []; sequenceInput = [];
  const level = LEVELS[levelIndex]; view.dataset.level = String(levelIndex + 1);
  $("levelMarker").textContent = `LEVEL ${levelIndex + 1}`; $("levelName").textContent = level.name;
  $("taskTitle").textContent = level.title; $("taskDescription").textContent = level.description;
  $("progressText").textContent = level.mode === "sequence" ? `Reihenfolge: 0 von ${level.count}` : `Gefunden: 0 von ${level.count}`;
  $("levelProgressText").textContent = `Aufgabe ${levelIndex + 1} von ${LEVELS.length}`;
  $("progressBar").style.width = "0%"; const bar = document.querySelector(".progress-track");
  bar.setAttribute("aria-valuemax", level.count); bar.setAttribute("aria-valuenow", 0);
  $("status").textContent = "Bewegen Sie Maus oder Finger, um sich umzusehen. Achten Sie auf Bewegung am Wegesrand.";
  $("memoryCue").hidden = true; layer.replaceChildren();
  let specs;
  if (level.mode === "find") {
    specs = shuffle(level.spots).slice(0, 7).map((spot, i) => ({ spot, type: i < level.count ? "squirrel" : "bird", target: i < level.count }));
  } else if (level.mode === "sequence") {
    specs = shuffle(level.spots).map((spot, i) => ({ spot, type: "acorn", target: true, id: i }));
    sequence = shuffle(specs.map((_, i) => i)).slice(0, level.count);
  } else {
    specs = shuffle(level.spots).map((spot, i) => ({ spot, type: i < level.count ? "bird" : "squirrel", target: i < level.count }));
  }
  specs.forEach((spec, index) => {
    const target = animalButton(spec.type, spec.target ? `${level.label} ${index + 1} entdecken` : "Ein anderes Tier im Wald", index);
    target.style.left = `${spec.spot[0]}%`; target.style.top = `${spec.spot[1]}%`;
    target.classList.toggle("is-decoy", !spec.target); target.dataset.index = String(index);
    target.addEventListener("animationstart", (event) => { if (event.animationName === "animal-emerge") playRustle(); });
    target.addEventListener("click", () => handleTarget(target, spec)); layer.append(target);
  });
  if (level.mode === "sequence") {
    const cue = $("memoryCue"); cue.hidden = false; cue.textContent = "Achten Sie auf die aufleuchtenden Fundstellen …";
    sequence.forEach((specIndex, i) => later(() => {
      const button = layer.querySelector(`[data-index="${specIndex}"]`);
      button?.classList.add("sequence-hint"); cue.textContent = `Spur ${i + 1} von ${sequence.length} – merken Sie sich die Position`;
      if (i === sequence.length - 1) later(() => { layer.querySelectorAll(".sequence-hint").forEach((el) => el.classList.remove("sequence-hint")); cue.textContent = "Jetzt die Fundstellen in der gemerkten Reihenfolge wählen."; $("status").textContent = "Die Spur ist verborgen. Welche Stelle kam zuerst?"; }, 900);
    }, 1700 + i * 1050));
  }
}
function handleTarget(button, spec) {
  if (button.disabled || !overlay.hidden) return;
  const level = LEVELS[levelIndex];
  if (!spec.target) {
    button.classList.add("wrong-choice"); $("status").textContent = "Das ist ein anderes Tier. Suchen Sie weiter nach dem gesuchten Motiv.";
    later(() => button.classList.remove("wrong-choice"), 750); playRustle(); return;
  }
  if (level.mode === "sequence") {
    const next = sequence[sequenceInput.length];
    if (spec.id !== next) { button.classList.add("wrong-choice"); $("status").textContent = "Das war nicht die nächste Stelle der Spur. Versuchen Sie es noch einmal."; later(() => button.classList.remove("wrong-choice"), 750); return; }
    sequenceInput.push(spec.id); button.disabled = true; button.classList.add("collected");
    $("memoryCue").textContent = `Richtig: ${sequenceInput.length} von ${level.count} in der Spur`;
  } else { button.disabled = true; button.classList.add("collected"); }
  playRustle(); foundCount++;
  $("progressText").textContent = level.mode === "sequence" ? `Reihenfolge: ${foundCount} von ${level.count}` : `Gefunden: ${foundCount} von ${level.count}`;
  $("progressBar").style.width = `${foundCount / level.count * 100}%`; document.querySelector(".progress-track").setAttribute("aria-valuenow", foundCount);
  if (foundCount === level.count) { levelScores[levelIndex] = foundCount; $("status").textContent = "Aufgabe geschafft – ausgezeichnet beobachtet!"; later(showResult, 750); }
  else if (level.mode !== "sequence") $("status").textContent = `Gut entdeckt. Noch ${level.count - foundCount} ${level.label.toLowerCase()}${level.target === "squirrel" ? "chen" : level.count - foundCount === 1 ? "" : "e"} warten im Park.`;
}
function showResult() {
  const final = levelIndex === LEVELS.length - 1;
  $("resultKicker").textContent = final ? "Rundgang beendet" : `Level ${levelIndex + 1} abgeschlossen`;
  $("resultTitle").textContent = final ? "Der ganze Park erkundet" : "Gut beobachtet!";
  $("resultMessage").textContent = final ? `Sie haben alle drei Aufgaben gemeistert und ${levelScores.reduce((a, b) => a + b, 0)} Punkte erzielt. Dabei waren Beobachtung, Gedächtnis und Konzentration gefragt.` : `Sie haben die Aufgabe in Level ${levelIndex + 1} gemeistert. Im nächsten Abschnitt wartet eine neue Herausforderung.`;
  const box = $("resultBreakdown"); box.replaceChildren();
  LEVELS.slice(0, final ? LEVELS.length : levelIndex + 1).forEach((item, i) => { const row = document.createElement("div"); row.className = "result-row"; const name = document.createElement("span"); name.textContent = `Level ${i + 1}: ${item.name}`; const value = document.createElement("strong"); value.textContent = `${levelScores[i]} / ${item.count}`; row.append(name, value); box.append(row); });
  if (final) { const total = document.createElement("div"); total.className = "result-row result-total"; total.innerHTML = `<span>Gesamtpunktzahl</span><strong>${levelScores.reduce((a, b) => a + b, 0)} von ${LEVELS.reduce((a, l) => a + l.count, 0)}</strong>`; box.append(total); }
  $("continueBtn").textContent = final ? "Spaziergang wiederholen" : "Weitergehen"; $("replayBtn").hidden = final; overlay.hidden = false; $("continueBtn").focus();
}
function restart() { levelIndex = 0; levelScores = LEVELS.map(() => 0); renderLevel(); }
$("restartBtn").addEventListener("click", restart);
$("continueBtn").addEventListener("click", () => { if (levelIndex === LEVELS.length - 1) restart(); else { levelIndex++; renderLevel(); } });
$("replayBtn").addEventListener("click", () => { levelScores[levelIndex] = 0; renderLevel(); });
$("soundToggle").addEventListener("click", () => { soundEnabled = !soundEnabled; $("soundToggle").textContent = `Rascheln: ${soundEnabled ? "an" : "aus"}`; $("soundToggle").setAttribute("aria-pressed", String(soundEnabled)); if (soundEnabled) playRustle(); });

// Mouse movement turns the viewpoint; touch-drag moves through the scene. The targets
// share a mild parallax offset, so the forest feels spatial while remaining clickable.
let dragging = false, lastX = 0, lastY = 0, panX = 0, panY = 0;
function lookAt(clientX, clientY) {
  const rect = view.getBoundingClientRect();
  const nx = Math.max(-1, Math.min(1, (clientX - rect.left) / rect.width * 2 - 1));
  const ny = Math.max(-1, Math.min(1, (clientY - rect.top) / rect.height * 2 - 1));
  view.style.setProperty("--look-x", `${-nx * 34}px`); view.style.setProperty("--look-y", `${-ny * 22}px`);
  view.style.setProperty("--look-pan-x", `${nx * 12}px`);
  $("status").dataset.look = "active";
}
view.addEventListener("pointerdown", (event) => { if (event.pointerType === "touch") { dragging = true; lastX = event.clientX; lastY = event.clientY; view.setPointerCapture(event.pointerId); } });
view.addEventListener("pointermove", (event) => {
  if (event.pointerType === "mouse") lookAt(event.clientX, event.clientY);
  if (event.pointerType === "touch" && dragging) { const dx = event.clientX - lastX, dy = event.clientY - lastY; panX = Math.max(-70, Math.min(70, panX + dx * .8)); panY = Math.max(-45, Math.min(45, panY + dy * .5)); lastX = event.clientX; lastY = event.clientY; view.style.setProperty("--look-x", `${panX}px`); view.style.setProperty("--look-y", `${panY}px`); }
});
view.addEventListener("pointerup", () => { dragging = false; }); view.addEventListener("pointercancel", () => { dragging = false; });
view.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") { view.style.setProperty("--look-x", "0px"); view.style.setProperty("--look-y", "0px"); } });
renderLevel();
