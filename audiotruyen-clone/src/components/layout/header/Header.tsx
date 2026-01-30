'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { CategoryService } from '@/services/category.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Story } from '@/lib/types';
import { MobileMenu } from './MobileMenu';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { StoryService } from '@/services/story.service';

export default function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [results, setResults] = useState<Story[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAll();
                if (response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Debounced search
    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            setIsLoading(true);
            setShowDropdown(true);

            try {
                const response = await StoryService.search(searchQuery.trim());
                if (response.success && response.data?.items) {
                    setResults(response.data.items);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);

    }, [searchQuery]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowDropdown(false);
            router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40">
            <div className="container-main">
                {/* Top Row - Logo & Search */}
                <div className="flex items-center justify-between py-3 gap-2">
                    {/* Mobile Menu Button - Left */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden -ml-2 text-[var(--color-text-primary)]"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </Button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'serif' }}>
                            AUDIOTRUYEN.ORG
                        </span>
                    </Link>

                    {/* Navigation Dropdowns (Desktop) */}
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
                            <div className="absolute top-full left-0 mt-0 pt-2 hidden group-hover:block w-[180px]">
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
                            <div className="absolute top-full left-0 mt-0 pt-2 hidden group-hover:block w-[400px]">
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

                    {/* Social & Search */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="hidden xl:inline">Facebook</span>
                        </a>

                        {/* Search Bar */}
                        <div className="relative hidden sm:block" ref={searchRef}>
                            <div className="relative">
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (searchQuery.trim()) setShowDropdown(true);
                                    }}
                                    className="w-48 lg:w-64 h-9 pr-9"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-9 w-9 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                                    aria-label="Tìm kiếm"
                                    onClick={handleSearch}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Button>
                            </div>

                            {/* Live Search Dropdown */}
                            {showDropdown && searchQuery && (
                                <div className="absolute top-full right-0 mt-2 w-[300px] lg:w-[400px] bg-white rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden z-50">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-sm text-[var(--color-text-muted)]">
                                            Đang tìm kiếm...
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="py-2">
                                            {results.map((story) => (
                                                <Link
                                                    key={story.id}
                                                    href={`/truyen/${story.slug}`}
                                                    className="flex items-start gap-3 px-4 py-2 hover:bg-[var(--color-background)] transition-colors group"
                                                    onClick={() => setShowDropdown(false)}
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
                                                    onClick={handleSearch}
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
                            )}
                        </div>
                        {/* Mobile Search Icon Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden text-[var(--color-text-primary)]"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileSearchOpen ? "M6 18L18 6M6 6l12 12" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"} />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar Expansion */}
            {isMobileSearchOpen && (
                <div className="sm:hidden py-3 px-4 border-t border-[var(--color-border)] animate-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                        <Input
                            autoFocus
                            type="search"
                            placeholder="Tìm kiếm truyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full h-10 pr-10"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-10 w-10 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                            onClick={handleSearch}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Button>
                    </div>

                    {/* Mobile Live Results */}
                    {searchQuery && results.length > 0 && (
                        <div className="mt-2 bg-white rounded-lg border border-[var(--color-border)] shadow-lg max-h-[60vh] overflow-y-auto">
                            <div className="p-2">
                                {results.map((story) => (
                                    <Link
                                        key={story.id}
                                        href={`/truyen/${story.slug}`}
                                        className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-[var(--color-background)] transition-colors"
                                        onClick={() => {
                                            setIsMobileSearchOpen(false);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                            <Image
                                                src={story.cover_url || '/covers/cau-ma.jpg'}
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
                                <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                                    <button
                                        onClick={() => {
                                            handleSearch();
                                            setIsMobileSearchOpen(false);
                                        }}
                                        className="w-full py-2 text-center text-sm text-[var(--color-primary)] font-medium"
                                    >
                                        Xem tất cả kết quả
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {searchQuery && results.length === 0 && !isLoading && (
                        <div className="mt-2 p-4 text-center text-sm text-[var(--color-text-muted)] bg-white rounded-lg border border-[var(--color-border)]">
                            Không tìm thấy kết quả.
                        </div>
                    )}
                </div>
            )}

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} categories={categories} />
        </header>
    );
}
