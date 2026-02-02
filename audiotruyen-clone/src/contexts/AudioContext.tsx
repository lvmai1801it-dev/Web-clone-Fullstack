'use client';

import { createContext, useContext, useReducer, useRef, useCallback, ReactNode, useEffect } from 'react';
import { PlaybackPersistence, PlaybackProgress } from '@/lib/persistence';
import { debounce } from '@/lib/utils';
import { Chapter as APIChapter } from '@/lib/types';

// === Types ===
// Internal Chapter type for AudioContext (uses camelCase for consistency with UI)
export interface Chapter {
    number: number;
    title: string;
    audioUrl: string;
}

/**
 * Converts an API Chapter object to the UI Chapter format.
 * 
 * This helper bridges the naming convention gap between the backend API
 * (snake_case: `audio_url`) and the frontend UI (camelCase: `audioUrl`).
 * 
 * @param apiChapter - Chapter object from the API with snake_case properties
 * @returns Chapter object formatted for UI consumption with camelCase properties
 * 
 * @example
 * ```tsx
 * const apiChapters = await fetchChapters(storyId);
 * const uiChapters = apiChapters.map(toUIChapter);
 * setStory({ ...storyData, chapters: uiChapters });
 * ```
 */
export function toUIChapter(apiChapter: APIChapter): Chapter {
    return {
        number: apiChapter.number,
        title: apiChapter.title,
        audioUrl: apiChapter.audio_url
    };
}

export interface AudioState {
    // Story info
    storyId: number | null;
    storyTitle: string;
    storySlug: string;
    coverUrl: string;
    chapters: Chapter[];

    // Playback state
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    selectedChapter: number;
    currentAudioUrl: string;
    playbackRate: number;
    volume: number;

    // UI state
    isSpeedMenuOpen: boolean;
    showResumeToast: boolean;
    resumeData: PlaybackProgress | null;
}

type AudioAction =
    | { type: 'SET_STORY'; payload: { storyId: number; storyTitle: string; storySlug: string; coverUrl: string; chapters: Chapter[] } }
    | { type: 'SET_PLAYING'; payload: boolean }
    | { type: 'SET_CURRENT_TIME'; payload: number }
    | { type: 'SET_DURATION'; payload: number }
    | { type: 'SET_CHAPTER'; payload: number }
    | { type: 'SET_PLAYBACK_RATE'; payload: number }
    | { type: 'SET_VOLUME'; payload: number }
    | { type: 'TOGGLE_SPEED_MENU' }
    | { type: 'SHOW_RESUME_TOAST'; payload: PlaybackProgress }
    | { type: 'HIDE_RESUME_TOAST' }
    | { type: 'RESET' };

// === Initial State ===
const initialState: AudioState = {
    storyId: null,
    storyTitle: '',
    storySlug: '',
    coverUrl: '',
    chapters: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    selectedChapter: 1,
    currentAudioUrl: '',
    playbackRate: 1,
    volume: 1,
    isSpeedMenuOpen: false,
    showResumeToast: false,
    resumeData: null,
};

