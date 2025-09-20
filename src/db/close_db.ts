import { client } from "./client";

export async function closeDbConnection() {
  try {
    await client.end();
  } catch (error) {
    console.error("Failed to close database connection:", error);
    throw error;
  }
}
