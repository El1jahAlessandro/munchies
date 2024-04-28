import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { getFormDataValues } from '@/lib/helpers/getFormDataValues';
import { addCartItemBodySchema } from '@/lib/schemas/article.schema';
import { cartCookieName } from '@/lib/utils/constants';
import { cookieOptions, createCartToken } from '@/lib/utils/jwt';
import { getCartCookieValue } from '@/lib/helpers/getCookieValues';

export const POST = asyncNextHandler(async req => {
    // extract item data from request body
    const data = getFormDataValues(await req.formData(), addCartItemBodySchema, addCartItemBodySchema.keyof().options);

    const { cartItems: currentCartItems } = getCartCookieValue(req);

    const itemAlreadyExistsInCart = currentCartItems.find(item => item.id === data.id);

    const cartItems = [
        ...currentCartItems.filter(item => item.id !== itemAlreadyExistsInCart?.id),
        {
            ...data,
            ...(itemAlreadyExistsInCart ? { amount: itemAlreadyExistsInCart.amount + data.amount } : {}),
        },
    ];

    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set(cartCookieName, createCartToken({ cartItems }), cookieOptions);

    return response;
});
