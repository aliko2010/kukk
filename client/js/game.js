// ================== AYARLAR (dosya adlarini buradan degistir) ==================
const FILES = {
  idle:      'assets/idle.png',
  walk1:     'assets/walk1.png',
  walk2:     'assets/walk2.png',
  zidle:     'assets/zidle.png',
  zwalk1:    'assets/zwalk1.png',
  zwalk2:    'assets/zwalk2.png',
  gun:       'assets/silah.png',
  gunFire:   'assets/silahates.png',
  drop:      'assets/drop.png',
  medic:     'assets/medic.png',
  bg:        'assets/background.png',
  pzidle:    'assets/pzidle.png',
  shotgun:   'assets/shotgun.png',
  tezgah:    'assets/tezgah.png',
  pzwalk1:   'assets/pzwalk1.png',
  pzwalk2:   'assets/pzwalk2.png',
  tukidle:   'assets/tukidle.png',
  tukwalk1:  'assets/tukwalk1.png',
  tukwalk2:  'assets/tukwalk2.png',
  sapka1:    'assets/sapka1.png',
  maske1:    'assets/maske1.png',
  tankidle:  'assets/tankidle.png',
  tankwalk1: 'assets/tankwalk1.png',
  tankwalk2: 'assets/tankwalk2.png',
  megaidle:  'assets/megaidle.png',
  megawalk1: 'assets/megawalk1.png',
  megawalk2: 'assets/megawalk2.png',
  necroidle: 'assets/necroidle.png',
  necrowalk1:'assets/necrowalk1.png',
  necrowalk2:'assets/necrowalk2.png',
  skelidle:  'assets/skelidle.png',
  skelwalk1: 'assets/skelwalk1.png',
  skelwalk2: 'assets/skelwalk2.png',
  polisidle: 'assets/polisidle.png',
  poliswalk1:'assets/poliswalk1.png',
  poliswalk2:'assets/poliswalk2.png',
  polisbg:   'assets/polisbg.png',
};
const SOUND_FILE = 'assets/glock.mp3'; // yoksa kodla uretilen ses calar

const DROP_INTERVAL = 20;   // saniye: kac saniyede bir drop dusecek
const FIRST_DROP = 10;      // ilk drop kac saniye sonra gelsin
const DROP_FALL_SPEED = 25; // piksel/saniye (kucuk = daha yavas)
const CORPSE_TIME = 10;     // olu zombi kac saniye sonra yok olsun
const INTERACT_DIST = 20;   // E icin gereken yakinlik
const MAX_HP = 5;
const SHOTGUN_CHANCE = 0.15;   // drop'tan shotgun cikma ihtimali (0.15 = %15)
const SHOTGUN_COOLDOWN = 0.5;  // iki atis arasi bekleme
const SHOTGUN_PELLETS = 6;     // tek atista cikan saçma sayisi
const SHOTGUN_SPREAD = 0.4;    // saçma yayilimi (radyan)
const COIN_PER_WAVE = 2;       // her dalga basinda kazanilan coin
const BREAK_TIME = 15;         // dalgalar arasi mola (saniye)
const INTRO_TIME = 2.5;        // dalga basinda mesaj suresi (zombi cikmaz)
const MEDKIT_PRICE = 3;        // magazada medkit fiyati
const SHOTGUN_PRICE = 7;       // magazada shotgun fiyati
const DASH_COOLDOWN = 5;     // saniye: dash kac saniyede yenilenir
const DASH_TIME = 0.15;      // dash suresi
const DASH_SPEED = 330;      // dash hizi (piksel/saniye)
const DASH_MAX_KILLS = 2;    // tek dash'te en fazla kac zombiyi firlatir
const FLING_SPEED = 260;     // firlatilan zombinin baslangic hizi
const FLING_TIME = 0.3;      // firlatilma suresi
const EXPLOSION_RADIUS = 32;  // patlamanin etki alani (piksel)
const EXPLOSION_DAMAGE = 2;   // patlama oyuncuya kac can goturur

// ---- Tukuruk zombisi (zehir) ----
const SPITTER_MIN_WAVE = 3;   // kacinci dalgadan itibaren cikar
const SPIT_RANGE = 90;        // bu mesafeden yakinsa durup tukurur
const SPIT_FLEE = 48;         // bundan yakinsa geri kacar
const SPIT_COOLDOWN = 2.8;    // iki tukuruk arasi bekleme
const SPIT_WINDUP = 0.6;      // tukurmeden once hazirlanma suresi
const SPIT_SPEED = 105;       // tukuruk hizi (piksel/saniye)
const PUDDLE_RADIUS = 12;     // zehir gölünün yaricapi
const PUDDLE_TIME = 7;        // zehir gölü kac saniye kalir
const PUDDLE_SLOW = 0.6;      // goldeyken hareket hizi carpani
const POISON_TIME = 4;        // zehir etkisi suresi (golden ciktiktan sonra)
const POISON_TICK = 1.4;      // zehir kac saniyede bir 1 can goturur
const POISON_LETHAL = false;  // true: zehir oldurebilir, false: 1 cana kadar indirir

// ---- TANK (her 5. dalgada cikar) ----
const TANK_HP = 26;            // ilk tankin cani (sonraki tanklar +12)
const TANK_SPEED = 21;         // yurume hizi
const TANK_DAMAGE = 2;         // temas hasari
const TANK_CHARGE_CD = 5;      // iki hucum arasi bekleme
const TANK_CHARGE_RANGE = 130; // bu mesafedeyse hucuma hazirlanir
const TANK_WINDUP = 0.9;       // hucumdan once hazirlanma (kacma sansi)
const TANK_CHARGE_TIME = 0.7;  // hucum suresi
const TANK_CHARGE_MULT = 4.5;  // hucum hizi carpani
const TANK_STUN = 0.8;         // hucum sonrasi sersemleme
const TANK_REWARD = 3;         // oldurunce coin

// ---- BOSS TAKVIMI ----
// 2. dalga: Tank | 5. dalga: Mega Tukurucu | 7. dalga: Necromancer
// 7'den sonra (polis istasyonu): her 3 dalgada bir sirayla Tank -> Mega -> Necromancer, her turda daha guclu
function bossFor(n) {
  if (n === 2) return { kind: 'tank', tier: 1 };
  if (n === 5) return { kind: 'mega', tier: 1 };
  if (n === 7) return { kind: 'necro', tier: 1 };
  if (n > 7 && (n - 7) % 3 === 0) {
    const i = (n - 7) / 3 - 1;
    return { kind: ['tank', 'mega', 'necro'][i % 3], tier: 2 + Math.floor(i / 3) };
  }
  return null;
}
const BOSS_INFO = {
  tank:  { name: 'TANK',           msg: 'TANK GELİYOR!',    sub: 'ÇOK DAYANIKLI - HÜCUMUNDAN KAÇ', bar: '#d02020' },
  mega:  { name: 'MEGA TÜKÜRÜCÜ',  msg: 'MEGA TÜKÜRÜCÜ!',   sub: 'ZEHİR YAĞMURUNA DİKKAT',         bar: '#5ac030' },
  necro: { name: 'NECROMANCER',    msg: 'NECROMANCER!',     sub: 'İSKELETLERİ MEZARDAN KALDIRIYOR', bar: '#a040e0' },
};

// ---- MEGA TUKURUCU ----
const MEGA_HP = 32;            // ilk mega tukurucunun cani (sonraki turlarda +14)
const MEGA_SPEED = 15;
const MEGA_RANGE = 120;        // bu mesafeden yakinsa durup saldirir
const MEGA_FLEE = 60;          // bundan yakinsa geri kacar
const MEGA_COOLDOWN = 3;       // saldirilar arasi bekleme
const MEGA_WINDUP = 0.8;       // saldiri hazirligi
const MEGA_BIG_R = 26;         // dev tukuruk gol yaricapi
const MEGA_REWARD = 4;

// ---- NECROMANCER ----
const NECRO_HP = 28;           // ilk necromancer cani (sonraki turlarda +12)
const NECRO_SPEED = 19;
const NECRO_RANGE = 130;
const NECRO_FLEE = 75;
const NECRO_INTERVAL = 5;      // kac saniyede bir iskelet cagirir
const NECRO_WINDUP = 0.9;      // asayi kaldirip hazirlanma suresi
const NECRO_REWARD = 5;
const SKEL_MAX = 8;            // ayni anda en fazla iskelet
const SKEL_RISE = 0.7;         // topraktan cikma suresi (bu surede vurulamaz)

// ---- POLIS ISTASYONU (8. dalgadan itibaren) ----
const POLICE_WAVE = 8;
const POLICE_DOOR = { x: 152, y: 46 };   // polis zombilerin cikis kapisi
const POLICE_LIGHTS = [{ x: 34, y: 97, o: 0 }, { x: 268, y: 111, o: 1 }];   // polis arabasi cakarlari
const POLICE_LUNGE_RANGE = 36;  // bu mesafede bicakla atilir
const POLICE_WINDUP = 0.3;      // atilmadan once durup bicagi parlatir
const POLICE_LUNGE_TIME = 0.18;
const POLICE_LUNGE_MULT = 5;
const POLICE_LUNGE_CD = 1.8;

// ---- KAN ----
const BLOOD_TIME = 30;         // kan lekesi kac saniye kalir
const BLOOD_MAX = 450;         // ekranda en fazla leke

// ---- GECE / FENER ----
const NIGHT_BASE = 0.55;       // 1. dalgada karanlik (0 = gunduz, 1 = zifiri)
const NIGHT_STEP = 0.06;       // her dalgada karanlik artisi
const NIGHT_MAX = 0.88;
const NIGHT_BREAK = 0.6;       // molada karanlik carpani (isiklar yanar)
const EYE_Y = 5;               // karanlikta parlayan gozlerin yuksekligi (16'lik sprite'ta)

// ================== AYARLAR / DURUM ==================
const DIFFICULTY = {
  easy:   { label: 'KOLAY',  spawn: 1.4, speed: 0.85 },
  normal: { label: 'NORMAL', spawn: 1.0, speed: 1.0 },
  hard:   { label: 'ZOR',    spawn: 0.7, speed: 1.15 },
};
function loadSettings() {
  try { return JSON.parse(localStorage.getItem('zombiex_settings')) || {}; }
  catch (e) { return {}; }
}
function saveSettings() {
  try { localStorage.setItem('zombiex_settings', JSON.stringify(settings)); }
  catch (e) {}
}
const settings = Object.assign({ music: 0.5, sfx: 0.8, shake: true, difficulty: 'normal', night: true, avatar: { hat: 0, mask: 0 } }, loadSettings());
if (!DIFFICULTY[settings.difficulty]) settings.difficulty = 'normal';
let gameState = 'menu';   // 'menu' | 'playing' | 'paused'

const W = 320, H = 180;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function resize() {
  const s = Math.max(1, Math.floor(Math.min(innerWidth / W, innerHeight / H)));
  canvas.style.width = W * s + 'px';
  canvas.style.height = H * s + 'px';
}
addEventListener('resize', resize);
resize();

// ================== RESIMLER ==================
const img = {};
for (const key in FILES) {
  const im = new Image();
  im.src = FILES[key];
  img[key] = im;
}
function loaded(key) { return img[key].complete && img[key].naturalWidth > 0; }

function draw(key, x, y, w, h, fallback) {
  if (loaded(key)) {
    ctx.drawImage(img[key], Math.round(x), Math.round(y), w, h);
  } else {
    ctx.fillStyle = fallback;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
}
// Resmi kendi boyutunda, merkezi (cx, cy) olacak sekilde cizer
function drawCentered(key, cx, cy, fallback) {
  const w = loaded(key) ? img[key].naturalWidth : 16;
  const h = loaded(key) ? img[key].naturalHeight : 16;
  draw(key, cx - w / 2, cy - h / 2, w, h, fallback);
}

// ================== AKSESUARLAR ==================
// Her aksesuar 16x16 seffaf bir PNG: karakterin ustune birebir oturur, tum karelerde (idle/walk1/walk2) ve
// sag/sol donuste otomatik cizilir. Yeni aksesuar eklemek icin FILES'a resmi, buraya da items'a anahtarini ekle.
const ACC_SLOTS = [   // cizim sirasi: alttan uste
  { slot: 'mask', label: 'MASKE',  items: [null, 'maske1'], names: ['YOK', 'MASKE 1'] },
  { slot: 'hat',  label: 'ŞAPKA',  items: [null, 'sapka1'], names: ['YOK', 'ŞAPKA 1'] },
];
// Yururken kafa bir piksel oynuyorsa aksesuari kareye gore kaydir: [x, y]
const ACC_OFFSET = { idle: [0, 0], walk1: [0, 0], walk2: [0, 0] };
function drawAccessories(c, x, y, face, frameKey) {
  const av = settings.avatar || {};
  const off = ACC_OFFSET[frameKey] || [0, 0];
  c.save();
  c.translate(Math.round(x) + (face < 0 ? 16 : 0), Math.round(y));
  c.scale(face, 1);
  for (const s of ACC_SLOTS) {
    const key = s.items[av[s.slot] || 0];
    if (key && loaded(key)) c.drawImage(img[key], off[0], off[1], 16, 16);
  }
  c.restore();
}

// ================== SES ==================
let audioCtx = null;
let sfxBus = null, musicBus = null;   // ayarlardaki ses seviyeleri bunlardan gecer
function ac() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sfxBus = audioCtx.createGain();
    sfxBus.gain.value = settings.sfx;
    sfxBus.connect(audioCtx.destination);
    musicBus = audioCtx.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(audioCtx.destination);
  }
  return audioCtx;
}
// Basit ton: frekans, baslangic gecikmesi, sure, dalga, ses, (istege bagli) bitis frekansi
function tone(freq, delay, dur, type, vol, slideTo) {
  const a = ac(), t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + dur + 0.02);
}
function noise(delay, dur, vol, filterType, filterFreq, power) {
  const a = ac(), t = a.currentTime + delay;
  const buf = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * dur)), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, power || 3);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = filterType; f.frequency.value = filterFreq;
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(sfxBus);
  src.start(t);
}

const gunAudio = new Audio(SOUND_FILE);
let fileSoundOk = false;
gunAudio.addEventListener('canplaythrough', () => fileSoundOk = true);
gunAudio.addEventListener('error', () => fileSoundOk = false);

function synthShot() { noise(0, 0.18, 0.6, 'lowpass', 3000, 4); }
function playShot() {
  if (fileSoundOk) {
    const a = gunAudio.cloneNode();
    a.volume = 0.5 * settings.sfx;
    a.play().catch(synthShot);
  } else {
    synthShot();
  }
}
// Drop yere dusunce "tok"
function playThud() {
  tone(140, 0, 0.18, 'sine', 0.9, 40);
  noise(0, 0.08, 0.4, 'lowpass', 600, 3);
}
// Hediye paketi acilma sesi: kagit hisirtisi + parlak "tada"
function playOpen() {
  noise(0, 0.15, 0.25, 'highpass', 3000, 2);
  tone(523, 0.08, 0.12, 'triangle', 0.4);
  tone(659, 0.16, 0.12, 'triangle', 0.4);
  tone(784, 0.24, 0.25, 'triangle', 0.4);
}
// Can dolma sesi
function playHeal() {
  tone(440, 0, 0.1, 'sine', 0.35);
  tone(554, 0.09, 0.1, 'sine', 0.35);
  tone(659, 0.18, 0.1, 'sine', 0.35);
  tone(880, 0.27, 0.3, 'sine', 0.35);
}

