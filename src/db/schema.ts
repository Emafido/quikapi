import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const apis = sqliteTable("apis", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  schema: text("schema").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const records = sqliteTable("records", {
  id: text("id").primaryKey(),
  apiId: text("api_id")
    .notNull()
    .references(() => apis.id, { onDelete: "cascade" }),
  resource: text("resource").notNull(),
  data: text("data").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export type Api = typeof apis.$inferSelect;
export type NewApi = typeof apis.$inferInsert;
export type Record = typeof records.$inferSelect;