'use client';

import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { Badge, IconButton } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useUserContext } from '@/components/hooks/userContext';
import { editUserBodySchema, EditUserBodyType } from '@/lib/schemas/user.schema';
import { pick } from 'lodash';
import { User } from '@prisma/client';

export default function ProfilePage() {
    const { user } = useUserContext();
    const {
        reset,
        getValues,
        control,
        watch,
        formState: { errors, isDirty, dirtyFields },
    } = useForm<EditUserBodyType>({
        defaultValues: useMemo(
            () => pick(user as User, editUserBodySchema.omit({ profilePic: true }).keyof().options),
            [user]
        ),
    });

    useEffect(() => {
        reset(pick(user as User, editUserBodySchema.omit({ profilePic: true }).keyof().options));
    }, [user]);

    console.log(getValues());
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{ marginTop: '50px' }}>
                    <Controller
                        name="profilePic"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
                            <>
                                <input
                                    id={'contained-button-file'}
                                    type="file"
                                    hidden
                                    {...field}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                        onChange(event.target.files?.[0])
                                    }
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
                                            <ProfilePic width={100} height={100} />
                                        </Badge>
                                    </IconButton>
                                </label>
                            </>
                        )}
                    />
                </div>
            </div>
        </>
    );
}
