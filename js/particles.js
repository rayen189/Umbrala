const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const particles = [];
const PARTICLE_COUNT = 100;

class Particle{
  constructor(){
    this.x = Math.random()*width;
    this.y = Math.random()*height;
    this.vx = (Math.random()-0.5)*0.5;
    this.vy = (Math.random()-0.5)*0.5;
    this.size = Math.random()*2+1;
    this.color = `hsl(${Math.random()*360}, 100%, 50%)`;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0 || this.x>width) this.vx*=-1;
    if(this.y<0 || this.y>height) this.vy*=-1;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=this.color;
    ctx.shadowColor=this.color;
    ctx.shadowBlur=10;
    ctx.fill();
  }
}

for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Particle());

function animate(){
  ctx.fillStyle='rgba(0,0,0,0.1)';
  ctx.fillRect(0,0,width,height);
  particles.forEach(p=>{
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

function connectParticles(){
  const maxDist = 100;
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < maxDist){
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle=`rgba(0,255,255,${1 - dist/maxDist})`;
        ctx.lineWidth=1;
        ctx.shadowBlur=5;
        ctx.stroke();
      }
    }
  }
}

animate();
