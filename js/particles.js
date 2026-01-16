const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
const PARTICLE_COUNT = 120;

function resizeCanvas() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor(){ this.reset(); }
  reset(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.radius=Math.random()*1.8+0.6; this.speedY=Math.random()*0.25+0.05; this.alpha=Math.random()*0.6+0.3; this.color="120,180,255"; }
  update(){ this.y-=this.speedY; if(this.y<-10){ this.y=canvas.height+10; this.x=Math.random()*canvas.width; } }
  draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fillStyle=`rgba(${this.color},${this.alpha})`; ctx.fill(); }
}

function initParticles(){ particles=[]; for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Particle()); }
function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animate); }

initParticles(); animate();
