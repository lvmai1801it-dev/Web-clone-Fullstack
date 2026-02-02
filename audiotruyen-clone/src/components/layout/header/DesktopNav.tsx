'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';
import { Facebook, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DesktopNavProps {
    categories: Category[];
}

export function DesktopNav({ categories }: DesktopNavProps) {
    return (
        <nav className="hidden md:flex items-center gap-6">
            {/* Danh sách Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors focus:outline-none">
                    Danh sách
                    <ChevronDown size={14} className="opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px] rounded-xl shadow-premium border-muted animate-in fade-in zoom-in-95 duration-200">
                    <DropdownMenuItem asChild>
                        <Link href="/danh-sach/moi-cap-nhat" className="cursor-pointer">
                            Truyện mới cập nhật
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/danh-sach/hoan-thanh" className="cursor-pointer">
                            Truyện hoàn thành
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/danh-sach/hot" className="cursor-pointer">
                            Truyện hot
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Thể loại Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors focus:outline-none">
                    Thể loại
                    <ChevronDown size={14} className="opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[450px] p-2 rounded-xl shadow-premium border-muted animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-3 gap-1">
                        {categories.map((category) => (
                            <DropdownMenuItem key={category.id} asChild className="focus:bg-muted p-0">
                                <Link
                                    href={`/the-loai/${category.slug}`}
                                    className="block w-full px-3 py-2 text-xs font-medium rounded-md truncate transition-colors"
                                >
                                    {category.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Facebook Link */}
            <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-[#1877F2] transition-colors"
                aria-label="Facebook"
            >
                <Facebook size={18} className="text-[#1877F2]" />
                <span className="hidden lg:inline">Cộng đồng</span>
            </a>
        </nav>
    );
}
