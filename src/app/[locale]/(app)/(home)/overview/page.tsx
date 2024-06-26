import Articles from '@/components/Homepage/Articles';
import React from 'react';
import HomePageHeader from '@/components/Homepage/HomePageHeader';

export default async function OverviewPage() {
    return (
        <>
            <HomePageHeader />
            <Articles />
        </>
    );
}