// Mermi zombiye carpinca
function playHit() {
  noise(0, 0.06, 0.3, 'highpass', 1500, 2);
  tone(220, 0, 0.1, 'square', 0.15, 90);
}
// Patlama: derin gurultu + alcak gumbur + keskin carpma
function playExplosion() {
  noise(0, 0.6, 0.9, 'lowpass', 900, 2);
  tone(100, 0, 0.5, 'sine', 1.0, 28);
  noise(0, 0.15, 0.5, 'lowpass', 3000, 4);
}
// Patlayici zombinin fitil "bip" sesi
function playFuse() {
  tone(1200, 0, 0.05, 'square', 0.15);
}

// Dash "vuuus" sesi
function playDash() {
  noise(0, 0.18, 0.35, 'highpass', 2500, 1.5);
  tone(300, 0, 0.15, 'sine', 0.15, 700);
}
// Zombi inlemesi (firlatilinca)
function playZombieGroan() {
  tone(170, 0, 0.4, 'sawtooth', 0.3, 60);
  tone(120, 0.05, 0.35, 'square', 0.12, 45);
  noise(0, 0.1, 0.2, 'lowpass', 800, 2);
}

// Shotgun: gur patlama + keskin "crack" + pompa "klak-klak"
function playShotgun() {
  noise(0, 0.4, 1.0, 'lowpass', 2200, 2.5);
  tone(110, 0, 0.3, 'sawtooth', 0.6, 35);
  noise(0, 0.08, 0.7, 'highpass', 1500, 3);
  tone(210, 0.28, 0.04, 'square', 0.2, 120);   // pompa ileri
  tone(150, 0.36, 0.05, 'square', 0.2, 90);    // pompa geri
}
// Shotgun alinca pompa sesi
function playPump() {
  tone(210, 0, 0.04, 'square', 0.25, 120);
  tone(150, 0.1, 0.05, 'square', 0.25, 90);
  noise(0, 0.05, 0.2, 'highpass', 2500, 2);
}

// Dalga basladi: alcak boru gibi uyari
function playWaveStart() {
  tone(110, 0, 0.6, 'sawtooth', 0.3, 80);
  tone(165, 0.05, 0.55, 'sawtooth', 0.15, 120);
  noise(0, 0.25, 0.25, 'lowpass', 600, 2);
}
// Dalga bitti: yukselen zil
function playWaveEnd() {
  tone(523, 0, 0.15, 'triangle', 0.35);
  tone(659, 0.12, 0.15, 'triangle', 0.35);
  tone(784, 0.24, 0.35, 'triangle', 0.35);
}
// Satin alma: coin sesi
function playBuy() {
  tone(988, 0, 0.08, 'square', 0.18);
  tone(1319, 0.08, 0.28, 'square', 0.18);
}
// Yetersiz coin / zaten var
function playDeny() { tone(150, 0, 0.18, 'square', 0.25, 90); }
// Magaza acma-kapama
function playShopTick() { tone(660, 0, 0.05, 'triangle', 0.2, 880); }
// Hasar alinca
function playHurt() {
  tone(180, 0, 0.2, 'sawtooth', 0.4, 60);
  noise(0, 0.12, 0.3, 'lowpass', 500, 2);
}
// Can 1 iken kalp atisi
function playHeartbeat() {
  tone(65, 0, 0.12, 'sine', 0.8, 40);
  tone(55, 0.18, 0.14, 'sine', 0.6, 35);
}

// Tukuruk hazirlama: balgam sesi
function playSpitWind() {
  noise(0, 0.25, 0.2, 'bandpass', 700, 1.5);
  tone(180, 0, 0.25, 'sawtooth', 0.12, 330);
}
// Tukuruk firlatma
function playSpit() {
  noise(0, 0.12, 0.35, 'bandpass', 1400, 2);
  tone(500, 0, 0.14, 'sine', 0.2, 180);
}
// Tukuruk yere carpar: islak "splat"
function playSplat() {
  noise(0, 0.14, 0.45, 'lowpass', 1200, 2);
  tone(160, 0, 0.12, 'sine', 0.35, 60);
}
// Zehir hasari
function playPoisonTick() {
  tone(120, 0, 0.14, 'sine', 0.4, 70);
  tone(320, 0.02, 0.08, 'triangle', 0.15, 200);
}
// Olum
function playDeath() {
  tone(260, 0, 0.7, 'sawtooth', 0.35, 45);
  tone(196, 0.18, 0.8, 'square', 0.18, 38);
  noise(0, 0.5, 0.3, 'lowpass', 500, 2);
}

// ---- Konumsal sesler (zombi hirilti, ayak sesi, ambiyans) ----
function spatialVol(x, y, maxd) {
  const c = center();
  return Math.max(0, 1 - Math.hypot(x - c.x, y - c.y) / (maxd || 240));
}
function panOf(x) { return Math.max(-0.8, Math.min(0.8, (x - W / 2) / (W / 2))); }

// Titresimli, filtreli "ses" (hirilti icin): f0->f1 kayar, vib = titresim hizi
function voice(o) {
  const a = ac(), t = a.currentTime;
  const osc = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
  osc.type = o.type || 'sawtooth';
  osc.frequency.setValueAtTime(o.f0, t);
  osc.frequency.exponentialRampToValueAtTime(o.f1, t + o.dur);
  if (o.vib) {
    const l = a.createOscillator(), lg = a.createGain();
    l.frequency.value = o.vib;
    lg.gain.value = o.f0 * 0.07;
    l.connect(lg);
    lg.connect(osc.frequency);
    l.start(t);
    l.stop(t + o.dur + 0.05);
  }
  f.type = 'lowpass';
  f.frequency.value = o.cut || 500;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(o.vol, t + o.dur * 0.2);
  g.gain.exponentialRampToValueAtTime(0.001, t + o.dur);
  osc.connect(f);
  f.connect(g);
  if (a.createStereoPanner) {
    const p = a.createStereoPanner();
    p.pan.value = o.pan || 0;
    g.connect(p);
    p.connect(sfxBus);
  } else {
    g.connect(sfxBus);
  }
  osc.start(t);
  osc.stop(t + o.dur + 0.05);
}

// Zombi hirilti: tipe gore farkli ses, uzaktaki kisik ve sag/sol kulaga gider
function playGrowl(z) {
  const cx = z.x + (z.half || 8), cy = z.y + (z.half || 8);
  const v = spatialVol(cx, cy);
  if (v <= 0.05) return;
  const pan = panOf(cx);
  if (z.tank) {
    voice({ f0: 70, f1: 38, dur: 1.1, vol: 0.2 + 0.4 * v, type: 'sawtooth', cut: 280, pan, vib: 9 });
    noise(0, 0.6, 0.15 * v, 'lowpass', 400, 1.5);
  } else if (z.mega) {
    voice({ f0: 140, f1: 55, dur: 1.0, vol: 0.2 + 0.3 * v, type: 'square', cut: 600, pan, vib: 18 });   // guruldayan hirilti
    noise(0, 0.5, 0.15 * v, 'bandpass', 600, 1.2);
  } else if (z.necro) {
    voice({ f0: 330, f1: 230, dur: 1.3, vol: 0.12 + 0.12 * v, type: 'sine', cut: 1500, pan, vib: 8 });   // ürpertici fısıltı
    noise(0, 0.9, 0.08 * v, 'bandpass', 1800, 1);
  } else if (z.skeleton) {
    for (let i = 0; i < 4; i++) noise(i * 0.05, 0.025, 0.12 * v, 'highpass', 3200, 3);               // kemik takırtısı
  } else if (z.police) {
    const base = 110 + Math.random() * 50;
    voice({ f0: base * 1.6, f1: base * 0.8, dur: 0.5, vol: 0.22 * v, type: 'square', cut: 700, pan, vib: 9 });
    noise(0, 0.3, 0.07 * v, 'bandpass', 800, 1);
  } else if (z.spitter) {
    voice({ f0: 210, f1: 120, dur: 0.5, vol: 0.2 * v, type: 'square', cut: 700, pan, vib: 22 });   // guruldama
  } else if (z.explosive) {
    voice({ f0: 150, f1: 90, dur: 0.5, vol: 0.2 * v, type: 'sawtooth', cut: 500, pan, vib: 14 });
  } else {
    const base = 80 + Math.random() * 60;
    voice({ f0: base * 1.5, f1: base * 0.7, dur: 0.6 + Math.random() * 0.5, vol: 0.24 * v,
            type: 'sawtooth', cut: 380 + Math.random() * 200, pan, vib: 5 + Math.random() * 5 });
    noise(0, 0.3, 0.05 * v, 'bandpass', 500, 1);   // soluk hirilti
  }
}
function playZombieDie(z) {
  const cx = z.x + (z.half || 8), cy = z.y + (z.half || 8);
  const v = Math.max(0.25, spatialVol(cx, cy, 300));
  if (z.tank) {
    voice({ f0: 80, f1: 25, dur: 1.6, vol: 0.6, type: 'sawtooth', cut: 300, pan: panOf(cx), vib: 7 });
    noise(0, 1.0, 0.4, 'lowpass', 600, 1.5);
    tone(60, 0.1, 0.8, 'sine', 0.5, 25);
    return;
  }
  if (z.necro) { playNecroDeath(); return; }
  if (z.mega) {
    voice({ f0: 160, f1: 28, dur: 1.8, vol: 0.55, type: 'square', cut: 500, pan: panOf(cx), vib: 16 });
    noise(0, 1.2, 0.45, 'lowpass', 700, 1.3);
    tone(55, 0.1, 0.9, 'sine', 0.5, 22);
    return;
  }
  if (z.skeleton) { playBones(); return; }
  voice({ f0: 200, f1: 55, dur: 0.45, vol: 0.28 * v, type: 'sawtooth', cut: 450, pan: panOf(cx), vib: 12 });
  noise(0, 0.16, 0.3 * v, 'lowpass', 900, 2);       // islak "splat"
}
// Necromancer asayi kaldirir
function playNecroCast() {
  voice({ f0: 140, f1: 320, dur: 0.9, vol: 0.22, type: 'sine', cut: 900, vib: 6 });
  noise(0, 0.8, 0.12, 'bandpass', 900, 1);
  tone(60, 0, 0.9, 'sine', 0.25, 95);
}
// Iskelet topraktan cikar: kemik takirtisi + gum
function playNecroSummon() {
  for (let i = 0; i < 6; i++) noise(i * 0.04, 0.03, 0.22, 'highpass', 3000, 3);
  tone(80, 0, 0.4, 'sine', 0.35, 40);
  tone(500, 0.02, 0.3, 'sawtooth', 0.1, 120);
}
function playBones() {
  for (let i = 0; i < 5; i++) noise(i * 0.045, 0.03, 0.22, 'highpass', 2800 + Math.random() * 1200, 3);
  tone(260, 0, 0.15, 'triangle', 0.12, 120);
}
// Necromancer olurken: uzun, katmanli, urpertici olum cigligi
function playNecroDeath() {
  voice({ f0: 640, f1: 45, dur: 2.8, vol: 0.5, type: 'sawtooth', cut: 2400, vib: 15 });
  voice({ f0: 452, f1: 32, dur: 3.0, vol: 0.4, type: 'square', cut: 1100, vib: 8 });     // uyumsuz ikinci ses
  voice({ f0: 90, f1: 28, dur: 3.2, vol: 0.55, type: 'sawtooth', cut: 260, vib: 4 });    // derin hirilti
  noise(0, 2.2, 0.35, 'bandpass', 1400, 0.8);                                            // hisleme
  noise(0.4, 1.8, 0.3, 'lowpass', 250, 0.8);
  for (let i = 0; i < 6; i++) tone(1800 + Math.random() * 1800, 0.2 + i * 0.22, 0.25, 'sawtooth', 0.06, 300);
  tone(40, 0.6, 2.0, 'sine', 0.5, 20);
}
// Polis zombinin bicak savurusu
function playKnife() {
  noise(0, 0.1, 0.25, 'highpass', 3500, 2);
  tone(1800, 0, 0.12, 'sawtooth', 0.08, 700);
}
function playTankRoar() {
  voice({ f0: 95, f1: 40, dur: 1.3, vol: 0.6, type: 'sawtooth', cut: 420, vib: 11 });
  noise(0, 0.9, 0.35, 'lowpass', 500, 1.5);
}
// kind: 'heavy' (tank/mega), 'bone' (iskelet) veya bos (normal)
function playFootstep(x, y, kind) {
  const heavy = kind === 'heavy';
  const v = spatialVol(x, y, heavy ? 300 : 120);
  if (v <= 0.05) return;
  if (kind === 'bone') {
    noise(0, 0.03, 0.14 * v, 'highpass', 3500, 3);
    tone(1700, 0, 0.02, 'square', 0.04 * v);
    return;
  }
  if (heavy) {
    tone(70, 0, 0.18, 'sine', 0.5 * v, 35);
    noise(0, 0.12, 0.3 * v, 'lowpass', 300, 2);
  } else {
    noise(0, 0.07, 0.1 * v, 'lowpass', 700 + Math.random() * 300, 3);   // surunen adim
  }
}
function playPlayerStep() {
  noise(0, 0.05, 0.06, 'highpass', 1500 + Math.random() * 600, 3);
  tone(95 + Math.random() * 20, 0, 0.05, 'sine', 0.06, 60);
}

// ---- Ambiyans: ruzgar (surekli) + cekirge / baykus / uzaktan zombi inlemesi ----
let amb = null;
function startAmbience() {
  if (amb) return;
  const a = ac();
  const buf = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {                 // kahverengi gurultu = ruzgar
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
  const src = a.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const f = a.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 520;
  const g = a.createGain();
  const t = a.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.08, t + 2);
  const lfo = a.createOscillator(), lg = a.createGain();   // ruzgar esip hafifler
  lfo.frequency.value = 0.13;
  lg.gain.value = 0.04;
  lfo.connect(lg);
  lg.connect(g.gain);
  src.connect(f);
  f.connect(g);
  g.connect(sfxBus);
  src.start(t);
  lfo.start(t);
  amb = { src, lfo, g, base: 0.08, duck: false, cricketT: 2, owlT: 20 + Math.random() * 20, farT: 8 + Math.random() * 8 };
}
function stopAmbience() {
  if (!amb) return;
  const o = amb;
  amb = null;
  const t = audioCtx.currentTime;
  o.g.gain.cancelScheduledValues(t);
  o.g.gain.setValueAtTime(o.g.gain.value, t);
  o.g.gain.linearRampToValueAtTime(0, t + 1.2);
  setTimeout(() => { try { o.src.stop(); o.lfo.stop(); o.g.disconnect(); } catch (e) {} }, 1500);
}
function duckAmbience(on) {
  if (!amb) return;
  const t = audioCtx.currentTime;
  amb.duck = on;
  amb.g.gain.cancelScheduledValues(t);
  amb.g.gain.setTargetAtTime(amb.base * (on ? 0.3 : 1), t, 0.1);
}
function ambienceTick(dt) {
  if (!amb || amb.duck) return;
  const calm = wave.phase === 'break';
  amb.cricketT -= dt;
  if (amb.cricketT <= 0) {
    amb.cricketT = 0.5 + Math.random() * 1.6;
    if (night > 0.3 && (calm || Math.random() < 0.35)) {
      const f0 = 4300 + Math.random() * 300;
      for (let i = 0; i < 3; i++) tone(f0, i * 0.07, 0.04, 'sine', calm ? 0.02 : 0.012, f0 + 300);
    }
  }
  amb.owlT -= dt;
  if (amb.owlT <= 0) {
    amb.owlT = 25 + Math.random() * 30;
    if (night > 0.3) {
      tone(420, 0, 0.25, 'sine', 0.09, 380);
      tone(390, 0.38, 0.3, 'sine', 0.08, 330);
    }
  }
  amb.farT -= dt;
  if (amb.farT <= 0) {                                  // uzaktan zombi inlemesi
    amb.farT = 10 + Math.random() * 14;
    voice({ f0: 110, f1: 60, dur: 1.3, vol: 0.07, type: 'sawtooth', cut: 220, pan: (Math.random() - 0.5) * 1.6, vib: 6 });
  }
}

