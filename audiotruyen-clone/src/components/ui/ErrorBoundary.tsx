'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public override state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public override render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: 'error.light',
                                color: 'error.main',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3,
                                mx: 'auto'
                            }}
                        >
                            <AlertTriangle size={32} />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                            Đã có lỗi xảy ra
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                mb: 4,
                                maxWidth: '100%',
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Rất tiếc, đã có lỗi kỹ thuật xảy ra. Vui lòng thử tải lại trang hoặc quay lại sau.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => window.location.reload()}
                                sx={{ borderRadius: 2 }}
                            >
                                Tải lại trang
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => window.location.href = '/'}
                                sx={{ borderRadius: 2 }}
                            >
                                Về trang chủ
                            </Button>
                        </Box>

                        {process.env.NODE_ENV === 'development' && (
                            <Box sx={{ mt: 6, p: 2, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'left', overflow: 'auto', maxWidth: '100%' }}>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'error.main' }}>
                                    {this.state.error?.toString()}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}
