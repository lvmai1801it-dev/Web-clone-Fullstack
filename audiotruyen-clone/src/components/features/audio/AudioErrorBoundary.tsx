'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { VolumeX, RotateCcw, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    storyTitle?: string;
    onRetry?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Specialized Error Boundary for the Audio Player.
 * Provides audio-specific error recovery options with Pro Max aesthetics.
 */
export class AudioErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('AudioErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
        this.props.onRetry?.();
    };

    override render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center glass-premium border border-primary/10 rounded-[32px] p-10 md:p-14 text-center mt-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-glow ring-1 ring-primary/20">
                        <VolumeX size={36} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2 mb-8">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                            Không thể tải nguồn Audio
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium max-w-sm">
                            {this.props.storyTitle
                                ? `Hiện tại không thể kết nối đến máy chủ audio cho truyện "${this.props.storyTitle}".`
                                : 'Đã xảy ra lỗi kết nối đến máy chủ audio.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={this.handleRetry}
                            className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
                        >
                            <RefreshCcw size={18} className="mr-2" />
                            Thử lại ngay
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="h-12 px-8 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest hover:bg-primary/5 transition-all"
                        >
                            <RotateCcw size={18} className="mr-2" />
                            Tải lại trang
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AudioErrorBoundary;
