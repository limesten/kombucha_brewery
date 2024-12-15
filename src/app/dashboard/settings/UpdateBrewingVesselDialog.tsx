'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { BrewingVessel, brewingVesselZodSchema } from '@/server/db/schema';
import { toast } from 'sonner';
import { deleteBrewingVessel, updateBrewingVessel } from '@/app/actions';

export function UpdateBrewingVesselDialog({
    brewingVessel,
    brewingVesselDialog,
    setBrewingVesselDialog,
}: {
    brewingVessel: BrewingVessel;
    brewingVesselDialog: boolean;
    setBrewingVesselDialog: (open: boolean) => void;
}) {
    const form = useForm<z.infer<typeof brewingVesselZodSchema>>({
        resolver: zodResolver(brewingVesselZodSchema),
        defaultValues: {
            name: brewingVessel.name,
        },
        values: {
            name: brewingVessel.name,
        },
    });

    const handleUpdateBrewingVessel = async (values: z.infer<typeof brewingVesselZodSchema>) => {
        const validatedFields = brewingVesselZodSchema.safeParse({
            name: values.name,
        });
        if (!validatedFields.success) {
            let errorMessage = '';

            validatedFields.error.issues.forEach((issue) => {
                errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '.';
            });

            toast(errorMessage);
            return;
        }
        brewingVessel.name = validatedFields.data.name;
        const result = await updateBrewingVessel(brewingVessel);
        if (result?.error) {
            toast(result.error);
        }
        setBrewingVesselDialog(false);
    };

    const handleDeleteBrewingVessel = async () => {
        const result = await deleteBrewingVessel(brewingVessel);
        if (result?.error) {
            toast(result.error);
        }
    };

    return (
        <Dialog open={brewingVesselDialog} onOpenChange={setBrewingVesselDialog}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Update brewing vessel</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateBrewingVessel)}>
                        <div className='my-4'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleDeleteBrewingVessel} variant='japandi'>
                                Delete brewing vessel
                            </Button>
                            <Button type='submit' variant='japandi'>
                                Save brewing vessel
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
