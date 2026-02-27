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

  "Project Expo": { 
    fee: 300, 
    desc:"A Project Expo is a dynamic platform where creativity meets technology,Submit a short abstract before the deadline, enabling innovators to transform ideas into impactful real-world solutions.", 
    rules:["Teams of maximum 4 members allowed","Project should be a working model/prototype","Mention your team name in the 'name' field after your name while registering if you have team"], 
    p1:1200, p2:600, 
    coords:["L. Amrutha Vennela - 9398553814","S. Semma Sadiya - 8019189857", "Iqra Fathima - 9640194007", "B. Nikhil - 9652197179", "V. Chaitanya - 9676157684"] },
  "Paper Presentation": { 
    fee:500, 
    desc:"Design and present creative Papers on technical topics. Showcase your skills and technical knowledge through innovative paper designs.", 
    rules:["Individual participation","5 minutes presentation time"], 
    p1:3000, p2:1200, 
    coords:["P. Varshitha - 8328082645", "N. Swapna - 7569261525", "T. Sravani - 7569875828 ", "Sai Ganesh -  9391825237", "S. Obulesu - 6302953506"] },
  "Power Code": {
    fee:650, 
    desc:"Power Code is a competitive coding event that tests participants’ logical thinking, problem-solving ability, and programming skills through real-time challenges.",
    rules:["Individual participation only","Participants can use any programming language","Internet access is not allowed during the contest","Plagiarism or code sharing leads to disqualification", "Solutions must be submitted within the given time","Fastest participant to complete all questions with correct answers among all participants will be declared as the winner "], 
    p1:4000, p2:2000, 
    coords:["S. Thanuja - 9441445486", "M. Krishna Sahithi - 8019905799", "B. Pranavi - 9392479669","P. Karthik - 6305959027","A. Jagadeesh - 7995924028"] },
  "Workshop": { 
    fee:500, 
    desc:"A Workshop is an interactive technical session designed to provide practical knowledge, hands-on experience, and skill development in emerging technologies.",
    rules:["Open to all registered participants","Participants must bring a laptop if required","Follow instructions given by the resource person","Maintain discipline during the session","Certificates will be provided only to full-session attendees","100% refund will be provided after successfully attending the complete workshop session"], 
    p1:0, p2:0, 
    coords:["B. Chandrayudu - 6281236160","Muni Lokesh - 6305434625", "B. Lakshmi - 7670890525", "S. Akhila - 6303713368", "B. Bhargavi - 8639158382","C. Charitha - 9346067609" ] },
  "Circuit Hunt": { 
    fee:300, 
    desc:"Test your circuit knowledge and problem-solving skills in this exciting circuit hunt. Solve circuit-based puzzles and challenges to reach the finish line.", 
    rules:["Individual Participation", "Time-based completion","Basic requirements will be provided" ], 
    p1:1500, p2:800, 
    coords:["Basha - 9502815483","K. Teja Kiran - 8790360883", "S. Mehveez Jahan - 7382378601", "Y. Sanjana - 7396731949","Dharani - 7013001937"] },
  "Technical Quiz": { 
    fee:300, 
    desc:"Technical Quiz is a competitive event that tests participants’ knowledge in core technical subjects, emerging technologies, and logical reasoning.", 
    rules:["Individual or team participation (maximum 4 members)", "The quiz may consist of multiple rounds", "Questions will be based on Elctrical and Electronics","Time limits will be strictly followed","Judges’ decision will be final"], 
    p1:1500, 
    p2:800, 
    coords:["B. Chakradhar - 9346125689", "B. Likitha sree - 7075560615", "U. Jayanthi - 9391972082", "B. Shifa Kowsar - 6281818025"] },
  "Hackathon": { 
    fee:800, 
    desc:"A Hackathon is an intensive 6-hour innovation challenge where participants design, build, and present creative technical solutions to real-world problems.", 
    rules:["Team participation only (maximum 4 members),Duration of the hackathon is 6 hours","Teams must develop the solution during the event time only","Bring your own laptops and required tools",""], 
    p1:10000, p2:5000, 
    coords:["P. Jai Kishore - 9959457849", "V. Lakshmi - 8074990063", "L. Ajay Kumar - 7794986050","D. Mahesh - 6305941789","K. Gayathri - 9502307144", "V. Bargavi - 9121834269","K. Navya Charitha - 9652109481"] },
  "Junk-to-Power": { 
    fee:800, 
    desc:"Junk to Power is a creative event where participants transform waste or scrap materials into useful, innovative, and functional products.", 
    rules:["Individual or team participation (maximum 4 members)","Only waste or recycled materials should be used","Should explain the concept and usefulness of the model","Model should be prepared before the event"], 
    p1:5000, p2:2500, 
    coords:["M. Sameera - 9182078375","U. YuvaRaj - 6302191924", "K. Prashanth - 7989469484 ","B. Surekhavani - 9866608244","P. Aravind - 8520091500"] },
  "Photography": { 
    fee:200, 
    desc:"Photography is a creative event where participants capture compelling visuals that reflect theme, creativity, and storytelling through their lens.", 
    rules:["Photos must be original and captured by the participant","Only one entry per participant is allowed","Basic editing is permitted; heavy manipulation is not allowed","The photo will be uploaded on Instagram by organizers","The entry with the highest genuine likes within the deadline wins"], 
    p1:1500, p2:800, 
    coords:["Coordinator"] },
  "Chess": { 
    fee:300, 
    desc:"Chess is a strategic board game event that tests participants’ planning, concentration, and decision-making skills.", 
    rules:["Individual participation only","Standard chess rules will be followed","Time control will be announced at the venue","Touch-move rule is strictly applicable","Judges’ decision will be final","Register before 15th March 2026"], 
    p1:3000, p2:1200, 
    coords:["Coordinator"] },
  "Drawing": { 
    fee:300, 
    desc:"Drawing is a creative event where participants express ideas, imagination, and artistic skills based on a given theme.", 
    rules:["Individual participation onlyl","Participants must record a video of the drawing process along with their presence in the video","The video should clearly show the participant creating the artwork","Only original drawings are allowed","Videos will be uploaded on Instagram by the organizers","The entry receiving the highest genuine likes within the deadline will be declared the winner"], 
    p1:1500, p2:850, 
    coords:["Coordinator"] },
  "reel": { 
    fee: 200, 
    desc: "Create and submit a short creative video", 
    rules: ["Max duration 60 sec", "Original content only"], 
    p1: 1500, p2: 800, 
    coords: ["Coordinator"] },
  "open": { 
    fee:200, 
    desc:"Open Mic is a fun talent event where participants can showcase their skills such as singing, poetry, stand-up, storytelling, or any creative performance.", 
    rules:["Individual participation only","Performance time limit: 5-7 minutes","Content must be appropriate and respectful","Participants must bring any required props or instruments","Judges’ decision will be final"], 
    p1:1500, p2:800, 
    coords:["Coordinator"] }
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
  event.rules.forEach(rule => rulesList.innerHTML += `<li>${rule}</li>`);

  const coordList = document.getElementById("eventCoordinators");
  coordList.innerHTML = "";
  event.coords.forEach(coord => coordList.innerHTML += `<li>${coord}</li>`);

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

  /* ===== EMPTY CHECK ===== */
  if (!name || !email || !mobile || !college) {
    alert("Please fill all fields");
    return;
  }

  /* ===== EMAIL VALIDATION ===== */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Enter a valid email address");
    return;
  }

  /* ===== MOBILE VALIDATION (INDIA) ===== */
  const mobilePattern = /^[6-9]\d{9}$/;

  if (!mobilePattern.test(mobile)) {
    alert("Enter valid 10-digit mobile number");
    return;
  }

  /* ===== SUCCESS ===== */
  openUPI();

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

  // ⭐ IMPORTANT: unique transaction reference
  const txnRef = "EYE26" + Date.now();

  const upiURL =
   `upi://pay?pa=${encodeURIComponent(upiID)}` +
   `&pn=${encodeURIComponent("EYE2K26")}` +
   `&am=${amount}` +
   `&cu=INR` +
   `&tn=${encodeURIComponent(note)}` +
   `&tr=${txnRef}`;

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

    time--;

    if(time < 0){
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
   UTR SUBMISSION
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
      alert("Payment submitted successfully! Ticket sent.");
      closeUTR();
    } else {
      alert("Error submitting UTR");
    }
  });
}


