import { prisma } from '@/utils/prisma';
import { asyncNextHandler, StatusError } from '@/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { Article } from '@prisma/client';
import { z } from 'zod';

export const GET = asyncNextHandler<Article>(async req => {
    const { id } = z.object({ id: z.coerce.number() }).parse(await req.json());

    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
        throw new StatusError(500, 'article could not be found');
    }

    return NextResponse.json(article, { status: 200 });
});
