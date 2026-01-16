const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w, h, particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    s: Math.random() * .4 + .2
  });
}

function draw() {
  ctx.clearRect(0,0,w,h);
  particles.forEach(p => {
    ctx.fillStyle = "#7a7cff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
    p.y += p.s;
    if (p.y > h) p.y = 0;
  });
  requestAnimationFrame(draw);
}
draw();
