import { z } from 'zod';
import { orderStatusSchema, paymentMethodSchema } from '@/lib/schemas/common.schema';

export type OrderType = z.infer<typeof orderSchema>;

export const articleOrdersSchema = z.object({
    amount: z.coerce.number(),
    articleId: z.coerce.number(),
});

export const orderSchema = z.object({
    paymentMethod: paymentMethodSchema,
    totalPrice: z.coerce.number(),
    status: orderStatusSchema.optional().default('inPreparation'),
    articleOrders: z.array(articleOrdersSchema),
});
