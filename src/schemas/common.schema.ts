import { z } from 'zod';
import { AccountType } from '@prisma/client';

export const zodMissingError = { required_error: `is not provided` };

export const accountTypeSchema = z.nativeEnum(AccountType, zodMissingError);

export const AuthorizationTokenSchema = z.object({
    id: z.number(),
    email: z.string(),
    accountType: accountTypeSchema,
});

export const cookieSchema = z.object({
    name: z.string(),
    value: z.string(),
});
