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
                <p className="mr-4 w-1/5">Brewing vessel</p>
                <p className="mr-4 w-1/5">Batch</p>
                <p className="mr-4 w-1/5">Started</p>
                <p className="mr-4 w-1/5">Finished</p>
                <p className="mr-4 w-1/5">More</p>
            </div>
            {batches.map((batch) => (
                <div key={batch.id}>
                    <div className="text-xl flex my-4">
                        <p className="mr-4 w-1/5">todo</p>
                        <p className="mr-4 w-1/5">{batch.batchNumber}</p>
                        <p className="mr-4 w-1/5">
                            {batch.startDate.toISOString().split("T")[0]}
                        </p>
                        <p className="mr-4 w-1/5">
                            {batch.finishDate?.toISOString().split("T")[0]}
                        </p>
                        <div className="mr-4 w-1/5">
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
