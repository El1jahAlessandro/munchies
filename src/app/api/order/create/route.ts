import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { getFormDataValues } from '@/lib/helpers/getFormDataValues';
import { cartCookieName } from '@/lib/utils/constants';
import { orderSchema } from '@/lib/schemas/order.schema';
import prisma from '@/lib/utils/prisma';

export const POST = asyncNextHandler(async req => {
    const data = getFormDataValues(await req.formData(), orderSchema, orderSchema.keyof().options);

    const test = await prisma.orders.create({
        data: {
            ...data,
            articleOrders: {
                create: data.articleOrders,
            },
        },
    });

    const response = NextResponse.json({}, { status: 200 });
    response.cookies.delete(cartCookieName);

    return response;
});
