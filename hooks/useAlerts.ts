"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RealtimeResponseEvent } from "appwrite";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  createAlert,
  getAlert,
  getAlerts,
  getAlertStats,
  updateAlert,
} from "@/lib/actions/alert.actions";
import { ALERTS_CHANNEL, client } from "@/lib/appwrite-client";
import { Alert } from "@/types/appwrite.types";

export type AlertsList = Awaited<ReturnType<typeof getAlerts>>;
export type AlertStats = Awaited<ReturnType<typeof getAlertStats>>;

export const alertKeys = {
  all: ["alerts"] as const,
  stats: () => [...alertKeys.all, "stats"] as const,
  search: () => [...alertKeys.all, "search"] as const,
  detail: () => [...alertKeys.all, "detail"] as const,
};

const findAlertInList = (alerts: AlertsList | undefined, alertId: string) =>
  alerts?.documents?.find((alert: Alert) => alert.$id === alertId);

export const useAlertStats = () =>
  useQuery({
    queryKey: alertKeys.stats(),
    queryFn: () => getAlertStats(),
  });

export const useAlerts = (patientName = "") => {
  const patientNameRef = useRef(patientName);
  const query = useQuery({
    queryKey: alertKeys.search(),
    queryFn: () => getAlerts(patientName),
  });

  const { refetch } = query;

  useEffect(() => {
    if (patientNameRef.current === patientName) return;
    patientNameRef.current = patientName;
    refetch();
  }, [patientName, refetch]);

  return query;
};

export const useAlertsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = client.subscribe<Alert>(
      ALERTS_CHANNEL,
      (response: RealtimeResponseEvent<Alert>) => {
        const alert = response.payload;

        queryClient.setQueryData(alertKeys.detail(), alert);
        queryClient.invalidateQueries({ queryKey: alertKeys.all });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};

export const useAlert = (alertId: string) => {
  const queryClient = useQueryClient();

  const cachedAlert =
    queryClient.getQueryData<Alert>(alertKeys.detail()) ??
    findAlertInList(
      queryClient.getQueryData<AlertsList>(alertKeys.search()),
      alertId
    );

  const hasCachedAlert = Boolean(cachedAlert);

  return useQuery({
    queryKey: alertKeys.detail(),
    queryFn: () => getAlert(alertId),
    enabled: Boolean(alertId) && !hasCachedAlert,
    initialData: cachedAlert,
    staleTime: hasCachedAlert ? Infinity : 0,
    refetchOnMount: !hasCachedAlert,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (alert: CreateAlertParams) => {
      const newAlert = await createAlert(alert);
      if (!newAlert) throw new Error("Failed to create alert");
      return newAlert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
      toast.success("Alert created successfully");
      router.push("/admin/alert");
    },
    onError: () => {
      toast.error("Failed to create alert. Please try again.");
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (params: UpdateAlertParams) => {
      const updatedAlert = await updateAlert(params);
      if (!updatedAlert) throw new Error("Failed to update alert");
      return updatedAlert;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
      queryClient.invalidateQueries({
        queryKey: alertKeys.detail(),
      });
      toast.success("Alert updated successfully");
      router.push("/admin/alert");
    },
    onError: () => {
      toast.error("Failed to update alert. Please try again.");
    },
  });
};
