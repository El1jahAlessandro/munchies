'use client';

import { useCartContext } from '@/components/hooks/cartContext';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { useEffect, useMemo, useState } from 'react';
import { IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Controller, ControllerRenderProps, Form, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/lib/utils/routes';
import { createFormData } from '@/lib/helpers/getFormData';
import { postFetcher } from '@/lib/helpers/fetcher';
import { pick } from 'lodash';
import { AmountHandler } from '@/components/FormInputs/AmountHandler';
import { CartItemType } from '@/lib/schemas/article.schema';
import { CldImage } from 'next-cloudinary';
import { truncateString } from '@/lib/helpers/truncateString';
import { ButtonComponent } from '@/components/common/ButtonComponent';

export default function CartPage() {
    const { cartArticles, mutate } = useCartContext();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const { control, setValue, reset } = useForm<{ cartItems: CartItemType[] }>({
        defaultValues: {
            cartItems: useMemo(() => cartArticles, [cartArticles]),
        },
    });

    const subtotal = useMemo(
        () =>
            cartArticles?.reduce((previousPrice, currentArticle) => {
                return previousPrice + currentArticle.price;
            }, 0),
        [cartArticles]
    );

    useEffect(() => {
        reset({ cartItems: cartArticles });
    }, [cartArticles]);

    const list = useMemo(
        () => [
            { label: <Typography component={'span'}>Zwischensumme</Typography>, value: subtotal },
            {
                label: <Typography component={'span'}>Lieferkosten</Typography>,
                value: 1,
            },
            {
                label: (
                    <>
                        <Typography component={'span'}>Gesamtkosten</Typography>
                        <Typography
                            component={'span'}
                            variant={'caption'}
                            sx={{ color: 'secondary.main', marginLeft: '5px' }}
                        >
                            ({cartArticles.length} Artikel)
                        </Typography>
                    </>
                ),
                value: subtotal + 1,
            },
        ],
        [subtotal]
    );

    function RemoveButton({ article }: { article: CartItemType }) {
        return (
            <IconButton
                style={{ padding: 0, height: 'fit-content' }}
                sx={{ color: 'primary.main' }}
                aria-label="remove"
                onClick={async () => {
                    await postFetcher(api.cart.remove, createFormData(pick(article, ['id', 'amount'])));
                    await mutate();
                }}
            >
                <CloseIcon />
            </IconButton>
        );
    }

    function ArticleAmountHandler({
        article,
        field,
    }: {
        article: CartItemType;
        field: Omit<ControllerRenderProps, 'onChange' | 'value'>;
    }) {
        return (
            <AmountHandler
                minusButtonOnClick={async () => {
                    await postFetcher(
                        api.cart.put,
                        createFormData({
                            id: article.id,
                            amount: -1,
                        })
                    );
                    await mutate();
                }}
                plusButtonOnClick={async () => {
                    await postFetcher(
                        api.cart.put,
                        createFormData({
                            id: article.id,
                            amount: 1,
                        })
                    );
                    await mutate();
                }}
                minusButtonProps={{ ...field, disabled: article.amount === 1 }}
                plusButtonProps={{ ...field }}
            >
                {article.amount < 10 ? '0' + article.amount : article.amount}
            </AmountHandler>
        );
    }

    return (
        <Form
            action={''}
            method={'post'}
            control={control}
            onSubmit={data => console.log(data)}
            // {...authenticationForm({
            //     setErrorMessage,
            //     mutate,
            // })}
        >
            {cartArticles && cartArticles.length > 0 && (
                <>
                    {cartArticles.map((article, index) => (
                        <div style={{ marginTop: '25px' }} key={article.id}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <CldImage
                                    style={{ flex: '0 0 90px', borderRadius: '20px' }}
                                    width={90}
                                    height={90}
                                    src={article.picture}
                                    alt={''}
                                />
                                <Stack direction={'column'} sx={{ flex: 1 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '20px',
                                            width: '100%',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div>
                                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                                {article?.name}
                                            </Typography>
                                            <Typography
                                                component={'div'}
                                                sx={{
                                                    margin: '8px 0 4px 0',
                                                    color: 'secondary.main',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {truncateString(article?.description ?? '', 25)}
                                            </Typography>
                                        </div>
                                        <div>
                                            <RemoveButton article={article} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Typography
                                                component={'span'}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: 'primary.main',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {currencyFormatter(article?.price ?? 0)}
                                            </Typography>
                                        </div>
                                        <Controller
                                            name={`cartItems.${index}.amount`}
                                            control={control}
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <ArticleAmountHandler article={article} field={field} />
                                            )}
                                        />
                                    </div>
                                </Stack>
                            </div>
                        </div>
                    ))}
                    <TableContainer style={{ marginTop: '20px', marginBottom: '180px' }}>
                        <Table>
                            <TableBody>
                                {list.map(({ label, value }, index) => (
                                    <TableRow
                                        key={'listItem - ' + index}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                        }}
                                    >
                                        <TableCell sx={{ paddingX: 0 }}>{label}</TableCell>
                                        <TableCell align={'right'} sx={{ paddingX: 0 }}>
                                            <Typography component={'span'} sx={{ fontWeight: 'bold' }}>
                                                {currencyFormatter(value)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <div style={{ margin: 'auto', left: 0, right: 0, bottom: 90, position: 'fixed', textAlign: 'center' }}>
                <ButtonComponent type={'submit'} size={'large'}>
                    CHECKOUT
                </ButtonComponent>
            </div>
        </Form>
    );
}
