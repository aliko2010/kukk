// ================== ZOMBIE-X: MENU, AYARLAR, MUZIK ==================
// Bu dosya game.js'ten sonra yuklenir (settings, ac(), reset() gibi seyleri oradan kullanir)

const ui = document.getElementById('ui');
const panels = {
  main:     document.getElementById('p-main'),
  pause:    document.getElementById('p-pause'),
  settings: document.getElementById('p-settings'),
  credits:  document.getElementById('p-credits'),
  avatar:   document.getElementById('p-avatar'),
};
const hintEl = document.getElementById('hint');
let currentPanel = 'main';
let settingsFrom = 'main';   // ayarlardan "geri" nereye donecek: 'main' veya 'pause'
let audioUnlocked = false;   // tarayici ses icin ilk tiklamayi bekler

function showPanel(name) {
  currentPanel = name;
  for (const k in panels) panels[k].style.display = (k === name) ? 'flex' : 'none';
}

// ---------- OYUN AKISI ----------
function showMenu() {
  gameState = 'menu';
  ui.style.display = 'flex';
  ui.className = 'menu-mode';
  showPanel('main');
  stopAmbience();
  if (audioUnlocked) startMusic('menu');
}
function startGame() {
  ui.style.display = 'none';
  gameState = 'playing';
  reset();
  pressedE = false;
  pressedDash = false;
  startMusic('game');            // oyun muzigi (menu muzigi yumusakca kapanir)
  startAmbience();               // ruzgar, cekirge...
}
function pauseGame() {
  if (gameState !== 'playing') return;
  gameState = 'paused';
  ui.style.display = 'flex';
  ui.className = 'pause-mode';
  showPanel('pause');
  duckMusic(true);               // duraklatinca muzik kisilir
  duckAmbience(true);
}
function resumeGame() {
  ui.style.display = 'none';
  gameState = 'playing';
  duckMusic(false);
  duckAmbience(false);
  pressedE = false;
  pressedDash = false;
}

// ---------- SES KILIDI (tarayici ilk tiklamadan sonra ses acar) ----------
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  ac().resume();
  hintEl.style.display = 'none';
  if (gameState === 'menu') startMusic('menu');
}
addEventListener('pointerdown', unlockAudio, true);
addEventListener('keydown', unlockAudio, true);

function uiClick() { if (audioUnlocked) tone(520, 0, 0.06, 'square', 0.12, 900); }
function uiHover() { if (audioUnlocked) tone(700, 0, 0.03, 'square', 0.06); }

// ---------- AYARLAR ----------
function $(id) { return document.getElementById(id); }

function musicGain() {
  // oyun muzigi efektleri bastirmasin diye biraz daha kisik
  return settings.music * (music.mode === 'game' ? 0.45 : 0.6) * (music.duck ? 0.35 : 1);
}
function applyVolumes() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  sfxBus.gain.setValueAtTime(settings.sfx, t);
  musicBus.gain.cancelScheduledValues(t);
  musicBus.gain.setTargetAtTime(musicGain(), t, 0.05);
}
function duckMusic(on) {
  music.duck = on;
  applyVolumes();
}

function refreshSettingsUI() {
  $('vol-music').value = Math.round(settings.music * 100);
  $('vol-sfx').value = Math.round(settings.sfx * 100);
  $('btn-diff').textContent = DIFFICULTY[settings.difficulty].label;
  $('btn-shake').textContent = settings.shake ? 'AÇIK' : 'KAPALI';
  $('btn-night').textContent = settings.night ? 'AÇIK' : 'KAPALI';
  $('btn-fs').textContent = document.fullscreenElement ? 'KAPAT' : 'AÇ';
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}
document.addEventListener('fullscreenchange', refreshSettingsUI);

ui.addEventListener('input', e => {
  if (e.target.id === 'vol-music') {
    settings.music = e.target.value / 100;
    applyVolumes();
    saveSettings();
  } else if (e.target.id === 'vol-sfx') {
    settings.sfx = e.target.value / 100;
    applyVolumes();
    saveSettings();
  }
});
// slider birakilinca efekt sesi onizlemesi
ui.addEventListener('change', e => {
  if (e.target.id === 'vol-sfx' && audioUnlocked) playShotgun();
});

