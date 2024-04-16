'use client';
import { Controller, Form, useForm } from 'react-hook-form';
import { authUserBodySchema, AuthUserBodyType } from '@/schemas/user.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, pages } from '@/utils/routes';
import { Button, CircularProgress, Container, Link, Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<
        | { response: Response; error?: undefined }
        | {
              response?: undefined;
              error: unknown;
          }
    >();

    const {
        control,
        formState: { errors },
    } = useForm<AuthUserBodyType>({
        resolver: zodResolver(authUserBodySchema),
    });

    return (
        <Form
            action={api.user.auth}
            method={'post'}
            control={control}
            onSubmit={() => {
                setIsLoading(true);
                setErrorMessage(undefined);
            }}
            onSuccess={() => {
                setIsLoading(false);
                push('/');
            }}
            onError={error => {
                setIsLoading(false);
                setErrorMessage(error);
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={2} direction={'column'}>
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
                    {(errorMessage?.error || errors.root?.message) && (
                        <>
                            <div>
                                <span style={{ color: 'red' }}>
                                    {(errorMessage?.error as string) ?? errors.root?.message ?? ''}
                                </span>
                            </div>
                        </>
                    )}
                    <div>
                        <span>
                            Don't have an account? <Link href={pages.register}>Register here</Link>
                        </span>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
