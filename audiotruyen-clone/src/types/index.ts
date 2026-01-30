export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedResponse<T> {
    items: T[]; // The actual array of items
    pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
        has_more: boolean;
    };
}
