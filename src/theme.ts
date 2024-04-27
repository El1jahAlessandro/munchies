'use client';
import { Poppins } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Poppins({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        primary: {
            main: '#00a023',
        },
        secondary: {
            main: '#9796A1',
        },
        error: {
            main: '#d32f2f',
        },
    },
});

export default theme;
