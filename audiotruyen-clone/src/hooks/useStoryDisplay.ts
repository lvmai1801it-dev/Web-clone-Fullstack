import { useMemo } from 'react';
import { Story } from '@/lib/types';

/**
 * Custom hook to encapsulate common story display logic.
 * 
 * This hook extracts shared presentation logic used by both `StoryCard` 
 * and `StoryListItem` components to avoid code duplication and ensure 
 * consistent story display formatting across the application.
 * 
 * @param story - The story object to process
 * @returns {Object} Display properties for the story
 * @returns {boolean} isCompleted - Whether the story is completed
 * @returns {string} progressText - Formatted progress text (e.g., "189 Chương" or "Chương 50")
 * @returns {Object} badges - Badge visibility flags
 * @returns {boolean} badges.showFull - Whether to show the "Full" badge
 * @returns {boolean} badges.showHot - Whether to show the "Hot" badge (views > 50k)
 * @returns {string} chapterDisplay - Compact chapter format for list items (e.g., "Full" or "C.50/100")
 * 
 * @example
 * ```tsx
 * const { progressText, badges, chapterDisplay } = useStoryDisplay(story);
 * 
 * // In StoryCard
 * {badges.showFull && <Badge variant="full">Full</Badge>}
 * 
 * // In StoryListItem
 * <span>{chapterDisplay}</span>
 * ```
 */
export function useStoryDisplay(story: Story) {
    return useMemo(() => {
        const isCompleted = story.status === 'completed';

        // Format progress text based on completion status
        const progressText = isCompleted
            ? `${story.total_chapters} Chương`
            : `Chương ${story.currentChapter || 0}`;

        // Determine which badges to show
        const badges = {
            showFull: isCompleted,
            showHot: story.views > 50000,
        };

        // Chapter display for list items
        const chapterDisplay = isCompleted
            ? 'Full'
            : `C.${story.currentChapter}/${story.total_chapters}`;

        return {
            isCompleted,
            progressText,
            badges,
            chapterDisplay,
        };
    }, [story.status, story.total_chapters, story.currentChapter, story.views]);
}
