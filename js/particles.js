// ====================================
// PARTICLES.JS — FONDO CYBERPUNK
// ====================================

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particlesArray;
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// --------------------------
// PARTICLE CLASS
// --------------------------
class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = `rgba(0,255,255,${Math.random()})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebotar en bordes
    if (this.x > w || this.x < 0) this.speedX = -this.speedX;
    if (this.y > h || this.y < 0) this.speedY = -this.speedY;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --------------------------
// CREAR PARTICULAS
// --------------------------
function initParticles() {
  particlesArray = [];
  const count = Math.floor((w + h) / 15); // cantidad de partículas proporcional al tamaño de la pantalla
  for (let i = 0; i < count; i++) {
    particlesArray.push(new Particle());
  }
}
initParticles();

// --------------------------
// ANIMACIÓN
// --------------------------
function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });

  // Conectar partículas cercanas
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,255,${1 - distance / 120})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#0ff';
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

// --------------------------
// AJUSTAR A CAMBIO DE PANTALLA
// --------------------------
window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  initParticles();
});
