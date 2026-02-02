'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    palette: {
        mode: 'light',
    },
});

export default theme;
