import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pagination from './Pagination';

// Mock next/link for testing
vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

import { vi } from 'vitest';

describe('Pagination', () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 10,
        baseUrl: '/danh-sach',
    };

    it('renders pagination nav', () => {
        render(<Pagination {...defaultProps} />);

        expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('returns null when totalPages is 1', () => {
        const { container } = render(<Pagination {...defaultProps} totalPages={1} />);

        expect(container.firstChild).toBeNull();
    });

    it('renders prev and next buttons', () => {
        render(<Pagination {...defaultProps} />);

        expect(screen.getByText(/trước/i)).toBeInTheDocument();
        expect(screen.getByText(/sau/i)).toBeInTheDocument();
    });

    it('disables prev button on first page', () => {
        render(<Pagination {...defaultProps} currentPage={1} />);

        const prevButton = screen.getByText(/trước/i);
        expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables next button on last page', () => {
        render(<Pagination {...defaultProps} currentPage={10} />);

        const nextButton = screen.getByText(/sau/i);
        expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('highlights current page', () => {
        render(<Pagination {...defaultProps} currentPage={3} />);

        const currentPageLink = screen.getByRole('link', { current: 'page' });
        expect(currentPageLink).toHaveTextContent('3');
    });

    it('generates correct href for page links', () => {
        render(<Pagination {...defaultProps} currentPage={3} />);

        const page4Link = screen.getByRole('link', { name: '4' });
        expect(page4Link).toHaveAttribute('href', '/danh-sach?page=4');
    });

    it('generates correct href for prev button', () => {
        render(<Pagination {...defaultProps} currentPage={5} />);

        const prevButton = screen.getByText(/trước/i);
        expect(prevButton).toHaveAttribute('href', '/danh-sach?page=4');
    });

    it('generates correct href for next button', () => {
        render(<Pagination {...defaultProps} currentPage={5} />);

        const nextButton = screen.getByText(/sau/i);
        expect(nextButton).toHaveAttribute('href', '/danh-sach?page=6');
    });

    it('shows ellipsis for large page counts', () => {
        render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);

        const ellipsis = screen.getAllByText('...');
        expect(ellipsis.length).toBeGreaterThanOrEqual(1);
    });

    it('shows first and last page in pagination', () => {
        render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

        expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '10' })).toBeInTheDocument();
    });
});
