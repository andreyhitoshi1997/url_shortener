import { client } from "./client";

export async function closeDbConnection() {
  try {
    await client.end();
  } catch {
    // Silently handle connection close errors
  }
}
