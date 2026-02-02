'use client';

import { useEffect, useState } from 'react';
import { Button, Paper, Box, Typography, TextField, IconButton } from '@mui/material';
import HeadsetIcon from '@mui/icons-material/Headset';
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
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Gradient Border Top */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(to right, primary.main, primary.light)',
                }}
            />

            {/* Title */}
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HeadsetIcon />
                {title}
            </Typography>

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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 2 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '48px 1fr 48px', sm: '1fr auto 1fr' },
                    alignItems: 'center',
                    gap: { xs: 1, sm: 2 },
                    minHeight: 64
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <SpeedControl
                            playbackRate={state.playbackRate}
                            onSpeedChange={setPlaybackRate}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
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
                    </Box>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }} aria-hidden="true" />
                </Box>

                {/* Volume & Chapter */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                    <VolumeControl volume={state.volume} onVolumeChange={setVolume} />
                    <ChapterSelector
                        chapters={state.chapters}
                        selectedChapter={state.selectedChapter}
                        onChapterChange={(chapter) => {
                            setChapter(chapter);
                            if (onChapterChange) onChapterChange(chapter);
                        }}
                    />
                </Box>
            </Box>

            {/* Background Music (Feature) */}
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        Nhạc nền:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <TextField
                            id="bg-music-url"
                            placeholder="URL nhạc nền (Youtube, MP3...)"
                            size="small"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <Button variant="outlined" size="small" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                            Phát nhạc
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
