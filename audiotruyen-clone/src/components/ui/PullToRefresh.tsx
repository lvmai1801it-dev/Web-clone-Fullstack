'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
    className?: string;
}

export function PullToRefresh({ onRefresh, children, className = '' }: PullToRefreshProps) {
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const threshold = 80; // Distance needed to trigger refresh
    const maxPull = 120; // Max pull distance

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (containerRef.current?.scrollTop === 0 && touch) {
            startY.current = touch.clientY;
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (startY.current === null || isRefreshing) return;

        const touch = e.touches[0];
        if (!touch) return;
        const currentY = touch.clientY;
        const distance = Math.max(0, currentY - startY.current);

        if (distance > 0 && containerRef.current?.scrollTop === 0) {
            setIsPulling(true);
            // Use resistance factor to slow down pull
            setPullDistance(Math.min(distance * 0.5, maxPull));
        }
    }, [isRefreshing]);

    const handleTouchEnd = useCallback(async () => {
        if (!isPulling) return;

        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
            }
        }

        setIsPulling(false);
        setPullDistance(0);
        startY.current = null;
    }, [isPulling, pullDistance, threshold, onRefresh]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-auto ${className}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull indicator */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center transition-transform duration-200 ease-out z-10"
                style={{
                    transform: `translateY(${pullDistance - 50}px)`,
                    opacity: pullDistance / threshold
                }}
            >
                <div className={`flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-[var(--color-border)] ${isRefreshing ? 'animate-pulse' : ''}`}>
                    <div className={`w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full ${isRefreshing || pullDistance >= threshold ? 'animate-spin' : ''}`}
                        style={{ transform: isRefreshing ? 'none' : `rotate(${pullDistance * 2}deg)` }}
                    />
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        {isRefreshing ? 'Đang tải...' : pullDistance >= threshold ? 'Thả để làm mới' : 'Kéo xuống để làm mới'}
                    </span>
                </div>
            </div>

            {/* Content with pull transform */}
            <div
                style={{
                    transform: isPulling ? `translateY(${pullDistance}px)` : 'none',
                    transition: isPulling ? 'none' : 'transform 0.2s ease-out'
                }}
            >
                {children}
            </div>
        </div>
    );
}
