'use client';

import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutsOptions {
    onTogglePlay: () => void;
    onSkip: (seconds: number) => void;
    onToggleMute: () => void;
    /** Skip time in seconds, default 10 */
    skipTime?: number;
    /** Whether the shortcuts are enabled */
    enabled?: boolean;
}

/**
 * Custom hook for audio player keyboard shortcuts
 * 
 * Shortcuts:
 * - Space: Toggle play/pause
 * - ArrowRight: Skip forward
 * - ArrowLeft: Skip backward
 * - Ctrl+M: Toggle mute
 */
export function useKeyboardShortcuts({
    onTogglePlay,
    onSkip,
    onToggleMute,
    skipTime = 10,
    enabled = true
}: UseKeyboardShortcutsOptions) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't trigger if user is typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }

        switch (e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                onTogglePlay();
                break;
            case 'arrowright':
                onSkip(skipTime);
                break;
            case 'arrowleft':
                onSkip(-skipTime);
                break;
            case 'm':
                if (e.ctrlKey) {
                    e.preventDefault();
                    onToggleMute();
                }
                break;
        }
    }, [onTogglePlay, onSkip, onToggleMute, skipTime]);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown, enabled]);
}
