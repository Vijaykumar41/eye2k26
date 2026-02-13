/* =====================================================
   EVENT DATA
===================================================== */
let currentUPI = {
  phonepe: "",
  gpay: "",
  paytm: ""
};


const data = {

  "Project Expo": {
    desc: "Showcase innovative electrical and electronics projects with working models and prototypes.",
    rules: [
      "Maximum 4 members per team",
      "Working model or prototype mandatory",
      "One team per college"
    ],
    fee: 10,
    p1: 3000,
    p2: 1500,
    coords: [
      "B Karthik – 8019239711",
      "S Mehaboob Basha – 8897327514"
    ]
  },

  "Paper Presentation": {
    desc: "Present your research ideas related to Electrical and Power Systems.",
    rules: [
      "Maximum 2 authors per paper",
      "IEEE format mandatory",
      "8 minutes presentation + 2 minutes Q&A"
    ],
    fee: 500,
    p1: 2000,
    p2: 1000,
    coords: [
      "P Kavya Sree – 8096990897"
    ]
  },

  "Poster Presentation": {
    desc: "Visually present innovative technical concepts and ideas.",
    rules: [
      "Poster size A1 only",
      "Original content required",
      "One poster per team"
    ],
    fee: 400,
    p1: 1500,
    p2: 800,
    coords: [
      "K Varshitha – 7396759396"
    ]
  },

  "Workshop": {
    desc: "Hands-on technical workshop conducted by industry experts.",
    rules: [
      "Individual participation",
      "Laptop compulsory",
      "Limited seats available"
    ],
    fee: 600,
    p1: 0,
    p2: 0,
    coords: [
      "A Sai Teja – 9876543210"
    ]
  },

  "Circuit Hunt": {
    desc: "Solve electrical circuits and puzzles under time pressure.",
    rules: [
      "Team of 2 members",
      "Multiple elimination rounds",
      "Basic circuit knowledge required"
    ],
    fee: 300,
    p1: 1500,
    p2: 800,
    coords: [
      "N Rohith – 9123456780"
    ]
  },

  "Technical Quiz": {
    desc: "Test your Electrical & Electronics Engineering knowledge.",
    rules: [
      "Team of 2 members",
      "MCQ + Rapid fire rounds",
      "Decision of judges is final"
    ],
    fee: 300,
    p1: 1200,
    p2: 600,
    coords: [
      "M Keerthana – 9988776655"
    ]
  },

  "Hackathon": {
    desc: "24-hour innovation challenge to solve real-world problems.",
    rules: [
      "Team of 1 to 4 members",
      "Problem statement given on spot",
      "Bring your own laptops"
    ],
    fee: 1000,
    p1: 5000,
    p2: 2500,
    coords: [
      "S Sai Kumar – 9876501234"
    ]
  },

  "open": {
    desc: "Showcase your talent in singing, poetry, comedy, or storytelling on the open stage",
    rules: [
      "Individual participation only.",
      "Participants can perform singing, poetry, storytelling, stand-up comedy, or any creative act.",
      "Vulgar, offensive, or inappropriate content is strictly prohibited",
      "Judges’ decision will be final and binding."
    ],
    fee: 200,
    p1: 2500,
    p2: 800,
    coords: [
      "R Harsha – 9000011111"
    ]
  },

  "Photography": {
    desc: "Capture creative moments during the fest.",
    rules: [
      "One photo per participant",
      "Original photo only",
      "Basic editing allowed"
    ],
    fee: 200,
    p1: 2500,
    p2: 800,
    coords: [
      "Student Coordinators"
    ]
  },

  "Chess": {
    desc: "Test your strategic thinking and tactical skills in an intense battle of minds. Compete against fellow participants and prove your mastery in the ultimate game of strategy.",
    rules: [
      "The tournament will follow a knockout / Swiss format (based on number of participants).",
      "Each player will be given a fixed time limit (e.g., 10 minutes per player)",
      "Standard FIDE rules will be followed",
      "Decision of the organizers/judges will be final"
    ],
    fee: 300,
    p1: 3400,
    p2: 900,
    coords: [
      "Student Coordinators"
    ]
  },
   "reel": {
    desc: "Exciting fun and team-based games.",
    rules: [
      "On-spot registration",
      "Rules explained at venue"
    ],
    fee: 0,
    p1: 500,
    p2: 200,
    coords: [
      "Student Coordinators"
    ]
  },
  "Drawing": {
    desc: "Express your imagination and creativity through colors and art. Showcase your artistic skills and bring your ideas to life on canvas during the fest..",
    rules: [
      "Individual participation only.",
      "Only original artwork is allowed.",
      "Any form of tracing or copying is strictly prohibited.",
      "Judges’ decision will be final and binding."
    ],
    fee: 300,
    p1: 3000,
    p2: 1000,
    coords: [
      "Student Coordinators"
    ]
  },

};

