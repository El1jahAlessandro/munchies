'use client';
import React, { ReactNode } from 'react';
import { ProfilePic } from '@/components/ProfilePic/ProfilePic';
import { useUserContext } from '@/components/hooks/userContext';

export default function RootLayout({ children }: { children: ReactNode }) {
    const { user } = useUserContext();
    return (
        <>
            <ProfilePic {...user} />
            {children}
        </>
    );
}
