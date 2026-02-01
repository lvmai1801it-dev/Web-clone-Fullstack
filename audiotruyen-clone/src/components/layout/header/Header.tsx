'use client';

import { useRouter } from 'next/navigation';
import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Button, Input } from '@/components/ui';
import { Category } from '@/lib/types';
import { CategoryService } from '@/services';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { useSearch } from '@/hooks';
import { SearchDropdown } from './SearchDropdown';
import { DesktopNav } from './DesktopNav';
import { UserActions } from './UserActions';

export default function Header() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const {
        searchQuery,
        setSearchQuery,
        results,
        isLoading,
        showDropdown,
        setShowDropdown,
    } = useSearch();

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowDropdown]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getAll();
                if (response.success && response.data) {
                    setCategories(response.data.items);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowDropdown(false);
            setIsMobileSearchOpen(false);
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
                        className="md:hidden -ml-2 text-[var(--color-text-primary)] touch-target"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Mở menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </Button>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <Logo />
                    </div>

                    {/* Desktop Navigation */}
                    <DesktopNav categories={categories} />

                    {/* Actions & Search */}
                    <div className="flex items-center gap-4">
                        <UserActions />

                        {/* Search Bar (Desktop) */}
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
                                    aria-label="Ô tìm kiếm"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-9 w-9 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                                    aria-label="Bắt đầu tìm kiếm"
                                    onClick={handleSearch}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Button>
                            </div>

                            {/* Live Search Dropdown */}
                            {showDropdown && searchQuery && (
                                <SearchDropdown
                                    results={results}
                                    isLoading={isLoading}
                                    onItemClick={() => setShowDropdown(false)}
                                    onViewAll={handleSearch}
                                />
                            )}
                        </div>

                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden text-[var(--color-text-primary)] touch-target"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            aria-label={isMobileSearchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
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
                            aria-label="Ô tìm kiếm điện thoại"
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

                    {/* Mobile Live Results (Reuse Desktop Dropdown style but full width) */}
                    {searchQuery && (
                        <div className="mt-2 relative h-0">
                            <SearchDropdown
                                results={results}
                                isLoading={isLoading}
                                onItemClick={() => {
                                    setShowDropdown(false);
                                    setIsMobileSearchOpen(false);
                                }}
                                onViewAll={handleSearch}
                            />
                        </div>
                    )}
                </div>
            )}

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                categories={categories}
            />
        </header>
    );
}

