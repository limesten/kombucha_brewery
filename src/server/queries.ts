import "server-only";
import { db } from "./db";
import { ne, eq, and } from "drizzle-orm";
import { batches, Batch, NewBatch, brewingVessels, NewBrewingVessel } from "./db/schema";
import { auth } from "@clerk/nextjs/server";

export async function getActiveBatchesQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const batches = await db.query.batches.findMany({
        where: (batches) => ne(batches.status, "Finished") && eq(batches.userId, userId),
    });
    return batches;
}

export async function getPreviousBatchesQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const batches = await db.query.batches.findMany({
        where: (batches) => eq(batches.status, "Finished") && eq(batches.userId, userId),
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
    await db
        .update(batches)
        .set(batch)
        .where(and(eq(batches.id, batch.id), eq(batches.userId, userId)));
}

export async function insertBrewingVesselQuery(brewingVessel: NewBrewingVessel) {
    await db.insert(brewingVessels).values(brewingVessel);
}
