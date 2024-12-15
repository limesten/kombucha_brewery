import { getBatchesByStatusQuery } from '@/server/queries';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteBatch } from '@/app/actions';

export default async function Page() {
    const batches = await getBatchesByStatusQuery('Finished');

    return (
        <>
            <table className='min-w-full text-xl my-4'>
                <thead>
                    <tr className='text-secondary-gray bg-accent-green'>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Container</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Batch</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Started</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>Finished</th>
                        <th className='px-4 py-2 text-left border border-accent-darkgreen'>More</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.length === 0 ? (
                        <tr>
                            <td colSpan={6} className='text-center py-4 text-secondary-gray'>
                                Nothing here at the moment...
                            </td>
                        </tr>
                    ) : (
                        batches.map((batch) => (
                            <tr key={batch.id} className='text-secondary-gray'>
                                <td className='px-4 py-2 border border-accent-darkgreen'>{batch.brewingVessel}</td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>{batch.batchNumber}</td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>
                                    {batch.startDate.toISOString().split('T')[0]}
                                </td>
                                <td className='px-4 py-2 border border-accent-darkgreen'>
                                    {batch.finishDate?.toISOString().split('T')[0]}
                                </td>
                                <td className='px-4 py-2 border border-accent-darkgreen text-center'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='japandi'>...</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='bg-primary-bg'>
                                            <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await deleteBatch(batch.id);
                                                    }}
                                                >
                                                    <button>Delete batch</button>
                                                </form>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}
