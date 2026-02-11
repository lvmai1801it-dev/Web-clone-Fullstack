import { PlaybackProgress } from '@/lib/persistence';
import { Chapter as APIChapter } from '@/lib/types';

// Internal Chapter type for AudioContext (uses camelCase for consistency with UI)
export interface Chapter {
    number: number;
    title: string;
    audioUrl: string;
}

/**
 * Converts an API Chapter object to the UI Chapter format.
 * Bridges snake_case (API) → camelCase (UI).
 */
export function toUIChapter(apiChapter: APIChapter): Chapter {
    return {
        number: apiChapter.number,
        title: apiChapter.title,
        audioUrl: apiChapter.audio_url
    };
}

export interface AudioState {
    storyId: number | null;
    storyTitle: string;
    storySlug: string;
    coverUrl: string;
    chapters: Chapter[];

    isPlaying: boolean;
    currentTime: number;
    duration: number;
    selectedChapter: number;
    currentAudioUrl: string;
    playbackRate: number;
    volume: number;

    isSpeedMenuOpen: boolean;
    showResumeToast: boolean;
    resumeData: PlaybackProgress | null;
    pendingSeek: number | null;
}

export type AudioAction =
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
    | { type: 'SET_PENDING_SEEK'; payload: number | null }
    | { type: 'RESET' };

export interface AudioContextValue {
    state: AudioState;
    audioRef: React.RefObject<HTMLAudioElement | null>;

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
    formatTime: (time: number) => string;
}
