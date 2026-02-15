/* ================= COUNTDOWN ================= */

const eventDate = new Date(2026, 2, 24, 10, 0, 0).getTime();
const countdownContainer = document.querySelector(".countdown");

const interval = setInterval(() => {
  const now = new Date().getTime();
  const diff = eventDate - now;

  if (diff <= 0) {
    clearInterval(interval);
    countdownContainer.innerHTML = `
      <div class="event-started">⚡ EVENT STARTED ⚡</div>
    `;
    return;
  }

  document.getElementById("days").innerText =
    Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").innerText =
    Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  document.getElementById("minutes").innerText =
    Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  document.getElementById("seconds").innerText =
    Math.floor((diff % (1000 * 60)) / 1000);

}, 1000);



/* ================= LIGHTBOX ================= */

function openLightbox(src) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});



/* ================= PAGE LOADER ================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }, 1800);
});



/* ================= SCROLL FADE ================= */

const elements = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});



/* ================= SESSION SLIDER ================= */

document.addEventListener("DOMContentLoaded", () => {

  const sessions = [
    {
      img: "images/session1.jpg",
      title: "Theme Expo",
      date: "06th Feb – 09th Feb 2026",
      desc: "Showcasing innovative ideas and prototypes."
    },
    {
      img: "images/session2.jpg",
      title: "Tech Workshops",
      date: "07th Feb 2026",
      desc: "Hands-on sessions by industry experts."
    },
    {
      img: "images/session3.jpg",
      title: "Paper Presentations",
      date: "08th Feb 2026",
      desc: "Platform for students to present research."
    }
  ];

  let current = 0;

  const img = document.querySelector(".highlight-card img");
  const title = document.querySelector(".highlight-content h3");
  const date = document.querySelector(".highlight-content .date");
  const desc = document.querySelector(".highlight-content .desc");

  function update() {
    if (!img) return;
    img.src = sessions[current].img;
    title.textContent = sessions[current].title;
    date.textContent = sessions[current].date;
    desc.textContent = sessions[current].desc;
  }

  window.nextSession = () => {
    current = (current + 1) % sessions.length;
    update();
  };

  window.prevSession = () => {
    current = (current - 1 + sessions.length) % sessions.length;
    update();
  };

  update();
});



/* ================= HAMBURGER MENU ================= */

function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
}



/* ================= SPARK CURSOR ================= */

const canvas = document.getElementById("sparkCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let sparks = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("mousemove", e => {
    for (let i = 0; i < 3; i++) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks.forEach((s, i) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,234,255,${s.life / 30})`;
      ctx.fill();

      s.x += s.vx;
      s.y += s.vy;
      s.life--;

      if (s.life <= 0) sparks.splice(i, 1);
    });

    requestAnimationFrame(draw);
  }

  draw();
}
