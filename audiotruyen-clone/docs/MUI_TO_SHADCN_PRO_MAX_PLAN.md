# MUI to Shadcn/UI Migration Plan - Next-Gen "Pro Max" Aesthetics

This document outlines the strategy for migrating the AudioTruyen clone from Material UI (MUI) to Shadcn/UI, with a focus on achieving a state-of-the-art "Pro Max" aesthetic.

## 1. Objectives

- **Visual Excellence:** Implement a premium, modern design using glassmorphism, sophisticated gradients, and high-end typography (Inter/Outfit).
- **Performance:** Leverege Tailwind CSS v4's ultra-fast engine and Shadcn's lightweight primitives.
- **Micro-interactions:** Add subtle, high-quality animations to improve user engagement.
- **Maintainability:** Standardize the component architecture using Shadcn's "copy-paste" model for full control.

## 2. Core Design Tokens (Tailwind v4)

We will utilize Tailwind v4's CSS-first configuration and OKLCH color spaces for vibrant, consistent colors.

### Colors (OKLCH)

- `primary`: `oklch(0.6 0.25 260)` (Electric Indigo)
- `secondary`: `oklch(0.7 0.15 190)` (Cyan Mist)
- `accent`: `oklch(0.8 0.3 90)` (Solar Yellow)
- `glass`: `rgba(255, 255, 255, 0.7)` with `backdrop-blur-xl`

### Effects

- `shadow-premium`: High-diffusion shadows with subtle color tints.
- `glass-premium`: Combined blur, border, and light reflection.

## 3. Migration Roadmap

### Phase 1: Foundation (COMPLETED)

- Initialize Shadcn UI with Stone base.
- Configure Tailwind v4 with Pro Max tokens.
- Set up `Inter` as the primary font.
- Create "Bridged" components for immediate MUI compatibility.

### Phase 2: Core Infrastructure (COMPLETED)

- **Layout:** Header, Mobile Menu, Desktop Navigation (Glassmorphism).
- **Navigation:** Bottom Navigation (Mobile), Pagination.
- **Audio Hub:** AudioPlayer, AudioControls, AudioProgressBar (Next-Gen styling).
- **Discovery:** StoryCard, StoryListItem, SidebarRanking (Premium cards).

### Phase 3: Advanced Features & Refinement

- [x] **Mini Player Migration:** Refactor for fixed overlay with premium controls.
- [x] **Category Hero:** Redesign category detail headers.
- [x] **Search Experience:** Premium dropdown and search result layout.
- [x] **Error Boundaries:** Specialized, high-end error recovery UI.

## 4. Component Mapping Reference

| MUI Component | Shadcn/UI Equivalent | Enhancement (Pro Max) |
|---------------|----------------------|-----------------------|
| `Button` | `Button` | `shadow-glow`, `active:scale-95` |
| `Slider` | `Slider` | Monospaced fonts, colored tracks |
| `Card` | `Card` | `glass-premium`, `shadow-premium` |
| `Menu` | `DropdownMenu` | Minimalist headers, vibrant icons |
| `Drawer` | `Sheet` / `Drawer` | Smooth bottom sheet on mobile |
| `Select` | `Select` | Bold headers, rounded elements |

## 5. Verification Plan

- [x] **Lighthouse Audit:** Verify Performance and Accessibility scores > 90.
- [x] **Cross-browser Testing:** Ensure glassmorphism works on Safari/Chrome/Firefox.
- [x] **Responsive Check:** Validate all Pro Max effects on small mobile devices.
