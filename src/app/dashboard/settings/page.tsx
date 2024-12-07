import { AddBrewingVessel } from './AddBrewingVessel';
import { ChangeBrewSettingsDialog } from './ChangeBrewSettingsDialog';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { getBrewingVesselsQuery, getBrewSettingsQuery } from '@/server/queries';

export default async function Settings() {
    const brewSettings = await getBrewSettingsQuery();
    const brewingVessels = await getBrewingVesselsQuery();

    return (
        <>
            <h2 className='text-xl font-semibold py-6'>Brewing vessels</h2>
            <div className='w-full flex flex-wrap gap-4 '>
                {brewingVessels.map((brewingVessel) => (
                    <div key={brewingVessel.id}>
                        <Card>
                            <CardContent className='w-[150px] flex flex-col aspect-square items-center justify-center p-2'>
                                <Image src='/kombucha.png' alt='brewing vessel' width={50} height={50} />
                                <span className='text-md font-semibold mt-2'>{brewingVessel.name}</span>
                            </CardContent>
                        </Card>
                        <div></div>
                    </div>
                ))}
                <AddBrewingVessel />
            </div>
            <h2 className='text-xl font-semibold py-6'>Default brew settings</h2>
            <p>F1 days: {brewSettings?.firstFermentationDays}</p>
            <p>F2 days: {brewSettings?.secondFermentationDays}</p>
            <ChangeBrewSettingsDialog />
        </>
    );
}
