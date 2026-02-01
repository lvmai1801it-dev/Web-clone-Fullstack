'use client';

import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxHeight?: string;
}

export function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
    maxHeight = '80vh'
}: BottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    // Close on swipe down
    const swipeHandlers = useSwipeGesture({
        onSwipeLeft: undefined,
        onSwipeRight: undefined,
        threshold: 50,
    });

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Handle drag to close
    const dragStartY = useRef<number | null>(null);
    const currentY = useRef<number>(0);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (touch) dragStartY.current = touch.clientY;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (dragStartY.current === null) return;
        const touch = e.touches[0];
        if (!touch) return;
        const deltaY = touch.clientY - dragStartY.current;
        if (deltaY > 0 && sheetRef.current) {
            currentY.current = deltaY;
            sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (currentY.current > 100) {
            onClose();
        }
        if (sheetRef.current) {
            sheetRef.current.style.transform = '';
        }
        dragStartY.current = null;
        currentY.current = 0;
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300"
                style={{ maxHeight }}
                {...swipeHandlers}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Handle */}
                <div className="sticky top-0 bg-white rounded-t-2xl pt-3 pb-2 px-4 border-b border-[var(--color-border)]">
                    <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-3" />

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        {title && (
                            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                                {title}
                            </h3>
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-background)] text-[var(--color-text-muted)]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 80px)` }}>
                    {children}
                </div>
            </div>
        </>
    );
}
