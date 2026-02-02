'use client';

import { memo } from 'react';
import { Slider, Box, Stack } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

export const VolumeControl = memo(function VolumeControl({
    volume,
    onVolumeChange,
}: VolumeControlProps) {
    const handleChange = (event: Event, newValue: number | number[]) => {
        onVolumeChange(newValue as number);
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 120 }}>
            {volume === 0 ? (
                <VolumeMuteIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            ) : volume < 0.5 ? (
                <VolumeDownIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            ) : (
                <VolumeUpIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            )}
            <Slider
                size="small"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleChange}
                aria-label="Âm lượng"
                sx={{
                    color: 'text.primary',
                    height: 4,
                    '& .MuiSlider-thumb': {
                        width: 10,
                        height: 10,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0px 0px 0px 8px rgb(0 0 0 / 16%)',
                        },
                        '&.Mui-active': {
                            width: 14,
                            height: 14,
                        },
                    },
                }}
            />
        </Stack>
    );
});
