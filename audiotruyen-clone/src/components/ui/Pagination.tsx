'use client';

import Link from 'next/link';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center my-6">
            <MuiPagination
                count={totalPages}
                page={currentPage}
                color="primary"
                renderItem={(item) => (
                    <PaginationItem
                        component={Link}
                        href={item.page === 1 ? baseUrl : `${baseUrl}?page=${item.page}`}
                        {...item}
                        // Prevent navigation for current page or non-clickable items
                        onClick={(e) => {
                            if (item.selected || item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
                                e.preventDefault();
                            }
                        }}
                    />
                )}
            />
        </div>
    );
}
