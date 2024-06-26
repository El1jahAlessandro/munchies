'use client';
import { first } from 'lodash';
import { Avatar } from '@mui/material';
import stc from 'string-to-color';
import { User } from '@prisma/client';
import { getCldImageUrl } from 'next-cloudinary';
import { useUserContext } from '@/components/hooks/userContext';
import { AvatarProps } from '@mui/material/Avatar/Avatar';

type UserProps = Partial<Pick<User, 'name' | 'profilePic'>>;

type Props = {
    className?: string;
    width?: number;
    height?: number;
    previewPicture?: string;
} & Omit<AvatarProps, 'id'>;

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
    previewPicture,
    name,
    ...avatarProps
}: AvatarAttrProps) {
    const { sx, ...restAvatarProps } = avatarProps;
    const bgcolor = !hasPB ? stc(name) : undefined;
    return {
        ...{
            sx: {
                ...{ bgcolor },
                width,
                height,
                ...sx,
            },
            ...{ children: !hasPB && !previewPicture ? getInitials(name ?? '') : undefined },
            ...{ alt: hasPB ? name : undefined },
            ...{ src: previewPicture ?? (hasPB && pictureUrl ? pictureUrl : undefined) },
            ...restAvatarProps,
        },
    };
}

export default function ProfilePic({ width = 50, height = 50, previewPicture, ...avatarProps }: Props) {
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
        <Avatar
            {...getAvatarAttributes({
                width,
                height,
                pictureUrl,
                hasPB,
                previewPicture,
                ...avatarProps,
            })}
        />
    );
}
