import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { prisma } from '@/lib/utils/prisma';
import { getHashedPassword } from '@/lib/helpers/getHashedPassword';
import { cookieOptions, createAuthorizationToken } from '@/lib/utils/jwt';
import { createUserBodySchema } from '@/lib/schemas/user.schema';
import { authorizationCookieName } from '@/lib/utils/constants';
import { getFormDataValues } from '@/lib/helpers/getFormDataValues';

export const POST = asyncNextHandler(async req => {
    // extract register data from request body
    const data = getFormDataValues(await req.formData(), createUserBodySchema, createUserBodySchema.keyof().options);

    const { email, password } = data;

    // check if user already exists in the database based on the email
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        throw new StatusError(401, 'User with that Email already exists');
    }

    // create user in the database
    const createdUser = await prisma.user.create({
        data: {
            ...data,
            email: email.toLowerCase(),
            password: await getHashedPassword(password),
        },
    });

    if (!createdUser) {
        throw new StatusError(500, 'There was an error, please try again');
    }

    // Create Token and send it back as Cookie
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set(authorizationCookieName, createAuthorizationToken(createdUser), cookieOptions);

    return response;
});
