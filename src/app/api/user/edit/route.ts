import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { prisma } from '@/lib/utils/prisma';
import { editUserFormSchema, otherUserInfoSchema } from '@/lib/schemas/user.schema';
import { getImagePublicId } from '@/lib/helpers/imageUpload';
import getCookieValue from '@/lib/helpers/getCookieValues';
import { identity, pickBy } from 'lodash';

export const POST = asyncNextHandler(async req => {
    const { id } = getCookieValue(req);

    // todo: clean this mess up
    // extract edit data from request body
    const formData = await req.formData();
    const unknownTypedProfilePic = formData.get('profilePic');
    const unknownName = formData.get('name');
    const parsedProfilePic =
        !!unknownTypedProfilePic && unknownTypedProfilePic !== 'undefined' && unknownTypedProfilePic instanceof File
            ? editUserFormSchema.pick({ profilePic: true }).parse({ profilePic: unknownTypedProfilePic }).profilePic
            : undefined;
    const data = {
        profilePic: parsedProfilePic,
        ...otherUserInfoSchema
            .omit({ profilePic: true })
            .partial()
            .parse({
                name: unknownName !== 'undefined' ? unknownName : undefined,
                accountType: formData.get('accountType') ?? undefined,
                email: formData.get('email') ?? undefined,
            }),
    };
    const { profilePic, email } = data;

    const uploadedPictureId = await getImagePublicId(profilePic);

    if (email) {
        const emailAlreadyUsed = await prisma.user.findUnique({ where: { email } });

        if (emailAlreadyUsed) {
            throw new StatusError(500, 'This Email is already used');
        }
    }

    const editedUser = await prisma.user.update({
        data: {
            ...pickBy(data, identity),
            profilePic: uploadedPictureId,
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
