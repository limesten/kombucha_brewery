import { getBrewSettings } from '@/server/queries';
import { AddBrewingVesselDialog } from './AddBrewingVesselDialog';
import { ChangeBrewSettingsDialog } from './ChangeBrewSettingsDialog';

export default async function Settings() {
    const brewSettings = await getBrewSettings();

    return (
        <>
            <h2>Brewing vessels</h2>
            <AddBrewingVesselDialog />
            <h2>Default brew settings</h2>
            <p>F1 days: {brewSettings.firstFermentationDays}</p>
            <p>F2 days: {brewSettings.secondFermentationDays}</p>
            <ChangeBrewSettingsDialog />
        </>
    );
}
