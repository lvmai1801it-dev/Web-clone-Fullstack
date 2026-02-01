# Developer Experience Enhancement Guide

## Overview

This guide details comprehensive improvements to developer experience through better tooling, code organization, testing strategies, and workflow optimization for the AudioTruyen Clone project.

## Current Developer Experience Issues

### Problems Identified
1. **No Code Formatting**: Inconsistent code style across the project
2. **Missing Pre-commit Hooks**: No automated quality checks
3. **Poor Import Organization**: No barrel exports, inconsistent import patterns
4. **Limited Testing**: Minimal test coverage, no E2E testing
5. **No Documentation**: Missing component documentation and architecture guides
6. **Inconsistent TypeScript**: Mixed null checking patterns, missing type guards

---

## Tooling Setup

### 1. Code Formatting & Linting

#### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSameLine": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
  "embeddedLanguageFormatting": "auto",
  "insertPragma": false,
  "requirePragma": false,
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "printWidth": 80,
        "tabWidth": 2
      }
    },
    {
      "files": "*.md",
      "options": {
        "printWidth": 80,
        "proseWrap": "always"
      }
    },
    {
      "files": "*.tsx",
      "options": {
        "parser": "typescript"
      }
    }
  ]
}
```

#### ESLint Enhancement
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "import-helpers"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "import-helpers/order-imports": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "error",
    "react/display-name": "error",
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",
    "@next/next/no-img-element": "error",
    "@next/next/no-page-custom-font": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  }
}
```

#### Husky & Lint-Staged Setup
```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "type-check": "tsc --noEmit",
    "pre-commit": "lint-staged",
    "analyze": "ANALYZE=true next build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "devDependencies": {
    "prettier": "^3.1.0",
    "eslint-config-prettier": "^9.0.0",
    "lint-staged": "^15.2.0",
    "husky": "^8.0.3",
    "@storybook/next": "^7.6.0",
    "@storybook/react": "^7.6.0",
    "@storybook/testing-library": "^0.2.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0"
  }
}
```

