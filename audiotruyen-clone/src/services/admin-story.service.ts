import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types';
import { Story } from '@/lib/types';

/**
 * Admin-only story operations.
 * These require authentication and should not be used in public-facing pages.
 */
export const AdminStoryService = {
    /**
     * Save story (Create or Update)
     * POST /admin/stories/save
     */
    save: async (data: Partial<Story> & { category_ids?: number[] }): Promise<ApiResponse<Story>> => {
        return axiosInstance.post('/admin/stories/save', data) as Promise<ApiResponse<Story>>;
    },

    /**
     * Bulk save stories
     * POST /admin/stories/save (Send array)
     */
    bulkSave: async (data: (Partial<Story> & { category_ids?: number[] })[]): Promise<ApiResponse<Story[]>> => {
        return axiosInstance.post('/admin/stories/save', data) as Promise<ApiResponse<Story[]>>;
    },

    /**
     * Delete story
     * DELETE /admin/stories/{id}
     */
    delete: async (id: number): Promise<ApiResponse<void>> => {
        return axiosInstance.delete(`/admin/stories/${id}`) as Promise<ApiResponse<void>>;
    }
};
