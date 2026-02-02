'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, ChevronRight } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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

    const progressValue = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

    return (
        <div
            style={{ bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))' }}
            className={cn(
                "fixed z-50 transition-all duration-500 md:bottom-6 right-0 left-0 md:left-auto md:right-6",
                "px-4 md:px-0 md:w-[380px] animate-in slide-in-from-bottom-8 duration-700 ease-out",
                className
            )}
        >
            <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl shadow-premium-lg border border-primary/10 overflow-hidden ring-1 ring-black/5 group">
                {/* Progress bar at top of miniplayer */}
                <Progress value={progressValue} className="h-1 rounded-none bg-primary/10" />

                <div className="flex items-center gap-3 p-2.5">
                    {/* Cover */}
                    <Link href={`/truyen/${state.storySlug}`} className="shrink-0 relative overflow-hidden group/cover">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-white/20">
                            <Image
                                src={state.coverUrl || '/covers/placeholder.jpg'}
                                alt={state.storyTitle}
                                fill
                                className="object-cover transition-transform group-hover/cover:scale-110"
                                sizes="48px"
                            />
                        </div>
                    </Link>

                    {/* Info */}
                    <Link
                        href={`/truyen/${state.storySlug}`}
                        className="flex-1 min-w-0 pr-2 group/info"
                    >
                        <h4 className="text-sm font-bold text-foreground truncate group-hover/info:text-primary transition-colors">
                            {state.storyTitle}
                        </h4>
                        <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 pt-0.5">
                            <span className="text-primary font-black uppercase tracking-tighter">Chương {state.selectedChapter}</span>
                            <span className="opacity-30">•</span>
                            <span className="font-mono font-bold tracking-tight opacity-70">{formatTime(state.currentTime)}</span>
                        </p>
                    </Link>

                    {/* Controls */}
                    <div className="flex items-center gap-1">
                        <Button
                            size="icon"
                            variant="default"
                            onClick={togglePlay}
                            className="w-11 h-11 rounded-full shadow-glow bg-primary hover:bg-primary/90 text-white transition-all active:scale-90"
                            aria-label={state.isPlaying ? 'Tạm dừng' : 'Phát'}
                        >
                            {state.isPlaying ? (
                                <Pause size={22} fill="currentColor" />
                            ) : (
                                <Play size={22} fill="currentColor" className="translate-x-0.5" />
                            )}
                        </Button>
                        <Link href={`/truyen/${state.storySlug}`} className="hidden md:flex">
                            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full h-10 w-10">
                                <ChevronRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
