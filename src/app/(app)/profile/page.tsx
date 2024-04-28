'use client';

import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { Badge, Button, CircularProgress, Container, IconButton, Stack } from '@mui/material';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';

export default function ProfilePage() {
    const [previewPicture, setPreviewPicture] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const [inEditMode, setInEditMode] = useState<boolean>(false);
    const { user, mutate } = useUserContext();
    const userDefaultValues = pick(user as User, editUserFormSchema.omit({ profilePic: true }).keyof().options);
    const {
        watch,
        reset,
        control,
        formState: { errors, isDirty, isSubmitting, isSubmitted },
    } = useForm<EditUserFormType>({
        defaultValues: useMemo(() => userDefaultValues, [user]),
        resolver: zodResolver(editUserFormSchema),
    });

    const formInputOptions: FormInputOptionType<EditUserFormType>[] = [
        {
            label: watch('accountType') === 'user' ? 'Full Name' : 'Company Name',
            name: 'name',
            inputType: 'textInput',
        },
        {
            label: 'Email',
            name: 'email',
            inputType: 'textInput',
        },
        {
            label: 'Account Type',
            name: 'accountType',
            inputType: 'textInput',
            disabled: true,
        },
    ];

    useEffect(() => {
        if (isSubmitted) {
            setInEditMode(false);
        }
    }, [isSubmitted]);

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
                            {inEditMode ? (
                                <>
                                    <input
                                        id={'contained-button-file'}
                                        type="file"
                                        hidden
                                        accept={'.jpg, .jpeg, .png, .webp'}
                                        {...field}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            onChange(event.target.files?.[0]);
                                            setPreviewPicture(URL.createObjectURL(event.target.files![0]));
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <IconButton component="span" style={{ padding: 0 }}>
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
                            ) : (
                                <>
                                    <ProfilePic width={100} height={100} />
                                </>
                            )}
                        </>
                    )}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5px',
                }}
            >
                {!inEditMode && (
                    <Button onClick={() => setInEditMode(true)} size={'small'}>
                        Edit Profile
                    </Button>
                )}
            </div>
            <Container maxWidth="xs" sx={{ marginTop: '50px' }}>
                <Stack spacing={6} direction={'column'}>
                    {formInputOptions.map(optionProps => (
                        <Controller
                            key={optionProps.name}
                            name={optionProps.name}
                            control={control}
                            render={({ field: { value, ...field } }) => (
                                <FormInputController
                                    InputLabelProps={{ shrink: true }}
                                    value={optionProps.name === 'accountType' ? toPascalCase(value as string) : value}
                                    inputProps={{ readOnly: !inEditMode || optionProps.name === 'accountType' }}
                                    {...field}
                                    {...optionProps}
                                />
                            )}
                        />
                    ))}
                </Stack>
            </Container>
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
            {inEditMode && (
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
                                setInEditMode(false);
                            }}
                        >
                            Abbrechen
                        </Button>
                        <Button variant={'contained'} color={'primary'} type={'submit'} disabled={!isDirty}>
                            {isSubmitting ? <CircularProgress /> : 'Speichern'}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}