/* =====================================================
   GLOBAL VARIABLES
===================================================== */
let selectedEvent = "";
let regId = "";
let upiInterval = null;

let currentUPI = {
  phonepe: "",
  gpay: "",
  paytm: ""
};

/* =====================================================
   EVENT DATA
===================================================== */
const data = {

  "Project Expo": { fee: 10, desc:"Showcase innovative projects", rules:["Max 4 members","only"], p1:3000, p2:1500, coords:["Coordinator"] },
  "Paper Presentation": { fee:500, desc:"Present research ideas", rules:["Max 2 members"], p1:2000, p2:1000, coords:["Coordinator"] },
  "Poster Presentation": { fee:400, desc:"Visual idea presentation", rules:["Original content"], p1:1500, p2:800, coords:["Coordinator"] },
  "Workshop": { fee:600, desc:"Hands-on workshop", rules:["Individual"], p1:0, p2:0, coords:["Coordinator"] },
  "Circuit Hunt": { fee:300, desc:"Solve circuit puzzles", rules:["Team of 2"], p1:1500, p2:800, coords:["Coordinator"] },
  "Technical Quiz": { fee:300, desc:"EEE knowledge test", rules:["Team of 2"], p1:1200, p2:600, coords:["Coordinator"] },
  "Hackathon": { fee:1000, desc:"24-hour coding challenge", rules:["Team upto 4"], p1:5000, p2:2500, coords:["Coordinator"] },

  "Photography": { fee:200, desc:"Capture creative moments", rules:["Original photo"], p1:2500, p2:800, coords:["Coordinator"] },
  "Chess": { fee:300, desc:"Strategy game", rules:["Individual"], p1:3400, p2:900, coords:["Coordinator"] },
  "Drawing": { fee:300, desc:"Show artistic skills", rules:["Individual"], p1:3000, p2:1000, coords:["Coordinator"] },

  /* FIXED EVENT */
  "reel": {
    fee: 200,
    desc: "Create and submit a short creative video",
    rules: ["Max duration 60 sec", "Original content only"],
    p1: 2500,
    p2: 800,
    coords: ["Coordinator"]
  },

  "open": { fee:200, desc:"Open mic stage", rules:["Individual"], p1:2500, p2:800, coords:["Coordinator"] }

};


/* =====================================================
   EVENT MODAL
===================================================== */
function openModal(name) {

  if (!data[name]) {
    alert("Event data not found!");
    return;
  }

  selectedEvent = name;
  const event = data[name];

  document.getElementById("eventTitle").innerText = name;
  document.getElementById("eventDesc").innerText = event.desc;
  document.getElementById("eventFee").innerText = event.fee;

  document.getElementById("p1").innerText = event.p1;
  document.getElementById("p2").innerText = event.p2;

  const rulesList = document.getElementById("eventRules");
  rulesList.innerHTML = "";
  event.rules.forEach(rule => {
    rulesList.innerHTML += `<li>${rule}</li>`;
  });

  const coordList = document.getElementById("eventCoordinators");
  coordList.innerHTML = "";
  event.coords.forEach(coord => {
    coordList.innerHTML += `<li>${coord}</li>`;
  });

  document.getElementById("eventModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("eventModal").style.display = "none";
}


/* =====================================================
   REGISTER MODAL
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
   START PAYMENT
===================================================== */
function startPayment() {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const college = document.getElementById("college").value.trim();

  if (!name || !email || !mobile || !college) {
    alert("Please fill all fields");
    return;
  }

  openUPI();

  fetch("/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name,email,mobile,college,event:selectedEvent })
  })
  .then(res => res.json())
  .then(data => {
    regId = data.id;
    localStorage.setItem("reg_id", regId);
  });
}


/* =====================================================
   OPEN UPI PAYMENT
===================================================== */
function openUPI() {

  closeRegister();

  const amount = data[selectedEvent].fee;

  document.getElementById("upiEvent").innerText = selectedEvent;
  document.getElementById("upiAmount").innerText = amount;
  document.getElementById("upiModal").style.display = "flex";

  const upiID = "vijaykumar5127865@okhdfcbank";
  const note = selectedEvent;

  const upiURL =
   `upi://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${note}`;

  new QRious({
    element: document.getElementById("upiQR"),
    value: upiURL,
    size: 220
  });

  currentUPI.phonepe = upiURL;
  currentUPI.gpay = upiURL;
  currentUPI.paytm = upiURL;

  startTimer();
}


/* =====================================================
   TIMER
===================================================== */
function startTimer() {
  let time = 300;
  clearInterval(upiInterval);

  upiInterval = setInterval(() => {
    let min = Math.floor(time/60);
    let sec = time%60;

    document.getElementById("upiTimer").innerText =
      `${min}:${sec<10?"0":""}${sec}`;

    if(time-- <= 0){
      clearInterval(upiInterval);
      closeUPI();
      alert("Payment expired");
    }
  },1000);
}

function closeUPI() {
  clearInterval(upiInterval);
  document.getElementById("upiModal").style.display = "none";
}


/* =====================================================
   UTR
===================================================== */
function paymentDone() {
  closeUPI();
  document.getElementById("utrModal").style.display = "flex";
}

function closeUTR() {
  document.getElementById("utrModal").style.display = "none";
}

function submitUTR() {

  const utr = document.getElementById("utrInput").value.trim();

  if(!/^[0-9]{12}$/.test(utr)){
    alert("Enter valid 12-digit UTR");
    return;
  }

  fetch("/submit-utr",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      registration_id: localStorage.getItem("reg_id"),
      utr
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.status==="success"){
      alert("Payment submitted!");
      closeUTR();
    }
  });
}


/* =====================================================
   UPI BUTTONS
===================================================== */
function openPhonePe(){ window.location.href=currentUPI.phonepe; }
function openGPay(){ window.location.href=currentUPI.gpay; }
function openPaytm(){ window.location.href=currentUPI.paytm; }
