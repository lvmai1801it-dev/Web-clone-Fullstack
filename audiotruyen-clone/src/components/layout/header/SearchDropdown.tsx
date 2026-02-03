'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchDropdownProps {
    results: Story[];
    isLoading: boolean;
    onItemClick: () => void;
    onViewAll: () => void;
}

export function SearchDropdown({ results, isLoading, onItemClick, onViewAll }: SearchDropdownProps) {
    return (
        <div className="absolute top-full right-0 mt-3 w-full sm:w-[320px] lg:w-[420px] bg-popover text-popover-foreground rounded-2xl shadow-premium-lg border border-primary/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
                    <span className="font-bold tracking-tight">Đang lục tìm kho truyện...</span>
                </div>
            ) : results.length > 0 ? (
                <div className="py-2">
                    <div className="px-4 py-2 border-b border-muted/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Kết quả tìm kiếm</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
                        {results.map((story) => (
                            <Link
                                key={story.id}
                                href={`/truyen/${story.slug}`}
                                className="flex items-start gap-4 px-4 py-3 hover:bg-primary/5 transition-all group border-b border-muted/10 last:border-none"
                                onClick={onItemClick}
                            >
                                <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted shadow-sm border border-white/20">
                                    <Image
                                        src={story?.cover_url || '/covers/cau-ma.jpg'}
                                        alt={story.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110 duration-500"
                                        sizes="48px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
                                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate mb-0.5">
                                        {story.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground/80 font-medium truncate">
                                        {story.author_name || 'Đang cập nhật'}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="text-[10px] font-black uppercase text-primary tracking-tighter bg-primary/10 px-1.5 py-0.5 rounded">
                                            {story.total_chapters?.toLocaleString() || 0} CHƯƠNG
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="p-2 bg-muted/20">
                        <Button
                            onClick={onViewAll}
                            variant="ghost"
                            className="w-full h-11 text-center text-sm text-primary font-black uppercase tracking-wider hover:bg-primary/10 rounded-xl transition-all group"
                        >
                            Xem tất cả kết quả
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="p-10 text-center text-muted-foreground">
                    <p className="font-bold text-sm">Không tìm thấy truyện nào.</p>
                    <p className="text-xs mt-1 text-muted-foreground/60 font-medium">Thử với từ khóa khác xem sao bạn nhé!</p>
                </div>
            )}
        </div>
    );
}
