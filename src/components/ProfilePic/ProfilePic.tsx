'use client';
import { first } from 'lodash';
import { Avatar } from '@mui/material';
import stc from 'string-to-color';
import { User } from '@prisma/client';
import { getCldImageUrl } from 'next-cloudinary';
import { useUserContext } from '@/components/hooks/userContext';

type UserProps = Partial<Pick<User, 'name' | 'profilePic'>>;

type Props = {
    className?: string;
    width?: number;
    height?: number;
    previewPicture?: string;
};

type AvatarAttrProps = {
    hasPB: Boolean;
    pictureUrl: string | false;
} & UserProps &
    Props;

function getInitials(name: string) {
    const words = name.split(' ');

    return words.length ? words.map(word => first(word) ?? '').join('') : first(name);
}

function getAvatarAttributes({
    width,
    height,
    hasPB,
    pictureUrl,
    className,
    previewPicture,
    ...user
}: AvatarAttrProps) {
    const bgcolor = !hasPB ? stc(user.name) : undefined;
    return {
        ...{
            sx: {
                ...{ bgcolor },
                width,
                height,
            },
            ...{ children: !hasPB && !previewPicture ? getInitials(user.name ?? '') : undefined },
            ...{ alt: hasPB ? user.name : undefined },
            ...{ src: previewPicture ?? (hasPB && pictureUrl ? pictureUrl : undefined) },
            className,
        },
    };
}

export default function ProfilePic({ className, width = 50, height = 50, previewPicture }: Props) {
    const { user } = useUserContext();
    const pictureUrl =
        !!user?.profilePic &&
        !previewPicture &&
        getCldImageUrl({
            width,
            height,
            src: user.profilePic,
        });
    const hasPB = !!user?.profilePic && !!pictureUrl;
    return (
        <Avatar {...getAvatarAttributes({ className, width, height, pictureUrl, hasPB, previewPicture, ...user })} />
    );
}
