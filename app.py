from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import random
import os
import json
import smtplib

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

# ==============================
# SERVE FRONTEND
# ==============================
@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/<path:path>")
def serve_files(path):
    return app.send_static_file(path)

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
        print("Google Sheets connected")
    else:
        print("GOOGLE_CREDENTIALS missing")
except Exception as e:
    print("Google Sheets error:", e)

HEADERS = [
    "Name", "Email", "Mobile", "College", "Event",
    "Amount", "Payment_Status", "Payment_ID",
    "Registration_ID", "Timestamp"
]

def ensure_headers():
    if sheet and sheet.row_values(1) == []:
        sheet.append_row(HEADERS)

# ==============================
# EMAIL CONFIG (FROM ENV VARS)
# ==============================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = os.environ.get("officialeye2k26@gmail.com
")
EMAIL_PASSWORD = os.environ.get("eyxs kczc fdgh upbo")

# ==============================
# HELPER FUNCTIONS
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

    for k, v in data.items():
        elements.append(Paragraph(f"<b>{k}</b>: {v}", styles["Normal"]))
        elements.append(Spacer(1,10))

    doc.build(elements)
    return path

def send_email(email, subject, body, pdf):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "html"))

    with open(pdf, "rb") as f:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(f.read())

    encoders.encode_base64(part)
    part.add_header(
        "Content-Disposition",
        f'attachment; filename="{os.path.basename(pdf)}"'
    )
    msg.attach(part)

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.send_message(msg)
    server.quit()

# ==============================
# REGISTER API (AUTO EMAIL + PDF)
# ==============================
@app.route("/register", methods=["POST"])
def register():
    if not sheet:
        return jsonify({"error": "Database not connected"}), 500

    data = request.json
    ensure_headers()

    reg_id = generate_id(data["event"])
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Save to Google Sheet
    sheet.append_row([
        data["name"], data["email"], data["mobile"],
        data["college"], data["event"], data["amount"],
        "PAID", "", reg_id, timestamp
    ])

    # Generate PDF Ticket
    pdf_path = generate_ticket({
        "Name": data["name"],
        "Event": data["event"],
        "Registration ID": reg_id,
        "College": data["college"],
        "Email": data["email"]
    })

    # Send Email
    send_email(
        data["email"],
        "EYE2K26 Registration Successful 🎉",
        f"""
        <h2>Registration Confirmed</h2>
        <p><b>Name:</b> {data["name"]}</p>
        <p><b>Event:</b> {data["event"]}</p>
        <p><b>Registration ID:</b> {reg_id}</p>
        <p>Your ticket is attached.</p>
        """,
        pdf_path
    )

    return jsonify({
        "status": "success",
        "registration_id": reg_id
    })

# ==============================
# SERVER START (RENDER PORT)
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
