'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';

interface SearchDropdownProps {
    results: Story[];
    isLoading: boolean;
    onItemClick: () => void;
    onViewAll: () => void;
}

export function SearchDropdown({ results, isLoading, onItemClick, onViewAll }: SearchDropdownProps) {
    return (
        <div className="absolute top-full right-0 mt-2 w-full sm:w-[300px] lg:w-[400px] bg-white rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden z-50">
            {isLoading ? (
                <div className="p-4 text-center text-sm text-[var(--color-text-muted)] flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    Đang tìm kiếm...
                </div>
            ) : results.length > 0 ? (
                <div className="py-2">
                    {results.map((story) => (
                        <Link
                            key={story.id}
                            href={`/truyen/${story.slug}`}
                            className="flex items-start gap-3 px-4 py-2 hover:bg-[var(--color-background)] transition-colors group"
                            onClick={onItemClick}
                        >
                            <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                <Image
                                    src={story?.cover_url || '/covers/cau-ma.jpg'}
                                    alt={story.title}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] truncate">
                                    {story.title}
                                </h4>
                                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                    {story.author_name || 'Đang cập nhật'}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                    {story.total_chapters?.toLocaleString() || 0} chương
                                </p>
                            </div>
                        </Link>
                    ))}
                    <div className="border-t border-[var(--color-border)] mt-2 pt-2 px-2">
                        <button
                            onClick={onViewAll}
                            className="w-full py-2 text-center text-sm text-[var(--color-primary)] font-medium hover:bg-[var(--color-background)] rounded transition-colors"
                        >
                            Xem tất cả kết quả
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">
                    Không tìm thấy truyện nào.
                </div>
            )}
        </div>
    );
}
