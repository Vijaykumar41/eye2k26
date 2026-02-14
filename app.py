from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import random
import os
import smtplib
import json

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4


import os
from flask import Flask, request, jsonify

# 👉 VERY IMPORTANT: set static folder to current directory
app = Flask(__name__, static_folder=".", static_url_path="")

# ========================
# HOME ROUTE (INDEX.HTML)
# ========================
@app.route("/")
def home():
    return app.send_static_file("index.html")

# ========================
# SERVE ALL OTHER FILES
# ========================
@app.route("/<path:path>")
def static_files(path):
    return app.send_static_file(path)

# ========================
# TEST ROUTE
# ========================
@app.route("/test")
def test():
    return {"message": "Backend working"}

# ========================
# RUN APP (RENDER PORT)
# ========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)






# =====================================================
# FLASK SETUP
# =====================================================
app = Flask(__name__)
CORS(app)

# ===== SERVE FRONTEND FILES =====
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:filename>")
def serve_files(filename):
    return send_from_directory(BASE_DIR, filename)

# =====================================================
# GOOGLE SHEETS CONFIG
# =====================================================
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

        # ⭐ ADD THIS PART HERE
        if sheet and not sheet.row_values(1):
            sheet.append_row([
                "Name", "Email", "Mobile", "College", "Event",
                "Amount", "Payment_Status", "Payment_ID",
                "Registration_ID", "Timestamp"
            ])

        print("✅ Google Sheets connected successfully")

    else:
        print("⚠️ GOOGLE_CREDENTIALS not found")

except Exception as e:
    print("❌ Google Sheets connection failed:", e)

# =====================================================
# GOOGLE SHEET HEADERS
# =====================================================
HEADERS = [
    "Name", "Email", "Mobile", "College", "Event",
    "Amount", "Payment_Status", "Payment_ID",
    "Registration_ID", "Timestamp"
]

def ensure_sheet_headers():
    first_row = sheet.row_values(1)
    if first_row == []:
        sheet.insert_row(HEADERS, 1)

# =====================================================
# EMAIL CONFIG
# =====================================================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = "officialeye2k26@gmail.com"
EMAIL_PASSWORD = "eyxs kczc fdgh upbo"

# =====================================================
# HELPER FUNCTIONS
# =====================================================
def generate_registration_id(event):
    code = "".join(word[0] for word in event.split()).upper()
    return f"EYE26-{code}-{random.randint(100000, 999999)}"

def generate_pdf_ticket(data):
    os.makedirs("tickets", exist_ok=True)

    file_path = f"tickets/{data['registration_id']}.pdf"
    doc = SimpleDocTemplate(file_path, pagesize=A4)

    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("EYE2K26 Event Ticket", styles["Title"]))
    elements.append(Spacer(1, 20))

    for k, v in data.items():
        elements.append(Paragraph(f"<b>{k}:</b> {v}", styles["Normal"]))
        elements.append(Spacer(1, 10))

    doc.build(elements)
    return file_path

def send_email_with_pdf(to_email, subject, html_body, pdf_path):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_body, "html"))

    with open(pdf_path, "rb") as f:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(f.read())

    encoders.encode_base64(part)
    part.add_header(
        "Content-Disposition",
        f'attachment; filename="{os.path.basename(pdf_path)}"'
    )
    msg.attach(part)

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.send_message(msg)
    server.quit()

# =====================================================
# REGISTER API
# =====================================================
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    ensure_sheet_headers()

    reg_id = generate_registration_id(data["event"])
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    sheet.append_row([
        data["name"], data["email"], data["mobile"],
        data["college"], data["event"], data["amount"],
        "PENDING", "", reg_id, timestamp
    ])

    return jsonify({
        "status": "success",
        "registration_id": reg_id
    })

# =====================================================
# PAYMENT CONFIRM API
# =====================================================
@app.route("/payment-confirm", methods=["POST"])
def payment_confirm():
    data = request.get_json()
    email = data["email"]
    payment_id = data["payment_id"]

    records = sheet.get_all_records()

    for i, row in enumerate(records):
        if row["Email"] == email:
            sheet.update_cell(i + 2, 7, "PAID")
            sheet.update_cell(i + 2, 8, payment_id)

            pdf_path = generate_pdf_ticket({
                "name": row["Name"],
                "event": row["Event"],
                "registration_id": row["Registration_ID"],
                "payment_id": payment_id
            })

            send_email_with_pdf(
                email,
                "EYE2K26 Payment Confirmed",
                f"<h2>Payment Successful</h2><p>ID: {row['Registration_ID']}</p>",
                pdf_path
            )

            return jsonify({"status": "success"})

    return jsonify({"status": "error"}), 404

# =====================================================
# RUN SERVER
# =====================================================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
