# 📋 **QUY TẮC LẬP TRÌNH NEXT.JS (BẮT BUỘC)**

## 🚨 **KIẾN TRÚC NEXT.JS 14+**

### **1. Cấu trúc thư mục Next.js App Router**
```
src/
├── 📁 app/                    # App Router (BẮT BUỘC)
│   ├── 📁 (auth)/            # Route group
│   │   ├── 📁 login/         # Dynamic route
│   │   │   ├── page.tsx      # Page component
│   │   │   ├── layout.tsx    # Layout riêng
│   │   │   └── loading.tsx   # Loading UI
│   ├── 📁 api/               # API Routes
│   │   ├── 📁 auth/          # API endpoint
│   │   │   └── route.ts      # Route handler
│   ├── 📁 truyen/            # Route
│   │   ├── 📁 [slug]/        # Dynamic route
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   ├── loading.tsx           # Global loading
│   ├── error.tsx             # Global error
│   └── not-found.tsx         # 404 page
├── 📁 components/            # Components tái sử dụng
│   ├── 📁 ui/               # UI primitives
│   ├── 📁 layout/           # Layout components
│   └── 📁 shared/           # Shared components
├── 📁 lib/                   # Thư viện, utilities
│   ├── 📁 utils/            # Helper functions
│   ├── 📁 services/         # API services
│   └── 📁 constants/        # App constants
├── 📁 hooks/                 # Custom hooks
├── 📁 stores/                # State stores (Zustand)
├── 📁 types/                 # TypeScript types
├── 📁 styles/                # Global styles
└── 📁 public/                # Static files
```

**LUẬT 1.1**: BẮT BUỘC dùng App Router (không dùng Pages Router)  
**LUẬT 1.2**: Mỗi route là 1 thư mục trong `app/`  
**LUẬT 1.3**: `page.tsx` là component chính, `layout.tsx` cho layout riêng  
**LUẬT 1.4**: Dùng route groups `(auth)` cho tổ chức  

## 🔧 **QUY TẮC NEXT.JS CORE**

### **2. Server vs Client Components**
```tsx
// ✅ Server Component (Mặc định)
// Không có 'use client', không có hooks, không state
export default async function HomePage() {
  // Fetch data trực tiếp
  const stories = await fetchStories();
  
  return (
    <div>
      <StoryList stories={stories} />
      <AudioPlayer /> {/* Client Component */}
    </div>
  );
}

// ✅ Client Component (Khi cần interactivity)
'use client';

import { useState } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <button onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}
```

**LUẬT 2.1**: Mặc định dùng Server Components  
**LUẬT 2.2**: Chỉ dùng Client Components khi cần:  
- useState, useEffect, useReducer  
- Event handlers (onClick, onChange)  
- Browser APIs (localStorage, navigator)  
- Custom hooks với state  

**LUẬT 2.3**: Tách nhỏ Client Components, giữ Server Components lớn  

### **3. Data Fetching Rules**
```tsx
// ✅ Server Components - fetch() trực tiếp
async function getStories() {
  // Sử dụng Next.js fetch với caching
  const res = await fetch('https://api.example.com/stories', {
    next: { 
      revalidate: 3600, // ISR: revalidate mỗi giờ
      tags: ['stories'] // For revalidation
    }
  });
  return res.json();
}

// ✅ Server Actions (Form submissions)
'use server';

export async function createStory(formData: FormData) {
  const title = formData.get('title');
  // Xử lý logic server-side
  await db.story.create({ data: { title } });
  revalidateTag('stories'); // Revalidate cache
}

// ❌ KHÔNG fetch trong Client Components trừ khi cần
```

**LUẬT 3.1**: Fetch data trong Server Components  
**LUẬT 3.2**: Dùng `next/cache` để cache và revalidate  
**LUẬT 3.3**: Dùng Server Actions cho form submissions  
**LUẬT 3.4**: Dùng React Query/TanStack Query CHO client-side fetching  

