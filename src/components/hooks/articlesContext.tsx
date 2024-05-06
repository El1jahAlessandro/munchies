'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { Article, ArticleCategories, Categories, User } from '@prisma/client';
import { api } from '@/lib/utils/routes';
import { getFetcher } from '@/lib/helpers/fetcher';
import { APIError } from '@/lib/schemas/common.schema';
import { uniqBy } from 'lodash';

export type ArticleWithCategoryType = Article & {
    ArticleCategories: (ArticleCategories & { category: Categories })[];
    user: User;
};

type ArticlesContext = {
    articles: ArticleWithCategoryType[] | undefined;
    categories: Categories[] | undefined;
    error: APIError | undefined;
};

const ArticlesContext = createContext<ArticlesContext>({
    articles: undefined,
    categories: undefined,
    error: undefined,
});

export function useArticlesContext() {
    const articlesContext = useContext(ArticlesContext);
    if (articlesContext === undefined) {
        throw new Error('useArticlesContext must be used within a CounterProvider');
    }
    return articlesContext;
}

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
    const {
        data: articles,
        error,
        isLoading,
    } = useSWR<ArticleWithCategoryType[], APIError>(api.article.get, getFetcher);

    const categories = useMemo(() => {
        return uniqBy(
            articles?.flatMap(article =>
                article.ArticleCategories.flatMap(articleCategory => articleCategory.category)
            ),
            'id'
        );
    }, [articles]);

    const value = useMemo(() => ({ articles, categories, error }), [articles, categories, error]);

    return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>;
};
