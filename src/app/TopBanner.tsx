'use client';

export function TopBanner() {
    return (
        <div className='w-full h-28 bg-accent-darkgreen'>
            <div className='h-full container mx-auto max-w-[800px] flex items-center justify-between'>
                <h1 className='text-6xl text-primary-bg font-handwritten'>Kombucha Brewery</h1>
                <p className='text-xl text-primary-bg'>Production tracker</p>
            </div>
        </div>
    );
}
