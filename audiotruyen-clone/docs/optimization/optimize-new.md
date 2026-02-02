Dựa trên phân tích chi tiết và lựa chọn của bạn, tôi sẽ tạo kế hoạch tối ưu hóa hiệu năng nhanh chóng với tập trung vào các vấn đề ưu tiên cao:
📋 Kế Hoạch Tối Ưu Hiệu Năng Frontend - AudioTruyen Clone
🎯 Mục tiêu chính
- Giảm bundle size 60% (~57MB)
- Fix lỗi bảo mật Next.js 
- Tăng tốc độ build 15-20%
- Cải thiện performance runtime
---
⚡ Phase 1: Critical Cleanup (Ngày 1-2)
1.1 Xóa Dependency Thừa (Ưu tiên Cao nhất)
# Xóa dependency không dùng
npm uninstall mariadb @next/bundle-analyzer
npm install --save-dev @next/bundle-analyzer
# Thay thế MUI Icons (52MB → 2MB)
npm uninstall @mui/icons-material  
npm install lucide-react
Files cần thay đổi:
- /package.json - Xóa dependencies không dùng
- Tất cả files import từ @mui/icons-material → lucide-react
1.2 Fix Lỗi Bảo Miệt Next.js
npm audit fix --force
# Hoặc update Next.js
npm install next@latest
1.3 Extract Constants từ Hardcoded Values
Files cần thay đổi:
- /src/lib/axios.ts:4 - API URL → process.env.NEXT_PUBLIC_API_URL
- /src/app/layout.tsx:17 - Site URL → process.env.NEXT_PUBLIC_SITE_URL 
- /src/app/sitemap.ts:6 - Site URL → environment variable
- /src/lib/structuredData.ts - Tất cả URLs → constants
1.4 Remove Test Files
- Xóa /src/app/test-mui/page.tsx (68 lines)
- Move /src/lib/mock-data.ts → /src/test/fixtures/
---
🚀 Phase 2: Performance Quick Wins (Ngày 3-4)
2.1 Add Bundle Optimizations
File: /next.config.ts
const nextConfig: NextConfig = {
  // ... existing config
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@mui/material', 'lucide-react'],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  },
};
2.2 Dynamic Imports cho Component Nặng
Files cần thay đổi:
- /src/components/features/audio/AudioPlayer.tsx → dynamic import
- /src/components/features/story/StoryHero.tsx → dynamic import  
- /src/components/layout/header/Header.tsx → partial dynamic imports
2.3 Add Memoization cho Component Lớn
Files cần thêm memoization:
- /src/components/features/story/StoryHero.tsx - React.memo
- /src/components/layout/header/Header.tsx - React.memo
- /src/components/features/ranking/SidebarRanking.tsx - React.memo
- /src/contexts/AudioContext.tsx - Add selectors
---
🔧 Phase 3: Code Cleanup (Ngày 5-7)
3.1 Consolidate Error Boundaries
Target: 3 Error Boundary components → 1 configurable
- /src/components/layout/ErrorBoundary.tsx 
- /src/components/ui/ErrorBoundary.tsx
- /src/components/features/audio/AudioErrorBoundary.tsx
3.2 Remove Duplicate UI Components
Xóa duplicates:
- /src/components/ui/MuiButton.tsx HOẶC /src/components/ui/button.tsx
- /src/components/ui/MuiInput.tsx HOẶC /src/components/ui/input.tsx
3.3 Fix Import Cleanup
- Remove unused React imports
- Clean up unused Material-UI imports
- Consolidate type definitions
---
📊 Expected Results
After Phase 1 (Critical Cleanup):
- ✅ Bundle size: -57MB (từ 719MB → 662MB)
- ✅ Security: Fix 3 high-severity vulnerabilities  
- ✅ Build time: 10-15% faster
- ✅ Environment: Proper config management
After Phase 2 (Performance):
- ✅ Bundle size: Additional -20MB
- ✅ First Contentful Paint: 25-30% improvement
- ✅ Runtime performance: Significantly better
After Phase 3 (Cleanup):
- ✅ Maintainability: Much improved
- ✅ Bundle size: Additional -5-10MB
- ✅ Code quality: Consistent patterns
---
🎯 Quick Wins (3 changes, immediate impact)
1. npm uninstall mariadb @mui/icons-material && npm install lucide-react
2. npm install next@latest 
3. Move hardcoded URLs to environment variables
Expected immediate impact: -57MB bundle size + security fixes
---
🔍 Implementation Priority
Week 1: Critical cleanup (dependencies + security + constants)
Week 2: Performance optimizations (memoization + dynamic imports)  
Week 3: Code consolidation (error boundaries + duplicate removal)