import { Badge, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { NextLinkComposed } from '@/components/common/NextLinkComposed';
import ExploreIcon from '@mui/icons-material/Explore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { SyntheticEvent, useEffect, useState } from 'react';
import { first } from 'lodash';
import { pages } from '@/lib/utils/routes';
import { useCartContext } from '@/components/hooks/cartContext';
import { CldImage } from 'next-cloudinary';
import { usePathname } from 'next/navigation';

export default function BottomBar() {
    const { cartArticles } = useCartContext();
    const pathname = usePathname();
    const bottomNavigations = [
        {
            value: 'explore',
            label: 'Startseite',
            icon: <ExploreIcon />,
            to: pages.home,
        },
        /*{
            value: 'addresses',
            icon: <LocationOnIcon />,
            to: pages.home,
        },*/
        {
            value: 'logo',
            icon: process.env['NEXT_PUBLIC_LOGO_URL'],
            to: '',
        },
        {
            value: 'cart',
            label: 'Warenkorb',
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
        } /*
        {
            value: 'favorites',
            icon: <FavoriteIcon />,
            to: pages.home,
        },
        {
            value: 'notifications',
            icon: <NotificationsIcon />,
            to: pages.home,
        },*/,
    ];
    const [value, setValue] = useState(first(bottomNavigations)?.value);

    const handleChange = (_: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        bottomNavigations.forEach(nav => {
            if (pathname === nav.to) {
                setValue(pathname === nav.to ? nav.value : 'explore');
            }
        });
    }, [pathname]);

    return (
        <Paper className={'fixed bottom-0 left-0 right-0'} elevation={5}>
            <BottomNavigation value={value} onChange={handleChange} className={'!h-[5.5rem]'}>
                {bottomNavigations.map(nav => {
                    if (nav.value === 'logo' && typeof nav.icon === 'string') {
                        return (
                            <div className={'mx-10 flex items-center justify-center'}>
                                <CldImage
                                    className={'w-16 h-16'}
                                    width={65}
                                    height={65}
                                    crop={'fill'}
                                    alt={'Logo'}
                                    src={nav.icon ?? ''}
                                />
                            </div>
                        );
                    }

                    return (
                        <BottomNavigationAction
                            className={'my--4'}
                            key={nav.value}
                            value={nav.value}
                            component={NextLinkComposed}
                            to={nav.to}
                            label={nav.label}
                            icon={nav.icon}
                        />
                    );
                })}
            </BottomNavigation>
        </Paper>
    );
}
