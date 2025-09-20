import { db, ensureConnection } from "../db/client";
import { urlReference } from "../db/schema";
import { eq } from "drizzle-orm";

export const findTargetByShortRef = async (shortRef: string) => {
  try {
    await ensureConnection();
    const result = await db
      .select()
      .from(urlReference)
      .where(eq(urlReference.shortRef, shortRef));
    return result[0]?.targetRef;
  } catch {
    throw new Error("Database connection failed");
  }
};
