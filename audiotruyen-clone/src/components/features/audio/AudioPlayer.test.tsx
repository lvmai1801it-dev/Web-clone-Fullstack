import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AudioPlayer from './AudioPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { mockStory, mockChapters } from '@/test/mocks/story.mock';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Helper to render with Provider
const renderAudioPlayer = (props = {}) => {
    return render(
        <AudioProvider>
            <AudioPlayer
                storyId={mockStory.id}
                storyTitle={mockStory.title}
                storySlug={mockStory.slug}
                coverUrl={mockStory.cover_url}
                chapters={mockChapters} // Use the locally defined mockChapters
                currentChapter={1}
                {...props}
            />
        </AudioProvider>
    );
};

describe('AudioPlayer', () => {
    // Mock HTMLMediaElement.prototype.play and pause
    beforeEach(() => {
        window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(function (this: HTMLMediaElement) {
            this.dispatchEvent(new Event('play'));
            return Promise.resolve();
        });
        window.HTMLMediaElement.prototype.pause = vi.fn().mockImplementation(function (this: HTMLMediaElement) {
            this.dispatchEvent(new Event('pause'));
        });
        window.HTMLMediaElement.prototype.load = vi.fn();
    });

    it('renders correctly with title', () => {
        const customTitle = 'Custom Audio Title';
        renderAudioPlayer({ title: customTitle });
        expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('shows play button initially', () => {
        renderAudioPlayer();
        const playButton = screen.getByRole('button', { name: /^phát$/i });
        expect(playButton).toBeInTheDocument();
    });

    it('toggles playback when play button is clicked', async () => {
        renderAudioPlayer();
        const playButton = screen.getByRole('button', { name: /^phát$/i });

        fireEvent.click(playButton);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /tạm dừng/i })).toBeInTheDocument();
        });
    });

    it('changes chapter when chapter selector is used', async () => {
        const onChapterChange = vi.fn();
        renderAudioPlayer({ onChapterChange });

        // Open chapter selector
        const selector = screen.getByRole('combobox');
        fireEvent.change(selector, { target: { value: '2' } });

        expect(onChapterChange).toHaveBeenCalledWith(2);
    });

    it('displays correct chapter title', () => {
        renderAudioPlayer();
        expect(screen.getByText(/chương 1/i)).toBeInTheDocument();
    });
});
