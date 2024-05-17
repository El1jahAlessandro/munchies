import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { cartCookieName } from '@/lib/utils/constants';
import { CreateOrderType, orderFormDataSchema } from '@/lib/schemas/order.schema';
import prisma from '@/lib/utils/prisma';
import { getAuthCookieValue } from '@/lib/helpers/getCookieValues';
import { groupBy, map, omit } from 'lodash';
import { orderSelectArgs } from '@/lib/schemas/user.schema';

export const POST = asyncNextHandler<CreateOrderType>(async req => {
    const { id } = getAuthCookieValue(req);
    const data = orderFormDataSchema.parse(await req.formData());

    if (!id) {
        throw new StatusError(401, 'You are not authorized to order');
    }

    // orders are being grouped based on the article seller company
    const groupedOrders = groupBy(data.ordersArticles, 'companyId');

    const orderData = Object.entries(groupedOrders).map(([company, articles]) => {
        const totalPrice = articles.reduce((prevPrice, { price: currentPrice }) => {
            return prevPrice + currentPrice;
        }, 0);
        return {
            data: {
                ...omit(data, 'ordersArticles'),
                totalPrice,
                buyer: {
                    connect: {
                        id,
                    },
                },
                company: {
                    connect: {
                        id: Number(company),
                    },
                },
                ordersArticles: {
                    createMany: {
                        data: map(articles, article => omit(article, 'companyId')),
                    },
                },
            },
            ...orderSelectArgs,
        };
    });

    const createdOrders = await Promise.all(
        orderData.map(async order => {
            return prisma.orders.create(order);
        })
    );

    const response = NextResponse.json(createdOrders, { status: 200 });
    response.cookies.delete(cartCookieName);

    return response;
});
