import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  index,
  integer,
} from "drizzle-orm/pg-core";

export const urlReference = pgTable(
  "url_reference",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shortRef: varchar("shortRef", { length: 50 }).notNull(),
    targetRef: varchar("targetRef", { length: 2048 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    accessCount: integer("access_count").default(0),
  },
  (table) => ({
    shortRefIdx: uniqueIndex("shortRefIdx").on(table.shortRef),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  })
);
