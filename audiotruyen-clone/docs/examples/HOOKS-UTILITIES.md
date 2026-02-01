# Hooks & Utilities Examples

## Overview

This document provides reusable custom hooks and utility functions for common patterns in the AudioTruyen Clone application, focusing on performance optimization and developer experience.

---

## Custom Hooks Examples

### useAudioPlayback Hook
```typescript
// src/hooks/useAudioPlayback.ts
import { useRef, useCallback, useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface UseAudioPlaybackOptions {
  onChapterComplete?: (chapterNumber: number) => void;
  onError?: (error: Error) => void;
  autoPlay?: boolean;
}

export function useAudioPlayback(options: UseAudioPlaybackOptions = {}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    state: { currentStory, isPlaying, currentTime, duration, selectedChapter, chapters },
    actions: { play, pause, seek }
  } = useAudio();

  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial audio properties
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    // Auto-play if specified and available
    if (options.autoPlay && audio.readyState >= 2) {
      audio.play().catch(options.onError);
    }
  }, [volume, playbackRate, options.autoPlay, options.onError]);

  // Handle chapter change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStory) return;

    const currentChapterData = chapters.find(ch => ch.number === selectedChapter);
    if (currentChapterData?.audio_url) {
      setIsLoading(true);
      audio.src = currentChapterData.audio_url;
      audio.load();
    }
  }, [selectedChapter, chapters, currentStory]);

  // Audio event handlers
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      // Save progress every 5 seconds
      if (Math.floor(audio.currentTime) % 5 === 0) {
        // Save to context or storage
        seek(audio.currentTime);
      }
    }
  }, [seek]);

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (audio && selectedChapter < chapters.length) {
      // Auto-play next chapter
      options.onChapterComplete?.(selectedChapter);
    }
  }, [selectedChapter, chapters.length, options.onChapterComplete]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: Event) => {
    setIsLoading(false);
    options.onError?.(error as Error);
    console.error('Audio playback error:', error);
  }, [options.onError]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const events = [
      { event: 'timeupdate', handler: handleTimeUpdate },
      { event: 'ended', handler: handleEnded },
      { event: 'loadstart', handler: handleLoadStart },
      { event: 'canplay', handler: handleCanPlay },
      { event: 'error', handler: handleError },
    ];

    events.forEach(({ event, handler }) => {
      audio.addEventListener(event, handler);
    });

    return () => {
      events.forEach(({ event, handler }) => {
        audio.removeEventListener(event, handler);
      });
    };
  }, [handleTimeUpdate, handleEnded, handleLoadStart, handleCanPlay, handleError]);

  return {
    audioRef,
    isLoading,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
  };
}
```

### useKeyboardShortcuts Hook
```typescript
// src/hooks/useKeyboardShortcuts.ts
import { useCallback, useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  global?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore if in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const { key, ctrlKey, shiftKey, altKey } = event;

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === key.toLowerCase() &&
        !!shortcut.ctrlKey === ctrlKey &&
        !!shortcut.shiftKey === shiftKey &&
        !!shortcut.altKey === altKey
      );
    });

    if (matchingShortcut) {
      if (preventDefault) {
        event.preventDefault();
      }
      
      console.log(`Keyboard shortcut triggered: ${matchingShortcut.description}`);
      matchingShortcut.action();
    }
  }, [shortcuts, enabled, preventDefault]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // Return shortcut help for UI display
  const getShortcutHelp = () => {
    return shortcuts.map(shortcut => {
      const keys = [];
      if (shortcut.ctrlKey) keys.push('Ctrl');
      if (shortcut.shiftKey) keys.push('Shift');
      if (shortcut.altKey) keys.push('Alt');
      keys.push(shortcut.key.toUpperCase());
      
      return {
        keys: keys.join(' + '),
        description: shortcut.description,
        global: shortcut.global || false,
      };
    });
  };

  return {
    getShortcutHelp,
  };
}
```

### useLocalStorage Hook
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useCallback, useEffect } from 'react';
import { StatePersistence } from '@/lib/statePersistence';

interface UseLocalStorageOptions<T> {
  key: string;
  defaultValue: T;
  syncAcrossTabs?: boolean;
}

export function useLocalStorage<T>(
  options: UseLocalStorageOptions<T>
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(options.key);
      return stored ? JSON.parse(stored) : options.defaultValue;
    } catch {
      return options.defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T) => {
    try {
      setValue(newValue);
      
      if (options.syncAcrossTabs) {
        // Use storage event for cross-tab sync
        StatePersistence.saveToLocalStorage(options.key, newValue);
        
        // Dispatch storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: options.key,
          newValue: JSON.stringify(newValue),
        }));
      } else {
        StatePersistence.saveToLocalStorage(options.key, newValue);
      }
    } catch (error) {
      console.error(`Failed to save ${options.key} to localStorage:`, error);
    }
  }, [options.key, options.syncAcrossTabs]);

  // Listen for storage events from other tabs
  useEffect(() => {
    if (!options.syncAcrossTabs) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === options.key && event.newValue !== null) {
        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [options.key, options.syncAcrossTabs]);

  // Remove value utility
  const removeValue = useCallback(() => {
    try {
      setValue(options.defaultValue);
      StatePersistence.removeFromLocalStorage(options.key);
      
      if (options.syncAcrossTabs) {
        window.dispatchEvent(new StorageEvent('storage', {
          key: options.key,
          newValue: null,
        }));
      }
    } catch (error) {
      console.error(`Failed to remove ${options.key} from localStorage:`, error);
    }
  }, [options.defaultValue, options.key, options.syncAcrossTabs]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
  };
}
```

### useInfiniteScroll Hook
```typescript
// src/hooks/useInfiniteScroll.ts
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasMore?: boolean;
  loading?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll<T>(
  loadMore: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { hasMore = true, loading = false, threshold = 0.8, rootMargin = '0px' } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting && hasMore && !loading) {
      setIsIntersecting(true);
      loadMore();
    } else {
      setIsIntersecting(false);
    }
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);
}, [handleIntersection, threshold, rootMargin]);

  return {
    targetRef,
    isIntersecting,
  };
}
```

---

## Utility Functions

### Format Utilities
```typescript
// src/utils/formatters.ts

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format duration in human readable format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0 phút';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds > 0 ? remainingSeconds + 's' : ''}`;
  }
  
  return `${minutes}m ${remainingSeconds > 0 ? remainingSeconds + 's' : ''}`;
};

