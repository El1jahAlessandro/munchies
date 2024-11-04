'use client';

import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { Badge, Button, Container, IconButton, Stack } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { useUserContext } from '@/components/hooks/userContext';
import { editUserFormSchema, EditUserFormType, userSchema } from '@/lib/schemas/user.schema';
import { pick } from 'lodash';
import { api } from '@/lib/utils/routes';
import { authenticationForm } from '@/lib/helpers/authenticationForm';
import { toPascalCase } from '@/lib/helpers/toPascalCase';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInputOptionType } from '@/lib/schemas/common.schema';
import { FormInputController } from '@/components/FormInputs/FormInputController';
import { ButtonComponent } from '@/components/common/ButtonComponent';

export default function ProfilePage() {
    const [previewPicture, setPreviewPicture] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<{ error: unknown }>();
    const [inEditMode, setInEditMode] = useState<boolean>(false);
    const { user, mutate } = useUserContext();
    const userDefaultValues = pick(user, userSchema.omit({ profilePic: true, password: true }).keyof().options);
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
            <div className={'flex justify-center items-center mt-[50px]'}>
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
                                        <IconButton component="span" className={'p-0'}>
                                            <Badge
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                badgeContent={<CameraAlt className={'w-[10px]'} />}
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
            <div className={'flex justify-center items-center mt-[5px]'}>
                {!inEditMode && (
                    <Button onClick={() => setInEditMode(true)} size={'small'}>
                        Edit Profile
                    </Button>
                )}
            </div>
            <Container maxWidth="xs" className={'mt-[50px]'}>
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
                    <div className={'flex justify-center items-center mt-[50px]'}>
                        <span className={'text-error-main'}>
                            {(errorMessage?.error as string) ?? errors.root?.message ?? ''}
                        </span>
                    </div>
                </>
            )}
            {inEditMode && (
                <div className={'mt-[50px]'}>
                    <div className={'flex justify-center items-center gap-[40px]'}>
                        <ButtonComponent
                            size={'medium'}
                            variant={'contained'}
                            color={'error'}
                            onClick={() => {
                                reset({ ...userDefaultValues, profilePic: user?.profilePic });
                                setPreviewPicture(undefined);
                                setInEditMode(false);
                            }}
                        >
                            Abbrechen
                        </ButtonComponent>
                        <ButtonComponent
                            size={'medium'}
                            isSubmitting={isSubmitting}
                            variant={'contained'}
                            color={'primary'}
                            type={'submit'}
                            disabled={!isDirty}
                        >
                            Speichern
                        </ButtonComponent>
                    </div>
                </div>
            )}
        </Form>
    );
}
