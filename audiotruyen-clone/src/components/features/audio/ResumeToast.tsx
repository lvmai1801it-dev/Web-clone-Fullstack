'use client';

import { memo } from 'react';
import { Snackbar, Alert, Button, Typography, Box } from '@mui/material';
import { Play } from 'lucide-react';

interface ResumeToastProps {
    show: boolean;
    chapterNumber: number;
    timestamp: number;
    formatTime: (time: number) => string;
    onResume: () => void;
    onDismiss: () => void;
}

export const ResumeToast = memo(function ResumeToast({
    show,
    chapterNumber,
    timestamp,
    formatTime,
    onResume,
    onDismiss,
}: ResumeToastProps) {
    return (
        <Snackbar
            open={show}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                top: { xs: 80, sm: 24 }, // Adjust top position
                width: '100%',
                maxWidth: 600,
                left: '50%',
                transform: 'translateX(-50%)',
                position: 'absolute' // Relative to parent container usually
            }}
        >
            <Alert
                severity="info"
                icon={<Play size={18} fill="currentColor" />}
                action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button color="inherit" size="small" onClick={onDismiss}>
                            Bỏ qua
                        </Button>
                        <Button color="primary" variant="contained" size="small" onClick={onResume} disableElevation>
                            Nghe tiếp
                        </Button>
                    </Box>
                }
                sx={{
                    width: '100%',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    boxShadow: 3
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Tiếp tục nghe?
                </Typography>
                <Typography variant="caption" display="block">
                    Chương {chapterNumber} lúc {formatTime(timestamp)}
                </Typography>
            </Alert>
        </Snackbar>
    );
});
