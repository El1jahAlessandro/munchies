import { z } from 'zod';
import { zfd } from 'zod-form-data';

export type CartItemType = z.infer<typeof CartItemSchema>;
export type GetCartItemsBodyType = z.infer<typeof cartItemsSchema>;

export const createArticleBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    picture: z.string(),
    description: z.string(),
    ingredients: z.string(),
    articleCategoriesId: z.number(),
});

export const CartItemSchema = z.object({
    id: z.coerce.number(),
    amount: z.coerce.number(),
});

export const CrudCartItemSchema = zfd.formData(
    CartItemSchema.merge(
        z.object({
            remove: z.coerce.boolean().optional(),
        })
    )
);

const cartItemsSchema = z.array(CartItemSchema);

export const CartCookieTokenSchema = z.object({
    cartItems: cartItemsSchema,
});

export type CartItems = z.infer<typeof CartCookieTokenSchema>;