// ================== GIRDI ==================
const keys = {};
let pressedE = false; // E'ye basildigi an (tek seferlik)
let pressedDash = false; // Shift'e basildigi an (tek seferlik)
// Tus konumuna (e.code) bakiyoruz: klavye dili/duzeni (Turkce Q/F, CapsLock) fark etmez
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (!e.repeat && e.code === 'KeyE' && gameState === 'playing') pressedE = true;
  if (!e.repeat && (e.code === 'ShiftLeft' || e.code === 'ShiftRight') && gameState === 'playing') pressedDash = true;
  if (!e.repeat && e.code === 'KeyR' && player.hp <= 0 && gameState === 'playing' && deathT > 0.6) restartRun();
  if (!e.repeat && e.code === 'KeyM' && player.hp <= 0 && gameState === 'playing' && deathT > 0.6) showMenu();
  if (shop.open) {                       // magaza aciksa 1/2 satin alir
    if (!e.repeat && e.code === 'Digit1') buyItem('medkit');
    if (!e.repeat && e.code === 'Digit2') buyItem('shotgun');
  } else {
    if (e.code === 'Digit1') player.weapon = 'glock';
    if (e.code === 'Digit2' && player.hasShotgun) player.weapon = 'shotgun';
  }
  if (!e.repeat && e.code === 'KeyH' && gameState === 'playing') useMedkit();
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
addEventListener('keyup', e => keys[e.code] = false);
// Sekme/pencere degisince basili tuslar takili kalmasin
addEventListener('blur', () => {
  for (const k in keys) keys[k] = false;
  if (gameState === 'playing' && player.hp > 0) pauseGame();   // pencere degisince otomatik duraklat
});

const mouse = { x: W / 2, y: H / 2 };
canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - r.left) * W / r.width;
  mouse.y = (e.clientY - r.top) * H / r.height;
});
canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  if (gameState === 'playing' && player.hp <= 0) { deathClick(); return; }
  if (shop.open && gameState === 'playing') shopClick();
  else shoot();
});
canvas.addEventListener('contextmenu', e => e.preventDefault());

// ================== OYUN DURUMU ==================
let player, zombies, bullets, corpses, drops, medics, score, spawnTimer, dropTimer, elapsed;
let particles, scorches, shockwaves, shake;
let hitSndT = 0; // vurus sesi spam olmasin diye
let wave, coins, shop, msg, floats;
let hurtFlash = 0, heartTimer = 0, poisonFlash = 0;
let puddles, spits, stats, deathInfo, deathT = 0;
let blood = [];
let stage = 'street', trans = null, bossFlash = null;
let night = 0, growlT = 3, tankRoarT = 0, stepSndT = 0, playerStepPhase = 0;

function restartRun() {
  reset();
  startAmbience();
  if (typeof startMusic === 'function') startMusic('game');
}

function reset() {
  player = {
    x: W / 2 - 8, y: H / 2 - 8,
    speed: 70, hp: MAX_HP, hurtTimer: 0,
    walking: false, animTime: 0,
    face: 1,
    fireTimer: 0, cooldown: 0, recoil: 0,
    dashTimer: 0, dashCd: 0, dashDir: { x: 1, y: 0 }, dashKills: 0,
    weapon: 'glock', hasShotgun: false, medkits: 0,
    poison: 0, poisonTick: 0, slow: 1, vx: 0, vy: 0,
  };
  zombies = [];
  bullets = [];
  corpses = [];
  particles = [];
  scorches = [];
  shockwaves = [];
  shake = 0;
  drops = [];
  medics = [];
  score = 0;
  spawnTimer = 1;
  dropTimer = FIRST_DROP;
  elapsed = 0;
  coins = 0;
  shop = { visible: false, slide: 0, open: false, x: W + 8, y: 62 };
  msg = null;
  floats = [];
  hurtFlash = 0;
  heartTimer = 0;
  poisonFlash = 0;
  puddles = [];
  spits = [];
  blood = [];
  stage = 'street';
  trans = null;
  bossFlash = null;
  growlT = 3;
  tankRoarT = 0;
  stats = { shots: 0, hits: 0, dashes: 0, damage: 0, medkits: 0 };
  deathInfo = null;
  deathT = 0;
  startWave(1);
}
reset();

function center() { return { x: player.x + 8, y: player.y + 8 }; }
function aimAngle() {
  const c = center();
  return Math.atan2(mouse.y - c.y, mouse.x - c.x);
}
function nearPlayer(o) {
  const c = center();
  return Math.hypot(c.x - o.x, c.y - o.y) < INTERACT_DIST;
}

function shoot() {
  if (gameState !== 'playing' || player.hp <= 0 || player.cooldown > 0) return;
  const a = aimAngle();
  const c = center();
  const shot = { hit: false };   // ayni atistan cikan mermiler tek isabet sayilir
  stats.shots++;

  if (player.weapon === 'shotgun') {
    // tek tikla yelpaze seklinde sacma
    for (let i = 0; i < SHOTGUN_PELLETS; i++) {
      const t = SHOTGUN_PELLETS > 1 ? i / (SHOTGUN_PELLETS - 1) - 0.5 : 0;
      const pa = a + t * SHOTGUN_SPREAD + (Math.random() - 0.5) * 0.08;
      const sp = 240 + Math.random() * 50;
      bullets.push({
        x: c.x + Math.cos(a) * 16,
        y: c.y + Math.sin(a) * 16,
        vx: Math.cos(pa) * sp,
        vy: Math.sin(pa) * sp,
        life: 0.35,       // kisa menzil
        pellet: true,
        shot,
      });
    }
    player.cooldown = SHOTGUN_COOLDOWN;
    player.fireTimer = 0.08;
    player.recoil = 0.12;
    shake = Math.max(shake, 4);
    // namlu ucunda kivilcim ve duman
    const mx = c.x + Math.cos(a) * 20, my = c.y + Math.sin(a) * 20;
    addParticles(mx, my, 10, ['#ffe066', '#ff9922', '#fff3b0'],
      { speed: 150, angle: a, spread: 0.7, life: 0.18, size: 2 });
    addParticles(mx, my, 6, ['#888888', '#aaaaaa', '#666666'],
      { speed: 40, angle: a, spread: 0.9, life: 0.6, size: 3, grav: -15 });
    playShotgun();
    return;
  }

  bullets.push({
    x: c.x + Math.cos(a) * 14,
    y: c.y + Math.sin(a) * 14,
    vx: Math.cos(a) * 260,
    vy: Math.sin(a) * 260,
    life: 1.2,
    shot,
  });
  player.cooldown = 0.15;
  player.fireTimer = 0.07;
  player.recoil = 0.07;
  shake = Math.max(shake, 1.2);
  playShot();
}

function spawnZombie() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  if (side === 0) { x = Math.random() * W; y = -16; }
  else if (side === 1) { x = W; y = Math.random() * H; }
  else if (side === 2) { x = Math.random() * W; y = H; }
  else { x = -16; y = Math.random() * H; }
  // zamanla patlayan zombi orani artar (en fazla %30)
  const explosive = wave.n >= 2 && Math.random() < Math.min(0.1 + (wave.n - 2) * 0.04, 0.3);
  // belli bir dalgadan sonra tukuruk zombisi cikar (en fazla %25)
// game.js -> spawnZombie() fonksiyonunda çarpan güncellemesi:
const playerCount = Object.keys(remotePlayers).length + 1;

// Zombi canı ve hızını oyuncu sayısına göre arttırma (Çok daha zorlu dalgalar)
const multiplier = 1 + (playerCount - 1) * 0.75; 
zombies.push({
  x, y, 
  hp: Math.ceil((police ? 3 : 2) * multiplier),
  speed: (18 + Math.random() * 14 + Math.min((wave.n - 1) * 4, 30)) * multiplier
  // ... diğer özellikler
});
  const spitter = !explosive && wave.n >= SPITTER_MIN_WAVE &&
    Math.random() < Math.min(0.12 + (wave.n - SPITTER_MIN_WAVE) * 0.03, 0.25);
  // polis istasyonunda bicakli polis zombiler (yarisi kapidan cikar)
  const police = stage === 'police' && !explosive && !spitter && Math.random() < 0.5;
  if (police && Math.random() < 0.5) { x = POLICE_DOOR.x - 8 + Math.random() * 16; y = POLICE_DOOR.y; }
  zombies.push({
    x, y, hp: police ? 3 : 2,
    speed: (spitter
      ? 18 + Math.random() * 8
      : police
      ? 28 + Math.random() * 10 + Math.min((wave.n - 8) * 2, 14)
      : explosive
      ? 26 + Math.random() * 14
      : 18 + Math.random() * 14 + Math.min((wave.n - 1) * 3, 25)) * DIFFICULTY[settings.difficulty].speed,
    spitter, police,
    state: 'walk', stateT: 0, lungeCd: 1 + Math.random(), cdir: { x: 1, y: 0 },
    spitCd: 1 + Math.random() * 1.5,
    windup: null,   // tukurmeden once dolar
    moving: true,
    animTime: Math.random(),
    face: 1,
    explosive,
    fuse: null,   // patlayici zombi oyuncuya yaklasinca sayac baslar
    flash: 0,     // vurulunca beyaz yanip sonme
    flung: null,  // dash ile firlatilinca dolar
    dead: false,
  });
}

function spawnDrop() {
  drops.push({
    x: 24 + Math.random() * (W - 48),        // yatay konum
    y: -20,                                   // yukaridan baslar
    targetY: 40 + Math.random() * (H - 80),  // dusecegi yer
    landed: false,
  });
}

// ================== DALGA / MAGAZA / HASAR ==================
function showMsg(title, sub, color, dur, size, extra) {
  msg = { title, sub, color, dur, size: size || 24, extra: extra || '', t: 0 };
}
function addFloat(text, x, y, color) {
  floats.push({ text, x, y, color, t: 0, dur: 1.2 });
}

// Boss cikarir (tank / mega tukurucu / necromancer)
function spawnBoss(info) {
  const kind = info.kind, tier = info.tier;
  const left = Math.random() < 0.5;
  const diff = DIFFICULTY[settings.difficulty];
  const bi = BOSS_INFO[kind];
  const z = {
    boss: true, bossName: bi.name, barColor: bi.bar,
    y: 30 + Math.random() * (H - 90),
    spitter: false, windup: null, moving: true,
    animTime: 0, face: left ? 1 : -1,
    explosive: false, fuse: null, flash: 0, flung: null, dead: false,
  };
  if (kind === 'tank') {
    const hp = TANK_HP + (tier - 1) * 12;
    Object.assign(z, { tank: true, size: 24, half: 12, hp, maxHp: hp, speed: TANK_SPEED * diff.speed,
      state: 'walk', stateT: 0, atkCd: 3, cdir: { x: 1, y: 0 } });
  } else if (kind === 'mega') {
    const hp = MEGA_HP + (tier - 1) * 14;
    Object.assign(z, { mega: true, size: 32, half: 16, hp, maxHp: hp, speed: MEGA_SPEED * diff.speed,
      spitCd: 2.5, atkN: 0 });
  } else {
    const hp = NECRO_HP + (tier - 1) * 12;
    Object.assign(z, { necro: true, size: 24, half: 12, hp, maxHp: hp, speed: NECRO_SPEED * diff.speed,
      summonCd: 2 });
  }
  z.x = left ? -z.size : W;
  zombies.push(z);
  showMsg(bi.msg, bi.sub, kind === 'necro' ? '#c070ff' : (kind === 'mega' ? '#7aff4a' : '#ff5555'), 2.4, 20);
  (kind === 'necro' ? playNecroCast : playTankRoar)();
  shake = Math.max(shake, 5);
}

// Mega tukurucunun saldirilari: yelpaze -> dev tukuruk -> zehir halkasi (can azalinca)
function megaAttack(z) {
  const c = center();
  const sx = z.x + z.half + z.face * 10, sy = z.y + 10;
  let pat = z.atkN % 3;
  if (pat === 2 && z.hp > z.maxHp * 0.6) pat = 0;
  const base = Math.atan2(c.y - sy, c.x - sx);
  const d = Math.min(Math.hypot(c.x - sx, c.y - sy), 150);
  if (pat === 0) {                                      // 3'lu yelpaze
    for (const off of [-0.32, 0, 0.32]) {
      launchSpit(sx, sy, sx + Math.cos(base + off) * d, sy + Math.sin(base + off) * d, { r: 14, time: 8 });
    }
  } else if (pat === 1) {                               // dev tukuruk, buyuk zehir golu
    launchSpit(sx, sy, c.x + player.vx * 0.35, c.y + player.vy * 0.35, { r: MEGA_BIG_R, time: 10, speed: 80 });
  } else {                                              // etrafa zehir halkasi
    const cx = z.x + z.half, cy = z.y + z.half;
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.random() * 0.3;
      launchSpit(cx, cy, cx + Math.cos(a) * 62, cy + Math.sin(a) * 62, { r: 12, time: 7 });
    }
  }
}

function spawnSkeleton(x, y) {
  x = Math.max(0, Math.min(W - 16, x));
  y = Math.max(8, Math.min(H - 16, y));
  zombies.push({
    x, y, hp: 1,
    speed: (36 + Math.random() * 10) * DIFFICULTY[settings.difficulty].speed,
    skeleton: true, size: 16, half: 8, rise: SKEL_RISE,
    spitter: false, windup: null, moving: true,
    animTime: Math.random(), face: 1,
    explosive: false, fuse: null, flash: 0, flung: null, dead: false,
  });
  addParticles(x + 8, y + 14, 12, ['#e8e4d0', '#a8a48c', '#7a30c0'],
    { speed: 50, angle: -Math.PI / 2, spread: 2.2, life: 0.5, size: 2, grav: 80 });
}
function necroSummon(z) {
  const alive = zombies.filter(o => o.skeleton && !o.dead).length;
  const n = Math.min(SKEL_MAX - alive, z.hp < z.maxHp / 2 ? 2 : 1);   // can azalinca 2 iskelet
  if (n <= 0) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 14;
    spawnSkeleton(z.x + z.half - 8 + Math.cos(a) * d, z.y + z.half - 4 + Math.sin(a) * d);
  }
  addParticles(z.x + z.half, z.y + z.half, 14, ['#c060ff', '#7a30c0', '#f0d0ff'], { speed: 70, life: 0.5, size: 2 });
  playNecroSummon();
  shake = Math.max(shake, 1.5);
}

// 8. dalgada polis istasyonuna gecis (ekran kararir, zemin degisir)
function startTransition() {
  trans = { t: 0, dur: 3.2, swapped: false };
}

