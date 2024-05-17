'use client';
import React, { ReactNode, useState } from 'react';
import BottomBar from '@/components/BottomBar/BottomBar';
import SideMenu, { MenuButton } from '@/components/SideMenu/SideMenu';
import ProfilePic from '@/components/ProfilePic/ProfilePic';

export default function RootLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <SideMenu {...{ open, toggleDrawer }} />
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <MenuButton {...{ toggleDrawer }} />
                <div>{/* Location Select */}</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ProfilePic />
                </div>
            </div>
            {children}
            <BottomBar />
        </>
    );
}
