import { Typography } from '@mui/material';
import { Property } from 'csstype';

type DotDividerProps = {
    color: 'primary' | 'secondary' | 'error';
    size: 'small' | 'large';
    margin: Property.Margin;
};

const sizes = {
    small: { height: '4px', width: '4px' },
    large: { height: '7px', width: '7px' },
};

export const DotDivider = ({ color, size, margin }: DotDividerProps) => {
    return (
        <div
            style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: `0 ${margin}px`,
            }}
        >
            <Typography
                sx={{ bgcolor: theme => theme.palette[color].main, ...sizes[size], borderRadius: '50%', margin }}
            ></Typography>
        </div>
    );
};
