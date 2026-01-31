'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
    storyId: number;
    audioUrl?: string;
    title?: string;
    chapters?: { number: number; title: string; audioUrl: string }[];
    currentChapter?: number;
    onChapterChange?: (chapter: number) => void;
}

import { PlaybackPersistence, PlaybackProgress } from '@/lib/persistence';

export default function AudioPlayer({
    storyId,
    audioUrl,
    title = 'Nghe Truyện',
    chapters = [],
    currentChapter = 1,
    onChapterChange
}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [selectedChapter, setSelectedChapter] = useState(currentChapter);
    const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
    const [showResumeToast, setShowResumeToast] = useState(false);
    const [resumeData, setResumeData] = useState<PlaybackProgress | null>(null);
    const shouldAutoPlayRef = useRef(false);
    const hasRestoredProgressRef = useRef(true); // Default to true (don't auto-restore)

    const demoAudioUrl = audioUrl || chapters.find(c => c.number === selectedChapter)?.audioUrl || '';

    const handleChapterChange = useCallback((chapter: number) => {
        setSelectedChapter(chapter);
        if (onChapterChange) {
            onChapterChange(chapter);
        }
        shouldAutoPlayRef.current = true;
    }, [onChapterChange]);

    // Handle Initial Progress Check
    useEffect(() => {
        const progress = PlaybackPersistence.getProgress(storyId);
        if (progress && (progress.chapterNumber > 1 || progress.timestamp > 10)) {
            const timer = setTimeout(() => {
                setResumeData(progress);
                setShowResumeToast(true);
            }, 0);

            // Auto-hide after 15s if not acted upon
            const hideTimer = setTimeout(() => setShowResumeToast(false), 15000);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [storyId]);

    const handleResume = () => {
        if (!resumeData) return;

        const audio = audioRef.current;
        setShowResumeToast(false);
        shouldAutoPlayRef.current = true;

        if (selectedChapter === resumeData.chapterNumber) {
            // Already on correct chapter, seek directly
            if (audio) {
                audio.currentTime = resumeData.timestamp;
                audio.play().catch(console.error);
                setIsPlaying(true);
            }
        } else {
            // Change chapter, restoration will happen in loadedmetadata
            hasRestoredProgressRef.current = false;
            setSelectedChapter(resumeData.chapterNumber);
        }
    };

    // Handle Auto-play and Seeking after chapter change or resume
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !shouldAutoPlayRef.current) return;

        const handleMetadataForAutoPlay = () => {
            // If we are waiting to restore progress
            if (!hasRestoredProgressRef.current) {
                const progress = PlaybackPersistence.getProgress(storyId);
                if (progress && progress.chapterNumber === selectedChapter) {
                    audio.currentTime = progress.timestamp;
                }
                hasRestoredProgressRef.current = true;
            }

            audio.play().catch(error => {
                if (error.name !== 'AbortError') console.error("Playback error:", error);
            });
            setIsPlaying(true);
            shouldAutoPlayRef.current = false;
        };

        // If metadata already loaded, just play (and seek if needed)
        if (audio.readyState >= 1) {
            handleMetadataForAutoPlay();
        } else {
            audio.addEventListener('loadedmetadata', handleMetadataForAutoPlay, { once: true });
        }

        return () => audio.removeEventListener('loadedmetadata', handleMetadataForAutoPlay);
    }, [demoAudioUrl, selectedChapter, storyId]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            audio.playbackRate = playbackRate; // Persist speed
        };
        const handleEnded = () => {
            setIsPlaying(false);
            if (selectedChapter < chapters.length) {
                handleChapterChange(selectedChapter + 1);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [selectedChapter, chapters.length, handleChapterChange, playbackRate]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            // Save immediately on pause
            if (audio.currentTime > 5) {
                PlaybackPersistence.saveProgress({
                    storyId,
                    chapterId: 0,
                    chapterNumber: selectedChapter,
                    timestamp: audio.currentTime
                });
            }
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Periodically save progress (More stable dependency)
    useEffect(() => {
        if (!isPlaying || !storyId) return;

        const interval = setInterval(() => {
            const audio = audioRef.current;
            if (audio && audio.currentTime > 5) {
                PlaybackPersistence.saveProgress({
                    storyId,
                    chapterId: 0,
                    chapterNumber: selectedChapter,
                    timestamp: audio.currentTime
                });
                console.log('Saved progress:', audio.currentTime);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPlaying, storyId, selectedChapter]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const time = Number(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const handleSkip = (seconds: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const vol = Number(e.target.value);
        audio.volume = vol;
        setVolume(vol);
    };

    const handleSpeedChange = (rate: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.playbackRate = rate;
        setPlaybackRate(rate);
        setIsSpeedMenuOpen(false);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] p-6 shadow-sm relative overflow-hidden">
            {/* Gradient Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]"></div>

            {/* Title */}
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                {title}
            </h3>

            {/* Resume Playback Toast */}
            {showResumeToast && resumeData && (
                <div className="absolute top-12 left-6 right-6 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-blue-600 text-white p-3 rounded-lg shadow-xl flex items-center justify-between gap-3 border border-blue-400">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                </svg>
                            </div>
                            <div className="text-xs">
                                <p className="font-bold">Tiếp tục nghe?</p>
                                <p className="opacity-90">Chương {resumeData.chapterNumber} lúc {formatTime(resumeData.timestamp)}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowResumeToast(false)}
                                className="px-2 py-1 text-[10px] h-auto font-medium hover:bg-white/10 rounded"
                            >
                                Bỏ qua
                            </button>
                            <button
                                onClick={handleResume}
                                className="px-3 py-1 text-[10px] h-auto font-bold bg-white text-blue-600 hover:bg-blue-50 rounded shadow-sm"
                            >
                                Nghe tiếp
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Element */}
            <audio ref={audioRef} src={demoAudioUrl || undefined} preload="metadata" />

            {/* Progress Bar */}
            <div className="mb-4">
                <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-[var(--color-background)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                />
                <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls Row 1: Playback & Navigation */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-center gap-4 sm:gap-8">
                    {/* Speed Toggle (Mobile Friendly) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-background)] transition-colors"
                        >
                            {playbackRate}x
                        </button>
                        {isSpeedMenuOpen && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-[var(--color-border)] rounded-lg shadow-lg py-1 min-w-[80px] z-10 animate-in fade-in zoom-in-95 duration-100">
                                {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() => handleSpeedChange(rate)}
                                        className={`block w-full px-3 py-1.5 text-sm text-left hover:bg-[var(--color-background)] ${playbackRate === rate ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-text-primary)]'}`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Prev Chapter */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChapterChange(selectedChapter - 1)}
                        disabled={selectedChapter <= 1}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-full w-10 h-10"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                        </svg>
                    </Button>

                    {/* Rewind 10s */}
                    <div className="flex flex-col items-center -gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSkip(-10)}
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-full w-10 h-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                        </Button>
                        <span className="text-[10px] font-medium text-[var(--color-text-muted)]">-10s</span>
                    </div>

                    {/* Main Play Button */}
                    <Button
                        onClick={togglePlay}
                        size="icon"
                        className="w-16 h-16 rounded-full shadow-xl shadow-blue-200 hover:scale-105 transition-transform"
                        aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                    >
                        {isPlaying ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </Button>

                    {/* Forward 10s */}
                    <div className="flex flex-col items-center -gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSkip(10)}
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-full w-10 h-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                            </svg>
                        </Button>
                        <span className="text-[10px] font-medium text-[var(--color-text-muted)]">+10s</span>
                    </div>

                    {/* Next Chapter */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChapterChange(selectedChapter + 1)}
                        disabled={selectedChapter >= chapters.length}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-full w-10 h-10"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                        </svg>
                    </Button>
                </div>

                {/* Controls Row 2: Volume & Chapter */}
                <div className="flex items-center gap-4 justify-between border-t border-[var(--color-border-light)] pt-4">
                    {/* Volume */}
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--color-text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1.5 bg-[var(--color-background)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                        />
                    </div>

                    {/* Chapter Select */}
                    {chapters.length > 0 && (
                        <select
                            value={selectedChapter}
                            onChange={(e) => handleChapterChange(Number(e.target.value))}
                            className="flex-1 px-3 py-1.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white max-w-[180px] sm:max-w-[220px]"
                        >
                            {chapters.map((chapter) => (
                                <option key={chapter.number} value={chapter.number}>
                                    Chương {chapter.number}: {chapter.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Background Music (Feature) */}
            <div className="border-t border-[var(--color-border-light)] pt-4 mt-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="bg-music-url" className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">Nhạc nền:</label>
                    <div className="flex-1 flex gap-2">
                        <input
                            id="bg-music-url"
                            type="url"
                            placeholder="URL..."
                            className="flex-1 px-3 py-1.5 text-sm border border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-primary)]"
                        />
                        <Button size="sm">Phát</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
