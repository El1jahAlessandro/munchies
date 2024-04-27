import { NextResponse } from 'next/server';
import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { User } from '@prisma/client';
import { omit } from 'lodash';
import { authorizationCookieName } from '@/lib/utils/constants';
import getCookieValue from '@/lib/helpers/getCookieValues';
import prisma from '@/lib/utils/prisma';

export const GET = asyncNextHandler<User>(async req => {
    const { id } = getCookieValue(req);

    if (!id) {
        return NextResponse.json({}, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        const response = NextResponse.json({}, { status: 401 });
        response.cookies.delete(authorizationCookieName);

        return response;
    }

    return NextResponse.json(omit(user, ['password']), { status: 200 });
});
