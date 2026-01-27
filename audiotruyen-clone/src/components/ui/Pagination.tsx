import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const showPages = 5;
        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        const end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav className="flex items-center justify-center gap-1 my-6" aria-label="Pagination">
            <Link
                href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}
                className={`px-3 py-2 text-sm rounded border transition-colors ${currentPage === 1
                    ? 'text-[var(--color-text-muted)] border-[var(--color-border)] pointer-events-none opacity-50'
                    : 'text-[var(--color-primary)] border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white'
                    }`}
                aria-disabled={currentPage === 1}
            >
                ‹ Trước
            </Link>

            {visiblePages.map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-[var(--color-text-muted)]">...</span>
                ) : (
                    <Link
                        key={page}
                        href={`${baseUrl}?page=${page}`}
                        className={`w-9 h-9 flex items-center justify-center text-sm rounded border transition-colors ${page === currentPage
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : 'text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                            }`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </Link>
                )
            ))}

            <Link
                href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'}
                className={`px-3 py-2 text-sm rounded border transition-colors ${currentPage === totalPages
                    ? 'text-[var(--color-text-muted)] border-[var(--color-border)] pointer-events-none opacity-50'
                    : 'text-[var(--color-primary)] border-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white'
                    }`}
                aria-disabled={currentPage === totalPages}
            >
                Sau ›
            </Link>
        </nav>
    );
}
