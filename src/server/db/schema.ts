import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const batches = pgTable("batches", {
    id: serial("id").primaryKey(),
    batch_number: text("batch_number").notNull(),
    start_date: timestamp("start_date").notNull(),
    finish_date: timestamp("finish_date"),
    created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    status: text("status").notNull(),
});

export const batchZodSchema = z.object({
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
    status: z.string(),
});

export type Batch = InferSelectModel<typeof batches>;
export type NewBatch = InferInsertModel<typeof batches>;
