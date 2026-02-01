import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpeedControl } from './SpeedControl';

describe('SpeedControl', () => {
    const defaultProps = {
        playbackRate: 1,
        isOpen: false,
        onToggle: vi.fn(),
        onSpeedChange: vi.fn(),
    };

    it('renders speed button with current rate', () => {
        render(<SpeedControl {...defaultProps} />);

        expect(screen.getByRole('button', { name: /tốc độ phát: 1x/i })).toBeInTheDocument();
        expect(screen.getByText('1x')).toBeInTheDocument();
    });

    it('displays different playback rates', () => {
        render(<SpeedControl {...defaultProps} playbackRate={1.5} />);

        expect(screen.getByText('1.5x')).toBeInTheDocument();
    });

    it('calls onToggle when button is clicked', () => {
        const onToggle = vi.fn();
        render(<SpeedControl {...defaultProps} onToggle={onToggle} />);

        fireEvent.click(screen.getByRole('button', { name: /tốc độ phát/i }));
        expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('does not show menu when closed', () => {
        render(<SpeedControl {...defaultProps} isOpen={false} />);

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('shows menu with speed options when open', () => {
        render(<SpeedControl {...defaultProps} isOpen={true} />);

        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getAllByRole('menuitem')).toHaveLength(6);
        expect(screen.getByText('0.75x')).toBeInTheDocument();
        expect(screen.getByText('2x')).toBeInTheDocument();
    });

    it('calls onSpeedChange when speed option is clicked', () => {
        const onSpeedChange = vi.fn();
        render(<SpeedControl {...defaultProps} isOpen={true} onSpeedChange={onSpeedChange} />);

        fireEvent.click(screen.getByText('1.5x'));
        expect(onSpeedChange).toHaveBeenCalledWith(1.5);
    });

    it('has aria-expanded attribute', () => {
        const { rerender } = render(<SpeedControl {...defaultProps} isOpen={false} />);

        expect(screen.getByRole('button', { name: /tốc độ phát/i })).toHaveAttribute('aria-expanded', 'false');

        rerender(<SpeedControl {...defaultProps} isOpen={true} />);
        expect(screen.getByRole('button', { name: /tốc độ phát/i })).toHaveAttribute('aria-expanded', 'true');
    });

    it('highlights current speed in menu', () => {
        render(<SpeedControl {...defaultProps} isOpen={true} playbackRate={1.25} />);

        const menuItems = screen.getAllByRole('menuitem');
        const selectedItem = menuItems.find((item) => item.textContent === '1.25x');
        expect(selectedItem).toHaveClass('font-bold');
    });
});
