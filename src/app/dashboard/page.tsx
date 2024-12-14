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
    progress = Math.min(Math.max(progress, 0));

    return progress;
};

export default async function InProduction() {
    const brewSettings = await getBrewSettingsQuery();

    const firstStageBatches = await getBatchesByStatusQuery(PROD_STATUS.FIRST_FERMENTATION);
    const secondStageBatches = await getBatchesByStatusQuery(PROD_STATUS.SECOND_FERMENTATION);
    const brewingVessels = await getBrewingVesselsQuery();

    return (
        <>
            <h2 className='text-xl mt-4 mb-6 font-semibold'>First fermentation</h2>
            <div className='text-xl flex my-4'>
                <p className='mr-4 w-1/5'>Brewing vessel</p>
                <p className='mr-4 w-1/5'>Batch</p>
                <p className='mr-4 w-1/5'>Start</p>
                <p className='mr-4 w-1/5'>Est. finish</p>
                <p className='w-1/5'>More</p>
            </div>
            {firstStageBatches.map((batch) => (
                <div key={batch.id}>
                    <div className='text-xl flex my-4'>
                        <p className='mr-4 w-1/5'>{batch.brewingVessel}</p>
                        <p className='mr-4 w-1/5'>{batch.batchNumber}</p>
                        <p className='mr-4 w-1/5'>{batch.startDate.toISOString().split('T')[0]}</p>
                        <p className='mr-4 w-1/5'>{calcFinishDate(batch, brewSettings).toISOString().split('T')[0]}</p>

                        <div className='w-1/5'>
                            <BatchDropdown batch={batch} />
                        </div>
                    </div>
                    <div className='my-6'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Progress value={calcProgress(batch, brewSettings)} />
                                </TooltipTrigger>
                                <TooltipContent>Estimated {calcDaysLeft(batch, brewSettings)} days left</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <hr className='my-4 border-t border-gray-400' />
                </div>
            ))}
            <div className='w-full flex justify-center py-4'>
                <CreateBatchDialog brewingVessels={brewingVessels} />
            </div>
            <h2 className='text-xl mt-4 mb-6 font-semibold'>Second fermentation</h2>
            <div className='text-xl flex my-4'>
                <p className='mr-4 w-1/5'>Brewing vessel</p>
                <p className='mr-4 w-1/5'>Batch</p>
                <p className='mr-4 w-1/5'>Start</p>
                <p className='mr-4 w-1/5'>Est. finish</p>
                <p className='w-1/5'>More</p>
            </div>
            {secondStageBatches.map((batch) => (
                <div key={batch.id}>
                    <div className='text-xl flex my-4'>
                        <p className='mr-4 w-1/5'>{batch.brewingVessel}</p>
                        <p className='mr-4 w-1/5'>{batch.batchNumber}</p>
                        <p className='mr-4 w-1/5'>{batch.secondFermentationStart?.toISOString().split('T')[0]}</p>
                        <p className='mr-4 w-1/5'>{calcFinishDate(batch, brewSettings).toISOString().split('T')[0]}</p>

                        <div className='w-1/5'>
                            <BatchDropdown batch={batch} />
                        </div>
                    </div>
                    <div className='my-6'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Progress value={calcProgress(batch, brewSettings)} />
                                </TooltipTrigger>
                                <TooltipContent>Estimated {calcDaysLeft(batch, brewSettings)} days left</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <hr className='my-4 border-t border-gray-400' />
                </div>
            ))}
        </>
    );
}
