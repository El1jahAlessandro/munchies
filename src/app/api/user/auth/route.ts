import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { asyncNextHandler, StatusError } from '@/helpers/asyncNextHandler';
import { NextResponse } from 'next/server';
import { authUserBodySchema } from '@/schemas/user.schema';
import { cookieOptions, createAuthorizationToken } from '@/utils/jwt';

export const POST = asyncNextHandler(async req => {
    // extract login data from request body
    const data = authUserBodySchema.parse(await req.json());
    const { email, password } = data;

    // get user from the database based on email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new StatusError(400, 'User with that Email does not exists');
    }

    // compare both hashed passwords
    const compareHashedPassword = await bcrypt.compare(password, user?.password ?? '');

    if (!compareHashedPassword) {
        throw new StatusError(401, 'Email or Password is incorrect');
    }

    // Create Token and send it back as Cookie
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set('Authorization', createAuthorizationToken(user), cookieOptions);

    return response;
});
