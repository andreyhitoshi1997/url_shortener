import { db, ensureConnection } from "../db/client";
import { urlReference } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const shortRefExists = async (shortRef: string) => {
  if (!shortRef) {
    return { error: "shortRef is required" };
  }

  try {
    await ensureConnection();
    const result = await db
      .select()
      .from(urlReference)
      .where(eq(urlReference.shortRef, shortRef));

    return { exists: result.length > 0, data: result[0] || null };
  } catch {
    return { error: "Database error", exists: true };
  }
};

export const userAlreadyExists = async (
  shortRef?: string,
  targetRef?: string
) => {
  if (!shortRef || !targetRef) {
    return { error: "shortRef and targetRef are required" };
  }

  try {
    await ensureConnection();
    const result = await db
      .select()
      .from(urlReference)
      .where(
        and(
          eq(urlReference.shortRef, shortRef),
          eq(urlReference.targetRef, targetRef)
        )
      );

    if (!result[0]) {
      return { error: "Not found" };
    }

    return { targetRef: result[0].targetRef };
  } catch {
    return { error: "Database error" };
  }
};

export const insertUser = async (shortRef: string, targetRef: string) => {
  await ensureConnection();
  return await db
    .insert(urlReference)
    .values({ shortRef, targetRef })
    .returning();
};
