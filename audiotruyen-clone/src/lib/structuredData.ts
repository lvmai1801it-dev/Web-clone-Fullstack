import { Story, Chapter } from './types';

export function generateStoryStructuredData(story: Story) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Audiobook',
        name: story.title,
        description: story.description,
        author: {
            '@type': 'Person',
            name: story.author_name,
        },
        narrator: {
            '@type': 'Person',
            name: story.narrator || 'Hệ thống TTS',
        },
        publisher: {
            '@type': 'Organization',
            name: 'AudioTruyen Clone',
            url: 'https://audiotruyen-clone.vercel.app',
        },
        datePublished: story.created_at,
        dateModified: story.updated_at,
        inLanguage: 'vi-VN',
        image: [story.cover_url],
        url: `https://audiotruyen-clone.vercel.app/truyen/${story.slug}`,
        aggregateRating: story.rating_avg ? {
            '@type': 'AggregateRating',
            ratingValue: story.rating_avg,
            ratingCount: story.rating_count,
        } : undefined,
    };

    return JSON.stringify(structuredData);
}

export function generateWebsiteStructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AudioTruyen Clone',
        url: 'https://audiotruyen-clone.vercel.app',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://audiotruyen-clone.vercel.app/tim-kiem?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    return JSON.stringify(structuredData);
}
