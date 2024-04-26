import { z } from 'zod';
import { accountTypeSchema } from '@/lib/schemas/common.schema';

export type AuthUserBodyType = z.infer<typeof authUserBodySchema>;
export type CreateUserBodyType = z.infer<typeof createUserInputSchema>;
export type EditUserFormType = z.infer<typeof editUserFormSchema>;

const emailSchema = z
    .string()
    .email()
    .refine(email => !email.match(/[\u00F0-\u02AF]/g), {
        message: 'Ä, Ö, Ü sind nicht erlaubt',
    });

export const authUserBodySchema = z.object({
    email: emailSchema,
    password: z.string(),
});

export const otherUserInfoSchema = z.object({
    email: emailSchema,
    accountType: accountTypeSchema,
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