#### Pre-commit Hook Configuration
```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```json
// .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npm run test:coverage
```

```json
// lint-staged.config.js
module.exports = {
  '*.{ts,tsx,js,jsx}': [
    'prettier --write',
    'eslint --fix',
    'vitest related --run'
  ],
  '*.{json,md,css}': [
    'prettier --write'
  ],
  'package.json': [
    'prettier --write',
    'npm install --package-lock-only'
  ]
};
```

### 2. Enhanced Package.json Scripts

```json
{
  "scripts": {
    // Development
    "dev": "next dev",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    
    // Building
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:profile": "NODE_ENV=production npm run build && npm run analyze",
    
    // Testing
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    // Code Quality
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "type-check": "tsc --noEmit",
    
    // Git Hooks
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "pre-push": "npm run type-check && npm run test:coverage",
    
    // Development Tools
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "clean": "rm -rf .next out dist coverage",
    
    // Performance
    "analyze": "ANALYZE=true next build",
    "bundle-size": "npm run build && npx bundlesize"
  }
}
```

---

## Code Organization

### 1. Barrel Exports

#### UI Components Barrel
```typescript
// src/components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Badge } from './badge';
export { Pagination } from './pagination';
export { Card } from './card';
export { Modal } from './modal';
export { Tooltip } from './tooltip';
export type { ButtonProps } from './button';
export type { InputProps } from './input';
export type { BadgeProps } from './badge';
```

#### Features Components Barrel
```typescript
// src/components/features/index.ts
export { default as StoryCard } from './story/StoryCard';
export { default as StoryListItem } from './story/StoryListItem';
export { default as AudioPlayer } from './audio/AudioPlayer';
export { default as StoryHero } from './story/StoryHero';
export { default as SidebarRanking } from './ranking/SidebarRanking';
```

#### Layout Components Barrel
```typescript
// src/components/layout/index.ts
export { default as Header } from './header/Header';
export { default as Footer } from './footer/Footer';
export { default as Container } from './shared/Container';
```

#### Hooks Barrel
```typescript
// src/hooks/index.ts
export { useAudio } from './useAudio';
export { useSearch } from './useSearch';
export { useAuth } from './useAuth';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useBreakpoint } from './useBreakpoint';
export { useSwipeGesture } from './useSwipeGesture';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
```

### 2. Enhanced Import Patterns

#### Consistent Import Structure
```typescript
// Good import organization
import React, { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// UI components
import { Button, Input, Badge } from '@/components/ui';
import { StoryCard, AudioPlayer } from '@/components/features';
import { Header, Footer } from '@/components/layout';

// Hooks
import { useAudio, useSearch, useBreakpoint } from '@/hooks';

// Utilities
import { cn } from '@/lib/utils';
import { formatTime, formatDate } from '@/lib/formatters';
import { apiClient } from '@/lib/api';

// Types
import { Story, Chapter, User } from '@/lib/types';
import type { AudioState, SearchFilters } from '@/lib/state.types';

// Services
import { StoryService, UserService } from '@/services';
```

---

## Testing Strategy

### 1. Unit Testing Setup

#### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.d.ts',
      '**/*.stories.tsx',
    ],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

#### Test Setup Utilities
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach, vi, describe, it, test, beforeAll, afterAll } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Global test cleanup
afterEach(() => {
  vi.clearAllMocks();
});

// Custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && document.body.contains(received);
    return {
      message: () =>
        pass
          ? `expected element ${received} not to be in the document`
          : `expected element to be in the document`,
      pass,
    };
  },
});
```

### 2. Component Testing Examples

#### StoryCard Test
```typescript
// src/components/features/story/StoryCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StoryCard } from './StoryCard';
import { mockStory } from '@/test/mocks/story.mock';

describe('StoryCard', () => {
  const mockProps = {
    story: mockStory,
    showBadge: true,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    render(<StoryCard {...mockProps} />);
  });

  it('renders story title correctly', () => {
    expect(screen.getByText(mockStory.title)).toBeInTheDocument();
  });

  it('displays cover image', () => {
    const image = screen.getByAltText(mockStory.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockStory.cover_url);
  });

  it('shows badge when story is completed', () => {
    const completedStory = { ...mockStory, status: 'completed' };
    render(<StoryCard {...mockProps} story={completedStory} />);
    
    expect(screen.getByText('Full')).toBeInTheDocument();
  });

  it('shows badge when story is hot', () => {
    const hotStory = { ...mockStory, views: 100000 };
    render(<StoryCard {...mockProps} story={hotStory} />);
    
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    fireEvent.click(screen.getByRole('article'));
    
    await waitFor(() => {
      expect(mockProps.onClick).toHaveBeenCalledWith(mockStory);
    });
  });

  it('has proper accessibility attributes', () => {
    const card = screen.getByRole('article');
    
    expect(card).toHaveAttribute('aria-label', `Nghe truyện ${mockStory.title}`);
  });
});
```

#### Audio Player Test
```typescript
// src/components/features/audio/AudioPlayer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AudioPlayer } from './AudioPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { mockStory, mockChapters } from '@/test/mocks/story.mock';

const renderWithAudioProvider = (component: React.ReactElement) => {
  return render(
    <AudioProvider>
      {component}
    </AudioProvider>
  );
};

describe('AudioPlayer', () => {
  beforeEach(() => {
    renderWithAudioProvider(
      <AudioPlayer 
        storyId={mockStory.id}
        chapters={mockChapters}
        currentChapter={1}
      />
    );
  });

  it('renders play button initially', () => {
    const playButton = screen.getByRole('button', { name: /phát/i });
    expect(playButton).toBeInTheDocument();
  });

  it('toggles between play and pause', async () => {
    const playButton = screen.getByRole('button', { name: /phát/i });
    
    // Click to play
    await userEvent.click(playButton);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tạm dừng/i })).toBeInTheDocument();
    });
    
    // Click to pause
    await userEvent.click(screen.getByRole('button', { name: /tạm dừng/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /phát/i })).toBeInTheDocument();
    });
  });

  it('changes chapter when next/previous is clicked', async () => {
    const nextButton = screen.getByRole('button', { name: /chương tiếp/i });
    
    await userEvent.click(nextButton);
    
    // Check if chapter changed to 2
    expect(screen.getByText(/Chương 2/)).toBeInTheDocument();
  });

  it('seeks when progress bar is changed', async () => {
    const progressBar = screen.getByRole('slider', { name: /thanh tiến độ/i });
    
    await userEvent.clear(progressBar);
    await userEvent.type(progressBar, '50');
    
    // Verify seek was called (would need to mock audio element)
    expect(progressBar).toHaveValue(50);
  });
});
```

### 3. E2E Testing with Playwright

#### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### E2E Test Example
```typescript
// e2e/story-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Story Navigation', () => {
  test('user can navigate to story detail', async ({ page }) => {
    await page.goto('/');
    
    // Click on first story card
    await page.click('.story-card:first-child');
    
    // Should navigate to story detail page
    await expect(page).toHaveURL(/\/truyen\/[^\/]+/);
    
    // Should show story title
    await expect(page.locator('h1')).toContainText(mockStory.title);
    
    // Should show audio player
    await expect(page.locator('.audio-player')).toBeVisible();
  });

  test('user can play audio from story detail', async ({ page }) => {
    await page.goto(`/truyen/${mockStory.slug}`);
    
    // Click play button
    await page.click('[data-testid="play-button"]');
    
    // Should show playing state
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    // Should show progress bar updating
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
  });

  test('user can search for stories', async ({ page }) => {
    await page.goto('/');
    
    // Click search input
    await page.click('[data-testid="search-input"]');
    
    // Type search query
    await page.fill('[data-testid="search-input"]', 'kiem hiep');
    
    // Should show search results
    await expect(page.locator('.search-results')).toBeVisible();
    
    // Should show relevant stories
    await expect(page.locator('.search-result-item')).toHaveCount.greaterThan(0);
  });
});
```

---

## Documentation Strategy

### 1. Component Documentation

#### Storybook Setup
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/children/.test(prop.name) : true),
    },
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

