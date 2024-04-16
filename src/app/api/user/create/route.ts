import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/helpers/asyncNextHandler';
import { prisma } from '@/utils/prisma';
import { getHashedPassword } from '@/helpers/getHashedPassword';
import { cookieOptions, createAuthorizationToken } from '@/utils/jwt';
import { createUserBodySchema } from '@/schemas/user.schema';
import { uploadImage } from '@/utils/cloudinary';

export const POST = asyncNextHandler(async req => {
    // extract register data from request body
    const formData = await req.formData();
    const data = createUserBodySchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
        forename: formData.get('forename'),
        lastname: formData.get('lastname'),
        profilePic: formData.get('profilePic'),
        accountType: formData.get('accountType'),
    });
    const { email, password, profilePic } = data;

    let uploadedPictureId = '';
    if (profilePic) {
        const uploadedImage = await uploadImage(profilePic);
        if (uploadedImage) {
            uploadedPictureId = uploadedImage.public_id;
        }
    }

    // check if user already exists in the database based on the email
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        throw new StatusError(401, 'User with that Email already exists');
    }

    // create user in the database
    const createdUser = await prisma.user.create({
        data: {
            ...data,
            profilePic: uploadedPictureId,
            password: await getHashedPassword(password),
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