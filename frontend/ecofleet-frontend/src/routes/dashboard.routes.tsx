import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Clock,
  Compass,
  Fuel,
  Gauge,
  Leaf,
  Loader2,
  MapPin,
  Navigation,
  Radio,
  Route as RouteIcon,
  Sparkles,
  TrendingDown,
  Truck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/eco/Reveal";
import { Counter } from "@/components/eco/Counter";
import {
  ChartTooltip,
  Dropdown,
  Legend,
  PageHeading,
  Panel,
  chartAxis,
} from "@/components/eco/DashboardShell";
import {
  activeRoutes,
  pins,
  routeCompare,
  routeFuelByHour,
  toneBg,
  toneDot,
  toneText,
  vehicleComparison,
  zones,
} from "@/lib/eco-data";
import { getRoutePath, RoutePathResponse } from "@/lib/api";

const title = "EcoFleet Route Optimization & Live Fleet Map";
const description =
  "Real-time quantum-inspired route optimization, live telemetry tracking, vehicle efficiency comparisons, and peak-hour fuel savings analysis across Hyderabad.";

export const Route = createFileRoute("/dashboard/routes")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteOptimizationPage,
});

const routeKpis = [
  {
    icon: RouteIcon,
    label: "Active Corridors",
    value: "4",
    subtext: "Covering 14 zones",
    good: true,
  },
  {
    icon: Sparkles,
    label: "Quantum-Optimized",
    value: "75%",
    subtext: "3 of 4 active routes",
    good: true,
  },
  {
    icon: Fuel,
    label: "Avg. Route Fuel Saved",
    value: "11.8%",
    subtext: "Up to 14% on Corridor H-7",
    good: true,
  },
  {
    icon: AlertTriangle,
    label: "Active Deviations",
    value: "1",
    subtext: "Route H-24 near Shamshabad",
    good: false,
  },
];

