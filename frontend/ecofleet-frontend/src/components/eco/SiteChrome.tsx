import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Our Approach", href: "#approach" },
  { label: "Features", href: "#features" },
  { label: "Impact", href: "#impact" },
  { label: "Tech Stack", href: "#tech" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Live Demo", href: "#demo" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          to="/dashboard"
          className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        >
          View Live Dashboard
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-12">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <Logo />
          <nav className="flex flex-wrap items-center justify-center gap-5">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <Link to="/dashboard" className="text-sm font-semibold text-primary">
              Dashboard
            </Link>
          </nav>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Predictive fuel intelligence and quantum-inspired route optimization for India's fleets.
        </p>
        <p className="text-center text-xs text-muted-foreground/80">
          Smart India Hackathon 2026 · Smart Vehicles Theme · Problem Statement: Quantum-Inspired
          Fuel Consumption Prediction and Green Fleet Optimization
        </p>
      </div>
    </footer>
  );
}
