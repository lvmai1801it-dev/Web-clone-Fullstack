import axiosInstance from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types';
import { Story, Chapter } from '@/lib/types';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getFromCache = <T>(key: string): T | null => {
    const item = cache.get(key);
    if (item && Date.now() < item.expiry) {
        return item.data as T;
    }
    return null;
};

const setCache = <T>(key: string, data: T) => {
    cache.set(key, {
        data,
        expiry: Date.now() + CACHE_DURATION
    });
};

export const StoryService = {
    /**
     * Search stories by title (Public)
     * GET /public/stories?q=...
     */
    search: async (query: string, limit: number = 5): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get('/public/stories', {
            params: {
                q: query,
                limit: limit
            }
        }) as Promise<ApiResponse<PaginatedResponse<Story>>>;
    },

    /**
     * Get list of stories with filters
     */
    getAll: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get('/public/stories', { params }) as Promise<ApiResponse<PaginatedResponse<Story>>>;
    },

    /**
     * Get story detail by ID or Slug
     */
    getById: async (idOrSlug: string, withChapters: boolean = false): Promise<ApiResponse<Story>> => {
        const cacheKey = `story_${idOrSlug}_${withChapters}`;
        const cached = getFromCache<ApiResponse<Story>>(cacheKey);
        if (cached) return cached;

        const response = await axiosInstance.get(`/public/stories/${idOrSlug}`, {
            params: {
                with_chapters: withChapters ? 1 : 0
            }
        }) as ApiResponse<Story>;

        if (response.success) setCache(cacheKey, response);
        return response;
    },

    /**
     * Get new stories (sorted by updated_at desc)
     */
    getNewStories: async (limit: number = 10, page: number = 1): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        const cacheKey = `new_stories_${limit}_${page}`;
        const cached = getFromCache<ApiResponse<PaginatedResponse<Story>>>(cacheKey);
        if (cached) return cached;

        const response = await axiosInstance.get('/public/stories', {
            params: {
                sort: 'updated_at',
                order: 'desc',
                limit,
                page
            }
        }) as ApiResponse<PaginatedResponse<Story>>;

        if (response.success) setCache(cacheKey, response);
        return response;
    },

    /**
     * Get completed stories
     */
    getCompletedStories: async (limit: number = 10, page: number = 1): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        const cacheKey = `completed_stories_${limit}_${page}`;
        const cached = getFromCache<ApiResponse<PaginatedResponse<Story>>>(cacheKey);
        if (cached) return cached;

        const response = await axiosInstance.get('/public/stories', {
            params: {
                status: 'completed',
                limit,
                page
            }
        }) as ApiResponse<PaginatedResponse<Story>>;

        if (response.success) setCache(cacheKey, response);
        return response;
    },

    /**
     * Get hot stories (sorted by views desc)
     */
    getHotStories: async (limit: number = 10, page: number = 1): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        const cacheKey = `hot_stories_${limit}_${page}`;
        const cached = getFromCache<ApiResponse<PaginatedResponse<Story>>>(cacheKey);
        if (cached) return cached;

        const response = await axiosInstance.get('/public/stories', {
            params: {
                sort: 'views',
                order: 'desc',
                limit,
                page
            }
        }) as ApiResponse<PaginatedResponse<Story>>;

        if (response.success) setCache(cacheKey, response);
        return response;
    },

    /**
     * Get chapters of a story
     * GET /public/stories/{id}/chapters
     */
    getChapters: async (storyId: number, page: number = 1, limit: number = 50): Promise<ApiResponse<PaginatedResponse<Chapter>>> => {
        const cacheKey = `chapters_${storyId}_${page}_${limit}`;
        const cached = getFromCache<ApiResponse<PaginatedResponse<Chapter>>>(cacheKey);
        if (cached) return cached;

        const response = await axiosInstance.get(`/public/stories/${storyId}/chapters`, {
            params: { page, limit }
        }) as ApiResponse<PaginatedResponse<Chapter>>;

        if (response.success) setCache(cacheKey, response);
        return response;
    },

    /**
     * Increment story view count
     * POST /public/stories/{id}/click
     */
    incrementViews: async (storyId: number): Promise<ApiResponse<void>> => {
        return axiosInstance.post(`/public/stories/${storyId}/click`) as Promise<ApiResponse<void>>;
    },

    // --- ADMIN METHODS ---

    /**
     * Save story (Create or Update)
     * POST /admin/stories/save
     * Supports category_ids array
     */
    save: async (data: Partial<Story> & { category_ids?: number[] }): Promise<ApiResponse<Story>> => {
        cache.clear(); // Clear cache on update
        return axiosInstance.post('/admin/stories/save', data) as Promise<ApiResponse<Story>>;
    },

    /**
     * Bulk save stories
     * POST /admin/stories/save (Send array)
     */
    bulkSave: async (data: (Partial<Story> & { category_ids?: number[] })[]): Promise<ApiResponse<Story[]>> => {
        cache.clear(); // Clear cache on update
        return axiosInstance.post('/admin/stories/save', data) as Promise<ApiResponse<Story[]>>;
    },

    /**
     * Delete story
     * DELETE /admin/stories/{id}
     */
    delete: async (id: number): Promise<ApiResponse<void>> => {
        cache.clear(); // Clear cache on delete
        return axiosInstance.delete(`/admin/stories/${id}`) as Promise<ApiResponse<void>>;
    }
};
