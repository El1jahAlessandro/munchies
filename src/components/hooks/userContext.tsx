'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { User } from '@prisma/client';
import { api, pages } from '@/lib/utils/routes';
import { APIError } from '@/lib/schemas/common.schema';
import { getFetcher } from '@/lib/helpers/fetcher';
import { UserResponseType } from '@/lib/schemas/user.schema';
import { usePathname } from 'next/navigation';

export type UserMutateType = KeyedMutator<User> | VoidFunction;

type VoidFunction = () => void;
type UserContext = ReturnType<typeof getUserData> & { mutate: UserMutateType };

const defaultValue = {
    isLoading: false,
    isValidating: false,
    user: undefined,
    mutate: async () => new Promise(() => undefined),
    error: undefined,
} satisfies UserContext;

const UserContext = createContext<UserContext>(defaultValue);

export function useUserContext() {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return userContext;
}

function getUserData() {
    const {
        data: user,
        error,
        isLoading,
        mutate,
        isValidating,
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useSWR<UserResponseType, APIError>(api.user.get, getFetcher);
    return { user, error, isLoading, mutate, isValidating };
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const { user, error, isLoading, mutate, isValidating } = [pages.login, pages.register].includes(pathname)
        ? defaultValue
        : getUserData();

    const value = useMemo(
        () => ({
            user,
            error,
            isLoading,
            mutate,
            isValidating,
        }),
        [user, error, isLoading, mutate, isValidating]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
