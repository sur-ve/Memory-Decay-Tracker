# Skill Decay Lab

An interactive full-stack web application designed to help learners track, visualize, and optimize their skill retention using cognitive psychology principles. The platform maps user learning data against the historic Ebbinghaus forgetting curve, deploying an exponential decay mathematical model to predict exactly when knowledge will fade. By computing dynamic memory strength half-lives, the system generates real-time retention forecasts and priority heatmaps, empowering users to build data-driven spaced repetition schedules and prevent knowledge loss.

## 💻 Tech Stack

**Frontend**
* **React (v19.2.4):** UI component framework utilizing modern React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) for optimized state management and calculated data memoization.
* **Vite (v8.0.1):** High-performance build tool leveraging ES modules and Hot Module Replacement (HMR) for instant development feedback.
* **Recharts (v3.8.1):** Charting library used to compile smooth line chart projections and complex data visualizations.

**Backend**
* **Express (v4.21.2):** Lightweight Node.js web framework handling operational routing and request validation.
* **CORS (v2.8.5):** Cross-Origin Resource Sharing middleware facilitating secure data transitions between the frontend and server environments.

**Data Persistence**
* **XLSX (v0.18.5):** Spreadsheet parsing engine utilized to serialize, read, and write skill objects to a server-side Excel workbook database (`skills.xlsx`).

## ✨ Key Features

* **Mathematical Memory Modeling:** Applies the specific exponential decay function to determine current retention ratios based on days elapsed and memory strength indicators.
* **Dynamic Analytics Dashboard:** Includes a tracking grid highlighting overall tracked assets, low-retention warning counts, and automated recommendations for the next skill requiring urgent review.
* **Priority Heatmap Table:** Automatically aggregates and sorts skills by memory urgency. Displays predictive retention values across a staggered timeline (+3, +7, +14, +30, +60 days) styled with color-coded "heat pills" and automated "Review" badges for scores of 20% or lower.
* **Dual Line Chart Engine:**
    * *Forecast Chart:* Simulates a forward-looking 30-day degradation trajectory assuming no future practice sessions take place.
    * *Historical Learning Path:* Reconstructs a 90-day interactive history tracking memory spikes—showing retention recovering instantly to 100% upon a practice session before resuming natural decay.
* **Robust Log Management Interface:** Incorporates full CRUD support alongside a 5-tier mastery slider spanning from "Glanced" (0.05) to "Mastered" (1.0) to anchor base retention weights.
* **60-Second Execution Tick:** Runs background interval ticks on the client application to ensure visual retention percentages adjust seamlessly in real-time.

## 🗄️ Architecture & Data Model

The client interfaces with the server using standard proxy routing (`/api` mapped to port `3001`). Data validation ensures required names are cleanly trimmed and mastery bounds strictly adhere to the designated limits. 

### The Skill Schema Structure:
```json
{
  "id": 10351,
  "name": "React Hooks",
  "strength": 0.40,
  "practicedAt": 1774345732000,
  "practiceHistory": [1773913732000, 1774345732000]
}
```

## API Endpoints

   * GET /api/skills — Retrieves all tracked skills from the Excel workbook.
   * POST /api/skills — Creates a new skill entry and appends the calculated ID increment.
   * PATCH /api/skills/:id — Updates specified skill properties or practice logs.
   * DELETE /api/skills/:id — Purges the selected record from the system registry.

## 🚀 Setup Instructions
Follow these instructions to spin up the local development environment:
Prerequisites

Ensure you have Node.js (v18+ recommended) installed on your system.

# 1. Repository Installation

Clone the repository and jump straight into the root working directory:

```bash
git clone [https://github.com/YourUsername/skill-decay-lab.git](https://github.com/YourUsername/skill-decay-lab.git)
cd skill-decay-lab
```

# 2. Backend Infrastructure Setup

Navigate to the server directory, deploy dependencies, and kickstart the backend node process:
```bash
cd server
npm install
npm start
```

# 3. Frontend Interface Setup

Open a second terminal window, move into the client architecture path, fetch packages, and run Vite's dev server:

```bash
cd client
npm install
npm run dev
```
