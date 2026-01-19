document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let mode = "normal";

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const center = () => ({
    x: canvas.width / 2,
    y: canvas.height / 2
  });

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.3,
    vy: Math.random() * 0.6 + 0.2
  }));

  // 👇 API GLOBAL SEGURA
  window.setParticleMode = function (newMode) {
    mode = newMode;
  };

  function update(p) {
    if (mode === "vacio") {
      const c = center();
      const dx = c.x - p.x;
      const dy = c.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      p.vx += dx / dist * 0.04;
      p.vy += dy / dist * 0.04;

      p.x += p.vx;
      p.y += p.vy;

      if (dist < 10) {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.vx = 0;
        p.vy = 0;
      }
      return;
    }

    // NORMAL
    p.x += p.vx;
    p.y += p.vy;

    if (p.y > canvas.height) p.y = 0;
    if (p.x > canvas.width) p.x = 0;
    if (p.x < 0) p.x = canvas.width;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle =
      mode === "vacio"
        ? "rgba(0,255,136,0.35)"
        : "rgba(0,255,136,0.6)";

    particles.forEach(p => {
      update(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
});
