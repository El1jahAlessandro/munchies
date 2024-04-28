import { AuthorizationTokenSchema, cookieSchema } from '@/lib/schemas/common.schema';
import { decode } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

function getCookieData(nextRequest: NextRequest, cookieName: string) ⁄

export default function getCookieValue(nextRequest: NextRequest) {
    const cookieData = cookieSchema.safeParse(nextRequest.cookies.get(authorizationCookieName));
    if (cookieData.success) {
        const cookieValue = AuthorizationTokenSchema.safeParse(decode(cookieData.data.value));
        if (cookieValue.success) {
            return cookieValue.data;
        }
    }
    return { id: undefined, email: undefined, accountType: undefined };
}
