import { MetadataRoute } from 'next';
import { StoryService } from '@/services/story.service';
import { CategoryService } from '@/services/category.service';
import { Category } from '@/lib/types';

const BASE_URL = 'https://audiotruyen-clone.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Fetch data
    const storiesRes = await StoryService.getAll({ limit: 5000 });
    const categoriesRes = await CategoryService.getAll();

    const stories = storiesRes.success ? storiesRes.data?.items || [] : [];
    const categories = categoriesRes.success ? categoriesRes.data?.items || [] : [];

    // 2. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/the-loai`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // 3. Story Pages
    const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
        url: `${BASE_URL}/truyen/${story.slug}`,
        lastModified: new Date(story.updated_at),
        changeFrequency: story.status === 'completed' ? 'monthly' : 'weekly',
        priority: 0.7,
    }));

    // 4. Category Pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat: Category) => ({
        url: `${BASE_URL}/the-loai/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...staticPages, ...storyPages, ...categoryPages];
}
