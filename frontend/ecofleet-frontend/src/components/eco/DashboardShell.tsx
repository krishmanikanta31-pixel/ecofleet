import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Atom,
  BatteryCharging,
  Bell,
  FlaskConical,
  Landmark,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Route as RouteIcon,
  Search,
  Settings,
  Sparkles,
  TrendingDown,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

type NavItem = {
  icon: typeof Leaf;
  label: string;
  to?: "/dashboard" | "/dashboard/routes" | "/dashboard/govt";
  hash?: string;
  badge?: string;
  message?: string;
  action?: "logout";
};

const sidebarGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Main Modules",
    items: [
      { icon: LayoutDashboard, label: "Main Dashboard", to: "/dashboard" },
      { icon: TrendingDown, label: "AI Fuel Prediction", to: "/dashboard", hash: "fuel-prediction" },
      { icon: RouteIcon, label: "Route Optimization", to: "/dashboard/routes" },
      { icon: Atom, label: "Quantum Optimization", to: "/dashboard", hash: "quantum-optimization" },
      { icon: AlertTriangle, label: "Alerts & Diagnostics", to: "/dashboard", hash: "alerts-diagnostics" },
    ],
  },
  {
    label: "Sustainability",
    items: [
      { icon: Leaf, label: "Carbon Intelligence", to: "/dashboard", hash: "carbon-intelligence" },
      { icon: BatteryCharging, label: "EV Transition", to: "/dashboard", hash: "ev-transition" },
    ],
  },
  {
    label: "Government Portal",
    items: [
      { icon: Landmark, label: "Government Analytics", to: "/dashboard/govt" },
      { icon: FlaskConical, label: "What-If Simulator", to: "/dashboard/govt", hash: "city-emissions" },
    ],
  },
  {
    label: "Others",
    items: [
      {
        icon: Settings,
        label: "Settings",
        badge: "Coming soon",
        message: "Fleet Settings: Telematics API keys, sensor calibration thresholds, and webhooks configuration coming in v2.1.",
      },
      {
        icon: LogOut,
        label: "Logout",
        action: "logout",
      },
    ],
  },
];

const topTabs = [
  { label: "Main Dashboard", to: "/dashboard" as const },
  { label: "Route Optimization", to: "/dashboard/routes" as const },
  { label: "Government Analytics", to: "/dashboard/govt" as const },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll to hash on page change or hash click
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [pathname]);

  const handleNavClick = (item: NavItem) => {
    setMobileMenuOpen(false);

    if (item.action === "logout") {
      toast.info("Demo Sandbox Active", {
        description: "EcoFleet is operating in interactive demo mode. Returning to landing page...",
      });
      setTimeout(() => {
        navigate({ to: "/" });
      }, 900);
      return;
    }

    if (item.badge === "Coming soon" || (!item.to && item.message)) {
      toast.info(item.label, {
        description: item.message || `${item.label} module is currently in development and coming soon.`,
        icon: <Sparkles className="size-4 text-primary" />,
      });
      return;
    }

    if (item.to) {
      if (item.hash) {
        if (pathname === item.to || (item.to === "/dashboard" && (pathname === "/dashboard" || pathname === "/dashboard/"))) {
          const el = document.getElementById(item.hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", `${item.to}#${item.hash}`);
            return;
          }
        }
        navigate({ to: item.to, hash: item.hash });
      } else {
        navigate({ to: item.to });
      }
    }
  };

  const renderNavLinks = () => (
    <nav className="flex-1 space-y-6">
      {sidebarGroups.map((group) => (
        <div key={group.label}>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group.label}
          </p>
          <ul className="mt-2 space-y-1">
            {group.items.map((item) => {
              const isCurrentPage =
                (item.to === "/dashboard" && (pathname === "/dashboard" || pathname === "/dashboard/")) ||
                (item.to === "/dashboard/routes" && pathname === "/dashboard/routes") ||
                (item.to === "/dashboard/govt" && pathname === "/dashboard/govt");

              const active = isCurrentPage && !item.hash;

              const cls = cn(
                "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-all",
                active
                  ? "bg-primary/15 font-medium text-primary shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.badge === "Coming soon" && "opacity-85",
              );

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={cls}
                  >
                    <item.icon className={cn("size-4 shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mt-7 flex-1">
          {renderNavLinks()}
        </div>
        <div className="mt-6 rounded-xl border border-primary/35 bg-primary/10 p-4">
          <Leaf className="size-4 text-primary" />
          <p className="mt-2 font-display text-sm font-semibold text-primary">
            Together for a Greener Tomorrow
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your fleet saved 412 L of fuel this week.
          </p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 flex h-full w-72 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-6 flex-1">
              {renderNavLinks()}
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-foreground lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" />
            </button>

            <Link to="/" className="lg:hidden">
              <Logo withTagline={false} />
            </Link>

            <div className="relative ml-auto hidden w-full max-w-sm sm:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search vehicles, drivers, routes…"
                className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
              />
            </div>

            <button
              onClick={() =>
                toast.info("Active Notifications", {
                  description: "4 critical telemetry alerts logged in the last hour.",
                })
              }
              className="relative ml-auto grid size-9 place-items-center rounded-lg border border-border bg-surface transition-colors hover:border-primary/50 sm:ml-0"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                4
              </span>
            </button>

            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-1.5">
              <span className="grid size-7 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                VK
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-xs font-semibold">Vamsi Krishna</span>
                <span className="block text-[10px] text-muted-foreground">Fleet Manager</span>
              </span>
            </div>
          </div>

          {/* Top Tab Switcher */}
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
            {topTabs.map((t) => {
              const active =
                (t.to === "/dashboard" && (pathname === "/dashboard" || pathname === "/dashboard/")) ||
                (t.to === "/dashboard/routes" && pathname.startsWith("/dashboard/routes")) ||
                (t.to === "/dashboard/govt" && pathname.startsWith("/dashboard/govt"));

              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border-primary/60 bg-primary/15 font-semibold text-primary shadow-glow"
                      : "border-border bg-surface-2 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="space-y-5 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeading({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-xl font-bold">{title}</h1>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {right ?? (
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          <span className="live-dot size-2 rounded-full bg-primary" /> Live · refreshed 12s ago
        </span>
      )}
    </div>
  );
}

export function Panel({
  id,
  title: heading,
  subtitle,
  right,
  className,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={cn("card-surface p-5 scroll-mt-24 transition-all", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold">{heading}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function Dropdown({ label }: { label: string }) {
  return (
    <select
      defaultValue={label}
      className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/60"
    >
      <option>{label}</option>
      <option>Last Week</option>
      <option>Last Month</option>
    </select>
  );
}

export const chartAxis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

export function ChartTooltip() {
  return (
    <Tooltip
      contentStyle={{
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        fontSize: 12,
        color: "var(--popover-foreground)",
      }}
      labelStyle={{ color: "var(--muted-foreground)" }}
    />
  );
}

export function Legend({
  items,
}: {
  items: [string, "primary" | "muted" | "warning" | "info"][];
}) {
  const dot = {
    primary: "bg-primary",
    muted: "bg-primary/45",
    warning: "bg-warning",
    info: "bg-info",
  };
  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {items.map(([label, tone]) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={cn("h-1.5 w-5 rounded-full", dot[tone])} /> {label}
        </span>
      ))}
    </div>
  );
}
