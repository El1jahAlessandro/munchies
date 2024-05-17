import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { orderStatusSchema, paymentMethodSchema } from '@/lib/schemas/common.schema';
import prisma from '@/lib/utils/prisma';
import { getUserInputArgs, orderSelectArgs } from '@/lib/schemas/user.schema';

export type OrderType = z.infer<typeof orderSchema>;

export const ordersArticlesSchema = z.object({
    articleId: z.coerce.number(),
    amount: z.coerce.number(),
    price: z.coerce.number(),
    companyId: z.coerce.number(),
});

export const orderSchema = z.object({
    paymentMethod: paymentMethodSchema,
    status: orderStatusSchema.optional().default('inPreparation'),
    ordersArticles: z.array(ordersArticlesSchema),
});

export const orderFormDataSchema = zfd.formData(orderSchema);

export type OrderResponseType = Awaited<
    ReturnType<
        typeof prisma.orders.findUnique<
            typeof getUserInputArgs.select.buyedArticles & {
                where: {
                    id: number;
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
                    id: number;
                };
            }
        >
    >
>;
