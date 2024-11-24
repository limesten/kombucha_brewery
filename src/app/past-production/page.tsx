import { getPreviousBatchesQuery } from "@/server/queries";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteBatch } from "@/app/actions";

export default async function Page() {
    const batches = await getPreviousBatchesQuery();

    return (
        <>
            <div className="text-xl flex my-4">
                <p className="mx-4 w-1/5">Batch</p>
                <p className="mx-4 w-1/5">Started</p>
                <p className="mx-4 w-1/5">Finished</p>
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
                        <p className="mx-4 w-1/5">todo</p>
                        <p className="mx-4 w-1/5">{batch.status}</p>
                        <div className="mx-4 w-1/5">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">...</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
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
        </>
    );
}
