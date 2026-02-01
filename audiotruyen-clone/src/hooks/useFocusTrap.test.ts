import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.innerHTML = `
      <button id="first">First</button>
      <input id="input" type="text" />
      <button id="last">Last</button>
    `;
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    });

    it('returns a ref object', () => {
        const { result } = renderHook(() => useFocusTrap(false));

        expect(result.current).toBeDefined();
        expect(result.current.current).toBeNull();
    });

    it('ref can be assigned to a container', () => {
        const { result } = renderHook(() => useFocusTrap(false));
        result.current.current = container;

        expect(result.current.current).toBe(container);
    });

    it('hook runs without errors when active', () => {
        const { result, rerender } = renderHook(
            ({ active }) => useFocusTrap(active),
            { initialProps: { active: false } }
        );

        result.current.current = container;

        expect(() => {
            rerender({ active: true });
        }).not.toThrow();
    });

    it('hook runs without errors when inactive', () => {
        const { result } = renderHook(() => useFocusTrap(false));
        result.current.current = container;

        expect(result.current.current).toBe(container);
    });

    it('cleans up without errors on unmount', () => {
        const { result, unmount } = renderHook(() => useFocusTrap(true));
        result.current.current = container;

        expect(() => {
            unmount();
        }).not.toThrow();
    });
});
