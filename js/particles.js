/* =====================
   PARTICLES — UMBRALA
   Sincronizado por estado
===================== */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let W, H;
let particles = [];
let currentMode = "boot";

/* =====================
   RESIZE
===================== */
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* =====================
   MODOS
===================== */
const MODES = {
  boot: {
    count: 35,
    speed: 0.2,
    drift: 0.15,
    alpha: 0.5
  },
  rooms: {
    count: 60,
    speed: 0.4,
    drift: 0.3,
    alpha: 0.7
  },
  chat: {
    count: 90,
    speed: 0.7,
    drift: 0.6,
    alpha: 0.9
  }
};

/* =====================
   PARTICLE
===================== */
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    const m = MODES[currentMode];
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * m.speed;
    this.vy = (Math.random() - 0.5) * m.speed;
    this.size = Math.random() * 1.5 + 0.5;
  }

  update() {
    const m = MODES[currentMode];
    this.x += this.vx + (Math.random() - 0.5) * m.drift;
    this.y += this.vy + (Math.random() - 0.5) * m.drift;

    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }

  draw() {
    const m = MODES[currentMode];
    ctx.fillStyle = `rgba(0,255,136,${m.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* =====================
   MODE DETECTOR
===================== */
function detectMode() {
  if (document.getElementById("chatScreen").classList.contains("active")) {
    return "chat";
  }
  if (document.getElementById("roomsScreen").classList.contains("active")) {
    return "rooms";
  }
  return "boot";
}

/* =====================
   SYNC MODE
===================== */
function syncMode() {
  const newMode = detectMode();
  if (newMode !== currentMode) {
    currentMode = newMode;
    regenerateParticles();
  }
}

function regenerateParticles() {
  particles = [];
  const count = MODES[currentMode].count;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

/* =====================
   LOOP
===================== */
function animate() {
  syncMode();

  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

/* =====================
   INIT
===================== */
regenerateParticles();
animate();
