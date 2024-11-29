import { getActiveBatchesQuery, getBrewingVesselsQuery } from "@/server/queries";
import { CreateBatchDialog } from "./CreateBatchDialog";
import { BatchDropdown } from "./BatchDropdown";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const calcFinishDate = (startDate: Date): Date => {
    const expectedBrewingDays = 7;
    const expectedFinishDate = new Date(startDate);
    expectedFinishDate.setDate(expectedFinishDate.getDate() + expectedBrewingDays);
    return expectedFinishDate;
};

const calcDaysLeft = (startDate: Date) => {
    const estimatedFinishDate = calcFinishDate(startDate);
    const currentDate = new Date();
    const timeLeft = estimatedFinishDate.getTime() - currentDate.getTime();
    const daysleft = timeLeft / (1000 * 60 * 60 * 24);

    return Math.max(0, Math.floor(daysleft));
};

const calcProgress = (startDate: Date) => {
    const estimatedFinishDate = calcFinishDate(startDate);
    const currentDate = new Date();
    const totalTime = estimatedFinishDate.getTime() - startDate.getTime();
    const elapsedTime = currentDate.getTime() - startDate.getTime();

    let progress = (elapsedTime / totalTime) * 100;
    progress = Math.min(Math.max(progress, 0));

    return progress;
};

export default async function InProduction() {
    const batches = await getActiveBatchesQuery();
    const brewingVessels = await getBrewingVesselsQuery();

    return (
        <>
            <h2 className="text-xl mt-4 mb-6 font-semibold">First fermentation</h2>
            <div className="text-xl flex my-4">
                <p className="mr-4 w-1/5">Brewing vessel</p>
                <p className="mr-4 w-1/5">Batch</p>
                <p className="mr-4 w-1/5">Start</p>
                <p className="mr-4 w-1/5">Est. finish</p>
                <p className="mr-4 w-1/5">More</p>
            </div>
            {batches.map((batch) => (
                <div key={batch.id}>
                    <div className="text-xl flex my-4">
                        <p className="mr-4 w-1/5">{batch.brewingVessel}</p>
                        <p className="mr-4 w-1/5">{batch.batchNumber}</p>
                        <p className="mr-4 w-1/5">
                            {batch.startDate.toISOString().split("T")[0]}
                        </p>
                        <p className="mr-4 w-1/5">
                            {calcFinishDate(batch.startDate).toISOString().split("T")[0]}
                        </p>

                        <div className="mr-4 w-1/5">
                            <BatchDropdown batch={batch} />
                        </div>
                    </div>
                    <div className="my-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Progress value={calcProgress(batch.startDate)} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Estimated {calcDaysLeft(batch.startDate)} days left
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <hr className="my-4 border-t border-gray-400" />
                </div>
            ))}
            <div className="w-full flex justify-center py-4">
                <CreateBatchDialog brewingVessels={brewingVessels} />
            </div>
            <h2 className="text-xl mt-4 mb-6 font-semibold">Second fermentation</h2>
        </>
    );
}
