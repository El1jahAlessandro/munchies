'use client';
import { Controller, Form, useForm } from 'react-hook-form';
import { CreateUserBodyType, createUserInputSchema } from '@/lib/schemas/user.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, pages } from '@/lib/utils/routes';
import {
    Button,
    CircularProgress,
    Container,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums } from '@prisma/client';
import Link from 'next/link';
import { useUserContext } from '@/components/hooks/userContext';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { toPascalCase } from '@/lib/helpers/toPascalCase';
import { PasswordInput } from '@/components/FormInputs/PasswordInput';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';

export default function RegisterPage() {
    const { push } = useRouter();
    const { mutate } = useUserContext();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();

    const {
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserBodyType>({
        defaultValues: {
            accountType: 'user',
        },
        resolver: zodResolver(createUserInputSchema),
    });

    const formInputOptions: FormInputOptionType<CreateUserBodyType>[] = [
        {
            label: watch('accountType') === 'user' ? 'Full Name' : 'Company Name',
            name: 'name',
            autocomplete: 'name',
            required: watch('accountType') !== 'user',
            inputType: 'textInput',
        },
        {
            label: 'Email Address',
            name: 'email',
            autocomplete: 'email',
            required: true,
            inputType: 'textInput',
        },
        {
            label: 'Password',
            name: 'password',
            required: true,
            inputType: 'password',
        },
        {
            label: 'Confirm Password',
            name: 'confirmPassword',
            required: true,
            inputType: 'password',
        },
    ];

    const RadioLabelId = 'account-type-group';

    return (
        <Form
            action={api.user.create}
            method={'post'}
            control={control}
            {...authenticationForm({ setErrorMessage, push, mutate })}
        >
            <Container maxWidth="sm">
                <Stack spacing={2} direction={'column'}>
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
                                            label={toPascalCase(type)}
                                        />
                                    ))}
                                </Grid>
                            </RadioGroup>
                        )}
                    />
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
                            Already have an account? <Link href={pages.login}>Log in here</Link>
                        </span>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
