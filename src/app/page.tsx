'use client';
import useSWR from 'swr';
import { Article } from '@prisma/client';
import { AxiosError } from 'axios';
import { fetcher } from '@/helpers/fetcher';
import { api } from '@/utils/routes';
import { currencyFormatter } from '@/helpers/currencyFormatter';

export default function HomePage() {
    const { data, error, isLoading } = useSWR<Article[], AxiosError>(api.article.get.all, fetcher);
    return (
        <>
            <h2>Homepage</h2>
            <div style={{ marginTop: '20px', display: 'flex' }}>
                {data &&
                    data.map(article => (
                        <div
                            key={article.id}
                            style={{ border: '1px solid black', marginRight: '20px', padding: '20px' }}
                        >
                            <span style={{ fontWeight: 'bold' }}>{article.name}</span>
                            <p>{article.description}</p>
                            <p style={{ fontWeight: 'bold' }}>{currencyFormatter(article.price)}</p>
                        </div>
                    ))}
            </div>
        </>
    );
}
