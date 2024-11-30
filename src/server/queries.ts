import "server-only";
import { db } from "./db";
import { ne, eq, and } from "drizzle-orm";
import { batches, Batch, NewBatch, brewingVessels, NewBrewingVessel } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

// Batch queries

export async function getBatchesByStatusQuery(status: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const batches = await db.query.batches.findMany({
        where: (batches) => and(eq(batches.status, status), eq(batches.userId, userId)),
    });
    return batches;
}

export async function insertBatchQuery(batch: NewBatch) {
    await db.insert(batches).values(batch);
}

export async function deleteBatchQuery(id: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    await db.delete(batches).where(and(eq(batches.id, id), eq(batches.userId, userId)));
}

export async function updateBatchQuery(batch: Batch) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    console.log(`queries: ${batch.secondFermentationStart}`);
    await db
        .update(batches)
        .set(batch)
        .where(and(eq(batches.id, batch.id), eq(batches.userId, userId)));
}

export async function getHighestBatchNumberQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const highestBatch = await db.query.batches.findFirst({
        where: (batches) => eq(batches.userId, userId),
        orderBy: (batches, { desc }) => [desc(batches.batchNumber)],
    });

    return highestBatch ? highestBatch.batchNumber : 0;
}

// Brewing vessel queries

export async function insertBrewingVesselQuery(brewingVessel: NewBrewingVessel) {
    await db.insert(brewingVessels).values(brewingVessel);
}

export async function getBrewingVesselsQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const rows = await db.query.brewingVessels.findMany({
        where: eq(brewingVessels.userId, userId),
    });

    return rows;
}
