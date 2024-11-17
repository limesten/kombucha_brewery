import "server-only";
import { db } from "./db";

export async function getBatches() {
    const batches = await db.query.batches.findMany();
    return batches;
}
