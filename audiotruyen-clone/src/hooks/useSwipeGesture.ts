'use client';

import { useRef, useCallback } from 'react';

interface SwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    threshold?: number;
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50 }: SwipeOptions) {
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchEndX.current = null;
        const touch = e.targetTouches[0];
        if (touch) touchStartX.current = touch.clientX;
    }, []);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        const touch = e.targetTouches[0];
        if (touch) touchEndX.current = touch.clientX;
    }, []);

    const onTouchEnd = useCallback(() => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > threshold;
        const isRightSwipe = distance < -threshold;

        if (isLeftSwipe && onSwipeLeft) {
            onSwipeLeft();
        }
        if (isRightSwipe && onSwipeRight) {
            onSwipeRight();
        }
    }, [onSwipeLeft, onSwipeRight, threshold]);

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}
