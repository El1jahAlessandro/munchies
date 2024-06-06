'use client';

import { useUserContext } from '@/components/hooks/userContext';
import { Card, Stack, Typography } from '@mui/material';
import { chunk, first, groupBy, pick, uniq } from 'lodash';
import React, { useMemo, useState } from 'react';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { OrderResponseType } from '@/lib/schemas/order.schema';
import { CldImage } from 'next-cloudinary';
import { $Enums } from '@prisma/client';
import { DotDivider } from '@/components/common/DotDivider';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';

const orderStatusText: { [key in $Enums.OrderStatus]: string } = {
    inPreparation: 'Wird zubereitet',
    isBeingDelivered: 'Wird geliefert',
    delivered: 'Bestellung geliefert',
};

type OrderCategory = 'latestOrders' | 'upcoming';

export default function OrderPage() {
    const { user } = useUserContext();
    const { accountType, buyedArticles, saledArticles } = pick(user, ['accountType', 'buyedArticles', 'saledArticles']);

    const orders = accountType === 'business' ? saledArticles : buyedArticles;

    function OrderCard({ order }: { order: OrderResponseType }) {
        return (
            <Card className={'mt-[20px] p-[20px]'}>
                <div className={'flex gap-[20px]'}>
                    <CldImage
                        alt={order?.company.name ?? ''}
                        src={order?.company.profilePic ?? ''}
                        width={65}
                        height={65}
                    />
                    <Stack className={'justify-center text-left'}>
                        <Typography variant={'caption'} component={'div'} className={'flex items-center'}>
                            {order?.status === 'delivered' && (
                                <>
                                    {new Date(order?.updatedAt)?.toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    })}
                                    <DotDivider color={'secondary'} size={'small'} margin={'0 10px'} />
                                </>
                            )}
                            {order?.ordersArticles.length} Artikel
                        </Typography>
                        <Typography variant={'body1'} component={'div'} className={'font-bold'}>
                            {order?.company.name}
                        </Typography>
                        {order?.status === 'delivered' && (
                            <Typography component={'span'} variant={'caption'} className={'text-primary-main'}>
                                <DotDivider color={'primary'} size={'large'} margin={'0 5px 0 0'} />
                                {orderStatusText[order.status]}
                            </Typography>
                        )}
                    </Stack>
                    <Typography className={'ml-auto font-bold flex items-start text-primary-main'} component={'span'}>
                        {currencyFormatter(order?.totalPrice ?? 0)}
                    </Typography>
                </div>
            </Card>
        );
    }

    function OrderChunks({ orders }: { orders: OrderResponseType[] }) {
        const [index, setIndex] = useState(0);
        const chunkedOrders = chunk(orders, 4);
        const visibleOrders = useMemo(
            () =>
                chunkedOrders.reduce((previousOrders, currentOrders, currentIndex) => {
                    if (currentIndex <= index) {
                        return uniq([...(previousOrders ?? []), ...currentOrders]);
                    }
                    return previousOrders;
                }, first(chunkedOrders)),
            [index]
        );

        return (
            <>
                {visibleOrders?.map(order => <>{order && <OrderCard key={order.id} order={order} />}</>)}
                {orders?.length !== visibleOrders?.length && (
                    <div className={'flex justify-center margin-auto mt-[60px]'}>
                        <ButtonComponent size={'large'} onClick={() => setIndex(prevIndex => prevIndex + 1)}>
                            showMore
                        </ButtonComponent>
                    </div>
                )}
            </>
        );
    }

    const groupedOrders = groupBy(orders, order => (order.status === 'delivered' ? 'latestOrders' : 'upcoming'));
    const orderEntries = Object.entries(groupedOrders);

    return (
        <>
            {orderEntries &&
                orderEntries.map(([orderCategory, orders]) => (
                    <div key={orderCategory}>
                        {orderCategory as OrderCategory}
                        <OrderChunks orders={orders.reverse()} />
                    </div>
                ))}
        </>
    );
}
