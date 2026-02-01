import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive) return;

        // Store current focused element
        previousFocusRef.current = document.activeElement as HTMLElement;

        // Get all focusable elements
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                // Shift+Tab: Go to previous element
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab: Go to next element
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                // Optional: Trigger close callback if needed? 
                // For now just allow bubbling or handle elsewhere
            }
        };

        container.addEventListener('keydown', handleTabKey);
        container.addEventListener('keydown', handleEscapeKey);

        // Focus first element when trap activates
        // Small delay to ensure render is complete/animation is done
        setTimeout(() => {
            firstElement?.focus();
        }, 50);

        return () => {
            container.removeEventListener('keydown', handleTabKey);
            container.removeEventListener('keydown', handleEscapeKey);

            // Restore focus when trap deactivates
            previousFocusRef.current?.focus();
        };
    }, [isActive]);

    return containerRef;
}
