'use client';

import { memo } from 'react';

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSeek(Number(e.target.value));
    };

    return (
        <div className="mb-4">
            <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleChange}
                className="w-full h-2 bg-[var(--color-background)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                aria-label="Thanh tiến trình audio"
            />
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
});
