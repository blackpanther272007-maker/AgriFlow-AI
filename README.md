# AgriFlow AI
## Intelligent Farm Management and Predictive Analytics System

AgriFlow AI is a comprehensive modern web application designed to empower farmers and agribusinesses with precision farm record-keeping, real-time financial tracking, livestock health monitoring, offline-first deterministic AI insights, and dynamic report generation.

> **✨ Standalone Demo Version**: This repository is configured to run as a **self-contained, standalone demo**. It requires **zero backend, zero database (no MongoDB), and zero external API keys**. All data operations persist securely in browser `localStorage`.

---

## 🌟 Key Features

- **🌾 Multi-Farm & Field Management:** Manage multiple farms, acreage, soil types (alluvial, clay loam, red sandy loam), and irrigation networks (drip, sprinkler, canal).
- **🌱 Crop Lifecycle Tracking:** Full tracking across 7 stages (*planned*, *planted*, *growing*, *ready_for_harvest*, *harvested*, *sold*, *completed*).
- **💰 Financial Accounting (₹ INR):** Track incomes and expenses with category tagging, dynamic cascading dropdowns, payment modes (UPI, Cash, Bank Transfer), and real-time P&L summaries.
- **🐄 Livestock Management:** Track cattle, goats, and poultry with individual animal profiles, feeding records, medical treatments, upcoming vaccination schedules with alerts, and daily milk/egg production logs.
- **📊 Real-Time Analytics Dashboard:** Instant operational KPIs (total farms, acreage, active crops, livestock count) and financial KPIs (total income, expenses, net profit) calculated dynamically.
- **🤖 Deterministic AI Assistant & Predictors:**
  - Natural language AI assistant analyzing live local farm data (harvest schedules, finances, best-performing crops, animal counts, and weather).
  - Crop yield forecasting based on crop type, season, and acreage.
  - Crop profit estimation using historical market margins.
  - Expense anomaly detection flagging unusual costs.
  - Smart expense category auto-suggester based on description keywords.
- **📄 On-Demand Reports & Live Preview:** Generate financial statements and farm summary reports with live in-browser preview, CSV export, and PDF downloads.
- **🔔 Notification Center:** Slide-out drawer with automated alerts for harvest-ready crops, upcoming livestock vaccinations, and profit milestones.
- **🔄 One-Click Demo Reset:** Built-in safe reset control in the top navbar to instantly restore pristine sample data.

---

## 🚀 Quickstart (Run Locally)

The standalone demo runs directly from the `frontend` directory using Node.js:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The application opens directly into the dashboard with realistic preloaded demo data—no login required!

---

## ☁️ Deploy to Render (100% Free Static Site)

This project is optimized to deploy as a **Static Site** on [Render.com](https://render.com) at zero cost.

### Option A: Manual Setup via Render Dashboard
1. Go to your **[Render Dashboard](https://dashboard.render.com/)** and click **New +** > **Static Site**.
2. Connect this repository: `https://github.com/blackpanther272007-maker/AgriFlow-AI.git`.
3. Configure the build settings:
   - **Name:** `agriflow-ai`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Configure SPA Rewrite Rule** *(Required for page reloads on sub-routes)*:
   - Under **Redirects/Rewrites**, click **Add Rule**:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
5. Click **Create Static Site**.

### Option B: Blueprint Deployment
1. In Render Dashboard, click **New +** > **Blueprint**.
2. Connect `https://github.com/blackpanther272007-maker/AgriFlow-AI.git`.
3. Render will automatically read [`render.yaml`](./render.yaml) and configure the static site with SPA routing rules.
4. Click **Apply**.

---

## 🛠️ Architecture & Tech Stack

- **UI Framework:** React 19 + Vite
- **Styling:** Vanilla Tailwind CSS v4
- **Icons:** `lucide-react`
- **Charts:** `recharts`
- **Routing:** `react-router-dom`
- **Data Layer:** `localStorage` with isolated `agriflow_demo_*` keys and self-healing corruption recovery
- **Currency:** Indian Rupees (₹) with `en-IN` number formatting

---

## 📄 License
This project is licensed under the MIT License.
