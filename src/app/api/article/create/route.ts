import prisma from '@/lib/utils/prisma';
import { decode } from 'jsonwebtoken';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { createArticleBodySchema } from '@/lib/schemas/article.schema';
import { AuthorizationTokenSchema, cookieSchema } from '@/lib/schemas/common.schema';
import { authorizationCookieName } from '@/lib/utils/constants';

export const POST = asyncNextHandler(async req => {
    // extract creation data from request body
    const data = createArticleBodySchema.parse(await req.json());

    // extract Authorization Token and account details from request cookies
    const { value } = cookieSchema.parse(req.cookies.get(authorizationCookieName));
    const { id: userId, accountType } = AuthorizationTokenSchema.parse(decode(value));

    if (accountType !== 'business') {
        throw new StatusError(401, 'You are not permitted to add articles');
    }

    // create article in the database
    const createArticle = await prisma.article.create({
        data: {
            ...data,
            userId,
        },
    });

    if (!createArticle) {
        throw new StatusError(500, 'article could not be created');
    }

    return NextResponse.json(createArticle);
});
