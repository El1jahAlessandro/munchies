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
            <div className={'flex justify-between w-full'}>
                <MenuButton {...{ toggleDrawer }} />
                <div>{/* Location Select */}</div>
                <div className={'flex justify-center items-center'}>
                    <ProfilePic />
                </div>
            </div>
            {children}
            <BottomBar />
        </>
    );
}
