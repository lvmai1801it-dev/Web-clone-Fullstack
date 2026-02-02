'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './button';
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
                <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-premium border p-4 min-w-[220px] animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Tiếp tục nghe</p>
                    <p className="text-sm font-bold text-foreground line-clamp-2 mb-3">
                        {lastPlayed.storyTitle}
                    </p>
                    <Link
                        href={`/truyen/${lastPlayed.storySlug}`}
                        className="block w-full"
                    >
                        <Button className="w-full bg-primary hover:shadow-glow transition-all rounded-xl">
                            Nghe ngay
                        </Button>
                    </Link>
                </div>
            )}

            {/* FAB Button */}
            <Button
                variant="default"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 rounded-full shadow-premium hover:shadow-glow transition-all"
            >
                {isExpanded ? (
                    <X size={24} />
                ) : (
                    <Play size={24} fill="currentColor" />
                )}
            </Button>
        </div>
    );
}
