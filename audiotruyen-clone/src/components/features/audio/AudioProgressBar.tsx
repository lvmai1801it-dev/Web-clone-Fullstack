'use client';

import { memo } from 'react';
import { Slider } from '@/components/ui/slider';

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
    const handleSliderChange = (values: number[]) => {
        if (values.length > 0 && typeof values[0] === 'number') {
            onSeek(values[0]);
        }
    };

    return (
        <div className="w-full space-y-2.5">
            <Slider
                min={0}
                max={duration || 100}
                step={1}
                value={[currentTime]}
                onValueChange={handleSliderChange}
                aria-label="Thanh tiến trình audio"
                className="cursor-pointer"
            />
            <div className="flex justify-between items-center px-0.5">
                <span className="text-[11px] font-bold tracking-tighter text-muted-foreground/80 font-mono">
                    {formatTime(currentTime)}
                </span>
                <span className="text-[11px] font-bold tracking-tighter text-muted-foreground/80 font-mono">
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    );
});
