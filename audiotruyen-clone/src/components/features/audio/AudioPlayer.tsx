'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { useAudio } from '@/contexts/AudioContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Sub-components
import { AudioProgressBar } from './AudioProgressBar';
import { AudioControls } from './AudioControls';
import { SpeedControl } from './SpeedControl';
import { VolumeControl } from './VolumeControl';
import { ChapterSelector } from './ChapterSelector';
import { ResumeToast } from './ResumeToast';

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
        toggleSpeedMenu,
        hideResumeToast,
        handleResume,
        formatTime
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
        <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 md:p-6 shadow-sm relative overflow-hidden">
            {/* Gradient Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />

            {/* Title */}
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                {title}
            </h3>

            {/* Resume Toast */}
            <ResumeToast
                show={state.showResumeToast && !!state.resumeData}
                chapterNumber={state.resumeData?.chapterNumber || 0}
                timestamp={state.resumeData?.timestamp || 0}
                formatTime={formatTime}
                onResume={handleResume}
                onDismiss={hideResumeToast}
            />

            {/* Progress Bar */}
            <AudioProgressBar
                currentTime={state.currentTime}
                duration={state.duration}
                onSeek={seek}
                formatTime={formatTime}
            />

            {/* Controls */}
            <div className="flex flex-col gap-6 mb-4">
                <div className="grid grid-cols-[48px_1fr_48px] sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 min-h-[64px]">
                    <div className="flex justify-start">
                        <SpeedControl
                            playbackRate={state.playbackRate}
                            isOpen={state.isSpeedMenuOpen}
                            onToggle={toggleSpeedMenu}
                            onSpeedChange={setPlaybackRate}
                        />
                    </div>

                    <div className="flex justify-center w-full overflow-hidden">
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

                    <div className="hidden sm:block" aria-hidden="true" />
                </div>

                {/* Volume & Chapter */}
                <div className="flex items-center gap-4 justify-between border-t border-[var(--color-border-light)] pt-4">
                    <VolumeControl volume={state.volume} onVolumeChange={setVolume} />
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

            {/* Background Music (Feature) */}
            <div className="border-t border-[var(--color-border-light)] pt-4 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label htmlFor="bg-music-url" className="text-sm font-medium text-[var(--color-text-secondary)] whitespace-nowrap">
                        Nhạc nền:
                    </label>
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            id="bg-music-url"
                            type="url"
                            placeholder="URL nhạc nền (Youtube, MP3...)"
                            className="flex-1 min-w-0 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                        />
                        <Button size="sm" className="whitespace-nowrap flex-shrink-0 shadow-sm">
                            Phát nhạc
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
