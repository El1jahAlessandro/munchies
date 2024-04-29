'use client';
import { useSearchParams } from 'next/navigation';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { useArticlesContext } from '@/components/hooks/articlesContext';
import { Controller, Form, useForm } from 'react-hook-form';
import { CartItemType } from '@/lib/schemas/article.schema';
import { api } from '@/lib/utils/routes';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import React, { useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useCartContext } from '@/components/hooks/cartContext';
import { AmountHandler } from '@/components/FormInputs/AmountHandler';

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
                    <h1>{article.name}</h1>
                    <p>{article.description}</p>
                    <p>{article.ingredients}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
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
                </>
            )}

            <Button variant={'contained'} color={'primary'} type={'submit'}>
                {isSubmitting ? <CircularProgress /> : 'Zum Warenkorb hinzufügen'}
            </Button>
            {error && <span>{error?.response?.data?.error}</span>}
        </Form>
    );
}
