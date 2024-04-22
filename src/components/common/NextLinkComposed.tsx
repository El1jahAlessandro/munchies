import { AnchorHTMLAttributes, forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';
import { styled } from '@mui/material';

const Anchor = styled('a')({});

interface NextLinkComposedProps
    extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
        Omit<LinkProps, 'href' | 'as' | 'passHref' | 'onMouseEnter' | 'onClick' | 'onTouchStart'> {
    to: LinkProps['href'];
    linkAs?: LinkProps['as'];
}

export const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
    function NextLinkComposed(props, ref) {
        const { to, linkAs, replace, scroll, shallow, prefetch, legacyBehavior = true, locale, ...other } = props;

        return (
            <Link
                href={to}
                prefetch={prefetch}
                as={linkAs}
                replace={replace}
                scroll={scroll}
                shallow={shallow}
                passHref
                locale={locale}
                legacyBehavior={legacyBehavior}
            >
                <Anchor ref={ref} {...other} />
            </Link>
        );
    }
);