### **4. Routing & Navigation**
```tsx
// ✅ Sử dụng Next.js Link
import Link from 'next/link';

<Link href="/truyen/tan-the-phap-tac" prefetch={true}>
  Tân Thế Pháp Tác
</Link>

// ✅ Sử dụng useRouter trong Client Components
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/truyen');

// ✅ Dynamic Routes
// app/truyen/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  return <StoryDetail story={story} />;
}
```

**LUẬT 4.1**: Luôn dùng `next/link` thay vì `<a>`  
**LUẬT 4.2**: Bật `prefetch={true}` cho links thường xuyên dùng  
**LUẬT 4.3**: Dùng `next/navigation` thay vì `next/router`  
**LUẬT 4.4**: Dynamic routes phải có `params: Promise<...>`  

### **5. Metadata & SEO**
```tsx
// ✅ Static metadata
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nghe Truyện Audio - Thư viện lớn nhất',
  description: 'Nghe truyện audio chất lượng cao',
  keywords: ['truyện audio', 'audiobook', 'nghe truyện'],
  openGraph: {
    images: ['/og-image.png'],
  },
};

// ✅ Dynamic metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  
  return {
    title: story.title,
    description: story.description,
  };
}
```

**LUẬT 5.1**: Mỗi page PHẢI có metadata  
**LUẬT 5.2**: Dùng `generateMetadata` cho dynamic pages  
**LUẬT 5.3**: Đầy đủ Open Graph tags cho social sharing  

## 🎨 **STYLING & UI**

### **6. Tailwind CSS với Next.js**
```tsx
// ✅ Tailwind với CSS Modules (khi cần)
import styles from './StoryCard.module.css';

<div className={`${styles.card} p-4 rounded-lg`}>

// ✅ Sử dụng clsx/tailwind-merge cho conditional classes
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function Button({ variant, className }: ButtonProps) {
  return (
    <button className={twMerge(
      clsx(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200',
      ),
      className
    )}>
      Click me
    </button>
  );
}
```

**LUẬT 6.1**: Ưu tiên Tailwind utility classes  
**LUẬT 6.2**: CSS Modules chỉ cho complex animations  
**LUẬT 6.3**: Dùng `clsx` + `tailwind-merge` cho dynamic classes  

### **7. Fonts & Assets Optimization**
```tsx
// ✅ Next.js Font Optimization
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});

// ✅ Image Optimization
import Image from 'next/image';

<Image
  src="/cover.jpg"
  alt="Truyện cover"
  width={300}
  height={400}
  priority={true} // Cho ảnh LCP
  sizes="(max-width: 768px) 100vw, 300px"
/>
```

**LUẬT 7.1**: BẮT BUỘC dùng `next/font` cho fonts  
**LUẬT 7.2**: BẮT BUỘC dùng `next/image` cho images  
**LUẬT 7.3**: Luôn set `sizes` prop cho responsive images  

## 🏗️ **PERFORMANCE & OPTIMIZATION**

### **8. Code Splitting & Lazy Loading**
```tsx
// ✅ Dynamic imports cho components lớn
import dynamic from 'next/dynamic';

const HeavyAudioPlayer = dynamic(
  () => import('@/components/AudioPlayer'),
  { 
    ssr: false, // Không render trên server
    loading: () => <LoadingSpinner />
  }
);

// ✅ Lazy loading cho libraries
const Player = dynamic(() => 
  import('react-player/lazy').then(mod => mod.default),
  { ssr: false }
);
```

**LUẬT 8.1**: Dynamic import cho components > 50KB  
**LUẬT 8.2**: `ssr: false` cho components phụ thuộc browser APIs  
**LUẬT 8.3**: Cung cấp loading state  

### **9. Caching Strategies**
```tsx
// ✅ Data Cache với fetch
const data = await fetch('https://api.example.com/stories', {
  cache: 'force-cache', // Default
  next: { revalidate: 3600 } // ISR
});

// ✅ Full Route Cache (Static)
export const dynamic = 'force-static';

// ✅ Partial Prerendering (Experimental)
import { unstable_noStore as noStore } from 'next/cache';

export default async function Page() {
  noStore(); // Dynamic phần này
  const dynamicData = await fetchDynamicData();
  
  return (
    <>
      <StaticPart />
      <DynamicPart data={dynamicData} />
    </>
  );
}
```

