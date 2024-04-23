'use client';
import React, { ReactNode, useState } from 'react';
import { useUserContext } from '@/components/hooks/userContext';
import BottomBar from '@/components/BottomBar/BottomBar';
import SideMenu, { MenuButton } from '@/components/SideMenu/SideMenu';
import ProfilePic from '@/components/ProfilePic/ProfilePic';

export default function RootLayout({ children }: { children: ReactNode }) {
    const { user } = useUserContext();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <>
                <MenuButton {...{ toggleDrawer }} />
                <SideMenu {...{ open, toggleDrawer }} />
            </>
            <ProfilePic {...user} />
            {children}
            <BottomBar />
        </>
    );
}
