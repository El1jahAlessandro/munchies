import Link from 'next/link';
import { pages } from '@/lib/utils/routes';
import { Card, Typography } from '@mui/material';
import { CldImage } from 'next-cloudinary';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { ScrollableContainer } from '@/components/common/ScrollableContainer';
import { ArticleWithCategoryType, useArticlesContext } from '@/components/hooks/articlesContext';
import { RefObject } from 'react';
import { useCurrentLocale } from '@/locales/client';

type Props = {
    filteredCategories: string[];
    articlesBoxRef: RefObject<HTMLDivElement>;
};

export default function ArticleCards({ filteredCategories, articlesBoxRef }: Props) {
    const locale = useCurrentLocale();
    const { articles } = useArticlesContext();

    function filterArticles(articles: ArticleWithCategoryType[] | undefined) {
        return articles?.filter(article => {
            if (!filteredCategories.length) return article;
            return filteredCategories.every(filter =>
                article.ArticleCategories.some(category => category.category.id === filter)
            );
        });
    }

    return (
        <ScrollableContainer gap={15} ref={articlesBoxRef}>
            {articles &&
                filterArticles(articles)?.map(article => (
                    <div key={article.id} className={'min-w-[266px] mb-[10px]'}>
                        <Link
                            href={{ pathname: `/${locale}` + pages.article, query: { id: article.id } }}
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
    );
}
