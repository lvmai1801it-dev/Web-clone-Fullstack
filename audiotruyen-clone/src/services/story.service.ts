import axiosInstance from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types';
import { Story } from '@/lib/types';

export const StoryService = {
    /**
     * Search stories by title (Public)
     * GET /public/stories?q=...
     */
    search: async (query: string, limit: number = 5): Promise<ApiResponse<{ items: Story[] }>> => {
        // Note: The backend returns: { success: true, message: "...", data: { items: [], pagination: {} } }
        // Our Axios interceptor unwraps 'data' from response? 
        // Wait, the interceptor returns response.data. 
        // If Backend returns { success: true, ... }, then 'response.data' IS that object.

        return axiosInstance.get('/public/stories', {
            params: {
                q: query,
                limit: limit
            }
        });
    },

    /**
     * Get list of stories with filters
     */
    getAll: async (params?: any): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get('/public/stories', { params });
    },

    /**
     * Get story detail by ID or Slug
     */
    getById: async (idOrSlug: string, withChapters: boolean = false): Promise<ApiResponse<Story>> => {
        return axiosInstance.get(`/public/stories/${idOrSlug}`, {
            params: {
                with_chapters: withChapters ? 1 : 0
            }
        });
    },

    /**
     * Get new stories (sorted by updated_at desc)
     */
    getNewStories: async (limit: number = 10, page: number = 1): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get('/public/stories', {
            params: {
                sort: 'updated_at',
                order: 'desc',
                limit,
                page
            }
        });
    },

    /**
     * Get completed stories
     */
    getCompletedStories: async (limit: number = 10, page: number = 1): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get('/public/stories', {
            params: {
                status: 'completed',
                limit,
                page
            }
        });
    },

    /**
     * Get hot stories (sorted by views desc)
     */
    getHotStories: async (limit: number = 10, page: number = 1): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get('/public/stories', {
            params: {
                sort: 'views',
                order: 'desc',
                limit,
                page
            }
        });
    }
};
