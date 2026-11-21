# 🛡️ PhishGuard – AI-Powered Email Phishing Detection System

[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.9-f7931e?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![React 18](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003b57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-ff6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

**PhishGuard** is a modern, responsive cybersecurity web application that analyzes email communications in real time to detect whether an email is **Safe / Legitimate**, **Suspicious**, or **Phishing / Malicious**.

PhishGuard fuses natural language processing (NLP), **TF-IDF vectorization**, a **calibrated Scikit-Learn classification pipeline**, and a deterministic **heuristic threat detection engine** to identify sophisticated social engineering tactics—including urgent language, fake login requests, OTP/password harvesting, executive impersonation (CEO fraud/BEC), wire scams, and deceptive URLs.

---

## 🚀 Key Features

### 1. 📊 Security Operations Center (SOC) Dashboard
- **Telemetry Counters**: Real-time stats for Total Emails Analyzed, Phishing Threats Blocked, Suspicious Anomalies, and Clean/Safe emails.
- **Threat Category Distribution**: Interactive **Chart.js Doughnut Chart** illustrating classification proportions.
- **Attack Vector Frequency**: Interactive **Chart.js Bar Chart** tracking urgency cues, credential theft, financial scam words, and URL anomalies.
- **Recent Activity Feed**: Real-time table showing timestamped evaluations with quick inspection modal.

### 2. 🔍 AI Email Threat Analyzer
- **Dual-Mode Inspection**:
  - **Raw Editor Mode**: Paste complete email headers, subject line, sender, and body text.
  - **Flagged Words View**: Visually highlights identified suspicious phrases, urgency lures, and credential solicitations directly in the text with cybernetic badges.
- **Interactive Risk Gauge**: Dynamic SVG circular gauge visualizing the **Risk Score (0–100%)** with color transitions (Emerald Safe, Amber Suspicious, Crimson Phishing).
- **Comprehensive Detection Verdict**:
  - Classification: `Safe`, `Suspicious`, or `Phishing`
  - Detection Confidence percentage (e.g. 96.8%)
  - Sub-class probability distribution breakdown (`Safe: X%`, `Suspicious: Y%`, `Phishing: Z%`)
  - Identified heuristic indicator cards with severity rating and matched text snippets
  - Embedded URLs analysis table
  - Contextual explanation of why the email was flagged
  - Actionable Recommended Security Actions checklist (with one-click clipboard copy)
- **Downloadable & Printable Reports**: Export full cybersecurity evaluation as formatted PDF/Print layout or JSON format.

### 3. 🌐 Non-Invasive URL Security Scanner
- Standalone passive lexical analysis engine.
- Inspects destination URLs without making outgoing connections to untrusted servers:
  - **IP Hostname check**: Flags direct IP addresses (e.g. `http://192.168.1.105/login`).
  - **Low-Reputation TLDs**: Detects high-risk extensions (`.xyz`, `.top`, `.buzz`, `.ru`, `.icu`, etc.).
  - **URL Shorteners**: Flags masking services (`bit.ly`, `tinyurl.com`, `t.co`, etc.).
  - **Insecure Protocol**: Identifies unencrypted HTTP on sensitive endpoints.
  - **Shannon Entropy**: Measures character randomness to flag algorithmic domain generation (DGA).

### 4. 📈 Threat Analytics & Trends
- **7-Day Trend Chart**: Rolling risk index and model prediction confidence timeline.
- **Prevalence Visualizer**: Breakdown of social engineering tactics across analyzed emails.
- **Mean Metrics**: Real-time computation of average risk score and mean confidence.

### 5. 🕒 Scan History Archive
- Persistent storage backed by **SQLite** (`phishguard.db`).
- Searchable by subject, sender, or email text preview.
- Filterable by classification status (`All`, `Safe`, `Suspicious`, `Phishing`).
- Inspect complete analysis details anytime in the report modal or delete individual records.

### 6. 📚 Curated Sample Library
- Pre-loaded attack vector corpus for rapid testing:
  - PayPal Account Restriction Phishing
  - Microsoft 365 License Deletion Scare
  - CEO Executive Fraud (BEC Wire Transfer)
  - Cryptocurrency Private Key Theft Alert
  - Overdue Invoice Spam with Redirect
  - Remote Work Scam
  - Legitimate Engineering Sprint Agenda
  - Verified GitHub Pull Request Notification
  - Genuine Stripe Payment Receipt
- One-click **"Load in Analyzer"** button to immediately run detection.

### 7. 🛡️ System Architecture & Policies
- Transparent documentation of machine learning algorithms, heuristic scoring weights, and security compliance policies.

---

## 🎨 UI/UX Design

- **Cybersecurity Aesthetics**: Dark navy (`#070b14`, `#0a0f1d`) and electric cyan/blue (`#00f0ff`, `#3b82f6`) palette with glowing neon accents.
- **Glassmorphism Panels**: Modern backdrop-blur cards with responsive borders.
- **Smooth Transitions & Animations**: Pulsing threat indicators, SVG gauge animations, and interactive hover states.
- **Fully Responsive**: Optimized for desktop monitors, laptops, tablets, and mobile smartphones.

---

## 🔒 Security & Ethical Standards

In strict accordance with cybersecurity best practices:
1. **Zero Credential Collection**: PhishGuard never solicits, captures, or transmits real passwords, PINs, or credentials.
2. **Safe, Passive URL Checks**: No outbound HTTP/HTTPS requests are initiated to untrusted domains.
3. **Synthetic Datasets**: All sample benchmarks utilize synthetic mock domains and simulated lures.
4. **Transparent Assessment**: Predictions are clearly labeled as automated AI assessments for informational and SOC verification purposes.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance single page application |
| **Styling** | Tailwind CSS | Modern cybersecurity glassmorphism & responsive layouts |
| **Icons** | Lucide React | Crisp, accessible cybersecurity iconography |
| **Visualizations** | Chart.js, react-chartjs-2 | Interactive Doughnut, Bar, and Line telemetry charts |
| **Backend API** | Python 3.11, Flask, Flask-CORS | RESTful API endpoints for analysis and stats |
| **Machine Learning**| Scikit-learn, NumPy | Logistic Regression classifier with class balancing |
| **NLP** | TF-IDF Vectorization | Unigram + Bigram feature extraction with sublinear TF |
| **Database** | SQLite 3 | Embedded zero-configuration persistent storage |

---

## 📁 Project Directory Structure

```
phishguard/
├── backend/
│   ├── app.py                  # Flask REST API server & routing
│   ├── dataset.py              # Synthetic & benchmark email training dataset
│   ├── model.py                # Scikit-Learn TF-IDF classifier & hybrid scoring
│   ├── feature_extractor.py    # Deterministic heuristic pattern analyzer
│   ├── url_analyzer.py         # Passive, non-invasive URL security engine
│   ├── database.py             # SQLite database layer & schema initialization
│   ├── test_backend.py         # Comprehensive automated unit test suite
│   ├── requirements.txt        # Python dependency manifest
│   └── phishguard.db           # SQLite database file
├── frontend/
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration & dev proxy
│   ├── tailwind.config.js      # Tailwind theme & color definitions
│   ├── postcss.config.js       # PostCSS plugins
│   ├── index.html              # HTML entry point with cybersecurity styling
│   └── src/
│       ├── main.jsx            # React root DOM rendering
│       ├── App.jsx             # Main application layout & active tab state
│       ├── index.css           # Glassmorphism & custom cyber animations
│       ├── components/
│       │   ├── Sidebar.jsx     # Navigation sidebar & engine status pill
│       │   ├── Header.jsx      # Top app header with quick action buttons
│       │   ├── RiskGauge.jsx   # Dynamic SVG circular risk gauge
│       │   ├── StatCard.jsx    # Glassmorphic telemetry counter card
│       │   └── ReportModal.jsx # Printable & downloadable evaluation report
│       ├── pages/
│       │   ├── Dashboard.jsx   # SOC telemetry, charts & recent activity
│       │   ├── EmailAnalyzer.jsx# Primary analyzer with highlighted text view
│       │   ├── UrlScanner.jsx  # Standalone non-invasive URL scanner
│       │   ├── Analytics.jsx   # Trend lines & attack vector statistics
│       │   ├── ScanHistory.jsx # SQLite history table with search & filters
│       │   ├── SampleLibrary.jsx# Curated threat benchmark presets
│       │   └── AboutSecurity.jsx# System architecture & security policies
│       └── utils/
│           ├── api.js          # Centralized API network client
│           └── sampleEmails.js # Curated sample email corpus
├── start.sh                    # Single-command launcher for backend + frontend
├── run_backend.sh              # Backend-only launcher
├── run_frontend.sh             # Frontend-only launcher
└── README.md                   # System documentation
```

---

## ⚡ Quickstart & Installation

### Prerequisites
- **Python 3.10+** (or [uv](https://github.com/astral-sh/uv))
- **Node.js 18+** & **npm**

### Option A: One-Click Startup (Recommended)
Run the root startup script to launch both the Flask Backend and React Frontend concurrently:

```bash
cd /Users/himanshubharti/.gemini/antigravity/scratch/phishguard
./start.sh
```

- **Web Application Interface**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://127.0.0.1:5050](http://127.0.0.1:5050)
- **API Health Check**: [http://127.0.0.1:5050/api/health](http://127.0.0.1:5050/api/health)

---

### Option B: Manual Setup

#### 1. Start the Flask Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
*Backend initializes on `http://127.0.0.1:5050`.*

#### 2. Start the React Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend opens on `http://localhost:5173`.*

---

## 🧪 Running Automated Backend Tests

The project includes an automated test suite verifying model inference, heuristic indicators, URL security checks, database operations, and API endpoints:

```bash
cd backend
source .venv/bin/activate
python test_backend.py
```

Expected output:
```
........
----------------------------------------------------------------------
Ran 8 tests in 0.022s

OK
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and ML model readiness |
| `POST`| `/api/analyze` | Evaluates email content, returns risk score, classification, and indicators |
| `POST`| `/api/scan-url` | Performs passive lexical analysis on a target URL |
| `GET` | `/api/stats` | Aggregated dashboard telemetry, distribution, and vector statistics |
| `GET` | `/api/history` | Paginated scan archive with optional `filter` and `search` query parameters |
| `GET` | `/api/history/<id>`| Full details for a single audited scan |
| `DELETE`| `/api/history/<id>`| Deletes an individual scan record |
| `DELETE`| `/api/history` | Clears all history from the database |

---

## 📜 License
Educational and demonstration cybersecurity platform. Designed for training, awareness, and automated threat triage.
