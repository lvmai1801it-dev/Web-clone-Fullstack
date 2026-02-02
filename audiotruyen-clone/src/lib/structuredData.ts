import { Story, Chapter } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiotruyen-clone.vercel.app';

function formatDurationForSEO(chapters: number): string {
    const estimatedMinutesPerChapter = 20;
    const totalMinutes = chapters * estimatedMinutesPerChapter;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `PT${hours}H${minutes}M`;
    }
    return `PT${minutes}M`;
}

export function generateStoryStructuredData(story: Story) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'AudioBook',
        name: story.title,
        description: story.description || `Nghe truyện ${story.title} audio online miễn phí`,
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
            url: SITE_URL,
        },
        datePublished: story.created_at,
        dateModified: story.updated_at,
        duration: formatDurationForSEO(story.total_chapters),
        numberOfEpisodes: story.total_chapters,
        encodingFormat: 'Audio/MPEG',
        inLanguage: 'vi-VN',
        genre: story.categories?.map(cat => cat.name).join(', ') || 'Audio Book',
        keywords: [
            story.title,
            story.author_name,
            'audio truyện',
            'nghe truyện',
            'truyện audio',
            ...(story.tags || [])
        ],
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
        },
        image: [story.cover_url],
        url: `${SITE_URL}/truyen/${story.slug}`,
        aggregateRating: story.rating_avg ? {
            '@type': 'AggregateRating',
            ratingValue: story.rating_avg,
            ratingCount: story.rating_count,
            bestRating: '5',
            worstRating: '1',
            reviewCount: story.rating_count,
        } : undefined,
    };

    return JSON.stringify(structuredData);
}

export function generateChapterStructuredData(story: Story, chapter: Chapter) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'AudioBookChapter',
        name: `Chương ${chapter.number}: ${chapter.title}`,
        description: `Nghe chương ${chapter.number} truyện ${story.title}`,
        url: `${SITE_URL}/truyen/${story.slug}?chapter=${chapter.number}`,
        position: chapter.number,
        datePublished: chapter.created_at || new Date().toISOString(),
        timeRequired: 'PT20M', // Estimate 20 minutes per chapter
        author: {
            '@type': 'Person',
            name: story.author_name,
        },
        isPartOf: {
            '@type': 'AudioBook',
            name: story.title,
            url: `${SITE_URL}/truyen/${story.slug}`,
        },
    };
    return JSON.stringify(structuredData);
}

export function generateWebsiteStructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AudioTruyen Clone',
        alternateName: 'AudioTruyen.org Clone',
        description: 'Website nghe truyện audio online miễn phí với hàng nghìn tác phẩm hay. Clone từ AudioTruyen.org - Tiên hiệp, huyền huyễn, kiếm hiệp, ngôn tình.',
        url: SITE_URL,
        inLanguage: 'vi-VN',
        isAccessibleForFree: true,
        about: {
            '@type': 'Thing',
            name: 'Audio Books',
            description: 'Vietnamese audio books and stories',
        },
        publisher: {
            '@type': 'Organization',
            name: 'AudioTruyen Clone',
            url: SITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
                width: 200,
                height: 60,
            },
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        },
        sameAs: [
            'https://github.com/lvmai1801it-dev/Web-clone-Fullstack',
        ],
    };

    return JSON.stringify(structuredData);
}
