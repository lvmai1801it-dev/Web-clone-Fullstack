/**
 * Accessibility utilities for mobile-first design
 */

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if user prefers dark mode
export function prefersDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Generate aria labels for icons
export function getAriaLabel(action: string, context?: string): string {
    return context ? `${action} ${context}` : action;
}

// Skip link component helper - for keyboard navigation
export const skipLinkClasses =
    'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded';

// Touch target size validator (minimum 44x44px for WCAG)
export const TOUCH_TARGET_MIN = 44;

// Contrast ratio requirements
export const CONTRAST_REQUIREMENTS = {
    normal: 4.5,  // WCAG AA for normal text
    large: 3,     // WCAG AA for large text (18pt+ or 14pt bold)
    ui: 3,        // WCAG AA for UI components
};

// Focus visible styles for keyboard navigation
export const focusVisibleClasses =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

// Screen reader only text
export function srOnly(text: string): string {
    return text;
}

// Generate unique IDs for accessibility
let idCounter = 0;
export function generateA11yId(prefix = 'a11y'): string {
    return `${prefix}-${++idCounter}`;
}
