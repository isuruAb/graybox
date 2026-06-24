"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { StatCard } from "@/components/StatCard";
import { alertColumns } from "@/components/table/alertColumns";
import { DataTable } from "@/components/table/DataTable";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useAlertStats,
  useAlerts,
  useAlertsRealtime,
} from "@/hooks/useAlerts";

export const AlertsDashboard = () => {
  const [patientName, setPatientName] = useState("");
  const debouncedPatientName = useDebounce(patientName, 300).trim();

  const {
    data: stats,
    isPending: isStatsPending,
    isError: isStatsError,
    refetch: refetchStats,
  } = useAlertStats();

  const {
    data: alerts,
    isPending: isAlertsPending,
    isFetching: isAlertsFetching,
    isError: isAlertsError,
    refetch: refetchAlerts,
  } = useAlerts(debouncedPatientName);

  useAlertsRealtime();

  if (isStatsPending) {
    return <p className="text-dark-700">Loading alerts...</p>;
  }

  if (isStatsError) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">Failed to load alerts.</p>
        <button
          type="button"
          onClick={() => refetchStats()}
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
          count={stats?.criticalCount ?? 0}
          label="Critical alerts"
          icon={"/assets/icons/cancelled.svg"}
        />
        <StatCard
          type="pending"
          count={stats?.openCount ?? 0}
          label="Open alerts"
          icon={"/assets/icons/pending.svg"}
        />
        <StatCard
          type="appointments"
          count={stats?.resolvedCount ?? 0}
          label="Resolved alerts"
          icon={"/assets/icons/check.svg"}
        />
      </section>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dark-600" />
        <Input
          type="search"
          value={patientName}
          onChange={(event) => setPatientName(event.target.value)}
          placeholder="Search by patient name..."
          className="shad-input w-full pl-10"
        />
      </div>

      {isAlertsError ? (
        <div className="space-y-4">
          <p className="text-red-400">Failed to load alerts.</p>
          <button
            type="button"
            onClick={() => refetchAlerts()}
            className="shad-primary-btn rounded-md px-4 py-2 text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      ) : isAlertsPending ? (
        <p className="text-dark-700">Loading...</p>
      ) : (
        <>
          {isAlertsFetching && (
            <p className="text-sm text-dark-700">Searching...</p>
          )}
          <DataTable columns={alertColumns} data={alerts?.documents ?? []} />
        </>
      )}
    </>
  );
};
