"use server";

import { db } from "@/server/db";
import { batches } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export async function createBatch(formData: FormData) {
    try {
        await db.insert(batches).values({
            batch_number: formData.get("batchNumber") as string,
            start_date: formData.get("startDate") as string,
        });
    } catch (err) {
        return {
            error: "Failed to create batch",
        };
    }

    revalidatePath("/");
}
