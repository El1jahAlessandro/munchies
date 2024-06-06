'use client';
import { pages } from '@/lib/utils/routes';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import Link from 'next/link';
import { ArticleWithCategoryType, useArticlesContext } from '@/components/hooks/articlesContext';
import { Card, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { FlatIcon } from '@/components/common/FlatIcon';
import { Categories } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import theme from '@/theme';
import { toPascalCase } from '@/lib/helpers/toPascalCase';

type CategoryFiltersType = {
    isFiltered: boolean;
} & Categories;

export default function OverviewPage() {
    const { articles, categories, error } = useArticlesContext();
    const [filteredCategories, setFilteredCategories] = useState<number[]>([]);
    const categoriesBoxRef = useRef<HTMLDivElement>(null);
    const articlesBoxRef = useRef<HTMLDivElement>(null);

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
        categoriesBoxRef && categoriesBoxRef.current ? (categoriesBoxRef.current.scrollLeft = 0) : null;
        articlesBoxRef && articlesBoxRef.current ? (articlesBoxRef.current.scrollLeft = 0) : null;
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

    return (
        <>
            <Typography component={'h2'} typography={'h4'} style={{ fontWeight: 'bold' }}>
                Was möchtest du bestellen?
            </Typography>
            <div
                style={{ display: 'flex', gap: '20px', marginTop: '20px', overflowX: 'scroll', padding: '0 0 5px 5px' }}
                ref={categoriesBoxRef}
            >
                {categories &&
                    categories.length > 0 &&
                    sortCategories(categoryFilters ?? []).map(category => (
                        <div
                            key={category.id}
                            style={{
                                padding: '10px 0',
                            }}
                            onClick={() => handleFilterChange(category)}
                        >
                            <div
                                style={{
                                    width: '70px',
                                    padding: '5px',
                                    borderTopRightRadius: '50%',
                                    borderTopLeftRadius: '50%',
                                    position: 'relative',
                                    zIndex: 5,
                                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px -2px 3px',
                                    ...(category.isFiltered ? { backgroundColor: theme.palette.primary.main } : {}),
                                }}
                            >
                                <div
                                    style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        backgroundColor: 'white',
                                        padding: '5px',
                                    }}
                                >
                                    <FlatIcon icon={category.icon} />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '70px',
                                    height: '70px',
                                    marginTop: '-20px',
                                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                    borderBottomRightRadius: '50%',
                                    borderBottomLeftRadius: '50%',
                                    ...(category.isFiltered
                                        ? {
                                              backgroundColor: theme.palette.primary.main,
                                              color: 'white',
                                          }
                                        : {}),
                                }}
                            >
                                <Typography component={'span'} typography={'caption'}>
                                    {toPascalCase(category.name)}
                                </Typography>
                            </div>
                        </div>
                    ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '15px',
                    width: '100%',
                    overflowX: 'scroll',
                    marginTop: '20px',
                    padding: '0 0 5px 5px',
                }}
                ref={articlesBoxRef}
            >
                {articles &&
                    filterArticles(articles)?.map(article => (
                        <div key={article.id} style={{ minWidth: '266px', marginBottom: '10px' }}>
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
                                                typography={'body2'}
                                                color={theme => theme.palette.secondary.main}
                                            >
                                                {article.user.name}
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
                                            {article.ArticleCategories.map((category, index) => (
                                                <div
                                                    key={category.id}
                                                    style={{
                                                        borderRadius: '5px',
                                                        backgroundColor: '#F6F6F6',
                                                        padding: '0 5px',
                                                        ...(index !== 0
                                                            ? {
                                                                  marginLeft: '10px',
                                                              }
                                                            : {}),
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
                        </div>
                    ))}
            </div>
            {error && <span>{error?.response?.data?.error}</span>}
        </>
    );
}
