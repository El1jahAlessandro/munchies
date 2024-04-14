import { z } from 'zod';
import { zodMissingError } from '@/schemas/common.schema';

export const createArticleBodySchema = z.object({
    name: z.string(zodMissingError),
    price: z.number(zodMissingError),
    picture: z.string(zodMissingError),
    description: z.string(zodMissingError),
    ingredients: z.string(zodMissingError),
    articleCategoriesId: z.number(zodMissingError),
});
