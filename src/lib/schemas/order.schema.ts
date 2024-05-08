import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { orderStatusSchema, paymentMethodSchema } from '@/lib/schemas/common.schema';

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
