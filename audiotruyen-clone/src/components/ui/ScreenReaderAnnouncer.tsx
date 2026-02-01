'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';

interface Announcement {
    id: string;
    message: string;
    politeness: 'polite' | 'assertive' | 'off';
}

interface AnnouncerContextType {
    announce: (message: string, politeness?: 'polite' | 'assertive') => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

export function useAnnounce() {
    const context = useContext(AnnouncerContext);
    if (!context) {
        // Fallback if used outside provider, or return a no-op
        return (message: string) => console.log('Announce:', message);
    }
    return context.announce;
}

export function ScreenReaderAnnouncer({ children }: { children: ReactNode }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
        const id = Date.now().toString() + Math.random().toString();
        setAnnouncements(prev => [...prev, { id, message, politeness }]);

        // Remove announcement after it's read
        setTimeout(() => {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
        }, 1000); // 1 second should be enough for screen reader to pick it up
    };

    return (
        <AnnouncerContext.Provider value={{ announce }}>
            {children}
            <div className="sr-only">
                {announcements.map(announcement => (
                    <div
                        key={announcement.id}
                        aria-live={announcement.politeness}
                        aria-atomic="true"
                        aria-relevant="additions text"
                    >
                        {announcement.message}
                    </div>
                ))}
            </div>
        </AnnouncerContext.Provider>
    );
}
