'use client';

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { StyledEngineProvider } from '@mui/material/styles';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <StyledEngineProvider injectFirst>
            <AppRouterCacheProvider options={{ key: 'css' }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </AppRouterCacheProvider>
        </StyledEngineProvider>
    );
}

