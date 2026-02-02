'use client';

import { memo } from 'react';
import { Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';

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

    const handleChange = (event: SelectChangeEvent<number>) => {
        onChapterChange(Number(event.target.value));
    };

    return (
        <FormControl size="small" sx={{ minWidth: 120, flex: 1, maxWidth: { xs: 180, sm: 220 } }}>
            <Select
                value={selectedChapter}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Chọn chương' }}
                sx={{
                    height: 44,
                    bgcolor: 'background.paper',
                    '& .MuiSelect-select': {
                        py: 1.5,
                    }
                }}
            >
                {chapters.map((chapter) => (
                    <MenuItem key={chapter.number} value={chapter.number}>
                        Chương {chapter.number}: {chapter.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
});
