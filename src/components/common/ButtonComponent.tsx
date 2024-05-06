import { ReactNode } from 'react';
import { ButtonProps, styled } from '@mui/material';

const sizes = {
    small: { x: 4, y: 1 },
    medium: { x: 7, y: 1 },
    large: { x: 10, y: 1 },
};

type ButtonPropsType = {
    children: ReactNode;
    icon?: ReactNode;
    size: 'small' | 'medium' | 'large';
} & ButtonProps;

const StyledButton = styled('button')<ButtonPropsType>(({ theme, size }) => ({
    height: '57px',
    padding: `${theme.spacing(sizes[size].y)} ${theme.spacing(sizes[size].x)}`,
    backgroundColor: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    color: 'white',
    boxShadow: theme.shadows[5],
    border: 0,
    lineHeight: 1.6,
    borderRadius: '30px',
    fontWeight: 'bold',
    zIndex: 999,
    position: 'relative',
    fontSize: '1rem',
    letterSpacing: 1,
    '&:active': {
        boxShadow: '0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12);',
    },
    transition:
        'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
}));

export function ButtonComponent({ children, icon, ...props }: ButtonPropsType) {
    return <StyledButton {...props}>{children}</StyledButton>;
}
