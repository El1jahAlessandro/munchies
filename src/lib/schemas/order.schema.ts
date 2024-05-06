import { z } from 'zod';
import { orderStatusSchema, paymentMethodSchema } from '@/lib/schemas/common.schema';

export const orderArticleSchema = z.object({
    amount: z.coerce.number(),
    articleId: z.coerce.number(),
});

export const orderSchema = z.object({
    paymentMethod: paymentMethodSchema,
    totalPrice: z.coerce.number(),
    status: orderStatusSchema.optional().default('inPreparation'),
    ordersArticles: z.array(orderArticleSchema),
});
