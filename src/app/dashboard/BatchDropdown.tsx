'use client';

import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteBatch, updateBatch } from '@/app/actions';
import { CompleteBatchDialog } from '@/app/dashboard/CompleteBatchDialog';
import { DatePickerDialog } from '../_components/DatePickerDialog';
import { Batch } from '@/server/db/schema';
import { toast } from 'sonner';
import { PROD_STATUS } from '@/constants';

export function BatchDropdown({ batch }: { batch: Batch }) {
    const [completeBatchDialog, setCompleteBatchDialog] = useState(false);

    const [datePickerDialog, setDatePickerDialog] = useState({
        show: false,
        newStatus: '',
    });

    const handleCompleteBatch = async () => {
        setDatePickerDialog({
            show: true,
            newStatus: PROD_STATUS.FINISHED,
        });
    };

    const handleMoveToFirstFermentation = async () => {
        setDatePickerDialog({
            show: true,
            newStatus: PROD_STATUS.FIRST_FERMENTATION,
        });
    };

    const handleMoveToSecondFermentation = async () => {
        setDatePickerDialog({
            show: true,
            newStatus: PROD_STATUS.SECOND_FERMENTATION,
        });
    };

    const handleSelectedDate = async (selectedDate: Date, status: string) => {
        setDatePickerDialog({
            show: false,
            newStatus: '',
        });
        if (status == PROD_STATUS.FIRST_FERMENTATION) {
            batch.status = PROD_STATUS.FIRST_FERMENTATION;
            batch.startDate = selectedDate;
        } else if (status == PROD_STATUS.SECOND_FERMENTATION) {
            batch.status = PROD_STATUS.SECOND_FERMENTATION;
            batch.secondFermentationStart = selectedDate;
        } else if (status == PROD_STATUS.FINISHED) {
            batch.status = PROD_STATUS.FINISHED;
            batch.finishDate = selectedDate;
        }

        const result = await updateBatch(batch);
        if (result?.error) {
            toast(result.error);
        }
    };

    const closeDatePickerDialog = () => {
        setDatePickerDialog({
            show: false,
            newStatus: '',
        });
    };

    const handleDeleteBatch = async (id: number) => {
        const result = await deleteBatch(id);
        if (result?.error) {
            toast(result.error);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='japandi'>...</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-primary-bg text-secondary-gray'>
                    <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {batch && batch.status == PROD_STATUS.FIRST_FERMENTATION ? (
                        <DropdownMenuItem>
                            <button onClick={handleMoveToSecondFermentation}>Move to second fermentation</button>
                        </DropdownMenuItem>
                    ) : batch && batch.status == PROD_STATUS.SECOND_FERMENTATION ? (
                        <DropdownMenuItem>
                            <button onClick={handleMoveToFirstFermentation}>Move to first fermentation</button>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem>
                        <button onClick={handleCompleteBatch}>Complete batch</button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <button onClick={() => handleDeleteBatch(batch.id)}>Delete batch</button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DatePickerDialog
                props={datePickerDialog}
                onSelectedDate={handleSelectedDate}
                onOpenChange={closeDatePickerDialog}
            />

            <CompleteBatchDialog open={completeBatchDialog} onOpenChange={setCompleteBatchDialog} batch={batch} />
        </>
    );
}
