'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public override state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public override render() {
        if (this.state.hasError) {
            return (
                <div className="container-main flex items-center justify-center min-h-[500px]">
                    {this.props.fallback || (
                        <div className="glass-premium border border-destructive/20 rounded-[40px] p-10 md:p-16 shadow-premium-lg max-w-2xl w-full text-center space-y-8 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mx-auto shadow-glow shadow-destructive/20 ring-1 ring-destructive/20">
                                <AlertTriangle size={48} strokeWidth={1.5} />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">
                                    Hệ thống tạm gián đoạn
                                </h1>
                                <p className="text-base text-muted-foreground font-medium leading-relaxed">
                                    Rất tiếc, đã có một sự cố kỹ thuật vừa xảy ra.
                                    Đừng lo lắng, chúng tôi đã ghi nhận và sẽ sớm khắc phục.
                                    Hãy thử tải lại trang bạn nhé!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button
                                    size="lg"
                                    onClick={() => window.location.reload()}
                                    className="h-14 px-8 rounded-2xl bg-destructive text-white font-black uppercase tracking-widest shadow-glow shadow-destructive/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <RotateCcw size={18} className="mr-2" />
                                    Tải lại trang
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => window.location.href = '/'}
                                    className="h-14 px-8 rounded-2xl border-muted-foreground/20 text-foreground font-black uppercase tracking-widest hover:bg-muted transition-all"
                                >
                                    <Home size={18} className="mr-2" />
                                    Về trang chủ
                                </Button>
                            </div>

                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-10 p-4 bg-muted/40 rounded-2xl text-left border border-muted divide-y divide-muted/50 overflow-hidden">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Thông tin kỹ thuật (Chỉ Dev)</p>
                                    <pre className="text-xs font-mono text-destructive pt-2 overflow-auto max-h-[200px] scrollbar-thin">
                                        {this.state.error?.stack || this.state.error?.toString()}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
