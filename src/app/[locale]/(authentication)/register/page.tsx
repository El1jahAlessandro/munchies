'use client';
import { Controller, Form, useForm } from 'react-hook-form';
import { CreateUserBodyType, createUserInputSchema } from '@/lib/schemas/user.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, pages } from '@/lib/utils/routes';
import { Container, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums } from '@prisma/client';
import Link from 'next/link';
import { useUserContext } from '@/components/hooks/userContext';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';
import { FormError } from '@/components/ErrorComponents/FormError';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { PageParams } from '@/lib/schemas/locale.schema';

export default function RegisterPage(pageProps: PageParams) {
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
            label: watch('accountType') === 'user' ? 'Name' : 'Firmenname',
            name: 'name',
            autoComplete: watch('accountType') === 'user' ? 'name' : 'organization',
            required: watch('accountType') === 'business',
            inputType: 'textInput',
        },
        {
            label: 'E-Mail-Adresse',
            name: 'email',
            autoComplete: 'email',
            required: true,
            inputType: 'textInput',
        },
        {
            label: 'Passwort',
            name: 'password',
            required: true,
            inputType: 'password',
        },
        {
            label: 'Passwort bestätigen',
            name: 'confirmPassword',
            required: true,
            inputType: 'password',
        },
    ];

    const radioOptionLabels = {
        user: 'Käufer',
        business: 'Restaurant',
    };

    const RadioLabelId = 'account-type-group';

    return (
        <Form
            action={api.user.create}
            method={'post'}
            control={control}
            {...authenticationForm({ setErrorMessage, push, pageProps, mutate })}
        >
            <Container maxWidth="sm">
                <Typography component={'h2'} typography={'h4'} className={'!font-bold !mb-5'}>
                    Registrierung
                </Typography>
                <Stack spacing={2} direction={'column'}>
                    <FormLabel id={RadioLabelId}>Account-Typ</FormLabel>
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="accountType"
                        render={({ field }) => (
                            <RadioGroup {...field} className={'!m-0'}>
                                <Grid>
                                    {Object.values($Enums.AccountType).map(type => (
                                        <FormControlLabel
                                            value={type}
                                            key={type}
                                            control={<Radio />}
                                            label={radioOptionLabels[type]}
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
                    <ButtonComponent
                        type={'submit'}
                        color={'success'}
                        variant={'contained'}
                        isSubmitting={isSubmitting}
                    >
                        Registrieren
                    </ButtonComponent>
                    {(errorMessage?.error || errors.root?.message) && (
                        <FormError errors={errors} errorMessage={errorMessage} />
                    )}
                    <div>
                        <Typography component={'span'}>
                            Sie haben bereits ein Konto?{' '}
                            <Link className={'text-primary-main'} href={pages.login} locale={pageProps.params.locale}>
                                Hier anmelden
                            </Link>
                        </Typography>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
