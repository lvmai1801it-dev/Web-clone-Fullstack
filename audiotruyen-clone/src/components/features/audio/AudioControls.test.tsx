import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioControls } from './AudioControls';

describe('AudioControls', () => {
    const defaultProps = {
        isPlaying: false,
        canGoPrev: true,
        canGoNext: true,
        onTogglePlay: vi.fn(),
        onSkip: vi.fn(),
        onPrevChapter: vi.fn(),
        onNextChapter: vi.fn(),
    };

    it('renders all control buttons', () => {
        render(<AudioControls {...defaultProps} />);

        expect(screen.getByRole('button', { name: /chương trước/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /tua lại 10 giây/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /phát/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /tua đi 10 giây/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /chương sau/i })).toBeInTheDocument();
    });

    it('shows pause button when playing', () => {
        render(<AudioControls {...defaultProps} isPlaying={true} />);

        expect(screen.getByRole('button', { name: /tạm dừng/i })).toBeInTheDocument();
    });

    it('shows play button when paused', () => {
        render(<AudioControls {...defaultProps} isPlaying={false} />);

        expect(screen.getByRole('button', { name: /phát/i })).toBeInTheDocument();
    });

    it('calls onTogglePlay when play/pause button is clicked', () => {
        const onTogglePlay = vi.fn();
        render(<AudioControls {...defaultProps} onTogglePlay={onTogglePlay} />);

        fireEvent.click(screen.getByRole('button', { name: /phát/i }));
        expect(onTogglePlay).toHaveBeenCalledTimes(1);
    });

    it('calls onSkip with -10 when rewind button is clicked', () => {
        const onSkip = vi.fn();
        render(<AudioControls {...defaultProps} onSkip={onSkip} />);

        fireEvent.click(screen.getByRole('button', { name: /tua lại 10 giây/i }));
        expect(onSkip).toHaveBeenCalledWith(-10);
    });

    it('calls onSkip with 10 when forward button is clicked', () => {
        const onSkip = vi.fn();
        render(<AudioControls {...defaultProps} onSkip={onSkip} />);

        fireEvent.click(screen.getByRole('button', { name: /tua đi 10 giây/i }));
        expect(onSkip).toHaveBeenCalledWith(10);
    });

    it('calls onPrevChapter when prev button is clicked', () => {
        const onPrevChapter = vi.fn();
        render(<AudioControls {...defaultProps} onPrevChapter={onPrevChapter} />);

        fireEvent.click(screen.getByRole('button', { name: /chương trước/i }));
        expect(onPrevChapter).toHaveBeenCalledTimes(1);
    });

    it('calls onNextChapter when next button is clicked', () => {
        const onNextChapter = vi.fn();
        render(<AudioControls {...defaultProps} onNextChapter={onNextChapter} />);

        fireEvent.click(screen.getByRole('button', { name: /chương sau/i }));
        expect(onNextChapter).toHaveBeenCalledTimes(1);
    });

    it('disables prev button when canGoPrev is false', () => {
        render(<AudioControls {...defaultProps} canGoPrev={false} />);

        const prevButton = screen.getByRole('button', { name: /chương trước/i });
        expect(prevButton).toBeDisabled();
    });

    it('disables next button when canGoNext is false', () => {
        render(<AudioControls {...defaultProps} canGoNext={false} />);

        const nextButton = screen.getByRole('button', { name: /chương sau/i });
        expect(nextButton).toBeDisabled();
    });
});
