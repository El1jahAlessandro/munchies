import { z } from 'zod';

export const localesSchema = z.enum(['de', 'en']);

export type Locales = z.infer<typeof localesSchema>;

const pageParamsSchema = z.object({
    params: z.object({
        locale: localesSchema,
    }),
});

export type PageParams = z.infer<typeof pageParamsSchema>;