ui.addEventListener('mouseover', e => {
  if (e.target.classList && e.target.classList.contains('btn')) uiHover();
});

ui.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('[data-act]') : null;
  if (!b) return;
  unlockAudio();
  uiClick();
  switch (b.dataset.act) {
    case 'play':     startGame(); break;
    case 'resume':   resumeGame(); break;
    case 'tomenu':   showMenu(); break;
    case 'credits':  showPanel('credits'); break;
    case 'avatar':   refreshAvatarUI(); showPanel('avatar'); break;
    case 'acc-hat':  cycleAcc('hat'); break;
    case 'acc-mask': cycleAcc('mask'); break;
    case 'locked':   playDeny(); break;
    case 'back':     showPanel('main'); break;
    case 'settings':
      settingsFrom = (gameState === 'paused') ? 'pause' : 'main';
      refreshSettingsUI();
      showPanel('settings');
      break;
    case 'settings-back': showPanel(settingsFrom); break;
    case 'difficulty': {
      const order = ['easy', 'normal', 'hard'];
      settings.difficulty = order[(order.indexOf(settings.difficulty) + 1) % order.length];
      saveSettings();
      refreshSettingsUI();
      break;
    }
    case 'shake':
      settings.shake = !settings.shake;
      saveSettings();
      refreshSettingsUI();
      break;
    case 'night':
      settings.night = !settings.night;
      saveSettings();
      refreshSettingsUI();
      break;
    case 'fullscreen': toggleFullscreen(); break;
  }
});

// ESC / P: duraklat, geri don
addEventListener('keydown', e => {
  if (e.repeat) return;
  if (e.code !== 'Escape' && e.code !== 'KeyP') return;
  if (gameState === 'playing' && player.hp > 0) {
    pauseGame();
  } else if (gameState === 'paused') {
    if (currentPanel === 'settings') showPanel(settingsFrom);
    else resumeGame();
  } else if (gameState === 'menu' && currentPanel !== 'main') {
    showPanel('main');
  }
});

// ---------- AVATAR ----------
const avatarCv = document.getElementById('avatar-prev');
const avatarCtx = avatarCv.getContext('2d');
avatarCtx.imageSmoothingEnabled = false;
const AVATAR_FRAMES = ['idle', 'walk1', 'walk2'];
let avatarFrame = 0;

function renderAvatarPreview() {
  const key = AVATAR_FRAMES[avatarFrame % AVATAR_FRAMES.length];
  avatarCtx.clearRect(0, 0, 16, 16);
  if (loaded(key)) avatarCtx.drawImage(img[key], 0, 0, 16, 16);
  drawAccessories(avatarCtx, 0, 0, 1, key);
}
function refreshAvatarUI() {
  const av = settings.avatar || (settings.avatar = { hat: 0, mask: 0 });
  for (const s of ACC_SLOTS) $('btn-acc-' + s.slot).textContent = s.names[av[s.slot] || 0];
  renderAvatarPreview();
}
function cycleAcc(slot) {
  const s = ACC_SLOTS.find(a => a.slot === slot);
  if (!settings.avatar) settings.avatar = { hat: 0, mask: 0 };
  settings.avatar[slot] = ((settings.avatar[slot] || 0) + 1) % s.items.length;
  saveSettings();
  refreshAvatarUI();
}
setInterval(() => {
  avatarFrame++;
  if (currentPanel === 'avatar') renderAvatarPreview();
}, 300);

// ---------- MENUDE KOSAN KARAKTER VE ZOMBILER ----------
const walkersEl = document.getElementById('walkers');
const WALKERS = [
  { a: 'walk1',   b: 'walk2',   delay: -7.5, bottom: 7 },   // oyuncu onde kaciyor
  { a: 'zwalk1',  b: 'zwalk2',  delay: -5.6, bottom: 9 },
  { a: 'zwalk1',  b: 'zwalk2',  delay: -4.4, bottom: 5 },
  { a: 'pzwalk1', b: 'pzwalk2', delay: -3.0, bottom: 8 },
  { a: 'zwalk1',  b: 'zwalk2',  delay: -1.8, bottom: 6 },
  { a: 'tukwalk1', b: 'tukwalk2', delay: -0.6, bottom: 4 },
];
const walkerImgs = [];
for (const w of WALKERS) {
  const im = document.createElement('img');
  im.className = 'walker';
  im.src = FILES[w.a];
  im.style.animationDelay = w.delay + 's';
  im.style.bottom = w.bottom + '%';
  walkersEl.appendChild(im);
  walkerImgs.push({ im, w });
}
let walkFrame = 0;
setInterval(() => {
  walkFrame = 1 - walkFrame;
  for (const o of walkerImgs) o.im.src = FILES[walkFrame ? o.w.b : o.w.a];
}, 250);

