import { Story, Chapter } from '@/lib/types';

export const mockStory: Story = {
    id: 1,
    slug: 'test-story',
    title: 'Test Story Title',
    cover_url: 'https://via.placeholder.com/200x300',
    author_name: 'Test Author',
    author_id: 1,
    categories: [{ id: 1, name: 'Tiên Hiệp', slug: 'tien-hiep' }],
    status: 'ongoing',
    total_chapters: 10,
    views: 1000,
    rating_avg: '4.5',
    rating_count: 100,
    description: 'This is a test story description.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

export const mockChapters: (Chapter & { number: number; title: string; audioUrl: string })[] = [
    {
        id: 1,
        story_id: 1,
        number: 1,
        title: 'Chapter 1 Title',
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration_sec: 120,
    },
    {
        id: 2,
        story_id: 1,
        number: 2,
        title: 'Chapter 2 Title',
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration_sec: 150,
    },
];
