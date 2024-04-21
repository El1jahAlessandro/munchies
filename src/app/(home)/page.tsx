'use client';
import { pages } from '@/lib/utils/routes';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import Link from 'next/link';
import { useArticlesContext } from '@/components/hooks/articlesContext';

export default function HomePage() {
    const { articles, error } = useArticlesContext();
    return (
        <>
            <h2>Homepage</h2>
            <div style={{ marginTop: '20px', display: 'flex' }}>
                {articles &&
                    articles.map(article => (
                        <Link
                            href={pages.article + '?id=' + article.id}
                            key={article.id}
                            style={{
                                border: '1px solid black',
                                marginRight: '20px',
                                padding: '20px',
                                textDecoration: 'none',
                                color: 'black',
                            }}
                        >
                            <span style={{ fontWeight: 'bold' }}>{article.name}</span>
                            <p>{article.description}</p>
                            <p style={{ fontWeight: 'bold' }}>{currencyFormatter(article.price)}</p>
                        </Link>
                    ))}
                {error && <span>{error?.response?.data?.error}</span>}
            </div>
        </>
    );
}
