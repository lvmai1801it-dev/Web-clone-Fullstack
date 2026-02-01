import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSearch } from './useSearch';
import { StoryService } from '@/services/story.service';

// Mock StoryService
vi.mock('@/services/story.service', () => ({
    StoryService: {
        search: vi.fn(),
    },
}));

describe('useSearch Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useSearch());

        expect(result.current.searchQuery).toBe('');
        expect(result.current.results).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.showDropdown).toBe(false);
    });

    it('should update searchQuery when setSearchQuery is called', () => {
        const { result } = renderHook(() => useSearch());

        act(() => {
            result.current.setSearchQuery('test');
        });

        expect(result.current.searchQuery).toBe('test');
    });

    it('should search after debounce duration', async () => {
        const mockResults = [{ id: 1, title: 'Test Story', slug: 'test-story' }];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (StoryService.search as any).mockResolvedValue({
            success: true,
            data: { items: mockResults }
        });

        const { result } = renderHook(() => useSearch());

        act(() => {
            result.current.setSearchQuery('test');
        });

        // Fast-forward time
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Wait for async effect
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(StoryService.search).toHaveBeenCalledWith('test');
        expect(result.current.results).toEqual(mockResults);
        expect(result.current.showDropdown).toBe(true);
    });

    it('should clear results when query is empty', async () => {
        const { result } = renderHook(() => useSearch());

        act(() => {
            result.current.setSearchQuery('');
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current.results).toEqual([]);
        expect(result.current.showDropdown).toBe(false);
        expect(StoryService.search).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (StoryService.search as any).mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useSearch());

        act(() => {
            result.current.setSearchQuery('error');
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.results).toEqual([]);
        consoleSpy.mockRestore();
    });

    it('should clear search state when clearSearch is called', () => {
        const { result } = renderHook(() => useSearch());

        // Set some state first
        act(() => {
            result.current.setSearchQuery('test');
        });

        act(() => {
            result.current.clearSearch();
        });

        expect(result.current.searchQuery).toBe('');
        expect(result.current.results).toEqual([]);
        expect(result.current.showDropdown).toBe(false);
    });
});
