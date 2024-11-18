"use client";

import { createBatch } from "../actions";

export function CreateBatchForm() {
    const handleNewBatch = async (formData: FormData) => {
        await createBatch(formData);
    };

    return (
        <div>
            <form action={handleNewBatch}>
                <label htmlFor="batchNumber">Batch number</label>
                <input type="text" name="batchNumber" id="batchNumber" />
                <br />
                <label htmlFor="startDate">Start date</label>
                <input type="text" name="startDate" id="startDate" />
                <br />
                <button type="submit">New Batch</button>
            </form>
        </div>
    );
}