// ================== MUZIK (kodla uretilir, dosya gerekmez) ==================
// Iki parca var: 'menu' (karanlik, gergin) ve 'game' (hizli, dalga durumuna gore degisir)
const music = { playing: false, timer: null, step: 0, nextTime: 0, mode: 'menu', duck: false, out: null };

// ---- MENU parcasi: Am - F - Dm - E ----
const BPM = 96;
const STEP = 60 / BPM / 4;                       // 16'lik nota suresi
const CHORDS = [
  [220.00, 261.63, 329.63],
  [174.61, 220.00, 261.63],
  [146.83, 174.61, 220.00],
  [164.81, 207.65, 246.94],
];
const BASS_ROOTS = [110.00, 87.31, 73.42, 82.41];
const BASS_STEPS = [0, 3, 6, 8, 11, 14];
const ARP_STEPS  = [0, 3, 6, 9, 12, 14];

// ---- OYUN parcasi: Dm - Bb - C - A ----
const G_BPM = 126;
const G_STEP = 60 / G_BPM / 4;
const G_CHORDS = [
  [146.83, 174.61, 220.00],   // Dm
  [116.54, 146.83, 174.61],   // Bb
  [130.81, 164.81, 196.00],   // C
  [110.00, 138.59, 164.81],   // A (gerilim)
];
const G_BASS = [73.42, 58.27, 65.41, 55.00];

let noiseBuf = null;

function mTone(freq, t, dur, type, vol, cutoff, attack) {
  const a = ac();
  const o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
  o.type = type;
  o.frequency.value = freq;
  f.type = 'lowpass';
  f.frequency.value = cutoff;
  const at = attack || 0.01;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + at);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(f).connect(g).connect(music.out);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function mKick(t, vol) {
  const a = ac();
  const o = a.createOscillator(), g = a.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.14);
  g.gain.setValueAtTime(vol || 0.9, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.connect(g).connect(music.out);
  o.start(t);
  o.stop(t + 0.2);
}
function mNoise(t, dur, vol, type, freq) {
  const a = ac();
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = a.createBufferSource();
  src.buffer = noiseBuf;
  const f = a.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(music.out);
  src.start(t);
  src.stop(t + dur + 0.02);
}

function playStep(n, t) {                         // MENU
  const bar = Math.floor(n / 16) % 4;
  const s = n % 16;
  const ch = CHORDS[bar];

  if (s === 0) {                                   // akor zemini (yavas acilan)
    for (const f of ch) mTone(f, t, STEP * 16, 'sawtooth', 0.035, 700, 0.4);
  }
  if (BASS_STEPS.includes(s)) mTone(BASS_ROOTS[bar], t, STEP * 2.2, 'sawtooth', 0.2, 420);
  if (s === 0 || s === 8 || (s === 10 && bar % 2 === 1)) mKick(t);
  if (s === 4 || s === 12) mNoise(t, 0.12, 0.22, 'highpass', 1800);   // tok
  if (s % 2 === 0) mNoise(t, 0.04, 0.06, 'highpass', 7000);           // hi-hat
  const ai = ARP_STEPS.indexOf(s);
  if (ai >= 0) mTone(ch[ai % 3] * 2, t, STEP * 2.6, 'triangle', 0.07, 3200);
}

