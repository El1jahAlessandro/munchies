import { z } from 'zod';
import { accountTypeSchema } from '@/lib/schemas/common.schema';

export type AuthUserBodyType = z.infer<typeof authUserBodySchema>;
export type CreateUserBodyType = z.infer<typeof createUserInputSchema>;
export type EditUserFormType = z.infer<typeof editUserFormSchema>;

export const authUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const otherUserInfoSchema = z.object({
    email: z.string().email(),
    accountType: accountTypeSchema,
    profilePic: z.instanceof(File).optional(),
    name: z.string(),
});

export const editUserFormSchema = otherUserInfoSchema.merge(
    z.object({
        profilePic: z.instanceof(File).or(z.string()).nullish(),
    })
);

export const createUserBodySchema = authUserBodySchema.merge(otherUserInfoSchema);

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
