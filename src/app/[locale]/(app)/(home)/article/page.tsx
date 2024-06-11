'use client';
import { useSearchParams } from 'next/navigation';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { useArticlesContext } from '@/components/hooks/articlesContext';
import { Controller, Form, useForm } from 'react-hook-form';
import { CartItemType, GetCartItemsBodyType } from '@/lib/schemas/article.schema';
import { api } from '@/lib/utils/routes';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import React, { useCallback, useState } from 'react';
import { Typography } from '@mui/material';
import { useCartContext } from '@/components/hooks/cartContext';
import { AmountHandler } from '@/components/FormInputs/AmountHandler';
import { CldImage } from 'next-cloudinary';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import getFormFetcherResponse from '@/lib/helpers/getFormFetcherResponse';
import { omit } from 'lodash';
import { useI18n } from '@/locales/client';
import { PageParams } from '@/lib/schemas/locale.schema';

export default function ArticlePage({ params: { locale } }: PageParams) {
    const t = useI18n();
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

    const onSuccess = useCallback(
        async ({ response }: { response: Response }) => {
            const newData = await getFormFetcherResponse<GetCartItemsBodyType>(response);
            await mutate(newData);
        },
        [mutate]
    );

    return (
        <Form
            action={api.cart.put}
            method={'post'}
            control={control}
            {...omit(
                authenticationForm({
                    setErrorMessage,
                }),
                'onSuccess'
            )}
            onSuccess={onSuccess}
        >
            <input type="hidden" {...register(`id`)} value={Number(articleId)} />
            {article && (
                <>
                    <div className={'flex justify-center'}>
                        <CldImage
                            className={'rounded-[15px]'}
                            alt={article.name}
                            width="720"
                            height="405"
                            src={article.picture}
                            sizes={'(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                            crop={'thumb'}
                            aspectRatio={3 / 2}
                            gravity={'center'}
                        />
                    </div>
                    <Typography component={'div'} variant={'h4'} className={'font-[600] mt-5'}>
                        {article.name}
                    </Typography>
                    <div className={'flex justify-between mt-[20px]'}>
                        <Typography
                            className={'font-bold flex justify-center items-center text-primary-main'}
                            variant={'h5'}
                            component={'span'}
                        >
                            {currencyFormatter(article.price * watch('amount'), locale)}
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
                    <Typography variant={'subtitle1'} component={'p'} className={'mt-5'}>
                        {article.description}
                    </Typography>
                    <Typography variant={'subtitle1'} component={'p'} className={'mt-5'}>
                        <b>{t('ingredients')}:</b> {article.ingredients}
                    </Typography>
                </>
            )}

            <ButtonComponent
                isSubmitting={isSubmitting}
                size={'medium'}
                variant={'contained'}
                color={'primary'}
                type={'submit'}
                positionFixed={true}
                startIcon={<ShoppingBagIcon />}
            >
                {t('add_to_cart').toUpperCase()}
            </ButtonComponent>
            {error && <span>{error?.response?.data?.error}</span>}
        </Form>
    );
}
