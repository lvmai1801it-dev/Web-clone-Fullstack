import axiosInstance from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types'; // Import from src/types/index.ts
import { Category, Story } from '@/lib/types';

export const CategoryService = {
    /**
     * Get all categories
     * GET /public/categories
     */
    getAll: async (): Promise<ApiResponse<PaginatedResponse<Category>>> => {
        return axiosInstance.get('/public/categories');
    },

    /**
     * Get category by slug
     * GET /public/categories/{slug}
     */
    getBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
        return axiosInstance.get(`/public/categories/${slug}`);
    },

    /**
     * Get stories in a category
     * GET /public/categories/{slug}/stories
     */
    getStoriesByCategory: async (slug: string, page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get(`/public/categories/${slug}/stories`, {
            params: { page, limit }
        });
    },

    // --- ADMIN METHODS ---

    /**
     * Save category (Create or Update)
     * POST /admin/categories
     */
    save: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
        return axiosInstance.post('/admin/categories', data);
    },

    /**
     * Bulk save categories
     * POST /admin/categories/batch
     */
    bulkSave: async (data: Partial<Category>[]): Promise<ApiResponse<Category[]>> => {
        return axiosInstance.post('/admin/categories/batch', data);
    },

    /**
     * Delete category
     * DELETE /admin/categories/{id}
     */
    delete: async (id: number): Promise<ApiResponse<void>> => {
        return axiosInstance.delete(`/admin/categories/${id}`);
    }
};
