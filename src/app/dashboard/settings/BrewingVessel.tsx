'use client';

import type { BrewingVessel } from '@/server/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { UpdateBrewingVesselDialog } from './UpdateBrewingVesselDialog';
import { useState } from 'react';

export function BrewingVessel({ brewingVessel }: { brewingVessel: BrewingVessel }) {
    const [brewingVesselDialog, setBrewingVesselDialog] = useState<boolean>(false);
    return (
        <div>
            <Card onClick={() => setBrewingVesselDialog(true)}>
                <CardContent className='w-[150px] flex flex-col aspect-square items-center justify-center p-2 hover:bg-slate-100 hover:cursor-pointer'>
                    <Image src='/kombucha.png' alt='brewing vessel' width={50} height={50} />
                    <span className='text-md font-semibold mt-2'>{brewingVessel.name}</span>
                </CardContent>
            </Card>
            <UpdateBrewingVesselDialog
                brewingVessel={brewingVessel}
                brewingVesselDialog={brewingVesselDialog}
                setBrewingVesselDialog={setBrewingVesselDialog}
            />
        </div>
    );
}
