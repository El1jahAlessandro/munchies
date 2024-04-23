import { NextResponse } from 'next/server';
import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { AuthorizationTokenSchema, cookieSchema } from '@/lib/schemas/common.schema';
import { User } from '@prisma/client';
import { prisma } from '@/lib/utils/prisma';
import { decode } from 'jsonwebtoken';
import { omit } from 'lodash';
import { authorizationCookieName } from '@/lib/utils/constants';

export const GET = asyncNextHandler<User>(async req => {
    const cookieData = cookieSchema.parse(req.cookies.get(authorizationCookieName));
    const userTokenData = AuthorizationTokenSchema.parse(decode(cookieData.value));
    const user = await prisma.user.findUnique({ where: { id: userTokenData.id } });

    if (!user) {
        const response = NextResponse.json({}, { status: 401 });
        response.cookies.delete(authorizationCookieName);

        return response;
    }

    return NextResponse.json(omit(user, ['password']), { status: 200 });
});
