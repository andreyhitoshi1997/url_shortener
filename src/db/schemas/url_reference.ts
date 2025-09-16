import { pgTable, uuid, text } from "drizzle-orm/pg-core";
export const urlReference = pgTable('url_reference', {
  id: uuid().defaultRandom().primaryKey(),
  shortRef: text().notNull(),
  targetRef: text().notNull()
})