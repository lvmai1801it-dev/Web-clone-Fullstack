'use client';

import { memo } from 'react';
import { IconButton } from '@mui/material';

interface AudioControlsProps {
    isPlaying: boolean;
    canGoPrev: boolean;
    canGoNext: boolean;
    onTogglePlay: () => void;
    onSkip: (seconds: number) => void;
    onPrevChapter: () => void;
    onNextChapter: () => void;
}

export const AudioControls = memo(function AudioControls({
    isPlaying,
    canGoPrev,
    canGoNext,
    onTogglePlay,
    onSkip,
    onPrevChapter,
    onNextChapter,
}: AudioControlsProps) {
    return (
        <div className="flex items-center justify-center gap-2 xs:gap-4 sm:gap-8">
            {/* Prev Chapter */}
            <IconButton
                onClick={onPrevChapter}
                disabled={!canGoPrev}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] touch-target"
                aria-label="Chương trước"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                </svg>
            </IconButton>

            {/* Rewind 10s */}
            <div className="flex flex-col items-center -gap-1">
                <IconButton
                    onClick={() => onSkip(-10)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] touch-target"
                    aria-label="Tua lại 10 giây"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                    </svg>
                </IconButton>
                <span className="text-[10px] font-medium text-[var(--color-text-muted)]">-10s</span>
            </div>

            {/* Main Play Button */}
            <IconButton
                onClick={onTogglePlay}
                className="w-16 h-16 shadow-xl shadow-blue-200 hover:scale-105 transition-transform bg-white hover:bg-white"
                aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                color="primary"
            >
                {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </IconButton>

            {/* Forward 10s */}
            <div className="flex flex-col items-center -gap-1">
                <IconButton
                    onClick={() => onSkip(10)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] touch-target"
                    aria-label="Tua đi 10 giây"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                </IconButton>
                <span className="text-[10px] font-medium text-[var(--color-text-muted)]">+10s</span>
            </div>

            {/* Next Chapter */}
            <IconButton
                onClick={onNextChapter}
                disabled={!canGoNext}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] touch-target"
                aria-label="Chương sau"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </svg>
            </IconButton>
        </div>
    );
});
