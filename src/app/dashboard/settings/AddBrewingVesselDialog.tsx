'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { brewingVesselZodSchema } from '@/server/db/schema';
import { addBrewingVessel } from '@/app/actions';
import { toast } from 'sonner';

export function AddBrewingVesselDialog({
    brewingVesselDialog,
    setBrewingVesselDialog,
}: {
    brewingVesselDialog: boolean;
    setBrewingVesselDialog: (open: boolean) => void;
}) {
    const form = useForm<z.infer<typeof brewingVesselZodSchema>>({
        resolver: zodResolver(brewingVesselZodSchema),
        defaultValues: {
            name: '',
        },
    });

    const handleNewBrewingVessel = async (values: z.infer<typeof brewingVesselZodSchema>) => {
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
        const result = await addBrewingVessel(validatedFields.data);
        if (result?.error) {
            toast(result.error);
        }
        setBrewingVesselDialog(false);
    };

    return (
        <Dialog open={brewingVesselDialog} onOpenChange={setBrewingVesselDialog}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Add brewing vessel</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleNewBrewingVessel)}>
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
                            <Button type='submit'>Add brewing vessel</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
