'use client';

import { memo } from 'react';

interface ResumeToastProps {
    show: boolean;
    chapterNumber: number;
    timestamp: number;
    formatTime: (time: number) => string;
    onResume: () => void;
    onDismiss: () => void;
}

export const ResumeToast = memo(function ResumeToast({
    show,
    chapterNumber,
    timestamp,
    formatTime,
    onResume,
    onDismiss,
}: ResumeToastProps) {
    if (!show) return null;

    return (
        <div className="absolute top-12 left-6 right-6 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-blue-600 text-white p-3 rounded-lg shadow-xl flex items-center justify-between gap-3 border border-blue-400">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                    </div>
                    <div className="text-xs">
                        <p className="font-bold">Tiếp tục nghe?</p>
                        <p className="opacity-90">Chương {chapterNumber} lúc {formatTime(timestamp)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onDismiss}
                        className="px-2 py-1 text-[10px] h-auto font-medium hover:bg-white/10 rounded"
                    >
                        Bỏ qua
                    </button>
                    <button
                        onClick={onResume}
                        className="px-3 py-1 text-[10px] h-auto font-bold bg-white text-blue-600 hover:bg-blue-50 rounded shadow-sm"
                    >
                        Nghe tiếp
                    </button>
                </div>
            </div>
        </div>
    );
});
