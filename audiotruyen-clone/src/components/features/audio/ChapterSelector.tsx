'use client';

import { memo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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

    return (
        <Select
            value={selectedChapter.toString()}
            onValueChange={(value) => onChapterChange(Number(value))}
        >
            <SelectTrigger className="w-full sm:w-[280px] h-12 rounded-xl bg-muted/40 border-none shadow-sm focus:ring-primary/20 text-sm font-bold">
                <SelectValue placeholder="Chọn chương" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-premium border-muted/50 max-h-[300px]">
                {chapters.map((chapter) => (
                    <SelectItem
                        key={chapter.number}
                        value={chapter.number.toString()}
                        className="cursor-pointer rounded-lg font-medium"
                    >
                        Chương {chapter.number}: {chapter.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
});
