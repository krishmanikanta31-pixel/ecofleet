import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Atom,
  BarChart3,
  BatteryCharging,
  Bot,
  FileBarChart,
  Fuel,
  Landmark,
  Leaf,
  MapPin,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  Users,
  Zap,
} from "lucide-react";
import { Counter } from "@/components/eco/Counter";
import { Reveal } from "@/components/eco/Reveal";
import { OptimizationComparison } from "@/components/eco/OptimizationComparison";
import { IndiaFuelLandscape } from "@/components/eco/IndiaFuelLandscape";
import { Footer, Navbar } from "@/components/eco/SiteChrome";


const title = "EcoFleet — Quantum-Inspired Fuel Prediction & Green Fleet Optimization";
const description =
  "EcoFleet predicts fuel consumption minute-by-minute and uses quantum-inspired route optimization to cut fleet fuel use up to 14% and reduce CO₂ emissions.";

export const Route = createFileRoute("/")({
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
  component: Landing,
});

const heroStats = [
  { value: 14, suffix: "%", label: "Avg. Fuel Savings" },
  { value: 8.9, decimals: 1, suffix: " Tons", label: "CO₂ Tracked Daily" },
  { value: 250, suffix: "+", label: "Vehicles Monitored" },
  { value: 60, suffix: "s", label: "Refresh Rate" },
];

const painPoints = [
  {
    icon: Fuel,
    title: "No real-time fuel forecasting",
    text: "Managers learn about overconsumption weeks later, in monthly reports.",
  },
  {
    icon: MapPin,
    title: "Static, non-adaptive routing",
    text: "Routes are fixed at dispatch and ignore live traffic and emission zones.",
  },
  {
    icon: AlertTriangle,
    title: "Invisible driver inefficiency",
    text: "Harsh braking, idling and speeding go unmeasured and unrewarded.",
  },
  {
    icon: Leaf,
    title: "No live emissions accountability",
    text: "CO₂ output is estimated annually, never tracked against daily targets.",
  },
];

const features = [
  {
    icon: TrendingDown,
    title: "AI Fuel Prediction",
    text: "Forecasts tomorrow's fuel consumption using historical patterns, weather, traffic and load data — refreshed every minute.",
  },
  {
    icon: Atom,
    title: "Quantum Route Optimization",
    text: "Recomputes optimal routes in real time, balancing distance, fuel, time and emission zones.",
  },
  {
    icon: MapPin,
    title: "Live Fleet Map",
    text: "Tracks every vehicle's GPS position, route deviation and emission-zone exposure on an interactive city map.",
  },
  {
    icon: Leaf,
    title: "Carbon Intelligence",
    text: "Converts fuel data into CO₂ emissions automatically and tracks progress against monthly targets.",
  },
  {
    icon: Users,
    title: "Driver Eco Scoring",
    text: "Ranks drivers on braking, idling and acceleration behavior to reward efficient driving.",
  },
  {
    icon: AlertTriangle,
    title: "Smart Alerts & Diagnostics",
    text: "Flags abnormal fuel consumption, maintenance needs and route deviations the moment they happen.",
  },
  {
    icon: BatteryCharging,
    title: "EV Transition Planner",
    text: "Identifies which vehicles are best suited to switch to electric, with projected savings.",
  },
  {
    icon: Landmark,
    title: "Government Analytics Portal",
    text: "Gives regulators and city planners aggregated, anonymized fleet emissions data for policy-making.",
  },
];

const sdgs = [
  {
    n: "SDG 9",
    name: "Industry, Innovation & Infrastructure",
    text: "Quantum-inspired transport tech modernizes fleet infrastructure.",
  },
  {
    n: "SDG 11",
    name: "Sustainable Cities & Communities",
    text: "Cleaner urban fleets and emission-zone aware routing.",
  },
  {
    n: "SDG 12",
    name: "Responsible Consumption",
    text: "Every litre of diesel is forecast, optimized and accounted for.",
  },
  {
    n: "SDG 13",
    name: "Climate Action",
    text: "Direct, measurable CO₂ reduction across fleet operations.",
  },
];

const techStack = [
  {
    icon: BarChart3,
    title: "Frontend & Visualization",
    items: ["React", "Tailwind CSS", "Recharts", "Mapbox / Leaflet"],
    text: "Command-center UI with live charts and interactive fleet maps.",
  },
  {
    icon: Sparkles,
    title: "AI & Prediction Engine",
    items: ["Python", "scikit-learn", "TensorFlow"],
    text: "Fuel consumption models trained on historical fleet, traffic and weather data.",
  },
  {
    icon: Atom,
    title: "Quantum-Inspired Optimization",
    items: ["Simulated annealing", "QAOA-inspired heuristics", "Qiskit-style formulation"],
    text: "Route and load optimization solved on classical hardware.",
  },
  {
    icon: ShieldCheck,
    title: "Backend & Real-Time Data",
    items: ["Node.js / FastAPI", "WebSockets", "PostgreSQL"],
    text: "Minute-by-minute telemetry pipeline plus historical analytics store.",
  },
];

const futureScope = [
  {
    icon: Users,
    title: "Driver Behavior Analytics & Coaching",
    badge: "Roadmap",
    text: "In-cab telematics scoring, gentle real-time audio cues, and driver habit coaching to eliminate unnecessary idling, harsh braking, and aggressive acceleration.",
  },
  {
    icon: Target,
    title: "Fleet-Wide Sustainability Goal Tracking",
    badge: "Roadmap",
    text: "Milestone-driven Net-Zero ESG roadmaps, Scope 1-3 corporate emissions accounting, and science-based decarbonization trajectories.",
  },
  {
    icon: FileBarChart,
    title: "Automated Reporting & Insights",
    badge: "Roadmap",
    text: "Scheduled regulatory audit summaries, automated executive PDF exports, and one-click compliance filings for regional transport authorities.",
  },
  {
    icon: Bot,
    title: "AI Assistant for Fleet Queries",
    badge: "Roadmap",
    text: "Conversational fleet copilot powered by LLMs for natural language dispatch queries, instant telemetry lookup, and route anomaly explanations.",
  },
];

