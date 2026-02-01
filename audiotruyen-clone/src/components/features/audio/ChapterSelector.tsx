'use client';

import { memo } from 'react';

interface Chapter {
    number: number;
    title: string;
    audioUrl: string;
}

interface ChapterSelectorProps {
    chapters: Chapter[];
    selectedChapter: number;
    onChapterChange: (chapter: number) => void;
}

export const ChapterSelector = memo(function ChapterSelector({
    chapters,
    selectedChapter,
    onChapterChange,
}: ChapterSelectorProps) {
    if (chapters.length === 0) return null;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChapterChange(Number(e.target.value));
    };

    return (
        <select
            value={selectedChapter}
            onChange={handleChange}
            className="flex-1 px-3 py-1.5 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white max-w-[180px] sm:max-w-[220px] h-11"
            aria-label="Chọn chương"
        >
            {chapters.map((chapter) => (
                <option key={chapter.number} value={chapter.number}>
                    Chương {chapter.number}: {chapter.title}
                </option>
            ))}
        </select>
    );
});
