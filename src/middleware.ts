import { NextRequest, NextResponse } from 'next/server';
import { pages } from '@/lib/utils/routes';
import { getAuthCookieValue } from '@/lib/helpers/getCookieValues';

export function middleware(req: NextRequest) {
    const isAuthenticated = !!getAuthCookieValue(req).id;
    const onAuthenticationPage = req.nextUrl.pathname === pages.login || req.nextUrl.pathname === pages.register;

    if (!isAuthenticated && !onAuthenticationPage) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL(pages.login, req.url));
    }

    if (req.nextUrl.pathname === '/' || (onAuthenticationPage && isAuthenticated)) {
        // Redirect to overview homepage when domain is visited
        return NextResponse.redirect(new URL(pages.home, req.url));
    }

    // If the user is authenticated or on an login/register page, continue as normal
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api).*)'],
};
