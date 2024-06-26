import { FlatIcon } from '@/components/common/FlatIcon';
import { Typography } from '@mui/material';
import { toPascalCase } from '@/lib/helpers/toPascalCase';
import { ScrollableContainer } from '@/components/common/ScrollableContainer';
import { useArticlesContext } from '@/components/hooks/articlesContext';
import { Dispatch, RefObject, SetStateAction, useMemo } from 'react';
import { CategoryFiltersType } from '@/components/Homepage/Articles';

type Props = {
    categoriesBoxRef: RefObject<HTMLDivElement>;
    articlesBoxRef: RefObject<HTMLDivElement>;
    filteredCategories: string[];
    setFilteredCategories: Dispatch<SetStateAction<string[]>>;
};

export default function CategoryCards({
    categoriesBoxRef,
    articlesBoxRef,
    filteredCategories,
    setFilteredCategories,
}: Props) {
    const { categories } = useArticlesContext();

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

    function sortCategories(categories: CategoryFiltersType[]) {
        return categories.sort((a, b) => {
            if (a.isFiltered) return -1;
            if (b.isFiltered) return 1;
            return b.id.localeCompare(a.id);
        });
    }

    return (
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
    );
}
