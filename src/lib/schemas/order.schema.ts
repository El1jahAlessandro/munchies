import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { orderStatusSchema, paymentMethodSchema } from '@/lib/schemas/common.schema';
import prisma from '@/lib/utils/prisma';
import { getUserInputArgs, orderSelectArgs } from '@/lib/schemas/user.schema';

export type OrderType = z.infer<typeof orderSchema>;

export const ordersArticlesSchema = z.object({
    articleId: z.string().cuid(),
    amount: z.coerce.number(),
    price: z.coerce.number(),
    companyId: z.string().cuid(),
});

export const orderSchema = z.object({
    paymentMethod: paymentMethodSchema,
    status: orderStatusSchema.optional().default('orderReceived'),
    ordersArticles: z.array(ordersArticlesSchema),
});

const editOrderSchema = z.object({
    id: z.string().cuid(),
    status: orderStatusSchema,
});

export const createOrderFormDataSchema = zfd.formData(orderSchema);
export const editOrderFormDataSchema = zfd.formData(editOrderSchema);

export type OrderResponseType = Awaited<
    ReturnType<
        typeof prisma.orders.findUnique<
            typeof getUserInputArgs.select.buyedArticles & {
                where: {
                    id: string;
                };
            }
        >
    >
>;

export type CreateOrderType = Awaited<
    ReturnType<
        typeof prisma.orders.findMany<
            typeof orderSelectArgs & {
                where: {
                    id: string;
                };
            }
        >
    >
>;

export type EditOrderType = Awaited<
    ReturnType<
        typeof prisma.orders.findUnique<{
            where: {
                id: string;
            };
        }>
    >
>;