**LUẬT 9.1**: Mặc định dùng `force-cache` cho static data  
**LUẬT 9.2**: Dùng ISR (`revalidate`) cho data thay đổi  
**LUẬT 9.3**: Dùng `unstable_noStore` cho dynamic content  

## 🔒 **SECURITY & AUTHENTICATION**

### **10. Authentication với NextAuth.js**
```tsx
// ✅ NextAuth.js configuration
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials
        const user = await getUserByEmail(credentials.email);
        return user;
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
});

export { handler as GET, handler as POST };

// ✅ Middleware cho route protection
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login',
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*']
};
```

**LUẬT 10.1**: Dùng NextAuth.js cho authentication  
**LUẬT 10.2**: Bảo vệ routes với middleware  
**LUẬT 10.3**: Server Actions cho form authentication  

## 📱 **RESPONSIVE & MOBILE**

### **11. Mobile-First Design**
```tsx
// ✅ Mobile-first với Tailwind
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
    Tiêu đề responsive
  </h1>
</div>

// ✅ Hook cho responsive design
'use client';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

**LUẬT 11.1**: Mobile-first breakpoints: `sm:`, `md:`, `lg:`, `xl:`  
**LUẬT 11.2**: Test trên ít nhất 3 viewports  
**LUẬT 11.3**: Touch-friendly buttons (min 44x44px)  

## 🧪 **TESTING & QUALITY**

### **12. Testing với Next.js**
```tsx
// ✅ Unit tests với Jest & React Testing Library
// __tests__/StoryCard.test.tsx
import { render, screen } from '@testing-library/react';
import StoryCard from '@/components/StoryCard';

describe('StoryCard', () => {
  it('renders story title', () => {
    render(<StoryCard title="Tân Thế Pháp Tác" />);
    expect(screen.getByText('Tân Thế Pháp Tác')).toBeInTheDocument();
  });
});

// ✅ E2E tests với Playwright
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Nghe Truyện Audio')).toBeVisible();
});
```

**LUẬT 12.1**: Unit tests cho components và hooks  
**LUẬT 12.2**: Integration tests cho pages  
**LUẬT 12.3**: E2E tests cho critical user flows  

## 🚀 **DEPLOYMENT & ENVIRONMENT**

### **13. Environment Variables**
```env
# .env.local (không commit)
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com

# .env.production
NEXT_PUBLIC_API_URL=https://api.production.com
```

**LUẬT 13.1**: `.env.local` cho local development  
**LUẬT 13.2**: `.env.production` cho production  
**LUẬT 13.3**: NEVER commit secrets  

### **14. Build & Deployment**
```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:e2e": "playwright test"
  }
}
```

**LUẬT 14.1**: `next build` trước khi deploy  
**LUẬT 14.2**: Run `next lint` trước commit  
**LUẬT 14.3**: Check bundle size với `@next/bundle-analyzer`  

---

## 📋 **CHECKLIST TRƯỚC KHI DEPLOY**

### **Build Checklist**
- [ ] `next build` thành công
- [ ] Không có ESLint errors
- [ ] Bundle size < 500KB (first load)
- [ ] LCP < 2.5s
- [ ] FCP < 1.8s

### **SEO Checklist**
- [ ] Metadata đầy đủ trên mọi page
- [ ] Open Graph tags
- [ ] Robots.txt và sitemap
- [ ] Structured data (JSON-LD)

### **Performance Checklist**
- [ ] Images optimized với next/image
- [ ] Fonts optimized với next/font
- [ ] Code splitting đúng cách
- [ ] Service Worker (nếu PWA)

### **Security Checklist**
- [ ] Environment variables secure
- [ ] API routes protected
- [ ] XSS prevention (sanitize inputs)
- [ ] CSP headers configured

**TÓM LẠI**: Next.js cung cấp nhiều optimizations mặc định. Tuân thủ các quy tắc trên để tận dụng tối đa performance và developer experience.