function startWave(n) {
  const total = 6 + (n - 1) * 4;   // 1. dalga 6, sonra her dalga +4 zombi
  wave = { n, phase: 'intro', t: INTRO_TIME, total, spawned: 0, spawnTimer: 0.5, boss: false, bossInfo: bossFor(n) };
  if (n === POLICE_WAVE && stage !== 'police') {
    startTransition();
    wave.t = 3.4;                       // gecis bitene kadar zombi cikmaz
  }
  coins += COIN_PER_WAVE;
  showMsg('DALGA ' + n, total + ' ZOMBİ GELİYOR', '#ff5555', INTRO_TIME, 24, '+' + COIN_PER_WAVE + ' COIN');
  addFloat('+' + COIN_PER_WAVE, W - 36, 24, '#ffd54a');
  if (gameState === 'playing') playWaveStart();
}
function endWave() {
  wave.phase = 'break';
  wave.t = BREAK_TIME;
  shop.visible = true;
  showMsg('DALGA ' + wave.n + ' TAMAMLANDI', 'MAĞAZA AÇILDI', '#7cff6b', 2.5, 14);
  playWaveEnd();
}
function updateWave(dt) {
  if (wave.phase === 'intro') {
    wave.t -= dt;
    if (wave.t <= 0) wave.phase = 'fight';
  } else if (wave.phase === 'fight') {
    if (wave.bossInfo && !wave.boss && wave.spawned >= 2) {
      wave.boss = true;
      spawnBoss(wave.bossInfo);
    }
    if (wave.spawned < wave.total) {
      wave.spawnTimer -= dt;
      if (wave.spawnTimer <= 0) {
        spawnZombie();
        wave.spawned++;
        wave.spawnTimer = Math.max(0.45, 1.5 - wave.n * 0.08) * (0.6 + Math.random() * 0.8)
          * DIFFICULTY[settings.difficulty].spawn;
      }
    } else if (zombies.length === 0 && (wave.boss || !wave.bossInfo)) {
      endWave();                     // hepsi oldu: mola basla
    }
  } else if (wave.phase === 'break') {
    wave.t -= dt;
    if (wave.t <= 0) {               // mola bitti: magaza kapanir, yeni dalga
      shop.visible = false;
      shop.open = false;
      startWave(wave.n + 1);
    }
  }
}

function hurtPlayer(n, src, soft) {
  if (player.hp <= 0) return;
  player.hp -= n;
  stats.damage += n;
  if (!soft) {                // vurulunca kan fiskirir
    const c = center();
    bloodBurst(c.x, c.y, 0, 18, { speed: 90, size: 3, life: 0.5 });
    bloodPool(c.x, c.y + 6, 4, 5);
  }
  if (soft) {                 // zehir: kisa yesil parlama, sarsinti yok
    poisonFlash = 0.3;
    playPoisonTick();
  } else {
    player.hurtTimer = 0.8;
    hurtFlash = 0.5;
    shake = Math.max(shake, player.hp <= 0 ? 6 : 3);
    playHurt();
  }
  if (player.hp <= 0) onDeath(src || 'zombie');
}

function useMedkit() {
  if (player.hp <= 0 || player.medkits <= 0) return;
  if (player.hp >= MAX_HP) { addFloat('CAN DOLU', player.x + 8, player.y - 4, '#ffffff'); return; }
  player.medkits--;
  stats.medkits++;
  player.hp = MAX_HP;
  player.poison = 0;
  playHeal();
  addFloat('+CAN', player.x + 8, player.y - 4, '#66ff88');
}

function nearShop(d) {
  return Math.hypot(player.x + 8 - (shop.x + 16), player.y + 8 - (shop.y + 44)) < d;
}
function shopRects() {
  const px = Math.round(shop.x) - 122, py = shop.y + 6;
  return {
    panel: { x: px, y: py, w: 116, h: 60 },
    rows: [
      { id: 'medkit',  x: px + 4, y: py + 16, w: 108, h: 15 },
      { id: 'shotgun', x: px + 4, y: py + 32, w: 108, h: 15 },
    ],
  };
}
function buyItem(id) {
  if (!shop.open) return;
  const price = id === 'medkit' ? MEDKIT_PRICE : SHOTGUN_PRICE;
  const fx = shop.x - 60, fy = shop.y;
  if (id === 'shotgun' && player.hasShotgun) { playDeny(); addFloat('ZATEN VAR', fx, fy, '#ffffff'); return; }
  if (coins < price) { playDeny(); addFloat('YETERSİZ COIN', fx, fy, '#ff6666'); return; }
  coins -= price;
  if (id === 'medkit') {
    player.medkits++;
  } else {
    player.hasShotgun = true;
    player.weapon = 'shotgun';
  }
  playBuy();
  addFloat('-' + price, fx, fy, '#ffd54a');
}
function shopClick() {
  for (const r of shopRects().rows) {
    if (mouse.x >= r.x && mouse.x <= r.x + r.w && mouse.y >= r.y && mouse.y <= r.y + r.h) {
      buyItem(r.id);
      return;
    }
  }
}

