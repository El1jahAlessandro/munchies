'use client';
import React, { PropsWithChildren } from 'react';
import BottomBar from '@/components/BottomBar/BottomBar';
import TopBar from '@/components/TopBar/TopBar';

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <>
            <TopBar />
            {children}
            <BottomBar />
        </>
    );
}
