'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Generic Error Boundary component for catching and handling React errors.
 * Provides a fallback UI when child components throw errors.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    override render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 text-6xl">⚠️</div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Đã xảy ra lỗi
                    </h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                        {this.state.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'}
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
