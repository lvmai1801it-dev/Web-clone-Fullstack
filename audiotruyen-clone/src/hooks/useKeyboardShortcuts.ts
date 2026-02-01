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

        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;
        const alt = e.altKey;

        switch (true) {
            case key === ' ' && !ctrl && !alt:
                e.preventDefault();
                onTogglePlay();
                break;
            case key === 'arrowright' && !alt:
                onSkip(skipTime);
                break;
            case key === 'arrowleft' && !alt:
                onSkip(-skipTime);
                break;
            case key === 'arrowup' && alt:
                // Need volume control in hook args if we want to support this fully
                // For now, these are placeholders or need to be passed in
                break;
            case key === 'm' && ctrl:
                e.preventDefault();
                onToggleMute();
                break;
        }
    }, [onTogglePlay, onSkip, onToggleMute, skipTime]);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown, enabled]);
}
