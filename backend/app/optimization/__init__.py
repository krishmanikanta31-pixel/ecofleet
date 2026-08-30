"""
EcoFleet Optimization Package — QUBO formulation, Quantum-Inspired
Simulated Annealing (dwave-neal), and Classical Greedy Baselines.
"""

from .qubo_assignment import (
    FleetRouteOptimizer,
    Route,
    Vehicle,
    AssignmentResult,
    solve_qubo_assignment,
    solve_greedy_heuristic,
    solve_fleet_assignment_qubo,
    solve_fleet_assignment_greedy,
    compare_fleet_solvers,
)
from .route_optimizer import (
    HyderabadRoadNetwork,
    optimize_corridor_route,
    compare_corridor_route,
)

__all__ = [
    "FleetRouteOptimizer",
    "Route",
    "Vehicle",
    "AssignmentResult",
    "solve_qubo_assignment",
    "solve_greedy_heuristic",
    "solve_fleet_assignment_qubo",
    "solve_fleet_assignment_greedy",
    "compare_fleet_solvers",
    "HyderabadRoadNetwork",
    "optimize_corridor_route",
    "compare_corridor_route",
]
