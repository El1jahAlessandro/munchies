import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { getCartCookieValue } from '@/lib/helpers/getCookieValues';
import { GetCartItemsBodyType } from '@/lib/schemas/article.schema';

export const GET = asyncNextHandler<GetCartItemsBodyType>(async req => {
    // extract item data from request body
    const { cartItems } = getCartCookieValue(req);
    return NextResponse.json({ cartItems }, { status: 200 });
});
