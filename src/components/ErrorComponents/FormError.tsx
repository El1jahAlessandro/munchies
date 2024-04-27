import { Typography } from '@mui/material';
import { FieldErrors } from 'react-hook-form';

type FormErrorProps = {
    errors: FieldErrors;
    errorMessage: { error: unknown } | undefined;
};

export function FormError({ errorMessage, errors }: FormErrorProps) {
    return (
        <>
            <div>
                <Typography component={'span'} sx={{ color: 'error.main' }}>
                    {(errorMessage?.error as string) ?? errors.root?.message ?? ''}
                </Typography>
            </div>
        </>
    );
}
