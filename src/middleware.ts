import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { localesSchema } from '@/lib/schemas/locale.schema';
import { pages } from '@/lib/utils/routes';

function getUrlSplit(request: NextRequest) {
    const [, unknownLocale, ...path] = request.nextUrl.pathname.split('/');
    const localeParse = localesSchema.safeParse(unknownLocale);
    const locale = localeParse.data;
    const fallbackPath = !locale ? unknownLocale : undefined;

    return [locale, path.join('/'), fallbackPath];
}

const hasLocale = (request: NextRequest) => locales.some(locale => request.nextUrl.pathname.includes(locale));

const locales = ['de', 'en'];
const defaultLocale = 'de';

const intlMiddleware = createI18nMiddleware({
    locales,
    defaultLocale,
    urlMappingStrategy: 'redirect',
});

const protectedPageRoutes = ['(.*)/profile', '((?!_next|api).*)/cart', '((?!_next|api).*)/orders'];
const protectedApiRoutes = ['(.*)/api/user/(!create|auth)(.*)', '(.*)/api/orders/(.*)', '(.*)/api/cart/(.*)'];

const isProtectedPageRoute = createRouteMatcher(protectedPageRoutes);
const isProtectedApiRoute = createRouteMatcher(protectedApiRoutes);
const isLocaleRoute = createRouteMatcher([
    '(.*)/overview(.*)',
    '((?!_next|api).*)/article(.*)',
    ...protectedPageRoutes,
]);
const isApiRoute = createRouteMatcher(['(.*)/api(.*)']);

export default clerkMiddleware((auth, req, event) => {
    const [locale, path, fallbackPath] = getUrlSplit(req);
    if (isApiRoute(req)) {
        if (hasLocale(req)) {
            req.nextUrl.pathname = `/${path}`;
            return NextResponse.redirect(req.nextUrl);
        }

        if (isProtectedApiRoute(req)) auth().protect();

        return NextResponse.next();
    }

    if (!locale || path?.length === 0) {
        // Redirect to overview homepage when domain is visited
        req.nextUrl.pathname = `/${locale ?? defaultLocale}/${fallbackPath ?? pages.home}`;
        return NextResponse.redirect(req.nextUrl);
    }

    if (isProtectedPageRoute(req)) auth().protect();

    if (isLocaleRoute(req)) {
        return intlMiddleware(req);
    }
});

export const config = {
    matcher: ['/((?!_next).*)'],
};
