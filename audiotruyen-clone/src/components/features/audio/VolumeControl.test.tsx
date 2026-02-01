import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VolumeControl } from './VolumeControl';

describe('VolumeControl', () => {
    const defaultProps = {
        volume: 0.8,
        onVolumeChange: vi.fn(),
    };

    it('renders volume slider', () => {
        render(<VolumeControl {...defaultProps} />);

        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('displays volume icon', () => {
        const { container } = render(<VolumeControl {...defaultProps} />);

        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('has correct slider attributes', () => {
        render(<VolumeControl {...defaultProps} />);

        const slider = screen.getByRole('slider');
        expect(slider).toHaveAttribute('min', '0');
        expect(slider).toHaveAttribute('max', '1');
        expect(slider).toHaveAttribute('step', '0.1');
        expect(slider).toHaveValue('0.8');
    });

    it('calls onVolumeChange when slider value changes', () => {
        const onVolumeChange = vi.fn();
        render(<VolumeControl {...defaultProps} onVolumeChange={onVolumeChange} />);

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '0.5' } });

        expect(onVolumeChange).toHaveBeenCalledWith(0.5);
    });

    it('has accessible label', () => {
        render(<VolumeControl {...defaultProps} />);

        expect(screen.getByLabelText(/âm lượng/i)).toBeInTheDocument();
    });

    it('reflects volume changes in slider value', () => {
        const { rerender } = render(<VolumeControl {...defaultProps} volume={0.3} />);

        expect(screen.getByRole('slider')).toHaveValue('0.3');

        rerender(<VolumeControl {...defaultProps} volume={1} />);
        expect(screen.getByRole('slider')).toHaveValue('1');
    });
});
