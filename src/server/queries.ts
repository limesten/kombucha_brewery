import 'server-only';
import { db } from './db';
import { ne, eq, and } from 'drizzle-orm';
import {
    batches,
    Batch,
    NewBatch,
    brewingVessels,
    NewBrewingVessel,
    brewSettings,
    NewBrewSettings,
    BrewingVessel,
} from './db/schema';
import { auth } from '@clerk/nextjs/server';

// Batch queries

export async function getBatchesByStatusQuery(status: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const batches = await db.query.batches.findMany({
        where: (batches) => and(eq(batches.status, status), eq(batches.userId, userId)),
    });
    return batches;
}

export async function insertBatchQuery(batch: NewBatch) {
    await db.insert(batches).values(batch);
}

export async function deleteBatchQuery(id: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    await db.delete(batches).where(and(eq(batches.id, id), eq(batches.userId, userId)));
}

export async function updateBatchQuery(batch: Batch) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    await db
        .update(batches)
        .set(batch)
        .where(and(eq(batches.id, batch.id), eq(batches.userId, userId)));
}

export async function getHighestBatchNumberQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const highestBatch = await db.query.batches.findFirst({
        where: (batches) => eq(batches.userId, userId),
        orderBy: (batches, { desc }) => [desc(batches.batchNumber)],
    });

    return highestBatch ? highestBatch.batchNumber : 0;
}

// Brewing vessel queries

export async function insertBrewingVesselQuery(brewingVessel: NewBrewingVessel) {
    await db.insert(brewingVessels).values(brewingVessel);
}

export async function getBrewingVesselsQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const rows = await db.query.brewingVessels.findMany({
        where: eq(brewingVessels.userId, userId),
    });

    return rows;
}

export async function updateBrewingVesselQuery(brewingVessel: BrewingVessel) {
    await db.update(brewingVessels).set(brewingVessel).where(eq(brewingVessels.id, brewingVessel.id));
}

export async function deleteBrewingVesselQuery(brewingVessel: BrewingVessel) {
    await db.delete(brewingVessels).where(eq(brewingVessels.id, brewingVessel.id));
}

// Brew settings

export async function getBrewSettingsQuery() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const rows = await db.query.brewSettings.findFirst({
        where: eq(brewingVessels.userId, userId),
    });

    const settings = await db.select().from(brewSettings).where(eq(brewSettings.userId, userId)).limit(1);

    if (settings.length > 0) {
        return settings[0];
    }

    const defaultSettings = await db.select().from(brewSettings).where(eq(brewSettings.userId, 'default')).limit(1);

    if (defaultSettings.length > 0) {
        return defaultSettings[0];
    }

    throw new Error('Default brew settings not found');
}

export async function upsertBrewSettings(newBrewSettings: NewBrewSettings) {
    await db.insert(brewSettings).values(newBrewSettings).onConflictDoUpdate({
        target: brewSettings.userId,
        set: newBrewSettings,
    });
}
