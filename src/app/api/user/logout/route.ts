import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { authorizationCookieName, cartCookieName } from '@/lib/utils/constants';

export const POST = asyncNextHandler(async req => {
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.delete(authorizationCookieName);
    response.cookies.delete(cartCookieName);

    return response;
});
