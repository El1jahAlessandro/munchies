import { z } from 'zod';
import { accountTypeSchema } from '@/lib/schemas/common.schema';
import prisma from '@/lib/utils/prisma';
import { zfd } from 'zod-form-data';

export type AuthUserBodyType = z.infer<typeof authUserBodySchema>;
export type CreateUserBodyType = z.infer<typeof createUserInputSchema>;
export type EditUserFormType = z.infer<typeof editUserFormSchema>;

const emailSchema = z
    .string()
    .email()
    .refine(email => !email.match(/[\u00F0-\u02AF]/g), {
        message: 'Ä, Ö, Ü sind nicht erlaubt',
    });

export const userSchema = z.object({
    email: emailSchema,
    password: z.string(),
    accountType: accountTypeSchema,
    name: z.string(),
    profilePic: z.instanceof(File).or(z.string()).nullish(),
});

export const authUserBodySchema = zfd.formData(userSchema.pick({ email: true, password: true }));

export const editUserFormSchema = zfd.formData(userSchema.omit({ password: true }));

export const createUserBodySchema = zfd.formData(userSchema.omit({ profilePic: true }));

export const createUserInputSchema = userSchema
    .merge(
        z.object({
            confirmPassword: z.string(),
        })
    )
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const orderSelectArgs = {
    select: {
        id: true,
        paymentMethod: true,
        totalPrice: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        ordersArticles: {
            select: {
                id: true,
                amount: true,
                price: true,
                article: {
                    select: {
                        name: true,
                    },
                },
            },
        },
        company: {
            select: {
                name: true,
                profilePic: true,
            },
        },
        buyer: {
            select: {
                name: true,
            },
        },
    },
};

export const getUserInputArgs = {
    select: {
        id: true,
        email: true,
        clerkId: true,
        name: true,
        profilePic: true,
        accountType: true,
        buyedArticles: orderSelectArgs,
        saledArticles: orderSelectArgs,
    },
};

export type UserResponseType = Awaited<
    ReturnType<
        typeof prisma.user.findUnique<
            typeof getUserInputArgs & {
                where: {
                    id: string;
                };
            }
        >
    >
>;
