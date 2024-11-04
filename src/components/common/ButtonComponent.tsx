import { ReactNode } from 'react';
import { ButtonProps, CircularProgress, Palette, styled } from '@mui/material';

const sizes = {
    small: { x: 1, height: '44px', icon: '26px', iconPadding: '2px', iconMargin: 1 },
    medium: { x: 1.5, height: '54px', icon: '40px', iconPadding: '7px', iconMargin: 2 },
    large: { x: 10, height: '58px', icon: '46px', iconPadding: '12px', iconMargin: 3 },
};

type ButtonPropsType = {
    children: ReactNode;
    isSubmitting?: boolean;
    icon?: ReactNode;
    size?: 'small' | 'medium' | 'large';
    positionFixed?: boolean;
} & ButtonProps & { color?: keyof Palette };

const StyledButton = styled('button')<Omit<ButtonPropsType, 'isSubmitting'>>(({ theme, size, color, disabled }) => ({
    height: `${sizes[size ?? 'small'].height}`,
    padding: `${theme.spacing(1)} ${theme.spacing(sizes[size ?? 'small'].x)}`,
    backgroundColor: theme.palette[color ?? 'primary'].main,
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
    '& .MuiSvgIcon-root': {
        color: theme.palette[color ?? 'primary'].main,
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: sizes[size ?? 'small'].iconPadding,
        width: sizes[size ?? 'small'].icon,
        height: sizes[size ?? 'small'].icon,
        marginRight: theme.spacing(sizes[size ?? 'small'].iconMargin),
    },
    ...(disabled
        ? {
              color: 'rgba(0, 0, 0, 0.26)',
              boxShadow: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
          }
        : {}),
    transition:
        'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
}));

export function ButtonComponent({
    children,
    isSubmitting,
    size = 'small',
    positionFixed,
    startIcon,
    ...props
}: ButtonPropsType) {
    const buttonContent = (
        <StyledButton size={size} {...props}>
            {isSubmitting ? (
                <CircularProgress color={'inherit'} {...(size === 'small' ? { size: 30 } : {})} />
            ) : (
                <>
                    {startIcon ? (
                        <div className={'flex items-center'}>
                            {startIcon}
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                </>
            )}
        </StyledButton>
    );
    if (positionFixed) {
        return <div className={'m-auto left-0 right-0 bottom-[120px] fixed text-center'}>{buttonContent}</div>;
    }
    return buttonContent;
}