// === Reducer ===
function audioReducer(state: AudioState, action: AudioAction): AudioState {
    switch (action.type) {
        case 'SET_STORY':
            return { ...state, ...action.payload, selectedChapter: 1, currentAudioUrl: action.payload.chapters[0]?.audioUrl || '' };
        case 'SET_PLAYING':
            return { ...state, isPlaying: action.payload };
        case 'SET_CURRENT_TIME':
            return { ...state, currentTime: action.payload };
        case 'SET_DURATION':
            return { ...state, duration: action.payload };
        case 'SET_CHAPTER':
            const chapter = action.payload;
            const newUrl = state.chapters.find(c => c.number === chapter)?.audioUrl || '';
            return { ...state, selectedChapter: chapter, currentAudioUrl: newUrl };
        case 'SET_PLAYBACK_RATE':
            return { ...state, playbackRate: action.payload, isSpeedMenuOpen: false };
        case 'SET_VOLUME':
            return { ...state, volume: action.payload };
        case 'TOGGLE_SPEED_MENU':
            return { ...state, isSpeedMenuOpen: !state.isSpeedMenuOpen };
        case 'SHOW_RESUME_TOAST':
            return { ...state, showResumeToast: true, resumeData: action.payload };
        case 'HIDE_RESUME_TOAST':
            return { ...state, showResumeToast: false };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

// === Context ===
interface AudioContextValue {
    state: AudioState;
    audioRef: React.RefObject<HTMLAudioElement | null>;

    // Actions
    setStory: (story: { storyId: number; storyTitle: string; storySlug: string; coverUrl: string; chapters: Chapter[] }) => void;
    togglePlay: () => void;
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    skip: (seconds: number) => void;
    setChapter: (chapter: number) => void;
    setPlaybackRate: (rate: number) => void;
    setVolume: (volume: number) => void;
    toggleSpeedMenu: () => void;
    hideResumeToast: () => void;
    handleResume: () => void;

    // Utils
    formatTime: (time: number) => string;
}

const AudioContext = createContext<AudioContextValue | null>(null);

// === Provider ===
export function AudioProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(audioReducer, initialState);
    const audioRef = useRef<HTMLAudioElement>(null);
    const shouldAutoPlayRef = useRef(false);

    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const saveProgress = useCallback(() => {
        if (!state.storyId || !audioRef.current || audioRef.current.currentTime < 5) return;

        PlaybackPersistence.saveProgress({
            storyId: state.storyId,
            chapterId: 0,
            chapterNumber: state.selectedChapter,
            timestamp: audioRef.current.currentTime,
            storyTitle: state.storyTitle,
            storySlug: state.storySlug,
            coverUrl: state.coverUrl,
        });
    }, [state.storyId, state.selectedChapter, state.storyTitle, state.storySlug, state.coverUrl]);

    const setStory = useCallback((story: { storyId: number; storyTitle: string; storySlug: string; coverUrl: string; chapters: Chapter[] }) => {
        dispatch({ type: 'SET_STORY', payload: story });

        const progress = PlaybackPersistence.getProgress(story.storyId);
        if (progress && (progress.chapterNumber > 1 || progress.timestamp > 10)) {
            setTimeout(() => dispatch({ type: 'SHOW_RESUME_TOAST', payload: progress }), 0);
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
            setChapter(state.resumeData.chapterNumber);
        }
    }, [state.resumeData, state.selectedChapter, setChapter]);

    // Create stable debounced save function using a ref to avoid reading refs during render
    const debouncedSaveRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        debouncedSaveRef.current = debounce(() => {
            saveProgress();
        }, 5000);
    }, [saveProgress]);

    const debouncedSaveProgress = useCallback(() => {
        debouncedSaveRef.current?.();
    }, []);

    // === Effects for Audio Events ===
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

        const handlePlayForContext = () => dispatch({ type: 'SET_PLAYING', payload: true });
        const handlePauseForContext = () => {
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
        audio.addEventListener('play', handlePlayForContext);
        audio.addEventListener('pause', handlePauseForContext);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlayForContext);
            audio.removeEventListener('pause', handlePauseForContext);
            audio.removeEventListener('error', handleError);
        };
    }, [state.chapters.length, state.selectedChapter, state.playbackRate, state.volume, setChapter, saveProgress, debouncedSaveProgress]);

    // Clean up debounce on unmount is handled by the fact that it's just a function closure, 
    // but we can't easily cancel it with this simple implementation. 
    // Ideally we'd valid check inside saveProgress if mounted/playing.

    // Removed setInterval effect

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
            {/* Global Audio Element */}
            <audio ref={audioRef} src={state.currentAudioUrl || undefined} preload="metadata" />
        </AudioContext.Provider>
    );
}

// === Hook ===
export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
}
