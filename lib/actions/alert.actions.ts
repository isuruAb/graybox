"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Alert } from "@/types/appwrite.types";

import {
  ALERT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAlert = async (alert: CreateAlertParams) => {
  try {
    const newAlert = await databases.createDocument(
      DATABASE_ID!,
      ALERT_COLLECTION_ID!,
      ID.unique(),
      {
        ...alert,
        status: "Open",
      }
    );

    revalidatePath("/admin/alert");
    return parseStringify(newAlert);
  } catch (error) {
    console.error("An error occurred while creating a new alert:", error);
  }
};

const computeAlertCounts = (documents: Alert[]) => {
  const initialCounts = {
    criticalCount: 0,
    openCount: 0,
    resolvedCount: 0,
  };

  return documents.reduce((acc, alert) => {
    if (alert.severity === "high") acc.criticalCount++;
    if (alert.status === "Open") acc.openCount++;
    if (alert.status === "Resolved") acc.resolvedCount++;
    return acc;
  }, initialCounts);
};

export const getAlertStats = async () => {
  try {
    const alerts = await databases.listDocuments(
      DATABASE_ID!,
      ALERT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    return parseStringify({
      totalCount: alerts.total,
      ...computeAlertCounts(alerts.documents as Alert[]),
    });
  } catch (error) {
    console.error("An error occurred while retrieving alert stats:", error);
    throw error;
  }
};

export const getAlerts = async (patientName?: string) => {
  try {
    const queries = [Query.orderDesc("$createdAt")];

    if (patientName?.trim()) {
      queries.unshift(Query.search("patientName", patientName.trim()));
    }

    const alerts = await databases.listDocuments(
      DATABASE_ID!,
      ALERT_COLLECTION_ID!,
      queries
    );

    return parseStringify({
      totalCount: alerts.total,
      documents: alerts.documents as Alert[],
    });
  } catch (error) {
    console.error("An error occurred while retrieving alerts:", error);
    throw error;
  }
};

export const getAlert = async (alertId: string) => {
  try {
    const alert = await databases.getDocument(
      DATABASE_ID!,
      ALERT_COLLECTION_ID!,
      alertId
    );

    return parseStringify(alert);
  } catch (error) {
    console.error("An error occurred while retrieving the alert:", error);
  }
};

export const updateAlert = async ({ alertId, status }: UpdateAlertParams) => {
  try {
    const updatedAlert = await databases.updateDocument(
      DATABASE_ID!,
      ALERT_COLLECTION_ID!,
      alertId,
      { status }
    );

    revalidatePath("/admin/alert");
    return parseStringify(updatedAlert);
  } catch (error) {
    console.error("An error occurred while updating the alert:", error);
  }
};
