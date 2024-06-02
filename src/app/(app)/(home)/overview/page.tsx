'use client';
import { pages } from '@/lib/utils/routes';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import Link from 'next/link';
import { ArticleWithCategoryType, useArticlesContext } from '@/components/hooks/articlesContext';
import { chunk } from 'lodash';
import Carousel from 'react-material-ui-carousel';
import { Card, Typography, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useMemo, useState } from 'react';
import { FlatIcon } from '@/components/common/FlatIcon';
import { Categories } from '@prisma/client';
import { CldImage } from 'next-cloudinary';

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
    const [carouselIndex, setCarouselIndex] = useState(0);

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
        setCarouselIndex(0);
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
            <Typography component={'h2'} typography={'h4'} style={{ fontWeight: 'bold' }}>
                Was möchtest du bestellen?
            </Typography>
            <div style={{ display: 'flex' }}>
                {categories &&
                    categories.length > 0 &&
                    sortCategories(categoryFilters ?? []).map(category => (
                        <div
                            key={category.id}
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
            <Carousel
                autoPlay={false}
                animation={'slide'}
                swipe={true}
                sx={{ marginTop: '20px' }}
                strictIndexing={true}
                index={carouselIndex}
                onChange={now => setCarouselIndex(now ?? 0)}
            >
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
                                        <Card sx={{ borderRadius: '15px' }}>
                                            <CldImage
                                                alt={article.name}
                                                src={article.picture}
                                                width={266}
                                                height={136}
                                                sizes={'(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                                                crop={'thumb'}
                                                aspectRatio={3 / 2}
                                                gravity={'center'}
                                                style={{ borderTopRightRadius: '15px', borderTopLeftRadius: '15px' }}
                                            />
                                            <div style={{ padding: '10px' }}>
                                                <div>
                                                    <Typography
                                                        component={'span'}
                                                        typography={'body1'}
                                                        style={{ fontWeight: 'bold' }}
                                                    >
                                                        {article.name}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography
                                                        component={'span'}
                                                        typography={'subtitle2'}
                                                        color={theme => theme.palette.secondary.main}
                                                    >
                                                        {currencyFormatter(article.price)}
                                                    </Typography>
                                                </div>
                                                <div style={{ display: 'flex', marginTop: '5px' }}>
                                                    {article.ArticleCategories.map(category => (
                                                        <div
                                                            style={{
                                                                borderRadius: '2px',
                                                                backgroundColor: '#F6F6F6',
                                                                padding: '0 5px',
                                                            }}
                                                        >
                                                            <Typography
                                                                component={'span'}
                                                                typography={'overline'}
                                                                color={theme => theme.palette.secondary.main}
                                                            >
                                                                {category.category.name}
                                                            </Typography>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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
