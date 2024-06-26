'use client';
import SideMenu, { MenuButton } from '@/components/TopBar/SideMenu';
import ProfilePic from '@/components/common/ProfilePic';
import React, { useState } from 'react';

export default function TopBar() {
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
        </>
    );
}
