import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeedControl } from './SpeedControl';

describe('SpeedControl', () => {
    const defaultProps = {
        playbackRate: 1,
        onSpeedChange: vi.fn(),
    };

    // Mock ResizeObserver for Radix UI
    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            observe() { }
            unobserve() { }
            disconnect() { }
        };
        // Mock pointer capture methods
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
        window.HTMLElement.prototype.releasePointerCapture = vi.fn();
        window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    });

    it('renders speed button with current rate', () => {
        render(<SpeedControl {...defaultProps} />);

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('1x')).toBeInTheDocument();
    });

    it('displays different playback rates', () => {
        render(<SpeedControl {...defaultProps} playbackRate={1.5} />);

        expect(screen.getByText('1.5x')).toBeInTheDocument();
    });

    it('opens dropdown menu when button is clicked', async () => {
        const user = userEvent.setup();
        render(<SpeedControl {...defaultProps} />);

        await user.click(screen.getByRole('button'));

        // Menu should appear with speed options
        expect(screen.getAllByRole('menuitem')).toHaveLength(6);
        expect(screen.getByText('0.75x')).toBeInTheDocument();
        expect(screen.getByText('2x')).toBeInTheDocument();
    });

    it('calls onSpeedChange when speed option is clicked', async () => {
        const user = userEvent.setup();
        const onSpeedChange = vi.fn();
        render(<SpeedControl {...defaultProps} onSpeedChange={onSpeedChange} />);

        // Open menu
        await user.click(screen.getByRole('button'));

        // Click speed option
        await user.click(screen.getByText('1.5x'));
        expect(onSpeedChange).toHaveBeenCalledWith(1.5);
    });

    it('highlights current speed in menu', async () => {
        const user = userEvent.setup();
        render(<SpeedControl {...defaultProps} playbackRate={1.25} />);

        // Open menu
        await user.click(screen.getByRole('button'));

        const menuItems = screen.getAllByRole('menuitem');
        const selectedItem = menuItems.find((item) => item.textContent === '1.25x');
        expect(selectedItem).toHaveClass('bg-primary');
    });

    it('shows all speed options', async () => {
        const user = userEvent.setup();
        render(<SpeedControl {...defaultProps} />);

        // Open menu
        await user.click(screen.getByRole('button'));

        const expectedSpeeds = ['0.75x', '1x', '1.25x', '1.5x', '1.75x', '2x'];
        const menuItems = screen.getAllByRole('menuitem');

        expectedSpeeds.forEach((speed) => {
            const item = menuItems.find(i => i.textContent?.trim() === speed);
            expect(item).toBeInTheDocument();
        });
    });
});
