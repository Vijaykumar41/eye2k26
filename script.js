/* ================= COUNTDOWN ================= */

document.addEventListener("DOMContentLoaded", function () {

  const eventDate = new Date(2026, 2, 24, 10, 0, 0).getTime();
  const countdownContainer = document.querySelector(".countdown");

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = eventDate - now;

    if (diff <= 0) {
      countdownContainer.innerHTML =
        "<div class='event-started'>⚡ EVENT STARTED ⚡</div>";
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
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});


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
      date: "06 – 09 Feb 2026",
      desc: "Showcasing innovative electrical projects and ideas."
    },
    {
      img: "images/session2.jpg",
      title: "Technical Workshops",
      date: "07 Feb 2026",
      desc: "Hands-on training sessions by industry experts."
    },
    {
      img: "images/session3.jpg",
      title: "Paper Presentations",
      date: "08 Feb 2026",
      desc: "Platform for students to present research work."
    }
  ];

  let current = 0;

  const img = document.getElementById("sessionImg");
  const title = document.getElementById("sessionTitle");
  const date = document.getElementById("sessionDate");
  const desc = document.getElementById("sessionDesc");

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


/* ===== PARTICLE ELECTRIC BACKGROUND ===== */

const pCanvas = document.getElementById("particleCanvas");

if (pCanvas) {
  const ctx = pCanvas.getContext("2d");
  let particles = [];

  function resize() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  function createParticles() {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "#00eaff";
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (
        p.x < 0 || p.x > pCanvas.width ||
        p.y < 0 || p.y > pCanvas.height
      ) particles.splice(i, 1);
    });

    createParticles();
    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}
