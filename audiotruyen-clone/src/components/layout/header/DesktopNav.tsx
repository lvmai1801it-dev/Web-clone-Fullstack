'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';

interface DesktopNavProps {
    categories: Category[];
}

export function DesktopNav({ categories }: DesktopNavProps) {
    return (
        <nav className="hidden md:flex items-center gap-6">
            {/* Danh sách Dropdown */}
            <div className="relative group">
                <button
                    className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] py-2"
                    aria-haspopup="true"
                >
                    Danh sách
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {/* Hover Dropdown */}
                <div className="absolute top-full left-0 mt-0 pt-2 hidden group-hover:block w-[180px] z-50">
                    <div className="bg-white border border-[var(--color-border)] rounded-md shadow-lg py-2">
                        <Link href="/danh-sach/moi-cap-nhat" className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">
                            Truyện mới cập nhật
                        </Link>
                        <Link href="/danh-sach/hoan-thanh" className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">
                            Truyện hoàn thành
                        </Link>
                        <Link href="/danh-sach/hot" className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">
                            Truyện hot
                        </Link>
                    </div>
                </div>
            </div>

            {/* Thể loại Dropdown */}
            <div className="relative group">
                <button
                    className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] py-2"
                    aria-haspopup="true"
                >
                    Thể loại
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div className="absolute top-full left-0 mt-0 pt-2 hidden group-hover:block w-[400px] z-50">
                    <div className="bg-white border border-[var(--color-border)] rounded-md shadow-lg py-3 px-3 grid grid-cols-2 gap-1">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/the-loai/${category.slug}`}
                                className="block px-3 py-2 text-sm rounded hover:bg-[var(--color-background)] truncate"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
