# InternVision Tech - Pre-Hire Full-Stack Assignment

A production-ready full-stack ed-tech & internship platform featuring a modern public marketing portal, course catalog, Razorpay test mode payment processing, student internship application system, JWT-authenticated Admin Dashboard, and native OpenPyXL Excel export.

![InternVision Tech Platform](https://img.shields.io/badge/Stack-Next.js15%20%7C%20FastAPI%20%7C%20PostgreSQL-blueviolet)

---

## 🌟 Key Features

### 🌐 Public Website
- **Landing Page**: Modern hero section, key metrics, features, course highlights, student testimonials, and FAQ.
- **Course Catalog & Details**: Browse courses with category filtering, tech stack badges, syllabus overview, and registration checkout.
- **Internship Application**: Multi-step application collecting Student Name, Email, Phone, College, Degree, Year of Study, Skills tags, and Internship Duration options (`1 Month`, `3 Months`, `6 Months`).
- **Contact & Confirmation**: Inquiry submission page with response confirmation and Razorpay payment receipt pages (`/success`, `/error`).

### 💳 Payments Integration (Razorpay Test Mode)
- Server-side Razorpay Order generation.
- Client SDK integration.
- HMAC-SHA256 signature verification on backend to secure payment status (`captured`).

### 🔐 Admin Panel
- **JWT Authentication**: Secure admin login (`admin@internvision.tech` / `Admin@123456`).
- **Real-Time Analytics**: Dashboard statistics cards showing Total Revenue, Applications count, Course Registrations, and Payment Conversions.
- **Data Management Tables**: Live Search, Status/Duration Filters, Pagination across Applicants, Registrations, and Payments tables.
- **Native OpenPyXL Excel Export**: One-click `.xlsx` report downloads with styled headers and auto-formatted columns.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS, Lucide Icons, React Hook Form, Zod validation, TanStack Query.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0 ORM, Pydantic v2, PyJWT, Passlib (Bcrypt), OpenPyXL, Razorpay SDK.
- **Database**: PostgreSQL (Supabase / Railway compatible) with zero-config SQLite fallback for local testing.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python -m app.seed
python -m app.main
```
The FastAPI backend server will start at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The Next.js frontend app will start at `http://localhost:3000`.

---

## 🔑 Admin Credentials
- **Email**: `admin@internvision.tech`
- **Password**: `Admin@123456`

---

## 📁 Project Structure

```
.
├── backend/                  # FastAPI Application
│   ├── app/                  # Routes, Models, Services, Schemas, Core
│   ├── tests/                # Pytest Suite
│   ├── requirements.txt      # Python Dependencies
│   └── Dockerfile            # Container definition
├── frontend/                 # Next.js 15 Application
│   ├── src/                  # App Router, Components, Types, Utils
│   ├── package.json          # Node Dependencies
│   └── tailwind.config.js    # Tailwind Config
├── context/                  # Comprehensive Project Specifications
├── README.md                 # Project Documentation
└── CLAUDE.md                 # Development & Command Reference
```
