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
        gap: `${gap}px`,
    });
    return (
        <Container className={'flex mt-[20px] overflow-x-scroll pb-[5px] pl-[5px]'} {...attr}>
            {children}
        </Container>
    );
}
