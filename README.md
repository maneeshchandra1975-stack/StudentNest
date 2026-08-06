<h1 align="center">
  🏠 CampusNest
</h1>

<p align="center">
  <strong>Trusted Campus Housing & Marketplace Platform</strong><br/>
  Built exclusively for VIT-AP University students
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 📖 Description

CampusNest is a production-quality SaaS web application that solves the housing and marketplace problem faced by university students. Students can find verified rooms and PGs, discover compatible roommates, buy and sell second-hand items, and communicate in real time — all within a trusted, college-email-verified ecosystem.

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI Framework |
| Tailwind CSS | Styling |
| React Router | Client-side Routing |
| Redux Toolkit | Global State Management |
| Axios | HTTP Client |
| React Hook Form | Form Management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API Server |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Nodemailer | Email / OTP Service |
| Socket.IO | Real-Time Chat |
| Multer | File Uploads |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Database |
| Cloudinary | Image Storage |
| Vercel | Frontend Deployment |
| Render | Backend Deployment |

---

## 📁 Folder Structure

```
CampusNest/
├── client/                     # React (Vite) Frontend
│   └── src/
│       ├── assets/             # Images, icons, fonts
│       ├── components/         # Reusable UI components
│       ├── hooks/              # Custom React hooks
│       ├── layouts/            # Page layout wrappers
│       ├── pages/              # Route-level page components
│       ├── redux/              # Redux Toolkit store & slices
│       ├── routes/             # React Router configuration
│       ├── services/           # Axios API service layer
│       ├── styles/             # Global CSS / theme tokens
│       └── utils/              # Utility/helper functions
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB, Cloudinary, environment config
│   ├── controllers/            # Route handler logic (MVC)
│   ├── middleware/             # Auth, error, upload middleware
│   ├── models/                 # Mongoose schemas & models
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business logic layer
│   ├── utils/                  # Helper utilities
│   ├── validators/             # Request validation schemas
│   └── uploads/                # Temporary local file uploads
│
├── docs/                       # Project Documentation
│   ├── SRS.md                  # Software Requirements Specification
│   ├── Database.md             # Database Schema Design
│   ├── API.md                  # API Reference
│   ├── Roadmap.md              # Development Roadmap
│   └── UI.md                   # UI/UX Design Notes
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗺️ Development Roadmap

| Phase | Feature | Status |
|---|---|---|
| Phase 1 | Project Setup & Foundation | ✅ In Progress |
| Phase 2 | Authentication & Email OTP | 🔜 Upcoming |
| Phase 3 | Housing Marketplace | 🔜 Upcoming |
| Phase 4 | Student Marketplace | 🔜 Upcoming |
| Phase 5 | Roommate Finder | 🔜 Upcoming |
| Phase 6 | Real-Time Chat (Socket.IO) | 🔜 Upcoming |
| Phase 7 | Student Dashboard | 🔜 Upcoming |
| Phase 8 | Admin Panel | 🔜 Upcoming |
| Phase 9 | Deployment | 🔜 Upcoming |
| Phase 10 | AI-Powered Features | 🔜 Upcoming |

---

## ⚙️ Installation

> **Prerequisites:** Node.js ≥ 18, npm ≥ 9, MongoDB Atlas account, Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/campusnest.git
cd campusnest
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env      # Fill in your environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

> Documentation for `.env` variables will be added as features are built.

---

## 👨‍💻 Author

Built with ❤️ as a flagship portfolio project demonstrating professional full-stack engineering practices.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
