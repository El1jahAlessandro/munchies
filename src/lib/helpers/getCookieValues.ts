import { AuthorizationTokenSchema, cookieSchema } from '@/lib/schemas/common.schema';
import { decode } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { authorizationCookieName, cartCookieName } from '@/lib/utils/constants';
import { CartCookieTokenSchema } from '@/lib/schemas/article.schema';

function getCookieData(nextRequest: NextRequest, cookieName: string) {
    const cookieData = cookieSchema.safeParse(nextRequest.cookies.get(cookieName));
    if (cookieData.success) {
        return cookieData.data.value;
    }
}

export function getAuthCookieValue(nextRequest: NextRequest) {
    const cookieData = getCookieData(nextRequest, authorizationCookieName);
    if (cookieData) {
        const cookieValue = AuthorizationTokenSchema.safeParse(decode(cookieData));
        if (cookieValue.success) {
            return cookieValue.data;
        }
    }
    return { id: undefined, email: undefined, accountType: undefined };
}

export function getCartCookieValue(nextRequest: NextRequest) {
    const cookieData = getCookieData(nextRequest, cartCookieName);
    if (cookieData) {
        const cookieValue = CartCookieTokenSchema.safeParse(decode(cookieData));
        if (cookieValue.success) {
            return cookieValue.data;
        }
    }
    return { cartItems: [] };
}
