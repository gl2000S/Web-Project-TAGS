"use client";
import * as React from 'react';
import {useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from './Footer';
import Nav from './Nav';
import TAGS_logo from './TAGS_logo';
import Card from './Card';

export default function SplashPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
        handleSearch();
        }
    };
    const handleSearch = (e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        router.push('/authenticated');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Nav />

            {/* Hero Section */}
            {/* Mobile: Less padding (py-20), centered text */}
            <div className="px-4 py-20 md:py-48 bg-surface-alt flex flex-col items-center justify-center text-center">
                <TAGS_logo />
                <h2 className='text-xl md:text-2xl font-semibold p-5 text-text'>
                    The easiest way to find a job in Athens.
                </h2>
                
                {/* Search Bar Container */}
                {/* Mobile: Flex-col (Vertical stack) */}
                {/* Desktop: Flex-row (Side by side) */}
                <div className='p-5 gap-3 flex flex-col sm:flex-row items-center justify-center w-full max-w-2xl'>
                    <input
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder='Enter Job Title or Keywords...'
                        className='w-full sm:flex-1 outline-none border border-border-subtle bg-white rounded-lg px-4 py-3 transition focus:ring-2 focus:ring-secondary'
                    />
                    <button
                        onClick={handleSearch}
                        className='w-full sm:w-auto rounded-lg px-8 py-3 bg-primary text-white font-medium hover:bg-primary-hover transition focus:ring-2 focus:ring-secondary'
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Info Cards Section */}  
            <div className='flex flex-col items-center m-5'>
                <h2 className='text-2xl font-semibold p-5 text-text'>Why Us?</h2>

                <div className='m-5 gap-5 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl'>
                    <div className="w-full max-w-sm">
                        <Card title='Local' description='Built for Athens locals, by Athens locals.' />
                    </div>
                    <div className="w-full max-w-sm">
                        <Card title='Accessible' description='Easily filter by price, location, and more.' />
                    </div>
                    <div className="w-full max-w-sm">
                        <Card title='Direct' description='We work directly with companies to post listings.' />
                    </div>
                </div>
            </div>

            {/* Athens Image */}
            <div className='w-full'>
                <Image 
                    src='/dt-ath.jpg' 
                    alt='Image of downtown Athens' 
                    width={2048} 
                    height={1365}
                    className='w-full h-48 md:h-64 object-cover'
                />
            </div>

            <Footer />
        </div>
    );
}