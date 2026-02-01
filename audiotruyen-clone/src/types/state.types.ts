import { Story, Chapter, Category } from '../lib/types';

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: 'vi' | 'en';
    autoPlay: boolean;
    defaultQuality: 'low' | 'medium' | 'high';
    showChapterNotifications: boolean;
    downloadOnWiFi: boolean;
    playbackSpeed: number;
    volume: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    role?: string;
    preferences?: UserPreferences;
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
}

export interface AudioState {
    // Current playback
    currentStory: Story | null;
    isPlaying: boolean;
    isLoading: boolean;
    currentTime: number;
    duration: number;
    selectedChapter: number;
    playbackRate: number;
    volume: number;

    // Chapter management
    chapters: Chapter[];
    queue: Chapter[];

    // UI state
    showMiniPlayer: boolean;
    showVolumeControl: boolean;
    showSpeedControl: boolean;

    // History and progress
    playbackHistory: Array<{
        storyId: number;
        chapterNumber: number;
        timestamp: number;
        updatedAt: number;
    }>;
    recentlyPlayed: Story[];
    continueListening: {
        storyId: number;
        chapterNumber: number;
        timestamp: number;
    } | null;
}

export interface LibraryState {
    favorites: Story[];
    downloads: Story[];
    continueReading: Story[];
    playlists: Array<{
        id: string;
        name: string;
        stories: Story[];
    }>;
    categories: Category[];
}

export interface AppState {
    isOnline: boolean;
    isLoading: boolean;
    error: string | null;
    notifications: Notification[];
    showMobileMenu: boolean;
    showSearchDropdown: boolean;
    searchQuery: string;
    searchResults: Story[];
    user: User | null;
}

export interface GlobalState {
    user: User | null;
    audio: AudioState;
    library: LibraryState;
    app: AppState;
}