// Oyun muzigi dalga durumuna gore degisir:
// 0 = mola (sakin), 1 = dalga girisi (gergin), 2 = savas (tam tempo)
function gameIntensity() {
  if (typeof wave === 'undefined' || !wave) return 2;
  if (wave.phase === 'break') return 0;
  if (wave.phase === 'intro') return 1;
  return 2;
}
function playGameStep(n, t) {                      // OYUN
  const bar = Math.floor(n / 16) % 4;
  const s = n % 16;
  const ch = G_CHORDS[bar];
  const root = G_BASS[bar];
  const lvl = gameIntensity();
  const hard = typeof wave !== 'undefined' && wave && wave.n >= 3;
  const D = G_STEP;

  // akor zemini
  if (s === 0) {
    for (const f of ch) mTone(f * 2, t, D * 16, lvl === 0 ? 'triangle' : 'sawtooth',
                              lvl === 0 ? 0.05 : 0.02, lvl === 0 ? 1200 : 650, 0.5);
  }

  if (lvl === 0) {                                  // MOLA
    if (s === 0) mTone(root * 2, t, D * 8, 'sine', 0.28, 400, 0.05);
    if (s === 0 || s === 8) mKick(t, 0.5);
    if (s % 4 === 2) mNoise(t, 0.03, 0.03, 'highpass', 7500);
    if (s % 4 === 0) mTone(ch[(s / 4) % 3] * 2, t, D * 3, 'triangle', 0.06, 2600);
    return;
  }

  if (lvl === 1) {                                  // DALGA GIRISI
    if (s === 0 || s === 8) mKick(t, 0.8);
    if ([0, 3, 6, 8, 11, 14].includes(s)) mTone(root, t, D * 2.2, 'sawtooth', 0.2, 450);
    if (s % 4 === 2) mNoise(t, 0.03, 0.04, 'highpass', 7500);
    return;
  }

  // SAVAS
  if (s % 4 === 0 || (s === 10 && bar % 2 === 1)) mKick(t, 0.9);
  if (s === 4 || s === 12) {                        // tok
    mNoise(t, 0.12, 0.24, 'highpass', 1800);
    mTone(190, t, 0.08, 'triangle', 0.12, 1200);
  }
  if (s % 2 === 1) mNoise(t, 0.03, 0.045, 'highpass', 7500);   // hi-hat
  if (s === 14) mNoise(t, 0.1, 0.08, 'highpass', 6000);        // acik hat
  if (s % 2 === 0) {                                // sekizlik bas
    const hi = (s === 6 || s === 14) ? 2 : 1;
    mTone(root * hi, t, D * 1.7, 'sawtooth', 0.2, 520);
  }
  if (hard && (s % 2 === 1 || (bar % 2 === 0 && s % 4 === 2))) {   // gerilim arpeji
    mTone(ch[s % 3] * 2, t, D * 1.3, 'square', 0.028, 2400);
  }
}

function scheduleMusic() {
  const a = ac();
  const game = music.mode === 'game';
  const dur = game ? G_STEP : STEP;
  while (music.nextTime < a.currentTime + 0.4) {
    if (game) playGameStep(music.step, music.nextTime);
    else playStep(music.step, music.nextTime);
    music.nextTime += dur;
    music.step++;
  }
}

// eski kanali yumusakca kapatir (parca degisirken / durdururken)
function retireOut(fade) {
  const o = music.out;
  if (!o) return;
  const t = audioCtx.currentTime;
  o.gain.cancelScheduledValues(t);
  o.gain.setValueAtTime(o.gain.value, t);
  o.gain.linearRampToValueAtTime(0, t + fade);
  setTimeout(() => { try { o.disconnect(); } catch (e) {} }, fade * 1000 + 300);
  music.out = null;
}

function startMusic(mode) {
  mode = mode || 'menu';
  const a = ac();
  a.resume();
  if (music.playing && music.mode === mode) {
    if (music.duck) duckMusic(false);
    return;
  }
  retireOut(0.35);
  if (music.timer) clearInterval(music.timer);
  music.mode = mode;
  music.duck = false;
  music.playing = true;
  music.step = 0;
  music.nextTime = a.currentTime + 0.1;
  const t = a.currentTime;
  music.out = a.createGain();
  music.out.gain.setValueAtTime(0.0001, t);
  music.out.gain.linearRampToValueAtTime(1, t + (mode === 'game' ? 0.4 : 1.0));   // yumusak giris
  music.out.connect(musicBus);
  applyVolumes();
  scheduleMusic();
  music.timer = setInterval(scheduleMusic, 100);
}
function stopMusic() {
  if (!music.playing) return;
  music.playing = false;
  clearInterval(music.timer);
  music.timer = null;
  retireOut(0.6);                                  // yumusak cikis
}

// ---------- BASLANGIC ----------
showPanel('main');