import prisma from '@/lib/utils/prisma';
import bcrypt from 'bcryptjs';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { authUserBodySchema } from '@/lib/schemas/user.schema';
import { cookieOptions, createAuthorizationToken } from '@/lib/utils/jwt';
import { authorizationCookieName } from '@/lib/utils/constants';

export const POST = asyncNextHandler(async req => {
    // extract login data from request body
    const data = authUserBodySchema.parse(await req.formData());
    const { email, password } = data;

    // get user from the database based on email
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // compare both hashed passwords
    const compareHashedPassword = await bcrypt.compare(password, user?.password ?? '');

    if (!user || !compareHashedPassword) {
        throw new StatusError(401, 'Invalid Credentials');
    }

    // Create Token and send it back as Cookie
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set(authorizationCookieName, createAuthorizationToken(user), cookieOptions);

    return response;
});
