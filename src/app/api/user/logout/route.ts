import { asyncNextHandler } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';

export const POST = asyncNextHandler(async req => {
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.delete('Authorization');

    return response;
});
