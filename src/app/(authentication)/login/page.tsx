'use client';
import { Controller, Form, useForm } from 'react-hook-form';
import { authUserBodySchema, AuthUserBodyType } from '@/lib/schemas/user.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, pages } from '@/lib/utils/routes';
import { Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useUserContext } from '@/components/hooks/userContext';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';
import { FormError } from '@/components/ErrorComponents/FormError';

export default function LoginPage() {
    const { push } = useRouter();
    const { mutate } = useUserContext();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();

    const {
        control,
        formState: { errors, isSubmitting },
    } = useForm<AuthUserBodyType>({
        resolver: zodResolver(authUserBodySchema),
    });

    const formInputOptions: FormInputOptionType<AuthUserBodyType>[] = [
        {
            name: 'email',
            label: 'Email address',
            required: true,
            autoComplete: 'email',
            inputType: 'textInput',
        },
        {
            name: 'password',
            label: 'Password',
            required: true,
            autoComplete: 'password',
            inputType: 'password',
        },
    ];

    return (
        <Form
            action={api.user.auth}
            method={'post'}
            control={control}
            {...authenticationForm({ setErrorMessage, push, mutate })}
        >
            <Container maxWidth="sm">
                <Stack spacing={2} direction={'column'}>
                    {formInputOptions.map(optionProps => (
                        <Controller
                            key={optionProps.name}
                            name={optionProps.name}
                            control={control}
                            render={({ field }) => <FormInputController {...field} {...optionProps} />}
                        />
                    ))}
                    <Button type={'submit'} color={'success'} variant={'contained'}>
                        {isSubmitting ? <CircularProgress /> : 'Submit'}
                    </Button>
                    {(errorMessage?.error || errors.root?.message) && (
                        <FormError errors={errors} errorMessage={errorMessage} />
                    )}
                    <div>
                        <Typography component={'span'}>
                            {"Don't have an account?"} <Link href={pages.register}>Register here</Link>
                        </Typography>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
