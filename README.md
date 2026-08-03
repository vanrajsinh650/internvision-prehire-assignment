# InternVision Tech - Pre-Hire Full-Stack Assignment

A production-ready full-stack ed-tech & internship platform featuring a modern public marketing portal, course catalog, Razorpay test mode payment processing, student internship application system, JWT-authenticated Admin Dashboard, and native OpenPyXL Excel export.

![InternVision Tech Platform](https://img.shields.io/badge/Stack-Next.js15%20%7C%20FastAPI%20%7C%20PostgreSQL-blueviolet)
![Tests](https://img.shields.io/badge/Pytest-100%25%20Passing-brightgreen)
![Security](https://img.shields.io/badge/Security-Pydantic%20v2%20%7C%20HMAC--SHA256-blue)

---

## 🔑 Demo Admin Credentials

> [!IMPORTANT]
> - **Admin Email**: `admin@internvision.tech`
> - **Admin Password**: `Admin@123456`
> - **Login URL**: `http://localhost:3000/admin/login`

---

## 🌟 Key Features & Production Polish

### 🌐 Public Marketing & Course Portal
- **Hero & Course Catalog**: Browse top tech courses, filtered by category and tech stack tags.
- **Razorpay Test Payment Checkout**: Integrated client SDK + backend HMAC-SHA256 signature verification.
- **Internship Application Portal**: Multi-step student application form with custom duration selection (`1 Month`, `3 Months`, `6 Months`) and skills tag selection.

### 🔐 Authenticated Admin Dashboard
- **Real-Time Analytics**: Metrics cards tracking Total Revenue (INR), Total Applications, Registrations, and Conversion Rate.
- **Dynamic Filtering & Search**: Server-side pagination, search, status, and duration filter controls.
- **Native OpenPyXL Excel Export**: One-click `.xlsx` report download formatted with custom styled header columns.

### ⚙️ Operational Excellence & Security
- **Structured Logging & Tracing Middleware**: Generates unique `X-Request-ID` headers for every request, logging IP, HTTP method, status, and execution latency (`X-Response-Time-Ms`).
- **Database-Backed Health Endpoint**: `GET /health` tests database connectivity (`SELECT 1`) and returns environment, status, and version metrics.
- **Environment Configuration**: Centralized Pydantic v2 `BaseSettings` (`app/core/config.py`) reading from `.env` with strict fallback defaults.
- **Hardened CORS Policy**: Strict allowed origins (`http://localhost:3000`, `http://127.0.0.1:3000`) instead of wildcards.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS, Lucide Icons, React Hook Form, Zod validation, TanStack Query.
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0 ORM, Pydantic v2 Settings, PyJWT, Passlib (Bcrypt), OpenPyXL, Razorpay SDK.
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

# Run seed data script (populates Admin user & sample courses)
python -m app.seed

# Run local development server
python -m app.main
```
- API Server: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

### 2. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
- Web Portal: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin/login`

---

## 🧪 Running Automated Tests

```bash
cd backend
python -m pytest
```
*Executes 7 unit and integration test cases covering health checks, auth, courses, internship applications, admin stats, and Excel export.*

---

## 📡 API Reference Overview

| Endpoint | Method | Description | Auth Required |
| :--- | :---: | :--- | :---: |
| `GET /health` | `GET` | System & DB connection health check | No |
| `POST /api/auth/login` | `POST` | Admin authentication (returns JWT token) | No |
| `GET /api/courses` | `GET` | List available courses | No |
| `POST /api/applications` | `POST` | Submit student internship application | No |
| `POST /api/payments/create-order` | `POST` | Generate Razorpay order ID | No |
| `POST /api/payments/verify` | `POST` | Verify Razorpay HMAC payment signature | No |
| `GET /api/admin/stats` | `GET` | Retrieve real-time dashboard analytics | **Yes (JWT)** |
| `GET /api/admin/export/applications` | `GET` | Export applications as `.xlsx` file | **Yes (JWT)** |

---

## 📁 Project Structure

```
.
├── backend/                  # FastAPI Application
│   ├── app/                  # Routes, Models, Services, Core, Middleware
│   ├── tests/                # Pytest Test Suite
│   ├── .env.example          # Environment variables template
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

