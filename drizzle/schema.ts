import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const batches = sqliteTable("batches", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	batchNumber: text("batch_number").notNull(),
	startDate: text("start_date").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
});

