import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { cartCookieName } from '@/lib/utils/constants';
import { orderFormDataSchema } from '@/lib/schemas/order.schema';
import prisma from '@/lib/utils/prisma';

export const POST = asyncNextHandler(async req => {
    const data = orderFormDataSchema.parse(await req.formData());
    console.log(data.ordersArticles);
    const test = await prisma.orders.create({
        data: {
            ...data,
            ordersArticles: {
                createMany: {
                    data: data.ordersArticles,
                },
            },
        },
    });

    const response = NextResponse.json({}, { status: 200 });
    response.cookies.delete(cartCookieName);

    return response;
});
