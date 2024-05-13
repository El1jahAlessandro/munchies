'use client';

import { useUserContext } from '@/components/hooks/userContext';
import { groupBy, pick } from 'lodash';

export default function OrderPage() {
    const { user } = useUserContext();
    const { accountType, buyedArticles, saledArticles } = pick(user, ['accountType', 'buyedArticles', 'saledArticles']);

    const orders = accountType === 'business' ? saledArticles : buyedArticles;

    const groupedOrders = groupBy(orders, 'status');

    // const test = Object.entries(groupedOrders).map(([status, e]) => e);

    console.log('orders: ', orders);
    console.log('groupedOrders: ', groupedOrders);

    return (
        <>
            {orders &&
                orders.map(order => {
                    return <div key={order.id}>{order.id}</div>;
                })}
        </>
    );
}
