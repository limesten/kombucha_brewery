"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteBatch } from "./actions";
import { CompleteBatchDialog } from "./CompleteBatchDialog";
import { Batch } from "@/server/db/schema";

export function BatchDropdown({ batch }: { batch: Batch }) {
    const [completeBatchDialog, setCompleteBatchDialog] = useState(false);

    const handleCompleteBatch = async () => {
        setCompleteBatchDialog(true);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">...</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <button onClick={handleCompleteBatch}>Complete batch</button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <button onClick={() => deleteBatch(batch.id)}>
                            Delete batch
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CompleteBatchDialog
                open={completeBatchDialog}
                onOpenChange={setCompleteBatchDialog}
                batch={batch}
            />
        </>
    );
}
