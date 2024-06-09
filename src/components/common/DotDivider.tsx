import { Typography } from '@mui/material';
import { Property } from 'csstype';

type DotDividerProps = {
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info';
    size: 'small' | 'large';
    margin: Property.Margin;
};

export const DotDivider = ({ color, size, margin }: DotDividerProps) => {
    return (
        <div
            className={'inline-flex justify-center items-center'}
            style={{
                margin: `0 ${margin}px`,
            }}
        >
            <Typography
                className={'rounded-[50%] ' + (size === 'large' ? 'h-[7px] w-[7px]' : 'h-[4px] w-[4px]')}
                sx={{ bgcolor: theme => theme.palette[color].main, margin }}
            ></Typography>
        </div>
    );
};
