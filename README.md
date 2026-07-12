# 🛰️ Orbital Risk Intelligence System (ORIS)

An enterprise-grade, real-time **Space Debris Collision Assessment & Autonomous Mitigation Platform**. ORIS leverages high-precision **SGP4 orbital propagation via Skyfield** and Celestrak Two-Line Element (TLE) sets to monitor space objects, predict conjunctions, trigger autonomous avoidance contracts, and log verifiable proof to an immutable **SHA-256 Cryptographic Blockchain Audit Ledger**.

---

## ✨ Core Unique Selling Proposition (USP)

When an orbital conjunction assessment breaches the **Critical Risk Threshold (< 1.0 km)**:
1. **Autonomous Avoidance Triggered:** Automatically initiates an avoidance maneuver contract (`ORIS-MIT-...`).
2. **Cryptographic Blockchain Ledger:** Records the conjunction state vectors, distance, and timestamp into a verifiable SHA-256 hash block (`AuditLog`) linked to the previous block (`prev_hash`).
3. **Immutable Incident Register:** Creates a permanent record in the critical incident registry for mission-control auditing.

---

## 🚀 Quickstart Guide (How to Start Locally)

Follow these exact steps to start both the backend API server and the Next.js frontend application on your machine.

### Prerequisites
* **Python 3.10+** installed and added to PATH
* **Node.js 18+** & **npm** installed

---

### Step 1: Start the Backend Server (FastAPI)

Open your **first terminal window** (PowerShell or Command Prompt) and run:

```powershell
# 1. Switch to the drive and navigate to the backend folder
D:
cd "D:\Vantis Corp\Project\orbital-risk-intel\backend"

# 2. Set PYTHONPATH so Python finds the application modules
$env:PYTHONPATH = "."

# 3. Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

> **What happens on startup?**
> - Automatically creates the SQLite database (`orbital_risk.db`) if it doesn't exist.
> - Seeds initial satellite & debris records with verified fallback TLEs.
> - Starts background scheduler for live Celestrak TLE ingestion.
> - API Documentation is available at: **http://localhost:8000/docs**

---

### Step 2: Start the Frontend App (Next.js)

Open a **second terminal window** and run:

```powershell
# 1. Switch to the drive and navigate to the frontend folder
D:
cd "D:\Vantis Corp\Project\orbital-risk-intel\frontend"

# 2. Install dependencies (if first time running)
npm install

# 3. Start the Next.js development server
npm run dev
```

---

### Step 3: Open the Application in Your Browser

Open your web browser and navigate to:
👉 **http://localhost:3000**

---

## 🛠️ Interactive Dashboard Controls

Once the dashboard loads, you can select any **Satellite** (e.g., ISS, Hubble, Starlink) and any **Debris Object** (e.g., Cosmos 2251, Fengyun-1C) and use the action toolbar:

* **◉ RUN ASSESSMENT:** Computes instantaneous separation distance, relative velocity, and risk classification.
* **◈ PREDICT TCA:** Runs a multi-hour SGP4 propagation window to predict the Time of Closest Approach (TCA).
* **🚨 EMERGENCY DRILL:** Instantly simulates a critical threshold breach (< 1 km encounter) to demonstrate the **Autonomous Critical Response Engine** and verify blockchain audit block generation.
* **🛡️ AUDIT REGISTER:** Opens the interactive SHA-256 hash-chain ledger to inspect cryptographic block verification status.

---

## 🏗️ System Architecture

```
orbital-risk-intel/
├── backend/                   # FastAPI Backend (Python)
│   ├── app/
│   │   ├── main.py            # Lifecycle management & routers
│   │   ├── models.py          # SQLAlchemy models (Satellites, Debris, Incidents, AuditLog)
│   │   ├── routers/           # /api/satellites, /api/debris, /api/assess, /api/audit-logs
│   │   └── services/          # SGP4 propagation, TLE ingestion, Automated Response
│   └── seed_data.py           # Resilient orbital data seeding with fallback TLEs
├── frontend/                  # Next.js 16 + React Frontend (TypeScript)
│   ├── src/
│   │   ├── app/page.tsx       # Main Real-Time Dashboard
│   │   ├── components/        # Interactive 3D Globe, Audit Trail Modal, Risk Panels
│   │   └── lib/api.ts         # Type-safe API client
└── README.md
```
