import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { urlReference } from "./schemas/url_reference";

export const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(client, { schema: { urlReference } });

let isConnected = false;
let isConnecting = false;

export const ensureConnection = async (): Promise<void> => {
  if (isConnected) return;

  if (isConnecting) {
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  isConnecting = true;

  try {
    await client.connect();
    isConnected = true;
    isConnecting = false;
  } catch (error) {
    isConnecting = false;
    throw error;
  }
};
