import { z } from 'zod';

export const createArticleBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    picture: z.string(),
    description: z.string(),
    ingredients: z.string(),
    articleCategoriesId: z.number(),
});
