/**
 * Centralized mock data exports for testing and development
 * All mock data should be imported from this single source of truth
 */

// Re-export consolidated mock data from mock-data.ts
export { mockStories, mockRanking, getStoryBySlug, searchStories } from './mock-data';

// Re-export test-specific mocks
export { mockStory, mockChapters } from './story.mock';
