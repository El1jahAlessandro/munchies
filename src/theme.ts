'use client';
import { Poppins } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import * as palette from '../json/colors.json';

const roboto = Poppins({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette,
    components: {
        MuiFab: {
            styleOverrides: {
                root: {
                    width: '30px',
                    height: '30px',
                    minHeight: '30px',
                    zIndex: 0,
                },
            },
        },
    },
});

export default theme;
