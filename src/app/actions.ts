'use server';

import {
    Batch,
    BrewingVessel,
    brewSettingsZodSchema,
    NewBatch,
    NewBrewingVessel,
    NewBrewSettings,
    updateBrewingVesselZodSchema,
} from '@/server/db/schema';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';
import { batchZodSchema, brewingVesselZodSchema } from '@/server/db/schema';
import { z } from 'zod';
import {
    insertBatchQuery,
    deleteBatchQuery,
    updateBatchQuery,
    insertBrewingVesselQuery,
    getHighestBatchNumberQuery,
    upsertBrewSettingsQuery,
    updateBrewingVesselQuery,
    deleteBrewingVesselQuery,
} from '@/server/queries';
import { auth } from '@clerk/nextjs/server';
import { PROD_STATUS } from '@/constants';

export async function createBatch(values: z.infer<typeof batchZodSchema>) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: 'Unauthorized',
        };
    }

    const validatedFields = batchZodSchema.safeParse({
        brewingVesselName: values.brewingVesselName,
        startDate: values.startDate,
        status: values.status,
    });

    if (!validatedFields.success) {
        let errorMessage = '';

        validatedFields.error.issues.forEach((issue) => {
            errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '.';
        });

        return {
            error: errorMessage,
        };
    }

    const highestBatchNumber = await getHighestBatchNumberQuery();
    const batchNumber = highestBatchNumber + 1;

    const newBatch: NewBatch = {
        batchNumber: batchNumber,
        brewingVessel: validatedFields.data.brewingVesselName,
        startDate: validatedFields.data.startDate,
        status: validatedFields.data.status,
        userId: userId,
        secondFermentationStart:
            validatedFields.data.status == PROD_STATUS.SECOND_FERMENTATION ? validatedFields.data.startDate : null,
    };

    try {
        await insertBatchQuery(newBatch);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath('/');
}

export async function deleteBatch(id: number) {
    try {
        await deleteBatchQuery(id);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }
    revalidatePath('/');
}

export async function updateBatch(batch: Batch) {
    try {
        await updateBatchQuery(batch);
        console.log(`Actions: ${batch.secondFermentationStart}`);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }
    revalidatePath('/');
}

export async function addBrewingVessel(values: z.infer<typeof brewingVesselZodSchema>) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: 'Unauthorized',
        };
    }

    const validatedFields = brewingVesselZodSchema.safeParse({
        name: values.name,
    });

    if (!validatedFields.success) {
        let errorMessage = '';

        validatedFields.error.issues.forEach((issue) => {
            errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '.';
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

    revalidatePath('/dashboard/settings');
}

export async function updateBrewingVessel(brewingVessel: BrewingVessel) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: 'Unauthorized',
        };
    }

    const validatedFields = updateBrewingVesselZodSchema.safeParse(brewingVessel);

    if (!validatedFields.success) {
        let errorMessage = '';

        validatedFields.error.issues.forEach((issue) => {
            errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '.';
        });

        return {
            error: errorMessage,
        };
    }

    try {
        await updateBrewingVesselQuery(validatedFields.data);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath('/dashboard/settings');
}

export async function deleteBrewingVessel(brewingVessel: BrewingVessel) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: 'Unauthorized',
        };
    }

    try {
        await deleteBrewingVesselQuery(brewingVessel);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath('/dashboard/settings');
}

export async function changeBrewSettings(values: z.infer<typeof brewSettingsZodSchema>) {
    const { userId } = await auth();
    if (!userId) {
        return {
            error: 'Unauthorized',
        };
    }

    const validatedFields = brewSettingsZodSchema.safeParse({
        firstFermentationDays: values.firstFermentationDays,
        secondFermentationDays: values.secondFermentationDays,
        notificationEmail: values.notificationEmail,
    });

    if (!validatedFields.success) {
        let errorMessage = '';

        validatedFields.error.issues.forEach((issue) => {
            errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '.';
        });

        return {
            error: errorMessage,
        };
    }

    const newBrewSettings: NewBrewSettings = {
        firstFermentationDays: validatedFields.data.firstFermentationDays,
        secondFermentationDays: validatedFields.data.secondFermentationDays,
        notificationEmail: validatedFields.data.notificationEmail,
        userId: userId,
    };

    try {
        upsertBrewSettingsQuery(newBrewSettings);
    } catch (err) {
        return {
            error: getErrorMessage(err),
        };
    }

    revalidatePath('/dashboard/settings');
}
