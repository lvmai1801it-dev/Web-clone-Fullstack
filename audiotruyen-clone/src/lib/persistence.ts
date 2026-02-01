/**
 * Playback Persistence Utility
 * Manages saving and restoring listening progress in localStorage
 */

export interface PlaybackProgress {
    storyId: number;
    chapterId: number;
    chapterNumber: number;
    timestamp: number; // in seconds
    updatedAt: number; // Date.now()
    // Story metadata for MiniPlayer/FAB
    storyTitle?: string;
    storySlug?: string;
    coverUrl?: string;
}

const STORAGE_PREFIX = 'audiotruyen_progress_';
const LAST_PLAYED_KEY = 'audiotruyen_last_played';

export const PlaybackPersistence = {
    /**
     * Save progress for a specific story
     */
    saveProgress: (progress: Omit<PlaybackProgress, 'updatedAt'>): void => {
        if (typeof window === 'undefined') return;

        const data: PlaybackProgress = {
            ...progress,
            updatedAt: Date.now()
        };

        localStorage.setItem(`${STORAGE_PREFIX}${progress.storyId}`, JSON.stringify(data));

        // Also save as last played for MiniPlayer/FAB
        localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(data));
    },

    /**
     * Get saved progress for a story
     */
    getProgress: (storyId: number): PlaybackProgress | null => {
        if (typeof window === 'undefined') return null;

        const saved = localStorage.getItem(`${STORAGE_PREFIX}${storyId}`);
        if (!saved) return null;

        try {
            return JSON.parse(saved) as PlaybackProgress;
        } catch (e) {
            console.error('Failed to parse playback progress', e);
            return null;
        }
    },

    /**
     * Get the last played story for MiniPlayer/FAB
     */
    getLastPlayed: (): PlaybackProgress | null => {
        if (typeof window === 'undefined') return null;

        const saved = localStorage.getItem(LAST_PLAYED_KEY);
        if (!saved) return null;

        try {
            return JSON.parse(saved) as PlaybackProgress;
        } catch (e) {
            console.error('Failed to parse last played', e);
            return null;
        }
    },

    /**
     * Clear progress for a specific story or all progress
     */
    clearProgress: (storyId?: number): void => {
        if (typeof window === 'undefined') return;

        if (storyId) {
            localStorage.removeItem(`${STORAGE_PREFIX}${storyId}`);
        } else {
            // Clear all audiotruyen progress
            Object.keys(localStorage)
                .filter(key => key.startsWith(STORAGE_PREFIX))
                .forEach(key => localStorage.removeItem(key));
            localStorage.removeItem(LAST_PLAYED_KEY);
        }
    },

    /**
     * Get all stories with saved progress (optional - for a "History" page)
     */
    getAllProgress: (): PlaybackProgress[] => {
        if (typeof window === 'undefined') return [];

        return Object.keys(localStorage)
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .map(key => JSON.parse(localStorage.getItem(key) || '{}'))
            .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }
};

