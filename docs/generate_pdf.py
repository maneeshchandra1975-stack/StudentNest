import os
from fpdf import FPDF

class PDFReport(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(16, 185, 129) # Emerald Green
        self.cell(0, 10, "CampusNest - Day 2 Authentication Architecture", border=False, new_x="LMARGIN", new_y="NEXT", align="L")
        self.set_draw_color(16, 185, 129)
        self.set_linewidth(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}} | CampusNest Documentation", align="C")

def build_pdf():
    pdf = PDFReport()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Title Section
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.cell(0, 12, "Day 2: Authentication Backend Complete Guide", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 116, 139) # Slate 500
    pdf.cell(0, 6, "Target System: VIT-AP Student Portal (CampusNest) | Date: 2026-08-10", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # Executive Summary
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, "1. Executive Summary", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(30, 41, 59)
    summary_text = (
        "On Day 2, we built a production-grade, highly secure authentication backend for CampusNest. "
        "The system strictly enforces college-email authorization (@vitapstudent.ac.in), handles 2-step OTP email "
        "verification via Nodemailer SMTP, utilizes dual-token JWT authentication (short-lived Access Tokens & "
        "secure httpOnly Refresh Token cookies), and enforces role-based access control (RBAC)."
    )
    pdf.multi_cell(0, 5, summary_text)
    pdf.ln(5)

    # Installed Dependencies
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, "2. Installed Dependencies & Their Roles", new_x="LMARGIN", new_y="NEXT")
    
    deps = [
        ("mongoose", "MongoDB Object Data Modeling (ODM) library used to create schema structures for Users & OTPs."),
        ("bcryptjs", "Hashes sensitive passwords (12 rounds) and numeric OTPs (10 rounds) before DB storage."),
        ("jsonwebtoken", "Generates & verifies Access Tokens (15m expiration) and Refresh Tokens (7d expiration)."),
        ("nodemailer", "Dispatches HTML verification emails with 6-digit OTPs via Gmail SMTP transport."),
        ("express-validator", "Middleware for strict request body validation (format, length, email domain)."),
        ("cookie-parser", "Parses HTTP cookies to securely handle httpOnly refresh token cookies.")
    ]
    
    pdf.set_font("Helvetica", "", 10)
    for pkg, desc in deps:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(40, 6, f"- {pkg}:", new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 6, desc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # File Inventory & Architecture
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, "3. Directory & File Breakdown", new_x="LMARGIN", new_y="NEXT")
    
    files_info = [
        ("config/db.js", "Handles MongoDB Atlas connection using Mongoose."),
        ("models/User.model.js", "User schema with pre-save password hashing & domain validation."),
        ("models/OTP.model.js", "OTP schema with MongoDB TTL auto-deletion after 10 minutes."),
        ("utils/ApiResponse.js", "Standardized JSON response wrapper (success, statusCode, message, data)."),
        ("utils/ApiError.js", "Custom error handling class incorporating HTTP status codes."),
        ("utils/generateToken.js", "Issues Access (15m) & Refresh (7d) JWT tokens + cookie options."),
        ("utils/generateOTP.js", "Generates crypto.randomInt 6-digit numbers and hashes them via bcrypt."),
        ("services/email.service.js", "Transporter setup + branded HTML email template generator."),
        ("validators/auth.validator.js", "Validation chains enforcing @vitapstudent.ac.in domain & password rules."),
        ("middleware/auth.middleware.js", "Protects routes by verifying JWT Bearer tokens in headers."),
        ("middleware/role.middleware.js", "Enforces Role-Based Access Control (student vs admin)."),
        ("middleware/validate.middleware.js", "Intercepts validation errors and returns structured 400 responses."),
        ("controllers/auth.controller.js", "Implements register, verifyOtp, resendOtp, login, refreshToken, logout, getMe."),
        ("routes/auth.routes.js", "Maps endpoint paths to validation chains and controller functions.")
    ]

    for fname, fdesc in files_info:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(60, 5, fname, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(0, 5, fdesc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # API Endpoints
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, "4. API Endpoints Reference", new_x="LMARGIN", new_y="NEXT")

    endpoints = [
        ("POST", "/api/v1/auth/register", "Public", "Validates student email, hashes password, saves user, generates OTP & emails it."),
        ("POST", "/api/v1/auth/verify-otp", "Public", "Compares entered 6-digit OTP with stored hash & sets isVerified: true."),
        ("POST", "/api/v1/auth/resend-otp", "Public", "Deletes old OTPs and dispatches a new OTP to unverified users."),
        ("POST", "/api/v1/auth/login", "Public", "Verifies credentials & verification status; issues Access Token + httpOnly Refresh Cookie."),
        ("POST", "/api/v1/auth/refresh-token", "Public (Cookie)", "Uses Refresh Cookie to generate a new 15-minute Access Token."),
        ("POST", "/api/v1/auth/logout", "Protected", "Clears Refresh Token cookie and invalidates token in MongoDB."),
        ("GET", "/api/v1/auth/me", "Protected", "Fetches current student profile data from req.user.")
    ]

    for method, path, access, edesc in endpoints:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(16, 185, 129) if method == "GET" else pdf.set_text_color(37, 99, 235)
        pdf.cell(15, 5, method, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(60, 5, path, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(35, 5, f"[{access}]", new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5, edesc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # Request Lifecycle & Workflow
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, "5. Request Lifecycle Architecture", new_x="LMARGIN", new_y="NEXT")
    
    flow_text = (
        "1. Request Arrival: React client issues HTTP POST to /api/v1/auth/register.\n"
        "2. Top-Level Router (index.js): Matches /api/v1/auth prefix and forwards to auth.routes.js.\n"
        "3. Input Validation (auth.validator.js): express-validator verifies domain and password complexity.\n"
        "4. Validation Interceptor (validate.middleware.js): Aborts request with HTTP 400 if invalid.\n"
        "5. Controller Processing (auth.controller.js): Checks DB for duplicates, hashes secrets via bcrypt.\n"
        "6. OTP Storage & Dispatch (generateOTP.js & email.service.js): Stores hashed OTP in MongoDB with 10m TTL and emails plain code.\n"
        "7. Response Delivery (ApiResponse.js): Sends standard JSON response back to React frontend."
    )
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(0, 5, flow_text)
    pdf.ln(5)

    # Troubleshooting & Solutions
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 8, "6. Key Challenges & Fixes Resolved Today", new_x="LMARGIN", new_y="NEXT")

    issues = [
        ("Issue: ECONNREFUSED _mongodb._tcp DNS query failure", 
         "Resolution: Network DNS blocked SRV lookups. Switched MONGO_URI to standard replica set direct connection string."),
        ("Issue: MongoDB Access Denied", 
         "Resolution: Dynamic client IP was not permitted. Added 0.0.0.0/0 IP access rule in Atlas Network Access settings.")
    ]

    for title, fix in issues:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 5, title, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5, fix, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

    output_path = os.path.join(os.getcwd(), "docs", "CampusNest_Day2_Authentication_Documentation.pdf")
    pdf.output(output_path)
    print(f"PDF successfully created at: {output_path}")

if __name__ == "__main__":
    build_pdf()
