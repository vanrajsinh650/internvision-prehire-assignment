# 🚀 InternVision Tech - Production EdTech & Internship Platform

> **A modern, high-contrast, production-ready Full-Stack EdTech & Pre-Hire Internship Platform.** Built with Next.js 15 (React 19), FastAPI, PostgreSQL (Supabase IPv4 Connection Pooler), Razorpay Payment Gateway, and JWT-authenticated Admin Portal.

![Stack](https://img.shields.io/badge/Frontend-Next.js%2015%20%7C%20React%2019-black?style=for-the-badge&logo=next.js)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688?style=for-the-badge&logo=fastapi)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Design](https://img.shields.io/badge/Design-Human--Centered%20Brutalist-000000?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-blue?style=for-the-badge&logo=vercel)

---

## 📐 System Architecture & Software Workflow

### 1. High-Level Architecture Diagram
```mermaid
graph TD
    subgraph Client ["🌐 Client Layer (Vercel)"]
        User["User / Student Browser"]
        NextApp["Next.js 15 App Router\n(React 19 + Tailwind CSS)"]
    end

    subgraph API ["⚙️ Backend Layer (FastAPI / Render)"]
        FastAPI["FastAPI Uvicorn Application"]
        Middleware["Logging & Request-ID Middleware\n(X-Request-ID / Latency Tracker)"]
        JWTAuth["JWT Authentication Guard\n(Passlib / Bcrypt)"]
    end

    subgraph Integration ["💳 Payment Gateway"]
        Razorpay["Razorpay Payment Gateway API\n(HMAC SHA-256 Signature Verification)"]
    end

    subgraph Data ["🗄️ Database Layer (Supabase)"]
        Pooler["Supabase Connection Pooler\n(aws-0-ap-southeast-1.pooler.supabase.com:6543)"]
        Postgres[(PostgreSQL Database\nCourses, Applications, Payments, Admin)]
    end

    User <-->|HTTPS / REST API| NextApp
    NextApp <-->|JSON / REST| FastAPI
    FastAPI --> Middleware
    Middleware --> JWTAuth
    FastAPI <-->|Razorpay SDK| Razorpay
    FastAPI <-->|SQLAlchemy ORM (Connection Pool)| Pooler
    Pooler <--> Postgres
```

---

### 2. Payment & Course Enrollment Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Frontend as Next.js Frontend
    participant Backend as FastAPI Backend
    participant Razorpay as Razorpay API
    participant DB as PostgreSQL (Supabase)

    Student->>Frontend: Selects Course & Clicks "Enroll & Pay Now"
    Frontend->>Frontend: Fills Student Info (Zod & React Hook Form)
    Frontend->>Backend: POST /api/payments/create-order
    Backend->>DB: Record Registration (Status: Pending)
    Backend->>Razorpay: Create Order ID
    Backend-->>Frontend: Return Order ID & Key ID
    
    alt Test / Mock Mode
        Frontend->>Backend: Auto-Verify POST /api/payments/verify (Mock Sig)
        Backend->>DB: Update Payment (Status: Captured) & Registration (Confirmed)
        Backend-->>Frontend: Verification Success
        Frontend-->>Student: Redirect to /success Page
    else Live Razorpay Gateway
        Frontend->>Razorpay: Launch Razorpay Checkout Modal
        Razorpay-->>Student: Display Gateway Modal
        Student->>Razorpay: Completes Payment / Input OTP
        Razorpay-->>Frontend: Returns razorpay_payment_id & signature
        Frontend->>Backend: POST /api/payments/verify
        Backend->>Backend: Verify HMAC-SHA256 Signature
        Backend->>DB: Update Payment & Registration Status
        Backend-->>Frontend: Signature Validated
        Frontend-->>Student: Redirect to /success Page
    end
```

---

### 3. Internship Application Workflow
```mermaid
flowchart LR
    A[Student Submits Application] --> B[Zod Input Validation]
    B -->|Valid| C[POST /api/applications]
    C --> D[SQLAlchemy ORM Save]
    D --> E[Supabase DB Persistence]
    E --> F[Redirect to /success]
    
    subgraph Admin Management
        G[Admin Logs In] --> H[JWT Token Verification]
        H --> I[View Dashboard Analytics]
        I --> J[Filter & Manage Applicants]
        J --> K[Export Applications / Payments as CSV]
    end
```

---

## 🎨 Human-Centered Brutalist Design Philosophy

This project intentionally rejects generic "AI slop" aesthetics (floating purple blurs, soft glassmorphism gradients, and generic cards) in favor of an **assertive, human-centered brutalist design system**:

- **Stark Contrast**: Solid dark backgrounds (`bg-ink-950`) combined with high-contrast text (`font-black` headers, dense uppercase microcopy).
- **Asymmetric Layouts**: Intentional grid offsets (`col-span-5` vs `col-span-7`), tilted accent badges (`-rotate-1`), and varied spacing.
- **Tactile Shadows & Borders**: Sharp 2px borders (`border-ink-800`) with solid block drop-shadows (`shadow-[8px_8px_0px_#1a1915]`).
- **Snappy Performance**: Removed overused scroll-fade animations for instant DOM rendering and fast interactive state transitions.

---

## 🔑 Demo Admin Credentials

> [!IMPORTANT]
> - **Admin Email**: `admin@internvision.tech`
> - **Admin Password**: `Admin@123456`
> - **Admin Login Route**: `/admin/login`

---

## 🌟 Key Features Overview

### 🌐 Public Portal & Course Catalog
- **Course Exploration**: Browse courses with category filtering, level badges, tech tags, and INR pricing.
- **Syllabus Details**: Comprehensive learning outcomes, technologies covered, and instant enrollment modal.
- **Internship Application**: Apply for 1-month, 3-month, or 6-month hands-on pre-hire engineering tracks.

### 🔐 Admin Dashboard & Export System
- **Real-Time Metrics**: Track total applications, registrations, revenue (INR), and conversion metrics.
- **Data Filtering**: Filter candidate applications by status (`pending`, `reviewed`, `accepted`, `rejected`).
- **CSV Data Stream Export**: Instant 1-click download of all application records and payment audit logs.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Key Usage |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)** | React 19, Server & Client Components, TypeScript |
| **Styling** | **Tailwind CSS** | Brutalist Theme Tokens, Custom Ink Palette (`ink-950`) |
| **Backend** | **FastAPI (Python 3.11)** | Async REST API, Pydantic v2 validation, Uvicorn |
| **Database** | **PostgreSQL & Supabase** | Session ORM via SQLAlchemy 2.0, IPv4 Pooler (:6543) |
| **Authentication**| **JWT (JSON Web Tokens)** | Passlib (Bcrypt) password hashing, AuthGuard |
| **Payments** | **Razorpay SDK** | Test/Live mode checkout, HMAC-SHA256 verification |

---

## 🚀 Quick Start & Setup Guide

### 1. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database seed script (Admin user & initial courses)
python -m app.seed

# Start FastAPI Uvicorn development server
python -m app.main
```
- **API Base URL**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check Endpoint**: `http://localhost:8000/api/health`

### 2. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
- **Web App**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin/login`

---

## 📡 API Endpoints Summary

| Endpoint | Method | Description | Auth |
| :--- | :---: | :--- | :---: |
| `GET /api/health` | `GET` | System health check & PostgreSQL connection status | Public |
| `GET /api/courses` | `GET` | Fetch course catalog | Public |
| `GET /api/courses/{slug}` | `GET` | Fetch specific course details by slug | Public |
| `POST /api/applications` | `POST` | Submit student internship application | Public |
| `POST /api/payments/create-order` | `POST` | Generate Razorpay payment order | Public |
| `POST /api/payments/verify` | `POST` | Verify Razorpay payment HMAC signature | Public |
| `POST /api/auth/login` | `POST` | Admin authentication & JWT token issuance | Public |
| `GET /api/admin/applications` | `GET` | Fetch all internship applications | **JWT** |
| `GET /api/admin/payments` | `GET` | Fetch all payment records | **JWT** |
| `GET /api/admin/stats` | `GET` | Fetch real-time dashboard analytics | **JWT** |
| `GET /api/admin/export/applications` | `GET` | Stream CSV export of applications | **JWT** |
| `GET /api/admin/export/payments` | `GET` | Stream CSV export of payment logs | **JWT** |

---

## 📁 Repository Structure

```
internvision-prehire-assignment/
├── backend/
│   ├── app/
│   │   ├── auth/            # Admin JWT Authentication
│   │   ├── core/            # Config, Security & Tracing Middleware
│   │   ├── courses/         # Course Catalog Models & Routers
│   │   ├── dashboard/       # Admin Analytics & Management
│   │   ├── export/          # CSV Streaming Exports
│   │   ├── internship/      # Application Processing
│   │   ├── payments/        # Razorpay Integration & Signature Verification
│   │   └── shared/          # Database ORM Base & Exception Handlers
│   ├── main.py              # Application Entry Point
│   ├── seed.py              # Database Seeder
│   └── requirements.txt     # Python Dependencies
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js 15 App Router Pages
│   │   ├── components/      # UI Cards, Navbar, Footer, Animations
│   │   ├── lib/             # API Client & Utility Helpers
│   │   └── types/           # TypeScript Definitions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

*Built with precision for InternVision Tech.*
