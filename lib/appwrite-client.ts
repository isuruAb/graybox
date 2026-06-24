import { Client } from "appwrite";

export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.PROJECT_ID!);

export const ALERTS_CHANNEL = `databases.${process.env.DATABASE_ID}.collections.${process.env.ALERT_COLLECTION_ID}.documents`;
