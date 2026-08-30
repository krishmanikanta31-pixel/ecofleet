/**
 * EcoFleet API Client — connects frontend to FastAPI backend at http://localhost:8000
 */

const API_BASE_URL = "http://localhost:8000";

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface PredictRequest {
  vehicle_id: string;
  vehicle_type: "truck" | "bus" | "van" | "ev_van";
  distance_km: number;
  avg_speed_kmph: number;
  load_kg: number;
  traffic_index: number;
  road_gradient: number;
  weather: "clear" | "rain" | "fog";
}

export interface PredictResponse {
  vehicle_id: string;
  predicted_fuel_l: number;
  confidence_pct: number;
  feature_importance: FeatureImportanceItem[];
}

export interface OptimizeRouteItem {
  route_id: string;
  distance_km: number;
  predicted_fuel_l: number;
  load_kg?: number;
}

export interface OptimizeVehicleItem {
  vehicle_id: string;
  type: string;
  capacity_kg: number;
}

export interface AssignmentItem {
  route_id: string;
  vehicle_id: string;
}

export interface OptimizeRequest {
  routes: OptimizeRouteItem[];
  vehicles: OptimizeVehicleItem[];
}

export interface OptimizeResponse {
  assignment: AssignmentItem[];
  total_fuel_l: number;
  total_emissions_kg: number;
  compute_time_ms: number;
  method: string;
}

export interface SolverMetrics {
  total_fuel_l: number;
  total_emissions_kg: number;
  compute_time_ms: number;
  assignment?: AssignmentItem[];
}

export interface CompareResponse {
  quantum_inspired: SolverMetrics;
  classical_baseline: SolverMetrics;
  fuel_saved_pct: number;
}

export interface RoutePathRequest {
  vehicle_id: string;
  origin: string;
  destination: string;
  constraints?: {
    avoid_high_emission_zones?: boolean;
    max_time_min?: number;
  };
}

export interface RoutePathResponse {
  vehicle_id: string;
  optimized_route: string[];
  estimated_fuel_l: number;
  estimated_time_min: number;
  co2_saved_kg: number;
}

/**
 * Predicts fuel consumption using the XGBoost model.
 */
export async function predictFuel(req: PredictRequest): Promise<PredictResponse> {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`POST /predict failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Solves fleet-route assignment via QUBO & Simulated Annealing.
 */
export async function optimizeFleet(req: OptimizeRequest): Promise<OptimizeResponse> {
  const res = await fetch(`${API_BASE_URL}/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`POST /optimize failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Compares Quantum-Inspired Simulated Annealing vs Classical Greedy Baseline.
 */
export async function compareSolvers(req: OptimizeRequest): Promise<CompareResponse> {
  const res = await fetch(`${API_BASE_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`POST /compare failed with status ${res.status}`);
  }
  return res.json();
}

/**
 * Calculates optimal corridor path for a vehicle.
 */
export async function getRoutePath(req: RoutePathRequest): Promise<RoutePathResponse> {
  const res = await fetch(`${API_BASE_URL}/route-path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`POST /route-path failed with status ${res.status}`);
  }
  return res.json();
}

export interface FleetStatusResponse {
  total_vehicles: number;
  active_vehicles: number;
  fuel_consumed_today_l: number;
  predicted_tomorrow_l: number;
  co2_today_tons: number;
  saving_potential_pct: number;
}

/**
 * Fetches current fleet status overview metrics.
 */
export async function getFleetStatus(): Promise<FleetStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/fleet-status`);
  if (!res.ok) {
    throw new Error(`GET /fleet-status failed with status ${res.status}`);
  }
  return res.json();
}

export interface IndiaFuelContextResponse {
  petrol_price_delhi: number;
  diesel_price_delhi: number;
  currency: string;
  unit: string;
  as_of: string;
  source: string;
  ev_penetration_pct: number;
  ev_penetration_prior_year_pct: number;
  ev_target_2030_pct: number;
  commercial_ev_target_2030_pct: number;
  source_ev: string;
}

/**
 * Fetches India fuel pricing and EV macro transition context.
 */
export async function getIndiaFuelContext(): Promise<IndiaFuelContextResponse> {
  const res = await fetch(`${API_BASE_URL}/india-fuel-context`);
  if (!res.ok) {
    throw new Error(`GET /india-fuel-context failed with status ${res.status}`);
  }
  return res.json();
}


