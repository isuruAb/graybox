"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { StatCard } from "@/components/StatCard";
import { alertColumns } from "@/components/table/alertColumns";
import { DataTable } from "@/components/table/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertSeverityOptions, AlertStatusOptions } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useAlertStats, useAlerts, useAlertsRealtime } from "@/hooks/useAlerts";

const ALL_FILTER = "all";

export const AlertsDashboard = () => {
  const [patientName, setPatientName] = useState("");
  const [severity, setSeverity] = useState<AlertSeverity | typeof ALL_FILTER>(
    ALL_FILTER
  );
  const [status, setStatus] = useState<AlertStatus | typeof ALL_FILTER>(
    ALL_FILTER
  );
  const debouncedPatientName = useDebounce(patientName, 1000).trim();

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
  } = useAlerts({
    patientName: debouncedPatientName,
    severity: severity === ALL_FILTER ? undefined : severity,
    status: status === ALL_FILTER ? undefined : status,
  });

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

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="flex w-full flex-col gap-2">
          <p className="shad-input-label">Patient Name</p>
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
        </div>

        <div className="flex w-full flex-col gap-2 xl:w-[180px]">
          <p className="shad-input-label">Severity</p>
          <Select
            value={severity}
            onValueChange={(value) =>
              setSeverity(value as AlertSeverity | typeof ALL_FILTER)
            }
          >
            <SelectTrigger className="shad-select-trigger w-full">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              <SelectItem value={ALL_FILTER}>All severities</SelectItem>
              {AlertSeverityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  <span className="capitalize">{option}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2 xl:w-[180px]">
          <p className="shad-input-label">Status</p>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus(value as AlertStatus | typeof ALL_FILTER)
            }
          >
            <SelectTrigger className="shad-select-trigger w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              <SelectItem value={ALL_FILTER}>All statuses</SelectItem>
              {AlertStatusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            <p className="text-sm text-dark-700">Updating results...</p>
          )}
          <DataTable columns={alertColumns} data={alerts?.documents ?? []} />
        </>
      )}
    </>
  );
};
