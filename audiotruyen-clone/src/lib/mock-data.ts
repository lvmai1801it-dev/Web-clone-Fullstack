import { Story, Category, RankingItem } from './types';

// Base mock stories for templates
const baseStories: Story[] = [
    {
        id: '1',
        slug: 'cau-ma',
        title: 'Audio Truyện Cầu Ma',
        cover: '/covers/cau-ma.jpg',
        author: 'Nhĩ Căn',
        narrator: 'Huyền Thoại Gia',
        genres: ['Tiên Hiệp', 'Huyền Huyễn'],
        status: 'completed',
        totalChapters: 189,
        currentChapter: 189,
        views: 45233,
        rating: 4.5,
        ratingCount: 144,
        description: 'Cầu Ma là một tác phẩm tiên hiệp xuất sắc của tác giả Nhĩ Căn. Truyện kể về hành trình tu luyện và khám phá thế giới tu tiên đầy bí ẩn...',
        tags: ['Tiên hiệp', 'Tu chân', 'Huyền huyễn'],
        updatedAt: '2024-01-22',
    },
    {
        id: '2',
        slug: 'vu-khong-lang',
        title: 'Audio Ma Vũ Không Lang',
        cover: '/covers/vu-khong-lang.jpg',
        author: 'Thiên Tằm Thổ Đậu',
        narrator: 'MC Audio',
        genres: ['Tiên Hiệp', 'Kiếm Hiệp'],
        status: 'ongoing',
        totalChapters: 1200,
        currentChapter: 856,
        views: 32150,
        rating: 4.8,
        ratingCount: 256,
        description: 'Ma Vũ Không Lang - một câu chuyện hấp dẫn về thế giới kiếm khách...',
        tags: ['Kiếm hiệp', 'Hành động'],
        updatedAt: '2024-01-21',
    },
    // ... add a few more styles from original manual list if needed, but we can generate variations
];

// Titles component parts for generation
const titles = ['Đại', 'Chí Tôn', 'Vô Thượng', 'Tuyệt Thế', 'Thần', 'Ma', 'Tiên', 'Thánh', 'Huyết', 'Long', 'Phượng', 'Thiên', 'Địa', 'Nhân', 'Ngạo', 'Cuồng', 'Bá', 'Vương', 'Hoàng', 'Đế'];
const titles2 = ['Đạo', 'Kiếm', 'Đao', 'Thương', 'Quyền', 'Chưởng', 'Chỉ', 'Pháp', 'Quyết', 'Công', 'Kinh', 'Điển', 'Lục', 'Sách', 'Truyện', 'Ký', 'Sử', 'Thi', 'Ca', 'Phú'];
const titles3 = ['Chi Chủ', 'Thần Vương', 'Đế Tôn', 'Bất Bại', 'Vô Địch', 'Hủy Diệt', 'Tái Sinh', 'Trọng Sinh', 'Xuyên Không', 'Hệ Thống', 'Tu Tiên', 'Nghịch Thiên', 'Phá Thiên', 'Trảm Thần', 'Đồ Long', 'Diệt Thế'];

// Authors
const authors = ['Lão Trư', 'Đường Gia Tam Thiếu', 'Thiên Tằm Thổ Đậu', 'Nhĩ Căn', 'Thần Đông', 'Ngã Cật Tây Hồng Thị', 'Vong Ngữ', 'Mặc Hương Đồng Khứu', 'Cố Mạn', 'Diệp Lạc Vô Tâm'];

// Genres
const allGenres = ['Tiên Hiệp', 'Huyền Huyễn', 'Đô Thị', 'Kiếm Hiệp', 'Linh Dị', 'Ngôn Tình', 'Xuyên Không', 'Trọng Sinh'];

