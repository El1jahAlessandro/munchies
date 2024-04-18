'use client';
import useSWR from 'swr';
import { Article } from '@prisma/client';
import { fetcher } from '@/lib/helpers/fetcher';
import { api, pages } from '@/lib/utils/routes';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { APIError } from '@/lib/schemas/common.schema';
import { useUserContext } from '@/components/hooks/userContext';
import { ProfilePic } from '@/components/ProfilePic/ProfilePic';

export default function HomePage() {
    const { user } = useUserContext();
    const { data, error, isLoading } = useSWR<Article[], APIError>(api.article.get.all, fetcher);
    return (
        <>
            <h2>Homepage</h2>
            {user && <ProfilePic {...user} />}
            <div style={{ marginTop: '20px', display: 'flex' }}>
                {data &&
                    data.map(article => (
                        <a
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
                        </a>
                    ))}
                {error && <span>{error?.response?.data?.error}</span>}
            </div>
        </>
    );
}
