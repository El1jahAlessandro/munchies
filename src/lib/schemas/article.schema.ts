import { z } from 'zod';

export type AddCartItemBodyType = z.infer<typeof addCartItemBodySchema>;

export const createArticleBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    picture: z.string(),
    description: z.string(),
    ingredients: z.string(),
    articleCategoriesId: z.number(),
});

export const addCartItemBodySchema = z.object({
    id: z.string(),
    amount: z.number(),
});

export const CartCookieTokenSchema = z.array(addCartItemBodySchema);

export type CartItems = z.infer<typeof CartCookieTokenSchema>;
