import { db } from "../db/client";
import { urlReference } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const shortRefExists = async (shortRef: string) => {
  if (!shortRef) {
    return { error: "shortRef is required" };
  }

  try {
    const result = await db
      .select()
      .from(urlReference)
      .where(eq(urlReference.shortRef, shortRef));

    return { exists: result.length > 0, data: result[0] || null };
  } catch (error) {
    console.error("Database error in shortRefExists:", error);
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
};

export const insertUser = async (shortRef: string, targetRef: string) => {
  return await db
    .insert(urlReference)
    .values({
      shortRef,
      targetRef,
    })
    .returning();
};
