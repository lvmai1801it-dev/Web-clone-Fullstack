'use client';

import Link from 'next/link';

interface LogoProps {
    className?: string;
}

export function Logo({ className = '' }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            {/* Mobile Icon/Short Text */}
            <span className="md:hidden text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'serif' }}>
                AUDIOTRUYENFREE.SITE
            </span>

            {/* Desktop Full Text */}
            <span className="hidden md:inline text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'serif' }}>
                AUDIOTRUYENFREE.SITE
            </span>
        </Link>
    );
}
