import { getBatches } from "@/server/queries";
import { CreateBatchDialog } from "./components/CreateBatchDialog";
import { deleteBatch, updateBatchStatus } from "./actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                <CreateBatchDialog />
            </div>

            <div className="text-xl flex my-4">
                <p className="mx-4 w-1/5">Batch</p>
                <p className="mx-4 w-1/5">Start</p>
                <p className="mx-4 w-1/5">Est. finish</p>
                <p className="mx-4 w-1/5">Status</p>
                <p className="mx-4 w-1/5">Actions</p>
            </div>
            {batches.map((batch) => (
                <div key={batch.id}>
                    <div className="text-xl flex my-4">
                        <p className="mx-4 w-1/5">{batch.batch_number}</p>
                        <p className="mx-4 w-1/5">{batch.start_date}</p>
                        <p className="mx-4 w-1/5">{calcFinishDate(batch.start_date)}</p>
                        <p className="mx-4 w-1/5">{batch.status}</p>

                        <div className="mx-4 w-1/5">
                            <DropdownMenu>
                                <DropdownMenuTrigger>...</DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <form
                                            action={async () => {
                                                "use server";
                                                await updateBatchStatus(
                                                    batch.id,
                                                    "Finished"
                                                );
                                            }}
                                        >
                                            <button>Mark as finished</button>
                                        </form>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <form
                                            action={async () => {
                                                "use server";
                                                await deleteBatch(batch.id);
                                            }}
                                        >
                                            <button>Delete batch</button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <hr className="my-4 border-t border-gray-400" />
                </div>
            ))}
        </div>
    );
}
