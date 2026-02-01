import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, createMockAudioChapter } from '@/test/test-utils';
import AudioPlayer from './AudioPlayer';

describe('AudioPlayer Integration Tests', () => {
    const mockChapters = [
        createMockAudioChapter({ number: 1, title: 'Chương 1', audioUrl: '/audio/1.mp3' }),
        createMockAudioChapter({ number: 2, title: 'Chương ', audioUrl: '/audio/2.mp3' }),
        createMockAudioChapter({ number: 3, title: 'Chương 3', audioUrl: '/audio/3.mp3' }),
    ];

    const defaultProps = {
        storyId: 1,
        storyTitle: 'Test Story',
        storySlug: 'test-story',
        coverUrl: '/covers/test.jpg',
        chapters: mockChapters,
        currentChapter: 1,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all main player components together', () => {
        renderWithProviders(<AudioPlayer {...defaultProps} />);

        // Check main UI elements exist
        expect(screen.getByText(/nghe truyện/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument(); // Chapter selector
    });

    it('initializes with story data', () => {
        renderWithProviders(<AudioPlayer {...defaultProps} />);

        // Chapter selector should show current chapter
        const chapterSelect = screen.getByRole('combobox') as HTMLSelectElement;
        expect(chapterSelect.value).toBe('1');

        // Should have all chapters as options
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
    });

    it.skip('integrates playback controls', async () => {
        renderWithProviders(<AudioPlayer {...defaultProps} />);

        const playButton = screen.getByLabelText(/phát/i);

        // Click play button
        fireEvent.click(playButton);

        // Button label should change
        await waitFor(() => {
            expect(screen.getByLabelText(/tạm dừng/i)).toBeInTheDocument();
        });
    });

    it('handles chapter change via selector', () => {
        const onChapterChange = vi.fn();
        renderWithProviders(
            <AudioPlayer {...defaultProps} onChapterChange={onChapterChange} />
        );

        const chapterSelect = screen.getByRole('combobox');

        // Change chapter
        fireEvent.change(chapterSelect, { target: { value: '2' } });

        // Callback should be called
        expect(onChapterChange).toHaveBeenCalledWith(2);

        // Selector should update
        expect(chapterSelect).toHaveValue('2');
    });

    it('handles chapter navigation buttons', () => {
        const onChapterChange = vi.fn();
        renderWithProviders(
            <AudioPlayer {...defaultProps} onChapterChange={onChapterChange} currentChapter={2} />
        );

        // Find next chapter button
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons.find(btn => btn.getAttribute('aria-label')?.includes('sau'));

        if (nextButton) {
            fireEvent.click(nextButton);
            expect(onChapterChange).toHaveBeenCalledWith(3);
        }
    });

    it('disables navigation at boundaries', () => {
        renderWithProviders(<AudioPlayer {...defaultProps} currentChapter={1} />);

        const buttons = screen.getAllByRole('button');
        const prevButton = buttons.find(btn => btn.getAttribute('aria-label')?.includes('trước'));

        expect(prevButton).toBeDisabled();
    });

    it('integrates volume control', () => {
        renderWithProviders(<AudioPlayer {...defaultProps} />);

        const volumeSlider = screen.getByLabelText(/âm lượng/i);

        // Change volume
        fireEvent.change(volumeSlider, { target: { value: '0.5' } });

        // Volume should update
        expect(volumeSlider).toHaveValue('0.5');
    });

    it('integrates speed control', () => {
        renderWithProviders(<AudioPlayer {...defaultProps} />);

        // Find speed button
        const speedButton = screen.getByLabelText(/tốc độ phát/i);
        expect(speedButton).toHaveTextContent('1x');
    });

    it('shows all control buttons', () => {
        renderWithProviders(<AudioPlayer {...defaultProps} />);

        // Just verify buttons exist
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(5); // Play, prev, next, skip buttons, etc.
    });
});
