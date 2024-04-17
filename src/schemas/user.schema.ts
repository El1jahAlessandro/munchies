import { z } from 'zod';
import { accountTypeSchema } from '@/schemas/common.schema';

export type AuthUserBodyType = z.infer<typeof authUserBodySchema>;
export type CreateUserBodyType = z.infer<typeof createUserInputSchema>;

export const authUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const createUserBodySchema = authUserBodySchema.merge(
    z.object({
        accountType: accountTypeSchema,
        profilePic: z.instanceof(File).nullish(),
        forename: z.string().nullish(),
        lastname: z.string().nullish(),
    })
);

export const createUserInputSchema = createUserBodySchema
    .merge(
        z.object({
            confirmPassword: z.string(),
        })
    )
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
