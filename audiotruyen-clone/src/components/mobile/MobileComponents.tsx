'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for mobile-only components (code-split for desktop)
const BottomNavigation = dynamic(
    () => import('@/components/mobile/BottomNavigation').then(mod => mod.BottomNavigation),
    { ssr: false }
);

const MiniPlayer = dynamic(
    () => import('@/components/features/audio/MiniPlayer').then(mod => mod.MiniPlayer),
    { ssr: false }
);

const FloatingActionButton = dynamic(
    () => import('@/components/ui/FloatingActionButton').then(mod => mod.FloatingActionButton),
    { ssr: false }
);

export function MobileComponents() {
    return (
        <>
            <MiniPlayer />
            <FloatingActionButton />
            <BottomNavigation />
        </>
    );
}
