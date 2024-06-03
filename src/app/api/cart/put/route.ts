import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { CrudCartItemSchema, GetCartItemsBodyType } from '@/lib/schemas/article.schema';
import { cartCookieName } from '@/lib/utils/constants';
import { cookieOptions, createCartToken } from '@/lib/utils/jwt';
import { getCartCookieValue } from '@/lib/helpers/getCookieValues';
import { compact, sortBy } from 'lodash';

export const POST = asyncNextHandler<GetCartItemsBodyType>(async req => {
    // extract item data from request body
    const data = CrudCartItemSchema.parse(await req.formData());

    const { cartItems: currentCartItems } = getCartCookieValue(req);

    const itemAlreadyExistsInCart = currentCartItems.find(item => item.id === data.id);

    const cartItems = sortBy(
        compact([
            ...currentCartItems.filter(item => item.id !== itemAlreadyExistsInCart?.id),
            !data.remove && {
                ...data,
                ...(itemAlreadyExistsInCart ? { amount: itemAlreadyExistsInCart.amount + data.amount } : {}),
            },
        ]),
        'id'
    );

    const response = NextResponse.json(cartItems, { status: 200 });
    response.cookies.set(cartCookieName, createCartToken({ cartItems }), cookieOptions);

    return response;
});
