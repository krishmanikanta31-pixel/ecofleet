"""
qubo_assignment.py – Formulation and solvers for the Fleet-Route Assignment Problem.

Problem Formulation:
--------------------
Given a set of M routes R = {r_1, ..., r_M} and N vehicles V = {v_1, ..., v_N}:
- Each route r has distance_km, load_kg, and predicted_fuel_l.
- Each vehicle v has vehicle_type, capacity_kg, and an efficiency multiplier.
- Decision variables: binary x_{r, v} in {0, 1} indicating route r is assigned to vehicle v.

QUBO (Quadratic Unconstrained Binary Optimization) Formulation via dimod:
--------------------------------------------------------------------------
1. Objective: Minimize total fleet fuel consumption:
   H_obj = sum_{r} sum_{v} (predicted_fuel_l_r * efficiency_v) * x_{r, v}

2. Constraint 1 (Each route assigned to exactly one vehicle):
   H_assign = P_assign * sum_{r} ( sum_{v} x_{r, v} - 1 )^2

3. Constraint 2 (Vehicle capacity & load balancing penalty):
   H_capacity = P_cap * sum_{v} ( sum_{r} (load_kg_r / capacity_kg_v) * x_{r, v} - 1 )^2

Solved using:
- Quantum-Inspired: dwave-neal SimulatedAnnealingSampler
- Classical Baseline: Greedy Best-Fit Heuristic
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Literal
import dimod
import neal
import numpy as np


# Default multipliers based on vehicle category
DEFAULT_MULTIPLIERS = {
    "truck": 1.00,
    "bus": 1.15,
    "van": 0.60,
    "ev_van": 0.20,  # Electric equivalent energy
}

DEFAULT_CAPACITIES = {
    "truck": 8000.0,
    "bus": 6000.0,
    "van": 3000.0,
    "ev_van": 2500.0,
}


@dataclass
class Route:
    route_id: str
    distance_km: float
    predicted_fuel_l: float
    origin: str = "Origin"
    destination: str = "Destination"
    load_kg: float = 2000.0
    avg_speed_kmph: float = 40.0
    traffic_index: float = 0.5
    road_gradient: float = 0.01
    weather: str = "clear"


@dataclass
class Vehicle:
    vehicle_id: str
    vehicle_type: str = "truck"
    capacity_kg: float = 8000.0
    fuel_multiplier: float = 1.0

    def __post_init__(self):
        if self.fuel_multiplier == 1.0 and self.vehicle_type in DEFAULT_MULTIPLIERS:
            self.fuel_multiplier = DEFAULT_MULTIPLIERS[self.vehicle_type]


@dataclass
class AssignmentResult:
    method: str
    assignments: dict[str, str]  # route_id -> vehicle_id
    vehicle_routes: dict[str, list[str]]  # vehicle_id -> list[route_id]
    total_fuel_l: float
    total_distance_km: float
    total_time_min: int
    total_co2_kg: float
    total_cost_inr: int
    compute_time_ms: float
    is_valid: bool = True
    energy: float = 0.0


class FleetRouteOptimizer:
    """Formulates and solves the fleet-route assignment QUBO and greedy baselines."""

    def __init__(
        self,
        routes: list[Route],
        vehicles: list[Vehicle],
        penalty_assign: float = 50.0,
        penalty_cap: float = 30.0,
    ):
        self.routes = routes
        self.vehicles = vehicles
        self.penalty_assign = penalty_assign
        self.penalty_cap = penalty_cap

    def build_bqm(self) -> dimod.BinaryQuadraticModel:
        """Constructs the Binary Quadratic Model (BQM) representing the QUBO."""
        # Variables: x_{r_idx, v_idx}
        x = {
            (r_idx, v_idx): dimod.Binary(f"x_{r_idx}_{v_idx}")
            for r_idx in range(len(self.routes))
            for v_idx in range(len(self.vehicles))
        }

        # 1. Objective: minimize total fuel
        obj = dimod.quicksum(
            self.routes[r_idx].predicted_fuel_l
            * self.vehicles[v_idx].fuel_multiplier
            * x[(r_idx, v_idx)]
            for r_idx in range(len(self.routes))
            for v_idx in range(len(self.vehicles))
        )

        # 2. Constraint: Exactly one vehicle per route
        assign_penalty = dimod.quicksum(
            (dimod.quicksum(x[(r_idx, v_idx)] for v_idx in range(len(self.vehicles))) - 1) ** 2
            for r_idx in range(len(self.routes))
        )

        # 3. Capacity & load balancing penalty per vehicle
        cap_penalty = dimod.BinaryQuadraticModel(vartype=dimod.BINARY)
        for v_idx, v in enumerate(self.vehicles):
            cap = max(v.capacity_kg, 1.0)
            load_expr = dimod.quicksum(
                (self.routes[r_idx].load_kg / cap) * x[(r_idx, v_idx)]
                for r_idx in range(len(self.routes))
            )
            cap_penalty += (load_expr) ** 2

        bqm = obj + (self.penalty_assign * assign_penalty) + (self.penalty_cap * cap_penalty)
        return bqm

    def solve_simulated_annealing(
        self,
        num_reads: int = 100,
        num_sweeps: int = 1000,
        seed: int = 42,
    ) -> AssignmentResult:
        """Solves the QUBO using dwave-neal SimulatedAnnealingSampler."""
        start_time = time.perf_counter()
        bqm = self.build_bqm()

        sampler = neal.SimulatedAnnealingSampler()
        sampleset = sampler.sample(
            bqm,
            num_reads=num_reads,
            num_sweeps=num_sweeps,
            seed=seed,
        )

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        best_sample = sampleset.first.sample
        energy = sampleset.first.energy

        assignments: dict[str, str] = {}
        vehicle_routes: dict[str, list[str]] = {v.vehicle_id: [] for v in self.vehicles}

        for r_idx, r in enumerate(self.routes):
            assigned_v_idx = None
            for v_idx, v in enumerate(self.vehicles):
                var_name = f"x_{r_idx}_{v_idx}"
                if best_sample.get(var_name, 0) == 1:
                    assigned_v_idx = v_idx
                    break

            if assigned_v_idx is None:
                assigned_v_idx = min(
                    range(len(self.vehicles)),
                    key=lambda vi: self.vehicles[vi].fuel_multiplier
                )

            v_id = self.vehicles[assigned_v_idx].vehicle_id
            assignments[r.route_id] = v_id
            vehicle_routes[v_id].append(r.route_id)

        metrics = self._calculate_metrics(assignments)
        return AssignmentResult(
            method="simulated_annealing",
            assignments=assignments,
            vehicle_routes=vehicle_routes,
            total_fuel_l=metrics["fuel_l"],
            total_distance_km=metrics["distance_km"],
            total_time_min=metrics["time_min"],
            total_co2_kg=metrics["co2_kg"],
            total_cost_inr=metrics["cost_inr"],
            compute_time_ms=round(elapsed_ms, 2),
            energy=round(energy, 4),
        )

    def solve_greedy_heuristic(self) -> AssignmentResult:
        """Classical greedy baseline: Assigns routes sequentially based on remaining capacity."""
        start_time = time.perf_counter()

        assignments: dict[str, str] = {}
        vehicle_routes: dict[str, list[str]] = {v.vehicle_id: [] for v in self.vehicles}
        remaining_capacity = {v.vehicle_id: v.capacity_kg for v in self.vehicles}

        sorted_routes = sorted(self.routes, key=lambda r: r.load_kg, reverse=True)

        for r in sorted_routes:
            best_v = None
            for v in self.vehicles:
                if remaining_capacity[v.vehicle_id] >= r.load_kg:
                    best_v = v
                    break

            if best_v is None:
                best_v = max(self.vehicles, key=lambda v: remaining_capacity[v.vehicle_id])

            assignments[r.route_id] = best_v.vehicle_id
            vehicle_routes[best_v.vehicle_id].append(r.route_id)
            remaining_capacity[best_v.vehicle_id] -= r.load_kg

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        metrics = self._calculate_metrics(assignments)

        return AssignmentResult(
            method="classical_greedy_baseline",
            assignments=assignments,
            vehicle_routes=vehicle_routes,
            total_fuel_l=metrics["fuel_l"],
            total_distance_km=metrics["distance_km"],
            total_time_min=metrics["time_min"],
            total_co2_kg=metrics["co2_kg"],
            total_cost_inr=metrics["cost_inr"],
            compute_time_ms=round(elapsed_ms, 2),
        )

    def _calculate_metrics(self, assignments: dict[str, str]) -> dict[str, Any]:
        """Aggregates fuel, distance, time, CO2, and financial cost across assignments."""
        route_map = {r.route_id: r for r in self.routes}
        vehicle_map = {v.vehicle_id: v for v in self.vehicles}

        total_fuel = 0.0
        total_distance = 0.0
        total_time = 0.0

        for r_id, v_id in assignments.items():
            r = route_map[r_id]
            v = vehicle_map[v_id]
            fuel = r.predicted_fuel_l * v.fuel_multiplier
            total_fuel += fuel
            total_distance += r.distance_km
            time_m = (r.distance_km / max(r.avg_speed_kmph, 15.0)) * 60.0 * (1.0 + 0.3 * r.traffic_index)
            total_time += time_m

        total_co2 = total_fuel * 2.62
        total_cost = int(total_fuel * 95.5)

        return {
            "fuel_l": round(total_fuel, 2),
            "distance_km": round(total_distance, 1),
            "time_min": int(round(total_time)),
            "co2_kg": round(total_co2, 2),
            "cost_inr": total_cost,
        }


def solve_qubo_assignment(routes: list[Route], vehicles: list[Vehicle]) -> AssignmentResult:
    """Convenience helper for QUBO / Simulated Annealing assignment."""
    optimizer = FleetRouteOptimizer(routes, vehicles)
    return optimizer.solve_simulated_annealing()


def solve_fleet_assignment_qubo(routes: list[Route], vehicles: list[Vehicle]) -> AssignmentResult:
    """Alias for solve_qubo_assignment."""
    return solve_qubo_assignment(routes, vehicles)


def solve_greedy_heuristic(routes: list[Route], vehicles: list[Vehicle]) -> AssignmentResult:
    """Convenience helper for Classical Greedy baseline assignment."""
    optimizer = FleetRouteOptimizer(routes, vehicles)
    return optimizer.solve_greedy_heuristic()


def solve_fleet_assignment_greedy(routes: list[Route], vehicles: list[Vehicle]) -> AssignmentResult:
    """Alias for solve_greedy_heuristic."""
    return solve_greedy_heuristic(routes, vehicles)


def compare_fleet_solvers(routes: list[Route], vehicles: list[Vehicle]) -> dict[str, Any]:
    """Runs both solvers on the problem and calculates comparative savings."""
    optimizer = FleetRouteOptimizer(routes, vehicles)
    greedy_res = optimizer.solve_greedy_heuristic()
    qubo_res = optimizer.solve_simulated_annealing()

    fuel_saved = max(0.0, greedy_res.total_fuel_l - qubo_res.total_fuel_l)
    fuel_saved_pct = (fuel_saved / max(greedy_res.total_fuel_l, 0.01)) * 100.0

    return {
        "greedy_baseline": greedy_res,
        "quantum_inspired_sa": qubo_res,
        "fuel_saved_l": round(fuel_saved, 2),
        "fuel_saved_pct": round(fuel_saved_pct, 2),
        "co2_saved_kg": round(max(0.0, greedy_res.total_co2_kg - qubo_res.total_co2_kg), 2),
        "cost_saved_inr": max(0, greedy_res.total_cost_inr - qubo_res.total_cost_inr),
    }
