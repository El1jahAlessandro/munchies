import { z } from 'zod';

export type AddCartItemBodyType = z.infer<typeof addCartItemBodySchema>;
export type GetCartItemsBodyType = z.infer<typeof cartItemsSchema>;

export const createArticleBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    picture: z.string(),
    description: z.string(),
    ingredients: z.string(),
    articleCategoriesId: z.number(),
});

export const addCartItemBodySchema = z.object({
    id: z.coerce.number(),
    amount: z.coerce.number(),
});

const cartItemsSchema = z.array(addCartItemBodySchema);

export const CartCookieTokenSchema = z.object({
    cartItems: cartItemsSchema,
});

export type CartItems = z.infer<typeof CartCookieTokenSchema>;
