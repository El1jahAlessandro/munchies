import React from 'react';
import {
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { NextLinkComposed } from '@/components/common/NextLinkComposed';
import { useUserContext } from '@/components/hooks/userContext';
import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { postFetcher } from '@/lib/helpers/fetcher';
import { api, pages } from '@/lib/utils/routes';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/components/hooks/cartContext';
import { ButtonComponent } from '@/components/common/ButtonComponent';

type ToggleDrawerType = (newOpen: boolean) => () => void;

export function MenuButton({ toggleDrawer }: { toggleDrawer: ToggleDrawerType }) {
    return (
        <Button onClick={toggleDrawer(true)}>
            <MenuIcon color={'action'} />
        </Button>
    );
}

function LogOutButton() {
    const { mutate: userMutate } = useUserContext();
    const { mutate: cartMutate } = useCartContext();
    const { push } = useRouter();
    const handleClick = async () => {
        postFetcher(api.user.logout).then(() => {
            userMutate();
            cartMutate();
            push(pages.login);
        });
    };

    return (
        <ButtonComponent
            className={'absolute ml-4 bottom-6'}
            size={'small'}
            onClick={handleClick}
            variant={'contained'}
            color={'primary'}
            startIcon={<PowerSettingsNewIcon />}
        >
            Abmelden
        </ButtonComponent>
    );
}

export default function SideMenu({ open, toggleDrawer }: { open: boolean; toggleDrawer: ToggleDrawerType }) {
    const { user } = useUserContext();

    const menuList = [
        {
            icon: <TextSnippetIcon />,
            label: user?.accountType === 'user' ? 'Meine Bestellungen' : 'Eingehende Bestellungen',
            href: pages.orders,
        },
        {
            icon: <PersonIcon />,
            label: 'Mein Profil',
            href: pages.profile,
        },
        /*{
            icon: <LocationOnIcon />,
            label: 'Delivery Address',
            href: pages.home,
        },
        {
            icon: <PaymentIcon />,
            label: 'Payment Methods',
            href: pages.home,
        },
        {
            icon: <EmailIcon />,
            label: 'Contact Us',
            href: pages.home,
        },
        {
            icon: <SettingsIcon />,
            label: 'Settings',
            href: pages.home,
        },
        {
            icon: <HelpIcon />,
            label: 'Helps & FAQs',
            href: pages.home,
        },*/
    ];

    return (
        <Drawer open={open} onClose={toggleDrawer(false)}>
            <div>
                <ProfilePic width={100} height={100} className={'ml-4 mt-5'} />
                <Typography variant="subtitle1" component="div" className={'font-bold pl-4 pt-5'}>
                    {user?.name}
                </Typography>
                <Typography variant="caption" component="div" className={'pl-4 text-secondary-main'}>
                    {user?.email}
                </Typography>
            </div>
            <Box className={'w-[250px] mt-5'} role="presentation" onClick={toggleDrawer(false)}>
                <List>
                    {menuList.map(({ label, icon, href }) => (
                        <ListItem key={label} disablePadding component={NextLinkComposed} to={href}>
                            <ListItemButton>
                                <ListItemIcon className={'min-w-10'}>{icon}</ListItemIcon>
                                <ListItemText className={'text-secondary-main'} primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <LogOutButton />
            </Box>
        </Drawer>
    );
}
