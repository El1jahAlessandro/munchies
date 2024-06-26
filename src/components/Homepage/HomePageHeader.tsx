'use client';
import { useI18n } from '@/locales/client';
import { Typography } from '@mui/material';

export default function HomePageHeader({}) {
    const t = useI18n();
    return (
        <Typography component={'h2'} typography={'h4'} className={'!font-bold'}>
            {t('homepage_top_text')}
        </Typography>
    );
}
