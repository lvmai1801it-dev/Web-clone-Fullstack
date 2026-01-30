import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types'; // Import from src/types/index.ts (PaginatedResponse is there too)
import { Category } from '@/lib/types';

export const CategoryService = {
    /**
     * Get all categories
     * GET /public/categories
     */
    getAll: async (): Promise<ApiResponse<Category[]>> => {
        return axiosInstance.get('/public/categories');
    },

    /**
     * Get category by slug
     * GET /public/categories/{slug}
     */
    getBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
        return axiosInstance.get(`/public/categories`);
    }
};
