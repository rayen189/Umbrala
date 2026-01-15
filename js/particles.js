// === PARTICULAS FUTURISTAS CYBERPUNK ===
const canvas = document.createElement('canvas');
canvas.id = 'particles-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// CONFIG PARTICULAS
const particleCount = 80;
const particles = [];

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = Math.random() * 3 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.color = `hsl(180,100%,50%)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(180,100%,50%,${this.alpha})`;
    ctx.fill();
  }
}

for(let i=0;i<particleCount;i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0,0,w,h);
  // dibujar lineas entre particulas cercanas
  for(let i=0;i<particles.length;i++){
    const p = particles[i];
    p.update();
    p.draw();
    for(let j=i+1;j<particles.length;j++){
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120){
        ctx.beginPath();
        ctx.strokeStyle = `hsla(180,100%,50%,${1-dist/120})`;
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}

animate();
