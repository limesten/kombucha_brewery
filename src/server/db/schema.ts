import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const batches = sqliteTable("batches", {
    id: int().primaryKey({ autoIncrement: true }),
    batch_number: text().notNull(),
    start_date: text().notNull(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
});
