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
  "Project Expo": { fee: 10, desc: "Showcase innovative projects." },
  "Paper Presentation": { fee: 500, desc: "Present research ideas." },
  "Poster Presentation": { fee: 400, desc: "Visual idea display." },
  "Workshop": { fee: 600, desc: "Hands-on learning." },
  "Circuit Hunt": { fee: 300, desc: "Solve circuit puzzles." },
  "Technical Quiz": { fee: 300, desc: "Test EEE knowledge." },
  "Hackathon": { fee: 1000, desc: "24-hour coding challenge." },
  "Drawing": { fee: 300, desc: "Creative art competition." },
  "Photography": { fee: 200, desc: "Capture moments." },
  "Chess": { fee: 300, desc: "Strategic battle." },
  "open": { fee: 200, desc: "Open mic talent show." }
};

/* =====================================================
   EVENT MODAL
===================================================== */
function openModal(name) {
  selectedEvent = name;
  document.getElementById("eventTitle").innerText = name;
  document.getElementById("eventDesc").innerText = data[name].desc;
  document.getElementById("eventFee").innerText = data[name].fee;
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
   START PAYMENT (REGISTER USER)
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

  /* REGISTER USER FIRST */
  fetch("/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name,
      email,
      mobile,
      college,
      event: selectedEvent
    })
  })
  .then(res => res.json())
  .then(data => {
    regId = data.id;
    localStorage.setItem("reg_id", regId);
    openUPI();
  })
  .catch(() => alert("Server error"));
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

  const upiID = "yourupi@okhdfcbank"; // CHANGE THIS
  const note = `${selectedEvent}`;

  const universalUPI =
    `upi://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  new QRious({
    element: document.getElementById("upiQR"),
    value: universalUPI,
    size: 220
  });

  /* STORE APP LINKS */
  currentUPI.phonepe =
    `phonepe://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  currentUPI.gpay =
    `tez://upi/pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  currentUPI.paytm =
    `paytmmp://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  startTimer();
}

/* =====================================================
   UPI TIMER
===================================================== */
function startTimer() {
  let time = 300;
  clearInterval(upiInterval);

  upiInterval = setInterval(() => {
    let min = Math.floor(time/60);
    let sec = time%60;

    document.getElementById("upiTimer").innerText =
      `${min}:${sec<10?"0":""}${sec}`;

    time--;

    if(time < 0){
      clearInterval(upiInterval);
      alert("Payment time expired");
      closeUPI();
    }
  },1000);
}

function closeUPI() {
  clearInterval(upiInterval);
  document.getElementById("upiModal").style.display = "none";
}

/* =====================================================
   UTR MODAL
===================================================== */
function paymentDone() {
  closeUPI();
  document.getElementById("utrModal").style.display = "flex";
}

function closeUTR() {
  document.getElementById("utrModal").style.display = "none";
}

/* =====================================================
   SUBMIT UTR
===================================================== */
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
      alert("Payment submitted successfully! Ticket sent.");
      closeUTR();
    } else {
      alert("Error submitting UTR");
    }
  });
}

/* =====================================================
   UPI APP BUTTONS
===================================================== */
function openPhonePe(){
  window.location.href = currentUPI.phonepe;
}

function openGPay(){
  window.location.href = currentUPI.gpay;
}

function openPaytm(){
  window.location.href = currentUPI.paytm;
}
