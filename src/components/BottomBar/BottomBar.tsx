import { Badge, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { NextLinkComposed } from '@/components/common/NextLinkComposed';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { SyntheticEvent, useState } from 'react';
import { first } from 'lodash';
import { pages } from '@/lib/utils/routes';
import { useCartContext } from '@/components/hooks/cartContext';

export default function BottomBar() {
    const { cartArticles } = useCartContext();
    const bottomNavigations = [
        {
            value: 'explore',
            icon: <ExploreIcon />,
            to: pages.home,
        },
        {
            value: 'addresses',
            icon: <LocationOnIcon />,
            to: pages.home,
        },
        {
            value: 'cart',
            icon: (
                <>
                    {cartArticles && cartArticles.length > 0 ? (
                        <Badge badgeContent={cartArticles.length} color={'warning'}>
                            <ShoppingBagIcon />
                        </Badge>
                    ) : (
                        <ShoppingBagIcon />
                    )}
                </>
            ),
            to: pages.cart,
        },
        {
            value: 'favorites',
            icon: <FavoriteIcon />,
            to: pages.home,
        },
        {
            value: 'notifications',
            icon: <NotificationsIcon />,
            to: pages.home,
        },
    ];
    const [value, setValue] = useState(first(bottomNavigations)?.value);

    const handleChange = (_: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={value} onChange={handleChange}>
                {bottomNavigations.map(nav => (
                    <BottomNavigationAction
                        key={nav.value}
                        value={nav.value}
                        component={NextLinkComposed}
                        to={nav.to}
                        label={first(nav.value)?.toUpperCase() + nav.value.slice(1)}
                        icon={nav.icon}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
