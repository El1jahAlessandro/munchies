'use client';

import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { Badge, Button, CircularProgress, IconButton, TextField } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { useUserContext } from '@/components/hooks/userContext';
import { editUserFormSchema, EditUserFormType } from '@/lib/schemas/user.schema';
import { pick } from 'lodash';
import { User } from '@prisma/client';
import { api } from '@/lib/utils/routes';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { toPascalCase } from '@/lib/helpers/toPascalCase';

type FormInputOptionType = {
    label: string;
    name: 'name' | 'email' | 'accountType';
};

export default function ProfilePage() {
    const [previewPicture, setPreviewPicture] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const { user, mutate } = useUserContext();
    const userDefaultValues = pick(user as User, editUserFormSchema.omit({ profilePic: true }).keyof().options);
    const {
        watch,
        reset,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<EditUserFormType>({
        defaultValues: useMemo(() => userDefaultValues, [user]),
    });

    const formInputOptions: FormInputOptionType[] = [
        {
            label: watch('accountType') === 'user' ? 'Full Name' : 'Company Name',
            name: 'name',
        },
        {
            label: 'Email',
            name: 'email',
        },
        {
            label: 'Account Type',
            name: 'accountType',
        },
    ];

    useEffect(() => {
        reset({ ...userDefaultValues, profilePic: user?.profilePic });
    }, [user]);

    return (
        <Form
            action={api.user.edit}
            method={'post'}
            control={control}
            {...authenticationForm({
                setErrorMessage,
                mutate,
                reset,
            })}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '50px',
                }}
            >
                <Controller
                    name="profilePic"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <>
                            <input
                                id={'contained-button-file'}
                                type="file"
                                hidden
                                accept={'.jpg, .jpeg, .png'}
                                {...field}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    onChange(event.target.files?.[0]);
                                    setPreviewPicture(URL.createObjectURL(event.target.files![0]));
                                }}
                            />
                            <label htmlFor="contained-button-file">
                                <IconButton component="span">
                                    <Badge
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        badgeContent={<CameraAlt sx={{ width: '10px' }} />}
                                        color={'secondary'}
                                        overlap="circular"
                                    >
                                        <ProfilePic width={100} height={100} previewPicture={previewPicture} />
                                    </Badge>
                                </IconButton>
                            </label>
                        </>
                    )}
                />
            </div>
            {formInputOptions.map(({ label, name }) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '50px',
                    }}
                    key={name}
                >
                    <Controller
                        rules={{ required: true }}
                        name={name}
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    value={name === 'accountType' ? toPascalCase(value) : value}
                                    label={label}
                                    disabled={name === 'accountType'}
                                    {...field}
                                />
                            </>
                        )}
                    />
                </div>
            ))}
            {(errorMessage?.error || errors.root?.message) && (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '50px',
                        }}
                    >
                        <span style={{ color: 'red' }}>
                            {(errorMessage?.error as string) ?? errors.root?.message ?? ''}
                        </span>
                    </div>
                </>
            )}
            {isDirty && (
                <div style={{ marginTop: '50px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '40px',
                        }}
                    >
                        <Button
                            variant={'contained'}
                            color={'error'}
                            onClick={() => {
                                reset({ ...userDefaultValues, profilePic: user?.profilePic });
                                setPreviewPicture(undefined);
                            }}
                        >
                            Abbrechen
                        </Button>
                        <Button variant={'contained'} color={'success'} type={'submit'}>
                            {isSubmitting ? <CircularProgress /> : 'Speichern'}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}
