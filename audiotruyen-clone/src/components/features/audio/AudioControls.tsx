'use client';

import { memo } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/button';
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
        <div className="flex items-center justify-center gap-3 xs:gap-6 sm:gap-10">
            {/* Prev Chapter */}
            <IconButton
                onClick={onPrevChapter}
                disabled={!canGoPrev}
                className="text-foreground/70 hover:text-primary hover:bg-muted transition-all active:scale-90"
                aria-label="Chương trước"
            >
                <SkipBack size={26} fill={canGoPrev ? "currentColor" : "none"} className="opacity-80" />
            </IconButton>

            {/* Rewind 10s */}
            <div className="flex flex-col items-center group">
                <IconButton
                    onClick={() => onSkip(-10)}
                    className="text-foreground/70 hover:text-primary hover:bg-muted transition-all active:scale-90"
                    aria-label="Tua lại 10 giây"
                >
                    <RotateCcw size={22} className="group-hover:-rotate-12 transition-transform" />
                </IconButton>
                <span className="text-[10px] font-bold text-muted-foreground/60 mt-1 select-none font-mono">-10s</span>
            </div>

            {/* Main Play Button */}
            <Button
                variant="default"
                size="icon"
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full shadow-glow hover:scale-105 active:scale-95 transition-all bg-primary hover:bg-primary/90 text-white"
                aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
                {isPlaying ? (
                    <Pause size={30} fill="currentColor" />
                ) : (
                    <Play size={30} fill="currentColor" className="translate-x-0.5" />
                )}
            </Button>

            {/* Forward 10s */}
            <div className="flex flex-col items-center group">
                <IconButton
                    onClick={() => onSkip(10)}
                    className="text-foreground/70 hover:text-primary hover:bg-muted transition-all active:scale-90"
                    aria-label="Tua đi 10 giây"
                >
                    <RotateCw size={22} className="group-hover:rotate-12 transition-transform" />
                </IconButton>
                <span className="text-[10px] font-bold text-muted-foreground/60 mt-1 select-none font-mono">+10s</span>
            </div>

            {/* Next Chapter */}
            <IconButton
                onClick={onNextChapter}
                disabled={!canGoNext}
                className="text-foreground/70 hover:text-primary hover:bg-muted transition-all active:scale-90"
                aria-label="Chương sau"
            >
                <SkipForward size={26} fill={canGoNext ? "currentColor" : "none"} className="opacity-80" />
            </IconButton>
        </div>
    );
});
