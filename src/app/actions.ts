"use server";

import { db } from "@/server/db";
import { batches } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";
import { batchSchema } from "@/server/db/schema";

export async function createBatch(formData: FormData) {
    const validatedFields = batchSchema.safeParse({
        batchNumber: formData.get("batchNumber"),
        startDate: formData.get("startDate"),
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
            start_date: validatedFields.data.startDate,
        });
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath("/");
}
