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

export const getAlerts = async () => {
  try {
    const alerts = await databases.listDocuments(
      DATABASE_ID!,
      ALERT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      criticalCount: 0,
      openCount: 0,
      resolvedCount: 0,
    };

    const counts = (alerts.documents as Alert[]).reduce((acc, alert) => {
      if (alert.severity === "high") acc.criticalCount++;
      if (alert.status === "Open") acc.openCount++;
      if (alert.status === "Resolved") acc.resolvedCount++;
      return acc;
    }, initialCounts);

    return parseStringify({
      totalCount: alerts.total,
      ...counts,
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
