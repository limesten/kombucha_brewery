import { AddBrewingVessel } from './AddBrewingVessel';
import { ChangeBrewSettingsDialog } from './ChangeBrewSettingsDialog';
import { getBrewingVesselsQuery, getBrewSettingsQuery } from '@/server/queries';
import { BrewingVessel } from './BrewingVessel';

export default async function Settings() {
    const brewSettings = await getBrewSettingsQuery();
    const brewingVessels = await getBrewingVesselsQuery();

    return (
        <>
            <h2 className='text-xl font-semibold py-6'>Brewing vessels</h2>
            <div className='w-full flex flex-wrap gap-4 '>
                {brewingVessels.map((brewingVessel) => (
                    <BrewingVessel key={brewingVessel.id} brewingVessel={brewingVessel} />
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
