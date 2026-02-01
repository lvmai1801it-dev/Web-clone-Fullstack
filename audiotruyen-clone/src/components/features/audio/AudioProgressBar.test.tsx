import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioProgressBar } from './AudioProgressBar';

describe('AudioProgressBar', () => {
    const mockFormatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const defaultProps = {
        currentTime: 60,
        duration: 300,
        onSeek: vi.fn(),
        formatTime: mockFormatTime,
    };

    it('renders the progress bar', () => {
        render(<AudioProgressBar {...defaultProps} />);

        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('displays current time and duration', () => {
        render(<AudioProgressBar {...defaultProps} />);

        expect(screen.getByText('1:00')).toBeInTheDocument(); // currentTime = 60s
        expect(screen.getByText('5:00')).toBeInTheDocument(); // duration = 300s
    });

    it('has correct slider attributes', () => {
        render(<AudioProgressBar {...defaultProps} />);

        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('min', '0');
        expect(slider).toHaveAttribute('max', '300');
        expect(slider).toHaveValue('60');
    });

    it('calls onSeek when slider value changes', () => {
        const onSeek = vi.fn();
        render(<AudioProgressBar {...defaultProps} onSeek={onSeek} />);

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '120' } });

        expect(onSeek).toHaveBeenCalledWith(120);
    });

    it('handles zero duration gracefully', () => {
        render(<AudioProgressBar {...defaultProps} duration={0} />);

        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('max', '100'); // Falls back to 100
    });

    it('has accessible label', () => {
        render(<AudioProgressBar {...defaultProps} />);

        expect(screen.getByLabelText(/thanh tiến trình audio/i)).toBeInTheDocument();
    });
});
