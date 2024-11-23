import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const batches = sqliteTable("batches", {
    id: int().primaryKey({ autoIncrement: true }),
    batch_number: text().notNull(),
    start_date: text().notNull(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    status: text().notNull(),
});

export const batchSchema = z.object({
    batchNumber: z
        .string()
        .min(1, {
            message: "Batch number must be at least 1 character",
        })
        .max(20, {
            message: "Batch number must be at most 20 characters",
        })
        .trim(),
    startDate: z.date(),
});
