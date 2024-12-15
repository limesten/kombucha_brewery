import { Button } from '@/components/ui/button';
import { SignInButton, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
    const { userId } = await auth();

    if (userId) {
        redirect('/dashboard');
    }

    return (
        <>
            <div className='w-full text-center py-4'>
                <p className='text-xl text-secondary-gray p-2 mb-4'>Welcome! Please sign in below</p>
                <SignedOut>
                    <SignInButton forceRedirectUrl={'/dashboard'}>
                        <Button variant='japandi' size='lg'>
                            Sign in
                        </Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </>
    );
}
