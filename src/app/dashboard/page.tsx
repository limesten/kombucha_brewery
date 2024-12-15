import { getBatchesByStatusQuery, getBrewingVesselsQuery, getBrewSettingsQuery } from '@/server/queries';
import { CreateBatchDialog } from './CreateBatchDialog';
import { BatchDropdown } from './BatchDropdown';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PROD_STATUS } from '@/constants';
import { Batch, BrewSettings } from '@/server/db/schema';

const calcFinishDate = (batch: Batch, settings: BrewSettings): Date => {
    let expectedBrewingDays: number;
    let expectedFinishDate: Date;
    if (batch.status == PROD_STATUS.FIRST_FERMENTATION) {
        expectedBrewingDays = settings.firstFermentationDays;
        expectedFinishDate = new Date(batch.startDate);
    } else if (batch.status == PROD_STATUS.SECOND_FERMENTATION) {
        expectedBrewingDays = settings.secondFermentationDays;
        expectedFinishDate = new Date(batch.secondFermentationStart!);
    } else {
        throw new Error('Unknown batch status when calculating finish date');
    }
    expectedFinishDate.setDate(expectedFinishDate.getDate() + expectedBrewingDays);
    return expectedFinishDate;
};

const calcDaysLeft = (batch: Batch, settings: BrewSettings) => {
    const estimatedFinishDate = calcFinishDate(batch, settings);
    const currentDate = new Date();
    const timeLeft = estimatedFinishDate.getTime() - currentDate.getTime();
    const daysleft = timeLeft / (1000 * 60 * 60 * 24);

    return Math.max(0, Math.floor(daysleft));
};

const calcProgress = (batch: Batch, settings: BrewSettings) => {
    const estimatedFinishDate = calcFinishDate(batch, settings);
    const currentDate = new Date();
    const totalTime = estimatedFinishDate.getTime() - batch.startDate.getTime();
    const elapsedTime = currentDate.getTime() - batch.startDate.getTime();

    let progress = (elapsedTime / totalTime) * 100;
    progress = Math.floor(Math.min(Math.max(progress, 0)));

    return progress;
};

export default async function InProduction() {
    const brewSettings = await getBrewSettingsQuery();

    const firstStageBatches = await getBatchesByStatusQuery(PROD_STATUS.FIRST_FERMENTATION);
    const secondStageBatches = await getBatchesByStatusQuery(PROD_STATUS.SECOND_FERMENTATION);
    const brewingVessels = await getBrewingVesselsQuery();

    return (
        <>
            <h2 className='text-xl text-secondary-gray mt-4 mb-6 font-semibold'>First fermentation</h2>
            <table className='min-w-full text-xl my-4'>
                <thead>
                    <tr className='text-secondary-gray bg-accent-green'>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Container</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Batch</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Start</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Est. finish</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Progress</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>More</th>
                    </tr>
                </thead>
                <tbody>
                    {firstStageBatches.map((batch) => (
                        <tr key={batch.id} className='text-secondary-gray'>
                            <td className='px-4 py-2 border border-accent-darkgreen'>{batch.brewingVessel}</td>
                            <td className='px-4 py-2 border border-accent-darkgreen'>{batch.batchNumber}</td>
                            <td className='px-4 py-2 border border-accent-darkgreen'>
                                {batch.startDate.toISOString().split('T')[0]}
                            </td>
                            <td className='px-4 py-2 border border-accent-darkgreen'>
                                {calcFinishDate(batch, brewSettings).toISOString().split('T')[0]}
                            </td>
                            <td className='px-4 py-2 border border-accent-darkgreen'>
                                {calcProgress(batch, brewSettings)}%
                            </td>
                            <td className='px-4 py-2 border border-accent-darkgreen text-center'>
                                <BatchDropdown batch={batch} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='w-full flex justify-center py-4'>
                <CreateBatchDialog brewingVessels={brewingVessels} />
            </div>
            <h2 className='text-xl text-secondary-gray mt-4 mb-6 font-semibold'>Second fermentation</h2>
            <table className='min-w-full text-xl my-4'>
                <thead>
                    <tr className='text-secondary-gray bg-accent-green'>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Container</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Batch</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Start</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Est. finish</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Progress</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>More</th>
                    </tr>
                </thead>
                <tbody>
                    {secondStageBatches.length === 0 ? (
                        <tr>
                            <td colSpan={6} className='text-center py-4 text-secondary-gray'>
                                Nothing here at the moment...
                            </td>
                        </tr>
                    ) : (
                        secondStageBatches.map((batch) => (
                            <tr key={batch.id} className='text-secondary-gray'>
                                <td className='px-4 py-2 border border-accent-darkgreen'>{batch.brewingVessel}</td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>{batch.batchNumber}</td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>
                                    {batch.startDate.toISOString().split('T')[0]}
                                </td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>
                                    {calcFinishDate(batch, brewSettings).toISOString().split('T')[0]}
                                </td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>
                                    {calcProgress(batch, brewSettings)}%
                                </td>
                                <td className='px-4 py-2 border border-accent-darkgreen text-center'>
                                    <BatchDropdown batch={batch} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}
