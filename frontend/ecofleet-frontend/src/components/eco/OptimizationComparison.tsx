import { Atom, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Tone = "warning" | "info" | "primary";

const barTone: Record<Tone, string> = {
  warning: "bg-warning",
  info: "bg-info",
  primary: "bg-gradient-primary",
};

export const comparisonModes: {
  title: string;
  tone: Tone;
  best?: boolean;
  note: string;
  metrics: { label: string; value: number }[];
}[] = [
  {
    title: "Traditional Planning",
    tone: "warning",
    note: "Manual, static route sheets",
    metrics: [
      { label: "Fuel Used", value: 100 },
      { label: "Time", value: 100 },
      { label: "CO₂", value: 100 },
    ],
  },
  {
    title: "AI Optimization",
    tone: "info",
    note: "ML forecasting, sequential search",
    metrics: [
      { label: "Fuel Used", value: 90 },
      { label: "Time", value: 92 },
      { label: "CO₂", value: 90 },
    ],
  },
  {
    title: "Quantum-Inspired Optimization",
    tone: "primary",
    best: true,
    note: "QAOA-style annealing, parallel states",
    metrics: [
      { label: "Fuel Used", value: 82 },
      { label: "Time", value: 88 },
      { label: "CO₂", value: 82 },
    ],
  },
];

export function OptimizationComparison({
  showBanner = true,
  action,
}: {
  showBanner?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {comparisonModes.map((mode, i) => (
          <Reveal key={mode.title} delay={i * 110}>
            <div
              className={cn(
                "card-surface hover-lift relative h-full overflow-hidden p-6",
                mode.best && "glow-ring",
              )}
            >
              {mode.best && (
                <span className="absolute right-0 top-0 rounded-bl-xl bg-gradient-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Best
                </span>
              )}
              <div className="flex items-center gap-2">
                {mode.best ? (
                  <Atom className="size-5 text-primary" />
                ) : (
                  <Sparkles
                    className={cn(
                      "size-5",
                      mode.tone === "warning" ? "text-warning" : "text-info",
                    )}
                  />
                )}
                <h3 className="font-display text-base font-semibold">{mode.title}</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{mode.note}</p>

              <div className="mt-5 space-y-4">
                {mode.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-semibold tabular-nums">{m.value}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn("h-full rounded-full transition-all", barTone[mode.tone])}
                        style={{ width: `${m.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {showBanner && (
        <Reveal>
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-5 text-sm text-foreground/90">
            <strong className="font-display font-semibold text-primary">
              Quantum-Inspired Optimization gives the best overall performance
            </strong>{" "}
            — lower fuel usage, lower time, and lower emissions, validated across 250+ simulated
            fleet routes.
          </div>
        </Reveal>
      )}
      {action}
    </div>
  );
}