/* =====================================================
   UPI BUTTONS
===================================================== */
function openPhonePe(){ window.location.href=currentUPI.phonepe; }
function openGPay(){ window.location.href=currentUPI.gpay; }
function openPaytm(){ window.location.href=currentUPI.paytm; }

const bgCanvas = document.getElementById("particleCanvas");

if (bgCanvas) {
  const bgCtx = bgCanvas.getContext("2d");

  let nodes = [];
  let pulses = [];

  function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Create nodes
  for (let i = 0; i < 70; i++) {
    nodes.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    });
  }

  function drawBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          bgCtx.beginPath();
          bgCtx.moveTo(nodes[i].x, nodes[i].y);
          bgCtx.lineTo(nodes[j].x, nodes[j].y);
          bgCtx.strokeStyle = "rgba(56,189,248,0.12)";
          bgCtx.lineWidth = 1;
          bgCtx.stroke();

          // Random electric pulse
          if (Math.random() < 0.002) {
            pulses.push({
              x: nodes[i].x,
              y: nodes[i].y,
              life: 40
            });
          }
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      bgCtx.beginPath();
      bgCtx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
      bgCtx.fillStyle = "#38bdf8";
      bgCtx.fill();

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > bgCanvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
    });

    // Draw pulses
    pulses.forEach((p, i) => {
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, 6 - p.life * 0.1, 0, Math.PI * 2);
      bgCtx.strokeStyle = `rgba(56,189,248,${p.life / 40})`;
      bgCtx.lineWidth = 2;
      bgCtx.stroke();

      p.life--;
      if (p.life <= 0) pulses.splice(i, 1);
    });

    requestAnimationFrame(drawBackground);
  }

  drawBackground();
}
