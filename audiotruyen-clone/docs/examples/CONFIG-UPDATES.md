# Configuration Updates Guide

## Overview

This document provides configuration examples and setup instructions for development tools, build optimization, and deployment configurations for the AudioTruyen Clone project.

---

## Next.js Configuration

### Enhanced next.config.ts
```typescript
// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'backend_php.test',
      },
    ],
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
  },

  // Enable experimental features
  experimental: {
    // Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // Optimize package imports
    optimizePackageImports: ['@radix-ui/react-slot', 'lucide-react'],
    
    // WebAssembly support for performance-critical features
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB', 'INP'],
    
    // Streaming SSR for better performance
    serverComponentsExternalPackages: ['@mui/material', '@emotion/react'],
  },

  // Webpack configuration for bundle optimization
  webpack: (config, { isServer, dev, isBuild, nextRuntime }) => {
    // Only apply optimizations in build
    if (!isBuild) {
      return config;
    }

    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analyzer-report.html',
        })
      );
    }

    // Optimize chunk splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
          },
          
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: -20,
            enforce: true,
          },
          
          // Component chunks
          components: {
            test: /[\\/]components[\\/]/,
            name: 'components',
            chunks: 'all',
            priority: 0,
          },
        },
      },
    };

    // Performance optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      // Aliases for cleaner imports
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/services': path.resolve(__dirname, './src/services'),
    };

    // Environment-specific optimizations
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration
  output: {
    // Faster builds
    // Can be 'standalone' for serverless deployment
    // 'export' for static export
  },

  // TypeScript configuration
  typescript: {
    // Faster builds
    tsconfigPath: './tsconfig.json',
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Legacy URL redirects
      {
        source: '/story/:slug',
        destination: '/truyen/:slug',
        permanent: true,
      },
    ];
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Rewrites for API routing
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

---

## TypeScript Configuration

### Enhanced tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitUseStrict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": false,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "exactOptionalPropertyTypes": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/config/*": ["./src/config/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build",
    "coverage"
  ],
  "ts-node": {
    "esm": true
  }
}
```

---

## ESLint Configuration

