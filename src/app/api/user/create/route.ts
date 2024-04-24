import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { prisma } from '@/lib/utils/prisma';
import { getHashedPassword } from '@/lib/helpers/getHashedPassword';
import { cookieOptions, createAuthorizationToken } from '@/lib/utils/jwt';
import { createUserBodySchema } from '@/lib/schemas/user.schema';
import { getImagePublicId } from '@/lib/helpers/imageUpload';
import { authorizationCookieName } from '@/lib/utils/constants';

export const POST = asyncNextHandler(async req => {
    // todo: clean this mess up
    // extract register data from request body
    const formData = await req.formData();
    const unknownTypedProfilePic = formData.get('profilePic');
    const unknownForeName = formData.get('forename');
    const unknownLastName = formData.get('lastname');
    const parsedProfilePic =
        !!unknownTypedProfilePic && unknownTypedProfilePic !== 'undefined' && unknownTypedProfilePic instanceof File
            ? createUserBodySchema.pick({ profilePic: true }).parse({ profilePic: unknownTypedProfilePic }).profilePic
            : undefined;
    const data = {
        profilePic: parsedProfilePic,
        ...createUserBodySchema.omit({ profilePic: true }).parse({
            email: formData.get('email'),
            password: formData.get('password'),
            forename: unknownForeName !== 'undefined' ? unknownForeName : undefined,
            lastname: unknownLastName !== 'undefined' ? unknownLastName : undefined,
            accountType: formData.get('accountType'),
        }),
    };
    const { email, password, profilePic } = data;

    const uploadedPictureId = await getImagePublicId(profilePic);

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
            profilePic: uploadedPictureId,
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
