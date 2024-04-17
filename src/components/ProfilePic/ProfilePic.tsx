import { first } from 'lodash';
import { Avatar } from '@mui/material';
import stc from 'string-to-color';
import { User } from '@prisma/client';
import { v2 } from 'cloudinary';

type Props = {
    className?: string;
    width?: number;
    height?: number;
} & Pick<User, 'forename'> &
    Pick<User, 'lastname'> &
    Pick<User, 'profilePic'>;

function getInitials(name: string) {
    const words = name.split(' ');

    return words.length ? words.map(word => first(word) ?? '').join('') : first(name);
}

export const ProfilePic = ({ className, width, height, ...userData }: Props) => {
    const name = userData.forename + ' ' + (userData.lastname ?? '');
    const pictureUrl = userData.profilePic
        ? v2.url(userData.profilePic, {
              width,
              height,
          })
        : undefined;
    const hasPB = !!userData.profilePic && !!pictureUrl;
    const avatarAttributes = {
        ...{
            sx: {
                ...{ bgcolor: hasPB ? undefined : stc(name) },
                ...{ width: width ?? undefined },
                ...{ height: height ?? undefined },
            },
            children: hasPB ? undefined : getInitials(name),
            alt: hasPB ? name : undefined,
            src: hasPB && pictureUrl ? pictureUrl : undefined,
        },
    };
    return <Avatar {...avatarAttributes} />;
};
