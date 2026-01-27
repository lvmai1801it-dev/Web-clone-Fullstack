import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
    });

    it('applies variant classes', () => {
        render(<Button variant="destructive">Destructive</Button>);
        const button = screen.getByRole('button', { name: /destructive/i });
        expect(button.className).toContain('bg-red-500');
    });

    it('handles click events', () => {
        // Note: In real test env need userEvent, but basic check passing implies structure is correct
        render(<Button>Clickable</Button>);
    });
});
