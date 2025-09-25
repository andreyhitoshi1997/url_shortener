import { eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { urlReference } from "../db/schemas/url_reference";
import { DatabaseError } from "../errors";

export interface UrlRecord {
  id: string;
  shortRef: string;
  targetRef: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  accessCount: number | null;
}

export interface CreateUrlData {
  shortRef: string;
  targetRef: string;
}

export class UrlRepository {
  async create(data: CreateUrlData): Promise<UrlRecord> {
    try {
      const result = await db.insert(urlReference).values(data).returning();

      if (!result[0]) {
        throw new DatabaseError("Failed to insert URL record");
      }

      return result[0];
    } catch (error: any) {
      if (error.code === "23505" && error.constraint === "short_ref_idx") {
        throw new DatabaseError(
          `Short reference '${data.shortRef}' already exists`
        );
      }
      throw new DatabaseError("Failed to insert URL record");
    }
  }

  async findByShortRef(shortRef: string): Promise<UrlRecord | null> {
    try {
      const result = await db
        .select()
        .from(urlReference)
        .where(eq(urlReference.shortRef, shortRef))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new DatabaseError("Failed to search URL");
    }
  }

  async findByTargetRef(targetRef: string): Promise<UrlRecord | null> {
    try {
      const result = await db
        .select()
        .from(urlReference)
        .where(eq(urlReference.targetRef, targetRef))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      throw new DatabaseError("Failed to search URL by target reference");
    }
  }

  async incrementAccessCount(shortRef: string): Promise<void> {
    try {
      await db
        .update(urlReference)
        .set({
          accessCount: sql`${urlReference.accessCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(urlReference.shortRef, shortRef));
    } catch (error) {
      console.warn(`Failed to increment access count for ${shortRef}:`, error);
    }
  }

  async getStats(): Promise<{ totalUrls: number; totalAccesses: number }> {
    try {
      const result = await db
        .select({
          totalUrls: sql<number>`count(*)`,
          totalAccesses: sql<number>`sum(${urlReference.accessCount})`,
        })
        .from(urlReference);

      return {
        totalUrls: Number(result[0]?.totalUrls || 0),
        totalAccesses: Number(result[0]?.totalAccesses || 0),
      };
    } catch (error) {
      throw new DatabaseError("Failed to get statistics");
    }
  }
}
