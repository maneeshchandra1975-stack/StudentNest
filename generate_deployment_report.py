from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors

def create_pdf_report():
    file_name = "C:/Users/manee/OneDrive/Desktop/StudentNest/Deployment_Troubleshooting_Report.pdf"
    doc = SimpleDocTemplate(file_name, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor("#2563eb"),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        textColor=colors.HexColor("#1e40af"),
        spaceBefore=15,
        spaceAfter=10
    )
    
    subheading_style = ParagraphStyle(
        'SubHeadingStyle',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor("#ef4444"),
        spaceBefore=10,
        spaceAfter=5
    )
    
    success_style = ParagraphStyle(
        'SuccessStyle',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor("#10b981"),
        spaceBefore=5,
        spaceAfter=10
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        spaceAfter=10
    )

    content = []

    # Title
    content.append(Paragraph("StudentNest Deployment Report", title_style))
    content.append(Paragraph("Production Troubleshooting & Resolutions", ParagraphStyle('Subtitle', parent=styles['Normal'], alignment=TA_CENTER, fontName='Helvetica-Oblique', spaceAfter=30)))

    content.append(Paragraph("Overview", heading_style))
    content.append(Paragraph("During the deployment of StudentNest to Vercel (Frontend) and Render (Backend), several critical infrastructure and configuration issues were encountered. This report details the specific problems that arose during the production launch of the authentication system and how they were successfully resolved.", body_style))

    content.append(Spacer(1, 15))

    # Issue 1
    content.append(Paragraph("1. Vercel Build Failure (Dependency Conflicts)", heading_style))
    content.append(Paragraph("Problem:", subheading_style))
    content.append(Paragraph("The Vercel frontend deployment failed during the build process. The project was utilizing Vite 8, but the installed version of <code>@vitejs/plugin-react</code> (v4.5.2) was incompatible, leading to an ERESOLVE peer dependency conflict.", body_style))
    
    content.append(Paragraph("Resolution:", success_style))
    content.append(Paragraph("We safely upgraded <code>@vitejs/plugin-react</code> to version 6.0.0, which officially supports Vite 8. This resolved the peer dependency conflict, allowing the Vercel CI/CD pipeline to successfully run <code>npm install</code> and <code>npm run build</code>.", body_style))

    content.append(Spacer(1, 15))

    # Issue 2
    content.append(Paragraph("2. CORS Security Blocks on Frontend Requests", heading_style))
    content.append(Paragraph("Problem:", subheading_style))
    content.append(Paragraph("Once deployed, frontend requests to the Render API were failing silently. The browser was blocking the requests because the backend CORS configuration was only allowing connections from the local development origin (http://localhost:5174).", body_style))
    
    content.append(Paragraph("Resolution:", success_style))
    content.append(Paragraph("We implemented a dynamic <code>CLIENT_URL</code> environment variable in the backend. We then configured the Render dashboard to set this variable to the live Vercel URL (https://student-nest-six.vercel.app). This authorized the production frontend to securely communicate with the backend.", body_style))

    content.append(Spacer(1, 15))

    # Issue 3
    content.append(Paragraph("3. 2-Minute Timeout & Render SMTP Restrictions", heading_style))
    content.append(Paragraph("Problem:", subheading_style))
    content.append(Paragraph("When users attempted to request a Password Reset OTP, the UI would hang for exactly 2 minutes before failing without sending an email. This occurred because Render's Free Tier firewall actively blocks all outbound traffic on standard SMTP ports (Port 587/465) to prevent spam. Nodemailer would wait for the connection until it hit the 120-second TCP timeout limit.", body_style))
    
    content.append(Paragraph("Resolution:", success_style))
    content.append(Paragraph("To completely bypass Render's network restrictions, we migrated the email service away from Nodemailer/SMTP and integrated the Brevo (Sendinblue) HTTP REST API. By sending email payloads over Port 443 (standard HTTPS), we successfully evaded the SMTP block, resulting in instantaneous OTP delivery.", body_style))

    content.append(Spacer(1, 15))

    # Issue 4
    content.append(Paragraph("4. Brevo Sender Identity Validation", heading_style))
    content.append(Paragraph("Problem:", subheading_style))
    content.append(Paragraph("After migrating to the Brevo API, the request succeeded instantly but returned an <code>invalid_parameter: valid sender email required</code> error. Brevo rejected the email because the designated 'From' email address did not match the authorized account owner's email.", body_style))
    
    content.append(Paragraph("Resolution:", success_style))
    content.append(Paragraph("We synchronized the <code>SMTP_FROM</code> environment variable in Render to perfectly match the registered Brevo account email address. This fulfilled Brevo's anti-spoofing security requirements, allowing the emails to successfully reach student inboxes.", body_style))

    content.append(Spacer(1, 20))
    
    # Conclusion
    content.append(Paragraph("Current Status: All Systems Operational", ParagraphStyle('Status', parent=styles['Heading2'], fontName='Helvetica-Bold', textColor=colors.HexColor("#059669"))))
    content.append(Paragraph("The StudentNest application is now fully deployed. The frontend is correctly routing pages on Vercel, the backend is connected to the MongoDB Atlas cluster securely, and the automated password reset emails are actively delivering via the Brevo API.", body_style))

    # Build PDF
    doc.build(content)

if __name__ == "__main__":
    create_pdf_report()
