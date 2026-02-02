'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Trang chủ',
            href: '/',
            icon: Home,
        },
        {
            label: 'Thư viện',
            href: '/danh-sach/moi-cap-nhat',
            icon: Library,
        },
        {
            label: 'Tìm kiếm',
            href: '/tim-kiem',
            icon: Search,
        },
        {
            label: 'Tài khoản',
            href: '/dang-nhap',
            icon: User,
        },
    ];

    return (
        <nav
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-primary/5 py-3 px-6 flex items-center justify-around z-50 md:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)] box-content h-[60px]"
            aria-label="Điều hướng chính"
            role="navigation"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[60px] min-h-[50px] gap-1 rounded-2xl transition-all relative overflow-hidden active:scale-90",
                            isActive
                                ? 'text-primary bg-primary/5'
                                : 'text-muted-foreground/60 hover:text-primary hover:bg-muted/50'
                        )}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {isActive && (
                            <span
                                className="absolute top-0 w-12 h-1 bg-primary rounded-full opacity-100 transition-opacity duration-300"
                                style={{ willChange: 'opacity' }}
                            />
                        )}
                        <Icon
                            size={20}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={cn("transition-transform duration-300", isActive && "scale-110")}
                        />
                        <span className={cn(
                            "text-[9px] uppercase tracking-widest font-black transition-all",
                            isActive ? "opacity-100" : "opacity-60"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