// Simple seeded random to ensure consistent data across server restarts
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Generate ~1000 stories
const generateStories = (count: number): Story[] => {
    const stories: Story[] = [...baseStories];

    for (let i = stories.length; i < count; i++) {
        const seed = i * 1337; // Fixed seed based on index

        const r1 = seededRandom(seed);
        const r2 = seededRandom(seed + 1);
        const r3 = seededRandom(seed + 2);

        const title1 = titles[Math.floor(r1 * titles.length)];
        const title2 = titles2[Math.floor(r2 * titles2.length)];
        const title3 = titles3[Math.floor(r3 * titles3.length)];
        const title = `${title1} ${title2} ${title3}`;

        const author = authors[Math.floor(seededRandom(seed + 3) * authors.length)];
        const mainGenre = allGenres[Math.floor(seededRandom(seed + 4) * allGenres.length)];
        const subGenre = allGenres[Math.floor(seededRandom(seed + 5) * allGenres.length)];
        const genres = Array.from(new Set([mainGenre, subGenre]));

        const status = seededRandom(seed + 6) > 0.3 ? 'ongoing' : 'completed';
        const totalChapters = Math.floor(seededRandom(seed + 7) * 5000) + 100;
        const currentChapter = status === 'completed' ? totalChapters : Math.floor(seededRandom(seed + 8) * totalChapters);

        const id = (i + 1).toString();

        // Deterministic slug
        // using a simple hash of the title for more readable but consistent slugs
        const simpleSlug = title.toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        stories.push({
            id,
            slug: `truyen-${id}-${simpleSlug}`,
            title,
            cover: baseStories[Math.floor(seededRandom(seed) * baseStories.length)].cover,
            author,
            narrator: 'AI Voice',
            genres,
            status,
            totalChapters,
            currentChapter,
            views: Math.floor(seededRandom(seed + 9) * 1000000),
            rating: Number((seededRandom(seed + 10) * 2 + 3).toFixed(1)),
            ratingCount: Math.floor(seededRandom(seed + 11) * 1000),
            description: `Mô tả cho truyện ${title}. Đây là một câu chuyện hấp dẫn thuộc thể loại ${genres.join(', ')}...`,
            tags: genres.map(g => g.toLowerCase()),
            updatedAt: new Date(Date.now() - Math.floor(seededRandom(seed + 12) * 10000000000)).toISOString().split('T')[0],
        });
    }

    return stories;
};

export const mockStories = generateStories(1008);

// Update mock Categories with real counts
export const mockCategories: Category[] = [
    { id: '1', slug: 'tien-hiep', name: 'Tiên Hiệp', storyCount: 0 },
    { id: '2', slug: 'huyen-huyen', name: 'Huyền Huyễn', storyCount: 0 },
    { id: '3', slug: 'do-thi', name: 'Đô Thị', storyCount: 0 },
    { id: '4', slug: 'kiem-hiep', name: 'Kiếm Hiệp', storyCount: 0 },
    { id: '5', slug: 'linh-di', name: 'Linh Dị', storyCount: 0 },
    { id: '6', slug: 'ngon-tinh', name: 'Ngôn Tình', storyCount: 0 },
    { id: '7', slug: 'xuyen-khong', name: 'Xuyên Không', storyCount: 0 },
    { id: '8', slug: 'trong-sinh', name: 'Trọng Sinh', storyCount: 0 },
];

// Calculate story counts
mockStories.forEach(story => {
    story.genres.forEach(genre => {
        const category = mockCategories.find(c =>
            genre.toLowerCase().includes(c.name.toLowerCase()) ||
            c.name.toLowerCase().includes(genre.toLowerCase())
        );
        if (category) {
            category.storyCount++;
        }
    });
});

// Mock Ranking Data (Top 10 highest views)
export const mockRanking: RankingItem[] = [...mockStories]
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map((story, index) => ({
        rank: index + 1,
        story,
    }));

// Helper function to get story by slug
export function getStoryBySlug(slug: string): Story | undefined {
    return mockStories.find(story => story.slug === slug);
}

// Helper function to get stories by category
export function getStoriesByCategory(categorySlug: string): Story[] {
    const category = mockCategories.find(cat => cat.slug === categorySlug);
    if (!category) return [];

    // Normalize string for better matching
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '');
    const catName = normalize(category.name);

    return mockStories.filter(story =>
        story.genres.some(genre => normalize(genre).includes(catName) || catName.includes(normalize(genre)))
    );
}

// Helper function to remove accents
function removeAccents(str: string): string {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

// Helper function to calculate relevance score
function getRelevanceScore(story: Story, lowerQuery: string, normalizedQuery: string): number {
    const title = story.title.toLowerCase();
    const normalizedTitle = removeAccents(title);
    const author = story.author.toLowerCase();
    const normalizedAuthor = removeAccents(author);

    // 1. Title Exact Match (Highest Priority)
    if (title === lowerQuery || normalizedTitle === normalizedQuery) return 100;

    // 2. Title Starts With
    if (title.startsWith(lowerQuery) || normalizedTitle.startsWith(normalizedQuery) ||
        normalizedTitle.includes(` ${normalizedQuery}`) || title.includes(` ${lowerQuery}`)) return 80;

    // 3. Title Contains
    if (title.includes(lowerQuery) || normalizedTitle.includes(normalizedQuery)) return 60;

    // 4. Author Exact Match
    if (author === lowerQuery || normalizedAuthor === normalizedQuery) return 50;

    // 5. Author Contains
    if (author.includes(lowerQuery) || normalizedAuthor.includes(normalizedQuery)) return 40;

    // 6. Tags Match
    if (story.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return 20;

    return 0;
}

// Helper function to search stories
export function searchStories(query: string): Story[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    const normalizedQuery = removeAccents(lowerQuery);

    return mockStories
        .map(story => ({
            story,
            score: getRelevanceScore(story, lowerQuery, normalizedQuery)
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .map(item => item.story);
}
