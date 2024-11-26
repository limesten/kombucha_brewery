import { getActiveBatchesQuery } from "@/server/queries";
import { CreateBatchDialog } from "./CreateBatchDialog";
import { BatchDropdown } from "./BatchDropdown";

export default async function InProduction() {
    const batches = await getActiveBatchesQuery();

    const calcFinishDate = (startDate: Date): string => {
        const expectedBrewingDays = 7;
        startDate.setDate(startDate.getDate() + expectedBrewingDays);
        return startDate.toISOString().split("T")[0];
    };

    return (
        <>
            <div className="text-xl flex my-4">
                <p className="mx-4 w-1/5">Batch</p>
                <p className="mx-4 w-1/5">Start</p>
                <p className="mx-4 w-1/5">Est. finish</p>
                <p className="mx-4 w-1/5">Status</p>
                <p className="mx-4 w-1/5">More</p>
            </div>
            {batches.map((batch) => (
                <div key={batch.id}>
                    <div className="text-xl flex my-4">
                        <p className="mx-4 w-1/5">{batch.batch_number}</p>
                        <p className="mx-4 w-1/5">
                            {batch.start_date.toISOString().split("T")[0]}
                        </p>
                        <p className="mx-4 w-1/5">{calcFinishDate(batch.start_date)}</p>
                        <p className="mx-4 w-1/5">{batch.status}</p>

                        <div className="mx-4 w-1/5">
                            <BatchDropdown batch={batch} />
                        </div>
                    </div>
                    <hr className="my-4 border-t border-gray-400" />
                </div>
            ))}
            <div className="w-full flex justify-center py-4">
                <CreateBatchDialog />
            </div>
        </>
    );
}
