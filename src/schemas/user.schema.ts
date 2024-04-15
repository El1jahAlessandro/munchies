import { z } from 'zod';
import { accountTypeSchema, zodMissingError } from '@/schemas/common.schema';

export type CreateUserBodyType = z.infer<typeof createUserBodySchema>;
export type AuthUserBodyType = z.infer<typeof authUserBodySchema>;
export type AuthUserInputType = z.infer<typeof createUserInputSchema>;

export const authUserBodySchema = z.object({
    email: z.string(zodMissingError).email(),
    password: z.string(zodMissingError),
});

export const createUserBodySchema = authUserBodySchema.merge(
    z.object({
        accountType: accountTypeSchema,
        profilePic: z.instanceof(File).optional(),
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
