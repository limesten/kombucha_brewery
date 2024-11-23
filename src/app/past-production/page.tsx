import { getPreviousBatches } from "@/server/queries";

export default async function Page() {
    const batches = await getPreviousBatches();

    return (
        <>
            <div className="text-xl flex my-4">
                <p className="mx-4 w-1/5">Batch</p>
                <p className="mx-4 w-1/5">Started</p>
                <p className="mx-4 w-1/5">Finished</p>
                <p className="mx-4 w-1/5">Status</p>
                <p className="mx-4 w-1/5">Actions</p>
            </div>
            {batches.map((batch) => (
                <div key={batch.id}>
                    <div className="text-xl flex my-4">
                        <p className="mx-4 w-1/5">{batch.batch_number}</p>
                        <p className="mx-4 w-1/5">{batch.start_date}</p>
                        <p className="mx-4 w-1/5">todo</p>
                        <p className="mx-4 w-1/5">{batch.status}</p>
                        <p className="mx-4 w-1/5">todo</p>
                    </div>
                    <hr className="my-4 border-t border-gray-400" />
                </div>
            ))}
        </>
    );
}
