import { ButtonComponent } from '@/components/common/ButtonComponent';
import { Apple, GitHub, Google } from '@mui/icons-material';
import { Stack } from '@mui/material';

export default function SocialLoginButtons() {
    return (
        <Stack spacing={2} direction={'row'}>
            <ButtonComponent className={'w-1/3'} color={'success'} variant={'outlined'} disabled={true}>
                <Google />
            </ButtonComponent>
            <ButtonComponent className={'w-1/3'} color={'success'} variant={'contained'} disabled={true}>
                <Apple />
            </ButtonComponent>
            <ButtonComponent className={'w-1/3'} color={'success'} variant={'contained'} disabled={true}>
                <GitHub />
            </ButtonComponent>
        </Stack>
    );
}
