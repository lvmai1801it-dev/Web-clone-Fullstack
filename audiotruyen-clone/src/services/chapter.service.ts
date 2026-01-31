import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types';
import { Chapter } from '@/lib/types';

export const ChapterService = {
    /**
     * Get chapter by ID
     * GET /public/chapters/{id}
     */
    getById: async (id: number): Promise<ApiResponse<Chapter>> => {
        return axiosInstance.get(`/public/chapters/${id}`);
    },

    /**
     * Get chapter by story slug and number
     * GET /public/stories/{slug}/chapter/{number}
     */
    getByNumber: async (storySlug: string, number: number): Promise<ApiResponse<Chapter>> => {
        return axiosInstance.get(`/public/stories/${storySlug}/chapter/${number}`);
    },

    // --- ADMIN METHODS ---

    /**
     * Save chapter (Create or Update)
     * POST /admin/chapters/save
     */
    save: async (data: Partial<Chapter>): Promise<ApiResponse<Chapter>> => {
        return axiosInstance.post('/admin/chapters/save', data);
    },

    /**
     * Bulk save chapters
     * POST /admin/chapters/save (Send array)
     */
    bulkSave: async (data: Partial<Chapter>[]): Promise<ApiResponse<Chapter[]>> => {
        return axiosInstance.post('/admin/chapters/save', data);
    },

    /**
     * Delete chapter
     * DELETE /admin/chapters/{id}
     */
    delete: async (id: number): Promise<ApiResponse<void>> => {
        return axiosInstance.delete(`/admin/chapters/${id}`);
    }
};
