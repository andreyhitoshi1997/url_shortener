import { pool } from "./client";

export async function closeDbConnection() {
  try {
    await pool.end();
    console.log("Database pool closed successfully");
  } catch (error) {
    console.error("Failed to close database pool:", error);
    throw error;
  }
}
