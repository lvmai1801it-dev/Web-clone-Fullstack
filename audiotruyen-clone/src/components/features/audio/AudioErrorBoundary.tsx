'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

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
 * Provides audio-specific error recovery options.
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
                <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
                    <div className="mb-3 text-4xl">🔇</div>
                    <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Không thể phát audio
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {this.props.storyTitle
                            ? `Lỗi khi phát "${this.props.storyTitle}"`
                            : 'Đã xảy ra lỗi khi phát audio'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={this.handleRetry}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AudioErrorBoundary;
