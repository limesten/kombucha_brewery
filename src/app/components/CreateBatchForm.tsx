"use client";

import { useState } from "react";
import { createBatch } from "../actions";
import { toast } from "sonner";

export function CreateBatchForm() {
    const [formVisible, setFormVisible] = useState(false);

    const handleNewBatch = async (formData: FormData) => {
        if (formVisible) {
            const result = await createBatch(formData);
            if (result?.error) {
                toast(result.error);
            }
            setFormVisible(false);
        } else {
            setFormVisible(true);
        }
    };

    const handleCancel = () => {
        setFormVisible(false);
    };

    return (
        <div className="text-xl">
            <form action={handleNewBatch}>
                {formVisible && (
                    <>
                        <label htmlFor="batchNumber">Batch number</label>
                        <input
                            type="text"
                            name="batchNumber"
                            id="batchNumber"
                            className="m-2 bg-creamy-white border-b-moss-green border-b-2"
                        />
                        <br />
                        <label htmlFor="startDate">Start date</label>
                        <input
                            type="text"
                            name="startDate"
                            id="startDate"
                            className="m-2 bg-creamy-white border-b-moss-green border-b-2"
                        />
                        <br />
                    </>
                )}
                <div className="w-full flex justify-center">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-earthy-clay to-warm-taupe hover:bg-gradient-to-br text-white rounded-lg p-2 m-2"
                    >
                        {formVisible ? "Submit" : "New Batch"}
                    </button>
                    {formVisible && (
                        <button
                            onClick={handleCancel}
                            className="bg-gradient-to-r from-earthy-clay to-warm-taupe hover:bg-gradient-to-br text-white rounded-lg p-2 m-2"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
