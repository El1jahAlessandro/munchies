'use client';

import { useCartContext } from '@/components/hooks/cartContext';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import {
    Backdrop,
    Button,
    ButtonProps,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
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
import CheckIcon from '@mui/icons-material/Check';
import { api, pages } from '@/lib/utils/routes';
import { createFormData } from '@/lib/helpers/getFormData';
import { postFetcher } from '@/lib/helpers/fetcher';
import { AmountHandler } from '@/components/FormInputs/AmountHandler';
import { CartItemType, GetCartItemsBodyType } from '@/lib/schemas/article.schema';
import { CldImage } from 'next-cloudinary';
import { truncateString } from '@/lib/helpers/truncateString';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { CreateOrderType, OrderType } from '@/lib/schemas/order.schema';
import { $Enums } from '@prisma/client';
import { toPascalCase } from '@/lib/helpers/toPascalCase';
import ClearIcon from '@mui/icons-material/Clear';
import { ErrorType } from '@/lib/helpers/authenticationForm';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/components/hooks/userContext';
import getFormFetcherResponse from '@/lib/helpers/getFormFetcherResponse';
import { pick } from 'lodash';

export default function CartPage() {
    const { push } = useRouter();
    const { user, mutate: userMutate } = useUserContext();
    const { cartArticles, mutate: cartMutate } = useCartContext();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const { control, trigger, register } = useForm<OrderType>({
        defaultValues: {
            ordersArticles: useMemo(
                () =>
                    cartArticles.map(({ id, userId, ...article }) => ({
                        ...pick(article, ['amount', 'price']),
                        articleId: id,
                        companyId: userId,
                    })),
                [cartArticles]
            ),
        },
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDialogClickOpen = (status: 'close' | 'open') => {
        setDialogOpen(status === 'open');
    };

    const buttonSx: (type: 'primary' | 'error') => ButtonProps['sx'] = type => {
        return {
            bgcolor: `${type}.main`,
            '&:hover': {
                bgcolor: `${type}.main`,
            },
        };
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
                        <Typography component={'span'} variant={'caption'} className={'text-secondary-main ml-[5px]'}>
                            ({cartArticles.length} Artikel)
                        </Typography>
                    </>
                ),
                value: totalPrice,
            },
        ],
        [subtotal, cartArticles.length, totalPrice]
    );

    const handleItemClick = useCallback(
        async (id: number, amount: Number, remove?: boolean) => {
            const newData = await postFetcher<GetCartItemsBodyType>(
                api.cart.put,
                createFormData({
                    id,
                    amount,
                    remove,
                })
            );
            await cartMutate(newData);
        },
        [cartMutate]
    );

    function RemoveButton({ article }: { article: CartItemType }) {
        return (
            <IconButton
                className={'p-0 h-fit text-primary-main'}
                aria-label="remove"
                onClick={() => handleItemClick(article.id, article.amount, true)}
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
                minusButtonOnClick={() => handleItemClick(article.id, -1)}
                plusButtonOnClick={() => handleItemClick(article.id, 1)}
                minusButtonProps={{ ...field, disabled: article.amount === 1 }}
                plusButtonProps={{ ...field }}
            >
                {article.amount < 10 ? '0' + article.amount : article.amount}
            </AmountHandler>
        );
    }

    return (
        <Form
            action={api.order.create}
            method={'post'}
            control={control}
            onSubmit={() => {
                handleDialogClickOpen('close');
                setBackdropOpen(true);
                setLoading(true);
            }}
            onSuccess={async ({ response }) => {
                const newData = await getFormFetcherResponse<CreateOrderType>(response);
                setSuccess(true);
                setLoading(false);
                setTimeout(async () => {
                    setBackdropOpen(false);
                    await cartMutate([]);
                    if (user) {
                        await userMutate({
                            ...user,
                            buyedArticles: [...user.buyedArticles, ...newData],
                        });
                    }
                    push(pages.orders);
                }, 2000);
            }}
            onError={async (error: ErrorType) => {
                setErrorMessage(await error.response?.json());
                setError(true);
                setLoading(false);
                setTimeout(() => setBackdropOpen(false), 2000);
            }}
        >
            {cartArticles && cartArticles.length > 0 ? (
                <>
                    {cartArticles.map((article, index) => (
                        <div className={'mt-[25px]'} key={article.id}>
                            <input {...register(`ordersArticles.${index}.articleId`)} value={article.id} hidden />
                            <input {...register(`ordersArticles.${index}.companyId`)} value={article.userId} hidden />
                            <input {...register(`ordersArticles.${index}.price`)} value={article.price} hidden />
                            <div className={'flex gap-[20px]'}>
                                <CldImage
                                    className={'flex-[0_0_90px] rounded-[20px]'}
                                    width={90}
                                    height={90}
                                    src={article.picture}
                                    alt={article.name}
                                    sizes={'90px'}
                                    crop={'thumb'}
                                    aspectRatio={1}
                                    gravity={'center'}
                                />
                                <Stack direction={'column'} className={'flex-1'}>
                                    <div className={'flex gap-[20px] width-full justify-between'}>
                                        <div>
                                            <Typography component={'span'} className={'font-bold'}>
                                                {article?.name}
                                            </Typography>
                                            <Typography
                                                component={'div'}
                                                className={'mx-0 mt-[8px] mb-[4px] text-secondary-main text-[14px]'}
                                            >
                                                {truncateString(article?.description ?? '', 25)}
                                            </Typography>
                                        </div>
                                        <div>
                                            <RemoveButton article={article} />
                                        </div>
                                    </div>
                                    <div className={'flex justify-between'}>
                                        <div className={'flex justify-center'}>
                                            <Typography
                                                component={'span'}
                                                className={'flex items-center text-primary-main font-bold'}
                                            >
                                                {currencyFormatter(article?.price ?? 0)}
                                            </Typography>
                                        </div>
                                        <Controller
                                            name={`ordersArticles.${index}.amount`}
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
                    <TableContainer className={'mt-[20px] mb-[180px]'}>
                        <Table>
                            <TableBody>
                                {list.map(({ label, value }, index) => (
                                    <TableRow
                                        className={'[&:last-child_td]:border-0 [&:last-child_th]:border-0'}
                                        key={'listItem - ' + index}
                                    >
                                        <TableCell className={'px-0'}>{label}</TableCell>
                                        <TableCell align={'right'} className={'px-0'}>
                                            <Typography component={'span'} className={'font-bold'}>
                                                {currencyFormatter(value)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ButtonComponent
                        type={'button'}
                        onClick={() => handleDialogClickOpen('open')}
                        size={'large'}
                        positionFixed={true}
                    >
                        {'Checkout'.toUpperCase()}
                    </ButtonComponent>
                </>
            ) : (
                <>
                    <div className={'flex justify-center mt-[40px]'}>
                        <Typography component={'h2'}>Dein Warenkorb ist leer</Typography>
                    </div>
                </>
            )}
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
            <Backdrop className={'text-white z-50'} open={backdropOpen}>
                {success && (
                    <Fab color="primary" sx={buttonSx('primary')} size={'large'}>
                        {success && <CheckIcon />}
                    </Fab>
                )}
                {error && (
                    <Fab color="error" sx={buttonSx('error')} size={'large'}>
                        {error && <ClearIcon />}
                    </Fab>
                )}
                {loading && <CircularProgress size={32} className={'text-inherit absolute m-auto'} />}
            </Backdrop>
        </Form>
    );
}
