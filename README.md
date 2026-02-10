<div align="center">
<img width="1200" height="475" alt="CivicOS Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CivicOS - Autonomous City Agent (NYC Edition)

CivicOS is a simulation of an AI-driven city management system, currently monitoring **New York City**. It demonstrates a continuous autonomous loop where an AI agent monitoring real-world infrastructure points, models potential issues, acts on them, and evaluates the results.

## Phase: Transition to MVP
This project has transitioned from a pure frontend simulation to a full-stack MVP featuring:
- **Real-world Geography**: Monitoring 8 key NYC hotspots (Times Square, Grand Central, Brooklyn Bridge, JFK, etc.) via Google Maps.
- **Backend Core**: An Express server handling persistent AI decision cycles.
- **Advanced AI**: Powered by Google Gemini 2.0 Flash for causal analysis and intervention planning.

## Core Loop (The "OODA" Loop)

The agent operates on a continuous cycle:

1.  **SENSING**: Ingests real-time telemetry from NYC districts (Power, Traffic, Safety, Connectivity).
2.  **MODELING**: Uses **Google Gemini AI** to analyze the state, identify anomalies (like traffic congestion or power grid failures), and propose solutions.
3.  **ACTING**: Executes tool calls to resolve issues (e.g., `adjust_signals`, `dispatch_ems`, `broadcast_alert`).
4.  **EVALUATING**: Observes the post-action state to determine if the intervention was successful.

## Features

-   **Dashboard**: Real-time visualization of city metrics (Energy, Stability, Efficiency).
-   **Live NYC Map**: Interactive Google Maps integration with 8 critical hotspots.
-   **Camera Feed**: Low-latency simulated video feed from NYC assets.
-   **Terminal**: Live log of the agent's "thought process" and actions.
-   **Manual Override**: Ability for human operators to intervene to test the agent's resilience.

## Tech Stack

-   **Frontend**: React 19, Vite, TypeScript
-   **Backend**: Node.js, Express
-   **Maps**: Google Maps JS API (`@vis.gl/react-google-maps`)
-   **AI**: Google Gemini 2.0 Flash (`@google/genai`)
-   **Styling**: Vanilla CSS (Custom Design System)
-   **Icons**: Lucide React

## Run Locally

**Prerequisites:** Node.js 18+

### 1. Configure Environment
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 2. Startup Servers

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
# In the root directory
npm install
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`
