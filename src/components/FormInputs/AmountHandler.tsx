import { FabTypeMap } from '@mui/material/Fab/Fab';
import { Fab, Stack, Typography } from '@mui/material';
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

export function AmountHandler(props: AmountHandlerProps) {
    const { minusButtonProps, minusButtonOnClick, plusButtonOnClick, plusButtonProps, children } = props;
    return (
        <Stack direction="row" spacing={2}>
            <Fab {...minusButtonProps} color="primary" aria-label="remove" size={'small'} onClick={minusButtonOnClick}>
                <RemoveIcon />
            </Fab>
            <Typography
                component={'span'}
                sx={{
                    width: '20px',
                    letterSpacing: '2px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5px',
                }}
            >
                {children}
            </Typography>
            <Fab {...plusButtonProps} color="primary" aria-label="add" size={'small'} onClick={plusButtonOnClick}>
                <AddIcon />
            </Fab>
        </Stack>
    );
}