### Comprehensive .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import-helpers"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": true
    },
    "jsx-a11y": {
      "polymorphicPropType": false
    }
  },
  "rules": {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-member-accessibility": "off",
    
    // React rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "error",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "error",
    "react/display-name": "error",
    "react/no-danger": "warn",
    "react/no-array-index-key": "warn",
    "react/no-children-prop": "warn",
    "react/no-find-dom-node": "error",
    "react/no-string-refs": "error",
    
    // Accessibility rules
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-role": "warn",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-autofocus": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    
    // Import rules
    "import-helpers/order-imports": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "sort-imports": "off", // Use import-helpers/order-imports instead
    
    // General rules
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-multiple-empty-lines": "error",
    "quotes": ["error", "single"],
    "semi": "error",
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
    "space-infix-ops": "error",
    "eol-last": ["error", "always"],
    "no-trailing-spaces": "error",
    
    // Next.js specific rules
    "@next/next/no-img-element": "error",
    "@next/next/no-page-custom-font": "error",
    "@next/next/no-html-link-for-pages": "warn"
  },
  "overrides": [
    {
      "files": ["*.stories.@(js|jsx|ts|tsx)"],
      "rules": {
        "import/no-default-export": "off"
      }
    },
    {
      "files": ["*.config.@(js|ts)"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
}
```

---

## Prettier Configuration

### .prettierrc.json
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "quoteProps": "as-needed",
  "bracketSpacing": true,
  "bracketSameLine": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto",
  "insertPragma": false,
  "requirePragma": false,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
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
        "proseWrap": "always",
        "tabWidth": 2
      }
    },
    {
      "files": "*.yml",
      "options": {
        "tabWidth": 2,
        "singleQuote": false
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

---

## Package.json Scripts

### Enhanced package.json Scripts Section
```json
{
  "scripts": {
    "development": "npm run dev",
    "dev": "next dev",
    "dev:turbo": "next dev --turbo",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    
    "build": "npm run type-check && next build",
    "build:turbo": "next build --turbo",
    "build:analyze": "ANALYZE=true npm run build",
    "build:profile": "NODE_ENV=production npm run build && npm run analyze",
    "build:export": "next build && next export",
    
    "testing": "npm run test",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "PWDEBUG=1 playwright test",
    
    "linting": "npm run lint && npm run type-check",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "lint:quiet": "eslint . --ext .ts,.tsx,.js,.jsx --quiet",
    
    "formatting": "npm run format:check",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "format:staged": "lint-staged",
    
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    
    "quality": "npm run lint:fix && npm run format && npm run test:coverage",
    "quality:pre-commit": "npm run format:staged && npm run lint:fix && npm run type-check && npm run test",
    
    "performance": "npm run build:analyze && npm run test:coverage",
    "performance:bundle-size": "npm run build && npx bundlesize",
    
    "git": {
      "pre-commit": "npm run quality:pre-commit",
      "pre-push": "npm run type-check && npm run test:coverage",
      "commit-msg": "git commit -e",
      "push": "git push origin main"
    },
    
    "cleanup": "rm -rf .next out dist coverage",
    "clean": "npm run cleanup && npm cache clean --force",
    
    "deployment": {
      "build:prod": "NODE_ENV=production npm run build",
      "deploy:vercel": "vercel --prod",
      "deploy:netlify": "netlify deploy --prod --dir=.next",
      "deploy:static": "npm run build:export && gh-pages -d out"
    },
    
    "development:tools": {
      "db:seed": "node scripts/seed-database.js",
      "db:migrate": "node scripts/migrate-database.js",
      "assets:optimize": "node scripts/optimize-images.js",
      "env:setup": "cp .env.example .env.local"
    },
    
    "analyze": {
      "bundle": "ANALYZE=true npm run build",
      "coverage": "npm run test:coverage && open coverage/lcov-report/index.html",
      "performance": "npm run build && npx lighthouse --output=json --output-path=./lighthouse-results.json http://localhost:3000"
    },
    
    "maintenance": {
      "deps:check": "npm outdated",
      "deps:update": "npm update",
      "deps:audit": "npm audit fix",
      "security": "npm audit",
      "license:check": "npx license-checker --excludePrivatePackages"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "prettier --write",
      "eslint --fix",
      "vitest related --run"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ],
    "package.json": [
      "prettier --write",
      "npm install --package-lock-only"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check && npm run test:coverage"
    }
  }
}
```

---

## Environment Configuration

### Environment Variables Setup

#### .env.example
```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME=AudioTruyen Clone
NEXT_PUBLIC_APP_URL=https://audiotruyen-clone.vercel.app
NEXT_PUBLIC_API_URL=https://api.audiotruyen.com
NEXT_PUBLIC_IMAGE_CDN=https://images.audiotruyen.com

# Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxx.ingest.sentry.io/xxxxxxx
NEXT_PUBLIC_AZURE_APP_INSIGHTS_CONNECTION_STRING=xxxxxx

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE_SEARCH=false
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=false
NEXT_PUBLIC_ENABLE_MINI_PLAYER=true
NEXT_PUBLIC_ENABLE_BACKGROUND_PLAYBACK=false
NEXT_PUBLIC_NEW_SEARCH_ALGORITHM=false

# API Configuration
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_RETRY_ATTEMPTS=3
NEXT_PUBLIC_CACHE_DURATION=300000

# Performance & Optimization
NEXT_PUBLIC_BUNDLE_ANALYZER=false
NEXT_PUBLIC_DEBUG_PERFORMANCE=false
NEXT_PUBLIC_ENABLE_SWC_MINIFICATION=true

# Development Configuration
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_ENABLE_API_MOCKING=false

# Security
NEXT_PUBLIC_ENABLE_CSP=true
NEXT_PUBLIC_CSRF_SECRET=your-csrf-secret-here

# Third-party Services
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# Deployment Configuration
NEXT_PUBLIC_DEPLOYMENT_ENV=development
NEXT_PUBLIC_API_BASE_URL=https://api.audiotruyen.com
NEXT_PUBLIC_WS_URL=wss://api.audiotruyen.com/ws
```

#### Environment-specific configs
```bash
# .env.development
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_ENABLE_API_MOCKING=true
NEXT_PUBLIC_BUNDLE_ANALYZER=true
```

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=error
NEXT_PUBLIC_ENABLE_API_MOCKING=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

---

## CI/CD Configuration

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint
        
      - name: Unit tests
        run: npm run test:coverage
        
      - name: E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build:prod
        env:
          NODE_ENV: production
          
      - name: Analyze bundle
        run: npm run build:analyze
        if: github.ref == 'refs/heads/main'
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: |
            .next/
            out/
          
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        run: npm run deployment:deploy:vercel
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  lighthouse:
    name: Lighthouse Audit
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build:prod
        env:
          NODE_ENV: production
          
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://audiotruyen-clone.vercel.app/
            https://audiotruyen-clone.vercel.app/tim-kiem?q=test
            https://audiotruyen-clone.vercel.app/the-loai/kinh-di
          configPath: '.lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/"
    },
    {
      "source": "/story/(.*)",
      "destination": "/truyen/$1"
    }
  ]
}
```

This comprehensive configuration setup provides optimal development workflow, build optimization, and deployment pipeline for the AudioTruyen Clone project.