'use client';
import { first } from 'lodash';
import { Avatar } from '@mui/material';
import stc from 'string-to-color';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { cldImage } from '@/lib/utils/cloudinary-frontend';
import { User } from '@prisma/client';

type Props = {
    className?: string;
    width?: number;
    height?: number;
} & Pick<User, 'forename' | 'lastname' | 'profilePic'>;

function getInitials(name: string) {
    const words = name.split(' ');

    return words.length ? words.map(word => first(word) ?? '').join('') : first(name);
}

export const ProfilePic = ({ className, width = 100, height = 100, ...user }: Props) => {
    const name = user.forename + ' ' + (user.lastname ?? '');
    const pictureUrl = !!user.profilePic
        ? cldImage.image(user.profilePic).resize(fill().width(width?.toString()).height(height?.toString())).toURL()
        : undefined;
    const hasPB = !!user.profilePic && !!pictureUrl;
    const avatarAttributes = {
        ...{
            sx: {
                ...{ bgcolor: hasPB ? undefined : stc(name) },
                width,
                height,
            },
            children: hasPB ? undefined : getInitials(name),
            alt: hasPB ? name : undefined,
            src: hasPB && pictureUrl ? pictureUrl : undefined,
        },
    };
    return <Avatar {...avatarAttributes} />;
};