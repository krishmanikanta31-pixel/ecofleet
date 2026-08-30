# EcoFleet API Contract

## Base URL
`http://localhost:8000`

---

## 1. POST /predict

Predict fuel consumption for a single trip using the trained XGBoost model.

### Request Body
```json
{
  "vehicle_id": "TS09-UA-2210",
  "vehicle_type": "truck",
  "distance_km": 18.6,
  "avg_speed_kmph": 38.0,
  "load_kg": 4200,
  "traffic_index": 0.65,
  "road_gradient": 0.02,
  "weather": "clear"
}
```

| Field           | Type   | Description                                      |
|-----------------|--------|--------------------------------------------------|
| vehicle_id      | string | Fleet registration / tag                         |
| vehicle_type    | string | One of: truck, bus, van, ev_van                  |
| distance_km     | float  | Trip distance in kilometres                      |
| avg_speed_kmph  | float  | Average speed during the trip (km/h)             |
| load_kg         | float  | Cargo / passenger load in kilograms              |
| traffic_index   | float  | 0 = free-flow, 1 = full congestion               |
| road_gradient   | float  | Average road gradient (0 = flat, + = uphill)     |
| weather         | string | One of: clear, rain, fog                         |

### Response Body (200 OK)
```json
{
  "vehicle_id": "TS09-UA-2210",
  "predicted_fuel_l": 11.38,
  "confidence_pct": 98.9,
  "feature_importance": [
    { "feature": "vehicle_type_van", "importance": 0.3483 },
    { "feature": "vehicle_type_ev_van", "importance": 0.2459 },
    { "feature": "distance_km", "importance": 0.1237 }
  ]
}
```

| Field              | Type   | Description                                          |
|--------------------|--------|------------------------------------------------------|
| vehicle_id         | string | Echo of input vehicle_id                             |
| predicted_fuel_l   | float  | Predicted fuel consumed in litres (2 dp)             |
| confidence_pct     | float  | Model confidence / R² expressed as percentage (1 dp) |
| feature_importance | array  | List of top feature importance objects (feature, importance) |

---

## 2. POST /optimize

Fleet-route multi-vehicle assignment formulated as a QUBO and solved via quantum-inspired Simulated Annealing (`dwave-neal`).

