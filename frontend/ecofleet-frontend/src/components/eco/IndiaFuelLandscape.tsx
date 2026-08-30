import { useEffect, useState } from "react";
import {
  Calendar,
  Fuel,
  TrendingUp,
  Zap,
  ShieldCheck,
  AlertCircle,
  Truck,
  Building2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { getIndiaFuelContext, type IndiaFuelContextResponse } from "@/lib/api";

const FALLBACK_DATA: IndiaFuelContextResponse = {
  petrol_price_delhi: 102.12,
  diesel_price_delhi: 95.2,
  currency: "INR",
  unit: "per_litre",
  as_of: "2026-07-31",
  source: "PPAC (Petroleum Planning & Analysis Cell), Govt of India",
  ev_penetration_pct: 8.5,
  ev_penetration_prior_year_pct: 7.6,
  ev_target_2030_pct: 30,
  commercial_ev_target_2030_pct: 70,
  source_ev: "NITI Aayog / VAHAN, FY2025-26",
};

export function IndiaFuelLandscape() {
  const [data, setData] = useState<IndiaFuelContextResponse>(FALLBACK_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    getIndiaFuelContext()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLive(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("India fuel context fetch fallback to cached/static data:", err);
        if (isMounted) {
          setData(FALLBACK_DATA);
          setIsLive(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const yoyGrowth = (
    data.ev_penetration_pct - data.ev_penetration_prior_year_pct
  ).toFixed(1);

  return (
    <div className="mt-14 space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <Fuel className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold sm:text-xl text-foreground">
                India's Fuel & EV Landscape
              </h3>
              <p className="text-xs text-muted-foreground">
                Macro market context & electrification trajectory
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
                isLive
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-surface-2 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isLive ? "bg-primary animate-pulse" : "bg-muted-foreground",
                )}
              />
              {loading ? "Refreshing..." : isLive ? "Live PPAC Data" : "Cached Baseline"}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="size-3" /> As of {data.as_of}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Petrol Delhi */}
        <Reveal delay={60}>
          <div className="card-surface hover-lift relative h-full overflow-hidden p-5 border border-border/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Petrol · Delhi
              </span>
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                RSP
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-foreground">
                ₹{loading ? "..." : data.petrol_price_delhi.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">/ litre</span>
            </div>
            <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Building2 className="size-3 text-muted-foreground/70" /> Source: PPAC
            </p>
          </div>
        </Reveal>

        {/* Diesel Delhi */}
        <Reveal delay={120}>
          <div className="card-surface hover-lift relative h-full overflow-hidden p-5 border border-border/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Diesel · Delhi
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Commercial Fleet
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-foreground">
                ₹{loading ? "..." : data.diesel_price_delhi.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">/ litre</span>
            </div>
            <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Building2 className="size-3 text-muted-foreground/70" /> Source: PPAC
            </p>
          </div>
        </Reveal>

        {/* EV Penetration Trend */}
        <Reveal delay={180}>
          <div className="card-surface hover-lift relative h-full overflow-hidden p-5 border border-border/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                EV Penetration
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                <TrendingUp className="size-2.5" /> +{yoyGrowth}% YoY
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-primary">
                {loading ? "..." : <Counter value={data.ev_penetration_pct} decimals={1} suffix="%" />}
              </span>
              <span className="text-xs text-muted-foreground">national share</span>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Up from {data.ev_penetration_prior_year_pct}% prior year
            </p>
          </div>
        </Reveal>

        {/* 2030 National Targets */}
        <Reveal delay={240}>
          <div className="card-surface hover-lift relative h-full overflow-hidden p-5 border border-border/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                2030 EV Targets
              </span>
              <span className="rounded-md bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
                NITI Aayog
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="font-display text-2xl font-bold text-foreground">
                  {data.commercial_ev_target_2030_pct}%
                </span>
                <p className="text-[10px] text-muted-foreground">Commercial Target</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-muted-foreground">
                  {data.ev_target_2030_pct}%
                </span>
                <p className="text-[10px] text-muted-foreground">Overall Target</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Target for 2030 EV transition
            </p>
          </div>
        </Reveal>
      </div>

      {/* Strategic Framing Banner */}
      <Reveal delay={300}>
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/[0.08] via-surface-2 to-surface p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400">
                  <AlertCircle className="size-3.5" /> Fleet Reality
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  The Heavy Commercial Vehicle Challenge
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                NITI Aayog itself has assessed long-haul electric truck adoption as having{" "}
                <span className="font-semibold text-primary">"virtually not taken off"</span> in India
                — meaning fleet-level optimization remains essential even as EV transition continues.
              </p>
            </div>
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-1.5 text-[11px] text-muted-foreground/80 border-t sm:border-t-0 sm:border-l border-border/60 pt-2 sm:pt-0 sm:pl-4">
              <div className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-primary" /> Sources:
              </div>
              <span>{data.source.split(",")[0]}</span>
              <span>{data.source_ev}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
