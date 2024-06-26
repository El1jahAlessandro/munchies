'use client';
import { useRef, useState } from 'react';
import { Categories } from '@prisma/client';
import ArticleCards from '@/components/Homepage/ArticleCards';
import CategoryCards from '@/components/Homepage/CategoryCards';

export type CategoryFiltersType = {
    isFiltered: boolean;
} & Categories;

export default function Articles() {
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    const categoriesBoxRef = useRef<HTMLDivElement>(null);
    const articlesBoxRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <CategoryCards
                categoriesBoxRef={categoriesBoxRef}
                articlesBoxRef={articlesBoxRef}
                filteredCategories={filteredCategories}
                setFilteredCategories={setFilteredCategories}
            />
            <ArticleCards filteredCategories={filteredCategories} articlesBoxRef={articlesBoxRef} />
        </>
    );
}
