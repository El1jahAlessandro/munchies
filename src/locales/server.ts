import { createI18nServer } from 'next-international/server';

export const { getCurrentLocale } = createI18nServer({
    en: () => import('./en'),
    de: () => import('./de'),
});
