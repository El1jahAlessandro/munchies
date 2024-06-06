import { HTMLAttributes, ReactNode, RefObject } from 'react';
import { styled } from '@mui/material';

export function ScrollableContainer({
    gap,
    children,
    ...attr
}: {
    ref: RefObject<any>;
    gap: number;
    children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
    const Container = styled('div')({
        display: 'flex',
        gap: `${gap}px`,
        marginTop: '20px',
        overflowX: 'scroll',
        padding: '0 0 5px 5px',
    });
    return <Container {...attr}>{children}</Container>;
}
