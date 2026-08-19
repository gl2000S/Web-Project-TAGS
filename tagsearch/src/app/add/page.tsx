"use client";

import React from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import AddForm from '../../components/AddForm';

export default function AddPage() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-alt">
            <Nav />

            <main className="grow flex flex-col items-center pt-16 pb-16 px-4 w-full">
                
                <h1 className="text-4xl md:text-5xl font-bold text-text mb-10 text-center">
                    Looking to hire?
                </h1>
                <AddForm />
            </main>

            <Footer />
        </div>
    );
}