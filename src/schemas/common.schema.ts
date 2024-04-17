import { z } from 'zod';
import { AccountType } from '@prisma/client';

export const accountTypeSchema = z.nativeEnum(AccountType);

export const AuthorizationTokenSchema = z.object({
    id: z.number(),
    email: z.string(),
    accountType: accountTypeSchema,
});

export const cookieSchema = z.object({
    name: z.string(),
    value: z.string(),
});

export const cloudinaryResponseSchema = z.object({
    asset_id: z.string(),
    public_id: z.string(),
    version: z.number(),
    version_id: z.string(),
    signature: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    resource_type: z.string(),
    created_at: z.string(),
    tags: z.array(z.any()),
    bytes: z.number(),
    type: z.string(),
    etag: z.string(),
    placeholder: z.boolean(),
    url: z.string(),
    secure_url: z.string(),
    folder: z.string(),
    original_filename: z.string(),
    api_key: z.string(),
});
