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
import { toPascalCase } from '@/lib/helpers/toPascalCase';
import { ScrollableContainer } from '@/components/common/ScrollableContainer';
import { PageParams } from '@/lib/schemas/locale.schema';
import { useI18n } from '@/locales/client';

type CategoryFiltersType = {
    isFiltered: boolean;
} & Categories;

export default function OverviewPage({ params: { locale } }: PageParams) {
    const t = useI18n();
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
            <Typography component={'h2'} typography={'h4'} className={'!font-bold'}>
                {t('homepage_top_text')}
            </Typography>
            <ScrollableContainer gap={20} ref={categoriesBoxRef}>
                {categories &&
                    categories.length > 0 &&
                    sortCategories(categoryFilters ?? []).map(category => (
                        <div key={category.id} className={'p-[10px_0]'} onClick={() => handleFilterChange(category)}>
                            <div
                                className={
                                    `w-[70px] p-[5px] rounded-t-[50%] relative z-10 shadow-[rgba(0,0,0,0.24)_0px_-2px_3px] ` +
                                    (category.isFiltered ? 'bg-primary-main' : '')
                                }
                            >
                                <div
                                    className={
                                        'h-[60px] w-[60px] rounded-[50%] flex justify-center content-center p-[5px] bg-white'
                                    }
                                >
                                    <FlatIcon icon={category.icon} />
                                </div>
                            </div>
                            <div
                                className={
                                    'flex justify-center items-center w-[70px] h-[70px] mt-[-20px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] rounded-b-[50%] ' +
                                    (category.isFiltered ? 'bg-primary-main text-white' : '')
                                }
                            >
                                <Typography component={'span'} typography={'caption'}>
                                    {toPascalCase(category.name)}
                                </Typography>
                            </div>
                        </div>
                    ))}
            </ScrollableContainer>
            <ScrollableContainer gap={15} ref={articlesBoxRef}>
                {articles &&
                    filterArticles(articles)?.map(article => (
                        <div key={article.id} className={'min-w-[266px] mb-[10px]'}>
                            <Link
                                href={pages.article + '?id=' + article.id}
                                locale={locale}
                                className={'text-black no-underline'}
                            >
                                <Card className={'rounded-[15px]'}>
                                    <CldImage
                                        className={'rounded-t-[15px]'}
                                        alt={article.name}
                                        src={article.picture}
                                        width={266}
                                        height={136}
                                        sizes={'(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                                        crop={'thumb'}
                                        aspectRatio={3 / 2}
                                        gravity={'center'}
                                    />
                                    <div className={'p-[10px]'}>
                                        <div>
                                            <Typography className={'font-bold'} component={'span'} typography={'body1'}>
                                                {article.name}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography
                                                component={'span'}
                                                typography={'body2'}
                                                className={'text-secondary-main'}
                                            >
                                                {article.user.name}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography
                                                component={'span'}
                                                typography={'subtitle2'}
                                                className={'text-secondary-main'}
                                            >
                                                {currencyFormatter(article.price, locale)}
                                            </Typography>
                                        </div>
                                        <div className={'flex mt-[5px]'}>
                                            {article.ArticleCategories.map((category, index) => (
                                                <div
                                                    className={
                                                        'rounded-[5px] bg-traffic-white px-[5px] py-0 ' +
                                                        (index !== 0 ? 'ml-[10px]' : '')
                                                    }
                                                    key={category.id}
                                                >
                                                    <Typography
                                                        component={'span'}
                                                        typography={'overline'}
                                                        className={'text-secondary-main'}
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
            </ScrollableContainer>
            {error && <span>{error?.response?.data?.error}</span>}
        </>
    );
}
