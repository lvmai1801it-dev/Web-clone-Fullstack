/**
 * Test Utilities for AudioTruyen Clone
 * Provides common test helpers, custom render functions, and mock data generators.
 */
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { AudioProvider, type Chapter as AudioChapter } from '@/contexts/AudioContext';
import type { Story, Chapter, Category, Author, User } from '@/lib/types';

// === Custom Render with Providers ===

interface WrapperProps {
    children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
    return <AudioProvider>{children}</AudioProvider>;
}

/**
 * Custom render function that wraps components with all necessary providers
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
    return render(ui, { wrapper: AllProviders, ...options });
}

// === Mock Data Generators ===

let idCounter = 1;

/**
 * Creates a mock Story object
 */
export function createMockStory(overrides: Partial<Story> = {}): Story {
    const id = overrides.id ?? idCounter++;
    return {
        id,
        slug: `truyen-${id}`,
        title: `Truyện Test ${id}`,
        cover_url: `https://example.com/cover-${id}.jpg`,
        author_name: 'Tác giả Test',
        author_id: 1,
        narrator: 'Người đọc Test',
        categories: [createMockCategory()],
        status: 'ongoing',
        total_chapters: 10,
        views: 1000,
        rating_avg: '4.5',
        rating_count: 50,
        description: 'Mô tả truyện test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...overrides,
    };
}

/**
 * Creates a mock Chapter object
 */
export function createMockChapter(overrides: Partial<Chapter> = {}): Chapter {
    const id = overrides.id ?? idCounter++;
    return {
        id,
        story_id: 1,
        number: id,
        title: `Chương ${id}`,
        audio_url: `https://example.com/audio-${id}.mp3`,
        duration_sec: 1800,
        created_at: new Date().toISOString(),
        ...overrides,
    };
}

/**
 * Creates a mock AudioChapter for AudioContext
 */
export function createMockAudioChapter(overrides: Partial<AudioChapter> = {}): AudioChapter {
    const number = overrides.number ?? idCounter++;
    return {
        number,
        title: `Chương ${number}`,
        audioUrl: `https://example.com/audio-${number}.mp3`,
        ...overrides,
    };
}

/**
 * Creates a mock Category object
 */
export function createMockCategory(overrides: Partial<Category> = {}): Category {
    const id = overrides.id ?? idCounter++;
    return {
        id,
        slug: `the-loai-${id}`,
        name: `Thể loại ${id}`,
        story_count: 100,
        ...overrides,
    };
}

/**
 * Creates a mock Author object
 */
export function createMockAuthor(overrides: Partial<Author> = {}): Author {
    const id = overrides.id ?? idCounter++;
    return {
        id,
        name: `Tác giả ${id}`,
        slug: `tac-gia-${id}`,
        description: 'Mô tả tác giả test',
        story_count: 10,
        ...overrides,
    };
}

/**
 * Creates a mock User object
 */
export function createMockUser(overrides: Partial<User> = {}): User {
    const id = overrides.id ?? idCounter++;
    return {
        id,
        username: `user${id}`,
        email: `user${id}@example.com`,
        full_name: `Người dùng ${id}`,
        role: 'user',
        avatar_url: `https://example.com/avatar-${id}.jpg`,
        created_at: new Date().toISOString(),
        ...overrides,
    };
}

/**
 * Creates multiple mock objects
 */
export function createMockList<T>(
    factory: (overrides?: Partial<T>) => T,
    count: number,
    overrides?: Partial<T>
): T[] {
    return Array.from({ length: count }, () => factory(overrides));
}

// === Test Helpers ===

/**
 * Waits for a specified duration
 */
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resets the ID counter (useful for test isolation)
 */
export function resetIdCounter(): void {
    idCounter = 1;
}

// === Re-exports for convenience ===
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
