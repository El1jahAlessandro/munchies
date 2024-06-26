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
import { useCurrentLocale, useI18n } from '@/locales/client';

export default function RegisterPage() {
    const t = useI18n();
    const locale = useCurrentLocale();
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
            label: t(`account_name.${watch('accountType')}`),
            name: 'name',
            autoComplete: watch('accountType') === 'user' ? 'name' : 'organization',
            required: watch('accountType') === 'business',
            inputType: 'textInput',
        },
        {
            label: t(`email`),
            name: 'email',
            autoComplete: 'email',
            required: true,
            inputType: 'textInput',
        },
        {
            label: t(`password`),
            name: 'password',
            required: true,
            inputType: 'password',
        },
        {
            label: t(`confirm_password`),
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
            {...authenticationForm({ setErrorMessage, push, locale, mutate })}
        >
            <Container maxWidth="sm">
                <Typography component={'h2'} typography={'h4'} className={'!font-bold !mb-5'}>
                    {t('register_header')}
                </Typography>
                <Stack spacing={2} direction={'column'}>
                    <FormLabel id={RadioLabelId}>{t('account_type')}</FormLabel>
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
                                            label={t(`account_type_labels.${type}`)}
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
                        {t('register')}
                    </ButtonComponent>
                    {(errorMessage?.error || errors.root?.message) && (
                        <FormError errors={errors} errorMessage={errorMessage} />
                    )}
                    <div>
                        <Typography component={'span'}>
                            {t('register_footer_text')}{' '}
                            <Link className={'text-primary-main'} href={`/${locale}` + pages.login}>
                                {t('register_footer_link')}
                            </Link>
                        </Typography>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
