'use client';

import { useCartContext } from '@/components/hooks/cartContext';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';

export default function CartPage() {
    const { cartArticles } = useCartContext();

    return (
        <>
            {cartArticles &&
                cartArticles.length > 0 &&
                cartArticles.map(article => (
                    <div style={{ marginTop: '10px' }}>
                        <div>{article?.name}</div>
                        <div>{article?.description}</div>
                        <div>{currencyFormatter(article?.price ?? 0)}</div>
                    </div>
                ))}
        </>
    );
}
