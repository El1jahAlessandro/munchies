'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { User } from '@prisma/client';
import { api } from '@/lib/utils/routes';
import { getFetcher } from '@/lib/helpers/getFetcher';
import { APIError } from '@/lib/schemas/common.schema';

export type UserMutateType = KeyedMutator<User> | VoidFunction;

type VoidFunction = () => void;
type UserContext = ReturnType<typeof getUserData> & { mutate: UserMutateType };

const UserContext = createContext<UserContext>({
    isLoading: false,
    isValidating: false,
    user: undefined,
    mutate: async () => new Promise(() => undefined),
    error: undefined,
});

export function useUserContext() {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw new Error('useUserContext must be used within a CounterProvider');
    }
    return userContext;
}

function getUserData() {
    const { data: user, error, isLoading, mutate, isValidating } = useSWR<User, APIError>(api.user.get, getFetcher);
    return { user, error, isLoading, mutate, isValidating };
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user, error, isLoading, mutate, isValidating } = getUserData();

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
