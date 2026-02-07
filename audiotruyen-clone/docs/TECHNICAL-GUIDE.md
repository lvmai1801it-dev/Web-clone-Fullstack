# Technical Guide & Standards

## 1. Performance Optimization

### Bundle Optimization
- **Goal**: Bundle size < 250KB.
- **Strategies**:
  - Use `dynamic()` for heavy components (`AudioPlayer`, `StoryDetail`).
  - Split code by route and component (e.g., `AudioControls`, `ChapterSelector`).
  - Optimize images using `next/image` with blur placeholders.

### Runtime Performance
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` for expensive calculations and event handlers.
- **Service Caching**: Implement caching in services (e.g., `OptimizedStoryService`) to reduce API calls.
- **Monitoring**: Track Core Web Vitals (LCP, FID, CLS) using `PerformanceMonitor`.

## 2. State Management

### Architecture
- **Global State**: Centralized state for User, Audio, Library, and App UI.
- **Contexts**:
  - `AudioContext`: Manages playback, queue, and player visibility. Eliminates prop drilling.
  - `AppContext`: Manages UI state (theme, sidebar) and user session.

### Persistence
- **Storage**: Use `localStorage` for user preferences and library state.
- **Session**: Use `sessionStorage` for temporary audio state restoration.

## 3. Accessibility (a11y) & SEO

### Accessibility Patterns
- **Keyboard Nav**: Implement `useKeyboardShortcuts` for audio controls (Space, Arrows, etc.).
- **Screen Readers**: Use `ScreenReaderAnnouncer` for dynamic updates (e.g., "Playing chapter 1").
- **Focus Management**: Use `useFocusTrap` for modals and menus.
- **Semantic HTML**: Use proper roles (`article`, `button`, `nav`) and ARIA labels.

### SEO Strategy
- **Structured Data**: Implement JSON-LD for `AudioBook`, `WebSite`, and `BreadcrumbList`.
- **Metadata**: Dynamic `generateMetadata` for story pages with Open Graph tags.
- **Sitemap**: Dynamic `sitemap.ts` generation for stories and categories.

## 4. Component Patterns & Templates

### Smart Components
Use `memo` and separate logic from UI.
```tsx
export const Component = memo<Props>(({ prop }) => {
  const value = useMemo(() => compute(prop), [prop]);
  return <div>{value}</div>;
});
```

### reusable Hooks
- `useApi`: Wrapper for `fetch` with caching and retry logic.
- `useLocalStorage`: Type-safe storage hook with cross-tab sync.
- `useDebounce`: Optimize search and rapid inputs.
- `useInfiniteScroll`: Intersection Observer wrapper for lazy loading.

### Error Handling
- Use `ErrorBoundary` components to catch react errors gracefully.
- Log errors to analytics/monitoring services.

## 5. Design System & UI (Shadcn/UI + Tailwind v4)

### Core Tokens (Pro Max Aesthetic)
- **Colors (OKLCH)**:
  - Primary: `oklch(0.6 0.25 260)` (Electric Indigo)
  - Secondary: `oklch(0.7 0.15 190)` (Cyan Mist)
  - Accent: `oklch(0.8 0.3 90)` (Solar Yellow)
  - Glass: `rgba(255, 255, 255, 0.7)` with `backdrop-blur-xl`
- **Effects**:
  - `shadow-premium`: High-diffusion shadows.
  - `glass-premium`: Blur + Border + Reflection.

### Component Mapping
| MUI | Shadcn | Enhancement |
|-----|--------|-------------|
| Card | Card | `glass-premium`, `shadow-premium` |
| Button | Button | `shadow-glow`, `active:scale-95` |

## 6. Coding Standards
- **Types**: Strict TypeScript. No `any`. Define interfaces in `src/types/`.
- **Imports**: Use aliases (`@/components`, `@/lib`). Avoid relative paths like `../../../`.
- **Testing**:
  - Unit tests for utils and hooks.
  - Integration tests for critical flows (Audio, Search).
  - Use `mock-data.ts` for consistent test data.
