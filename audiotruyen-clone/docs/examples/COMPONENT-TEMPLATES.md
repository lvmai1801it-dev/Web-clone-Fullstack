# Component Templates & Examples

## Overview

This document provides reusable component templates and hook patterns for consistent, performant, and accessible React components in the AudioTruyen Clone project.

---

## Smart Component Template

### Basic Component Structure
```typescript
import React, { memo, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props interface here
  className?: string;
  children?: React.ReactNode;
}

/**
 * Component description
 * 
 * @example
 * ```tsx
 * <Component propName="value">
 *   Content here
 * </Component>
 * ```
 */
export const Component = memo<ComponentProps>(({ 
  // Destructured props
  className,
  children,
  ...otherProps 
}) => {
  // Memoized calculations
  const memoizedValue = useMemo(() => {
    // Expensive calculation here
    return result;
  }, [/* dependencies */]);

  // Stable event handlers
  const handleClick = useCallback((event: React.MouseEvent) => {
    // Handle event here
  }, [/* dependencies */]);

  return (
    <div 
      className={cn("component-base", className)}
      {...otherProps}
    >
      {/* Component content */}
      {children}
    </div>
  );
});

// Set display name for debugging
Component.displayName = 'Component';
```

### Component with State Management
```typescript
import React, { memo, useCallback, useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface InteractiveComponentProps {
  id: string;
  title: string;
  onAction?: (action: string) => void;
  className?: string;
}

export const InteractiveComponent = memo<InteractiveComponentProps>(({
  id,
  title,
  onAction,
  className
}) => {
  const { state: { isPlaying, currentTime }, actions } = useAudio();
  const [localState, setLocalState] = useState(false);

  // Memoized styles based on state
  const containerStyles = useMemo(() => ({
    opacity: localState ? 1 : 0.8,
    transform: localState ? 'scale(1.02)' : 'scale(1)',
  }), [localState]);

  // Stable event handler
  const handleAction = useCallback((action: string) => {
    setLocalState(true);
    onAction?.(action);
    
    // Reset state after animation
    setTimeout(() => setLocalState(false), 300);
  }, [onAction]);

  // Effect for external state changes
  useEffect(() => {
    // React to audio state changes
    console.log(`Component ${id} received audio state change:`, {
      isPlaying,
      currentTime
    });
  }, [id, isPlaying, currentTime]);

  return (
    <div 
      className={cn("interactive-component", className)}
      style={containerStyles}
      role="button"
      tabIndex={0}
      onClick={() => handleAction('click')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction('keyboard');
        }
      }}
      aria-label={`${title}. ${isPlaying ? 'Đang phát' : 'Đã dừng'}`}
    >
      <h3>{title}</h3>
      <p>Audio Status: {isPlaying ? 'Playing' : 'Paused'}</p>
      <p>Current Time: {Math.floor(currentTime)}s</p>
    </div>
  );
});

InteractiveComponent.displayName = 'InteractiveComponent';
```

---

## Custom Hook Templates

### Data Fetching Hook
```typescript
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiResponse } from '@/lib/types';

interface UseApiOptions<T> {
  url: string;
  immediate?: boolean;
  cacheKey?: string;
  retryCount?: number;
  retryDelay?: number;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for API calls with caching and retry logic
 */
export function useApi<T>(
  options: UseApiOptions<T>
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize cache check
  const shouldUseCache = useMemo(() => {
    if (!options.cacheKey) return false;
    
    try {
      const cached = localStorage.getItem(options.cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        return age < 5 * 60 * 1000; // 5 minutes
      }
    } catch {
      return false;
    }
  }, [options.cacheKey]);

  const fetchData = useCallback(async (isRetry = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (!isRetry && shouldUseCache) {
        const cached = localStorage.getItem(options.cacheKey!);
        if (cached) {
          const { data } = JSON.parse(cached);
          setData(data);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(options.url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'API request failed');
      }

      setData(result.data || null);
      
      // Cache successful response
      if (options.cacheKey) {
        localStorage.setItem(options.cacheKey, JSON.stringify({
          data: result.data,
          timestamp: Date.now()
        }));
      }

      setRetryCount(0);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Retry logic
      if (retryCount < (options.retryCount || 3)) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchData(true);
        }, options.retryDelay || 2000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  }, [options.url, options.cacheKey, shouldUseCache, options.retryCount, options.retryDelay, retryCount]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    fetchData(false);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch
  };
}
```

