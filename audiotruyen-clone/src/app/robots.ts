import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/_next/',
                    '/static/',
                    '/private/',
                    '*.json',
                ],
            },
            {
                userAgent: 'GPTBot',
                allow: ['/truyen/', '/the-loai/'],
                disallow: ['/admin/', '/api/'],
            }
        ],
        sitemap: 'https://audiotruyen-clone.vercel.app/sitemap.xml',
        host: 'https://audiotruyen-clone.vercel.app',
    };
}
