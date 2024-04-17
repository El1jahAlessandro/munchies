'use client';
import { api } from '@/utils/routes';
import useSWR from 'swr';
import { Article } from '@prisma/client';
import { fetcher } from '@/helpers/fetcher';
import { useSearchParams } from 'next/navigation';
import { currencyFormatter } from '@/helpers/currencyFormatter';
import { APIError } from '@/schemas/common.schema';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const { data, error, isLoading } = useSWR<Article, APIError>(
        api.article.get.byId + `?id=${searchParams.get('id')}`,
        fetcher
    );
    return (
        <>
            {data && (
                <>
                    <h1>{data.name}</h1>
                    <p>{data.description}</p>
                    <p>{data.ingredients}</p>
                    <span style={{ fontWeight: 'bold' }}>{currencyFormatter(data.price)}</span>
                </>
            )}
            {error && <span>{error?.response?.data?.error}</span>}
        </>
    );
}
