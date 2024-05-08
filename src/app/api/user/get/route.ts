import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import prisma from '@/lib/utils/prisma';
import { getAuthCookieValue } from '@/lib/helpers/getCookieValues';
import { getUserInputArgs, UserResponseType } from '@/lib/schemas/user.schema';

export const GET = asyncNextHandler<UserResponseType>(async req => {
    const { id } = getAuthCookieValue(req);

    if (!id) {
        throw new StatusError(401, 'You are not authorized to order');
    }

    const user = await prisma.user.findUnique({
        where: { id },
        ...getUserInputArgs,
    });

    if (!user) {
        throw new StatusError(401, 'You are not logged in');
    }

    return NextResponse.json(user, { status: 200 });
});
