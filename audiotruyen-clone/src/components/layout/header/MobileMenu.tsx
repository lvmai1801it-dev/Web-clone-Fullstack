'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { IconButton, Button } from '@mui/material';
import { X } from 'lucide-react';
import { Category } from '@/lib/types';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Menu Content */}
            <div className="absolute top-0 bottom-0 left-0 w-[280px] bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                    <span className="text-xl font-bold text-[var(--color-primary)] font-serif">
                        MENU
                    </span>
                    <IconButton onClick={onClose} aria-label="Đóng menu">
                        <X size={24} />
                    </IconButton>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">

                    <div className="px-4 py-2 font-semibold text-[var(--color-text-secondary)] uppercase text-xs">
                        Danh sách
                    </div>
                    <Link
                        href="/danh-sach/moi-cap-nhat"
                        className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--color-background)]"
                        onClick={onClose}
                    >
                        Truyện mới cập nhật
                    </Link>
                    <Link
                        href="/danh-sach/hoan-thanh"
                        className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--color-background)]"
                        onClick={onClose}
                    >
                        Truyện hoàn thành
                    </Link>
                    <Link
                        href="/danh-sach/hot"
                        className="block px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--color-background)]"
                        onClick={onClose}
                    >
                        Truyện hot
                    </Link>

                    <div className="px-4 py-2 font-semibold text-[var(--color-text-secondary)] uppercase text-xs mt-4">
                        Thể loại
                    </div>
                    <div className="grid grid-cols-2 gap-1 px-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/the-loai/${cat.slug}`}
                                className="block px-3 py-2 text-sm rounded hover:bg-[var(--color-background)] truncate"
                                onClick={onClose}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-[var(--color-border)]">
                    <Button
                        component={Link}
                        href="/login"
                        onClick={onClose}
                        variant="contained"
                        fullWidth
                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                    >
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </div>
    );
}