#### Component Story Example
```typescript
// src/components/ui/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with consistent styling and behavior',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button visual variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether button shows loading state',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'With Icon',
    variant: 'default',
    leftIcon: <svg>...</svg>,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
};
```

### 2. Architecture Documentation

#### Component Documentation Template
```typescript
// src/components/features/story/StoryCard.md
# StoryCard Component

## Description
The StoryCard component displays story information in a card format with cover image, title, metadata, and interactive elements.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| story | `Story` | **Required** | Story object containing title, cover_url, author, etc. |
| showBadge | `boolean` | `true` | Whether to show status badges (Full, Hot) |
| className | `string` | `''` | Additional CSS classes |
| onClick | `(story: Story) => void` | `undefined` | Callback when card is clicked |
| priority | `boolean` | `false` | Whether to prioritize image loading |

## Usage

```tsx
import { StoryCard } from '@/components/features/story';

<StoryCard 
  story={story}
  showBadge={true}
  onClick={(story) => router.push(`/truyen/${story.slug}`)}
  priority={index < 6}
/>
```

## Examples

### Basic Usage
```tsx
<StoryCard story={story} />
```

### Without Badge
```tsx
<StoryCard story={story} showBadge={false} />
```

### With Custom Click Handler
```tsx
<StoryCard 
  story={story}
  onClick={(story) => handleStoryClick(story)}
/>
```

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus management

## Performance Notes

- Uses `React.memo` to prevent unnecessary re-renders
- Implements `useCallback` for event handlers
- Lazy loads images below the fold
- Optimized for mobile touch interactions

## Related Components

- `StoryListItem` - List format of story information
- `StoryHero` - Full-width story header
- `Badge` - Status badge component
```

---

## Implementation Benefits

### Development Experience Improvements
- **Code Consistency**: Automated formatting and linting
- **Error Prevention**: Pre-commit hooks catch issues early
- **Faster Development**: Hot reload with proper error boundaries
- **Better Debugging**: Comprehensive test coverage and debugging tools

### Team Collaboration
- **Standardized Code**: Consistent formatting across team
- **Automated Quality**: CI/CD pipeline ensures code quality
- **Documentation**: Living documentation with Storybook
- **Knowledge Sharing**: Clear architecture documentation

### Productivity Gains
- **Faster Onboarding**: New developers understand codebase quickly
- **Reduced Bugs**: Comprehensive testing catches issues early
- **Confidence Changes**: Automated tests ensure safe deployments
- **Better Code Reviews**: Automated checks reduce manual review burden

### Maintenance Benefits
- **Easier Refactoring**: Tests ensure functionality is preserved
- **Documentation**: Clear docs reduce knowledge silos
- **Testing**: Test suite provides regression protection
- **Quality Gates**: Automated quality checks maintain standards

This comprehensive developer experience enhancement will significantly improve team productivity, code quality, and maintainability of the AudioTruyen Clone project.