'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Fab } from '@mui/material';
import { Play, X } from 'lucide-react';
import { PlaybackPersistence } from '@/lib/persistence';
import { useAudio } from '@/contexts/AudioContext';

interface FABProps {
    className?: string;
}

export function FloatingActionButton({ className = '' }: FABProps) {
    const { state } = useAudio();
    const [lastPlayed] = useState<{
        storyId: number;
        storySlug: string;
        storyTitle: string;
    } | null>(() => {
        if (typeof window === 'undefined') return null;
        const isOnStoryPage = window.location.pathname.startsWith('/truyen/');
        if (isOnStoryPage) return null;
        const progress = PlaybackPersistence.getLastPlayed();
        if (progress && progress.storySlug && progress.storyTitle) {
            return {
                storyId: progress.storyId,
                storySlug: progress.storySlug,
                storyTitle: progress.storyTitle,
            };
        }
        return null;
    });
    const [isExpanded, setIsExpanded] = useState(false);

    // Hide if no story to resume OR if player is currently active (MiniPlayer is visible)
    if (!lastPlayed || state.storyId) return null;

    return (
        <div className={`fixed bottom-20 right-4 z-40 md:hidden ${className}`}>
            {/* Expanded tooltip */}
            {isExpanded && (
                <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-xl border border-[var(--color-border)] p-3 min-w-[180px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Tiếp tục nghe</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2">
                        {lastPlayed.storyTitle}
                    </p>
                    <Link
                        href={`/truyen/${lastPlayed.storySlug}`}
                        className="mt-2 block w-full py-2 text-center text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg active:scale-[0.98] transition-transform"
                    >
                        Nghe ngay
                    </Link>
                </div>
            )}

            {/* FAB Button */}
            <Fab
                color="primary"
                aria-label="Quick play"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14"
            >
                {isExpanded ? (
                    <X size={24} />
                ) : (
                    <Play size={24} fill="currentColor" />
                )}
            </Fab>
        </div>
    );
}
