import { FabTypeMap } from '@mui/material/Fab/Fab';
import { Fab, Stack, styled } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import React, { ReactNode } from 'react';

type AmountHandlerProps = {
    minusButtonOnClick: () => void;
    plusButtonOnClick: () => void;
    minusButtonProps: FabTypeMap['props'];
    plusButtonProps: FabTypeMap['props'];
    children: ReactNode;
};

const AmountHandlerText = styled('span')(({ theme }) => ({
    fontFamily: theme.typography.fontFamily,
}));

export function AmountHandler(props: AmountHandlerProps) {
    const { minusButtonProps, minusButtonOnClick, plusButtonOnClick, plusButtonProps, children } = props;
    return (
        <Stack direction="row" spacing={2}>
            <Fab {...minusButtonProps} color="primary" aria-label="remove" size={'small'} onClick={minusButtonOnClick}>
                <RemoveIcon />
            </Fab>
            <AmountHandlerText
                className={'flex w-[20px] tracking-[1px] justify-center items-center mt-[5px] font-bold'}
            >
                {children}
            </AmountHandlerText>
            <Fab {...plusButtonProps} color="primary" aria-label="add" size={'small'} onClick={plusButtonOnClick}>
                <AddIcon />
            </Fab>
        </Stack>
    );
}
