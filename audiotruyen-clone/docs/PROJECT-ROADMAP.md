# Project Roadmap & Implementation Plan

## Executive Summary
**Goal**: Optimize AudioTruyen Clone for performance, maintainability, and user experience.
**Current Focus**: Phase 2 (Cleanup & Quality)
**Targets**:
- Bundle Size: < 250KB
- Lighthouse Score: > 90
- Code Cleanliness: Zero dead code, strict types.

## Phase 1: Critical Optimization (Completed/In-Progress)
- [x] **State Management**: Implemented `AudioContext` and `AppContext` to replace prop drilling.
- [x] **Routing**: Migrated to Next.js App Router.
- [ ] **Bundle Optimization**: Implement dynamic imports for `AudioPlayer` and large UI blocks.
- [ ] **Performance**: Add Service Caching (`OptimizedStoryService`).

## Phase 2: Code Cleanup & Quality (Active)
**Priority**: High
1. **Dead Code Removal**:
   - [x] Remove unused UI components (`ButtonBridge`, etc.).
   - [x] Remove unused hooks and utils.
   - [x] Cleanup `src/types` (Duplicate interfaces - Consolidating to `TECHNICAL-GUIDE`).
   - [x] Standardize mock data (`src/test/mocks`).
   - [x] **Critical Fix**: Delete duplicate `src/components/ui/badge.tsx` (lowercase) to fix LSP errors.
   - [x] **Dependencies**: Uninstall unused WASM packages (`@emnapi/core`, `@napi-rs/wasm-runtime`, etc.).
2. **Refactoring**:
   - [ ] Consolidate `StoryCard` and `StoryListItem` logic.
   - [ ] Standardize API response types.
3. **Testing**:
   - [ ] Fix broken tests after cleanup.
   - [ ] Consolidate test utilities.

## Phase 3: Enhancements & Polish (Upcoming)
1. **Accessibility**:
   - [ ] Audit keyboard navigation.
   - [ ] Implement ARIA labels and live regions.
2. **SEO**:
   - [ ] Enhance JSON-LD structured data.
   - [ ] Optimize meta tags for social sharing.
3. **Features**:
   - [ ] PWA support (Offline mode).
   - [ ] User usage analytics (History sync).

## Cleanup Strategy
- **Weekly**: Run `npm run analyze` to check bundle size.
- **Bi-weekly**: Review `TODO` and `FIXME` comments.
- **continuous**: Strict code review on PRs (no new `any`, no console logs).
