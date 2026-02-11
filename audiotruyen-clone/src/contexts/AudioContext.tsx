'use client';

import { createContext, useContext, useReducer, useRef, useCallback, ReactNode, useEffect } from 'react';
import { PlaybackPersistence } from '@/lib/persistence';
import { debounce } from '@/lib/utils';
import { AudioContextValue, Chapter } from './audio.types';
import { audioReducer, initialAudioState } from './audio.reducer';

// Re-export types for consumers
export type { Chapter, AudioState, AudioContextValue } from './audio.types';
export { toUIChapter } from './audio.types';

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(audioReducer, initialAudioState);
    const audioRef = useRef<HTMLAudioElement>(null);
    const shouldAutoPlayRef = useRef(false);

    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    // Check for last played story on global mount
    useEffect(() => {
        if (state.isPlaying) return;

        const lastPlayed = PlaybackPersistence.getLastPlayed();
        if (lastPlayed) {
            if (lastPlayed.chapterNumber > 1 || lastPlayed.timestamp > 10) {
                dispatch({ type: 'SHOW_RESUME_TOAST', payload: lastPlayed });
                const timer = setTimeout(() => {
                    dispatch({ type: 'HIDE_RESUME_TOAST' });
                }, 15000);
                return () => clearTimeout(timer);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const saveProgress = useCallback(() => {
        const currentState = stateRef.current;
        const audio = audioRef.current;

        if (!currentState.storyId || !audio || audio.currentTime < 5) return;

        PlaybackPersistence.saveProgress({
            storyId: currentState.storyId,
            chapterId: 0,
            chapterNumber: currentState.selectedChapter,
            timestamp: audio.currentTime,
            storyTitle: currentState.storyTitle,
            storySlug: currentState.storySlug,
            coverUrl: currentState.coverUrl,
        });
    }, []);

    const setStory = useCallback((story: { storyId: number; storyTitle: string; storySlug: string; coverUrl: string; chapters: Chapter[] }) => {
        dispatch({ type: 'SET_STORY', payload: story });

        const progress = PlaybackPersistence.getProgress(story.storyId);
        if (progress) {
            dispatch({ type: 'SHOW_RESUME_TOAST', payload: progress });
            setTimeout(() => dispatch({ type: 'HIDE_RESUME_TOAST' }), 15000);
        }
    }, []);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (state.isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
    }, [state.isPlaying]);

    const play = useCallback(() => {
        audioRef.current?.play().catch(console.error);
    }, []);

    const pause = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = time;
            dispatch({ type: 'SET_CURRENT_TIME', payload: time });
        }
    }, []);

    const skip = useCallback((seconds: number) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = Math.min(Math.max(audio.currentTime + seconds, 0), state.duration);
            audio.currentTime = newTime;
            dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
        }
    }, [state.duration]);

    const setChapter = useCallback((chapter: number) => {
        dispatch({ type: 'SET_CHAPTER', payload: chapter });
        shouldAutoPlayRef.current = true;
    }, []);

    const setPlaybackRate = useCallback((rate: number) => {
        const audio = audioRef.current;
        if (audio) audio.playbackRate = rate;
        dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate });
    }, []);

    const setVolume = useCallback((volume: number) => {
        const audio = audioRef.current;
        if (audio) audio.volume = volume;
        dispatch({ type: 'SET_VOLUME', payload: volume });
    }, []);

    const toggleSpeedMenu = useCallback(() => {
        dispatch({ type: 'TOGGLE_SPEED_MENU' });
    }, []);

    const hideResumeToast = useCallback(() => {
        dispatch({ type: 'HIDE_RESUME_TOAST' });
    }, []);

    const handleResume = useCallback(() => {
        if (!state.resumeData) return;
        dispatch({ type: 'HIDE_RESUME_TOAST' });
        shouldAutoPlayRef.current = true;

        if (state.selectedChapter === state.resumeData.chapterNumber) {
            const audio = audioRef.current;
            if (audio) {
                audio.currentTime = state.resumeData.timestamp;
                audio.play().catch(console.error);
            }
        } else {
            dispatch({ type: 'SET_PENDING_SEEK', payload: state.resumeData.timestamp });
            setChapter(state.resumeData.chapterNumber);
        }
    }, [state.resumeData, state.selectedChapter, setChapter]);

    // Debounced save
    const debouncedSaveRef = useRef<(() => void) | null>(null);
    useEffect(() => {
        debouncedSaveRef.current = debounce(() => saveProgress(), 5000);
    }, [saveProgress]);

    const debouncedSaveProgress = useCallback(() => {
        debouncedSaveRef.current?.();
    }, []);

    // Save before page unload
    useEffect(() => {
        const handleBeforeUnload = () => saveProgress();
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [saveProgress]);

    // Audio element event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
            debouncedSaveProgress();
        };

        const handleLoadedMetadata = () => {
            dispatch({ type: 'SET_DURATION', payload: audio.duration });
            audio.playbackRate = state.playbackRate;
            audio.volume = state.volume;

            const currentPendingSeek = stateRef.current.pendingSeek;
            if (currentPendingSeek !== null) {
                audio.currentTime = currentPendingSeek;
                dispatch({ type: 'SET_CURRENT_TIME', payload: currentPendingSeek });
                dispatch({ type: 'SET_PENDING_SEEK', payload: null });
            }

            if (shouldAutoPlayRef.current) {
                audio.play().catch(console.error);
                shouldAutoPlayRef.current = false;
            }
        };

        const handleEnded = () => {
            if (state.selectedChapter < state.chapters.length) {
                setChapter(state.selectedChapter + 1);
            } else {
                dispatch({ type: 'SET_PLAYING', payload: false });
            }
        };

        const handlePlay = () => dispatch({ type: 'SET_PLAYING', payload: true });
        const handlePause = () => {
            dispatch({ type: 'SET_PLAYING', payload: false });
            saveProgress();
        };

        const handleError = (e: Event) => {
            console.error("Audio playback error:", audio.error, e);
            dispatch({ type: 'SET_PLAYING', payload: false });
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('error', handleError);
        };
    }, [state.chapters.length, state.selectedChapter, state.playbackRate, state.volume, setChapter, saveProgress, debouncedSaveProgress]);

    const value: AudioContextValue = {
        state,
        audioRef,
        setStory,
        togglePlay,
        play,
        pause,
        seek,
        skip,
        setChapter,
        setPlaybackRate,
        setVolume,
        toggleSpeedMenu,
        hideResumeToast,
        handleResume,
        formatTime,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
            <audio ref={audioRef} src={state.currentAudioUrl || undefined} preload="metadata" />
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
}
