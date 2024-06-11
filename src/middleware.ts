import { NextRequest, NextResponse } from 'next/server';
import { pages } from '@/lib/utils/routes';
import { getAuthCookieValue } from '@/lib/helpers/getCookieValues';
import { localesSchema } from '@/lib/schemas/locale.schema';

function getUrlSplit(request: NextRequest) {
    const [, unknownLocale, ...path] = request.nextUrl.pathname.split('/');
    const localeParse = localesSchema.safeParse(unknownLocale);
    const locale = localeParse.data;
    const fallbackPath = !locale ? unknownLocale : undefined;

    return [locale, path.join('/'), fallbackPath];
}

const defaultLocale = 'de';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const [locale, path, fallbackPath] = getUrlSplit(req);

    const isAuthenticated = !!getAuthCookieValue(req).id;
    const onAuthenticationPage = [pages.login, pages.register].some(page => pathname.includes(page));
    const noLocalePath = ['api', '_next'].some(page => pathname.includes(page));

    /*   if (!noLocalePath) {
        console.log('pathname: ', pathname);
        console.log('locale: ', locale);
        console.log('path: ', path?.length);
        console.log('fallbackPath: ', fallbackPath);
        console.log('isAuthenticated: ', isAuthenticated);
        console.log('onAuthenticationPage: ', onAuthenticationPage);
        console.log('noLocalePath: ', noLocalePath);
        console.log("!locale && !path?.includes('/overview'): ", !locale && !path?.includes('/overview'));
        console.log('onAuthenticationPage && isAuthenticated: ', onAuthenticationPage && isAuthenticated);
        console.log('!locale && path?.length === 0: ', !locale || path?.length === 0);
        console.log('!isAuthenticated && !onAuthenticationPage: ', !isAuthenticated && !onAuthenticationPage);
    }*/

    if (noLocalePath) {
        req.nextUrl.pathname = `/${path}`;
        return NextResponse.redirect(req.nextUrl);
    }

    if (!locale || path?.length === 0 || (onAuthenticationPage && isAuthenticated)) {
        // Redirect to overview homepage when domain is visited
        req.nextUrl.pathname = `/${locale ?? defaultLocale}/${fallbackPath ?? pages.home}`;
        return NextResponse.redirect(req.nextUrl);
    }

    if (!isAuthenticated && !onAuthenticationPage) {
        // Redirect to login page if not authenticated
        req.nextUrl.pathname = `/${locale}${pages.login}`;
        return NextResponse.redirect(req.nextUrl);
    }

    // If the user is authenticated or on an login/register page, continue as normal
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api).*)'],
};
