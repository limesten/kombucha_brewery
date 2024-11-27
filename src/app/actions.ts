"use server";

import { Batch, NewBatch } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";
import { batchZodSchema } from "@/server/db/schema";
import { z } from "zod";
import { insertBatchQuery, deleteBatchQuery, updateBatchQuery } from "@/server/queries";

export async function createBatch(values: z.infer<typeof batchZodSchema>) {
    const validatedFields = batchZodSchema.safeParse({
        batchNumber: values.batchNumber,
        startDate: values.startDate,
        status: values.status,
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

    const newBatch: NewBatch = {
        batchNumber: validatedFields.data.batchNumber,
        startDate: validatedFields.data.startDate,
        status: validatedFields.data.status,
    };

    try {
        await insertBatchQuery(newBatch);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath("/");
}

export async function deleteBatch(id: number) {
    try {
        await deleteBatchQuery(id);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }
    revalidatePath("/");
}

export async function updateBatch(batch: Batch) {
    try {
        await updateBatchQuery(batch);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }
    revalidatePath("/");
}
