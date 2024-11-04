import { z } from 'zod';
import { AccountType, OrderStatus, PaymentMethods } from '@prisma/client';
import { AxiosError } from 'axios';
import { ControllerRenderProps, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField/TextField';

export type APIError = AxiosError<{ error: string }>;

export const accountTypeSchema = z.nativeEnum(AccountType);
export const paymentMethodSchema = z.nativeEnum(PaymentMethods);
export const orderStatusSchema = z.nativeEnum(OrderStatus);

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

const formInputOptionSchema = z.object({
    label: z.string(),
    inputType: z.enum(['textInput', 'password', 'dropdown']),
});

export type FormInputOptionType<T extends FieldValues> = {
    name: Path<T>;
} & z.infer<typeof formInputOptionSchema> &
    Partial<Omit<TextFieldProps, 'onBlur' | 'ref'>>;

export type FormInputType<T extends FieldValues> = {
    errors?: FieldErrors<T>;
} & FormInputOptionType<T> &
    ControllerRenderProps<T, Path<T>>;
