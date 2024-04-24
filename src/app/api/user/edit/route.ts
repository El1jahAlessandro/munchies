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
    const unknownForeName = formData.get('forename');
    const unknownLastName = formData.get('lastname');
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
                forename: unknownForeName !== 'undefined' ? unknownForeName : undefined,
                lastname: unknownLastName !== 'undefined' ? unknownLastName : undefined,
                accountType: formData.get('accountType') ?? undefined,
            }),
    };
    const { profilePic } = data;

    const uploadedPictureId = await getImagePublicId(profilePic);

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