// ================== EFEKTLER ==================
function addParticles(x, y, n, colors, o) {
  o = Object.assign({ speed: 60, angle: 0, spread: Math.PI * 2, life: 0.4, size: 2, grav: 0 }, o);
  for (let i = 0; i < n; i++) {
    const a = o.angle + (Math.random() - 0.5) * o.spread;
    const sp = o.speed * (0.4 + Math.random() * 0.8);
    const life = o.life * (0.6 + Math.random() * 0.8);
    particles.push({
      x, y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life, max: life,
      size: 1 + Math.floor(Math.random() * o.size),
      grav: o.grav,
      stain: !!o.stain,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function explode(z) {
  const cx = z.x + 8, cy = z.y + 8;
  playExplosion();
  shake = Math.max(shake, 6);
  shockwaves.push({ x: cx, y: cy, t: 0 });
  scorches.push({ x: cx, y: cy, t: 0 });
  addParticles(cx, cy, 30, ['#ffe066', '#ff9922', '#ff5511'], { speed: 140, life: 0.5, size: 3 });
  addParticles(cx, cy, 16, ['#555555', '#777777', '#333333'], { speed: 70, life: 0.9, size: 3, grav: -25 });
  addParticles(cx, cy, 12, ['#6a9a3a', '#4a7a2a'], { speed: 110, life: 0.7, size: 2, grav: 140 });

  // oyuncu alan icindeyse hasar alir
  const c = center();
  if (player.hp > 0 && player.hurtTimer <= 0 && player.dashTimer <= 0 &&
      Math.hypot(c.x - cx, c.y - cy) < EXPLOSION_RADIUS) {
    hurtPlayer(EXPLOSION_DAMAGE, 'explosion');
  }
  // yakindaki zombiler de zarar gorur (zincirleme patlama olabilir)
  for (const o of zombies) {
    if (o === z || o.dead) continue;
    if (Math.hypot(o.x + 8 - cx, o.y + 8 - cy) < EXPLOSION_RADIUS) {
      o.hp -= 2;
      o.flash = 0.1;
      if (o.hp <= 0) killZombie(o, Math.sign(o.x - z.x) || 1);
    }
  }
}

// Dash ile carpilan zombi arkaya firlar, inler ve firlatma bitince oler
function flingZombie(z, dir) {
  z.fuse = null;
  z.flash = 0.15;
  z.flung = { vx: dir.x * FLING_SPEED, vy: dir.y * FLING_SPEED, t: FLING_TIME, dir: Math.sign(dir.x) || 1 };
  playZombieGroan();
  playHit();
  shake = Math.max(shake, 2.5);
  addParticles(z.x + 8, z.y + 8, 10, ['#b01818', '#e03030', '#ffffff'],
    { speed: 90, angle: Math.atan2(dir.y, dir.x), spread: 1.4, life: 0.35, size: 2, grav: 80 });
}

function killZombie(z, dir) {
  if (z.dead) return;
  z.dead = true;
  z.hp = 0;
  score++;
  const half = z.half || 8;
  const cx = z.x + half, cy = z.y + half;
  const BONE = ['#e8e4d0', '#a8a48c', '#ffffff'];
  if (z.tank) {
    score += 4;
    coins += TANK_REWARD;
    addFloat('+' + TANK_REWARD, cx, z.y - 4, '#ffd54a');
    shake = Math.max(shake, 8);
    bloodBurst(cx, cy, 0, 60, { speed: 150, size: 4, life: 0.7 });
    bloodPool(cx, cy + 8, 13, 26);
    showMsg('TANK ÖLDÜ!', '+' + TANK_REWARD + ' COIN', '#ffe066', 1.8, 18);
  } else if (z.mega) {
    score += 4;
    coins += MEGA_REWARD;
    addFloat('+' + MEGA_REWARD, cx, z.y - 4, '#ffd54a');
    shake = Math.max(shake, 9);
    addParticles(cx, cy, 50, ['#7be04a', '#4aa02c', '#b8ff7a', '#d8ff6a'], { speed: 150, life: 0.8, size: 4, grav: 100 });
    puddles.push({ x: cx, y: cy + 6, t: 0, r: 30, life: 10, seed: Math.random() * 10 });   // olunce dev zehir golu birakir
    playSplat();
    bossFlash = { t: 0, dur: 0.5, rgb: '120,255,60' };
    showMsg('MEGA TÜKÜRÜCÜ ÖLDÜ!', '+' + MEGA_REWARD + ' COIN', '#ffe066', 1.8, 16);
  } else if (z.necro) {
    score += 6;
    coins += NECRO_REWARD;
    addFloat('+' + NECRO_REWARD, cx, z.y - 4, '#ffd54a');
    shake = Math.max(shake, 12);
    addParticles(cx, cy, 60, ['#c060ff', '#7a30c0', '#f0d0ff', '#ffffff'], { speed: 170, life: 1.0, size: 4, grav: -20 });
    for (const o of zombies) {                           // iskeletler toza donusur
      if (o.skeleton && !o.dead) {
        o.dead = true;
        addParticles(o.x + 8, o.y + 8, 14, BONE.concat(['#c060ff']), { speed: 90, life: 0.7, size: 3, grav: 90 });
      }
    }
    bossFlash = { t: 0, dur: 1.2, rgb: '150,60,255' };
    showMsg('NECROMANCER ÖLDÜ!', 'İSKELETLER TOZA DÖNÜŞTÜ  +' + NECRO_REWARD + ' COIN', '#d9a0ff', 2.4, 16);
  } else if (z.skeleton) {
    addParticles(cx, cy, 16, BONE, { speed: 100, life: 0.7, size: 3, grav: 110 });
  } else if (z.explosive) {
    bloodPool(cx, cy + 4, 5, 8);
  } else {
    bloodBurst(cx, cy, dir ? Math.atan2(0, dir) : 0, 26, { speed: 115, size: 3, life: 0.55 });
    bloodPool(cx, cy + 6, 7 + Math.random() * 2, 9);
  }
  playZombieDie(z);
  if (z.explosive) {
    explode(z);
  } else if (!z.skeleton) {
    const key = z.tank ? 'tankidle' : z.mega ? 'megaidle' : z.necro ? 'necroidle'
              : z.police ? 'polisidle' : (z.spitter ? 'tukidle' : 'zidle');
    corpses.push({ x: z.x, y: z.y, face: z.face, dir: dir || 1, fall: 0, t: 0, key, size: z.size || 16 });
  }
}

// ================== KAN ==================
function addBlood(x, y, rx, ry) {
  blood.push({ x, y, rx, ry, t: 0 });
  if (blood.length > BLOOD_MAX) blood.shift();
}
// Yere kalici lekeler: merkezde havuz + etrafa serpilen damlalar
function bloodPool(x, y, size, spots) {
  addBlood(x, y, Math.round(size), Math.max(2, Math.round(size * 0.55)));
  for (let i = 0; i < spots; i++) {
    const a = Math.random() * Math.PI * 2, d = Math.random() * size * 2.2;
    addBlood(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, 1 + Math.floor(Math.random() * 2), 1 + Math.floor(Math.random() * 2));
  }
}
// Havada ucan kan: yere dusen damlalar leke birakir (stain)
function bloodBurst(x, y, angle, n, o) {
  o = Object.assign({ speed: 100, spread: Math.PI * 2, life: 0.5, size: 3, grav: 130 }, o);
  addParticles(x, y, n, ['#b01818', '#e03030', '#801010', '#d02020'],
    { speed: o.speed, angle, spread: o.spread, life: o.life, size: o.size, grav: o.grav, stain: true });
  addParticles(x, y, Math.ceil(n / 4), ['#5c0a0a', '#7a1010'],          // koyu pihti parcalari
    { speed: o.speed * 0.7, angle, spread: o.spread, life: o.life * 1.2, size: 4, grav: o.grav * 1.2, stain: true });
}

// ================== TUKURUK / ZEHIR ==================
// Genel tukuruk: (sx,sy) -> (tx,ty). o.r = gol yaricapi, o.time = gol suresi, o.speed = ucus hizi
function launchSpit(sx, sy, tx, ty, o) {
  o = o || {};
  tx = Math.max(6, Math.min(W - 6, tx));
  ty = Math.max(6, Math.min(H - 6, ty));
  spits.push({ sx, sy, tx, ty, t: 0, r: o.r, time: o.time,
    dur: Math.max(0.35, Math.hypot(tx - sx, ty - sy) / (o.speed || SPIT_SPEED)) });
  addParticles(sx, sy, 6, ['#7be04a', '#4aa02c', '#b8ff7a'],
    { speed: 60, angle: Math.atan2(ty - sy, tx - sx), spread: 0.8, life: 0.3, size: 2 });
  playSpit();
}
function fireSpit(z) {
  const c = center();
  const sx = z.x + 8 + z.face * 6, sy = z.y + 6;
  // oyuncu kosuyorsa biraz onune nisan alir (yine de kacilabilir)
  const flight = Math.hypot(c.x - sx, c.y - sy) / SPIT_SPEED;
  launchSpit(sx, sy, c.x + player.vx * flight * 0.5, c.y + player.vy * flight * 0.5);
}

function landSpit(s) {
  const r = s.r || PUDDLE_RADIUS;
  puddles.push({ x: s.tx, y: s.ty, t: 0, r, life: s.time || PUDDLE_TIME, seed: Math.random() * 10 });
  playSplat();
  addParticles(s.tx, s.ty, Math.round(14 * r / 12), ['#7be04a', '#4aa02c', '#b8ff7a'],
    { speed: 70, life: 0.45, size: 2, grav: 120 });
  // dogrudan isabet: 1 hasar + zehir
  const c = center();
  if (player.hp > 0 && player.dashTimer <= 0 && Math.hypot(c.x - s.tx, c.y - s.ty) < Math.max(9, r * 0.8)) {
    if (player.hurtTimer <= 0) hurtPlayer(1, 'spit');
    if (player.poison <= 0) player.poisonTick = POISON_TICK;
    player.poison = POISON_TIME;
  }
}

function updatePoison(dt) {
  if (player.hp <= 0) return;
  const c = center();
  let inside = false;
  if (player.dashTimer <= 0) {
    for (const p of puddles) {
      if (Math.hypot(c.x - p.x, c.y - p.y) < p.r + 3) { inside = true; break; }
    }
  }
  player.slow = inside ? PUDDLE_SLOW : 1;
  if (inside) {
    if (player.poison <= 0) player.poisonTick = POISON_TICK;
    player.poison = POISON_TIME;
  }
  if (player.poison > 0) {
    player.poison -= dt;
    player.poisonTick -= dt;
    if (Math.random() < dt * 8) {
      addParticles(c.x + (Math.random() - 0.5) * 10, c.y + 4, 1, ['#7be04a', '#b8ff7a'],
        { speed: 14, angle: -Math.PI / 2, spread: 0.6, life: 0.5, size: 2, grav: -10 });
    }
    if (player.poisonTick <= 0) {
      player.poisonTick = POISON_TICK;
      if (POISON_LETHAL || player.hp > 1) {
        hurtPlayer(1, 'poison', true);
        addFloat('-1', c.x, c.y - 10, '#8aff4a');
      }
    }
  }
}

// ================== OLUM EKRANI (HUD) ==================
const UI_FONT = '"Press Start 2P", "Courier New", monospace';
if (document.fonts && document.fonts.load) document.fonts.load('8px "Press Start 2P"').catch(() => {});
const DEATH_CAUSE = {
  zombie: 'ZOMBİ SALDIRISI', explosion: 'PATLAMA', spit: 'TÜKÜRÜK', poison: 'ZEHİR', tank: 'TANK EZDİ',
  police: 'POLİS BIÇAĞI', skeleton: 'İSKELET', mega: 'MEGA TÜKÜRÜCÜ',
};

function loadBest() {
  try { return JSON.parse(localStorage.getItem('zombiex_best')) || { wave: 0, score: 0 }; }
  catch (e) { return { wave: 0, score: 0 }; }
}
function saveBest(b) {
  try { localStorage.setItem('zombiex_best', JSON.stringify(b)); } catch (e) {}
}

function onDeath(src) {
  stopAmbience();
  if (deathInfo) return;
  const prev = loadBest();
  const isNew = wave.n > prev.wave || (wave.n === prev.wave && score > prev.score);
  const best = isNew ? { wave: wave.n, score } : prev;
  if (isNew) saveBest(best);
  deathInfo = {
    cause: src, newBest: isNew, best,
    wave: wave.n, score, time: elapsed,
    acc: stats.shots > 0 ? Math.round(stats.hits / stats.shots * 100) : 0,
    dashes: stats.dashes, damage: stats.damage, medkits: stats.medkits,
  };
  spits = [];
  deathT = 0;
  if (typeof stopMusic === 'function') stopMusic();
  playDeath();
}

function deathButtons() {
  return [
    { id: 'retry', label: '[R] TEKRAR', x: 53,  y: 142, w: 104, h: 18 },
    { id: 'menu',  label: '[M] MENÜ',   x: 163, y: 142, w: 104, h: 18 },
  ];
}
function deathClick() {
  if (deathT < 0.6) return;
  for (const b of deathButtons()) {
    if (mouse.x >= b.x && mouse.x <= b.x + b.w && mouse.y >= b.y && mouse.y <= b.y + b.h) {
      if (b.id === 'retry') restartRun(); else showMenu();
      return;
    }
  }
}

const clamp01 = v => Math.max(0, Math.min(1, v));
const easeOut = t => 1 - (1 - t) * (1 - t);
function fmtTime(sec) {
  sec = Math.floor(sec);
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
}
function dtxt(str, x, y, size, color, align) {
  ctx.font = size + 'px ' + UI_FONT;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(str, Math.round(x) + 1, Math.round(y) + 1);
  ctx.fillStyle = color;
  ctx.fillText(str, Math.round(x), Math.round(y));
}

function drawDeathScreen() {
  const d = deathInfo;
  if (!d) return;
  const T = deathT;
  const rev = (delay, dur) => clamp01((T - delay) / (dur || 0.4));
  ctx.save();

  // karartma + kirmizi kenar
  ctx.fillStyle = 'rgba(0,0,0,' + (0.72 * clamp01(T / 0.5)).toFixed(2) + ')';
  ctx.fillRect(0, 0, W, H);
  drawDamageVignette(0.3 * clamp01(T / 0.6));

  const pa = rev(0.25, 0.35);
  if (pa <= 0) { ctx.restore(); return; }
  const px = 40, py = 8, pw = 240, ph = 160;
  ctx.globalAlpha = pa;

  // panel + tarama cizgileri + cerceve
  ctx.fillStyle = 'rgba(8,14,9,0.95)';
  ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = py; y < py + ph; y += 2) ctx.fillRect(px, y, pw, 1);
  ctx.strokeStyle = '#2f5d37';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
  // kose parantezleri
  ctx.fillStyle = '#8fff9a';
  const L = 8;
  ctx.fillRect(px - 2, py - 2, L, 2);            ctx.fillRect(px - 2, py - 2, 2, L);
  ctx.fillRect(px + pw - L + 2, py - 2, L, 2);   ctx.fillRect(px + pw, py - 2, 2, L);
  ctx.fillRect(px - 2, py + ph, L, 2);           ctx.fillRect(px - 2, py + ph - L + 2, 2, L);
  ctx.fillRect(px + pw - L + 2, py + ph, L, 2);  ctx.fillRect(px + pw, py + ph - L + 2, 2, L);

  // baslik (yukaridan duser, ara sira glitch)
  const ty = 24 - (1 - easeOut(rev(0.3, 0.4))) * 16;
  const glitch = (T > 0.8 && Math.floor(T * 12) % 17 === 0) ? 0.45 : 1;
  ctx.globalAlpha = pa * glitch;
  dtxt('ÖLDÜN', W / 2, ty, 16, '#ff4a4a', 'center');

  // olum sebebi
  ctx.globalAlpha = pa * rev(0.6, 0.3);
  dtxt('SEBEP: ' + (DEATH_CAUSE[d.cause] || '???'), W / 2, 40, 7, '#ff9a9a', 'center');
  ctx.fillStyle = '#2f5d37';
  ctx.fillRect(px + 10, 47, pw - 20, 1);

  // buyuk istatistik kutulari
  const boxes = [
    { label: 'DALGA', val: d.wave,  fmt: v => String(v), color: '#7cff6b' },
    { label: 'ZOMBİ', val: d.score, fmt: v => String(v), color: '#ffe066' },
    { label: 'SÜRE',  val: d.time,  fmt: fmtTime,        color: '#66ddff' },
  ];
  const bw = 68, bh = 32, bgap = 5, bx0 = 53, by = 52;
  boxes.forEach((b, i) => {
    const r = rev(0.7 + i * 0.18, 0.3);
    if (r <= 0) return;
    const x = bx0 + i * (bw + bgap);
    ctx.globalAlpha = pa * r;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(x, by, bw, bh);
    ctx.strokeStyle = '#2f5d37';
    ctx.strokeRect(x + 0.5, by + 0.5, bw - 1, bh - 1);
    ctx.fillStyle = b.color;
    ctx.fillRect(x, by, bw, 2);
    dtxt(b.label, x + bw / 2, by + 10, 7, '#8fb393', 'center');
    const k = easeOut(rev(0.8 + i * 0.18, 0.9));       // sayac yukari sayar
    dtxt(b.fmt(Math.round(b.val * k)), x + bw / 2, by + 23, 12, b.color, 'center');
  });

  // kucuk satirlar (2x2)
  const rows = [
    ['İSABET', d.acc, v => v + '%'],
    ['DASH',   d.dashes, v => String(v)],
    ['HASAR',  d.damage, v => String(v)],
    ['MEDKİT', d.medkits, v => String(v)],
  ];
  rows.forEach((row, i) => {
    const r = rev(1.5 + i * 0.1, 0.3);
    if (r <= 0) return;
    const x = 53 + (i % 2) * 110, y = 96 + Math.floor(i / 2) * 14;
    ctx.globalAlpha = pa * r;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y + 6, 104, 1);
    dtxt(row[0], x, y, 7, '#8fb393', 'left');
    const k = easeOut(rev(1.5 + i * 0.1, 0.6));
    dtxt(row[2](Math.round(row[1] * k)), x + 104, y, 7, '#ffffff', 'right');
  });

  // rekor satiri
  const rr = rev(2.1, 0.3);
  ctx.globalAlpha = pa * rr;
  ctx.fillStyle = '#2f5d37';
  ctx.fillRect(px + 10, 123, pw - 20, 1);
  if (rr > 0) {
    if (d.newBest) {
      if (Math.floor(T * 3) % 2 === 0) dtxt('!! YENİ REKOR !!', W / 2, 133, 8, '#ffe066', 'center');
      else dtxt('!! YENİ REKOR !!', W / 2, 133, 8, '#ffb020', 'center');
    } else {
      dtxt('REKOR: DALGA ' + d.best.wave + ' / ' + d.best.score + ' ZOMBİ', W / 2, 133, 7, '#8fb393', 'center');
    }
  }

  // butonlar
  const rb = rev(1.3, 0.3);
  ctx.globalAlpha = pa * rb;
  if (rb > 0) {
    for (const b of deathButtons()) {
      const hover = mouse.x >= b.x && mouse.x <= b.x + b.w && mouse.y >= b.y && mouse.y <= b.y + b.h;
      ctx.fillStyle = hover ? '#27452d' : '#16241a';
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = hover ? '#8fff9a' : '#3c7a45';
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      dtxt(b.label, b.x + b.w / 2, b.y + b.h / 2 + 1, 7, hover ? '#ffffff' : '#d8ffd8', 'center');
    }
  }
  ctx.restore();
}

// ================== GUNCELLEME ==================
function update(dt) {
  // olu zombiler (oyun bitse de zaman aksin)
  for (const c of corpses) {
    c.t += dt;
    c.fall = Math.min(1, c.fall + dt / 0.25); // 0.25 sn'de yere yatar
  }
  corpses = corpses.filter(c => c.t < CORPSE_TIME);

// game.js -> update(dt) içine:
if (gameState === 'playing' && socket.connected) {
  socket.emit('playerUpdate', {
    x: player.x,
    y: player.y,
    hp: player.hp,
    face: player.face,
    walking: player.walking
  });
}

  // efektler
  hitSndT = Math.max(0, hitSndT - dt);
  night += (nightTarget() - night) * Math.min(1, dt * 0.8);
  if (bossFlash) { bossFlash.t += dt; if (bossFlash.t >= bossFlash.dur) bossFlash = null; }
  if (trans) {                                   // polis istasyonuna gecis
    trans.t += dt;
    if (!trans.swapped && trans.t >= 1.0) {
      trans.swapped = true;
      stage = 'police';
      blood = []; corpses = []; scorches = []; puddles = []; spits = [];
    }
    if (trans.t >= trans.dur) trans = null;
  }
  hurtFlash = Math.max(0, hurtFlash - dt);
  poisonFlash = Math.max(0, poisonFlash - dt);
  for (const p of puddles) p.t += dt;
  puddles = puddles.filter(p => p.t < (p.life || PUDDLE_TIME));
  if (msg) { msg.t += dt; if (msg.t >= msg.dur) msg = null; }
  for (const f of floats) { f.t += dt; f.y -= 10 * dt; }
  floats = floats.filter(f => f.t < f.dur);
  // magaza sagdan kayarak gelir / gider
  shop.slide = shop.visible ? Math.min(1, shop.slide + dt / 0.6) : Math.max(0, shop.slide - dt / 0.4);
  const ease = 1 - (1 - shop.slide) * (1 - shop.slide);
  shop.x = (W + 8) + ((W - 40) - (W + 8)) * ease;
  if (!shop.visible) shop.open = false;
  for (const p of particles) {
    p.vy += p.grav * dt;
    p.vx *= Math.pow(0.05, dt);
    p.vy *= Math.pow(0.05, dt);
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0 && p.stain && Math.random() < 0.6) addBlood(p.x, p.y, p.size > 2 ? 2 : 1, 1);
  }
  particles = particles.filter(p => p.life > 0);
  for (const b of blood) b.t += dt;
  blood = blood.filter(b => b.t < BLOOD_TIME);
  for (const sc of scorches) sc.t += dt;
  scorches = scorches.filter(sc => sc.t < CORPSE_TIME);
  for (const sw of shockwaves) sw.t += dt;
  shockwaves = shockwaves.filter(sw => sw.t < 0.3);
  shake *= Math.pow(0.0005, dt);
  if (shake < 0.1) shake = 0;

  if (player.hp <= 0) { deathT += dt; return; }
  elapsed += dt;

  // hareket
  let dx = 0, dy = 0;
  if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
  // dash baslat (Shift): hareket yonune, duruyorsan fareye dogru
  if (pressedDash && player.dashCd <= 0 && player.dashTimer <= 0) {
    let ddx = dx, ddy = dy;
    if (ddx === 0 && ddy === 0) {
      const a = aimAngle();
      ddx = Math.cos(a);
      ddy = Math.sin(a);
    }
    const l = Math.hypot(ddx, ddy);
    player.dashDir = { x: ddx / l, y: ddy / l };
    player.dashTimer = DASH_TIME;
    player.dashCd = DASH_COOLDOWN;
    player.dashKills = 0;
    stats.dashes++;
    playDash();
  }
  pressedDash = false;

  if (player.dashTimer > 0) {
    player.dashTimer -= dt;
    player.walking = true;
    player.animTime += dt;
    player.x += player.dashDir.x * DASH_SPEED * dt;
    player.y += player.dashDir.y * DASH_SPEED * dt;
    addParticles(player.x + 8, player.y + 10, 2, ['#ffffff', '#cfe8ff'],
      { speed: 15, life: 0.2, size: 2 });
    // dash'in degdigi zombileri firlat (en fazla DASH_MAX_KILLS)
    for (const z of zombies) {
      if (z.dead || z.flung || z.boss || player.dashKills >= DASH_MAX_KILLS) continue;
      if (Math.hypot(player.x + 8 - (z.x + 8), player.y + 8 - (z.y + 8)) < 13) {
        player.dashKills++;
        flingZombie(z, player.dashDir);
      }
    }
  } else {
    player.walking = dx !== 0 || dy !== 0;
    player.vx = 0;
    player.vy = 0;
    if (player.walking) {
      const len = Math.hypot(dx, dy);
      const sp = player.speed * player.slow;      // zehir golunde yavaslar
      player.vx = dx / len * sp;
      player.vy = dy / len * sp;
      player.x += player.vx * dt;
      player.y += player.vy * dt;
      player.animTime += dt;
    }
  }
  player.x = Math.max(0, Math.min(W - 16, player.x));
  player.y = Math.max(0, Math.min(H - 16, player.y));
  player.face = mouse.x < center().x ? -1 : 1;

  player.cooldown = Math.max(0, player.cooldown - dt);
  player.fireTimer = Math.max(0, player.fireTimer - dt);
  player.recoil = Math.max(0, player.recoil - dt);
  player.hurtTimer = Math.max(0, player.hurtTimer - dt);
  player.dashCd = Math.max(0, player.dashCd - dt);

  // mermiler
  for (const b of bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
  }

  // tukuruklar havada gider, inince zehir golu birakir
  for (const s of spits) {
    s.t += dt / s.dur;
    if (Math.random() < dt * 30) {
      const k = Math.min(1, s.t);
      addParticles(s.sx + (s.tx - s.sx) * k, s.sy + (s.ty - s.sy) * k - Math.sin(Math.PI * k) * 14, 1,
        ['#7be04a', '#4aa02c'], { speed: 10, life: 0.3, size: 1 });
    }
    if (s.t >= 1) { landSpit(s); s.done = true; }
  }
  spits = spits.filter(s => !s.done);
  updatePoison(dt);

  // dalga sistemi (zombi cikisi, mola, magaza)
  updateWave(dt);

  // drop spawn
  dropTimer -= dt;
  if (dropTimer <= 0) {
    spawnDrop();
    dropTimer = DROP_INTERVAL;
  }

  // dropler: yavasca dus, yere inince ses cal
  for (const d of drops) {
    if (!d.landed) {
      d.y += DROP_FALL_SPEED * dt;
      if (d.y >= d.targetY) {
        d.y = d.targetY;
        d.landed = true;
        playThud();
      }
    }
  }

  // medicler: dropdan firlayip yere duser
  for (const m of medics) {
    if (!m.settled) {
      m.vy += 260 * dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.y >= m.groundY && m.vy > 0) {
        m.y = m.groundY;
        m.settled = true;
        tone(300, 0, 0.06, 'sine', 0.3, 150); // kucuk "pat"
      }
    }
    m.bob += dt;
  }

  // magaza: E ile ac / kapat; uzaklasirsan kapanir
  if (pressedE && shop.slide >= 1 && wave.phase === 'break' && nearShop(40)) {
    shop.open = !shop.open;
    playShopTick();
    pressedE = false;
  }
  if (shop.open && (!nearShop(56) || wave.phase !== 'break')) shop.open = false;

  // can 1 iken kalp atisi
  if (player.hp > 0 && player.hp <= 1) {
    heartTimer -= dt;
    if (heartTimer <= 0) { playHeartbeat(); heartTimer = 0.9; }
  } else {
    heartTimer = 0;
  }

  // E tusu: once yakindaki drop, yoksa yakindaki medic
  if (pressedE) {
    const drop = drops.find(d => d.landed && nearPlayer(d));
    if (drop) {
      playOpen();
      medics.push({
        x: drop.x, y: drop.y,
        vx: (Math.random() < 0.5 ? -1 : 1) * (15 + Math.random() * 15),
        vy: -85,
        groundY: drop.y + 6,
        settled: false,
        bob: 0,
        // dusuk ihtimalle shotgun, yoksa medic (shotgun varsa hep medic)
        kind: (!player.hasShotgun && Math.random() < SHOTGUN_CHANCE) ? 'shotgun' : 'medic',
      });
      drops = drops.filter(d => d !== drop);
    } else {
      const med = medics.find(m => m.settled && nearPlayer(m));
      if (med) {
        if (med.kind === 'shotgun') {
          player.hasShotgun = true;
          player.weapon = 'shotgun';
          playPump();
        } else {
          player.hp = MAX_HP;
          player.poison = 0;
          playHeal();
        }
        medics = medics.filter(m => m !== med);
      }
    }
  }
  pressedE = false;

  // zombiler
  const c = center();
  for (const z of zombies) {
    if (z.dead) continue;
    z.animTime += dt;
    if (z.flash > 0) z.flash -= dt;

    if (z.flung) {                       // arkaya firliyor, hizi azalarak
      const f = z.flung;
      f.t -= dt;
      const k = Math.max(0, f.t / FLING_TIME);
      z.x += f.vx * k * dt;
      z.y += f.vy * k * dt;
      if (f.t <= 0) killZombie(z, f.dir);
      continue;
    }

    const zx = z.x + (z.half || 8), zy = z.y + (z.half || 8);
    const dist = Math.hypot(c.x - zx, c.y - zy);
    const ang = Math.atan2(c.y - zy, c.x - zx);
    z.face = Math.cos(ang) < 0 ? -1 : 1;

    if (z.explosive) {
      if (z.fuse !== null) {          // fitil yaniyor, yerinde durur
        z.fuse -= dt;
        if (z.fuse <= 0) killZombie(z, 0);
        continue;
      }
      if (dist < 18) {                // yaklasti: fitil basla
        z.fuse = 0.5;
        playFuse();
        continue;
      }
    }

    // tukuruk zombisi: mesafeyi korur, durup tukurur (mv: 1 yaklas, 0 dur, -0.8 geri kac)
    let mv = 1;
    if (z.spitter) {
      z.spitCd -= dt;
      if (z.windup !== null) {
        z.windup -= dt;
        mv = 0;
        if (z.windup <= 0) {
          fireSpit(z);
          z.windup = null;
          z.spitCd = SPIT_COOLDOWN * (0.8 + Math.random() * 0.5);
        }
      } else if (dist < SPIT_RANGE && z.spitCd <= 0) {
        z.windup = SPIT_WINDUP;
        playSpitWind();
        mv = 0;
      } else if (dist < SPIT_FLEE) {
        mv = -0.8;
      } else if (dist < SPIT_RANGE) {
        mv = 0;
      }
      z.moving = mv !== 0;
    }
    // MEGA TUKURUCU: mesafe korur, 3 farkli zehir saldirisi
    if (z.mega) {
      z.spitCd -= dt;
      if (z.windup !== null) {
        z.windup -= dt;
        mv = 0;
        if (z.windup <= 0) {
          megaAttack(z);
          z.atkN++;
          z.windup = null;
          z.spitCd = MEGA_COOLDOWN * (0.85 + Math.random() * 0.3);
        }
      } else if (dist < MEGA_RANGE && z.spitCd <= 0) {
        z.windup = MEGA_WINDUP;
        playSpitWind();
        mv = 0;
      } else if (dist < MEGA_FLEE) {
        mv = -0.7;
      } else if (dist < MEGA_RANGE) {
        mv = 0;
      }
      z.moving = mv !== 0;
    }
    // NECROMANCER: uzaktan durup asasini kaldirir, her 5 saniyede iskelet cikarir
    if (z.necro) {
      z.summonCd -= dt;
      if (z.windup !== null) {
        z.windup -= dt;
        mv = 0;
        if (Math.random() < dt * 30) {
          addParticles(z.x + z.half + z.face * 9, z.y + 3, 1, ['#c060ff', '#7a30c0', '#f0d0ff'],
            { speed: 22, angle: -Math.PI / 2, spread: 1, life: 0.5, size: 2, grav: -20 });
        }
        if (z.windup <= 0) {
          necroSummon(z);
          z.windup = null;
          z.summonCd = NECRO_INTERVAL - NECRO_WINDUP;   // iki cagri arasi tam 5 sn
        }
      } else if (z.summonCd <= 0) {
        z.windup = NECRO_WINDUP;
        playNecroCast();
        mv = 0;
      } else if (dist < NECRO_FLEE) {
        mv = -0.8;
      } else if (dist < NECRO_RANGE) {
        mv = 0;
      }
      z.moving = mv !== 0;
    }
    // ISKELET: topraktan cikarken kipirdamaz
    if (z.skeleton && z.rise > 0) {
      z.rise -= dt;
      mv = 0;
      z.moving = false;
    }
    // POLIS ZOMBI: yaklasinca durup bicagini parlatir, sonra hizla saplamak icin atilir
    if (z.police) {
      z.lungeCd -= dt;
      if (z.state === 'windup') {
        z.stateT -= dt;
        mv = 0;
        if (z.stateT <= 0) {
          z.state = 'lunge';
          z.stateT = POLICE_LUNGE_TIME;
          z.cdir = { x: Math.cos(ang), y: Math.sin(ang) };
          playKnife();
        }
      } else if (z.state === 'lunge') {
        z.stateT -= dt;
        mv = 0;
        z.x += z.cdir.x * z.speed * POLICE_LUNGE_MULT * dt;
        z.y += z.cdir.y * z.speed * POLICE_LUNGE_MULT * dt;
        if (z.stateT <= 0) { z.state = 'walk'; z.lungeCd = POLICE_LUNGE_CD; }
      } else if (dist < POLICE_LUNGE_RANGE && z.lungeCd <= 0) {
        z.state = 'windup';
        z.stateT = POLICE_WINDUP;
        mv = 0;
      }
      z.moving = z.state === 'walk' || z.state === 'lunge';
    }
    // TANK: yavas yurur, aniden hucum eder (hazirlanma -> hucum -> sersemleme)
    if (z.tank) {
      z.atkCd -= dt;
      if (z.state === 'windup') {
        z.stateT -= dt;
        mv = 0;
        if (z.stateT <= 0) {
          z.state = 'charge';
          z.stateT = TANK_CHARGE_TIME;
          z.cdir = { x: Math.cos(ang), y: Math.sin(ang) };   // hucum yonu sabit: yana kacabilirsin
          shake = Math.max(shake, 3);
        }
      } else if (z.state === 'charge') {
        z.stateT -= dt;
        mv = 0;
        z.x += z.cdir.x * z.speed * TANK_CHARGE_MULT * dt;
        z.y += z.cdir.y * z.speed * TANK_CHARGE_MULT * dt;
        z.x = Math.max(-4, Math.min(W - 20, z.x));
        z.y = Math.max(-4, Math.min(H - 20, z.y));
        if (Math.random() < dt * 40) {
          addParticles(z.x + 12, z.y + 22, 1, ['#8a7a5a', '#6a5a3a'], { speed: 25, life: 0.4, size: 3, grav: -10 });
        }
        if (z.stateT <= 0) { z.state = 'stun'; z.stateT = TANK_STUN; }
      } else if (z.state === 'stun') {
        z.stateT -= dt;
        mv = 0;
        if (z.stateT <= 0) { z.state = 'walk'; z.atkCd = TANK_CHARGE_CD; }
      } else if (dist < TANK_CHARGE_RANGE && z.atkCd <= 0) {
        z.state = 'windup';
        z.stateT = TANK_WINDUP;
        playTankRoar();
        mv = 0;
      }
      z.moving = z.state === 'walk' || z.state === 'charge';
      if (z.state !== 'charge' && z.state !== 'windup') z.face = Math.cos(ang) < 0 ? -1 : 1;
    }
    z.x += Math.cos(ang) * z.speed * mv * dt;
    z.y += Math.sin(ang) * z.speed * mv * dt;
    if (mv < 0) {
      z.x = Math.max(0, Math.min(W - 16, z.x));
      z.y = Math.max(0, Math.min(H - 16, z.y));
    }

    if (z.tank) {
      if (dist < 15 && player.hurtTimer <= 0 && player.dashTimer <= 0) {
        hurtPlayer(TANK_DAMAGE, 'tank');
        if (z.state === 'charge') { z.state = 'stun'; z.stateT = TANK_STUN; }   // carpinca sersemler
      }
    } else if (!z.explosive && !(z.rise > 0) && player.hurtTimer <= 0 && player.dashTimer <= 0 &&
               dist < (z.state === 'lunge' ? 13 : z.mega ? 20 : z.necro ? 12 : 9)) {
      hurtPlayer(1, z.police ? 'police' : z.skeleton ? 'skeleton' : z.mega ? 'mega' : 'zombie');
    }

    // ayak sesleri (yakin zombiler; ayni anda cok ses cikmasin)
    const heavy = z.tank || z.mega;
    const stepLen = heavy ? 0.4 : 0.25;
    const ph = Math.floor(z.animTime / stepLen) % 2;
    if (z.moving !== false && ph !== z.stepPhase) {
      z.stepPhase = ph;
      if (stepSndT <= 0 && !(z.tank && z.state === 'charge' && ph === 0)) {
        playFootstep(zx, zy, heavy ? 'heavy' : (z.skeleton ? 'bone' : null));
        stepSndT = 0.06;
        if (heavy && dist < 120) shake = Math.max(shake, 1.2);
      }
    }
  }

  // zombi hirilti (rastgele bir zombi) + tank homurtusu
  growlT -= dt;
  if (growlT <= 0 && zombies.length) {
    growlT = 1.2 + Math.random() * 2.6;
    const pool = zombies.filter(z => !z.dead && !z.flung && !z.boss);
    if (pool.length) playGrowl(pool[Math.floor(Math.random() * pool.length)]);
  }
  tankRoarT -= dt;
  const tk = zombies.find(z => z.boss && !z.dead);
  if (tk && tankRoarT <= 0) { tankRoarT = 4 + Math.random() * 3; playGrowl(tk); }
  stepSndT = Math.max(0, stepSndT - dt);
  // oyuncunun ayak sesi
  if (player.walking && player.dashTimer <= 0) {
    const sp = Math.floor(player.animTime / 0.15) % 2;
    if (sp !== playerStepPhase) { playerStepPhase = sp; playPlayerStep(); }
  }
  ambienceTick(dt);

  // mermi - zombi carpismasi
  for (const b of bullets) {
    for (const z of zombies) {
      if (z.dead || z.rise > 0) continue;
      if (Math.hypot(b.x - (z.x + (z.half || 8)), b.y - (z.y + (z.half || 8))) < (z.half || 8)) {
        z.hp--;
        b.life = 0;
        if (b.shot && !b.shot.hit) { b.shot.hit = true; stats.hits++; }
        z.flash = 0.08;
        if (hitSndT <= 0) { playHit(); hitSndT = 0.04; }
        if (b.pellet && !z.boss) {            // sacma zombiyi geri iter (boss hariç)
          const l = Math.hypot(b.vx, b.vy);
          z.x += b.vx / l * 3;
          z.y += b.vy / l * 3;
          shake = Math.max(shake, 1.5);
        }
        if (z.explosive) {
          addParticles(b.x, b.y, Math.round(6 * (b.pellet ? 0.7 : 1)), ['#ffcc44', '#ff8822'],
            { speed: 90, angle: Math.atan2(b.vy, b.vx), spread: 1.2, life: 0.35, size: 2, grav: 100 });
        } else if (z.skeleton) {
          addParticles(b.x, b.y, 8, ['#e8e4d0', '#a8a48c', '#ffffff'],
            { speed: 100, angle: Math.atan2(b.vy, b.vx), spread: 1.2, life: 0.4, size: 2, grav: 110 });
        } else {
          bloodBurst(b.x, b.y, Math.atan2(b.vy, b.vx), Math.round((z.boss ? 8 : 12) * (b.pellet ? 0.7 : 1)),
            { speed: 110, spread: 1.1, life: 0.4, size: 3 });
          if (Math.random() < 0.7) addBlood(z.x + (z.half || 8) + (Math.random() - 0.5) * 8, z.y + (z.half || 8) * 2 - 1, 2, 1);
        }
        if (z.hp <= 0) killZombie(z, Math.sign(b.vx) || 1);
        break;
      }
    }
  }
  bullets = bullets.filter(b => b.life > 0 && b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10);
  zombies = zombies.filter(z => !z.dead);
}