/* =====================================================
   GLOBALS
===================================================== */
let selectedEvent = "";
let upiInterval = null;

/* =====================================================
   EVENT DETAILS MODAL
===================================================== */
function openModal(name) {
  selectedEvent = name;
  const e = data[name];

  document.getElementById("eventTitle").innerText = name;
  document.getElementById("eventDesc").innerText = e.desc;
  document.getElementById("eventFee").innerText = e.fee;
  document.getElementById("p1").innerText = e.p1;
  document.getElementById("p2").innerText = e.p2;

  const rulesList = document.getElementById("eventRules");
  rulesList.innerHTML = "";
  e.rules.forEach(rule => {
    const li = document.createElement("li");
    li.textContent = rule;
    rulesList.appendChild(li);
  });

  const coordList = document.getElementById("eventCoordinators");
  coordList.innerHTML = "";
  e.coords.forEach(coord => {
    const li = document.createElement("li");
    li.textContent = coord;
    coordList.appendChild(li);
  });

  document.getElementById("eventModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
}

/* =====================================================
   REGISTRATION MODAL
===================================================== */
function openRegister() {
  document.getElementById("regEvent").innerText = selectedEvent;
  closeModal();
  document.getElementById("registerModal").style.display = "flex";
}

function closeRegister() {
  document.getElementById("registerModal").style.display = "none";
}

/* =====================================================
   UPI PAYMENT
===================================================== */
function startPayment() {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if (!name || !email || !college || !mobile) {
    alert("Kurapati Vijay Kumar");
    return;
  }
  if (!isValidEmail(email)) {
  alert("vijaykumar5127865@gmail.com");
  return;
}

if (!/^[6-9][0-9]{9}$/.test(mobile)) {
  alert("8688753307r");
  return;
}

  closeRegister();

  const amount = data[selectedEvent].fee;

  document.getElementById("upiEvent").innerText = selectedEvent;
  document.getElementById("upiAmount").innerText = amount;
  document.getElementById("upiModal").style.display = "flex";

  const upiID = "vijaykumar5127865@okhdfcbank"; // 🔴 CHANGE THIS
  const note = `${selectedEvent} - ${name}`;

  const upiURL =
    `upi://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  new QRious({
  element: document.getElementById("upiQR"),
  value: upiURL,
  size: 220
});

/* ================= STORE UPI DEEP LINKS ================= */

// Universal official UPI link (works for all apps without warning)
const universalUPI =
  `upi://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

currentUPI.phonepe = universalUPI;
currentUPI.gpay = universalUPI;
currentUPI.paytm = universalUPI;

/* ================= STORE UPI DEEP LINKS ================= */
currentUPI.phonepe =
  `phonepe://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

currentUPI.gpay =
  `tez://upi/pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

currentUPI.paytm =
  `paytmmp://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

startUPITimer();

}

function startUPITimer() {
  let time = 300;
  clearInterval(upiInterval);

  upiInterval = setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;

    document.getElementById("upiTimer").innerText =
      `${min}:${sec < 10 ? "0" : ""}${sec}`;

    time--;

    if (time < 0) {
      clearInterval(upiInterval);
      alert("UPI QR expired. Please try again.");
      closeUPI();
    }
  }, 1000);
}

function closeUPI() {
  clearInterval(upiInterval);
  document.getElementById("upiModal").style.display = "none";
}


/* =====================================================
   UTR MODAL
===================================================== */
function paymentDone() {
  clearInterval(upiInterval);
  closeUPI();
  document.getElementById("utrModal").style.display = "flex";
}

function submitUTR() {
  const utr = document.getElementById("utrInput").value.trim();

  if (!/^[0-9]{12}$/.test(utr)) {
    alert("Please enter a valid 12-digit UTR number");
    return;
  }

  alert(
    "UTR submitted successfully!\n\n" +
    "Your registration is under verification.\n" +
    "You will receive confirmation soon."
  );

  closeUTR();
}

function closeUTR() {
  document.getElementById("utrModal").style.display = "none";
  document.getElementById("utrInput").value = "";
}

/* =====================================================
   HAMBURGER MENU
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
});


function isValidEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


function openPhonePe() {
  if (!currentUPI.phonepe) return;
  window.location.href = currentUPI.phonepe;
}

function openGPay() {
  if (!currentUPI.gpay) return;
  window.location.href = currentUPI.gpay;
}

function openPaytm() {
  if (!currentUPI.paytm) return;
  window.location.href = currentUPI.paytm;
}
