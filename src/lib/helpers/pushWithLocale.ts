import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PageParams } from '@/lib/schemas/locale.schema';

export const pushWithLocale = (url: string, push: AppRouterInstance['push'], pageProps: PageParams) =>
    push(`/${pageProps.params.locale}${url}`);