// ================== CIZIM ==================
function drawChar(x, y, face, key, color, size) {
  size = size || 16;
  ctx.save();
  ctx.translate(Math.round(x) + (face < 0 ? size : 0), Math.round(y));
  ctx.scale(face, 1);
  draw(key, 0, 0, size, size, color);
  ctx.restore();
}

function drawPrompt(x, y) {
  // "E" kutusu
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(Math.round(x) - 5, Math.round(y) - 6, 10, 11);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(Math.round(x) - 4.5, Math.round(y) - 5.5, 9, 10);
  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('E', Math.round(x), Math.round(y));
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
}

// Polis arabalarinin cakar lambalari (kirmizi/mavi, sirayla yanip soner)
function drawPoliceLights() {
  if (stage !== 'police') return;
  const ph = Math.floor(performance.now() / 250) % 2;
  for (const L of POLICE_LIGHTS) {
    const red = ((ph + L.o) % 2) === 0;
    ctx.fillStyle = red ? '#ff3030' : '#3060ff';
    ctx.fillRect(L.x - 6, L.y, 5, 3);
    ctx.fillStyle = red ? '#3060ff' : '#ff3030';
    ctx.fillRect(L.x + 1, L.y, 5, 3);
  }
}

// ================== GECE / FENER ==================
const darkCv = document.createElement('canvas');
darkCv.width = W;
darkCv.height = H;
const dctx = darkCv.getContext('2d');

