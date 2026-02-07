import { StoryService } from './story.service';
import { RankingItem } from '@/lib/types';

/**
 * RankingService
 * Provides ranking data by leveraging StoryService.getHotStories()
 * and formatting the response into RankingItem[] format
 */
export const RankingService = {
    /**
     * Get top stories by views (ranking)
     * Returns array of RankingItem with rank property
     */
    getTopStories: async (limit: number = 10): Promise<RankingItem[]> => {
        const response = await StoryService.getHotStories(limit);

        if (!response.success || !response.data) {
            return [];
        }

        return response.data.items.map((story, index) => ({
            rank: index + 1,
            story,
        }));
    },
};
