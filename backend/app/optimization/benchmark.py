"""
benchmark.py – Benchmark script comparing Classical Greedy vs. Quantum-Inspired
Simulated Annealing QUBO optimization for fleet-route assignment.

Usage:
    python -m app.optimization.benchmark
"""

from __future__ import annotations

import json
from .qubo_assignment import (
    FleetRouteOptimizer,
    Route,
    Vehicle,
    compare_fleet_solvers,
)


def create_sample_fleet() -> tuple[list[Route], list[Vehicle]]:
    """Creates a sample multi-vehicle, multi-route fleet scenario in Hyderabad."""
    routes = [
        Route("R1-Miyapur-Uppal", "Miyapur", "Uppal", distance_km=28.4, load_kg=3500, predicted_fuel_l=9.2),
        Route("R2-Gachibowli-Secunderabad", "Gachibowli", "Secunderabad", distance_km=21.6, load_kg=1800, predicted_fuel_l=6.8),
        Route("R3-LBNagar-Ameerpet", "LB Nagar", "Ameerpet", distance_km=17.2, load_kg=4200, predicted_fuel_l=7.5),
        Route("R4-Kukatpally-Shamshabad", "Kukatpally", "Shamshabad", distance_km=36.0, load_kg=2200, predicted_fuel_l=11.4),
        Route("R5-Charminar-Madhapur", "Charminar", "Madhapur", distance_km=19.8, load_kg=1400, predicted_fuel_l=5.9),
        Route("R6-JubileeHills-Uppal", "Jubilee Hills", "Uppal", distance_km=22.5, load_kg=2900, predicted_fuel_l=7.1),
    ]

    vehicles = [
        Vehicle("TS09-UA-2210", "truck", capacity_kg=8000, fuel_multiplier=1.00),
        Vehicle("TS08-KB-7745", "van", capacity_kg=3000, fuel_multiplier=0.60),
        Vehicle("TS11-JC-1902", "truck", capacity_kg=8000, fuel_multiplier=1.05),
        Vehicle("TS10-EV-4001", "ev_van", capacity_kg=2500, fuel_multiplier=0.20),
    ]

    return routes, vehicles


def run_benchmark():
    print("=================================================================")
    print("  EcoFleet Quantum-Inspired vs. Classical Optimization Benchmark ")
    print("=================================================================\n")

    routes, vehicles = create_sample_fleet()
    print(f"Problem Size: {len(routes)} Routes across {len(vehicles)} Vehicles")
    print(f"Total Route Distance: {sum(r.distance_km for r in routes):.1f} km")
    print(f"Total Cargo Load: {sum(r.load_kg for r in routes):,.0f} kg\n")

    results = compare_fleet_solvers(routes, vehicles)

    greedy = results["greedy_baseline"]
    sa = results["quantum_inspired_sa"]

    print("-----------------------------------------------------------------")
    print(f"1. Classical Greedy Baseline:")
    print(f"   - Total Fuel Consumed : {greedy.total_fuel_l:.2f} L")
    print(f"   - Total CO2 Emissions : {greedy.total_co2_kg:.2f} kg")
    print(f"   - Total Fuel Cost     : ₹ {greedy.total_cost_inr:,}")
    print(f"   - Total Travel Time   : {greedy.total_time_min} mins")
    print(f"   - Solver Execution    : {greedy.compute_time_ms:.2f} ms")
    print(f"   - Assignments         : {greedy.assignments}")

    print("\n-----------------------------------------------------------------")
    print(f"2. Quantum-Inspired Simulated Annealing (dwave-neal):")
    print(f"   - Total Fuel Consumed : {sa.total_fuel_l:.2f} L")
    print(f"   - Total CO2 Emissions : {sa.total_co2_kg:.2f} kg")
    print(f"   - Total Fuel Cost     : ₹ {sa.total_cost_inr:,}")
    print(f"   - Total Travel Time   : {sa.total_time_min} mins")
    print(f"   - Solver Execution    : {sa.compute_time_ms:.2f} ms")
    print(f"   - Assignments         : {sa.assignments}")
    print(f"   - Minimum BQM Energy  : {sa.energy:.4f}")

    print("\n=================================================================")
    print(f"  Optimization Comparison Summary:")
    print(f"  * Fuel Saved           : {results['fuel_saved_l']:.2f} L")
    print(f"  * Fuel Savings Rate    : {results['fuel_saved_pct']:.2f} %")
    print(f"  * CO2 Reduced          : {results['co2_saved_kg']:.2f} kg")
    print(f"  * Cost Saved           : ₹ {results['cost_saved_inr']:,}")
    print("=================================================================\n")


if __name__ == "__main__":
    run_benchmark()
