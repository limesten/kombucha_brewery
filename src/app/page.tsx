import { getBatches } from "@/server/queries";
import { CreateBatchForm } from "./components/CreateBatchForm";

export default async function Home() {
    const batches = await getBatches();

    const calcFinishDate = (startDate: string) => {
        const expectedBrewingDays = 7;
        const date = new Date(startDate);
        date.setDate(date.getDate() + expectedBrewingDays);
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="container mx-auto max-w-[800px]">
            <div className="w-full flex justify-center">
                <CreateBatchForm />
            </div>

            {batches.map((batch) => (
                <div key={batch.id}>
                    <div className="text-xl flex justify-evenly my-4">
                        <p className="mx-4">Batch: {batch.batch_number}</p>
                        <p className="mx-4">Start: {batch.start_date}</p>
                        <p className="mx-4">
                            Est. finish: {calcFinishDate(batch.start_date)}
                        </p>
                        <p className="mx-4">Status: Fermenting</p>
                    </div>
                    <hr className="my-4 border-t border-gray-400" />
                </div>
            ))}
        </div>
    );
}
