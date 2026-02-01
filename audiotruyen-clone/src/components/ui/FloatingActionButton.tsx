'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlaybackPersistence } from '@/lib/persistence';

interface FABProps {
    className?: string;
}

export function FloatingActionButton({ className = '' }: FABProps) {
    const [lastPlayed, setLastPlayed] = useState<{
        storyId: number;
        storySlug: string;
        storyTitle: string;
    } | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const progress = PlaybackPersistence.getLastPlayed();
        if (progress && progress.storySlug && progress.storyTitle) {
            setLastPlayed({
                storyId: progress.storyId,
                storySlug: progress.storySlug,
                storyTitle: progress.storyTitle,
            });
        }
    }, []);

    // Hide on story pages
    useEffect(() => {
        const isOnStoryPage = window.location.pathname.startsWith('/truyen/');
        if (isOnStoryPage) {
            setLastPlayed(null);
        }
    }, []);

    if (!lastPlayed) return null;

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
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center active:scale-95 transition-all"
                aria-label="Quick play"
            >
                {isExpanded ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
