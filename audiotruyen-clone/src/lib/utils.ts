import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes using clsx and tailwind-merge.
 * 
 * This utility combines the power of clsx (conditional class names)
 * with tailwind-merge (intelligent Tailwind class merging) to handle
 * className conflicts and conditional styling.
 * 
 * @param inputs - Class names or conditional class objects
 * @returns Merged and deduplicated class string
 * 
 * @example
 * ```tsx
 * className={cn(
 *   "base-class",
 *   isActive && "active-class",
 *   { "error-class": hasError }
 * )}
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking `func` until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 * 
 * Useful for optimizing expensive operations triggered by frequent events
 * like window resize, scroll, or input changes.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced version of the function
 * 
 * @example
 * ```tsx
 * const saveProgress = debounce(() => {
 *   localStorage.setItem('progress', currentTime);
 * }, 5000);
 * 
 * // Will only save once after 5 seconds of inactivity
 * audio.addEventListener('timeupdate', saveProgress);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
