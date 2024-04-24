import { AuthorizationTokenSchema, cookieSchema } from '@/lib/schemas/common.schema';
import { authorizationCookieName } from '@/lib/utils/constants';
import { decode } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export default function getCookieValue(nextRequest: NextRequest) {
    const cookieData = cookieSchema.parse(nextRequest.cookies.get(authorizationCookieName));
    return AuthorizationTokenSchema.parse(decode(cookieData.value));
}
