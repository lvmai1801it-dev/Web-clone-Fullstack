'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Trophy, Flame } from 'lucide-react';
import { Category } from '@/lib/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
        <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Menu Content - subtract bottom nav height (60px + ~20px safe area) */}
            <div className="absolute top-0 left-0 w-[280px] h-[calc(100dvh-80px)] bg-background shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                    <span className="text-xl font-black text-primary tracking-tight">
                        AudioTruyen
                    </span>
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            aria-label="Đóng menu"
                            className="rounded-full hover:bg-muted"
                        >
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Navigation - scrollable */}
                <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-3 space-y-1">
                    <div className="px-3 py-2 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
                        Danh sách
                    </div>
                    <Link
                        href="/danh-sach/moi-cap-nhat"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                        onClick={onClose}
                    >
                        <Sparkles size={18} className="text-primary/70" />
                        Truyện mới cập nhật
                    </Link>
                    <Link
                        href="/danh-sach/hoan-thanh"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-green-500/5 hover:text-green-600 transition-all active:scale-95"
                        onClick={onClose}
                    >
                        <Trophy size={18} className="text-green-600/70" />
                        Truyện hoàn thành
                    </Link>
                    <Link
                        href="/danh-sach/hot"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-500/5 hover:text-orange-600 transition-all active:scale-95"
                        onClick={onClose}
                    >
                        <Flame size={18} className="text-orange-600/70" />
                        Truyện hot
                    </Link>

                    <div className="px-3 py-2 font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-6">
                        Thể loại
                    </div>
                    <div className="grid grid-cols-2 gap-2 px-1">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/the-loai/${cat.slug}`}
                                className="block px-3 py-2 text-sm rounded-lg hover:bg-muted font-medium transition-colors truncate border border-transparent hover:border-muted-foreground/10"
                                onClick={onClose}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/20 shrink-0">
                    <Button
                        onClick={() => {
                            onClose();
                            window.location.href = '/dang-nhap';
                        }}
                        className="w-full font-bold shadow-lg shadow-primary/25"
                    >
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </div>
    );
}
