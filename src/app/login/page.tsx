'use client';
import { Controller, useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { authUserBodySchema, AuthUserBodyType } from '@/schemas/user.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, pages } from '@/utils/routes';
import { Button, CircularProgress, Container, Link, Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<AxiosError<{ error: string }>>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthUserBodyType>({
        resolver: zodResolver(authUserBodySchema),
    });

    const onSubmit = (formData: AuthUserBodyType) => {
        setIsLoading(true);
        setErrorMessage(undefined);
        setTimeout(async () => {
            try {
                await axios.post(api.user.auth, formData).then(() => {
                    setIsLoading(false);
                    push('/');
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    setIsLoading(false);
                    setErrorMessage(error);
                }
            }
        }, 3000);
    };

    return (
        <Container maxWidth="sm">
            <Stack spacing={2} direction={'column'} component="form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required={true}
                            label="Email address"
                            error={!!errors.email}
                            autoComplete={'email'}
                            helperText={errors.email ? errors.email.message : ''}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required={true}
                            label="Password"
                            error={!!errors.password}
                            autoComplete={'password'}
                            helperText={errors.password ? errors.password.message : ''}
                        />
                    )}
                />
                <Button type={'submit'} color={'success'} variant={'contained'}>
                    {isLoading ? <CircularProgress /> : 'Submit'}
                </Button>
                {errorMessage?.response?.data.error ||
                    (errors.root?.message && (
                        <div>
                            <span style={{ color: 'red' }}>
                                {errorMessage?.response?.data.error ?? errors.root?.message ?? ''}
                            </span>
                        </div>
                    ))}
                <div>
                    <span>
                        Don't have an account? <Link href={pages.register}>Register here</Link>
                    </span>
                </div>
            </Stack>
        </Container>
    );
}
