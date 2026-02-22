# 📊 SubTrack — Subscription Management SaaS Web Application

SubTrack is a full-stack SaaS-style web application that enables users to manage recurring subscriptions, analyze spending patterns, and track renewal schedules in a clean, modern dashboard interface.

This project demonstrates scalable frontend architecture, modular service design, secure authentication integration, and real-time analytics visualization.

---

## 🎯 Problem Statement

Students and young professionals often underestimate recurring digital expenses and forget renewal dates. Most financial apps are overly complex or require direct bank integrations.

SubTrack provides:

- Centralized subscription tracking
- Spending analytics dashboard
- Renewal visibility
- Clean SaaS-style UI

Without requiring bank connections.

---

## 🚀 Tech Stack

### Frontend
- React (with TypeScript)
- Vite (Build Tool)
- Context API (State Management)
- Tailwind CSS (Styling)
- Supabase (Backend-as-a-Service)
- Modular Service Layer (API abstraction)

### Backend / Database
- Supabase (PostgreSQL + Auth)
- Row-Level Security (RLS)
- Secure API interactions

### Deployment
- Vercel (Frontend Hosting)

---

## 📂 Project Structure

```
subtrack/
│
├── src/
│   ├── components/              # Reusable UI Components
│   │   ├── AppLayout.tsx
│   │   ├── PublicLayout.tsx
│   │   ├── SubscriptionModal.tsx
│   │   └── UPIPaymentModal.tsx
│   │
│   ├── context/                 # Global State Management
│   │   └── AppContext.tsx
│   │
│   ├── lib/                     # External integrations
│   │   └── supabase.ts
│   │
│   ├── pages/                   # Route-based Pages
│   │   ├── Analytics.tsx
│   │   ├── Calendar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Pricing.tsx
│   │   ├── Register.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   └── Subscriptions.tsx
│   │
│   ├── services/                # API abstraction layer
│   │   └── apiService.ts
│   │
│   ├── App.tsx                  # Root App Component
│   ├── main.tsx                 # Application Entry
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Authentication & Security

- Supabase Authentication
- JWT-based session handling
- Environment variable configuration
- Secure API calls through service layer
- Row-Level Security (RLS) policies

---

## 📦 Core Features

### Subscription Management
- Add subscriptions
- Edit subscription details
- Delete subscriptions
- Track renewal dates
- Categorize subscriptions

### Dashboard Analytics
- Monthly spending summary
- Category-wise cost breakdown
- Subscription status tracking

### Calendar View
- Upcoming renewal visibility
- Date-based subscription tracking

### Reports & Insights
- Spending patterns
- Subscription distribution
- Cost projections

---

## 🧠 Architecture Highlights

- Component-based UI architecture
- Layout separation (Public vs App)
- Centralized global state via Context API
- Dedicated API service layer (`apiService.ts`)
- Supabase abstraction via `lib/supabase.ts`
- Clean route-based page structure
- Scalable and maintainable folder organization

---

## 🛠 Environment Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd subtrack
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create:

```
.env.local
```

Add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

---

## 🌐 Deployment

Frontend deployed on **Vercel**

If using React Router, ensure `vercel.json` exists in root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📊 Example Subscription Data Model

```json
{
  "name": "Netflix",
  "category": "Entertainment",
  "cost": 649,
  "billingCycle": "monthly",
  "nextRenewalDate": "2026-03-01",
  "status": "active"
}
```

---

## 💡 What This Project Demonstrates

- Modern React + TypeScript architecture
- Clean SaaS UI design
- Context-based global state management
- Supabase integration
- REST-style service abstraction
- Deployment configuration
- Production-ready folder structure

---

## 📄 License

This project is developed for educational and portfolio purposes.