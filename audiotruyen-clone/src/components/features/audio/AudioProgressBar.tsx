'use client';

import { memo } from 'react';
import { Slider, Box, Typography } from '@mui/material';

interface AudioProgressBarProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    formatTime: (time: number) => string;
}

export const AudioProgressBar = memo(function AudioProgressBar({
    currentTime,
    duration,
    onSeek,
    formatTime,
}: AudioProgressBarProps) {
    const handleChange = (event: Event, newValue: number | number[]) => {
        onSeek(newValue as number);
    };

    return (
        <Box sx={{ mb: 2, width: '100%' }}>
            <Slider
                size="small"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleChange}
                aria-label="Thanh tiến trình audio"
                sx={{
                    color: 'primary.main',
                    height: 4,
                    '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0px 0px 0px 8px rgb(0 0 0 / 16%)',
                        },
                        '&.Mui-active': {
                            width: 20,
                            height: 20,
                        },
                    },
                    '& .MuiSlider-rail': {
                        opacity: 0.28,
                    },
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {formatTime(currentTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {formatTime(duration)}
                </Typography>
            </Box>
        </Box>
    );
});
