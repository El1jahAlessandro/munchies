import { Locales } from '@/lib/schemas/locale.schema';

export const currencyFormatter = (price: number, locale: Locales) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(price);
};
