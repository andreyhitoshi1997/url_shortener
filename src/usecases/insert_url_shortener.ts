import { db } from "../db/client";
import { urlReference } from "../db/schema";
import { eq, and } from "drizzle-orm";


export const userAlreadyExists = async (shortRef?: string, targetRef?: string) => {
    if (!shortRef || !targetRef) {
        return { error: 'shortRef and targetRef are required' };
    }
    const result = await db
        .select()
        .from(urlReference)
        .where(and(
            eq(urlReference.shortRef, shortRef),
            eq(urlReference.targetRef, targetRef)
        ));
    if (!result[0]) {
        return { error: 'Not found' };
    }
    return { targetRef: result[0].targetRef };
}

export const insertUser = async (shortRef: string, targetRef: string) => {
    return await db.insert(urlReference).values({
        shortRef,
        targetRef
    }).returning();
}