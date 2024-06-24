'use client';
import { Controller, Form, useForm } from 'react-hook-form';
import { authUserBodySchema, AuthUserBodyType } from '@/lib/schemas/user.schema';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, pages } from '@/lib/utils/routes';
import { Container, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useUserContext } from '@/components/hooks/userContext';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';
import { FormError } from '@/components/ErrorComponents/FormError';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { PageParams } from '@/lib/schemas/locale.schema';
import { useI18n } from '@/locales/client';

export default function LoginPage(pageProps: PageParams) {
    const t = useI18n();
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
            label: t('email'),
            required: true,
            autoComplete: 'email',
            inputType: 'textInput',
        },
        {
            name: 'password',
            label: t('password'),
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
            {...authenticationForm({ setErrorMessage, push, pageProps, mutate })}
        >
            <Container maxWidth="sm">
                <Typography component={'h2'} typography={'h4'} className={'!font-bold !mb-5'}>
                    {t('login_header')}
                </Typography>
                <Stack spacing={2} direction={'column'}>
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
                        {t('login')}
                    </ButtonComponent>
                    {(errorMessage?.error || errors.root?.message) && (
                        <FormError errors={errors} errorMessage={errorMessage} />
                    )}
                    <div>
                        <Typography component={'span'}>
                            {t('login_footer_text')}{' '}
                            <Link className={'text-primary-main'} href={`/${pageProps.params.locale}` + pages.register}>
                                {t('login_footer_link')}
                            </Link>
                        </Typography>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
