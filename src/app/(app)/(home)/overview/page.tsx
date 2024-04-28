'use client';
import { pages } from '@/lib/utils/routes';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import Link from 'next/link';
import { useArticlesContext } from '@/components/hooks/articlesContext';
import { chunk } from 'lodash';
import Carousel from 'react-material-ui-carousel';
import { Card, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';

export default function OverviewPage() {
    const isXS = useMediaQuery('(max-width: 400px) and (min-width: 200px)') ? 1 : 0;
    const isSM = useMediaQuery('(max-width: 600px) and (min-width: 400px)') ? 2 : 0;
    const isMD = useMediaQuery('(max-width: 800px) and (min-width: 600px)') ? 3 : 0;
    const isLA = useMediaQuery('(min-width: 800px)') ? 5 : 0;
    const articlesColumns = useMemo(() => isXS + isSM + isMD + isLA, [isXS, isSM, isMD, isLA]);
    const { articles, error } = useArticlesContext();

    const chunkedArticles = chunk(articles, articlesColumns);

    return (
        <>
            <h2>Homepage</h2>
            <Carousel autoPlay={false}>
                {chunkedArticles.map((articleChunk, i) => (
                    <Grid container spacing={2} key={'chunk-' + i}>
                        {articleChunk &&
                            articleChunk.map(article => (
                                <Grid xs={12 / articlesColumns} key={article.id}>
                                    <Link
                                        href={pages.article + '?id=' + article.id}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'black',
                                        }}
                                    >
                                        <Card style={{ padding: '20px' }}>
                                            <span style={{ fontWeight: 'bold' }}>{article.name}</span>
                                            <p>{article.description}</p>
                                            <p style={{ fontWeight: 'bold' }}>{currencyFormatter(article.price)}</p>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))}
                    </Grid>
                ))}
            </Carousel>
            {error && <span>{error?.response?.data?.error}</span>}
        </>
    );
}
