'use client';
import React, { ReactNode, useState } from 'react';
import BottomBar from '@/components/BottomBar/BottomBar';
import SideMenu, { MenuButton } from '@/components/SideMenu/SideMenu';
import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { PageParams } from '@/lib/schemas/locale.schema';

export default function RootLayout(pageProps: { children: ReactNode } & PageParams) {
    const { children } = pageProps;
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <>
            <SideMenu {...{ open, toggleDrawer, pageProps }} />
            <div className={'flex justify-between w-full'}>
                <MenuButton {...{ toggleDrawer }} />
                <div>{/* Location Select */}</div>
                <div className={'flex justify-center items-center'}>
                    <ProfilePic />
                </div>
            </div>
            {children}
            <BottomBar pageProps={pageProps} />
        </>
    );
}
