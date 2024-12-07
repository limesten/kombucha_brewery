'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AddBrewingVesselDialog } from './AddBrewingVesselDialog';

export function AddBrewingVessel() {
    const [brewingVesselDialog, setBrewingVesselDialog] = useState<boolean>(false);
    return (
        <>
            <Card onClick={() => setBrewingVesselDialog(true)}>
                <CardContent className='w-[150px] flex aspect-square items-center justify-center p-2 hover:bg-slate-100 hover:cursor-pointer'>
                    <span className='text-md font-semibold'>Add new</span>
                </CardContent>
            </Card>
            <AddBrewingVesselDialog
                brewingVesselDialog={brewingVesselDialog}
                setBrewingVesselDialog={setBrewingVesselDialog}
            />
        </>
    );
}