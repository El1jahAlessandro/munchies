'use client';

import { useUserContext } from '@/components/hooks/userContext';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { chunk, compact, findIndex, first, groupBy, pick, uniq } from 'lodash';
import React, { ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';
import { ButtonComponent } from '@/components/common/ButtonComponent';
import { EditOrderType, OrderResponseType } from '@/lib/schemas/order.schema';
import { CldImage } from 'next-cloudinary';
import { $Enums } from '@prisma/client';
import { DotDivider } from '@/components/common/DotDivider';
import { currencyFormatter } from '@/lib/helpers/currencyFormatter';
import { postFetcher } from '@/lib/helpers/fetcher';
import { createFormData } from '@/lib/helpers/getFormData';
import { api } from '@/lib/utils/routes';
import { useI18n, useScopedI18n } from '@/locales/client';
import { PageParams } from '@/lib/schemas/locale.schema';

const orderStatusColor: {
    [key in $Enums.OrderStatus]: { color: 'primary' | 'secondary' | 'error' | 'warning' | 'info'; className: string };
} = {
    orderReceived: {
        color: 'secondary',
        className: 'text-secondary-main',
    },
    inPreparation: {
        color: 'info',
        className: 'text-info-main',
    },
    isBeingDelivered: {
        color: 'warning',
        className: 'text-warning-main',
    },
    delivered: {
        color: 'primary',
        className: 'text-primary-main',
    },
};

type OrderCategory = 'latestOrders' | 'upcoming';

type ExpansionDetail = 'detail' | 'status';

export default function OrderPage({ params: { locale } }: PageParams) {
    const t = useI18n();
    const orderStatusText = useScopedI18n('orderStatusText');
    const orderStatusButtonText = useScopedI18n('orderStatusButtonText');
    const { user, mutate } = useUserContext();
    const { accountType, buyedArticles, saledArticles } = pick(user, ['accountType', 'buyedArticles', 'saledArticles']);

    const orders = accountType === 'business' ? saledArticles : buyedArticles;

    function OrderChunks({ orders }: { orders: OrderResponseType[] }) {
        const chunkSize = user?.accountType === 'user' ? 4 : 10;
        const [index, setIndex] = useState(0);
        const chunkedOrders = chunk(orders, chunkSize);
        const visibleOrders = useMemo(
            () =>
                chunkedOrders.reduce((previousOrders, currentOrders, currentIndex) => {
                    if (currentIndex <= index) {
                        return uniq([...(previousOrders ?? []), ...currentOrders]);
                    }
                    return previousOrders;
                }, first(chunkedOrders)),
            [index]
        );

        function Order({ order }: { order: OrderResponseType }) {
            const [expanded, setExpanded] = useState(false);
            const [accordionDetailsPage, setAccordionDetailsPage] = useState<ExpansionDetail>();

            const handleAccordionExpansion = useCallback(
                (detailPage: ExpansionDetail) => {
                    if (accordionDetailsPage === detailPage) {
                        setExpanded(!expanded);
                    } else {
                        setAccordionDetailsPage(detailPage);
                        if (!expanded) {
                            setExpanded(true);
                        }
                    }
                },
                [accordionDetailsPage, expanded]
            );

            function AccordionWrapper({
                children,
                detailElement,
            }: {
                children: ReactNode;
                detailElement: ReactElement;
            }) {
                return (
                    <Accordion className={'shadow-none'} expanded={expanded}>
                        <AccordionSummary
                            aria-controls="panel1-content"
                            id={`panel-${order?.id}-header`}
                            className={'p-0 *:block *:cursor-default'}
                        >
                            {children}
                        </AccordionSummary>
                        <AccordionDetails>{detailElement}</AccordionDetails>
                    </Accordion>
                );
            }

            function OrderDetails() {
                if (order) {
                    return (
                        <Table className={'table-auto'}>
                            <TableHead>
                                <TableRow className={'font-bold'}>
                                    <TableCell className={'w-[250px] text-left'}>
                                        {t('article', { count: 1 })}
                                    </TableCell>
                                    <TableCell className={'text-center'}>{t('amount')}</TableCell>
                                    <TableCell className={'text-right'}>{t('price')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.ordersArticles.map(article => (
                                    <TableRow key={`${order.id}-${article.id}`}>
                                        <TableCell>{article.article.name}</TableCell>
                                        <TableCell className={'text-center'}>{article.amount}</TableCell>
                                        <TableCell className={'text-right'}>
                                            {currencyFormatter(article.price, locale)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    );
                }
            }

            function CompanyOrderCard() {
                function ChangeOrderStatus() {
                    const steps = Object.values($Enums.OrderStatus);

                    const activeStep = useMemo(() => order?.status ?? steps[0], [steps]);
                    const activeStepIndex = useMemo(
                        () => findIndex(steps, value => value === activeStep),
                        [activeStep, steps]
                    );

                    const handleNext = () => {
                        const newStatus = steps[activeStepIndex + 1];

                        if (order) {
                            postFetcher<EditOrderType>(
                                api.order.edit,
                                createFormData({
                                    id: order.id,
                                    status: newStatus,
                                })
                            ).then(data => {
                                if (orders && data && user) {
                                    const currentOrderIndex = orders.findIndex(order => order?.id === data.id);
                                    const indexedOrder = orders.at(currentOrderIndex);
                                    if (indexedOrder) {
                                        const editedOrder = { ...indexedOrder, ...data };
                                        const newOrders = compact([
                                            editedOrder,
                                            ...orders.toSpliced(currentOrderIndex),
                                        ]);
                                        mutate({
                                            ...user,
                                            ...(accountType === 'business'
                                                ? { saledArticles: newOrders }
                                                : { buyedArticles: newOrders }),
                                        });
                                    }
                                }
                            });
                        }
                    };

                    return (
                        <Box className={'w-full'}>
                            <Stepper activeStep={activeStepIndex}>
                                {steps.map(status => {
                                    const stepProps: { completed?: boolean } = {};

                                    return (
                                        <Step key={status} {...stepProps}>
                                            <StepLabel>{orderStatusText(status)}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            {activeStepIndex !== steps.length - 1 && (
                                <>
                                    <Box className={'flex justify-center mt-5'}>
                                        <ButtonComponent
                                            onClick={() => handleNext()}
                                            className={'!h-8 px-1 py-1 w-[250px] mt-2.5 text-[0.7rem]'}
                                        >
                                            {orderStatusButtonText(activeStep)}
                                        </ButtonComponent>
                                    </Box>
                                </>
                            )}
                        </Box>
                    );
                }

                if (order) {
                    return (
                        <Card className={'mt-5 p-5'}>
                            <AccordionWrapper
                                detailElement={
                                    accordionDetailsPage !== 'detail' ? <ChangeOrderStatus /> : <OrderDetails />
                                }
                            >
                                <div className={'flex justify-between w-full'}>
                                    <Stack className={'justify-center text-left'}>
                                        <Typography
                                            variant={'caption'}
                                            component={'div'}
                                            className={'flex items-center'}
                                        >
                                            {new Date(order.updatedAt)?.toLocaleDateString(locale, {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                            })}
                                            <DotDivider color={'secondary'} size={'small'} margin={'0 10px'} />
                                            {order.ordersArticles.length}{' '}
                                            {t('article', { count: order.ordersArticles.length })}
                                        </Typography>
                                        <Typography variant={'caption'} component={'div'} className={'font-bold'}>
                                            {order.buyer.name}
                                        </Typography>
                                        <Typography
                                            component={'span'}
                                            variant={'caption'}
                                            className={orderStatusColor[order.status].className}
                                        >
                                            <DotDivider
                                                color={orderStatusColor[order.status].color}
                                                size={'large'}
                                                margin={'0 5px 0 0'}
                                            />
                                            {orderStatusText(order.status)}
                                        </Typography>
                                        <div className={'flex gap-5'}>
                                            <ButtonComponent
                                                onClick={() => handleAccordionExpansion('detail')}
                                                className={'!h-8 px-1 py-1 w-[100px] mt-2.5 text-[0.7rem]'}
                                            >
                                                {t('details')}
                                            </ButtonComponent>
                                            {order.status !== 'delivered' && user?.accountType === 'business' && (
                                                <ButtonComponent
                                                    onClick={() => handleAccordionExpansion('status')}
                                                    className={'!h-8 px-1 py-1 w-[150px] mt-2.5 text-[0.7rem]'}
                                                >
                                                    {t('change_status')}
                                                </ButtonComponent>
                                            )}
                                        </div>
                                    </Stack>
                                    <Typography
                                        className={
                                            'ml-auto font-bold flex justify-self-end items-start text-primary-main'
                                        }
                                        component={'span'}
                                    >
                                        {currencyFormatter(order.totalPrice, locale)}
                                    </Typography>
                                </div>
                            </AccordionWrapper>
                        </Card>
                    );
                }
            }

            function UserOrderCard() {
                if (order) {
                    return (
                        <Card className={'mt-5 p-5'}>
                            <AccordionWrapper detailElement={<OrderDetails />}>
                                <div className={'flex gap-5'}>
                                    <CldImage
                                        alt={order.company.name ?? ''}
                                        src={order.company.profilePic ?? ''}
                                        width={65}
                                        height={65}
                                        sizes={'65px'}
                                        crop={'thumb'}
                                        aspectRatio={1}
                                        gravity={'center'}
                                    />
                                    <Stack className={'justify-center text-left'}>
                                        <Typography
                                            variant={'caption'}
                                            component={'div'}
                                            className={'flex items-center'}
                                        >
                                            {new Date(order.updatedAt)?.toLocaleDateString(locale, {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                            })}
                                            <DotDivider color={'secondary'} size={'small'} margin={'0 10px'} />
                                            {order.ordersArticles.length}{' '}
                                            {t('article', { count: order.ordersArticles.length })}
                                        </Typography>
                                        <Typography variant={'body1'} component={'div'} className={'font-bold'}>
                                            {order.company.name}
                                        </Typography>
                                        <Typography
                                            component={'span'}
                                            variant={'caption'}
                                            className={orderStatusColor[order.status].className}
                                        >
                                            <DotDivider
                                                color={orderStatusColor[order.status].color}
                                                size={'large'}
                                                margin={'0 5px 0 0'}
                                            />
                                            {orderStatusText(order.status)}
                                        </Typography>
                                    </Stack>
                                    <Typography
                                        className={'ml-auto font-bold flex items-start text-primary-main'}
                                        component={'span'}
                                    >
                                        {currencyFormatter(order.totalPrice, locale)}
                                    </Typography>
                                </div>
                                <ButtonComponent
                                    onClick={() => handleAccordionExpansion('detail')}
                                    className={'!h-8 px-1 py-1 w-[100px] mt-2.5 text-[0.7rem]'}
                                >
                                    {t('details')}
                                </ButtonComponent>
                            </AccordionWrapper>
                        </Card>
                    );
                }
            }

            return (
                order && (
                    <>
                        {user?.accountType === 'user' ? (
                            <UserOrderCard key={order.id} />
                        ) : (
                            <CompanyOrderCard key={order.id} />
                        )}
                    </>
                )
            );
        }

        return (
            <>
                {visibleOrders?.map(order => <Order key={order?.id} order={order} />)}
                {orders?.length !== visibleOrders?.length && (
                    <div className={'flex justify-center margin-auto mt-[3.75rem]'}>
                        <ButtonComponent size={'large'} onClick={() => setIndex(prevIndex => prevIndex + 1)}>
                            {t('load_more')}
                        </ButtonComponent>
                    </div>
                )}
            </>
        );
    }

    const groupedOrders = groupBy(orders, order => (order.status === 'delivered' ? 'latestOrders' : 'upcoming'));
    const orderEntries = Object.entries(groupedOrders).sort(([a]) => {
        return (a as OrderCategory) === 'latestOrders' ? 1 : -1;
    });

    const noIncomingOrders = orders?.filter(order => order.status !== 'delivered').length === 0;

    return (
        <>
            {noIncomingOrders && (user?.accountType === 'user' ? !!orders.length : true) && (
                <Typography component={'h4'} typography={'body1'} className={'my-[3.75rem]'}>
                    {t(`no_current_orders.${user?.accountType ?? 'user'}`)}
                </Typography>
            )}
            {!orders?.length && user?.accountType === 'user' && (
                <Typography component={'h4'} typography={'body1'} className={'my-[3.75rem]'}>
                    {t('no_orders_placed')}
                </Typography>
            )}
            {orderEntries &&
                orderEntries.map(([orderCategory, orders], index) => (
                    <div key={orderCategory} className={index === 1 ? 'mt-[3.75rem]' : ''}>
                        <Typography component={'h4'} typography={'h6'}>
                            {(orderCategory as OrderCategory) === 'latestOrders' && t('past_orders')}
                        </Typography>
                        <OrderChunks orders={orders.reverse()} />
                    </div>
                ))}
        </>
    );
}
