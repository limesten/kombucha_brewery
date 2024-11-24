import "server-only";
import { db } from "./db";
import { ne, eq } from "drizzle-orm";
import { batches, Batch, NewBatch } from "./db/schema";

export async function getBatchesQuery() {
    const batches = await db.query.batches.findMany();
    return batches;
}

export async function getActiveBatchesQuery() {
    const batches = await db.query.batches.findMany({
        where: (batches) => ne(batches.status, "Finished"),
    });
    return batches;
}

export async function getPreviousBatchesQuery() {
    const batches = await db.query.batches.findMany({
        where: (batches) => eq(batches.status, "Finished"),
    });
    return batches;
}

export async function insertBatchQuery(batch: NewBatch) {
    await db.insert(batches).values(batch);
}

export async function deleteBatchQuery(id: number) {
    await db.delete(batches).where(eq(batches.id, id));
}

export async function updateBatchQuery(batch: Batch) {
    await db.update(batches).set(batch).where(eq(batches.id, batch.id));
}
