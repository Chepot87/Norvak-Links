// =========================
// Norvak Micro Interactions
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const links = document.querySelectorAll(".link");
  if (!links.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // =========================
  // Magnetic hover (desktop only)
  // =========================
  if (!prefersReducedMotion && !isTouchDevice) {
    links.forEach(link => {
      link.addEventListener("mousemove", e => {
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
  if (!prefersReducedMotion) {
    links.forEach(link => {
      link.addEventListener("click", () => {
        link.classList.add("clicked");
        setTimeout(() => {
          link.classList.remove("clicked");
        }, 350);
      });
    });
  }
});


const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const letters = "NORVAK01<>/{}";
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = Array.from({ length: columns }).fill(1);

function draw(){
  ctx.fillStyle = "rgba(11,11,16,0.08)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#00ff9d";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random()*letters.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);

    if (y * fontSize > canvas.height && Math.random() > 0.985) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

setInterval(draw, 60); // lento = elegante
