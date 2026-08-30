"""
generate_data.py – Synthetic fleet trip dataset generator for EcoFleet.

Produces 5,000 physics-informed trip records where fuel_consumed_l is a
function of vehicle_type base rate, load, traffic, terrain, speed, weather
plus controlled Gaussian noise so that ML models can learn real correlations.

Usage:
    python -m app.data.generate_data          # from backend/
    python app/data/generate_data.py          # also works standalone
"""

from __future__ import annotations

import os
import pathlib

import numpy as np
import pandas as pd

# ── Constants ─────────────────────────────────────────────────────────
SEED = 42
N_RECORDS = 5_000

VEHICLE_TYPES = ["truck", "bus", "van", "ev_van"]
WEATHER_OPTIONS = ["clear", "rain", "fog"]

# Base fuel rate (litres per km) by vehicle type at empty load, flat road,
# free-flow traffic, clear weather, ~40 km/h.
BASE_RATES: dict[str, float] = {
    "truck": 0.30,
    "bus": 0.35,
    "van": 0.18,
    "ev_van": 0.06,  # electric equivalent litres
}

# Weight capacity per type (kg) – used to scale random loads.
MAX_LOAD: dict[str, int] = {
    "truck": 8_000,
    "bus": 6_000,
    "van": 3_000,
    "ev_van": 2_500,
}

# ── Physics-informed factor functions ────────────────────────────────

def load_factor(load_kg: np.ndarray, vehicle_type: np.ndarray) -> np.ndarray:
    """Heavier cargo → more fuel.  Factor is 1.0 at zero load, ~1.5 at max."""
    max_arr = np.array([MAX_LOAD[v] for v in vehicle_type], dtype=np.float64)
    ratio = load_kg / max_arr
    return 1.0 + 0.5 * ratio


def traffic_factor(traffic_index: np.ndarray) -> np.ndarray:
    """More congestion → more fuel (stop-go).  Factor 1.0–1.45."""
    return 1.0 + 0.45 * traffic_index


def terrain_factor(road_gradient: np.ndarray) -> np.ndarray:
    """Uphill increases fuel, downhill slightly decreases.  Factor ≈ 0.95–1.40."""
    return 1.0 + 4.0 * road_gradient  # gradient ∈ [-0.02, 0.10]


def speed_factor(avg_speed_kmph: np.ndarray) -> np.ndarray:
    """
    Fuel efficiency is best around 55 km/h.  Very slow (city crawl) or
    very fast (highway >90) burns more.  Quadratic bowl centred at 55.
    """
    return 1.0 + 0.0003 * (avg_speed_kmph - 55.0) ** 2


def weather_factor(weather: np.ndarray) -> np.ndarray:
    """Rain → +8 %, fog → +5 % (reduced visibility → cautious driving + AC)."""
    mapping = {"clear": 1.00, "rain": 1.08, "fog": 1.05}
    return np.array([mapping[w] for w in weather], dtype=np.float64)


# ── Main generator ───────────────────────────────────────────────────

def generate_dataset(n: int = N_RECORDS, seed: int = SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    # --- sample features --------------------------------------------------
    vehicle_type = rng.choice(VEHICLE_TYPES, size=n, p=[0.35, 0.20, 0.30, 0.15])
    vehicle_id = np.array(
        [f"TS{rng.integers(7, 12):02d}-{chr(rng.integers(65, 91))}{chr(rng.integers(65, 91))}-{rng.integers(1000, 9999)}"
         for _ in range(n)]
    )

    distance_km = rng.uniform(3.0, 60.0, size=n).round(1)
    avg_speed_kmph = rng.uniform(12.0, 95.0, size=n).round(1)
    load_kg = np.array(
        [rng.uniform(200, MAX_LOAD[v]) for v in vehicle_type]
    ).round(0)
    traffic_index = rng.uniform(0.0, 1.0, size=n).round(3)
    road_gradient = rng.uniform(-0.02, 0.10, size=n).round(4)
    weather = rng.choice(WEATHER_OPTIONS, size=n, p=[0.60, 0.25, 0.15])

    # --- physics-informed target ------------------------------------------
    base = np.array([BASE_RATES[v] for v in vehicle_type])
    fuel = (
        distance_km
        * base
        * load_factor(load_kg, vehicle_type)
        * traffic_factor(traffic_index)
        * terrain_factor(road_gradient)
        * speed_factor(avg_speed_kmph)
        * weather_factor(weather)
    )

    # add small Gaussian noise (σ ≈ 3 % of signal)
    noise = rng.normal(0.0, 0.03, size=n) * fuel
    fuel = np.clip(fuel + noise, 0.1, None).round(2)

    return pd.DataFrame({
        "vehicle_id": vehicle_id,
        "vehicle_type": vehicle_type,
        "distance_km": distance_km,
        "avg_speed_kmph": avg_speed_kmph,
        "load_kg": load_kg.astype(int),
        "traffic_index": traffic_index,
        "road_gradient": road_gradient,
        "weather": weather,
        "fuel_consumed_l": fuel,
    })


def main() -> None:
    df = generate_dataset()

    out_dir = pathlib.Path(__file__).resolve().parent
    out_path = out_dir / "fleet_trips.csv"
    df.to_csv(out_path, index=False)

    print(f"✅ Generated {len(df):,} trip records → {out_path}")
    print(f"   Columns : {list(df.columns)}")
    print(f"   fuel_consumed_l  mean={df['fuel_consumed_l'].mean():.2f}  "
          f"std={df['fuel_consumed_l'].std():.2f}  "
          f"min={df['fuel_consumed_l'].min():.2f}  "
          f"max={df['fuel_consumed_l'].max():.2f}")


if __name__ == "__main__":
    main()
