'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { Article } from '@prisma/client';
import { api } from '@/lib/utils/routes';
import { getFetcher } from '@/lib/helpers/fetcher';
import { APIError } from '@/lib/schemas/common.schema';

type ArticlesContext = { articles: Article[] | undefined; error: APIError | undefined };

const ArticlesContext = createContext<ArticlesContext>({ articles: undefined, error: undefined });

export function useArticlesContext() {
    const articlesContext = useContext(ArticlesContext);
    if (articlesContext === undefined) {
        throw new Error('useArticlesContext must be used within a CounterProvider');
    }
    return articlesContext;
}

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
    const { data: articles, error, isLoading } = useSWR<Article[], APIError>(api.article.get, getFetcher);

    const value = useMemo(() => ({ articles, error }), [articles, error]);

    return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
};
