import os
from fpdf import FPDF

class CleanPDF(FPDF):
    def __init__(self, title_text):
        super().__init__()
        self.title_text = title_text

    def header(self):
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(16, 185, 129) # Emerald Green
        self.cell(0, 10, self.title_text, border=False, new_x="LMARGIN", new_y="NEXT", align="L")
        self.set_draw_color(16, 185, 129)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}} | CampusNest Documentation", align="C")


# ── DAY 2 PDF GENERATOR ──────────────────────────────────────────
def build_day2_pdf(target_dir):
    pdf = CleanPDF("CampusNest - Day 2 Authentication Backend Guide")
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Title
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Day 2: Authentication Backend Complete Guide", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 6, "Target System: VIT-AP Student Portal (CampusNest) | Date: 2026-08-10", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 1. Executive Summary
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "1. Executive Summary", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(30, 41, 59)
    summary_text = (
        "On Day 2, we built a secure authentication backend for CampusNest. "
        "The system strictly enforces college-email authorization (@vitapstudent.ac.in), handles 2-step OTP email "
        "verification via Nodemailer SMTP, utilizes dual-token JWT authentication (short-lived Access Tokens and "
        "secure httpOnly Refresh Token cookies), and enforces role-based access control (RBAC)."
    )
    pdf.multi_cell(0, 5, summary_text)
    pdf.ln(4)

    # 2. Installed Dependencies
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "2. Installed Dependencies and Technical Roles", new_x="LMARGIN", new_y="NEXT")
    
    deps = [
        ("mongoose", "MongoDB Object Data Modeling (ODM) library used to create schema structures for Users and OTPs."),
        ("bcryptjs", "Hashes sensitive passwords (12 rounds) and numeric OTPs (10 rounds) before DB storage."),
        ("jsonwebtoken", "Generates and verifies Access Tokens (15m expiration) and Refresh Tokens (7d expiration)."),
        ("nodemailer", "Dispatches HTML verification emails with 6-digit OTPs via Gmail SMTP transport."),
        ("express-validator", "Middleware for strict request body validation (format, length, email domain)."),
        ("cookie-parser", "Parses HTTP cookies to securely handle httpOnly refresh token cookies.")
    ]
    
    for pkg, desc in deps:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(38, 5, f"- {pkg}:", new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5, desc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 3. File Inventory
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "3. Directory and File Breakdown", new_x="LMARGIN", new_y="NEXT")
    
    files = [
        ("config/db.js", "Handles MongoDB Atlas connection using Mongoose."),
        ("models/User.model.js", "User schema with pre-save password hashing and domain validation."),
        ("models/OTP.model.js", "OTP schema with MongoDB TTL auto-deletion after 10 minutes."),
        ("utils/ApiResponse.js", "Standardized JSON response wrapper (success, statusCode, message, data)."),
        ("utils/ApiError.js", "Custom error handling class incorporating HTTP status codes."),
        ("utils/generateToken.js", "Issues Access (15m) and Refresh (7d) JWT tokens + cookie options."),
        ("utils/generateOTP.js", "Generates crypto.randomInt 6-digit numbers and hashes them via bcrypt."),
        ("services/email.service.js", "Transporter setup and HTML email template generator."),
        ("validators/auth.validator.js", "Validation chains enforcing @vitapstudent.ac.in domain and password rules."),
        ("middleware/auth.middleware.js", "Protects routes by verifying JWT Bearer tokens in headers."),
        ("middleware/role.middleware.js", "Enforces Role-Based Access Control (student vs admin)."),
        ("middleware/validate.middleware.js", "Intercepts validation errors and returns structured 400 responses."),
        ("controllers/auth.controller.js", "Implements register, verifyOtp, resendOtp, login, refreshToken, logout, getMe."),
        ("routes/auth.routes.js", "Maps endpoint paths to validation chains and controller functions.")
    ]

    for fname, fdesc in files:
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(58, 4.5, fname, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(0, 4.5, fdesc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 4. API Endpoints
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "4. API Endpoints Reference", new_x="LMARGIN", new_y="NEXT")

    endpoints = [
        ("POST", "/api/v1/auth/register", "Public", "Validates email domain, hashes password, saves user, creates OTP and emails it."),
        ("POST", "/api/v1/auth/verify-otp", "Public", "Compares submitted 6-digit OTP against MongoDB hash and activates account."),
        ("POST", "/api/v1/auth/resend-otp", "Public", "Deletes previous OTPs and dispatches a fresh 6-digit OTP."),
        ("POST", "/api/v1/auth/login", "Public", "Verifies credentials, issues Access Token (15m) and httpOnly Refresh Cookie (7d)."),
        ("POST", "/api/v1/auth/refresh-token", "Public (Cookie)", "Validates Refresh Cookie to issue a fresh Access Token."),
        ("POST", "/api/v1/auth/logout", "Protected", "Clears Refresh Token cookie and invalidates token in MongoDB."),
        ("GET", "/api/v1/auth/me", "Protected", "Fetches authenticated student profile information.")
    ]

    for method, path, access, edesc in endpoints:
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_text_color(16, 185, 129) if method == "GET" else pdf.set_text_color(37, 99, 235)
        pdf.cell(14, 4.5, method, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(58, 4.5, path, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "I", 8.5)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(32, 4.5, f"[{access}]", new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.5, edesc, new_x="LMARGIN", new_y="NEXT")

    out_file = os.path.join(target_dir, "CampusNest_Day2_Backend_Auth_Guide.pdf")
    pdf.output(out_file)
    print(f"Created: {out_file}")


# ── DAY 3 PDF GENERATOR ──────────────────────────────────────────
def build_day3_pdf(target_dir):
    pdf = CleanPDF("CampusNest - Day 3 Authentication Frontend Guide")
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Title
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Day 3: Authentication Frontend Complete Guide", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 6, "Target System: VIT-AP Student Portal (CampusNest) | Date: 2026-08-10", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 1. Executive Summary
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "1. Executive Summary", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(30, 41, 59)
    summary_text = (
        "On Day 3, we built the complete frontend user interface for CampusNest using React, Redux Toolkit, "
        "Tailwind CSS, Framer Motion, and Lucide icons. The authentication flow supports user registration, "
        "interactive 6-box OTP verification with paste and auto-focus, login, forgot password, reset password, "
        "and a student dashboard with logout functionality."
    )
    pdf.multi_cell(0, 5, summary_text)
    pdf.ln(4)

    # 2. Installed UI Dependencies
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "2. Installed Frontend Dependencies and UX Roles", new_x="LMARGIN", new_y="NEXT")
    
    deps = [
        ("lucide-react", "Modern iconography library used across form inputs, badges, and action buttons."),
        ("framer-motion", "Animation engine for smooth card transitions, floating mesh glow, and entrance effects."),
        ("react-hot-toast", "Toast notification system for real-time success, warning, and error alerts."),
        ("canvas-confetti", "Celebration animation library triggered upon successful OTP email verification.")
    ]
    
    for pkg, desc in deps:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(38, 5, f"- {pkg}:", new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5, desc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 3. Pages & Components Created
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "3. Frontend Pages and Components Breakdown", new_x="LMARGIN", new_y="NEXT")

    pages = [
        ("Register.jsx", "/register", "Features live @vitapstudent.ac.in domain checker, password strength meter, show/hide password, and form validation."),
        ("VerifyOtp.jsx", "/verify-otp", "Features 6 individual digit input boxes with auto-focus movement, backspace jump, paste support, 60s resend timer, and confetti celebration."),
        ("Login.jsx", "/login", "Standard login form with credential validation, remember me, forgot password link, and automatic session save."),
        ("ForgotPassword.jsx", "/forgot-password", "Form to request a 6-digit password reset code sent to student email."),
        ("ResetPassword.jsx", "/reset-password", "Form accepting 6-digit OTP code, new password, and password confirmation."),
        ("Dashboard.jsx", "/dashboard", "Protected student portal displaying profile details, verification badge, system module shortcuts, and a functioning Logout button."),
        ("AuthLayout.jsx", "Layout Wrapper", "Split showcase layout featuring glassmorphism card, ambient background mesh, college badge, and Toast container."),
        ("ProtectedRoutes.jsx", "Route Guard", "Verifies authentication state and redirects unauthenticated users to /login.")
    ]

    for pname, route, pdesc in pages:
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(48, 4.5, pname, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "I", 8.5)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(35, 4.5, f"[{route}]", new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.5, pdesc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 4. State Management & API Architecture
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "4. State Management and API Architecture", new_x="LMARGIN", new_y="NEXT")

    arch_items = [
        ("services/api.js", "Axios client with automatic Authorization Bearer header attachment and automatic 401 token refresh handling."),
        ("redux/slices/authSlice.js", "Redux Toolkit slice managing user profile, accessToken, isAuthenticated state, isLoading, and async thunks for all auth APIs."),
        ("redux/store.js", "Centralized Redux store configuration combining all application reducers.")
    ]

    for item, idesc in arch_items:
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(50, 4.5, item, new_x="RIGHT", new_y="LAST")
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.5, idesc, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 5. Student Workflow
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(0, 7, "5. Complete Student User Journey", new_x="LMARGIN", new_y="NEXT")

    flow = (
        "1. Student Registration: Student fills Register form with @vitapstudent.ac.in email and password.\n"
        "2. OTP Dispatch: Server sends 6-digit OTP via email; student is navigated to /verify-otp.\n"
        "3. OTP Verification: Student enters or pastes 6-digit code. On success, confetti fireworks animate.\n"
        "4. Authentication Login: Student logs in at /login. Access token stored; refresh token saved in httpOnly cookie.\n"
        "5. Dashboard Access: Student gains full access to /dashboard.\n"
        "6. Logout Action: Student clicks Logout; session tokens and cookies are invalidated."
    )
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(0, 5, flow)

    out_file = os.path.join(target_dir, "CampusNest_Day3_Frontend_Auth_Guide.pdf")
    pdf.output(out_file)
    print(f"Created: {out_file}")


if __name__ == "__main__":
    target = r"C:\Users\manee\OneDrive\Desktop\micheal"
    os.makedirs(target, exist_ok=True)
    build_day2_pdf(target)
    build_day3_pdf(target)
