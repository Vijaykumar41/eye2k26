from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import random
import os
import json
import smtplib
from threading import Thread

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

# ==============================
# FLASK SETUP
# ==============================
app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/<path:path>")
def serve_files(path):
    return app.send_static_file(path)

# ==============================
# RENDER WAKEUP ROUTE
# ==============================
@app.route("/ping")
def ping():
    return "OK"

# ==============================
# GOOGLE SHEETS CONFIG
# ==============================
scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

sheet = None

try:
    creds_json = os.environ.get("GOOGLE_CREDENTIALS")
    if creds_json:
        creds_dict = json.loads(creds_json)
        creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)
        client = gspread.authorize(creds)
        sheet = client.open("EYE2K26_REGISTRATIONS").sheet1
        print("✅ Google Sheets connected")
except Exception as e:
    print("❌ Sheets error:", e)

HEADERS = [
    "Name","Email","Mobile","College","Event",
    "Amount","Payment_Status","UTR_Number",
    "Registration_ID","Timestamp"
]

def ensure_headers():
    if sheet and not sheet.row_values(1):
        sheet.append_row(HEADERS)

# ==============================
# EMAIL CONFIG
# ==============================
EMAIL_ADDRESS = os.environ.get("EMAIL_USER")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASS")

# ==============================
# HELPERS
# ==============================
def generate_id(event):
    code = "".join(word[0] for word in event.split()).upper()
    return f"EYE26-{code}-{random.randint(100000,999999)}"

def generate_ticket(data):
    os.makedirs("tickets", exist_ok=True)
    path = f"tickets/{data['Registration ID']}.pdf"

    doc = SimpleDocTemplate(path, pagesize=A4)
    styles = getSampleStyleSheet()

    elements = [Paragraph("EYE2K26 Event Ticket", styles["Title"]), Spacer(1,20)]

    for k,v in data.items():
        elements.append(Paragraph(f"<b>{k}</b>: {v}", styles["Normal"]))
        elements.append(Spacer(1,10))

    doc.build(elements)
    return path

def send_email(to_email, subject, body, pdf_path):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "html"))

        with open(pdf_path, "rb") as f:
            part = MIMEBase("application","octet-stream")
            part.set_payload(f.read())

        encoders.encode_base64(part)
        part.add_header("Content-Disposition",
                        f'attachment; filename="{os.path.basename(pdf_path)}"')
        msg.attach(part)

        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=20)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()

        print("✅ Email sent")

    except Exception as e:
        print("❌ Email error:", e)

# ==============================
# BACKGROUND TASKS
# ==============================
def background_register_email(email, name, event_name, reg_id, amount):
    pdf = generate_ticket({
        "Name": name,
        "Event": event_name,
        "Registration ID": reg_id,
        "Amount": amount
    })
    send_email(email,"Registration Successful",
               f"<h2>Your ID: {reg_id}</h2>",pdf)

def background_payment_email(email, name, event, reg_id, utr):
    pdf = generate_ticket({
        "Name": name,
        "Event": event,
        "Registration ID": reg_id,
        "UTR": utr
    })
    send_email(email,"Payment Verified",
               f"<h2>UTR: {utr}</h2>",pdf)

# ==============================
# REGISTER API
# ==============================
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        ensure_headers()

        EVENT_FEES = {
            "Project Expo":10,"Paper Presentation":500,"Poster Presentation":400,
            "Workshop":600,"Circuit Hunt":300,"Technical Quiz":300,
            "Hackathon":1000,"open":200,"Photography":200,
            "Chess":300,"Drawing":300
        }

        event_name = data["event"]
        amount = EVENT_FEES.get(event_name,0)

        reg_id = generate_id(event_name)
        time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        sheet.append_row([
            data["name"],data["email"],data["mobile"],
            data["college"],event_name,amount,
            "PENDING","",reg_id,time
        ])

        # Background email
        Thread(target=background_register_email,
               args=(data["email"],data["name"],event_name,reg_id,amount)).start()

        return jsonify({"status":"success","id":reg_id})

    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({"status":"error"}),500

# ==============================
# UTR SUBMIT API
# ==============================
@app.route("/submit-utr", methods=["POST"])
def submit_utr():
    try:
        data = request.json
        reg_id = data["registration_id"]
        utr = data["utr"]

        records = sheet.get_all_records()

        for i,row in enumerate(records):
            if row["Registration_ID"] == reg_id:

                sheet.update_cell(i+2,7,"PAID")
                sheet.update_cell(i+2,8,utr)

                Thread(target=background_payment_email,
                       args=(row["Email"],row["Name"],row["Event"],reg_id,utr)).start()

                return jsonify({"status":"success"})

        return jsonify({"status":"not found"}),404

    except Exception as e:
        print("UTR ERROR:", e)
        return jsonify({"status":"error"}),500

# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT",10000))
    app.run(host="0.0.0.0", port=port)