### Request Body
```json
{
  "routes": [
    {
      "route_id": "R1-Miyapur-Uppal",
      "distance_km": 28.4,
      "predicted_fuel_l": 9.2,
      "load_kg": 3500
    },
    {
      "route_id": "R2-Gachibowli-Secunderabad",
      "distance_km": 21.6,
      "predicted_fuel_l": 6.8,
      "load_kg": 1800
    },
    {
      "route_id": "R3-LBNagar-Ameerpet",
      "distance_km": 17.2,
      "predicted_fuel_l": 7.5,
      "load_kg": 4200
    }
  ],
  "vehicles": [
    {
      "vehicle_id": "TS09-UA-2210",
      "type": "truck",
      "capacity_kg": 8000
    },
    {
      "vehicle_id": "TS08-KB-7745",
      "type": "van",
      "capacity_kg": 3000
    },
    {
      "vehicle_id": "TS10-EV-4001",
      "type": "ev_van",
      "capacity_kg": 2500
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| routes | array | List of routes with route_id, distance_km, predicted_fuel_l, optional load_kg |
| vehicles | array | List of vehicles with vehicle_id, type (truck/bus/van/ev_van), capacity_kg |

### Response Body (200 OK)
```json
{
  "assignment": [
    {
      "route_id": "R1-Miyapur-Uppal",
      "vehicle_id": "TS09-UA-2210"
    },
    {
      "route_id": "R2-Gachibowli-Secunderabad",
      "vehicle_id": "TS08-KB-7745"
    },
    {
      "route_id": "R3-LBNagar-Ameerpet",
      "vehicle_id": "TS09-UA-2210"
    }
  ],
  "total_fuel_l": 17.78,
  "total_emissions_kg": 46.58,
  "compute_time_ms": 52.33,
  "method": "simulated_annealing"
}
```

| Field | Type | Description |
|-------|------|-------------|
| assignment | array | List of `{ route_id, vehicle_id }` assignment pairs |
| total_fuel_l | float | Total fleet fuel / energy consumed in litres (2 dp) |
| total_emissions_kg | float | Total fleet CO₂ emissions in kilograms (2 dp) |
| compute_time_ms | float | Solver execution time in milliseconds |
| method | string | Optimization method identifier (`simulated_annealing`) |

---

## 3. POST /compare

Compares the Quantum-Inspired Simulated Annealing QUBO solver against a Classical Greedy Baseline on the same fleet-route assignment problem.

### Request Body
```json
{
  "routes": [
    {
      "route_id": "R1-Miyapur-Uppal",
      "distance_km": 28.4,
      "predicted_fuel_l": 9.2,
      "load_kg": 3500
    },
    {
      "route_id": "R2-Gachibowli-Secunderabad",
      "distance_km": 21.6,
      "predicted_fuel_l": 6.8,
      "load_kg": 1800
    },
    {
      "route_id": "R3-LBNagar-Ameerpet",
      "distance_km": 17.2,
      "predicted_fuel_l": 7.5,
      "load_kg": 4200
    }
  ],
  "vehicles": [
    {
      "vehicle_id": "TS09-UA-2210",
      "type": "truck",
      "capacity_kg": 8000
    },
    {
      "vehicle_id": "TS08-KB-7745",
      "type": "van",
      "capacity_kg": 3000
    },
    {
      "vehicle_id": "TS10-EV-4001",
      "type": "ev_van",
      "capacity_kg": 2500
    }
  ]
}
```

### Response Body (200 OK)
```json
{
  "quantum_inspired": {
    "total_fuel_l": 17.78,
    "total_emissions_kg": 46.58,
    "compute_time_ms": 52.33
  },
  "classical_baseline": {
    "total_fuel_l": 20.15,
    "total_emissions_kg": 52.79,
    "compute_time_ms": 0.02
  },
  "fuel_saved_pct": 11.76
}
```

| Field | Type | Description |
|-------|------|-------------|
| quantum_inspired | object | Metrics from dwave-neal Simulated Annealing solver |
| classical_baseline | object | Metrics from Classical Greedy Best-Fit heuristic |
| fuel_saved_pct | float | Percentage fuel saved by quantum-inspired solver over baseline |

---

## 4. POST /route-path

Waypoint route corridor optimization for a single vehicle trip avoiding high-emission corridors.

### Request Body
```json
{
  "vehicle_id": "TS09-UA-2210",
  "origin": "Miyapur",
  "destination": "Uppal",
  "constraints": {
    "avoid_high_emission_zones": true,
    "max_time_min": 60
  }
}
```

### Response Body (200 OK)
```json
{
  "vehicle_id": "TS09-UA-2210",
  "optimized_route": [
    "Miyapur",
    "JNTU",
    "Kukatpally",
    "Ameerpet",
    "Secunderabad",
    "Uppal"
  ],
  "estimated_fuel_l": 5.5,
  "estimated_time_min": 42,
  "co2_saved_kg": 2.36
}
```

| Field | Type | Description |
|-------|------|-------------|
| vehicle_id | string | Vehicle identifier |
| optimized_route | array of string | Optimal sequence of waypoint landmarks |
| estimated_fuel_l | float | Estimated route fuel consumed |
| estimated_time_min | integer | Estimated trip duration in minutes |
| co2_saved_kg | float | Estimated CO₂ saved vs unoptimized corridor |

---

## 5. GET /fleet-status

Returns live high-level fleet command metrics.

### Response Body (200 OK)
```json
{
  "total_vehicles": 250,
  "active_vehicles": 218,
  "fuel_consumed_today_l": 3420,
  "predicted_tomorrow_l": 3180,
  "co2_today_tons": 8.9,
  "saving_potential_pct": 8.4
}
```

---

## 6. GET /india-fuel-context

Returns live scraped and cached Delhi retail selling prices for Petrol and Diesel from PPAC (Ministry of Petroleum & Natural Gas, Govt of India) combined with national EV penetration metrics and 2030 decarbonization targets from NITI Aayog / VAHAN.

### Response Body (200 OK)
```json
{
  "petrol_price_delhi": 102.12,
  "diesel_price_delhi": 95.20,
  "currency": "INR",
  "unit": "per_litre",
  "as_of": "2026-07-31",
  "source": "PPAC (Petroleum Planning & Analysis Cell), Govt of India",
  "ev_penetration_pct": 8.5,
  "ev_penetration_prior_year_pct": 7.6,
  "ev_target_2030_pct": 30.0,
  "commercial_ev_target_2030_pct": 70.0,
  "source_ev": "NITI Aayog / VAHAN, FY2025-26"
}
```

| Field | Type | Description |
|-------|------|-------------|
| petrol_price_delhi | float | Current retail selling price of petrol in Delhi (INR/litre) |
| diesel_price_delhi | float | Current retail selling price of diesel in Delhi (INR/litre) |
| currency | string | Currency denomination (`INR`) |
| unit | string | Fuel volume measurement unit (`per_litre`) |
| as_of | string | Effective date of the latest PPAC price revision (`YYYY-MM-DD`) |
| source | string | Primary fuel data source citation |
| ev_penetration_pct | float | Current national EV penetration percentage (8.5%) |
| ev_penetration_prior_year_pct | float | EV penetration percentage in previous financial year (7.6%) |
| ev_target_2030_pct | float | India's national overall EV target for 2030 (30%) |
| commercial_ev_target_2030_pct | float | India's commercial vehicle EV target for 2030 (70%) |
| source_ev | string | Official EV data and policy targets source citation |

