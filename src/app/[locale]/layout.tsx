import React, { PropsWithChildren } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { UserProvider } from '@/components/hooks/userContext';
import { ArticlesProvider } from '@/components/hooks/articlesContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';
import { CartProvider } from '@/components/hooks/cartContext';
import '../../css/global.css';
import { StyledEngineProvider } from '@mui/styled-engine';
import { PageParams } from '@/lib/schemas/locale.schema';
import { I18nProviderClient } from '@/locales/client';
import { ClerkProvider } from '@clerk/nextjs';
import { deDE, enUS } from '@clerk/localizations';

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
};

const clerkLocales = {
    de: deDE,
    en: enUS,
};

export default async function RootLayout({ children, params: { locale } }: PropsWithChildren<PageParams>) {
    return (
        <html lang={locale}>
            <ClerkProvider localization={clerkLocales[locale]}>
                <AppRouterCacheProvider>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            <UserProvider>
                                <ArticlesProvider>
                                    <CartProvider>
                                        <I18nProviderClient locale={locale}>
                                            <body className={'m-[20px]'}>{children}</body>
                                        </I18nProviderClient>
                                    </CartProvider>
                                    <CssBaseline />
                                </ArticlesProvider>
                            </UserProvider>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </AppRouterCacheProvider>
            </ClerkProvider>
        </html>
    );
}