### Storage Hook
```typescript
import { useState, useCallback } from 'react';

interface UseStorageOptions<T> {
  key: string;
  defaultValue: T;
  storage?: 'localStorage' | 'sessionStorage';
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Custom hook for localStorage/sessionStorage with error handling
 */
export function useStorage<T>(
  options: UseStorageOptions<T>
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storage = window[options.storage || 'localStorage'];
      const stored = storage.getItem(options.key);
      if (stored !== null) {
        return options.deserialize 
          ? options.deserialize(stored)
          : JSON.parse(stored);
      }
    } catch {
      return options.defaultValue;
    }
  });

  const updateValue = useCallback((newValue: T) => {
    try {
      setValue(newValue);
      const storage = window[options.storage || 'localStorage'];
      const serialized = options.serialize 
        ? options.serialize(newValue)
        : JSON.stringify(newValue);
      storage.setItem(options.key, serialized);
    } catch (error) {
      console.error(`Failed to save ${options.key} to storage:`, error);
    }
  }, [options.key, options.storage, options.serialize]);

  const removeValue = useCallback(() => {
    try {
      setValue(options.defaultValue);
      const storage = window[options.storage || 'localStorage'];
      storage.removeItem(options.key);
    } catch (error) {
      console.error(`Failed to remove ${options.key} from storage:`, error);
    }
  }, [options.key, options.storage, options.defaultValue]);

  return {
    value,
    setValue: updateValue,
    removeValue
  };
}
```

### Debounce Hook
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom debounce hook for optimizing expensive operations
 */
export function useDebounce<T>(
  callback: (value: T) => void,
  delay: number
): [(value: T) => void, () => void] {
  const [debouncedCallback, setDebouncedCallback] = useState<() => void>(() => callback);
  const [debouncedValue, setDebouncedValue] = useState<T>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setValue = useCallback((newValue: T) => {
    setDebouncedValue(newValue);
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    setDebouncedCallback(() => callback);
  }, [callback]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      debouncedCallback(debouncedValue);
    }, delay);

    return cancel;
  }, [debouncedValue, debouncedCallback, delay]);

  useEffect(() => {
    return cancel;
  }, []);
}
```

---

## Error Boundary Templates

### Error Boundary Component
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: Component<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component with customizable fallback and error reporting
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error service
    this.reportError(error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Send to error reporting service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        stack_trace: error.stack,
      });
    }

    // Send to custom error tracking
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch {
      // Silently fail if error reporting fails
      console.warn('Failed to report error:', error);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error!} reset={this.handleReset} />;
      }

      // Default error UI
      return (
        <div className="error-boundary-fallback p-6 text-center">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-4">
              Ứng dụng đã gặp sự cố không mong muốn. Vui lòng thử lại hoặc tải lại trang.
            </p>
          </div>
          
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Testing Utilities

### Test Mocks
```typescript
// src/test/mocks/story.mock.ts
import { Story, Chapter } from '@/lib/types';

export const mockChapter: Chapter = {
  id: 1,
  number: 1,
  title: 'Chương 1: Giới thiệu nhân vật',
  audio_url: 'https://example.com/audio1.mp3',
  duration: 1200,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  description: 'Chương đầu tiên giới thiệu nhân vật chính',
};

export const mockStory: Story = {
  id: 1,
  title: 'Câu Ma',
  slug: 'cau-ma',
  description: 'Truyện kinh dị kể về câu ma đáng sợ trong truyện kể dân gian Việt Nam.',
  author_name: 'Nguyễn Văn A',
  author_slug: 'nguyen-van-a',
  cover_url: 'https://example.com/cau-ma-cover.jpg',
  views: 125000,
  rating_avg: '4.5',
  rating_count: 2500,
  total_chapters: 15,
  currentChapter: 8,
  status: 'ongoing',
  is_adult: false,
  categories: [
    {
      id: 1,
      name: 'Kinh dị',
      slug: 'kinh-di'
    }
  ],
  tags: ['kinh dị', 'ma', 'rùng rợn'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
  chapters: Array.from({ length: 15 }, (_, i) => ({
    ...mockChapter,
    id: i + 1,
    number: i + 1,
    title: `Chương ${i + 1}: ${['Nội dung chương', 'Diễn biến chính', 'Cao trào'][i % 3]}`,
  })),
};

export const mockStories: Story[] = Array.from({ length: 20 }, (_, i) => ({
  ...mockStory,
  id: i + 1,
  title: `Truyện ${i + 1}`,
  slug: `truyen-${i + 1}`,
  chapters: Array.from({ length: 10 }, (_, j) => ({
    ...mockChapter,
    id: j + 1,
    number: j + 1,
    title: `Chương ${j + 1} của Truyện ${i + 1}`,
  })),
}));

export const mockApiResponse = <T>(data: T, success = true) => ({
  success,
  message: 'Success',
  data,
});

export const mockApiError = <T>(message = 'API Error') => ({
  success: false,
  message,
  data: null as T,
});
```

### Test Utilities
```typescript
// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function with common providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  const Wrapper = ({ children }) => (
    <AudioProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AudioProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Custom user event setup with mobile support
 */
export const setupMobileUserEvent = () => {
  return userEvent.setup({
    pointerEventsCheck: 0,
  });
};

/**
 * Wait for element to appear with timeout
 */
export const waitForElement = async (
  query: string,
  timeout = 5000
): Promise<Element> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(query);
    if (element) {
      return element;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error(`Element ${query} not found within ${timeout}ms`);
};

/**
 * Mock API responses with delay
 */
export const mockApiResponse = <T>(
  data: T,
  delay = 100
): Promise<{ success: boolean; data: T }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, delay);
  });
};
```

---

## Configuration Examples

### Environment Configuration
```typescript
// src/config/environment.ts
interface EnvironmentConfig {
  apiUrl: string;
  imageCdnUrl: string;
  analyticsId: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  apiTimeout: number;
  retryAttempts: number;
}

