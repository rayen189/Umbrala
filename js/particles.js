const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

let dots = Array.from({ length: 70 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: Math.random() - 0.5,
  vy: Math.random() - 0.5
}));

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#7a7cff";
  dots.forEach(d => {
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    ctx.fillRect(d.x, d.y, 2, 2);
  });
  requestAnimationFrame(draw);
}
draw();
