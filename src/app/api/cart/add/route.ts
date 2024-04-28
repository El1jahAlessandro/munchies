import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { getFormDataValues } from '@/lib/helpers/getFormDataValues';
import { addCartItemBodySchema, CartCookieTokenSchema } from '@/lib/schemas/article.schema';
import { cartCookieName } from '@/lib/utils/constants';
import { cookieOptions, createCartToken } from '@/lib/utils/jwt';
import { getCookieValue } from '@/lib/helpers/getCookieValues';

export const POST = asyncNextHandler(async req => {
    // extract login data from request body
    const { id, amount } = getFormDataValues(
        await req.formData(),
        addCartItemBodySchema,
        addCartItemBodySchema.keyof().options
    );

    const cartItems = getCookieValue(req, cartCookieName, CartCookieTokenSchema, addCartItemBodySchema.keyof().options);

    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set(cartCookieName, createCartToken(), cookieOptions);

    return response;
});
