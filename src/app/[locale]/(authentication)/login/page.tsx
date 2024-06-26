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
import { ErrorType } from '@/lib/helpers/authenticationForm';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';
import { FormError } from '@/components/ErrorComponents/FormError';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { useCurrentLocale, useI18n } from '@/locales/client';
import SocialLoginButtons from '@/components/FormInputs/SocialLoginButtons';
import { pushWithLocale } from '@/lib/helpers/pushWithLocale';

export default function LoginPage() {
    const t = useI18n();
    const locale = useCurrentLocale();
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
            onSubmit={() => setErrorMessage(undefined)}
            onSuccess={async () => {
                await mutate();
                pushWithLocale(pages.home, push, locale);
            }}
            onError={async (error: ErrorType) => setErrorMessage(await error.response?.json())}
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
                    <SocialLoginButtons />
                    <div>
                        <Typography component={'span'}>
                            {t('login_footer_text')}{' '}
                            <Link className={'text-primary-main'} href={`/${locale}` + pages.register}>
                                {t('login_footer_link')}
                            </Link>
                        </Typography>
                    </div>
                </Stack>
            </Container>
        </Form>
    );
}
