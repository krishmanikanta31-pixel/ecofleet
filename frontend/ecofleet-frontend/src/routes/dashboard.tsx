import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/eco/DashboardShell";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