function nightTarget() {
  if (!settings.night) return 0;
  let n = Math.min(NIGHT_MAX, NIGHT_BASE + (wave.n - 1) * NIGHT_STEP);
  if (wave.phase === 'break') n *= NIGHT_BREAK;
  return n;
}

// Karanlik katmani cizer, sonra fener konisi ve isik kaynaklarini oyar
function drawNight() {
  if (night < 0.01) return;
  const c = center();
  const a = aimAngle();
  dctx.globalCompositeOperation = 'source-over';
  dctx.clearRect(0, 0, W, H);
  dctx.fillStyle = 'rgba(4,8,24,' + night.toFixed(3) + ')';
  dctx.fillRect(0, 0, W, H);
  dctx.globalCompositeOperation = 'destination-out';

  const hole = (x, y, r, alpha) => {
    const g = dctx.createRadialGradient(x, y, r * 0.12, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,' + alpha.toFixed(2) + ')');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = g;
    dctx.beginPath();
    dctx.arc(x, y, r, 0, Math.PI * 2);
    dctx.fill();
  };
  const cone = (half, len, alpha) => {
    const g = dctx.createRadialGradient(c.x, c.y, 8, c.x, c.y, len);
    g.addColorStop(0, 'rgba(0,0,0,' + alpha.toFixed(2) + ')');
    g.addColorStop(0.7, 'rgba(0,0,0,' + (alpha * 0.8).toFixed(2) + ')');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = g;
    dctx.beginPath();
    dctx.moveTo(c.x, c.y);
    dctx.arc(c.x, c.y, len, a - half, a + half);
    dctx.closePath();
    dctx.fill();
  };

  if (player.hp > 0) {
    hole(c.x, c.y, 30, 0.9);          // oyuncunun etrafi
    cone(0.7, 125, 0.55);             // genis, soluk isik
    cone(0.38, 150, 0.95);            // parlak fener demeti
    if (player.fireTimer > 0) {       // namlu alevi etrafi aydinlatir
      hole(c.x + Math.cos(a) * 12, c.y + Math.sin(a) * 12, player.weapon === 'shotgun' ? 75 : 55, 0.8);
    }
  }
  for (const d of drops) if (d.landed) hole(d.x, d.y, 24, 0.6);
  for (const m of medics) if (m.settled) hole(m.x, m.y, 18, 0.5);
  if (shop.slide > 0) hole(shop.x + 16, shop.y + 30, 42, 0.85);
  for (const sc of scorches) if (sc.t < 0.7) hole(sc.x, sc.y, 80 * (1 - sc.t / 0.7) + 10, 1);
  for (const p of puddles) hole(p.x, p.y, 14 + p.r, 0.45 * Math.min(1, ((p.life || PUDDLE_TIME) - p.t) / 1.2));
  for (const s of spits) {
    const k = Math.min(1, s.t);
    hole(s.sx + (s.tx - s.sx) * k, s.sy + (s.ty - s.sy) * k - Math.sin(Math.PI * k) * 14, 20, 0.7);
  }
  for (const b of bullets) hole(b.x, b.y, 10, 0.35);
  for (const z of zombies) {
    if (z.fuse !== null && z.fuse !== undefined) hole(z.x + 8, z.y + 8, 30, 0.8);          // yanan fitil
    if (z.spitter && z.windup !== null) hole(z.x + 8, z.y + 8, 22, 0.6);                   // zehir parlamasi
  }
  if (stage === 'police') {                       // tabela, kapi ve arabalar karanlikta da aydinlik
    hole(160, 22, 70, 0.8);
    hole(160, 52, 46, 0.7);
    for (const L of POLICE_LIGHTS) hole(L.x, L.y + 10, 46, 0.55);
  }
  for (const z of zombies) {                      // necromancer ve mega kendi isigini yayar
    if (z.necro) hole(z.x + z.half, z.y + z.half, 40, 0.6);
    if (z.mega) hole(z.x + z.half, z.y + z.half, 44, 0.5);
  }
  dctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(darkCv, 0, 0);
  if (stage === 'police') {                       // kirmizi / mavi isik yikamasi
    const ph = Math.floor(performance.now() / 250) % 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const L of POLICE_LIGHTS) {
      const red = ((ph + L.o) % 2) === 0;
      const g = ctx.createRadialGradient(L.x, L.y + 6, 2, L.x, L.y + 6, 56);
      g.addColorStop(0, red ? 'rgba(255,50,40,0.28)' : 'rgba(50,90,255,0.28)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(L.x - 60, L.y - 50, 120, 110);
    }
    ctx.restore();
  }

  // fenerin sicak isigi
  if (player.hp > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(c.x, c.y, 8, c.x, c.y, 140);
    g.addColorStop(0, 'rgba(255,230,160,0.10)');
    g.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.arc(c.x, c.y, 140, a - 0.38, a + 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  // karanlikta zombilerin gozleri parlar
  for (const z of zombies) {
    if (z.dead) continue;
    const half = z.half || 8;
    const ex = Math.round(z.x + half + (z.face || 1) * 2 * (half / 8));
    const ey = Math.round(z.y + EYE_Y * (half / 8));
    ctx.fillStyle = z.tank ? '#ff6a2a' : z.mega ? '#ffee33' : z.necro ? '#d080ff' : z.skeleton ? '#7fe0ff' : (z.spitter ? '#b8ff4a' : '#ff2a2a');
    ctx.globalAlpha = Math.min(1, night * 1.3);
    ctx.fillRect(ex - 2, ey, 1, 1);
    ctx.fillRect(ex + 1, ey, 1, 1);
    ctx.globalAlpha = 1;
  }
}

function drawDamageVignette(a, rgb) {
  rgb = rgb || '200,0,0';
  // kirmizi, blok blok kenar (piksel stiline uygun)
  for (let i = 0; i < 6; i++) {
    const al = Math.max(0, a * (1 - i / 6));
    ctx.fillStyle = 'rgba(' + rgb + ',' + al.toFixed(3) + ')';
    const t = i * 4;
    ctx.fillRect(0, t, W, 4);
    ctx.fillRect(0, H - t - 4, W, 4);
  }
  for (let i = 0; i < 6; i++) {
    const al = Math.max(0, a * (1 - i / 6));
    ctx.fillStyle = 'rgba(' + rgb + ',' + al.toFixed(3) + ')';
    const t = i * 4;
    ctx.fillRect(t, t + 4, 4, Math.max(0, H - 2 * t - 8));
    ctx.fillRect(W - t - 4, t + 4, 4, Math.max(0, H - 2 * t - 8));
  }
}

function drawWaveMessage() {
  if (!msg) return;
  const k = msg.t / msg.dur;
  const alpha = k > 0.75 ? Math.max(0, (1 - k) / 0.25) : 1;
  const pop = msg.t < 0.25 ? 1 + (1 - msg.t / 0.25) * 0.5 : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.font = 'bold ' + Math.round(msg.size * pop) + 'px monospace';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000';
  ctx.strokeText(msg.title, W / 2, H / 2 - 24);
  ctx.fillStyle = msg.color;
  ctx.fillText(msg.title, W / 2, H / 2 - 24);
  ctx.font = 'bold 9px monospace';
  ctx.lineWidth = 3;
  ctx.strokeText(msg.sub, W / 2, H / 2 - 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(msg.sub, W / 2, H / 2 - 4);
  if (msg.extra) {
    ctx.strokeText(msg.extra, W / 2, H / 2 + 10);
    ctx.fillStyle = '#ffd54a';
    ctx.fillText(msg.extra, W / 2, H / 2 + 10);
  }
  ctx.restore();
}

function drawFloats() {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 8px monospace';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000';
  for (const f of floats) {
    ctx.globalAlpha = Math.max(0, 1 - f.t / f.dur);
    ctx.strokeText(f.text, Math.round(f.x), Math.round(f.y));
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, Math.round(f.x), Math.round(f.y));
  }
  ctx.restore();
}

function drawShopPanel() {
  const r = shopRects(), p = r.panel;
  ctx.save();
  ctx.fillStyle = 'rgba(10,14,10,0.94)';
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.strokeStyle = '#8fff9a';
  ctx.lineWidth = 1;
  ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1);
  ctx.font = '7px monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffe066';
  ctx.fillText('MAĞAZA', p.x + 5, p.y + 4);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffd54a';
  ctx.fillText(coins + ' COIN', p.x + p.w - 5, p.y + 4);

  const items = [
    { id: 'medkit',  label: '[1] MEDKIT',  price: MEDKIT_PRICE,  owned: false },
    { id: 'shotgun', label: '[2] SHOTGUN', price: SHOTGUN_PRICE, owned: player.hasShotgun },
  ];
  items.forEach((it, i) => {
    const row = r.rows[i];
    const hover = mouse.x >= row.x && mouse.x <= row.x + row.w && mouse.y >= row.y && mouse.y <= row.y + row.h;
    if (hover) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(row.x, row.y, row.w, row.h); }
    const color = it.owned ? '#777777' : (coins >= it.price ? '#7cff6b' : '#ff6666');
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(it.label, row.x + 3, row.y + 4);
    ctx.textAlign = 'right';
    ctx.fillText(it.owned ? 'ALINDI' : it.price + 'c', row.x + row.w - 3, row.y + 4);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = '#7e9a82';
  ctx.fillText('E: KAPAT', p.x + 5, p.y + p.h - 10);
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  if (shake > 0 && settings.shake && gameState === 'playing') {
    ctx.translate(Math.round((Math.random() - 0.5) * shake * 2),
                  Math.round((Math.random() - 0.5) * shake * 2));
  }

// game.js -> render() fonksiyonunun içine eklenecek:
for (const id in remotePlayers) {
  const p = remotePlayers[id];
  if (p.hp > 0) {
    let key = p.walking ? (Math.floor(performance.now() / 150) % 2 === 0 ? 'walk1' : 'walk2') : 'idle';
    drawChar(p.x, p.y, p.face, key, '#e03a3a'); // Arkadaş karakter rengi
  }
}

  // arkaplan
  const bgKey = stage === 'police' ? 'polisbg' : 'bg';
  if (loaded(bgKey)) ctx.drawImage(img[bgKey], 0, 0, W, H);
  else { ctx.fillStyle = stage === 'police' ? '#34363c' : '#3f7a3a'; ctx.fillRect(0, 0, W, H); }
  drawPoliceLights();

  // patlama izleri (yanik zemin)
  for (const sc of scorches) {
    const remaining = CORPSE_TIME - sc.t;
    ctx.fillStyle = 'rgba(0,0,0,' + (0.35 * Math.min(1, remaining)).toFixed(2) + ')';
    ctx.fillRect(Math.round(sc.x) - 10, Math.round(sc.y) - 4, 20, 8);
    ctx.fillRect(Math.round(sc.x) - 6, Math.round(sc.y) - 7, 12, 14);
  }

  // kan lekeleri (zamanla kuruyup kararir)
  for (const b of blood) {
    const fade = Math.min(1, (BLOOD_TIME - b.t) / 3);
    const dry = Math.min(1, b.t / 12);
    const r = Math.round(176 - dry * 84), g = Math.round(24 - dry * 12), bl = Math.round(24 - dry * 12);
    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + bl + ',' + (0.85 * fade).toFixed(2) + ')';
    const bx = Math.round(b.x), by = Math.round(b.y);
    if (b.rx <= 2) {
      ctx.fillRect(bx - b.rx, by - b.ry, b.rx * 2, b.ry * 2);
    } else {
      for (let yy = -b.ry; yy <= b.ry; yy++) {
        const w = Math.round(Math.sqrt(1 - (yy / b.ry) * (yy / b.ry)) * b.rx);
        ctx.fillRect(bx - w, by + yy, w * 2, 1);
      }
      ctx.fillStyle = 'rgba(' + Math.min(255, r + 40) + ',' + (g + 6) + ',' + (bl + 6) + ',' + (0.5 * fade).toFixed(2) + ')';
      ctx.fillRect(bx - Math.round(b.rx * 0.4), by - 1, Math.round(b.rx * 0.8), 1);   // islak parlama
    }
  }

  // zehir gollleri
  for (const p of puddles) {
    const remaining = (p.life || PUDDLE_TIME) - p.t;
    const fade = Math.min(1, remaining / 1.2);
    const grow = Math.min(1, p.t / 0.15);
    const rx = p.r * (0.6 + 0.4 * grow), ry = p.r * 0.58 * (0.6 + 0.4 * grow);
    const cx = Math.round(p.x), cy = Math.round(p.y);
    for (let yy = -Math.round(ry); yy <= Math.round(ry); yy++) {
      const w = Math.round(Math.sqrt(1 - (yy / ry) * (yy / ry)) * rx);
      ctx.fillStyle = 'rgba(48,120,24,' + (0.62 * fade).toFixed(2) + ')';
      ctx.fillRect(cx - w, cy + yy, w * 2, 1);
    }
    for (let yy = -Math.round(ry * 0.55); yy <= Math.round(ry * 0.55); yy++) {
      const w = Math.round(Math.sqrt(1 - (yy / (ry * 0.55)) * (yy / (ry * 0.55))) * rx * 0.6);
      ctx.fillStyle = 'rgba(120,210,56,' + (0.5 * fade).toFixed(2) + ')';
      ctx.fillRect(cx - w, cy + yy, w * 2, 1);
    }
    for (let i = 0; i < 3; i++) {                     // kabarcik
      const ph = Math.sin(p.seed + p.t * 2.2 + i * 2.1);
      if (ph > 0.55) {
        ctx.fillStyle = 'rgba(200,255,140,' + fade.toFixed(2) + ')';
        ctx.fillRect(cx + Math.round(Math.sin(p.seed * 3 + i * 1.7) * rx * 0.55),
                     cy + Math.round(Math.cos(p.seed * 2 + i * 2.3) * ry * 0.5), 2, 2);
      }
    }
  }

  // olu zombiler
  for (const c of corpses) {
    const remaining = CORPSE_TIME - c.t;
    ctx.save();
    ctx.globalAlpha = remaining < 1 ? Math.max(0, remaining) : 1;
    const cs = c.size || 16;
    ctx.translate(Math.round(c.x + cs / 2), Math.round(c.y + cs));
    ctx.rotate(c.dir * (Math.PI / 2) * c.fall);
    ctx.scale(c.face, 1);
    draw(c.key || 'zidle', -cs / 2, -cs, cs, cs, '#3d5c28');
    ctx.restore();
  }

  // dropler
  for (const d of drops) {
    if (!d.landed) {
      const p = Math.max(0, Math.min(1, (d.y + 20) / (d.targetY + 20)));
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      const sw = 4 + 8 * p;
      ctx.fillRect(Math.round(d.x - sw / 2), Math.round(d.targetY + 8), Math.round(sw), 2);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(Math.round(d.x - 7), Math.round(d.y + 8), 14, 2);
    }
    drawCentered('drop', d.x, d.y, '#c8963c');
    if (d.landed && nearPlayer(d)) drawPrompt(d.x, d.y - 16);
  }

  // medicler
  for (const m of medics) {
    const bobY = m.settled ? Math.sin(m.bob * 4) * 1 : 0;
    if (m.settled) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(Math.round(m.x - 5), Math.round(m.y + 6), 10, 2);
    }
    drawCentered(m.kind, m.x, m.y + bobY, m.kind === 'medic' ? '#e03a3a' : '#888888');
    if (m.settled && nearPlayer(m)) drawPrompt(m.x, m.y - 14);
  }

  // magaza tezgahi (sagda)
  if (shop.slide > 0) {
    const sx = Math.round(shop.x), sy = shop.y;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(sx + 2, sy + 60, 30, 4);
    draw('tezgah', sx, sy, 32, 64, '#8b5a2b');
    ctx.font = '7px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffe066';
    ctx.fillText('MAĞAZA', sx + 16, sy - 9);
    ctx.textAlign = 'left';
    if (shop.slide >= 1 && !shop.open && nearShop(40)) drawPrompt(sx + 16, sy - 20);
  }

  // zombiler
  for (const z of zombies) {
    if (z.flung) {                       // havada ayaklarindan doner
      const prog = 1 - Math.max(0, z.flung.t / FLING_TIME);
      ctx.save();
      ctx.translate(Math.round(z.x + 8), Math.round(z.y + 16));
      ctx.rotate(z.flung.dir * (Math.PI / 2) * Math.min(1, prog * 1.5));
      ctx.scale(z.face, 1);
      if (z.flash > 0) ctx.filter = 'brightness(3)';
      draw(z.explosive ? 'pzidle' : z.skeleton ? 'skelidle' : z.police ? 'polisidle' : (z.spitter ? 'tukidle' : 'zidle'), -8, -16, 16, 16, '#5a8a3a');
      ctx.filter = 'none';
      ctx.restore();
      continue;
    }
    const step = Math.floor(z.animTime / 0.25) % 2 === 0;
    let key, color;
    if (z.mega) {
      key = z.windup !== null || !z.moving ? 'megaidle' : (Math.floor(z.animTime / 0.4) % 2 === 0 ? 'megawalk1' : 'megawalk2');
      color = '#4f9a2c';
    } else if (z.necro) {
      key = z.windup !== null || !z.moving ? 'necroidle' : (Math.floor(z.animTime / 0.35) % 2 === 0 ? 'necrowalk1' : 'necrowalk2');
      color = '#3b2a5a';
    } else if (z.skeleton) {
      key = z.rise > 0 ? 'skelidle' : (step ? 'skelwalk1' : 'skelwalk2');
      color = '#e8e4d0';
    } else if (z.police) {
      key = (z.state === 'windup' || !z.moving) ? 'polisidle' : (Math.floor(z.animTime / 0.2) % 2 === 0 ? 'poliswalk1' : 'poliswalk2');
      color = '#1f3a6a';
    } else if (z.tank) {
      key = (z.state === 'windup' || z.state === 'stun') ? 'tankidle' : (Math.floor(z.animTime / (z.state === 'charge' ? 0.12 : 0.4)) % 2 === 0 ? 'tankwalk1' : 'tankwalk2');
      color = '#4a525c';
    } else if (z.spitter) {
      key = z.moving ? (step ? 'tukwalk1' : 'tukwalk2') : 'tukidle';
      color = '#8fbf3a';
    } else if (z.explosive) {
      key = z.fuse !== null ? 'pzidle' : (step ? 'pzwalk1' : 'pzwalk2');
      color = '#d0802a';
    } else {
      key = step ? 'zwalk1' : 'zwalk2';
      color = '#5a8a3a';
    }
    // vurulunca veya fitil yanarken parlar
    const hot = z.flash > 0 || (z.fuse !== null && Math.floor(z.fuse * 16) % 2 === 0);
    if (hot) ctx.filter = 'brightness(3)';
    const shk = (z.tank && z.state === 'windup') ? Math.round((Math.random() - 0.5) * 3) : 0;   // hucum oncesi titrer
    if ((z.size || 16) > 16) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(Math.round(z.x) + 2, Math.round(z.y + z.size) - 3, z.size - 4, 3);
    }
    if (z.tank) {
      if (z.state === 'windup') {                      // kirmizi uyari halkasi
        ctx.fillStyle = 'rgba(255,40,30,' + (0.25 + 0.2 * Math.sin(z.stateT * 40)).toFixed(2) + ')';
        ctx.fillRect(Math.round(z.x) + 1, Math.round(z.y) + 20, 22, 4);
      }
    }
    let yo = 0;
    if (z.skeleton && z.rise > 0) {                // topraktan yukselir
      yo = (z.rise / SKEL_RISE) * 8;
      ctx.globalAlpha = 1 - 0.7 * (z.rise / SKEL_RISE);
    }
    drawChar(z.x + shk, z.y + yo, z.face, key, color, z.size || 16);
    ctx.globalAlpha = 1;
    if (hot) ctx.filter = 'none';
    if (z.mega && z.windup !== null) {              // agzinda sisen dev zehir damlasi
      const k = 1 - Math.max(0, z.windup) / MEGA_WINDUP;
      const bs = 2 + Math.round(k * 6);
      const bx = Math.round(z.x + z.half + z.face * 11) - (bs >> 1);
      const by2 = Math.round(z.y + 12) - (bs >> 1);
      ctx.fillStyle = '#4aa02c';
      ctx.fillRect(bx, by2, bs, bs);
      ctx.fillStyle = '#b8ff7a';
      ctx.fillRect(bx, by2, Math.max(1, bs >> 1), 1);
    }
    if (z.necro && z.windup !== null) {             // asanin ucunda buyuyen mor kure
      const k = 1 - Math.max(0, z.windup) / NECRO_WINDUP;
      const bs = 3 + Math.round(k * 5);
      const bx = Math.round(z.x + z.half + z.face * 9) - (bs >> 1);
      const by2 = Math.round(z.y + 2) - (bs >> 1);
      ctx.fillStyle = 'rgba(160,64,224,0.55)';
      ctx.fillRect(bx - 1, by2 - 1, bs + 2, bs + 2);
      ctx.fillStyle = '#c060ff';
      ctx.fillRect(bx, by2, bs, bs);
      ctx.fillStyle = '#f0d0ff';
      ctx.fillRect(bx, by2, Math.max(1, bs >> 1), 1);
    }
    if (z.police && z.state === 'windup' && Math.floor(z.stateT * 30) % 2 === 0) {   // bicak parlar
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(z.x + 8 + z.face * 7) - 1, Math.round(z.y + 6), 3, 3);
    }
    if (z.spitter && z.windup !== null) {            // agzinda sisen zehir damlasi
      const k = 1 - Math.max(0, z.windup) / SPIT_WINDUP;
      const bs = 1 + Math.round(k * 3);
      const bx = Math.round(z.x + 8 + z.face * 6) - Math.floor(bs / 2);
      const by2 = Math.round(z.y + 6) - Math.floor(bs / 2);
      ctx.fillStyle = '#4aa02c';
      ctx.fillRect(bx, by2, bs, bs);
      ctx.fillStyle = '#b8ff7a';
      ctx.fillRect(bx, by2, Math.max(1, bs >> 1), 1);
    }
  }

  // havadaki tukuruk (mega tukuruk daha buyuk)
  for (const s of spits) {
    const k = Math.min(1, s.t);
    const gx = s.sx + (s.tx - s.sx) * k, gy = s.sy + (s.ty - s.sy) * k;
    const hw = Math.round(2 * (s.r || 12) / 12);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(Math.round(gx) - hw, Math.round(gy) + 4, hw * 2, 1);
    const ax = Math.round(gx), ay = Math.round(gy - Math.sin(Math.PI * k) * 14);
    ctx.fillStyle = '#3f8f26';
    ctx.fillRect(ax - hw, ay - hw, hw * 2, hw * 2);
    ctx.fillStyle = '#7be04a';
    ctx.fillRect(ax - hw + 1, ay - hw + 1, hw * 2 - 2, hw * 2 - 2);
    ctx.fillStyle = '#d4ffa8';
    ctx.fillRect(ax - hw + 1, ay - hw, Math.max(1, hw - 1), 1);
  }

  // oyuncu
  const blink = player.hurtTimer > 0 && Math.floor(player.hurtTimer * 20) % 2 === 0;
  if (!blink && player.hp > 0) {
    let key = 'idle';
    if (player.walking) key = Math.floor(player.animTime / 0.15) % 2 === 0 ? 'walk1' : 'walk2';
    drawChar(player.x, player.y, player.face, key, '#3a6ad0');
    drawAccessories(ctx, player.x, player.y, player.face, key);

    const a = aimAngle();
    const c = center();
    const sg = player.weapon === 'shotgun';
    const dist = sg ? (player.recoil > 0 ? 3 : 7) : (player.recoil > 0 ? 5 : 8);
    ctx.save();
    ctx.translate(Math.round(c.x + Math.cos(a) * dist), Math.round(c.y + Math.sin(a) * dist));
    ctx.rotate(a);
    if (Math.cos(a) < 0) ctx.scale(1, -1);
    if (sg) {
      draw('shotgun', -3, -4, 16, 8, '#777777');
      if (player.fireTimer > 0) {            // namlu alevi
        ctx.fillStyle = '#fff3b0';
        ctx.fillRect(13, -3, 6, 6);
        ctx.fillStyle = '#ff9922';
        ctx.fillRect(17, -2, 6, 4);
      }
    } else {
      draw(player.fireTimer > 0 ? 'gunFire' : 'gun', -4, -4, 8, 8, '#bbb');
    }
    ctx.restore();
  }

  // mermiler
  ctx.fillStyle = '#ffe066';
  for (const b of bullets) ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, 2, 2);

  // patlama dalgasi (genisleyen halka)
  for (const sw of shockwaves) {
    const k = sw.t / 0.3;
    const r = EXPLOSION_RADIUS * k;
    ctx.strokeStyle = 'rgba(255,220,120,' + (1 - k).toFixed(2) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Math.round(sw.x), Math.round(sw.y), r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // parcaciklar
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max * 1.5));
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;

  drawNight();

  ctx.restore();

  // hasar efekti: kirmizi kenarlar (vurulunca parlar, can azken surekli atar)
  let dmg = hurtFlash > 0 ? (hurtFlash / 0.5) * 0.75 : 0;
  if (player.hp > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 1000 * (player.hp <= 1 ? 7 : 4));
    if (player.hp <= 1) dmg = Math.max(dmg, 0.3 + 0.25 * pulse);
    else if (player.hp <= 2) dmg = Math.max(dmg, 0.12 + 0.1 * pulse);
  }
  if (dmg > 0) drawDamageVignette(dmg);
  if (player.poison > 0 && player.hp > 0) {
    const pp = 0.5 + 0.5 * Math.sin(performance.now() / 1000 * 5);
    drawDamageVignette(0.14 + 0.1 * pp, '70,200,40');
  }
  if (poisonFlash > 0) {
    ctx.fillStyle = 'rgba(90,230,50,' + (poisonFlash / 0.3 * 0.2).toFixed(2) + ')';
    ctx.fillRect(0, 0, W, H);
  }
  if (hurtFlash > 0) {
    ctx.fillStyle = 'rgba(255,0,0,' + (hurtFlash / 0.5 * 0.18).toFixed(2) + ')';
    ctx.fillRect(0, 0, W, H);
  }

  // arayuz
  ctx.fillStyle = '#fff';
  ctx.font = '8px monospace';
  ctx.textBaseline = 'top';
  ctx.fillText('Can: ' + '♥'.repeat(Math.max(0, player.hp)), 4, 4);
  ctx.fillText('Skor: ' + score, W - 54, 4);

  // dash gostergesi
  const ready = player.dashCd <= 0;
  const ratio = 1 - player.dashCd / DASH_COOLDOWN;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(4, 15, 42, 6);
  ctx.fillStyle = ready ? '#66ddff' : '#5577aa';
  ctx.fillRect(5, 16, Math.round(40 * ratio), 4);
  ctx.fillStyle = '#fff';
  ctx.fillText(ready ? 'SHIFT' : 'DASH', 50, 14);

  // coin
  ctx.fillStyle = '#ffd54a';
  ctx.fillRect(W - 54, 15, 6, 6);
  ctx.fillStyle = '#b8860b';
  ctx.fillRect(W - 54, 19, 6, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('x ' + coins, W - 45, 14);

  // medkit sayisi
  if (player.medkits > 0) {
    ctx.fillStyle = '#ff7777';
    ctx.fillText('H: MEDKIT x' + player.medkits, 4, 24);
  }

  // zehir gostergesi
  if (player.poison > 0 && player.hp > 0) {
    const py2 = player.medkits > 0 ? 34 : 24;
    ctx.fillStyle = '#8aff4a';
    ctx.fillText('ZEHİR', 4, py2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(4, py2 + 9, 32, 4);
    ctx.fillStyle = '#6fd43a';
    ctx.fillRect(5, py2 + 10, Math.round(30 * Math.min(1, player.poison / POISON_TIME)), 2);
  }

  // dalga bilgisi (ust orta)
  ctx.textAlign = 'center';
  if (wave.phase === 'break') {
    ctx.fillStyle = '#7cff6b';
    ctx.fillText('SONRAKİ DALGA: ' + Math.ceil(wave.t), W / 2, 4);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillText('DALGA ' + wave.n + '  KALAN: ' + ((wave.total - wave.spawned) + zombies.length), W / 2, 4);
  }
  ctx.textAlign = 'left';

  // boss can cubugu (ust orta)
  const boss = zombies.find(z => z.boss && !z.dead);
  if (boss) {
    const bw = 110, bx = Math.round(W / 2 - bw / 2);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(bx - 1, 15, bw + 2, 8);
    ctx.fillStyle = '#1a1020';
    ctx.fillRect(bx, 16, bw, 6);
    ctx.fillStyle = (boss.state === 'windup' || (boss.windup !== null && boss.windup !== undefined)) ? '#ffffff' : boss.barColor;
    ctx.fillRect(bx, 16, Math.round(bw * Math.max(0, boss.hp) / boss.maxHp), 6);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '6px monospace';
    ctx.fillText(boss.bossName, W / 2, 16);
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
  }

  // silah secimi (shotgun alindiysa)
  if (player.hasShotgun) {
    ctx.fillStyle = player.weapon === 'glock' ? '#ffe066' : '#888888';
    ctx.fillText('1 Glock', 4, H - 12);
    ctx.fillStyle = player.weapon === 'shotgun' ? '#ffe066' : '#888888';
    ctx.fillText('2 Shotgun', 50, H - 12);
  }

  drawFloats();
  drawWaveMessage();
  if (shop.open) drawShopPanel();

  if (bossFlash) {                               // boss olunce ekran parlar
    ctx.fillStyle = 'rgba(' + bossFlash.rgb + ',' + (0.45 * (1 - bossFlash.t / bossFlash.dur)).toFixed(2) + ')';
    ctx.fillRect(0, 0, W, H);
  }
  if (trans) {                                   // polis istasyonuna gecis: kararma + baslik
    const t = trans.t;
    const a = t < 1 ? t : (t < 2.0 ? 1 : Math.max(0, 1 - (t - 2.0) / 1.2));
    ctx.fillStyle = 'rgba(0,0,0,' + a.toFixed(2) + ')';
    ctx.fillRect(0, 0, W, H);
    if (a > 0.6) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (a - 0.6) / 0.4);
      dtxt('POLİS İSTASYONU', W / 2, H / 2 - 6, 14, '#7cc8ff', 'center');
      dtxt('POLİS ZOMBİLERİ BIÇAKLI!', W / 2, H / 2 + 14, 7, '#ff9a9a', 'center');
      ctx.restore();
    }
  }
  if (player.hp <= 0) drawDeathScreen();
}

// ================== DONGU ==================
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (gameState === 'playing') update(dt);
  if (gameState !== 'menu') render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);