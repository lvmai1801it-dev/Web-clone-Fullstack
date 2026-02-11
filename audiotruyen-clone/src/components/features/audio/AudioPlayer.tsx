'use client';

import { useEffect } from 'react';
import { Headphones, Music } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sub-components
import { AudioProgressBar } from './AudioProgressBar';
import { AudioControls } from './AudioControls';
import { SpeedControl } from './SpeedControl';
import { VolumeControl } from './VolumeControl';
import { ChapterSelector } from './ChapterSelector';

interface AudioPlayerProps {
    storyId: number;
    storyTitle?: string;
    storySlug?: string;
    coverUrl?: string;
    chapters?: { number: number; title: string; audioUrl: string }[];
    currentChapter?: number;
    onChapterChange?: (chapter: number) => void;
    title?: string;
}

export default function AudioPlayer({
    storyId,
    storyTitle = '',
    storySlug = '',
    coverUrl = '',
    chapters = [],
    currentChapter = 1,
    onChapterChange,
    title = 'Nghe Truyện'
}: AudioPlayerProps) {
    const {
        state,
        setStory,
        togglePlay,
        seek,
        skip,
        setChapter,
        setPlaybackRate,
        setVolume,
        formatTime,
        handleResume
    } = useAudio();

    // Initialize story in context if it's different
    useEffect(() => {
        if (state.storyId !== storyId) {
            setStory({
                storyId,
                storyTitle,
                storySlug,
                coverUrl,
                chapters
            });
            // If currentChapter is provided and different from default, set it
            if (currentChapter !== 1) {
                setChapter(currentChapter);
            }
        }
    }, [storyId, storyTitle, storySlug, coverUrl, chapters, state.storyId, setStory, currentChapter, setChapter]);

    // Keyboard shortcuts - using dedicated hook
    useKeyboardShortcuts({
        onTogglePlay: togglePlay,
        onSkip: skip,
        onToggleMute: () => setVolume(state.volume > 0 ? 0 : 1),
        skipTime: 10,
        enabled: state.storyId === storyId
    });

    // Only show the player if it's initialized for this story
    if (state.storyId !== storyId) return null;

    return (
        <Card className="border-none shadow-premium bg-card/80 backdrop-blur-md rounded-2xl overflow-hidden relative">
            {/* Gradient Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-primary/40" />

            <CardHeader className="pb-4 pt-8 px-6 md:px-8">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                    <Headphones className="w-6 h-6 animate-bounce-slow" />
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 md:px-8 pb-8 space-y-8">
                {/* Resume Toast */}

                {/* Progress Bar Area */}
                <div className="space-y-2">
                    <AudioProgressBar
                        currentTime={state.currentTime}
                        duration={state.duration}
                        onSeek={seek}
                        formatTime={formatTime}
                    />
                </div>

                {/* Main Controls Area */}
                <div className="flex flex-col space-y-8">
                    {/* Top Row: Speed, Controls, Placeholder */}
                    {/* Top Row: Speed, Controls, Placeholder */}
                    <div className="flex flex-col-reverse md:grid md:grid-cols-3 items-center gap-6 md:gap-4">
                        <div className="flex w-full md:w-auto justify-between md:justify-start">
                            <SpeedControl
                                playbackRate={state.playbackRate}
                                onSpeedChange={setPlaybackRate}
                            />
                            {/* Mobile Volume Toggle could go here if needed, or keeping explicit volume below */}
                        </div>

                        <div className="flex justify-center w-full md:w-auto">
                            <AudioControls
                                isPlaying={state.isPlaying}
                                canGoPrev={state.selectedChapter > 1}
                                canGoNext={state.selectedChapter < state.chapters.length}
                                onTogglePlay={togglePlay}
                                onSkip={skip}
                                onPrevChapter={() => {
                                    const prev = state.selectedChapter - 1;
                                    setChapter(prev);
                                    if (onChapterChange) onChapterChange(prev);
                                }}
                                onNextChapter={() => {
                                    const next = state.selectedChapter + 1;
                                    setChapter(next);
                                    if (onChapterChange) onChapterChange(next);
                                }}
                            />
                        </div>

                        <div className="hidden md:block" />
                    </div>

                    {/* Bottom Row: Volume & Chapter */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-muted/50">
                        <VolumeControl volume={state.volume} onVolumeChange={setVolume} />

                        <div className="w-full sm:w-auto min-w-[200px]">
                            <ChapterSelector
                                chapters={state.chapters}
                                selectedChapter={state.selectedChapter}
                                onChapterChange={(chapter) => {
                                    setChapter(chapter);
                                    if (onChapterChange) onChapterChange(chapter);
                                }}
                            />
                        </div>
                    </div>

                    {/* Resume Prompt (Inline - Contextual) */}
                    {state.resumeData && state.resumeData.storyId === state.storyId && (
                        <div className="animate-in fade-in slide-in-from-top-3 pt-4 border-t border-dashed border-primary/20 mt-2">
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tiếp tục nghe</span>
                                <Button
                                    onClick={handleResume}
                                    size="lg"
                                    className="w-full sm:w-auto min-w-[300px] gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-bold rounded-xl h-12"
                                >
                                    <Music size={18} className="animate-pulse" />
                                    <span>
                                        Chương {state.resumeData.chapterNumber}
                                        <span className="opacity-70 font-medium ml-2 text-xs">(từ {formatTime(state.resumeData.timestamp)})</span>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
