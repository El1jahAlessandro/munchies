import React from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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
import { ProfilePic } from '@/components/ProfilePic/ProfilePic';
import { getFullName } from '@/lib/helpers/getFullName';

type ToggleDrawerType = (newOpen: boolean) => () => void;

const menuList = [
    {
        icon: <TextSnippetIcon />,
        label: 'My Orders',
        href: 'article?id=2',
    },
    {
        icon: <PersonIcon />,
        label: 'My Profile',
        href: '/',
    },
    {
        icon: <LocationOnIcon />,
        label: 'Delivery Address',
        href: '/',
    },
    {
        icon: <PaymentIcon />,
        label: 'Payment Methods',
        href: '/',
    },
    {
        icon: <EmailIcon />,
        label: 'Contact Us',
        href: '/',
    },
    {
        icon: <SettingsIcon />,
        label: 'Settings',
        href: '/',
    },
    {
        icon: <HelpIcon />,
        label: 'Helps & FAQs',
        href: '/',
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
    return (
        <Button variant={'contained'} color={'success'} startIcon={<PowerSettingsNewIcon />}>
            Logout
        </Button>
    );
}

export default function SideMenu({ open, toggleDrawer }: { open: boolean; toggleDrawer: ToggleDrawerType }) {
    const { user } = useUserContext();
    return (
        <Drawer open={open} onClose={toggleDrawer(false)}>
            <div>
                <ProfilePic {...user} width={100} height={100} />
                <div>{getFullName(user)}</div>
                <div>{user?.email}</div>
            </div>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                <List>
                    {menuList.map(({ label, icon, href }) => (
                        <ListItem key={label} disablePadding component={NextLinkComposed} to={href}>
                            <ListItemButton>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <LogOutButton />
            </Box>
        </Drawer>
    );
}
