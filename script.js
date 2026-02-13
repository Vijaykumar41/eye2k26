const eventDate = new Date(2026, 2, 24, 10, 0, 0).getTime();

const countdownContainer = document.querySelector(".countdown");

const interval = setInterval(() => {
  const now = new Date().getTime();
  const diff = eventDate - now;

  if (diff <= 0) {
    clearInterval(interval);

    // Replace countdown with message
    countdownContainer.innerHTML = `
      <div class="event-started">
        ⚡ EVENT STARTED ⚡
      </div>
    `;

    // Add animation class
    countdownContainer.classList.add("started-animation");

    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

}, 1000);


// Modal
function openModal(title) {
  document.getElementById("eventTitle").innerText = title;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Lightbox Functions
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = src;
  lightbox.style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// Close with ESC key
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

// POWER ON EFFECT
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }, 1800);
});


// Scroll fade animation
const elements = document.querySelectorAll('.fade');

window.addEventListener('scroll', () => {
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add('show');
    }
  });
});


function openModal() {
  document.getElementById("eventModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
}

window.onclick = function (e) {
  const modal = document.getElementById("eventModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};



// Get modal element
const modal = document.getElementById("eventModal");

// Open modal
function openModal() {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden"; // prevent background scroll
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside content
window.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});




document.addEventListener("DOMContentLoaded", () => {

  const sessions = [
    {
      img: "images/session1.jpg",
      title: "Theme Expo",
      date: "06th Feb – 09th Feb 2026",
      desc: "Showcasing innovative ideas and prototypes that leverage science, engineering, and technology."
    },
    {
      img: "images/session2.jpg",
      title: "Tech Workshops",
      date: "07th Feb 2026",
      desc: "Hands-on sessions conducted by industry experts and academicians."
    },
    {
      img: "images/session3.jpg",
      title: "Paper Presentations",
      date: "08th Feb 2026",
      desc: "Platform for students to present research and innovative ideas."
    }
  ];

  let current = 0;

  const cardImg = document.querySelector(".highlight-card img");
  const title = document.querySelector(".highlight-content h3");
  const date = document.querySelector(".highlight-content .date");
  const desc = document.querySelector(".highlight-content .desc");
  const dots = document.querySelectorAll(".dot");

  function updateSession() {
    cardImg.src = sessions[current].img;
    title.textContent = sessions[current].title;
    date.textContent = "📅 " + sessions[current].date;
    desc.textContent = sessions[current].desc;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  window.nextSession = function () {
    current = (current + 1) % sessions.length;
    updateSession();
  };

  window.prevSession = function () {
    current = (current - 1 + sessions.length) % sessions.length;
    updateSession();
  };

  updateSession(); // load first card
});



function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
  document.querySelector(".hamburger").classList.toggle("active");
}




/* ================= ELECTRIC SPARK CURSOR ================= */
const canvas = document.getElementById("sparkCanvas");
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

function drawSparks() {
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

  requestAnimationFrame(drawSparks);
}
drawSparks();






