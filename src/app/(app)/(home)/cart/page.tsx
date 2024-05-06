'use client';

import { useCartContext } from '@/components/hooks/cartContext';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';
import { Controller, ControllerRenderProps, Form, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/lib/utils/routes';
import { createFormData } from '@/lib/helpers/getFormData';
import { postFetcher } from '@/lib/helpers/fetcher';
import { map, pick } from 'lodash';
import { AmountHandler } from '@/components/FormInputs/AmountHandler';
import { CartItemType } from '@/lib/schemas/article.schema';
import { CldImage } from 'next-cloudinary';
import { truncateString } from '@/lib/helpers/truncateString';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { orderSchema, OrderType } from '@/lib/schemas/order.schema';
import { $Enums } from '@prisma/client';
import { toPascalCase } from '@/lib/helpers/toPascalCase';

export default function CartPage() {
    const { cartArticles, mutate } = useCartContext();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const { control, trigger, reset } = useForm<OrderType>({
        defaultValues: {
            articleOrders: useMemo(() => map(cartArticles, article => pick(article, ['id', 'amount'])), [cartArticles]),
        },
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClickOpen = (status: 'close' | 'open') => {
        setDialogOpen(status === 'open');
    };

    const deliveryCosts = 1;

    const subtotal = useMemo(
        () =>
            cartArticles?.reduce((previousPrice, currentArticle) => {
                return previousPrice + currentArticle.price;
            }, 0),
        [cartArticles]
    );

    const totalPrice = useMemo(() => Number((subtotal + deliveryCosts).toFixed(2)), [subtotal, deliveryCosts]);

    useEffect(() => {
        reset({
            totalPrice,
            articleOrders: map(cartArticles, article => {
                return { articleId: article.id, amount: article.amount };
            }),
        });
    }, [cartArticles]);

    const list = useMemo(
        () => [
            { label: <Typography component={'span'}>Zwischensumme</Typography>, value: subtotal },
            {
                label: <Typography component={'span'}>Lieferkosten</Typography>,
                value: deliveryCosts,
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
                value: totalPrice,
            },
        ],
        [subtotal, deliveryCosts, totalPrice]
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
            onSubmit={data => {
                console.log(orderSchema.parse(data.data));
                handleDialogClickOpen('close');
            }}
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
                                    alt={article.name}
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
                                            name={`articleOrders.${index}.amount`}
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
            <ButtonComponent
                type={'button'}
                onClick={() => handleDialogClickOpen('open')}
                size={'large'}
                positionFixed={true}
            >
                CHECKOUT
            </ButtonComponent>
            <Dialog
                open={dialogOpen}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        await trigger();
                    },
                }}
            >
                <DialogTitle>Bezahlmethode auswählen</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bitte gebe deine bevorzugte Bezahlmethode ein</DialogContentText>
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <RadioGroup {...field}>
                                <Grid>
                                    {Object.values($Enums.PaymentMethods).map(type => (
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
                    <DialogContentText>
                        <Typography>Gesamtkosten: {currencyFormatter(totalPrice)}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClickOpen('close')}>Abbrechen</Button>
                    <Button type="submit">Kauf abschließen</Button>
                </DialogActions>
            </Dialog>
        </Form>
    );
}
