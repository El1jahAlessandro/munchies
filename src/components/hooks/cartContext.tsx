'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { api } from '@/lib/utils/routes';
import { getFetcher } from '@/lib/helpers/fetcher';
import { APIError } from '@/lib/schemas/common.schema';
import { GetCartItemsBodyType } from '@/lib/schemas/article.schema';
import { Article } from '@prisma/client';
import { useArticlesContext } from '@/components/hooks/articlesContext';
import { compact } from 'lodash';

export type CartMutateType = KeyedMutator<Article & GetCartItemsBodyType> | VoidFunction;

type VoidFunction = () => void;
type CartContext = ReturnType<typeof getCartData> & { mutate: CartMutateType };

const CartContext = createContext<CartContext>({
    isLoading: false,
    isValidating: false,
    cartArticles: [],
    mutate: async () => new Promise(() => undefined),
    error: undefined,
});

export function useCartContext() {
    const cartContext = useContext(CartContext);
    if (cartContext === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return cartContext;
}

function getCartData() {
    const {
        data: cartItems,
        error,
        isLoading,
        mutate,
        isValidating,
    } = useSWR<GetCartItemsBodyType, APIError>(api.cart.get, getFetcher);
    const { articles } = useArticlesContext();
    const cartArticles = compact(
        cartItems?.map(item => {
            const foundArticle = articles?.find(article => article.id === item.id);
            if (foundArticle) {
                return {
                    ...item,
                    ...foundArticle,
                    price: item.amount * foundArticle.price,
                };
            }
        })
    );
    return { cartArticles, error, isLoading, mutate, isValidating };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { cartArticles, error, isLoading, mutate, isValidating } = getCartData();

    const value = useMemo(
        () => ({
            cartArticles,
            error,
            isLoading,
            mutate,
            isValidating,
        }),
        [cartArticles, error, isLoading, mutate, isValidating]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
