import { User } from '@prisma/client';

export const getFullName = (user: Partial<Pick<User, 'forename' | 'lastname'>> | undefined) => {
    return (user?.forename ?? '') + ' ' + (user?.lastname ?? '');
};
