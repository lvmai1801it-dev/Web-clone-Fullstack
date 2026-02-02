'use client';

import { useRouter } from 'next/navigation';
import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Search, Menu, X } from 'lucide-react';
import { MuiInput } from '@/components/ui/MuiInput';
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
        <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40 shadow-sm">
            <div className="container-main">
                {/* Top Row - Logo & Search */}
                <div className="flex items-center justify-between py-2 gap-2">
                    {/* Menu Button - Left */}
                    <IconButton
                        className="-ml-2 text-[var(--color-text-primary)]"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Mở menu"
                        size="large"
                    >
                        <Menu size={24} />
                    </IconButton>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <Logo />
                    </div>

                    {/* Desktop Navigation */}
                    <DesktopNav categories={categories} />

                    {/* Actions & Search */}
                    <div className="flex items-center gap-2">
                        <UserActions />

                        {/* Search Bar (Desktop) */}
                        <div className="relative hidden sm:block" ref={searchRef}>
                            <div className="relative flex items-center">
                                <MuiInput
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (searchQuery.trim()) setShowDropdown(true);
                                    }}
                                    className="w-48 lg:w-64 [&_.MuiOutlinedInput-root]:rounded-full"
                                    size="small"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleSearch}
                                                    edge="end"
                                                    size="small"
                                                    className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                                                >
                                                    <Search size={18} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
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
                        <div className="sm:hidden">
                            <IconButton
                                className="text-[var(--color-text-primary)]"
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                aria-label={isMobileSearchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
                            >
                                {isMobileSearchOpen ? <X size={24} /> : <Search size={24} />}
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar Expansion */}
            {isMobileSearchOpen && (
                <div className="sm:hidden py-3 px-4 border-t border-[var(--color-border)] animate-in slide-in-from-top-2 duration-200 bg-white">
                    <div className="relative">
                        <MuiInput
                            autoFocus
                            placeholder="Tìm kiếm truyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            fullWidth
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearch}
                                            edge="end"
                                            size="small"
                                        >
                                            <Search size={18} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    {/* Mobile Live Results */}
                    {searchQuery && (
                        <div className="mt-2 relative h-0 z-50">
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

