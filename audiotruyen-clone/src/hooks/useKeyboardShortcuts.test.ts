import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
    const mockCallbacks = {
        onTogglePlay: vi.fn(),
        onSkip: vi.fn(),
        onToggleMute: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls onTogglePlay when Space is pressed', () => {
        renderHook(() => useKeyboardShortcuts(mockCallbacks));

        const event = new KeyboardEvent('keydown', { key: ' ' });
        window.dispatchEvent(event);

        expect(mockCallbacks.onTogglePlay).toHaveBeenCalledTimes(1);
    });

    it('calls onSkip with positive value when ArrowRight is pressed', () => {
        renderHook(() => useKeyboardShortcuts(mockCallbacks));

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);

        expect(mockCallbacks.onSkip).toHaveBeenCalledWith(10);
    });

    it('calls onSkip with negative value when ArrowLeft is pressed', () => {
        renderHook(() => useKeyboardShortcuts(mockCallbacks));

        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        window.dispatchEvent(event);

        expect(mockCallbacks.onSkip).toHaveBeenCalledWith(-10);
    });

    it('calls onToggleMute when Ctrl+M is pressed', () => {
        renderHook(() => useKeyboardShortcuts(mockCallbacks));

        const event = new KeyboardEvent('keydown', { key: 'm', ctrlKey: true });
        window.dispatchEvent(event);

        expect(mockCallbacks.onToggleMute).toHaveBeenCalledTimes(1);
    });

    it('uses custom skipTime when provided', () => {
        renderHook(() =>
            useKeyboardShortcuts({ ...mockCallbacks, skipTime: 5 })
        );

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);

        expect(mockCallbacks.onSkip).toHaveBeenCalledWith(5);
    });

    it('does not trigger shortcuts when typing in input', () => {
        renderHook(() => useKeyboardShortcuts(mockCallbacks));

        const input = document.createElement('input');
        document.body.appendChild(input);

        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        Object.defineProperty(event, 'target', { value: input, enumerable: true });
        input.dispatchEvent(event);

        expect(mockCallbacks.onTogglePlay).not.toHaveBeenCalled();

        document.body.removeChild(input);
    });

    it('does not trigger shortcuts when typing in textarea', () => {
        renderHook(() => useKeyboardShortcuts(mockCallbacks));

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        Object.defineProperty(event, 'target', {
            value: textarea,
            enumerable: true,
        });
        textarea.dispatchEvent(event);

        expect(mockCallbacks.onTogglePlay).not.toHaveBeenCalled();

        document.body.removeChild(textarea);
    });

    it('does not activate when enabled is false', () => {
        renderHook(() =>
            useKeyboardShortcuts({ ...mockCallbacks, enabled: false })
        );

        const event = new KeyboardEvent('keydown', { key: ' ' });
        window.dispatchEvent(event);

        expect(mockCallbacks.onTogglePlay).not.toHaveBeenCalled();
    });

    it('cleans up event listener on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useKeyboardShortcuts(mockCallbacks));

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'keydown',
            expect.any(Function)
        );

        removeEventListenerSpy.mockRestore();
    });
});
