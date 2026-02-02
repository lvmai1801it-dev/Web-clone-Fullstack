'use client';

import { memo } from 'react';
import { IconButton } from '@mui/material';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw } from 'lucide-react';

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
                <SkipBack size={24} fill={canGoPrev ? "currentColor" : "none"} />
            </IconButton>

            {/* Rewind 10s */}
            <div className="flex flex-col items-center -gap-1">
                <IconButton
                    onClick={() => onSkip(-10)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] touch-target"
                    aria-label="Tua lại 10 giây"
                >
                    <RotateCcw size={24} />
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
                    <Pause size={32} fill="currentColor" />
                ) : (
                    <Play size={32} fill="currentColor" className="translate-x-0.5" />
                )}
            </IconButton>

            {/* Forward 10s */}
            <div className="flex flex-col items-center -gap-1">
                <IconButton
                    onClick={() => onSkip(10)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] touch-target"
                    aria-label="Tua đi 10 giây"
                >
                    <RotateCw size={24} />
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
                <SkipForward size={24} fill={canGoNext ? "currentColor" : "none"} />
            </IconButton>
        </div>
    );
});
