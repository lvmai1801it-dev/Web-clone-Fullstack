import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChapterSelector } from './ChapterSelector';

describe('ChapterSelector', () => {
    const mockChapters = [
        { number: 1, title: 'Khởi đầu', audioUrl: '/audio/1.mp3' },
        { number: 2, title: 'Cuộc gặp gỡ', audioUrl: '/audio/2.mp3' },
        { number: 3, title: 'Bí mật', audioUrl: '/audio/3.mp3' },
    ];

    const defaultProps = {
        chapters: mockChapters,
        selectedChapter: 1,
        onChapterChange: vi.fn(),
    };

    it('renders chapter select element', () => {
        render(<ChapterSelector {...defaultProps} />);

        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders all chapter options', () => {
        render(<ChapterSelector {...defaultProps} />);

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('Chương 1: Khởi đầu');
        expect(options[1]).toHaveTextContent('Chương 2: Cuộc gặp gỡ');
        expect(options[2]).toHaveTextContent('Chương 3: Bí mật');
    });

    it('has correct selected value', () => {
        render(<ChapterSelector {...defaultProps} selectedChapter={2} />);

        expect(screen.getByRole('combobox')).toHaveValue('2');
    });

    it('calls onChapterChange when selection changes', () => {
        const onChapterChange = vi.fn();
        render(<ChapterSelector {...defaultProps} onChapterChange={onChapterChange} />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
        expect(onChapterChange).toHaveBeenCalledWith(3);
    });

    it('returns null when chapters is empty', () => {
        const { container } = render(<ChapterSelector {...defaultProps} chapters={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it('has accessible label', () => {
        render(<ChapterSelector {...defaultProps} />);

        expect(screen.getByLabelText(/chọn chương/i)).toBeInTheDocument();
    });
});
