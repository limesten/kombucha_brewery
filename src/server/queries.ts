import "server-only";
import { db } from "./db";
import { ne, eq } from "drizzle-orm";

export async function getBatches() {
    const batches = await db.query.batches.findMany();
    return batches;
}

export async function getActiveBatches() {
    const batches = await db.query.batches.findMany({
        where: (batches) => ne(batches.status, "Finished"),
    });
    return batches;
}

export async function getPreviousBatches() {
    const batches = await db.query.batches.findMany({
        where: (batches) => eq(batches.status, "Finished"),
    });
    return batches;
}
