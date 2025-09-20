import { db } from "./client";

export async function closeDbConnection() {
  if (db && typeof db.end === "function") {
    await db.end();
  }
}
