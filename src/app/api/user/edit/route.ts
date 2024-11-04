import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { editUserFormSchema } from '@/lib/schemas/user.schema';
import { getImagePublicId } from '@/lib/helpers/imageUpload';
import { getAuthCookieValue } from '@/lib/helpers/getCookieValues';
import { identity, pickBy } from 'lodash';
import { profilePictureFolder } from '@/lib/utils/constants';
import prisma from '@/lib/utils/prisma';

export const POST = asyncNextHandler(async req => {
    const { id } = getAuthCookieValue(req);

    const data = editUserFormSchema.parse(await req.formData());

    const { profilePic, email } = data;

    const uploadedPictureId = await getImagePublicId(profilePic, profilePictureFolder);

    if (email) {
        const emailAlreadyUsed = await prisma.user.findUnique({ where: { email } });

        if (emailAlreadyUsed && id !== emailAlreadyUsed.id) {
            throw new StatusError(500, 'This Email is already used');
        }
    }

    const editedUser = await prisma.user.update({
        data: {
            ...pickBy(data, identity),
            profilePic: uploadedPictureId,
            ...(email ? { email: email.toLowerCase() } : {}),
        },
        where: {
            id,
        },
    });

    if (!editedUser) {
        throw new StatusError(500, 'There was an error, please try again');
    }

    return NextResponse.json({}, { status: 200 });
});
