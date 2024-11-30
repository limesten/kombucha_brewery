import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const batches = pgTable("batches", {
    id: serial("id").primaryKey(),
    brewingVessel: text("brewing_vessel").notNull(),
    batchNumber: integer("batch_number").notNull(),
    startDate: timestamp("start_date").notNull(),
    secondFermentationStart: timestamp("second_fermentation_start"),
    finishDate: timestamp("finish_date"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    status: text("status").notNull(),
    userId: text("user_id").notNull(),
});

export const brewingVessels = pgTable(
    "brewing_vessels",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull(),
        userId: text("user_id").notNull(),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => {
        return [uniqueIndex("unique_name_per_user").on(table.name, table.userId)];
    }
);

export const batchZodSchema = z.object({
    brewingVesselName: z
        .string()
        .min(1, {
            message: "Brewing vessel name must be at least 1 character",
        })
        .max(30, {
            message: "Brewing vessel name must be at most 30 characters",
        })
        .trim(),
    startDate: z.date(),
    status: z.string(),
});

export const brewingVesselZodSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Name must be at least 1 character",
        })
        .max(30, {
            message: "Name must be at most 30 characters",
        })
        .trim(),
});

export type Batch = InferSelectModel<typeof batches>;
export type NewBatch = InferInsertModel<typeof batches>;

export type BrewingVessel = InferSelectModel<typeof brewingVessels>;
export type NewBrewingVessel = InferInsertModel<typeof brewingVessels>;