const config: EnvironmentConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.audiotruyen.com',
  imageCdnUrl: process.env.NEXT_PUBLIC_IMAGE_CDN || 'https://images.audiotruyen.com',
  analyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  retryAttempts: parseInt(process.env.NEXT_PUBLIC_RETRY_ATTEMPTS || '3'),
};

// Validate required environment variables
if (!config.apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

if (!config.analyticsId && config.isProduction) {
  console.warn('NEXT_PUBLIC_GA_ID environment variable is missing in production');
}

export default config;
```

### Feature Flags
```typescript
// src/config/featureFlags.ts
interface FeatureFlags {
  enableVoiceSearch: boolean;
  enableOfflineMode: boolean;
  enableMiniPlayer: boolean;
  enableKeyboardShortcuts: boolean;
  enableBackgroundPlayback: boolean;
  newSearchAlgorithm: boolean;
}

const featureFlags: FeatureFlags = {
  // Enable in development, control by environment in production
  enableVoiceSearch: process.env.NODE_ENV === 'development' || 
    process.env.NEXT_PUBLIC_ENABLE_VOICE_SEARCH === 'true',
  
  enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE === 'true',
  enableMiniPlayer: true, // Always enabled
  enableKeyboardShortcuts: true, // Always enabled
  enableBackgroundPlayback: process.env.NEXT_PUBLIC_ENABLE_BACKGROUND === 'true',
  newSearchAlgorithm: process.env.NEXT_PUBLIC_NEW_SEARCH === 'true',
};

// Helper function to check feature availability
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature];
};

// Log disabled features in development
if (process.env.NODE_ENV === 'development') {
  const disabledFeatures = Object.entries(featureFlags)
    .filter(([_, enabled]) => !enabled)
    .map(([feature, _]) => feature);
  
  if (disabledFeatures.length > 0) {
    console.log('Disabled features:', disabledFeatures);
  }
}

export default featureFlags;
```

---

## Animation Templates

### Transition Component
```typescript
import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TransitionProps {
  show: boolean;
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale';
  duration?: number;
  className?: string;
}

export const Transition = memo<TransitionProps>(({
  show,
  children,
  type = 'fade',
  duration = 300,
  className
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), duration);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender && !isAnimating) {
    return null;
  }

  const transitionClasses = {
    fade: cn(
      'transition-opacity',
      isAnimating ? 'opacity-0' : 'opacity-100'
    ),
    slide: cn(
      'transition-transform',
      isAnimating ? 'transform -translate-x-full' : 'transform translate-x-0'
    ),
    scale: cn(
      'transition-transform',
      isAnimating ? 'transform scale-95' : 'transform scale-100'
    ),
  };

  return (
    <div 
      className={cn(
        'transition-all',
        transitionClasses[type],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
});

Transition.displayName = 'Transition';
```

### Loading Skeleton
```typescript
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'list';
  lines?: number;
  height?: string;
}

export const LoadingSkeleton = memo<LoadingSkeletonProps>(({
  className,
  variant = 'card',
  lines = 3,
  height
}) => {
  const variantClasses = {
    text: 'h-4 bg-gray-200 rounded w-3/4 animate-pulse',
    card: 'space-y-3',
    avatar: 'w-12 h-12 bg-gray-200 rounded-full animate-pulse',
    list: 'space-y-2',
  };

  const skeletonLines = Array.from({ length: lines }, (_, i) => (
    <div
      key={i}
      className={cn(
        'h-4 bg-gray-200 rounded animate-pulse',
        i === 0 && 'w-3/4',
        i === 1 && 'w-1/2',
        i === 2 && 'w-2/3',
        i > 2 && 'w-full'
      )}
    />
  ));

  return (
    <div 
      className={cn(
        'skeleton',
        variantClasses[variant],
        className
      )}
      style={height ? { height } : {}}
    >
      {variant === 'list' && skeletonLines}
      {variant === 'card' && (
        <>
          <div className="h-32 bg-gray-200 rounded-md animate-pulse mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </>
      )}
      {variant === 'text' && (
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      )}
      {variant === 'avatar' && (
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      )}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
```

These templates provide consistent patterns for building high-quality, performant, and accessible components throughout the AudioTruyen Clone application.