/**
 * Format view count in Vietnamese
 */
export const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M lượt nghe`;
  }
  
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K lượt nghe`;
  }
  
  return `${views.toLocaleString('vi-VN')} lượt nghe`;
};

/**
 * Format chapter number with prefix
 */
export const formatChapter = (chapter: number): string => {
  return `Chương ${chapter}`;
};

/**
 * Format date in Vietnamese format
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

### Validation Utilities
```typescript
// src/utils/validators.ts

/**
 * Check if string is valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if string is valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if password meets security requirements
 */
export const isStrongPassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ thường');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 số');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate story data
 */
export const validateStory = (story: any): {
  isValid: boolean;
  errors: string[];
} => {
  const errors = [];
  
  if (!story.title || story.title.trim().length < 3) {
    errors.push('Tiêu đề phải có ít nhất 3 ký tự');
  }
  
  if (!story.author_name || story.author_name.trim().length < 2) {
    errors.push('Tên tác giả không được để trống');
  }
  
  if (story.total_chapters && story.total_chapters < 1) {
    errors.push('Số chương phải lớn hơn 0');
  }
  
  if (story.rating_avg && (story.rating_avg < 1 || story.rating_avg > 5)) {
    errors.push('Điểm đánh giá phải từ 1 đến 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### Array Utilities
```typescript
// src/utils/arrayUtils.ts

/**
 * Safely get item from array
 */
export const safeGet = <T>(array: T[], index: number, defaultValue?: T): T => {
  if (index < 0 || index >= array.length) {
    return defaultValue as T;
  }
  return array[index];
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
};

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    
    if (seen.has(value)) {
      return false;
    }
    
    seen.add(value);
    return true;
  });
};

/**
 * Sort array by multiple criteria
 */
export const sortBy = <T>(
  array: T[],
  criteria: (item: T) => (string | number)[],
  orders: ('asc' | 'desc')[] = []
): T[] => {
  return [...array].sort((a, b) => {
    for (let i = 0; i < criteria.length; i++) {
      const aValue = criteria[i](a);
      const bValue = criteria[i](b);
      const order = orders[i] || 'asc';
      
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, 'vi-VN');
      }
      
      if (order === 'desc') {
        comparison = -comparison;
      }
      
      if (comparison !== 0) {
        return comparison;
      }
    }
    
    return 0;
  });
};
```

### Object Utilities
```typescript
// src/utils/objectUtils.ts

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key as keyof T]);
    });
    return cloned;
  }
  
  return obj;
};

/**
 * Pick specific keys from object
 */
export const pick = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  
  return result;
};

/**
 * Omit specific keys from object
 */
export const omit = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = {} as Omit<T, K>;
  
  Object.keys(obj).forEach(key => {
    const typedKey = key as K;
    if (!keys.includes(typedKey)) {
      result[typedKey] = obj[typedKey];
    }
  });
  
  return result;
};

/**
 * Merge objects with type safety
 */
export const merge = <T extends object>(...objects: Partial<T>[]): T => {
  return objects.reduce((result, obj) => ({ ...result, ...obj }), {} as T);
};
```

---

## Performance Utilities

### Debounce Function
```typescript
// src/utils/debounce.ts

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: any[] = [];

  const debounced = ((...args: any[]) => {
    lastArgs = args;
    
    if (immediate && !timeout) {
      return func.apply(this, args);
    }
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        return func.apply(this, lastArgs);
      }
    }, wait);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
```

### Throttle Function
```typescript
// src/utils/throttle.ts

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  let lastFunc: ReturnType<T> | null = null;
  let lastRan = 0;

  return ((...args: any[]) => {
    const context = this;
    const now = Date.now();
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = now;
    } else if (now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    }
  }) as T;
}
```

### Performance Monitor
```typescript
// src/utils/performance.ts

export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  
  static mark(name: string): void {
    this.marks.set(name, performance.now());
  }
  
  static measure(name: string, startMark?: string): number {
    const startTime = startMark 
      ? this.marks.get(startMark) || 0
      : 0;
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    
    this.marks.set(name, endTime);
    return duration;
  }
  
  static getMeasure(name: string): number | null {
    return this.marks.get(name) || null;
  }
  
  static getAllMarks(): Record<string, number> {
    const result: Record<string, number> = {};
    this.marks.forEach((time, mark) => {
      result[mark] = time;
    });
    return result;
  }
  
  static clear(): void {
    this.marks.clear();
  }
}
```

These hooks and utilities provide a solid foundation for building performant, maintainable, and feature-rich React components in the AudioTruyen Clone application.