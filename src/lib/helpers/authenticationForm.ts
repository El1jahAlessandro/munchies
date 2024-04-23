import { Dispatch, SetStateAction } from 'react';
import { UserMutateType } from '@/components/hooks/userContext';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { pages } from '@/lib/utils/routes';

type ErrorType = { response: Response; error?: undefined } | { response?: undefined; error: unknown };

type FormFunctionType = {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setErrorMessage: Dispatch<SetStateAction<{ error: unknown } | undefined>>;
    push: AppRouterInstance['push'];
    mutate: UserMutateType;
};

export const authenticationForm = ({ setIsLoading, setErrorMessage, push, mutate }: FormFunctionType) => {
    const onSubmit = () => {
        setIsLoading(true);
        setErrorMessage(undefined);
    };
    const onSuccess = async () => {
        await mutate();
        push(pages.home);
        setIsLoading(false);
    };
    const onError = async (error: ErrorType) => {
        setIsLoading(false);
        setErrorMessage(await error.response?.json());
    };
    return { onSubmit, onSuccess, onError };
};
