import { Dispatch, SetStateAction } from 'react';
import { UserMutateType } from '@/components/hooks/userContext';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { pages } from '@/lib/utils/routes';
import { FieldValues, UseFormReset } from 'react-hook-form';

type ErrorType = { response: Response; error?: undefined } | { response?: undefined; error: unknown };

type FormFunctionType<TFieldValues extends FieldValues> = {
    setErrorMessage: Dispatch<SetStateAction<{ error: unknown } | undefined>>;
    mutate: UserMutateType;
    push?: AppRouterInstance['push'];
    reset?: UseFormReset<TFieldValues>;
};

export const authenticationForm = <TFieldValues extends FieldValues>({
    setErrorMessage,
    push,
    reset,
    mutate,
}: FormFunctionType<TFieldValues>) => {
    const onSubmit = () => {
        setErrorMessage(undefined);
    };
    const onSuccess = async () => {
        mutate && (await mutate());
        push && push(pages.home);
        reset && reset();
    };
    const onError = async (error: ErrorType) => {
        setErrorMessage(await error.response?.json());
    };
    return { onSubmit, onSuccess, onError };
};
