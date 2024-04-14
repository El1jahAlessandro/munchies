import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/helpers/asyncNextHandler';
import { prisma } from '@/utils/prisma';
import { getHashedPassword } from '@/helpers/getHashedPassword';
import { cookieOptions, createAuthorizationToken } from '@/utils/jwt';
import { createUserBodySchema } from '@/schemas/user.schema';
import { uploadImage } from '@/utils/cloudinary';

export const POST = asyncNextHandler(async req => {
    // extract register data from request body
    const data = createUserBodySchema.parse(await req.json());
    const { email, password, profilePic } = data;

    uploadImage(profilePic ?? '');

    // check if user already exists in the database based on the email
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        throw new StatusError(401, 'User with that Email already exists');
    }

    // create user in the database
    const createdUser = await prisma.user.create({
        data: {
            ...data,
            password: await getHashedPassword(password),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    if (!createdUser) {
        throw new StatusError(500, 'There was an error, please try again');
    }

    // Create Token and send it back as Cookie
    const response = NextResponse.json({}, { status: 200 });
    response.cookies.set('Authorization', createAuthorizationToken(createdUser), cookieOptions);

    return response;
});
