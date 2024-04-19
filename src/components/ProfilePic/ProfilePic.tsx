'use client';
import { first } from 'lodash';
import { Avatar } from '@mui/material';
import stc from 'string-to-color';
import { User } from '@prisma/client';
import { getCldImageUrl } from 'next-cloudinary';

type UserProps = Partial<Pick<User, 'forename' | 'lastname' | 'profilePic'>>;

type Props = {
    className?: string;
    width?: number;
    height?: number;
} & UserProps;

type AvatarAttrProps = {
    hasPB: Boolean;
    pictureUrl: string | false;
} & UserProps &
    Props;

function getInitials(name: string) {
    const words = name.split(' ');

    return words.length ? words.map(word => first(word) ?? '').join('') : first(name);
}

function getAvatarAttributes({ width, height, hasPB, pictureUrl, className, ...user }: AvatarAttrProps) {
    const name = (user?.forename ?? '') + ' ' + (user?.lastname ?? '');
    const bgcolor = !hasPB ? stc(name) : undefined;
    return {
        ...{
            sx: {
                ...{ bgcolor },
                width,
                height,
            },
            ...{ children: !hasPB ? getInitials(name) : undefined },
            ...{ alt: hasPB ? name : undefined },
            ...{ src: hasPB && pictureUrl ? pictureUrl : undefined },
            className,
        },
    };
}

export const ProfilePic = ({ className, width = 50, height = 50, ...user }: Props) => {
    const pictureUrl =
        !!user?.profilePic &&
        getCldImageUrl({
            width,
            height,
            src: user.profilePic,
        });
    const hasPB = !!user.profilePic && !!pictureUrl;
    return <Avatar {...getAvatarAttributes({ className, width, height, pictureUrl, hasPB, ...user })} />;
};
