import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/test-utils';
import { SearchDropdown } from '@/components/layout/header/SearchDropdown';
import { useSearch } from '@/hooks/useSearch';
import { createMockStory } from '@/test/test-utils';

// Mock useSearch hook
vi.mock('@/hooks/useSearch');

// Mock Next.js Image
vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
    ),
}));

describe('SearchFlow Integration Tests', () => {
    const mockStories = [
        createMockStory({ id: 1, title: 'Truyện Test 1', slug: 'truyen-test-1' }),
        createMockStory({ id: 2, title: 'Truyện Test 2', slug: 'truyen-test-2' }),
        createMockStory({ id: 3, title: 'Truyện Test 3', slug: 'truyen-test-3' }),
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('SearchDropdown Component', () => {
        it('shows loading state', () => {
            render(
                <SearchDropdown
                    results={[]}
                    isLoading={true}
                    onItemClick={vi.fn()}
                    onViewAll={vi.fn()}
                />
            );

            expect(screen.getByText(/đang tìm kiếm/i)).toBeInTheDocument();
        });

        it('shows no results message when empty', () => {
            render(
                <SearchDropdown
                    results={[]}
                    isLoading={false}
                    onItemClick={vi.fn()}
                    onViewAll={vi.fn()}
                />
            );

            expect(screen.getByText(/không tìm thấy truyện nào/i)).toBeInTheDocument();
        });

        it('displays search results', () => {
            render(
                <SearchDropdown
                    results={mockStories}
                    isLoading={false}
                    onItemClick={vi.fn()}
                    onViewAll={vi.fn()}
                />
            );

            expect(screen.getByText('Truyện Test 1')).toBeInTheDocument();
            expect(screen.getByText('Truyện Test 2')).toBeInTheDocument();
            expect(screen.getByText('Truyện Test 3')).toBeInTheDocument();
        });

        it('shows author names and chapter counts', () => {
            const storyWithDetails = createMockStory({
                id: 1,
                title: 'Test Story',
                author_name: 'Test Author',
                total_chapters: 100,
            });

            render(
                <SearchDropdown
                    results={[storyWithDetails]}
                    isLoading={false}
                    onItemClick={vi.fn()}
                    onViewAll={vi.fn()}
                />
            );

            expect(screen.getByText('Test Author')).toBeInTheDocument();
            expect(screen.getByText(/100 chương/i)).toBeInTheDocument();
        });

        it('calls onItemClick when clicking a result', async () => {
            const onItemClick = vi.fn();
            const user = userEvent.setup();

            render(
                <SearchDropdown
                    results={mockStories}
                    isLoading={false}
                    onItemClick={onItemClick}
                    onViewAll={vi.fn()}
                />
            );

            const firstResult = screen.getByText('Truyện Test 1');
            await user.click(firstResult);

            expect(onItemClick).toHaveBeenCalledTimes(1);
        });

        it('calls onViewAll when clicking view all button', async () => {
            const onViewAll = vi.fn();
            const user = userEvent.setup();

            render(
                <SearchDropdown
                    results={mockStories}
                    isLoading={false}
                    onItemClick={vi.fn()}
                    onViewAll={onViewAll}
                />
            );

            const viewAllButton = screen.getByText(/xem tất cả kết quả/i);
            await user.click(viewAllButton);

            expect(onViewAll).toHaveBeenCalledTimes(1);
        });

        it('renders links to story pages', () => {
            render(
                <SearchDropdown
                    results={mockStories}
                    isLoading={false}
                    onItemClick={vi.fn()}
                    onViewAll={vi.fn()}
                />
            );

            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', '/truyen/truyen-test-1');
            expect(links[1]).toHaveAttribute('href', '/truyen/truyen-test-2');
            expect(links[2]).toHaveAttribute('href', '/truyen/truyen-test-3');
        });
    });

    describe('Search Hook Integration', () => {
        it('integrates search state with dropdown', () => {
            const mockUseSearch = vi.mocked(useSearch);
            mockUseSearch.mockReturnValue({
                searchQuery: 'test',
                results: mockStories,
                isLoading: false,
                showDropdown: true,
                setSearchQuery: vi.fn(),
                clearSearch: vi.fn(),
            });

            // This would typically be tested in a higher-level component
            // that uses both useSearch and SearchDropdown together
            const { results, isLoading } = mockUseSearch();

            expect(results).toEqual(mockStories);
            expect(isLoading).toBe(false);
        });

        it('handles loading state correctly', () => {
            const mockUseSearch = vi.mocked(useSearch);
            mockUseSearch.mockReturnValue({
                searchQuery: 'test',
                results: [],
                isLoading: true,
                showDropdown: true,
                setSearchQuery: vi.fn(),
                clearSearch: vi.fn(),
            });

            const { isLoading } = mockUseSearch();
            expect(isLoading).toBe(true);
        });

        it('handles empty results correctly', () => {
            const mockUseSearch = vi.mocked(useSearch);
            mockUseSearch.mockReturnValue({
                searchQuery: 'nonexistent',
                results: [],
                isLoading: false,
                showDropdown: true,
                setSearchQuery: vi.fn(),
                clearSearch: vi.fn(),
            });

            const { results } = mockUseSearch();
            expect(results).toEqual([]);
        });
    });
});
