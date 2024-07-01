import { NextResponse } from 'next/server';
import { asyncNextHandler, StatusError } from '@/lib/helpers/asyncNextHandler';
import { UserResponseType } from '@/lib/schemas/user.schema';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/helpers/getUserData';

export const GET = asyncNextHandler<UserResponseType>(async () => {
    const clerkId = auth().userId!;

    const user = await getUserByClerkId(clerkId);

    if (!user) {
        throw new StatusError(401, 'You are not authorized');
    }

    return NextResponse.json(user, { status: 200 });
});
