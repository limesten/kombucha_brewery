'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const FormSchema = z.object({
    selectedDate: z.date({
        required_error: 'A date is required',
    }),
});

export function DatePickerDialog({
    props,
    onSelectedDate,
    onOpenChange,
}: {
    props: { show: boolean; newStatus: string };
    onSelectedDate: (value: Date, newStatus: string) => void;
    onOpenChange: (isOpen: boolean) => void;
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const handleSubmitDate = async (values: z.infer<typeof FormSchema>) => {
        const validatedFields = FormSchema.safeParse({
            selectedDate: values.selectedDate,
        });
        if (!validatedFields.success) {
            let errorMessage = '';

            validatedFields.error.issues.forEach((issue) => {
                errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '.';
            });

            toast(errorMessage);
            return;
        }
        onSelectedDate(validatedFields.data.selectedDate, props.newStatus);
    };

    return (
        <Dialog open={props.show} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Select date</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitDate)}>
                        <FormField
                            control={form.control}
                            name='selectedDate'
                            render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Pick a date below</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-[240px] pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0' align='start'>
                                            <Calendar
                                                mode='single'
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type='submit'>Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
