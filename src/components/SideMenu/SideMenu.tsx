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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { NextLinkComposed } from '@/components/common/NextLinkComposed';
import { useUserContext } from '@/components/hooks/userContext';
import ProfilePic from '@/components/ProfilePic/ProfilePic';
import { postFetcher } from '@/lib/helpers/fetcher';
import { api, pages } from '@/lib/utils/routes';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/components/hooks/cartContext';

type ToggleDrawerType = (newOpen: boolean) => () => void;

const menuList = [
    {
        icon: <TextSnippetIcon />,
        label: 'My Orders',
        href: pages.home,
    },
    {
        icon: <PersonIcon />,
        label: 'My Profile',
        href: pages.profile,
    },
    {
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
    },
];

export function MenuButton({ toggleDrawer }: { toggleDrawer: ToggleDrawerType }) {
    return (
        <Button onClick={toggleDrawer(true)}>
            <MenuIcon color={'action'} />
        </Button>
    );
}

function LogOutButton({}) {
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
        <Button onClick={handleClick} variant={'contained'} color={'primary'} startIcon={<PowerSettingsNewIcon />}>
            Logout
        </Button>
    );
}

export default function SideMenu({ open, toggleDrawer }: { open: boolean; toggleDrawer: ToggleDrawerType }) {
    const { user } = useUserContext();
    return (
        <Drawer open={open} onClose={toggleDrawer(false)}>
            <div>
                <ProfilePic width={100} height={100} sx={{ marginLeft: '16px', marginTop: '20px' }} />
                <Typography
                    variant="subtitle1"
                    component="div"
                    fontWeight={'bold'}
                    paddingLeft={'16px'}
                    paddingTop={'20px'}
                >
                    {user?.name}
                </Typography>
                <Typography variant="caption" component="div" paddingLeft={'16px'} sx={{ color: 'secondary.main' }}>
                    {user?.email}
                </Typography>
            </div>
            <Box sx={{ width: 250 }} marginTop={'20px'} role="presentation" onClick={toggleDrawer(false)}>
                <List>
                    {menuList.map(({ label, icon, href }) => (
                        <ListItem key={label} disablePadding component={NextLinkComposed} to={href}>
                            <ListItemButton>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText sx={{ color: 'secondary.main' }} primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <LogOutButton />
            </Box>
        </Drawer>
    );
}
