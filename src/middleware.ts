import { NextRequest } from 'next/server';
import { pages } from '@/lib/utils/routes';

export function middleware(req: NextRequest) {
    // TODO: fix this
    /*const isAuthenticated = req.cookies.has(authorizationCookieName);

    // If the user is authenticated or on an login/register page, continue as normal
    if (isAuthenticated || ['/login', '/register', '/api'].some(page => req.nextUrl.pathname.startsWith(page))) {
        return NextResponse.next();
    }

    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/login', req.url));*/
}

export const config = {
    matcher: ['/((?!_next|api).*)(.+)', pages.home],
};
