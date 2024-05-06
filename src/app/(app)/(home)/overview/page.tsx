'use client';
import { pages } from '@/lib/utils/routes';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import Link from 'next/link';
import { ArticleWithCategoryType, useArticlesContext } from '@/components/hooks/articlesContext';
import { chunk } from 'lodash';
import Carousel from 'react-material-ui-carousel';
import { Card, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useMemo, useState } from 'react';
import { FlatIcon } from '@/components/common/FlatIcon';
import { Categories } from '@prisma/client';
import { toPascalCase } from '@/lib/helpers/toPascalCase';

type CategoryFiltersType = {
    isFiltered: boolean;
} & Categories;

export default function OverviewPage() {
    const isXS = useMediaQuery('(max-width: 400px) and (min-width: 200px)') ? 1 : 0;
    const isSM = useMediaQuery('(max-width: 600px) and (min-width: 400px)') ? 2 : 0;
    const isMD = useMediaQuery('(max-width: 800px) and (min-width: 600px)') ? 3 : 0;
    const isLA = useMediaQuery('(min-width: 800px)') ? 5 : 0;
    const articlesColumns = useMemo(() => isXS + isSM + isMD + isLA, [isXS, isSM, isMD, isLA]);
    const { articles, categories, error } = useArticlesContext();
    const [filteredCategories, setFilteredCategories] = useState<number[]>([]);

    const categoryFilters: CategoryFiltersType[] | undefined = useMemo(
        () =>
            categories?.map(category => {
                return {
                    ...category,
                    isFiltered: filteredCategories.includes(category.id),
                };
            }),
        [categories, filteredCategories]
    );

    const handleFilterChange = (category: CategoryFiltersType) => {
        if (category.isFiltered) {
            setFilteredCategories(prevFilter => prevFilter.filter(filter => filter !== category.id));
        } else {
            setFilteredCategories(prevFilter => [...prevFilter, category.id]);
        }
    };

    function filterArticles(articles: ArticleWithCategoryType[] | undefined) {
        return articles?.filter(article => {
            if (!filteredCategories.length) return article;
            return filteredCategories.every(filter =>
                article.ArticleCategories.some(category => category.category.id === filter)
            );
        });
    }

    function sortCategories(categories: CategoryFiltersType[]) {
        return categories.sort((a, b) => {
            if (a.isFiltered) return -1;
            if (b.isFiltered) return 1;
            return b.id - a.id;
        });
    }

    const chunkedArticles = chunk(filterArticles(articles), articlesColumns);

    return (
        <>
            <h2>Homepage</h2>
            <span className={'font-bold'}>test</span>
            <FlatIcon icon={'hamburger'} />
            <div style={{ display: 'flex' }}>
                {categories &&
                    categories.length > 0 &&
                    sortCategories(categoryFilters ?? []).map(category => (
                        <div
                            style={{
                                border: '1px solid black',
                                borderRadius: '20%',
                                marginRight: '20px',
                                ...(category.isFiltered ? { fontWeight: 'bold' } : {}),
                            }}
                            onClick={() => handleFilterChange(category)}
                        >
                            <FlatIcon icon={category.icon} />
                            <div>{category.name}</div>
                        </div>
                    ))}
            </div>
            <Carousel autoPlay={false} animation={'slide'} swipe={true}>
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
                                            <span style={{ fontWeight: 'bold' }}>
                                                {toPascalCase(article.ArticleCategories[0].category.name)}
                                            </span>
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