function SectionHeading({
  eyebrow,
  title: heading,
  text,
  center,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{heading}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{text}</p>}
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
        <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 opacity-40">
          <div className="orbit-slow size-[520px] rounded-full border border-primary/20">
            <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-primary" />
          </div>
          <div className="orbit-reverse absolute inset-16 rounded-full border border-primary/15">
            <span className="absolute -bottom-1 left-1/3 size-1.5 rounded-full bg-primary/70" />
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Zap className="size-3.5" /> Smart India Hackathon 2026 · Smart Vehicles
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-7 font-display text-[32px] font-bold leading-[1.12] sm:text-5xl lg:text-6xl">
              Predicting Fuel. Preventing Waste.{" "}
              <span className="text-gradient-primary">Powering a Greener India's Fleets.</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              EcoFleet uses quantum-inspired optimization and AI-driven fuel prediction to help
              commercial and government fleets cut fuel consumption by up to 14%, reduce CO₂
              emissions, and plan every route smarter — updated every single minute.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Explore Live Dashboard
              </Link>
              <a
                href="#approach"
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
              >
                See How It Works
              </a>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {heroStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="card-surface hover-lift p-5">
                  <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
                    <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="The Problem"
              title="Fleets burn fuel they never planned to burn."
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Indian commercial and government fleets — logistics operators, municipal services,
                and public transport — lose 12–18% of their fuel budgets to inefficient routing,
                unpredictable consumption patterns, poor visibility into driver behavior, and the
                complete absence of real-time emissions tracking.
              </p>
              <p>
                That waste hits twice: it inflates operating costs, and it enlarges India's
                transport-sector carbon footprint at a moment when the country has committed to
                aggressive climate targets.
              </p>
              <p className="text-foreground">
                Existing fleet software gives historical reports — not real-time, minute-by-minute
                predictive intelligence.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {painPoints.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="card-surface hover-lift flex gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-destructive/15 text-destructive">
                    <p.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* India Fuel & EV Landscape Pipeline Data */}
        <IndiaFuelLandscape />
      </section>


      {/* Approach */}
      <section id="approach" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Our Approach"
            title="A Quantum-Inspired Edge Over Traditional Optimization."
            text="Classical route and fuel optimization algorithms evaluate possibilities sequentially and get stuck in local optima on large, dynamic fleets. EcoFleet's quantum-inspired optimization — QAOA-style annealing simulated on classical hardware — explores many route and fuel-load combinations in parallel-weighted probability states, converging faster on near-global-optimal solutions for fuel, time and emissions simultaneously."
          />
        </Reveal>
        <div className="mt-12">
          <OptimizationComparison />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Features"
            title="Everything Your Fleet Command Center Needs."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 90}>
              <div className="card-surface hover-lift h-full p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="px-5 py-20">
        <div className="mx-auto max-w-7xl rounded-2xl border border-primary/25 bg-primary/[0.07] p-8 sm:p-12">
          <Reveal>
            <SectionHeading center eyebrow="Impact & SDG" title="Built for India's Climate Goals." />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { v: 14, suffix: "%", label: "fuel cost reduction per fleet", pre: "Up to" },
              {
                v: 8.5,
                decimals: 1,
                suffix: " Tons/yr",
                label: "CO₂ reduction per 42 vehicles transitioned to EV",
              },
              { v: 60, suffix: "s", label: "data refresh for true real-time accountability" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 110}>
                <div className="card-surface hover-lift p-6 text-center">
                  {s.pre && <p className="text-xs uppercase text-muted-foreground">{s.pre}</p>}
                  <p className="font-display text-4xl font-bold text-primary">
                    <Counter value={s.v} decimals={s.decimals ?? 0} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sdgs.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="card-surface hover-lift h-full p-5">
                  <span className="inline-flex rounded-md bg-info/15 px-2 py-1 text-xs font-semibold text-info">
                    {s.n}
                  </span>
                  <h3 className="mt-3 font-display text-sm font-semibold">{s.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section id="tech" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <SectionHeading center eyebrow="Tech Stack" title="What Powers EcoFleet." />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {techStack.map((t, i) => (
            <Reveal key={t.title} delay={i * 100}>
              <div className="card-surface hover-lift h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                    <t.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-base font-semibold">{t.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-foreground/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Future Scope / Roadmap */}
      <section id="roadmap" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Future Scope"
            title="Roadmap & Upcoming Platform Capabilities."
            text="Planned enhancements to expand EcoFleet into a full-lifecycle green fleet orchestration platform."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {futureScope.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 90}>
              <div className="card-surface hover-lift relative flex h-full flex-col justify-between p-6 border-dashed border-border/80">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
                      <item.icon className="size-5" />
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="demo" className="px-5 pb-20 pt-4">
        <Reveal>
          <div className="mx-auto max-w-5xl rounded-2xl bg-gradient-primary p-10 text-center shadow-glow-lg sm:p-14">
            <RouteIcon className="mx-auto size-8 text-primary-foreground" />
            <h2 className="mt-5 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              See EcoFleet in Action
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              Explore a live simulated fleet of 250 vehicles — real-time fuel prediction, quantum
              route optimization, and emissions tracking, all in one dashboard.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex rounded-xl bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              Launch Live Dashboard
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
