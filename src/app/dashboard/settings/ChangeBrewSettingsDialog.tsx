'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { brewSettingsZodSchema } from '@/server/db/schema';
import { changeBrewSettings } from '@/app/actions';
import { toast } from 'sonner';

export function ChangeBrewSettingsDialog() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof brewSettingsZodSchema>>({
        resolver: zodResolver(brewSettingsZodSchema),
        defaultValues: {
            firstFermentationDays: 7,
            secondFermentationDays: 5,
            notificationEmail: '',
        },
    });

    const handleChangeSettings = async (values: z.infer<typeof brewSettingsZodSchema>) => {
        const result = await changeBrewSettings(values);
        if (result?.error) {
            toast(result.error);
        }
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className='my-4' asChild>
                <Button variant='japandi'>Change settings</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Change default fermentation times</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangeSettings)}>
                        <div className='my-4'>
                            <FormField
                                control={form.control}
                                name='firstFermentationDays'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First fermentation days</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='my-4'>
                                <FormField
                                    control={form.control}
                                    name='secondFermentationDays'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Second fermentation days</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='my-4'>
                                <FormField
                                    control={form.control}
                                    name='notificationEmail'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notification email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type='submit'>Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
