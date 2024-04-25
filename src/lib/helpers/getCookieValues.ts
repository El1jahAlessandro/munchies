import { AuthorizationTokenSchema, cookieSchema } from '@/lib/schemas/common.schema';
import { authorizationCookieName } from '@/lib/utils/constants';
import { decode } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

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
