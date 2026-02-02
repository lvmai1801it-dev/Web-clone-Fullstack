'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
    fallback?: string;
    containerClassName?: string;
}

export function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    fallback = '/images/placeholder.png',
    priority = false,
    ...props
}: OptimizedImageProps) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setError(true);
        setIsLoading(false);
    };

    return (
        <div className={cn("relative overflow-hidden bg-gray-100", containerClassName)}>
            <Image
                src={error ? fallback : src}
                alt={alt}
                className={cn(
                    "duration-700 ease-in-out",
                    isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
                    className
                )}
                priority={priority}
                fetchPriority={priority ? "high" : "auto"}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
}
