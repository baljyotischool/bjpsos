# Baljyoti Public School — AI School Operating System (ERP)
**Enterprise Institutional ERP powered by Google Workspace for Education & Google Cloud Ecosystem**

---

## 🏛️ Architecture Overview

Baljyoti Public School OS is a comprehensive, institutional-grade School ERP unifying all administrative and pedagogical operations across **3 Vertical Modules** supported by **1 Horizontal Module**:

```
                                 ┌───────────────────────────────────┐
                                 │      Google Workspace & Cloud     │
                                 │ (SSO, Classroom, Drive, BigQuery) │
                                 └─────────────────┬─────────────────┘
                                                   │
                  ┌────────────────────────────────┼────────────────────────────────┐
                  ▼                                ▼                                ▼
       ┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
       │   1. ADMISSION ERP  │          │   2. ACADEMIC ERP   │          │   3. ACTIVITY ERP   │
       │  (Inquiries, CRM,   │          │  (CBSE Gradebooks,  │          │ (4 House System,    │
       │   Diagnostics & TC) │          │  NEP 2020 AI Plans) │          │  Athletics, Events) │
       └──────────┬──────────┘          └──────────┬──────────┘          └──────────┬──────────┘
                  │                                │                                │
                  └────────────────────────────────┼────────────────────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │       4. ADMINISTRATION ERP       │
                                 │ (Fee Billing, HR, Fleet GPS, RFID)│
                                 └───────────────────────────────────┘
```

---

## 🚀 Hosting on GitHub Pages (Static Build)

This repository includes a pre-configured, automated **GitHub Actions** workflow (`.github/workflows/deploy.yml`) that compiles and publishes all static pages with zero configuration.

### How to Deploy:
1. **Push this repository to GitHub**:
   - Use Google AI Studio's **Settings -> Export to GitHub** or push directly using git.
2. **Enable GitHub Pages**:
   - In your repository, navigate to **Settings** ➔ **Pages**.
   - Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
3. **Live App URL**:
   - Once the action completes (usually in ~45 seconds), your site will be live at:
     ```
     https://<your-github-username>.github.io/<repository-name>/
     ```

---

## 🌐 Connecting with the Google Ecosystem

| Google Service | Institutional Integration | Configuration |
| :--- | :--- | :--- |
| **Google Workspace SSO** | One-tap authentication for `@baljyoti.com` domain accounts | Configured via Google Identity Services (`initTokenClient`) |
| **Google Classroom API** | Real-time synchronization of assignments, lesson plans & exit tickets | Classroom Sync Engine |
| **Google Drive & Docs** | Student admission dossiers, digital report cards, and transfer certificates | Document Verification Pipeline |
| **Google Meet** | 1-Click virtual admissions interviews and Parent-Teacher Meetings | Integrated in Admission & Academic Modules |
| **Gemini 3.7 Flash AI** | Next-Best-Action recommendations, lesson plan generation, and circulars | `GEMINI_API_KEY` in environment secrets |
| **Google BigQuery** | Longitudinal student performance analytics and predictive remediation | BigQuery Lake Visualizer |
| **Firebase Firestore** | Real-time state persistence across teacher, parent, and admin portals | Firebase Cloud Configuration |

---

## 🔑 Quick Demo Credentials (7 ERP Portals)

You can launch instantly via the **ERP Portals** selector on the Login Gateway, or sign in using any of the following demo credentials:

| Department / Role | Demo Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin / Principal** | `superadmin@baljyoti.com` | `BPS#Admin2026!` | Universal ERP Access (All Modules + RBAC) |
| **Board Director** | `director@baljyoti.com` | `BPS#Director2026!` | Executive Oversight (All 4 Modules) |
| **Admissions Registrar** | `admissions@baljyoti.com` | `BPS#Admissions2026!` | Admission CRM & Entrance Diagnostics |
| **Academic Dean** | `academic@baljyoti.com` | `BPS#Academic2026!` | CBSE Gradebook & NEP 2020 AI Lesson Plans |
| **Faculty / Teacher** | `teacher@baljyoti.com` | `BPS#Teacher2026!` | Daily RFID Attendance & Class Grading |
| **House & Sports Head** | `activity@baljyoti.com` | `BPS#Activity2026!` | 4 Houses Points, Athletics & Hackathons |
| **Finance Officer** | `finance@baljyoti.com` | `BPS#Finance2026!` | Q1-Q4 Fee Invoicing, HR & Bus GPS Fleet |
| **Parent / Guardian** | `parent@baljyoti.com` | `BPS#Parent2026!` | Student Progress, Fee Receipts & Bus Live Map |

---

## 🛠️ Local Development & Full-Stack Server

```bash
# Install dependencies
npm install

# Start development server (Full-stack with Express + Vite on port 3000)
npm run dev

# Build production static bundle & server bundle
npm run build

# Start production server
npm start
```
