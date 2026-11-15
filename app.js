* {
  box-sizing: border-box;
}

:root {
  --park-red: #b61f29;
  --park-red-dark: #8d1820;
  --park-red-soft: #d76b73;
  --park-gold: #f4d49b;
  --park-cream: #f9f5ee;
  --park-green: #486b4d;
  --park-green-deep: #294a34;
  --park-brown: #7a5139;
  --park-brown-dark: #4e3828;
  --panel-shadow: 0 18px 42px rgba(62, 35, 20, 0.12);
  --text-main: #1d1a19;
  --text-soft: #635d5a;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: rgba(255, 255, 255, 0.9);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    linear-gradient(180deg, #f3f0e7 0%, #ebf1e7 35%, #edf1eb 100%);
  color: var(--text-main);
}

body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

button {
  font: inherit;
}

.page-shell {
  width: min(1180px, 100%);
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(120, 109, 98, 0.12);
  border-radius: 28px;
  box-shadow: var(--panel-shadow);
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 32px;
  background: linear-gradient(180deg, rgba(182, 31, 41, 0.12), rgba(182, 31, 41, 0.02));
  border-bottom: 1px solid rgba(182, 31, 41, 0.12);
}

.brand-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  color: var(--park-red-dark);
  font-weight: 700;
}

.brand-mark {
  font-size: clamp(1.05rem, 1vw + 0.6rem, 1.5rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand-sub {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.8;
}

.header-copy {
  flex: 1;
  text-align: center;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--park-red-dark);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.74rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 28px;
  padding: 28px 32px 32px;
}

.info-panel,
.park-panel {
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(120, 109, 98, 0.15);
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(59, 42, 28, 0.08);
}

.info-panel {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-kicker {
  margin: 0 0 10px;
  color: var(--park-red-dark);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  font-size: 0.72rem;
}

h2 {
  margin: 0 0 14px;
  font-size: clamp(1.6rem, 2vw, 2.2rem);
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.intro {
  margin: 0 0 22px;
  color: var(--text-soft);
  font-size: 1.04rem;
  line-height: 1.6;
}

.score-card {
  background: linear-gradient(180deg, rgba(182, 31, 41, 0.09), rgba(182, 31, 41, 0.03));
  border: 1px solid rgba(182, 31, 41, 0.18);
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.score-label {
  color: var(--text-soft);
  font-weight: 600;
}

#scoreText {
  font-size: clamp(1.2rem, 1.6vw, 1.6rem);
  color: var(--park-red-dark);
}

.button {
  border: none;
  border-radius: 999px;
  padding: 0.95rem 1.4rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.button:hover,
.button:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(20, 20, 20, 0.08);
}

.button:active {
  transform: translateY(0);
}

.button-primary {
  background: var(--park-red);
  color: white;
}

.park-panel {
  padding: 18px;
}

.park-scene {
  position: relative;
  min-height: 610px;
  overflow: hidden;
  border-radius: 22px;
  background: linear-gradient(180deg, #eef9ff 0%, #dfeeea 24%, #cfe6c2 58%, #9ec28a 100%);
  border: 1px solid rgba(64, 97, 74, 0.18);
}

.park-illustration {
  position: absolute;
  inset: 0;
}

.sun {
  position: absolute;
  width: 120px;
  height: 120px;
  right: 60px;
  top: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff7d4 0%, #f4d49b 62%, #e5bd65 100%);
  box-shadow: 0 0 0 18px rgba(244, 212, 155, 0.18);
}

.cloud {
  position: absolute;
  width: 150px;
  height: 42px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 20px 8px 0 10px rgba(255, 255, 255, 0.75), -18px 10px 0 4px rgba(255, 255, 255, 0.7);
}

.cloud-left {
  top: 88px;
  left: 72px;
}

.cloud-right {
  top: 104px;
  right: 170px;
}

.tree {
  position: absolute;
  bottom: 90px;
  width: 140px;
  height: 200px;
  background: linear-gradient(180deg, rgba(110, 83, 61, 0.8) 0 22%, rgba(70, 114, 68, 0.9) 22% 100%);
  clip-path: polygon(15% 30%, 50% 0%, 85% 30%, 72% 30%, 72% 100%, 28% 100%, 28% 30%);
  opacity: 0.9;
}

.tree-left {
  left: 54px;
}

.tree-right {
  right: 72px;
}

.bush {
  position: absolute;
  bottom: 56px;
  width: 180px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(180deg, #5a8b5e, #3f6b4f);
  box-shadow: inset 0 8px 18px rgba(255, 255, 255, 0.18);
}

.bush-left {
  left: 40px;
}

.bush-right {
  right: 40px;
}

.path {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 58%;
  height: 150px;
  transform: translateX(-50%);
  border-radius: 40% 40% 0 0 / 18% 18% 0 0;
  background: linear-gradient(180deg, #d9bb8a, #b88e5a 42%, #8d6440 100%);
  box-shadow: inset 0 8px 16px rgba(255, 255, 255, 0.2);
}

.squirrel-layer {
  position: absolute;
  inset: 0;
}

.squirrel {
  position: absolute;
  width: 62px;
  height: 62px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  z-index: 2;
  transform: translate(-50%, -50%);
  touch-action: manipulation;
  transition: transform 0.2s ease;
}

.squirrel:hover,
.squirrel:focus-visible {
  transform: translate(-50%, -50%) scale(1.05);
}

.squirrel::before {
  content: "";
  position: absolute;
  inset: 6px 9px 10px 9px;
  background: linear-gradient(180deg, #8f5c3d, #6d422b 85%);
  border-radius: 52% 48% 46% 54% / 58% 58% 42% 42%;
  box-shadow: inset 0 -6px 0 rgba(58, 33, 17, 0.25);
}

.squirrel::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 12px;
  border-radius: 50%;
  background: #d7aa62;
  left: 18px;
  top: 8px;
  box-shadow: 16px 0 0 #d7aa62;
}

.squirrel .tail {
  position: absolute;
  width: 28px;
  height: 18px;
  border-radius: 50% 50% 50% 10%;
  border: 4px solid rgba(109, 66, 43, 0.9);
  border-left: 0;
  border-bottom: 0;
  right: 6px;
  top: 12px;
  transform: rotate(22deg);
  background: transparent;
}

.squirrel .ear {
  position: absolute;
  width: 10px;
  height: 14px;
  background: #5d3321;
  border-radius: 50% 50% 0 0;
  top: 2px;
  left: 18px;
  box-shadow: 18px 0 0 #5d3321;
}

.squirrel .ear::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 8px;
  background: #f3d9a3;
  border-radius: 50%;
  left: 3px;
  top: 3px;
  box-shadow: 18px 0 0 #f3d9a3;
}

.squirrel.collected {
  animation: vanish 0.38s ease forwards;
}

@keyframes vanish {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  35% {
    transform: translate(-50%, -56%) scale(1.08);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -72%) scale(0.2);
    opacity: 0;
  }
}

.message-box {
  margin-top: 18px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(127, 114, 104, 0.22);
  border-radius: 16px;
  padding: 14px 18px;
  font-weight: 600;
  color: var(--text-main);
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

@media (max-width: 850px) {
  .game-layout {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    text-align: center;
  }

  .brand-block {
    align-items: center;
  }
}

@media (max-width: 540px) {
  body {
    padding: 14px;
  }

  .page-shell {
    border-radius: 18px;
  }

  .topbar,
  .game-layout {
    padding-left: 16px;
    padding-right: 16px;
  }

  .park-scene {
    min-height: 500px;
  }

  .score-card {
    flex-direction: column;
    align-items: flex-start;
  }
}


















































