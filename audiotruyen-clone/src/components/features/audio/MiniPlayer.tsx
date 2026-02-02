'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Paper, Box, Typography, IconButton, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
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
        <Box
            sx={{
                position: 'fixed',
                bottom: 60,
                left: 0,
                right: 0,
                zIndex: 30,
                display: { xs: 'block', md: 'none' },
                animation: 'slide-in-from-bottom 0.3s ease-out',
                ...className as any
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    mx: 2,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1 }}>
                    {/* Cover */}
                    <Link href={`/truyen/${state.storySlug}`} style={{ flexShrink: 0 }}>
                        <Box sx={{ position: 'relative', width: 48, height: 48, borderRadius: 2, overflow: 'hidden', bgcolor: 'action.hover' }}>
                            <Image
                                src={state.coverUrl || '/covers/placeholder.jpg'}
                                alt={state.storyTitle}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </Box>
                    </Link>

                    {/* Info */}
                    <Link href={`/truyen/${state.storySlug}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {state.storyTitle}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            Chương {state.selectedChapter} • {formatTime(state.currentTime)}
                        </Typography>
                    </Link>

                    {/* Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                            onClick={togglePlay}
                            color="primary"
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                            aria-label={state.isPlaying ? 'Tạm dừng' : 'Phát'}
                        >
                            {state.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {/* Progress bar */}
                <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 4, bgcolor: 'action.hover' }} />
            </Paper>
        </Box>
    );
}
