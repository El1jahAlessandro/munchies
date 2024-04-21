'use client';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { User } from '@prisma/client';
import { api } from '@/lib/utils/routes';
import { fetcher } from '@/lib/helpers/fetcher';
import { APIError } from '@/lib/schemas/common.schema';

type UserContext = { user: User | undefined; error: APIError | undefined };

const UserContext = createContext<UserContext>({ user: undefined, error: undefined });

export function useUserContext() {
    const userContext = useContext(UserContext);
    if (userContext === undefined) {
        throw new Error('useUserContext must be used within a CounterProvider');
    }
    return userContext;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: user, error } = useSWR<User, APIError>(api.user.get, fetcher);

    const value = useMemo(() => ({ user, error }), [user, error]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
