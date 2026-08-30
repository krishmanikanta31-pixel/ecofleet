import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  withTagline = true,
  className,
}: {
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <Leaf className="size-5 text-primary-foreground" strokeWidth={2.4} />
        <span className="absolute inset-0 rounded-xl border border-primary/40" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-tight">EcoFleet</span>
        {withTagline && (
          <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Smart Fleet. Quantum Future.
          </span>
        )}
      </span>
    </div>
  );
}
