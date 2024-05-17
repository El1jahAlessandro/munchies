import { FieldValues } from 'react-hook-form';
import { PasswordInput } from '@/components/FormInputs/PasswordInput';
import { TextField } from '@mui/material';
import { FormInputType } from '@/lib/schemas/common.schema';
import { ReactNode } from 'react';

export function FormInputController<T extends FieldValues>(inputProps: FormInputType<T>) {
    const { errors, name, inputType, ...field } = inputProps;
    const inputAttributes = {
        error: !!errors?.[name],
        helperText: (errors?.[name]?.message as ReactNode) ?? '',
    };
    return (
        <>
            {inputType === 'password' && <PasswordInput {...field} name={name} {...inputAttributes} />}
            {inputType === 'textInput' && <TextField {...field} name={name} {...inputAttributes} />}
        </>
    );
}
