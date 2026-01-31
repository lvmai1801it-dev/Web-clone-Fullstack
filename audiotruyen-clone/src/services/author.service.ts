import axiosInstance from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types';
import { Author, Story } from '@/lib/types';

export const AuthorService = {
    /**
     * Get all authors
     * GET /public/authors
     */
    getAll: async (params?: Record<string, string | number>): Promise<ApiResponse<PaginatedResponse<Author>>> => {
        return axiosInstance.get('/public/authors', { params });
    },

    /**
     * Get author by slug
     * GET /public/authors/{slug}
     */
    getBySlug: async (slug: string): Promise<ApiResponse<Author>> => {
        return axiosInstance.get(`/public/authors/${slug}`);
    },

    /**
     * Get stories by author
     * GET /public/authors/{slug}/stories
     */
    getStoriesByAuthor: async (slug: string, page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Story>>> => {
        return axiosInstance.get(`/public/authors/${slug}/stories`, {
            params: { page, limit }
        });
    },

    // --- ADMIN METHODS ---

    /**
     * Save author (Create or Update)
     * POST /admin/authors
     */
    save: async (data: Partial<Author>): Promise<ApiResponse<Author>> => {
        return axiosInstance.post('/admin/authors', data);
    },

    /**
     * Bulk save authors
     * POST /admin/authors/batch
     */
    bulkSave: async (data: Partial<Author>[]): Promise<ApiResponse<Author[]>> => {
        return axiosInstance.post('/admin/authors/batch', data);
    },

    /**
     * Delete author
     * DELETE /admin/authors/{id}
     */
    delete: async (id: number): Promise<ApiResponse<void>> => {
        return axiosInstance.delete(`/admin/authors/${id}`);
    }
};
