'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAudio } from '@/contexts/AudioContext';
import { usePathname } from 'next/navigation';

interface MiniPlayerProps {
    className?: string;
}

export function MiniPlayer({ className = '' }: MiniPlayerProps) {
    const { state, togglePlay, formatTime } = useAudio();
    const pathname = usePathname();

    // Don't show if no story is loaded
    if (!state.storyId) return null;

    // Hide if we are on a story detail page
    const isOnStoryPage = pathname.startsWith('/truyen/');
    if (isOnStoryPage) return null;

    const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

    return (
        <div className={`fixed bottom-[60px] left-0 right-0 z-30 md:hidden animate-in slide-in-from-bottom duration-300 ${className}`}>
            <div className="mx-2 bg-white border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center gap-3 p-2">
                    {/* Cover */}
                    <Link href={`/truyen/${state.storySlug}`} className="flex-shrink-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-background)]">
                            <Image
                                src={state.coverUrl || '/covers/placeholder.jpg'}
                                alt={state.storyTitle}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                    </Link>

                    {/* Info */}
                    <Link href={`/truyen/${state.storySlug}`} className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                            {state.storyTitle}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Chương {state.selectedChapter} • {formatTime(state.currentTime)}
                        </p>
                    </Link>

                    {/* Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white active:scale-95 transition-transform"
                            aria-label={state.isPlaying ? 'Tạm dừng' : 'Phát'}
                        >
                            {state.isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-[var(--color-background)]">
                    <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
