import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Locales } from '@/lib/schemas/locale.schema';

export const pushWithLocale = (url: string, push: AppRouterInstance['push'], locale: Locales) =>
    push(`/${locale}${url}`);
