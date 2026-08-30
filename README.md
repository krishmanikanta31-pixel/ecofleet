# EcoFleet — Quantum-Inspired Fuel Consumption Prediction & Green Fleet Optimization

> **Smart India Hackathon 2026 · Theme: Smart Vehicles**

---

## Problem Statement

Indian commercial and government fleets lose 12–18% of their fuel budgets to inefficient routing, unpredictable consumption patterns, and zero real-time emissions tracking. Existing fleet software delivers historical reports — not minute-by-minute predictive intelligence. EcoFleet closes that gap with AI-driven fuel forecasting and quantum-inspired route optimization.

## Architecture

| Layer | Stack |
|-------|-------|
| **Prediction Engine** | XGBoost regression model (R² = 0.989) trained on fleet telemetry — distance, speed, load, traffic, gradient, weather |
| **Quantum-Inspired Optimizer** | Fleet-route assignment formulated as a QUBO, solved via simulated annealing (`dwave-neal`) and benchmarked against a classical greedy baseline |
| **Backend** | FastAPI (Python), serving prediction, optimization, comparison, route-path, fleet-status, and India fuel-context endpoints |
| **Frontend** | React 19 + TanStack Router/Start, Tailwind CSS v4, Recharts — command-center dashboard with live fleet map, optimization comparisons, and government analytics portal |
| **Data Pipeline** | PPAC fuel price scraper with 6-hour refresh cycle, in-memory + JSON file cache, static NITI Aayog EV context |

## Key Results

- **10.21% fuel savings** — quantum-inspired simulated annealing vs classical greedy baseline on the same fleet-route assignment
- **R² = 0.989** — XGBoost fuel prediction accuracy on test data
- **−43.3% fuel consumption** — simulated EV transition scenario (42 vehicles switched to `ev_van`)
- **Real-time refresh** — 60-second telemetry cycle, live fleet map, minute-by-minute predictions

## Project Structure

```
ecofleet/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, all endpoints
│   │   ├── data/
│   │   │   ├── fleet_trips.csv     # Synthetic fleet telemetry dataset
│   │   │   ├── fuel_scraper.py     # PPAC price scraper + cache pipeline
│   │   │   ├── fuel_cache.json     # Cached Delhi fuel prices
│   │   │   └── generate_data.py    # Dataset generation script
│   │   ├── prediction/
│   │   │   ├── train_model.py      # XGBoost training pipeline
│   │   │   └── model.joblib        # Trained model artifact
│   │   └── optimization/
│   │       ├── qubo_assignment.py   # QUBO formulation + SA solver
│   │       ├── route_optimizer.py   # Corridor waypoint optimizer
│   │       └── benchmark.py        # SA vs greedy comparison
│   ├── docs/
│   │   └── api-contract.md         # Full API schemas & response shapes
│   └── requirements.txt
├── frontend/
│   └── ecofleet-frontend/          # React/TanStack app
│       ├── src/
│       │   ├── routes/             # Landing page, dashboard, govt portal
│       │   ├── components/eco/     # Domain components (fuel landscape, comparisons)
│       │   ├── components/ui/      # shadcn/ui primitives
│       │   └── lib/api.ts          # Typed API client
│       ├── package.json
│       └── tsconfig.json
└── .gitignore
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt

# Train the model (optional — pre-trained model.joblib is included)
python -m app.prediction.train_model

# Start the API server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend/ecofleet-frontend
npm install
npm run dev
```

The frontend dev server starts on `http://localhost:8080` and expects the backend at `http://localhost:8000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Predict fuel consumption for a single trip (XGBoost) |
| `POST` | `/optimize` | Fleet-route assignment via QUBO + simulated annealing |
| `POST` | `/compare` | Quantum-inspired SA vs classical greedy benchmark |
| `POST` | `/route-path` | Waypoint corridor optimization for a single vehicle |
| `GET`  | `/fleet-status` | Aggregated fleet overview metrics |
| `GET`  | `/india-fuel-context` | Live Delhi fuel prices (PPAC) + EV penetration data (NITI Aayog) |

Full request/response schemas → [`docs/api-contract.md`](backend/docs/api-contract.md)

## Team

<!-- TODO: Fill in your team name and problem statement ID before final submission -->

| | |
|---|---|
| **Team Name** | _\<your team name here\>_ |
| **Problem Statement ID** | _\<SIH problem statement ID here\>_ |

---

Built for Smart India Hackathon 2026 · Smart Vehicles
