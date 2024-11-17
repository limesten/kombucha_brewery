import { getBatches } from "@/server/queries";
import { CreateBatchForm } from "./components/CreateBatchForm";

export default async function Home() {
    const batches = await getBatches();

    return (
        <div>
            <CreateBatchForm />
            {batches.map((batch) => (
                <li key={batch.id}>{batch.batch_number}</li>
            ))}
        </div>
    );
}
