'use client';

import { memo } from 'react';

interface SpeedControlProps {
    playbackRate: number;
    isOpen: boolean;
    onToggle: () => void;
    onSpeedChange: (rate: number) => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const SpeedControl = memo(function SpeedControl({
    playbackRate,
    isOpen,
    onToggle,
    onSpeedChange,
}: SpeedControlProps) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] touch-target rounded-full hover:bg-[var(--color-background)] transition-colors"
                aria-label={`Tốc độ phát: ${playbackRate}x`}
                aria-expanded={isOpen}
            >
                {playbackRate}x
            </button>

            {isOpen && (
                <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-[var(--color-border)] rounded-lg shadow-lg py-1 min-w-[80px] z-10 animate-in fade-in zoom-in-95 duration-100"
                    role="menu"
                >
                    {SPEED_OPTIONS.map((rate) => (
                        <button
                            key={rate}
                            onClick={() => onSpeedChange(rate)}
                            className={`block w-full px-3 py-1.5 text-sm text-left hover:bg-[var(--color-background)] ${playbackRate === rate
                                    ? 'text-[var(--color-primary)] font-bold'
                                    : 'text-[var(--color-text-primary)]'
                                }`}
                            role="menuitem"
                        >
                            {rate}x
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});
