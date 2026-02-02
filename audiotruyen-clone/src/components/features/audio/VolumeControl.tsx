'use client';

import { memo } from 'react';
import { Slider, Stack } from '@mui/material';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

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
                <VolumeX size={20} className="text-[var(--color-text-secondary)]" />
            ) : volume < 0.5 ? (
                <Volume1 size={20} className="text-[var(--color-text-secondary)]" />
            ) : (
                <Volume2 size={20} className="text-[var(--color-text-secondary)]" />
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
