/* =====================================================
   GLOBAL VARIABLES
===================================================== */
let selectedEvent = "";
let regId = "";
let upiInterval = null;
let currentUPI = ""; // 🔥 stores UPI deep link


/* =====================================================
   EVENT DATA
===================================================== */
const data = {
  "Project Expo": { fee: 10.00, desc:"Showcase innovative projects", rules:["Max 4 members"], p1:3000, p2:1500, coords:["Coordinator"] },
  "Paper Presentation": { fee:500, desc:"Present research ideas", rules:["Max 2 members"], p1:2000, p2:1000, coords:["Coordinator"] },
  "Power Code": { fee:400, desc:"Visual idea presentation", rules:["Original content"], p1:1500, p2:800, coords:["Coordinator"] },
  "Workshop": { fee:600, desc:"Hands-on workshop", rules:["Individual"], p1:0, p2:0, coords:["Coordinator"] },
  "Circuit Hunt": { fee:300, desc:"Solve circuit puzzles", rules:["Team of 2"], p1:1500, p2:800, coords:["Coordinator"] },
  "Technical Quiz": { fee:300, desc:"EEE knowledge test", rules:["Team of 2"], p1:1200, p2:600, coords:["Coordinator"] },
  "Hackathon": { fee:1000, desc:"24-hour coding challenge", rules:["Team upto 4"], p1:5000, p2:2500, coords:["Coordinator"] },
  "Junk-to-Power": { fee:1000, desc:"24-hour coding challenge", rules:["Team upto 4"], p1:5000, p2:2500, coords:["Coordinator"] },
  "Photography": { fee:200, desc:"Capture creative moments", rules:["Original photo"], p1:2500, p2:800, coords:["Coordinator"] },
  "Chess": { fee:300, desc:"Strategy game", rules:["Individual"], p1:3400, p2:900, coords:["Coordinator"] },
  "Drawing": { fee:300, desc:"Show artistic skills", rules:["Individual"], p1:3000, p2:1000, coords:["Coordinator"] },
  "reel": { fee:200, desc:"Create and submit a short creative video", rules:["Max duration 60 sec","Original content only"], p1:2500, p2:800, coords:["Coordinator"] },
  "open": { fee:200, desc:"Open mic stage", rules:["Individual"], p1:2500, p2:800, coords:["Coordinator"] }
};


/* =====================================================
   EVENT MODAL
===================================================== */
function openModal(name) {
  if (!data[name]) return alert("Event data not found!");

  selectedEvent = name;
  const event = data[name];

  document.getElementById("eventTitle").innerText = name;
  document.getElementById("eventDesc").innerText = event.desc;
  document.getElementById("eventFee").innerText = event.fee;
  document.getElementById("p1").innerText = event.p1;
  document.getElementById("p2").innerText = event.p2;

  const rulesList = document.getElementById("eventRules");
  rulesList.innerHTML = "";
  event.rules.forEach(r => rulesList.innerHTML += `<li>${r}</li>`);

  const coordList = document.getElementById("eventCoordinators");
  coordList.innerHTML = "";
  event.coords.forEach(c => coordList.innerHTML += `<li>${c}</li>`);

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

  const name = name.value.trim();
  const emailVal = email.value.trim();
  const mobileVal = mobile.value.trim();
  const collegeVal = college.value.trim();

  if (!name || !emailVal || !mobileVal || !collegeVal)
    return alert("Please fill all fields");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal))
    return alert("Enter valid email");

  if (!/^[6-9]\d{9}$/.test(mobileVal))
    return alert("Enter valid mobile");

  openUPI();

  fetch("/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      name, email: emailVal, mobile: mobileVal,
      college: collegeVal, event: selectedEvent
    })
  })
  .then(r=>r.json())
  .then(d=>{
    regId=d.id;
    localStorage.setItem("reg_id", regId);
  });
}


/* =====================================================
   OPEN UPI PAYMENT
===================================================== */
function openUPI() {

  closeRegister();

  const amount = data[selectedEvent].fee;

  upiEvent.innerText = selectedEvent;
  upiAmount.innerText = amount;
  upiModal.style.display = "flex";

  const upiURL =
  `upi://pay?pa=vijaykumar5127865@okhdfcbank&pn=EYE2K26&am=${amount}&cu=INR&tn=${selectedEvent}`;

  currentUPI = upiURL;   // 🔥 STORE LINK

  new QRious({
    element: upiQR,
    value: upiURL,
    size:220
  });

  startTimer();
}


/* =====================================================
   TIMER
===================================================== */
function startTimer() {
  let t=300;
  clearInterval(upiInterval);

  upiInterval=setInterval(()=>{
    let m=Math.floor(t/60), s=t%60;
    upiTimer.innerText=`${m}:${s<10?"0":""}${s}`;
    if(--t<0){ closeUPI(); alert("Expired"); }
  },1000);
}

function closeUPI() {
  clearInterval(upiInterval);
  upiModal.style.display="none";
}


/* =====================================================
   UTR SUBMISSION
===================================================== */
function submitUTR() {
  const utr=utrInput.value.trim();
  if(!/^[0-9]{12}$/.test(utr)) return alert("Invalid UTR");

  fetch("/submit-utr",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      registration_id:localStorage.getItem("reg_id"),
      utr
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.status==="success") alert("Submitted!");
    else alert("Error");
  });
}


/* =====================================================
   UPI BUTTONS (OPEN APPS)
===================================================== */
function openPhonePe(){ if(currentUPI) location.href=currentUPI; }
function openGPay(){ if(currentUPI) location.href=currentUPI; }
function openPaytm(){ if(currentUPI) location.href=currentUPI; }
