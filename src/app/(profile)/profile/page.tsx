'use client';

import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { Badge } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';

export default function ProfilePage() {
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
                </div>
            </div>
        </>
    );
}
