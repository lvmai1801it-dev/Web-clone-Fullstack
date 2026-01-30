# 🏗️ STANDARD API ARCHITECTURE (Next.js + Axios + React Query)

This document defines the standard for handling API requests in the `audiotruyen-clone` project.

## 📦 Prerequisites
Current project is missing these dependencies. Run this first:
```bash
npm install axios @tanstack/react-query
```

---

## 🚀 CORE RULES

### **RULE 1: SINGLE AXIOS INSTANCE**
Do not use `fetch` or `axios` directly in components. Use the centralized instance.

```typescript
// src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Points to http://backend_php.test:8888/api/v1
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

### **RULE 2: INTERCEPTORS FOR AUTH & ERRORS**
Handle tokens and global errors centrally.

```typescript
// src/lib/axios.ts (continued)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data, // Return data directly
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      if (typeof window !== 'undefined') window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);
```

### **RULE 3: STRICT SERVICE LAYER**
Logic lives in `services/`, not components.

```typescript
// src/services/story.service.ts
import axiosInstance from '@/lib/axios';
import { Story, PaginatedResponse } from '@/types';

export const StoryService = {
  getAll: (params?: any) => 
    axiosInstance.get<any, PaginatedResponse<Story>>('/public/stories', { params }),
    
  getBySlug: (slug: string) => 
    axiosInstance.get<any, Story>(`/public/stories/${slug}`),
};
```

### **RULE 4: CLIENT-SIDE DATA FETCHING (REACT QUERY)**
Use React Query for caching, loading states, and retries.

```typescript
// src/hooks/useStories.ts
import { useQuery } from '@tanstack/react-query';
import { StoryService } from '@/services/story.service';

export const useStories = (params?: any) => {
  return useQuery({
    queryKey: ['stories', params],
    queryFn: () => StoryService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### **RULE 5: SERVER-SIDE DATA FETCHING**
For Server Components (`app/page.tsx`), use `fetch` or `axios` directly but ensure headers are passed if needed.
*Note: Next.js App Router recommends `fetch` for Data Cache integration, but Axios is acceptable for consistency if caching is handled via React Query Hydration or no-store.*

---

## 📂 FOLDER STRUCTURE

```
src/
├── lib/
│   └── axios.ts           # Instance & Interceptors
├── services/              # API Calls
│   ├── auth.service.ts
│   └── story.service.ts
├── hooks/                 # React Query Hooks
│   ├── useAuth.ts
│   └── useStories.ts
└── types/                 # TypeScript Interfaces
    └── index.ts
```

## ❌ DON'Ts
- ⛔ **NO** `useEffect` for data fetching (Use `useQuery`).
- ⛔ **NO** hardcoded URLs in components (Use `NEXT_PUBLIC_API_URL`).
- ⛔ **NO** manual error handling in every component (Use Global Error Boundary or Interceptor).