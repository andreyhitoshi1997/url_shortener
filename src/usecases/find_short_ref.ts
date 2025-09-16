import { db } from "../db/client";
import { urlReference } from "../db/schema";
import { eq } from "drizzle-orm";

export const findTargetByShortRef = async (shortRef: string) => {
    const result = await db
        .select()
        .from(urlReference)
        .where(eq(urlReference.shortRef, shortRef));
    return result[0]?.targetRef;
}
