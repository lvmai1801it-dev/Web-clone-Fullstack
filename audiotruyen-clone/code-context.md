# AudioTruyen Clone - Source Code

## Project Structure
```
audiotruyen-clone/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── the-loai/[slug]/page.tsx
│   │   └── truyen/[slug]/page.tsx
│   ├── components/
│   │   ├── AudioPlayer.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Pagination.tsx
│   │   ├── SidebarRanking.tsx
│   │   ├── StoryCard.tsx
│   │   └── StoryListItem.tsx
│   └── lib/
│       ├── mock-data.ts
│       └── types.ts
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## Configuration Files

### package.json
```json
{
  "name": "audiotruyen-clone",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.4",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

---

## Styles

### src/app/globals.css
```css
@import "tailwindcss";

@theme {
  --color-primary: #337AB7;
  --color-primary-dark: #23527C;
  --color-primary-light: #5DADE2;
  --color-background: #F8F8F8;
  --color-background-card: #FFFFFF;
  --color-gradient-start: #E8F4FC;
  --color-gradient-end: #FFFFFF;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-border: #DDDDDD;
  --color-border-light: #EEEEEE;
  --color-badge-full: #5CB85C;
  --color-badge-hot: #F0AD4E;
  --color-badge-translate: #5BC0DE;
  --color-badge-convert: #E67E22;
  --color-star-active: #FFD700;
  --color-star-inactive: #CCCCCC;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-card-hover: 0 4px 8px rgba(0, 0, 0, 0.15);
  --spacing-container: 1200px;
  --radius-card: 4px;
}

body {
  background: linear-gradient(to bottom, var(--color-gradient-start), var(--color-gradient-end));
  min-height: 100vh;
  color: var(--color-text-primary);
  font-family: 'Open Sans', 'Segoe UI', Roboto, sans-serif;
}

.container-main { max-width: var(--spacing-container); margin: 0 auto; padding: 0 16px; }
.card { background: var(--color-background-card); border-radius: var(--radius-card); box-shadow: var(--shadow-card); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-card-hover); }

.badge { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; color: white; text-transform: uppercase; }
.badge-full { background-color: var(--color-badge-full); }
.badge-hot { background-color: var(--color-badge-hot); }

.section-title { color: var(--color-primary); font-size: 16px; font-weight: 700; padding: 8px 12px; background: var(--color-background-card); border-left: 3px solid var(--color-primary); margin-bottom: 16px; }
.audio-player { background: var(--color-background-card); border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 16px; }

a { color: var(--color-primary); text-decoration: none; transition: color 0.2s ease; }
a:hover { color: var(--color-primary-dark); }

.story-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
@media (max-width: 1024px) { .story-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .story-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 480px) { .story-grid { grid-template-columns: repeat(2, 1fr); } }

.layout-main { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
@media (max-width: 1024px) { .layout-main { grid-template-columns: 1fr; } }

.story-cover { aspect-ratio: 2 / 3; object-fit: cover; width: 100%; border-radius: var(--radius-card); }
.rating-stars { display: flex; gap: 2px; }
.star { color: var(--color-star-inactive); }
.star.active { color: var(--color-star-active); }
```

---

## Types

### src/lib/types.ts
```typescript
export interface Story {
  id: string;
  slug: string;
  title: string;
  cover: string;
  author: string;
  narrator?: string;
  genres: string[];
  status: 'ongoing' | 'completed';
  totalChapters: number;
  currentChapter?: number;
  views: number;
  rating: number;
  ratingCount: number;
  description: string;
  tags: string[];
  updatedAt: string;
}

export interface Chapter {
  id: string;
  storyId: string;
  number: number;
  title: string;
  audioUrl: string;
  duration: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  storyCount: number;
}

export interface Comment {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface RankingItem {
  rank: number;
  story: Story;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
```

---

## Mock Data

### src/lib/mock-data.ts
```typescript
import { Story, Category, RankingItem } from './types';

export const mockStories: Story[] = [
  { id: '1', slug: 'cau-ma', title: 'Audio Truyện Cầu Ma', cover: '/covers/cau-ma.jpg', author: 'Nhĩ Căn', narrator: 'Huyền Thoại Gia', genres: ['Tiên Hiệp', 'Huyền Huyễn'], status: 'completed', totalChapters: 189, currentChapter: 189, views: 45233, rating: 4.5, ratingCount: 144, description: 'Cầu Ma là một tác phẩm tiên hiệp xuất sắc...', tags: ['Tiên hiệp', 'Tu chân'], updatedAt: '2024-01-22' },
  { id: '2', slug: 'vu-khong-lang', title: 'Audio Ma Vũ Không Lang', cover: '/covers/vu-khong-lang.jpg', author: 'Thiên Tằm Thổ Đậu', narrator: 'MC Audio', genres: ['Tiên Hiệp', 'Kiếm Hiệp'], status: 'ongoing', totalChapters: 1200, currentChapter: 856, views: 32150, rating: 4.8, ratingCount: 256, description: 'Ma Vũ Không Lang...', tags: ['Kiếm hiệp'], updatedAt: '2024-01-21' },
  { id: '3', slug: 'de-ba', title: 'Audio Truyện Đế Bá', cover: '/covers/de-ba.jpg', author: 'Yểm Bút Tiêu Sinh', narrator: 'Huyền Thoại', genres: ['Tiên Hiệp', 'Huyền Huyễn'], status: 'completed', totalChapters: 5000, currentChapter: 5000, views: 89456, rating: 4.9, ratingCount: 512, description: 'Đế Bá...', tags: ['Tiên hiệp'], updatedAt: '2024-01-20' },
  { id: '4', slug: 'thieu-gia-quy-lai', title: 'Truyện Audio Đại Đạo Triều Thiên', cover: '/covers/thieu-gia.jpg', author: 'Vô Tội', narrator: 'Audio Master', genres: ['Huyền Huyễn', 'Đô Thị'], status: 'ongoing', totalChapters: 320, currentChapter: 245, views: 15678, rating: 4.3, ratingCount: 89, description: 'Thiếu gia...', tags: ['Đô thị'], updatedAt: '2024-01-22' },
  { id: '5', slug: 'mao-son-tho', title: 'Truyện Audio Mao Sơn Tróc Quỷ Nhân', cover: '/covers/mao-son.jpg', author: 'Thanh Tử', narrator: 'Narrator Pro', genres: ['Linh Dị', 'Huyền Huyễn'], status: 'completed', totalChapters: 2456, currentChapter: 2456, views: 67890, rating: 4.7, ratingCount: 423, description: 'Mao Sơn...', tags: ['Linh dị'], updatedAt: '2024-01-19' },
  { id: '6', slug: 'than-dao-de-ton', title: 'Audio Truyện Thần Đạo Đế Tôn', cover: '/covers/than-dao.jpg', author: 'Loạn Thế Cuồng Đao', narrator: 'Voice Master', genres: ['Tiên Hiệp'], status: 'ongoing', totalChapters: 1800, currentChapter: 1456, views: 54321, rating: 4.6, ratingCount: 312, description: 'Thần Đạo...', tags: ['Tiên hiệp'], updatedAt: '2024-01-18' },
];

export const mockCategories: Category[] = [
  { id: '1', slug: 'tien-hiep', name: 'Tiên Hiệp', storyCount: 156 },
  { id: '2', slug: 'huyen-huyen', name: 'Huyền Huyễn', storyCount: 234 },
  { id: '3', slug: 'do-thi', name: 'Đô Thị', storyCount: 89 },
  { id: '4', slug: 'kiem-hiep', name: 'Kiếm Hiệp', storyCount: 67 },
  { id: '5', slug: 'linh-di', name: 'Linh Dị', storyCount: 45 },
  { id: '6', slug: 'ngon-tinh', name: 'Ngôn Tình', storyCount: 178 },
  { id: '7', slug: 'xuyen-khong', name: 'Xuyên Không', storyCount: 92 },
  { id: '8', slug: 'trong-sinh', name: 'Trọng Sinh', storyCount: 78 },
];

export const mockRanking: RankingItem[] = mockStories
  .sort((a, b) => b.views - a.views)
  .slice(0, 10)
  .map((story, index) => ({ rank: index + 1, story }));

export function getStoryBySlug(slug: string): Story | undefined {
  return mockStories.find(story => story.slug === slug);
}

export function getStoriesByCategory(categorySlug: string): Story[] {
  const category = mockCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  return mockStories.filter(story => story.genres.some(genre => genre.toLowerCase().includes(category.name.toLowerCase().replace(' ', ''))));
}

export function searchStories(query: string): Story[] {
  const lowerQuery = query.toLowerCase();
  return mockStories.filter(story => story.title.toLowerCase().includes(lowerQuery) || story.author.toLowerCase().includes(lowerQuery));
}
```

---

## App Layout & Pages

### src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const openSans = Open_Sans({ subsets: ["latin", "vietnamese"], display: "swap", variable: "--font-open-sans" });

export const metadata: Metadata = {
  title: "AudioTruyen Clone - Nghe Truyện Audio Online Miễn Phí",
  description: "Website nghe truyện audio online miễn phí với hàng nghìn tác phẩm hay.",
  keywords: ["audio truyện", "nghe truyện", "truyện audio"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${openSans.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### src/app/page.tsx
```tsx
import Link from 'next/link';
import StoryCard from '@/components/StoryCard';
import StoryListItem from '@/components/StoryListItem';
import SidebarRanking from '@/components/SidebarRanking';
import { mockStories, mockRanking } from '@/lib/mock-data';

export default function Home() {
  const newStories = mockStories.slice(0, 6);
  const completedStories = mockStories.filter(s => s.status === 'completed');
  const randomStories = [...mockStories].sort(() => Math.random() - 0.5);

  return (
    <div className="container-main py-6">
      <div className="layout-main">
        <div className="space-y-8">
          {/* Truyện Mới Cập Nhật */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex-1"><span className="flex items-center gap-2">TRUYỆN MỚI CẬP NHẬT</span></h2>
              <Link href="/danh-sach/moi-cap-nhat" className="text-sm text-[var(--color-primary)] hover:underline">Xem thêm →</Link>
            </div>
            <div className="story-grid">{newStories.map((story) => <StoryCard key={story.id} story={story} />)}</div>
          </section>

          {/* Truyện Hoàn Thành */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex-1"><span className="flex items-center gap-2">TRUYỆN HOÀN THÀNH</span></h2>
              <Link href="/danh-sach/hoan-thanh" className="text-sm text-[var(--color-primary)] hover:underline">Xem thêm →</Link>
            </div>
            <div className="bg-white rounded border border-[var(--color-border)] p-4">
              {completedStories.slice(0, 5).map((story) => <StoryListItem key={story.id} story={story} />)}
            </div>
          </section>

          {/* Truyện Ngẫu Nhiên */}
          <section>
            <h2 className="section-title mb-4"><span className="flex items-center gap-2">TRUYỆN NGẪU NHIÊN</span></h2>
            <div className="story-grid">{randomStories.slice(0, 12).map((story) => <StoryCard key={story.id} story={story} />)}</div>
          </section>
        </div>

        <aside className="space-y-6">
          <SidebarRanking items={mockRanking} title="Bảng Xếp Hạng" />
        </aside>
      </div>
    </div>
  );
}
```

### src/app/the-loai/[slug]/page.tsx
```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import Pagination from '@/components/Pagination';
import SidebarRanking from '@/components/SidebarRanking';
import { mockCategories, mockStories, mockRanking } from '@/lib/mock-data';

interface CategoryPageProps { params: Promise<{ slug: string }>; }

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = mockCategories.find(cat => cat.slug === slug);
  if (!category) notFound();
  const categoryStories = mockStories;

  return (
    <div className="container-main py-6">
      <nav className="text-sm text-[var(--color-text-muted)] mb-4">
        <Link href="/">Trang chủ</Link><span className="mx-2">›</span>
        <Link href="/the-loai">Thể loại</Link><span className="mx-2">›</span>
        <span className="text-[var(--color-text-primary)]">{category.name}</span>
      </nav>
      <div className="layout-main">
        <div>
          <div className="section-title mb-6">THỂ LOẠI: {category.name.toUpperCase()}</div>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Tìm thấy <strong className="text-[var(--color-primary)]">{category.storyCount}</strong> truyện</p>
          <div className="story-grid mb-8">{categoryStories.map((story) => <StoryCard key={story.id} story={story} />)}</div>
          <Pagination currentPage={1} totalPages={Math.ceil(category.storyCount / 24)} baseUrl={`/the-loai/${slug}`} />
        </div>
        <aside className="space-y-6">
          <SidebarRanking items={mockRanking} title="Bảng Xếp Hạng" />
        </aside>
      </div>
    </div>
  );
}
```

### src/app/truyen/[slug]/page.tsx
```tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';
import SidebarRanking from '@/components/SidebarRanking';
import { getStoryBySlug, mockRanking } from '@/lib/mock-data';

interface StoryPageProps { params: Promise<{ slug: string }>; }

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const mockChapters = Array.from({ length: Math.min(story.totalChapters, 10) }, (_, i) => ({
    number: i + 1, title: `Chương ${i + 1}`, audioUrl: ''
  }));

  const fullStars = Math.floor(story.rating);
  const hasHalfStar = story.rating % 1 >= 0.5;

  return (
    <div className="container-main py-6">
      <nav className="text-sm text-[var(--color-text-muted)] mb-4">
        <Link href="/">Trang chủ</Link><span className="mx-2">›</span>
        <Link href={`/the-loai/${story.genres[0]?.toLowerCase().replace(' ', '-')}`}>{story.genres[0]}</Link>
        <span className="mx-2">›</span><span>{story.title}</span>
      </nav>
      <div className="layout-main">
        <div className="space-y-6">
          <section className="bg-white rounded border border-[var(--color-border)] p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0">
                <div className="story-cover relative bg-[var(--color-background)]">
                  {story.cover ? <Image src={story.cover} alt={story.title} fill className="object-cover rounded" sizes="200px" priority /> : <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded flex items-center justify-center"><span className="text-white font-bold text-center px-4">{story.title}</span></div>}
                </div>
                <div className="mt-4 text-sm">
                  <div className="flex border-b py-2"><span className="text-[var(--color-text-muted)] w-20">Tác giả:</span><span className="text-[var(--color-primary)]">{story.author}</span></div>
                  <div className="flex border-b py-2"><span className="text-[var(--color-text-muted)] w-20">Thể loại:</span><span className="text-[var(--color-primary)]">{story.genres.join(', ')}</span></div>
                  <div className="flex border-b py-2"><span className="text-[var(--color-text-muted)] w-20">Trạng thái:</span><span className={story.status === 'completed' ? 'text-[var(--color-badge-full)]' : 'text-[var(--color-badge-hot)]'}>{story.status === 'completed' ? 'Hoàn thành' : 'Đang cập nhật'}</span></div>
                  <div className="flex border-b py-2"><span className="text-[var(--color-text-muted)] w-20">Số phần:</span><span>{story.totalChapters}</span></div>
                  <div className="flex py-2"><span className="text-[var(--color-text-muted)] w-20">Lượt xem:</span><span>{story.views.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-3">{story.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="rating-stars">{Array.from({ length: 5 }, (_, i) => <span key={i} className={`star ${i < fullStars || (i === fullStars && hasHalfStar) ? 'active' : ''}`}>★</span>)}</div>
                  <span className="text-sm text-[var(--color-text-muted)]">{story.rating}/5 - ({story.ratingCount} bình chọn)</span>
                </div>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{story.description}</p>
              </div>
            </div>
          </section>
          <section><AudioPlayer title="Nghe Truyện" chapters={mockChapters} currentChapter={1} /></section>
        </div>
        <aside className="space-y-6"><SidebarRanking items={mockRanking} title="Bảng Xếp Hạng" /></aside>
      </div>
    </div>
  );
}
```

---

## Components

### src/components/Header.tsx
```tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { mockCategories } from '@/lib/mock-data';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'serif' }}>AUDIOTRUYEN.ORG</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative">
              <button onClick={() => setShowListDropdown(!showListDropdown)} onBlur={() => setTimeout(() => setShowListDropdown(false), 200)} className="flex items-center gap-1 text-sm hover:text-[var(--color-primary)]">
                Danh sách <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showListDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg min-w-[180px] py-2">
                  <Link href="/danh-sach/moi-cap-nhat" className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">Truyện mới cập nhật</Link>
                  <Link href="/danh-sach/hoan-thanh" className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">Truyện hoàn thành</Link>
                  <Link href="/danh-sach/hot" className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">Truyện hot</Link>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)} className="flex items-center gap-1 text-sm hover:text-[var(--color-primary)]">
                Thể loại <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg min-w-[200px] py-2 grid grid-cols-2 gap-1">
                  {mockCategories.map((category) => <Link key={category.id} href={`/the-loai/${category.slug}`} className="block px-4 py-2 text-sm hover:bg-[var(--color-background)]">{category.name}</Link>)}
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-40 md:w-56 px-3 py-1.5 text-sm border rounded focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### src/components/Footer.tsx
```tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--color-border)] mt-8">
      <div className="container-main py-6">
        <div className="text-center text-sm text-[var(--color-text-secondary)]">
          <p className="mb-4">AudioTruyen.org - Website nghe truyện audio online miễn phí.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">DMCA Protected</div>
            <span>|</span>
            <p>© {new Date().getFullYear()} AudioTruyen Clone. All rights reserved.</p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <Link href="/gioi-thieu" className="hover:text-[var(--color-primary)]">Giới thiệu</Link>
            <span>•</span>
            <Link href="/lien-he" className="hover:text-[var(--color-primary)]">Liên hệ</Link>
            <span>•</span>
            <Link href="/chinh-sach" className="hover:text-[var(--color-primary)]">Chính sách</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### src/components/AudioPlayer.tsx
```tsx
'use client';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  chapters?: { number: number; title: string; audioUrl: string }[];
  currentChapter?: number;
  onChapterChange?: (chapter: number) => void;
}

export default function AudioPlayer({ audioUrl, title = 'Nghe Truyện', chapters = [], currentChapter = 1, onChapterChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedChapter, setSelectedChapter] = useState(currentChapter);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => { setIsPlaying(false); if (selectedChapter < chapters.length) handleChapterChange(selectedChapter + 1); };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => { audio.removeEventListener('timeupdate', handleTimeUpdate); audio.removeEventListener('loadedmetadata', handleLoadedMetadata); audio.removeEventListener('ended', handleEnded); };
  }, [selectedChapter, chapters.length]);

  const togglePlay = () => { const audio = audioRef.current; if (!audio) return; if (isPlaying) audio.pause(); else audio.play(); setIsPlaying(!isPlaying); };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => { const audio = audioRef.current; if (!audio) return; const time = Number(e.target.value); audio.currentTime = time; setCurrentTime(time); };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => { const audio = audioRef.current; if (!audio) return; const vol = Number(e.target.value); audio.volume = vol; setVolume(vol); };
  const handleChapterChange = (chapter: number) => { setSelectedChapter(chapter); if (onChapterChange) onChapterChange(chapter); if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); setIsPlaying(true); } };
  const formatTime = (time: number) => { const minutes = Math.floor(time / 60); const seconds = Math.floor(time % 60); return `${minutes}:${seconds.toString().padStart(2, '0')}`; };
  const demoAudioUrl = audioUrl || chapters.find(c => c.number === selectedChapter)?.audioUrl || '';

  return (
    <div className="audio-player">
      <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">{title}</h3>
      <audio ref={audioRef} src={demoAudioUrl} preload="metadata" />
      <div className="mb-4">
        <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} className="w-full h-2 bg-[var(--color-background)] rounded-lg cursor-pointer accent-[var(--color-primary)]" />
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={togglePlay} className="w-12 h-12 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)]">
          {isPlaying ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 h-2 bg-[var(--color-background)] rounded-lg cursor-pointer accent-[var(--color-primary)]" />
        </div>
        {chapters.length > 0 && (
          <select value={selectedChapter} onChange={(e) => handleChapterChange(Number(e.target.value))} className="px-3 py-2 border rounded text-sm focus:outline-none focus:border-[var(--color-primary)]">
            {chapters.map((chapter) => <option key={chapter.number} value={chapter.number}>Chương {chapter.number}: {chapter.title}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}
```

### src/components/StoryCard.tsx
```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';

interface StoryCardProps { story: Story; showBadge?: boolean; }

export default function StoryCard({ story, showBadge = true }: StoryCardProps) {
  const isCompleted = story.status === 'completed';
  const progressText = isCompleted ? `${story.totalChapters}/${story.totalChapters} Full` : `${story.currentChapter || 0}/${story.totalChapters}`;

  return (
    <Link href={`/truyen/${story.slug}`} className="block">
      <div className="card overflow-hidden group">
        <div className="relative">
          <div className="story-cover bg-[var(--color-background)] flex items-center justify-center overflow-hidden">
            {story.cover ? <Image src={story.cover} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 480px) 50vw, 16vw" /> : <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center"><span className="text-white text-xs text-center px-2 font-medium">{story.title}</span></div>}
          </div>
          {showBadge && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isCompleted && <span className="badge badge-full">Full</span>}
              {story.views > 50000 && <span className="badge badge-hot">Hot</span>}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1">{progressText}</div>
        </div>
        <div className="p-2"><h3 className="text-sm font-medium line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">{story.title}</h3></div>
      </div>
    </Link>
  );
}
```

### src/components/StoryListItem.tsx
```tsx
import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';

interface StoryListItemProps { story: Story; showThumbnail?: boolean; }

export default function StoryListItem({ story, showThumbnail = true }: StoryListItemProps) {
  const isCompleted = story.status === 'completed';

  return (
    <Link href={`/truyen/${story.slug}`} className="block">
      <div className="flex items-center gap-3 py-3 border-b border-dashed border-[var(--color-border-light)] hover:bg-[var(--color-background)] transition-colors px-2 -mx-2 rounded">
        {showThumbnail && (
          <div className="w-[50px] h-[70px] flex-shrink-0 relative rounded overflow-hidden">
            {story.cover ? <Image src={story.cover} alt={story.title} fill className="object-cover" sizes="50px" /> : <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]"></div>}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate hover:text-[var(--color-primary)]">{story.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-muted)]">
            {isCompleted ? <span className="badge badge-full">Full</span> : <span className="text-[var(--color-primary)]">Chương {story.currentChapter}/{story.totalChapters}</span>}
            <span>• {story.updatedAt}</span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 truncate">{story.author}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] flex-shrink-0"><span>{story.views.toLocaleString()}</span></div>
      </div>
    </Link>
  );
}
```

### src/components/Pagination.tsx
```tsx
import Link from 'next/link';

interface PaginationProps { currentPage: number; totalPages: number; baseUrl: string; }

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    if (end - start + 1 < showPages) start = Math.max(1, end - showPages + 1);
    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  if (totalPages <= 1) return null;
  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-1">
      <Link href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'} className={`px-3 py-2 text-sm rounded border transition-colors ${currentPage === 1 ? 'text-[var(--color-text-muted)] cursor-not-allowed' : 'text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'}`}>‹ Trước</Link>
      {visiblePages.map((page, index) => page === '...' ? <span key={`ellipsis-${index}`} className="px-3 py-2">...</span> : <Link key={page} href={`${baseUrl}?page=${page}`} className={`w-10 h-10 flex items-center justify-center text-sm rounded border transition-colors ${page === currentPage ? 'bg-[var(--color-primary)] text-white' : 'hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}>{page}</Link>)}
      <Link href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : '#'} className={`px-3 py-2 text-sm rounded border transition-colors ${currentPage === totalPages ? 'text-[var(--color-text-muted)] cursor-not-allowed' : 'text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'}`}>Sau ›</Link>
    </nav>
  );
}
```

### src/components/SidebarRanking.tsx
```tsx
import Link from 'next/link';
import { RankingItem } from '@/lib/types';

interface SidebarRankingProps { items: RankingItem[]; title?: string; }

export default function SidebarRanking({ items, title = 'Bảng Xếp Hạng' }: SidebarRankingProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-[#FFD700] text-white';
      case 2: return 'bg-[#C0C0C0] text-white';
      case 3: return 'bg-[#CD7F32] text-white';
      default: return 'bg-[var(--color-background)] text-[var(--color-text-secondary)]';
    }
  };

  return (
    <div className="bg-white rounded border border-[var(--color-border)]">
      <div className="section-title border-l-0 rounded-t"><div className="flex items-center gap-2">{title}</div></div>
      <div className="divide-y divide-[var(--color-border-light)]">
        {items.map((item) => (
          <Link key={item.story.id} href={`/truyen/${item.story.slug}`} className="flex items-center gap-3 p-3 hover:bg-[var(--color-background)] transition-colors">
            <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${getRankStyle(item.rank)}`}>{item.rank}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate hover:text-[var(--color-primary)]">{item.story.title}</h4>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]"><span>{item.story.views.toLocaleString()}</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```
