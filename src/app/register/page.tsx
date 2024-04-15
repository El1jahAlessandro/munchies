'use client';
import { Controller, useForm } from 'react-hook-form';
import { AuthUserInputType, CreateUserBodyType, createUserInputSchema } from '@/schemas/user.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { api, pages } from '@/utils/routes';
import {
    Button,
    CircularProgress,
    Container,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    Link,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums } from '@prisma/client';

export default function RegisterPage() {
    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthUserInputType>({
        defaultValues: {
            accountType: 'user',
        },
        resolver: zodResolver(createUserInputSchema),
    });
    const [errorMessage, setErrorMessage] = useState<AxiosError<{ error: string }>>();

    const onSubmit = (formData: CreateUserBodyType) => {
        setIsLoading(true);
        setErrorMessage(undefined);
        console.log(formData);
        setTimeout(async () => {
            try {
                await axios.post(api.user.create, formData).then(() => {
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

    const RadioLabelId = 'account-type-group';
    const PictureLabelId = 'profile-picture-input';

    return (
        <Container maxWidth="sm">
            <Stack spacing={2} direction={'column'} component="form" onSubmit={handleSubmit(onSubmit)}>
                <FormLabel id={RadioLabelId}>Account Type</FormLabel>
                <Controller
                    rules={{ required: true }}
                    control={control}
                    name="accountType"
                    render={({ field }) => (
                        <RadioGroup {...field}>
                            <Grid>
                                {Object.values($Enums.AccountType).map(type => (
                                    <FormControlLabel
                                        value={type}
                                        key={type}
                                        control={<Radio />}
                                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                                    />
                                ))}
                            </Grid>
                        </RadioGroup>
                    )}
                />
                {watch('accountType') === 'user' && (
                    <Grid container columns={2}>
                        <Grid xs={1}>
                            <Controller
                                name="forename"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth={true}
                                        label="Firstname"
                                        error={!!errors.forename}
                                        autoComplete={'given-name'}
                                        helperText={errors.forename ? errors.forename.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={1}>
                            <Controller
                                name="lastname"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth={true}
                                        label="Lastname"
                                        error={!!errors.lastname}
                                        autoComplete={'family-name'}
                                        helperText={errors.lastname ? errors.lastname.message : ''}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                )}
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
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required={true}
                            label="Confirm Password"
                            error={!!errors.confirmPassword}
                            autoComplete={'password'}
                            helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                        />
                    )}
                />
                {watch('accountType') === 'business' && (
                    <>
                        <FormLabel id={PictureLabelId}>Profile Picture</FormLabel>
                        <Controller
                            name="profilePic"
                            control={control}
                            render={({ field }) => <Input {...field} type={'file'} />}
                        />
                    </>
                )}
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
                        Already have an account? <Link href={pages.login}>Log in here</Link>
                    </span>
                </div>
            </Stack>
        </Container>
    );
}
