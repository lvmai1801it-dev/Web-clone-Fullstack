import { MetadataRoute } from 'next';
import { StoryService } from '@/services/story.service';
import { CategoryService } from '@/services/category.service';
import { Category } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotruyen-clone.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Fetch data with larger limits
    const storiesRes = await StoryService.getAll({ limit: 10000 }); // Increased limit
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
        {
            url: `${BASE_URL}/danh-sach/moi-cap-nhat`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/danh-sach/hoan-thanh`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/danh-sach/hot`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    // 3. Story Pages
    const storyPages: MetadataRoute.Sitemap = stories.map((story) => {
        // Higher priority for popular or completed stories
        let priority = 0.6;
        if (story.views > 10000) priority += 0.1;
        if (story.status === 'completed') priority += 0.1;

        return {
            url: `${BASE_URL}/truyen/${story.slug}`,
            lastModified: new Date(story.updated_at),
            changeFrequency: story.status === 'completed' ? 'monthly' : 'daily',
            priority: Math.min(priority, 1.0),
        };
    });

    // 4. Category Pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat: Category) => ({
        url: `${BASE_URL}/the-loai/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticPages, ...storyPages, ...categoryPages];
}
