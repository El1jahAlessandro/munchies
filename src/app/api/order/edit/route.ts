import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { editOrderFormDataSchema, EditOrderType } from '@/lib/schemas/order.schema';
import prisma from '@/lib/utils/prisma';

export const POST = asyncNextHandler<EditOrderType>(async req => {
    const { id, status } = editOrderFormDataSchema.parse(await req.formData());

    const editedOrder = await prisma.orders.update({
        data: {
            status,
        },
        where: { id },
    });

    return NextResponse.json(editedOrder, { status: 200 });
});
