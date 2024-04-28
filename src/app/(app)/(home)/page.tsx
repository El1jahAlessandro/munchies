'use client';

import { redirect } from 'next/navigation';
import { pages } from '@/lib/utils/routes';

export default function OverviewPage() {
    redirect(pages.home);
}
