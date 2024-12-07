import { Button } from '@/components/ui/button';
import { SignInButton, SignedOut } from '@clerk/nextjs';
export default async function Home() {
    return (
        <>
            <div className='w-full text-center'>
                <h1 className='text-2xl font-bold p-4'>Kombucha brewery</h1>
                <p className='text-xl p-2'>Welcome! Please sign in below</p>
                <SignedOut>
                    <SignInButton forceRedirectUrl={'/dashboard'}>
                        <Button>Sign in</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </>
    );
}
