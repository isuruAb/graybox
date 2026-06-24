"use client";

import { StatCard } from "@/components/StatCard";
import { alertColumns } from "@/components/table/alertColumns";
import { DataTable } from "@/components/table/DataTable";
import { useAlerts } from "@/hooks/useAlerts";

export const AlertsDashboard = () => {
  const { data: alerts, isPending, isError, refetch } = useAlerts();

  if (isPending) {
    return <p className="text-dark-700">Loading alerts...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">Failed to load alerts.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="shad-primary-btn rounded-md px-4 py-2 text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="admin-stat">
        <StatCard
          type="cancelled"
          count={alerts?.criticalCount ?? 0}
          label="Critical alerts"
          icon={"/assets/icons/cancelled.svg"}
        />
        <StatCard
          type="pending"
          count={alerts?.openCount ?? 0}
          label="Open alerts"
          icon={"/assets/icons/pending.svg"}
        />
        <StatCard
          type="appointments"
          count={alerts?.resolvedCount ?? 0}
          label="Resolved alerts"
          icon={"/assets/icons/check.svg"}
        />
      </section>

      <DataTable columns={alertColumns} data={alerts?.documents ?? []} />
    </>
  );
};
