/* =====================================================
   GLOBALS
===================================================== */
let currentUPI = { phonepe:"", gpay:"", paytm:"" };
let selectedEvent = "";
let upiInterval = null;


/* =====================================================
   EVENT DATA
===================================================== */
const data = {

"Project Expo": { desc:"Showcase innovative electrical projects.", rules:["Max 4 members","Working model mandatory"], fee:10, p1:3000, p2:1500, coords:["B Karthik"] },

"Paper Presentation": { desc:"Present research ideas.", rules:["Max 2 authors"], fee:500, p1:2000, p2:1000, coords:["Kavya"] },

"Poster Presentation": { desc:"Visual technical ideas.", rules:["A1 size"], fee:400, p1:1500, p2:800, coords:["Varshitha"] },

"Workshop": { desc:"Hands-on workshop.", rules:["Laptop compulsory"], fee:600, p1:0, p2:0, coords:["Sai Teja"] },

"Circuit Hunt": { desc:"Solve circuits.", rules:["Team of 2"], fee:300, p1:1500, p2:800, coords:["Rohith"] },

"Technical Quiz": { desc:"EEE Quiz.", rules:["Team of 2"], fee:300, p1:1200, p2:600, coords:["Keerthana"] },

"Hackathon": { desc:"24hr coding challenge.", rules:["Max 4 members"], fee:1000, p1:5000, p2:2500, coords:["Sai Kumar"] },

"open": { desc:"Open mic talent show.", rules:["Individual"], fee:200, p1:2500, p2:800, coords:["Harsha"] },

"Photography": { desc:"Capture moments.", rules:["1 photo"], fee:200, p1:2500, p2:800, coords:["Coordinator"] },

"Chess": { desc:"Strategic game.", rules:["FIDE rules"], fee:300, p1:3400, p2:900, coords:["Coordinator"] },

"Drawing": { desc:"Art competition.", rules:["Original artwork"], fee:300, p1:3000, p2:1000, coords:["Coordinator"] }

};


/* =====================================================
   EVENT MODAL
===================================================== */
function openModal(name) {
  selectedEvent = name;
  const e = data[name];

  eventTitle.innerText = name;
  eventDesc.innerText = e.desc;
  eventFee.innerText = e.fee;
  p1.innerText = e.p1;
  p2.innerText = e.p2;

  eventRules.innerHTML="";
  e.rules.forEach(r=>eventRules.innerHTML+=`<li>${r}</li>`);

  eventCoordinators.innerHTML="";
  e.coords.forEach(c=>eventCoordinators.innerHTML+=`<li>${c}</li>`);

  eventModal.style.display="flex";
}
function closeModal(){ eventModal.style.display="none"; }


/* =====================================================
   REGISTER MODAL
===================================================== */
function openRegister(){
  regEvent.innerText=selectedEvent;
  closeModal();
  registerModal.style.display="flex";
}
function closeRegister(){ registerModal.style.display="none"; }


/* =====================================================
   START PAYMENT (REGISTER FIRST)
===================================================== */
function startPayment(){

  const name=nameInput.value.trim();
  const email=emailInput.value.trim();
  const college=collegeInput.value.trim();
  const mobile=mobileInput.value.trim();

  if(!name||!email||!college||!mobile){
    alert("Fill all details");
    return;
  }

  /* SAVE REGISTRATION FIRST */
  fetch("/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({ name,email,college,mobile,event:selectedEvent })
  })
  .then(r=>r.json())
  .then(d=>{
      localStorage.setItem("reg_id",d.id);
      openUPI();
  });

}


/* =====================================================
   UPI PAYMENT
===================================================== */
function openUPI(){

  closeRegister();

  const amount=data[selectedEvent].fee;
  upiEvent.innerText=selectedEvent;
  upiAmount.innerText=amount;
  upiModal.style.display="flex";

  const upiID="vijaykumar5127865@okhdfcbank";
  const note=`${selectedEvent}`;

  const upiURL=`upi://pay?pa=${upiID}&pn=EYE2K26&am=${amount}&cu=INR&tn=${note}`;

  new QRious({ element:upiQR, value:upiURL, size:220 });

  currentUPI.phonepe=upiURL;
  currentUPI.gpay=upiURL;
  currentUPI.paytm=upiURL;

  startUPITimer();
}

function startUPITimer(){
  let t=300;
  upiInterval=setInterval(()=>{
    upiTimer.innerText=`${Math.floor(t/60)}:${("0"+t%60).slice(-2)}`;
    if(--t<0){ clearInterval(upiInterval); closeUPI(); }
  },1000);
}
function closeUPI(){ clearInterval(upiInterval); upiModal.style.display="none"; }


/* =====================================================
   UTR SUBMIT
===================================================== */
function paymentDone(){
  closeUPI();
  utrModal.style.display="flex";
}

function submitUTR(){

  const utr=utrInput.value.trim();
  const regId=localStorage.getItem("reg_id");

  if(!/^[0-9]{12}$/.test(utr)){
    alert("Enter valid 12-digit UTR");
    return;
  }

  fetch("/submit-utr",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({ registration_id:regId, utr:utr })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.status==="success") alert("Payment submitted!");
    else alert("Error");
  });

  closeUTR();
}

function closeUTR(){ utrModal.style.display="none"; utrInput.value=""; }


/* =====================================================
   UPI APP LINKS
===================================================== */
function openPhonePe(){ location.href=currentUPI.phonepe; }
function openGPay(){ location.href=currentUPI.gpay; }
function openPaytm(){ location.href=currentUPI.paytm; }
