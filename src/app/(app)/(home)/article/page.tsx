'use client';
import { useSearchParams } from 'next/navigation';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { useArticlesContext } from '@/components/hooks/articlesContext';
import { Controller, Form, useForm } from 'react-hook-form';
import { CartItemType } from '@/lib/schemas/article.schema';
import { api } from '@/lib/utils/routes';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useCartContext } from '@/components/hooks/cartContext';
import { AmountHandler } from '@/components/FormInputs/AmountHandler';
import { CldImage } from 'next-cloudinary';
import { ButtonComponent } from '@/components/common/ButtonComponent';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const { mutate } = useCartContext();
    const articleId = searchParams.get('id');
    const { articles, error } = useArticlesContext();
    const article = articles?.find(article => article.id === Number(articleId));

    const {
        register,
        setValue,
        watch,
        control,
        formState: { isSubmitting },
    } = useForm<CartItemType>({
        defaultValues: {
            id: Number(articleId),
            amount: 1,
        },
    });

    return (
        <Form
            action={api.cart.put}
            method={'post'}
            control={control}
            {...authenticationForm({
                setErrorMessage,
                mutate,
            })}
        >
            <input type="hidden" {...register(`id`)} value={Number(articleId)} />
            {article && (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <CldImage
                            alt={article.name}
                            width="720"
                            height="405"
                            src={article.picture}
                            sizes={'(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                            crop={'thumb'}
                            aspectRatio={3 / 2}
                            gravity={'center'}
                            style={{ borderRadius: '15px' }}
                        />
                    </div>
                    <Typography component={'div'} variant={'h4'} sx={{ fontWeight: 600 }} mt={2.5}>
                        {article.name}
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Typography
                            sx={{
                                fontWeight: 'bolder',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'primary.main',
                            }}
                            variant={'h5'}
                            component={'span'}
                        >
                            {currencyFormatter(article.price * watch('amount'))}
                        </Typography>
                        <Controller
                            name={'amount'}
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <AmountHandler
                                    minusButtonOnClick={() => {
                                        setValue('amount', value - 1);
                                    }}
                                    plusButtonOnClick={() => {
                                        setValue('amount', value + 1);
                                    }}
                                    minusButtonProps={{ ...field, disabled: value === 1 }}
                                    plusButtonProps={{ ...field }}
                                >
                                    {value < 10 ? '0' + value : value}
                                </AmountHandler>
                            )}
                        />
                    </div>
                    <Typography variant={'subtitle1'} component={'p'} mt={2.5}>
                        {article.description}
                    </Typography>
                    <Typography variant={'subtitle1'} component={'p'} mt={2.5}>
                        <b>Zutaten:</b> {article.ingredients}
                    </Typography>
                </>
            )}

            <ButtonComponent
                isSubmitting={isSubmitting}
                size={'small'}
                variant={'contained'}
                color={'primary'}
                type={'submit'}
                positionFixed={true}
            >
                ZUM WARENKORB HINZUFÜGEN
            </ButtonComponent>
            {error && <span>{error?.response?.data?.error}</span>}
        </Form>
    );
}