function RouteOptimizationPage() {
  const [toggles, setToggles] = useState({
    traffic: true,
    routes: true,
    highEmission: false,
  });
  const [selectedRouteId, setSelectedRouteId] = useState<string>("H-7");
  const [isReoptimizing, setIsReoptimizing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [routePathData, setRoutePathData] = useState<RoutePathResponse | null>(null);

  const filteredRoutes = activeRoutes.filter(
    (r) => statusFilter === "All" || r.status.toLowerCase() === statusFilter.toLowerCase(),
  );

  const selectedRoute =
    activeRoutes.find((r) => r.id === selectedRouteId) ?? activeRoutes[0]!;

  // Fetch live route path optimization from POST /route-path
  const fetchRoutePath = async (routeObj = selectedRoute) => {
    setIsReoptimizing(true);
    try {
      const res = await getRoutePath({
        vehicle_id: routeObj.vehicle,
        origin: routeObj.from,
        destination: routeObj.to,
        constraints: {
          avoid_high_emission_zones: toggles.highEmission,
          max_time_min: 60,
        },
      });
      setRoutePathData(res);
    } catch (err) {
      console.warn("Route-path API error, using local fallback:", err);
      setRoutePathData({
        vehicle_id: routeObj.vehicle,
        optimized_route: [routeObj.from, "JNTU", "Kukatpally", "Ameerpet", "Secunderabad", routeObj.to],
        estimated_fuel_l: routeObj.fuel || 5.5,
        estimated_time_min: 42,
        co2_saved_kg: 2.36,
      });
    } finally {
      setIsReoptimizing(false);
    }
  };

  useEffect(() => {
    fetchRoutePath(selectedRoute);
  }, [selectedRouteId, toggles.highEmission]);

  return (
    <>
      <PageHeading
        title="Route Optimization & Live Map"
        subtitle="AI & Quantum-assisted fleet navigation · Hyderabad operational network"
        right={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <span className="live-dot size-2 rounded-full bg-primary" /> Live Telemetry · 4 active corridors
            </span>
          </div>
        }
      />

      {/* Top Route KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {routeKpis.map((kpi, i) => (
          <Reveal key={kpi.label} delay={i * 60}>
            <div className="card-surface hover-lift h-full p-4">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                  <kpi.icon className="size-4.5" />
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    kpi.good ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive",
                  )}
                >
                  {kpi.good ? "Optimal" : "Needs Action"}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{kpi.label}</p>
              <p className="font-display text-2xl font-bold">{kpi.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{kpi.subtext}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Live Map & Corridor Comparison */}
      <div className="grid gap-5 xl:grid-cols-5">
        <Panel
          id="route-map"
          title="Live Fleet Map"
          subtitle="Hyderabad zones · Real-time vehicle positions and green corridors"
          className="xl:col-span-3"
          right={
            <span className="inline-flex items-center gap-1.5 text-xs text-primary">
              <Radio className="size-3.5 animate-pulse text-primary" /> GPS Stream Active
            </span>
          }
        >
          <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-surface-2">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:38px_38px]" />

            {/* Route Corridors */}
            {toggles.routes && (
              <>
                {/* Corridor H-7 (Green - Miyapur to Uppal) */}
                <div className="absolute left-[12%] top-[28%] h-[3px] w-[58%] -rotate-6 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                {/* Corridor H-12 (Gachibowli to Secunderabad) */}
                <div className="absolute left-[28%] top-[55%] h-[3px] w-[42%] -rotate-12 rounded-full bg-info/80" />
                {/* Corridor H-19 (LB Nagar to Ameerpet) */}
                <div className="absolute left-[38%] top-[50%] h-[3px] w-[30%] -rotate-[38deg] rounded-full bg-warning/80" />
                {/* Corridor H-24 (Deviation near Shamshabad) */}
                <div className="absolute left-[44%] top-[58%] h-[3px] w-[32%] rotate-[35deg] rounded-full bg-destructive/85 border-dashed border-t-2" />
              </>
            )}

            {/* High Emission Zones Overlay */}
            {toggles.highEmission && (
              <>
                <div className="absolute right-[22%] top-[42%] size-28 rounded-full bg-destructive/20 blur-xl pointer-events-none" />
                <div className="absolute left-[36%] top-[30%] size-20 rounded-full bg-warning/20 blur-lg pointer-events-none" />
              </>
            )}

            {/* Traffic simulation indicators */}
            {toggles.traffic && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rounded-full border border-primary/40 bg-background/80 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
                  Moderate Traffic · Clean Corridor Flow: 92%
                </span>
              </div>
            )}

            {/* Location Pins */}
            {pins.map((p) => {
              const isSelected =
                (selectedRoute.from === p.name) || (selectedRoute.to === p.name);
              return (
                <button
                  key={p.name}
                  className="group absolute flex -translate-x-1/2 -translate-y-full cursor-pointer flex-col items-center transition-transform hover:scale-110"
                  style={{ top: p.top, left: p.left }}
                >
                  <MapPin
                    className={cn(
                      "size-5 transition-colors",
                      toneText[p.tone],
                      isSelected && "size-6 drop-shadow-[0_0_6px_var(--primary)]",
                    )}
                  />
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-background/90 text-muted-foreground border border-border",
                    )}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {zones.map((z) => (
                <span key={z.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("size-2 rounded-full", toneDot[z.tone])} /> {z.label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["traffic", "Show Traffic"],
                  ["routes", "Show Routes"],
                  ["highEmission", "High Emission Zones"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setToggles((t) => ({ ...t, [key]: !t[key] }))}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    toggles[key]
                      ? "border-primary/50 bg-primary/15 text-primary font-medium"
                      : "border-border bg-surface-2 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        {/* Selected Route Optimization Card with Live POST /route-path */}
        <Panel
          title={`Corridor ${selectedRoute.id} Optimization`}
          subtitle={`${selectedRoute.from} → ${selectedRoute.to} · Vehicle ${selectedRoute.vehicle}`}
          className="xl:col-span-2"
          right={
            <button
              onClick={() => fetchRoutePath(selectedRoute)}
              disabled={isReoptimizing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isReoptimizing ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              {isReoptimizing ? "Solving Path…" : "Optimize Corridor"}
            </button>
          }
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <p className="text-center text-xs font-semibold text-muted-foreground">
              Current Route (Normal)
            </p>
            <span className="rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
              {selectedRoute.saving > 0
                ? `Save ${selectedRoute.saving}% Fuel`
                : "Standard Route"}
            </span>
            <p className="text-center text-xs font-semibold text-primary">Quantum-Optimized</p>
          </div>

          <ul className="mt-4 space-y-2">
            {routeCompare.map((r) => (
              <li
                key={r.metric}
                className="grid grid-cols-3 items-center rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground text-xs">{r.current}</span>
                <span className="text-center text-xs font-medium text-foreground">{r.metric}</span>
                <span className="text-right font-semibold text-primary text-xs">{r.optimized}</span>
              </li>
            ))}
          </ul>

          {/* Live Waypoints from POST /route-path */}
          <div className="mt-4 rounded-xl border border-primary/40 bg-primary/10 p-3.5 text-xs text-foreground/90">
            <div className="flex items-center justify-between font-semibold text-primary">
              <div className="flex items-center gap-2">
                <Leaf className="size-4" />
                <span>Live Route Corridor Waypoints</span>
              </div>
              <span className="text-[10px] text-muted-foreground">POST /route-path</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              {(routePathData?.optimized_route || ["Miyapur", "JNTU", "Kukatpally", "Ameerpet", "Secunderabad", "Uppal"]).map((wp, idx, arr) => (
                <span key={wp} className="inline-flex items-center gap-1">
                  <span className="rounded-md border border-primary/30 bg-surface px-2 py-0.5 font-medium text-foreground">
                    {wp}
                  </span>
                  {idx < arr.length - 1 && <ArrowRight className="size-3 text-primary/70" />}
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="rounded-lg bg-background/60 p-2">
                <p className="text-muted-foreground">Est. Fuel</p>
                <p className="font-bold text-primary">{routePathData ? `${routePathData.estimated_fuel_l} L` : "5.5 L"}</p>
              </div>
              <div className="rounded-lg bg-background/60 p-2">
                <p className="text-muted-foreground">Trip Time</p>
                <p className="font-bold text-foreground">{routePathData ? `${routePathData.estimated_time_min}m` : "42m"}</p>
              </div>
              <div className="rounded-lg bg-background/60 p-2">
                <p className="text-muted-foreground">CO₂ Saved</p>
                <p className="font-bold text-primary">{routePathData ? `${routePathData.co2_saved_kg} kg` : "2.4 kg"}</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Active Corridors Telemetry Table */}
      <Panel
        id="active-corridors"
        title="Active Route Corridors"
        subtitle="Real-time vehicle telemetry, load status, and route fuel efficiency"
        right={
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter:</span>
            {["All", "Optimized", "Optimizing", "Normal", "Deviation"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs transition-colors",
                  statusFilter === f
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold">Corridor</th>
                <th className="pb-3 font-semibold">Vehicle</th>
                <th className="pb-3 font-semibold">Driver</th>
                <th className="pb-3 font-semibold">Route</th>
                <th className="pb-3 font-semibold">Load</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Fuel / Saving</th>
                <th className="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRoutes.map((r) => {
                const isSelected = r.id === selectedRouteId;
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "transition-colors hover:bg-surface-2",
                      isSelected && "bg-primary/5",
                    )}
                  >
                    <td className="py-3 font-bold">{r.id}</td>
                    <td className="py-3 font-mono">{r.vehicle}</td>
                    <td className="py-3">{r.driver}</td>
                    <td className="py-3 text-muted-foreground">
                      {r.from} → {r.to}
                    </td>
                    <td className="py-3">{r.load}</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          toneBg[r.tone],
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", toneDot[r.tone])} />
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-primary">
                      {r.fuel} L
                      {r.saving > 0 && (
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          (-{r.saving}%)
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setSelectedRouteId(r.id)}
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        {isSelected ? "Inspecting" : "Inspect"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Vehicle Comparison & Peak-Hour Fuel Consumption */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          id="vehicle-comparison"
          title="Vehicle Class Efficiency Benchmark"
          subtitle="Comparative telemetry: Light Trucks vs Vans vs Heavy Commercial Vehicles"
          right={<Dropdown label="Today" />}
        >
          <div className="space-y-3">
            {vehicleComparison.map((v) => (
              <div
                key={v.vehicle}
                className={cn(
                  "rounded-xl border border-border bg-surface-2 p-3.5 transition-colors",
                  v.best && "border-primary/50 bg-primary/5",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{v.vehicle}</span>
                    <span className="text-xs text-muted-foreground">({v.type})</span>
                  </div>
                  {v.best && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Best Performer
                    </span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-semibold">{v.distance}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fuel</p>
                    <p className="font-semibold text-primary">{v.fuel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Efficiency</p>
                    <p className="font-semibold">{v.efficiency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saving</p>
                    <p className="font-semibold text-primary">{v.saving}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          id="peak-hours"
          title="Hourly Fleet Fuel Consumption"
          subtitle="Normal unoptimized routing (Litres) vs Quantum-Optimized routing across operational hours"
          right={<Dropdown label="Hourly Aggregation" />}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeFuelByHour}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" {...chartAxis} tickFormatter={(h) => `${h}:00`} />
                <YAxis {...chartAxis} width={38} domain={[40, 120]} />
                {ChartTooltip()}
                <Bar dataKey="normal" name="Unoptimized" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimized" name="Quantum-Optimized" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Legend
            items={[
              ["Unoptimized Baseline", "warning"],
              ["Quantum-Optimized", "primary"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}
