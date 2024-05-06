import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { Article } from '@prisma/client';
import prisma from '@/lib/utils/prisma';

export const GET = asyncNextHandler<Article[]>(async () => {
    const allArticles = await prisma.article.findMany({
        include: {
            ArticleCategories: {
                include: {
                    category: true,
                },
            },
            user: true,
        },
    });

    if (!allArticles.length) {
        throw new StatusError(500, 'articles could not be found');
    }

    return NextResponse.json(allArticles, { status: 200 });
});
