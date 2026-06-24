"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  createAlert,
  getAlert,
  getAlerts,
  updateAlert,
} from "@/lib/actions/alert.actions";
import { ALERTS_CHANNEL, client } from "@/lib/appwrite-client";
import { Alert } from "@/types/appwrite.types";

export type AlertsList = Awaited<ReturnType<typeof getAlerts>>;

export const alertKeys = {
  all: ["alerts"] as const,
  list: () => [...alertKeys.all, "list"] as const,
  detail: (alertId: string) => [...alertKeys.all, "detail", alertId] as const,
};

const findAlertInList = (alerts: AlertsList | undefined, alertId: string) =>
  alerts?.documents?.find((alert: Alert) => alert.$id === alertId);

export const useAlerts = () =>
  useQuery({
    queryKey: alertKeys.list(),
    queryFn: () => getAlerts(),
  });

export const useAlertsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("[realtime] subscribing to", ALERTS_CHANNEL);

    const unsubscribe = client.subscribe<Alert>(ALERTS_CHANNEL, (response) => {
      console.log("[realtime] event received", response.events, response.payload);

      const alert = response.payload;

      const isDeleted = response.events.some((event) =>
        event.endsWith(".delete")
      );

      if (isDeleted) {
        queryClient.removeQueries({ queryKey: alertKeys.detail(alert.$id) });
      } else {
        queryClient.setQueryData(alertKeys.detail(alert.$id), alert);
      }

      queryClient.invalidateQueries({ queryKey: alertKeys.list() });
    });

    return () => {
      console.log("[realtime] unsubscribing");
      unsubscribe();
    };
  }, [queryClient]);
};

export const useAlert = (alertId: string) => {
  const queryClient = useQueryClient();

  const cachedAlert =
    queryClient.getQueryData<Alert>(alertKeys.detail(alertId)) ??
    findAlertInList(
      queryClient.getQueryData<AlertsList>(alertKeys.list()),
      alertId
    );

  const hasCachedAlert = Boolean(cachedAlert);

  return useQuery({
    queryKey: alertKeys.detail(alertId),
    queryFn: () => getAlert(alertId),
    enabled: Boolean(alertId) && !hasCachedAlert,
    initialData: cachedAlert,
    staleTime: hasCachedAlert ? Infinity : 0,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (alert: CreateAlertParams) => createAlert(alert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
      router.push("/admin/alert");
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: UpdateAlertParams) => updateAlert(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
      queryClient.invalidateQueries({
        queryKey: alertKeys.detail(variables.alertId),
      });
      router.push("/admin/alert");
    },
  });
};
