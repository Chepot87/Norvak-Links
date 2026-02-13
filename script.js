// =========================
// Norvak Micro Interactions + Matrix
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const links = document.querySelectorAll(".link");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // =========================
  // Magnetic hover (desktop only)
  // =========================
  if (!prefersReducedMotion && !isTouchDevice && links.length) {
    links.forEach((link) => {
      link.addEventListener("mousemove", (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        link.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
      });

      link.addEventListener("mouseleave", () => {
        link.style.transform = "translate(0, 0)";
      });
    });
  }

  // =========================
  // Click feedback (pulse)
  // =========================
  if (!prefersReducedMotion && links.length) {
    links.forEach((link) => {
      link.addEventListener("click", () => {
        link.classList.add("clicked");
        window.setTimeout(() => link.classList.remove("clicked"), 350);
      });
    });
  }

  // =========================
  // Matrix Background (slower + optimized)
  // =========================
  const canvas = document.getElementById("matrix");
  if (!canvas) return;

  // If user prefers reduced motion, keep it calm (no animation).
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const letters = "NORVAK01<>/{}";
  const fontSize = 14;

  // ✅ Slower controls (tweak these if you want)
  const fps = 10;          // before: ~16fps (60ms). Now ~10fps = slower
  const speed = 0.75;      // drop increment per frame. < 1 = slower fall

  let columns = 0;
  let drops = [];

  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => 1);
  }

  function draw() {
    // Fade trail (slightly stronger fade = calmer look)
    ctx.fillStyle = "rgba(11, 11, 16, 0.10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff9d";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // reset with a little randomness
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
        drops[i] = 0;
      }

      drops[i] += speed; // ✅ slower fall
    }
  }

  // Resize (debounced)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 120);
  });

  setup();

  // requestAnimationFrame loop with FPS cap (more efficient than setInterval)
  let last = 0;
  const frameTime = 1000 / fps;

  function loop(now) {
    if (now - last >= frameTime) {
      last = now;
      draw();
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
