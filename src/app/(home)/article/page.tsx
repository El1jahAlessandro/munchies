'use client';
import { useSearchParams } from 'next/navigation';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { useArticlesContext } from '@/components/hooks/articlesContext';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const articleId = searchParams.get('id');
    const { articles, error } = useArticlesContext();
    const article = articles?.find(article => article.id === Number(articleId));
    return (
        <>
            {article && (
                <>
                    <h1>{article.name}</h1>
                    <p>{article.description}</p>
                    <p>{article.ingredients}</p>
                    <span style={{ fontWeight: 'bold' }}>{currencyFormatter(article.price)}</span>
                </>
            )}
            {error && <span>{error?.response?.data?.error}</span>}
        </>
    );
}
