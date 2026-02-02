'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

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
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="glass-premium border border-primary/20 rounded-2xl p-4 shadow-premium-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Play size={20} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">Bạn đang nghe dở?</p>
                        <p className="text-[11px] font-medium text-muted-foreground">
                            Chương {chapterNumber} • {formatTime(timestamp)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDismiss}
                        className="h-9 w-9 rounded-full p-0 text-muted-foreground hover:bg-muted"
                    >
                        <X size={18} />
                    </Button>
                    <Button
                        size="sm"
                        onClick={onResume}
                        className="h-9 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow-glow hover:bg-primary/90 transition-all"
                    >
                        Nghe tiếp
                    </Button>
                </div>
            </div>
        </div>
    );
});
