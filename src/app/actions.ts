"use server";

import { Batch, BrewingVessel, NewBatch, NewBrewingVessel } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/utils";
import { batchZodSchema, brewingVesselZodSchema } from "@/server/db/schema";
import { z } from "zod";
import {
    insertBatchQuery,
    deleteBatchQuery,
    updateBatchQuery,
    insertBrewingVesselQuery,
} from "@/server/queries";
import { auth } from "@clerk/nextjs/server";

export async function createBatch(values: z.infer<typeof batchZodSchema>) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: "Unauthorized",
        };
    }

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
        userId: userId,
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

export async function addBrewingVessel(values: z.infer<typeof brewingVesselZodSchema>) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: "Unauthorized",
        };
    }

    const validatedFields = brewingVesselZodSchema.safeParse({
        name: values.name,
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

    const newBrewingVessel: NewBrewingVessel = {
        name: validatedFields.data.name,
        userId: userId,
    };

    try {
        await insertBrewingVesselQuery(newBrewingVessel);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath("/");
}
