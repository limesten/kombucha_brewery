'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export function TopNav() {
    const pathname = usePathname();

    return (
        <nav className='w-full grid grid-cols-3 py-4 text-secondary-gray'>
            <div className='flex col-span-2'>
                <Link href='/dashboard'>
                    <h2
                        className={`text-xl font-semibold mr-4 ${
                            pathname === '/dashboard' ? 'border-b-2 border-secondary-gray' : ''
                        } hover:border-b-2 hover:border-secondary-gray`}
                    >
                        In production
                    </h2>
                </Link>
                <Link href='/dashboard/past-production'>
                    <h2
                        className={`text-xl font-semibold mr-4 ${
                            pathname === '/dashboard/past-production' ? 'border-b-2 border-secondary-gray' : ''
                        } hover:border-b-2 hover:border-secondary-gray`}
                    >
                        Past production
                    </h2>
                </Link>
                <Link href='/dashboard/settings'>
                    <h2
                        className={`text-xl font-semibold ${
                            pathname === '/dashboard/settings' ? 'border-b-2 border-secondary-gray' : ''
                        } hover:border-b-2 hover:border-secondary-gray`}
                    >
                        Settings
                    </h2>
                </Link>
            </div>
            <div className='flex justify-end'>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
}
