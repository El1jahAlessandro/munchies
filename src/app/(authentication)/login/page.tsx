'use client';
import { Controller, Form, useForm } from 'react-hook-form';
import { authUserBodySchema, AuthUserBodyType } from '@/lib/schemas/user.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, pages } from '@/lib/utils/routes';
import { Button, CircularProgress, Container, Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useUserContext } from '@/components/hooks/userContext';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { z } from 'zod';

const inputPropsSchema = z
    .object({
        name: z.enum(['email', 'password']),
        label: z.string(),
    })
    .array();

const inputProps = inputPropsSchema.parse([
    { name: 'email', label: 'Email address' },
    { name: 'password', label: 'Password' },
]);

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

    return (
        <Form
            action={api.user.auth}
            method={'post'}
            control={control}
            {...authenticationForm({ setErrorMessage, push, mutate })}
        >
            <Container maxWidth="sm">
                <Stack spacing={2} direction={'column'}>
                    {inputProps.map(({ name, label }) => (
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id={`input-id-${name}`}
                                    required={true}
                                    label={label}
                                    error={!!errors[name]}
                                    autoComplete={name}
                                    helperText={errors[name] ? errors[name]?.message : ''}
                                />
                            )}
                        />
                    ))}
                    <Button type={'submit'} color={'success'} variant={'contained'}>
                        {isSubmitting ? <CircularProgress /> : 'Submit'}
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
