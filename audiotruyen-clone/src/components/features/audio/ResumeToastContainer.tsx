'use client';

import { usePathname } from 'next/navigation';
import { useAudio } from '@/contexts/AudioContext';
import { ResumeToast } from './ResumeToast';

export function ResumeToastContainer() {
    const pathname = usePathname();
    const {
        state,
        handleResume,
        hideResumeToast,
        formatTime
    } = useAudio();

    // Don't show toast on story detail pages (AudioPlayer handles it inline)
    if (pathname.startsWith('/truyen/')) {
        return null;
    }

    if (!state.showResumeToast || !state.resumeData) {
        return null;
    }

    return (
        <ResumeToast
            show={true}
            chapterNumber={state.resumeData.chapterNumber}
            timestamp={state.resumeData.timestamp}
            formatTime={formatTime}
            onResume={handleResume}
            onDismiss={hideResumeToast}
        />
    );
}
