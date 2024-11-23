"use server";

import { db } from "@/server/db";
import { batches } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";
import { batchSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function createBatch(values: z.infer<typeof batchSchema>) {
    const validatedFields = batchSchema.safeParse({
        batchNumber: values.batchNumber,
        startDate: values.startDate,
    });

    if (!validatedFields.success) {
        let errorMessage = "";

        validatedFields.error.issues.forEach((issue) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ".";
        });

        return {
            error: errorMessage,
        };
    }

    try {
        await db.insert(batches).values({
            batch_number: validatedFields.data.batchNumber,
            start_date: validatedFields.data.startDate.toISOString().split("T")[0],
            status: "Fermenting",
        });
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath("/");
}

export async function deleteBatch(id: number) {
    await db.delete(batches).where(eq(batches.id, id));

    revalidatePath("/");
}

export async function updateBatchStatus(id: number, status: string) {
    await db.update(batches).set({ status: status }).where(eq(batches.id, id));

    revalidatePath("/");
}
