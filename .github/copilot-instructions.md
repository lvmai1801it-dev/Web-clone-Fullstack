# Copilot Instructions for Audio Stories Platform

## Architecture Overview
This is a full-stack audio/web novel platform with:
- **Frontend**: Next.js 16+ with App Router, React 19, Prisma ORM + MariaDB
- **Backend**: Native PHP 8.1 (no framework) with MVC + Repository pattern
- **API Communication**: REST with JWT authentication

## Key Architectural Decisions

### 1. Two-Tier Architecture with Independent Databases
- **Frontend DB** (`audiotruyen-clone/`): Prisma + MariaDB for content caching/SSR
- **Backend DB** (`backend_php/`): Raw PDO + MySQL for authoritative data
- **Data Flow**: Frontend fetches from PHP backend API, optionally syncs to Prisma for SSR optimization
- **Why**: Separation of concerns; backend is source of truth; frontend can work offline with cached data

### 2. Authentication & Authorization
- **Mechanism**: JWT tokens via `firebase/php-jwt`
- **Flow**: 
  1. `POST /api/v1/user/login` → Returns JWT token
  2. Client sends `Authorization: Bearer <token>` header
  3. `AuthMiddleware` verifies and injects user data into request
- **Frontend**: Pass token in fetch headers; use Server Actions for auth flows

### 3. Routing & Request Handling
- **Backend Router** (`lib/Router/Router.php`): Custom regex-based router
  - Supports path parameters: `/users/{id}` 
  - Enables running under subdirectory (`/backend_php/public/`) or root
  - Requires Apache with `.htaccess` and `mod_rewrite`
- **Frontend Router**: Next.js App Router with route groups and dynamic routes

## Backend (PHP) Essentials

### Required Standards
- **`declare(strict_types=1)`** at top of every file (MANDATORY)
- **Type declarations** for all parameters and return types
- **PSR-4 autoloading** with namespaces: `App\*`, `Lib\*`, `Config\*`
- **No ORM**: All queries use PDO with prepared statements for performance on shared hosting

### Code Organization
```
api/routes.php                 # Register all routes here
app/Controllers/*.php          # Handle HTTP requests
app/Services/*.php             # Business logic (no DB direct access)
app/Repositories/*.php         # Database layer only
app/Models/*.php               # Entity definitions
lib/Database/DatabaseConnection.php  # PDO singleton
lib/Auth/JwtAuthenticator.php  # JWT utilities
```

### Common Patterns
**Repository Pattern Example**:
```php
// app/Repositories/StoryRepository.php
public function findBySlug(string $slug): ?array {
    $stmt = $this->connection->prepare("
        SELECT s.*, a.name as author_name FROM stories s
        LEFT JOIN authors a ON s.author_id = a.id
        WHERE s.slug = :slug AND s.deleted_at IS NULL
    ");
    $stmt->execute([':slug' => $slug]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// app/Services/StoryService.php
public function findBySlug(string $slug): ?array {
    return $this->storyRepository->findBySlug($slug);
}

// app/Controllers/StoryController.php
public function show(string $slug): void {
    $story = $this->storyService->findBySlug($slug);
    $this->successResponse($story);
}
```

### Swagger Documentation
- Add `use OpenApi\Annotations as OA;` to controller files
- Annotate each endpoint with `/** @OA\Get(...) */` etc.
- Generate at runtime: `/api/v1/swagger-doc` returns JSON spec
- UI available at `/docs/index.html`

## Frontend (Next.js) Essentials

### Component Philosophy
- **Server Components by default** (no `use client`)
- **Client Components only for interactivity**: state, event handlers, browser APIs
- **Data fetching in Server Components** directly; never in Client Components (except TanStack Query)
- **Server Actions** for form submissions and mutations

### Data Fetching Pattern
```typescript
// ✅ Server Component - fetch directly
async function StoryList() {
  const stories = await fetch(`${BACKEND_API}/api/v1/public/stories`, {
    next: { revalidate: 3600, tags: ['stories'] }
  }).then(r => r.json());
  
  return <StoryCard stories={stories} />;
}

// ✅ Client Component - only for interactivity
'use client';
function FilterButton({ onFilter }: { onFilter: (filter: string) => void }) {
  const [selected, setSelected] = useState('');
  return <button onClick={() => onFilter(selected)}>Filter</button>;
}

// ✅ Server Action - mutations
'use server';
export async function saveToBookmarks(storyId: string) {
  const response = await fetch(`${BACKEND_API}/api/v1/user/bookmarks`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify({ story_id: storyId })
  });
  revalidateTag('bookmarks');
}
```

### Routing & Type Safety
- **Dynamic Routes** use `params: Promise<{ slug: string }>`
- **Strongly typed**: Export `interface PageProps` for type safety
- **Link prefetch**: Use `<Link href="..." prefetch={true}>` for common navigation

### Key Files
- [prisma/schema.prisma](../audiotruyen-clone/prisma/schema.prisma) - Define data models here
- [src/lib/types.ts](../audiotruyen-clone/src/lib/types.ts) - TypeScript interfaces for API responses
- [src/lib/utils.ts](../audiotruyen-clone/src/lib/utils.ts) - Shared utility functions
- [rules_frontend.md](../audiotruyen-clone/rules_frontend.md) - Detailed Next.js rules

## Development Workflows

### Backend Setup & Testing
```bash
cd backend_php
composer install
cp .env.example .env  # Configure DATABASE_URL
# Test endpoint: curl http://localhost/backend_php/public/api/v1/health
```

### Frontend Setup & Development
```bash
cd audiotruyen-clone
npm install
npm run dev                # Start at http://localhost:3000
npm run build && npm start # Production build
npm run test              # Vitest
npm run lint              # ESLint
```

### Database Migrations
- **Backend**: Manual SQL migrations in `backend_php/prisma/migrations/` folder structure
- **Frontend**: Prisma migrations with `npx prisma migrate dev --name <name>`

### Docker
- `docker-compose.yml` defines MariaDB/MySQL and PHP services
- Use for local development to avoid machine-specific setup issues

## Integration Patterns

### Frontend ↔ Backend API Calls
1. **Read (GET)**: Direct fetch in Server Components
   - Cache with `next: { revalidate: 3600, tags: ['stories'] }`
   - Use `revalidateTag('stories')` after mutations
2. **Write (POST/PUT)**: Server Actions
   - Send JWT token in Authorization header
   - Handle errors with try/catch, return meaningful messages

### Authentication Flow
```typescript
// 1. Login (Server Action)
'use server';
export async function login(email: string, password: string) {
  const response = await fetch(`${BACKEND_API}/api/v1/user/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const { data: { token } } = await response.json();
  // Store token (cookies, session, etc.)
  return token;
}

// 2. Subsequent requests include token
const headers = { 
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json' 
};
```

## Error Handling & Validation

### Backend Response Format (Standard)
```json
{
  "success": true/false,
  "message": "Description",
  "data": { /* response payload */ },
  "timestamp": 1234567890,
  "errors": { /* validation errors */ }
}
```

### Frontend Error Handling
- Catch HTTP errors and display user-friendly messages
- Log unexpected errors for debugging
- Distinguish between validation errors (show user) and server errors (log)

## Database Schema & Key Models

### Backend (PHP) - Source of Truth
- **users**: User accounts with JWT support
- **stories**: Main content (title, slug, status, author_id)
- **chapters**: Individual chapters/episodes with audio_url
- **categories**: Genre/category tags
- **authors**: Author metadata
- Soft deletes: All tables have `deleted_at` (not physically deleted)

### Frontend (Prisma) - Cache Layer
- Mirrors core schema for SSR and offline support
- Optional: subset of data as determined by UI needs
- Sync periodically or on-demand from backend

## Code Style & Patterns

### Backend PHP
- Namespace everything: `namespace App\Controllers;`
- Use constructor dependency injection
- All public methods should have PHPDoc comments
- Use constants for magic strings: `const ITEMS_PER_PAGE = 20;`

### Frontend TypeScript/React
- Use `satisfies` keyword for type checking without explicit types when obvious
- Component names PascalCase, files match component name
- Separate UI logic from business logic
- Use TSDoc for exported functions/components

## Debugging & Logging

### Backend
- Logs in `storage/logs/` (check `lib/Logger/Logger.php`)
- Enable query logging for slow query detection
- Use Swagger UI at `/docs/` to test endpoints interactively

### Frontend
- Next.js dev tools in browser
- Server-side errors in terminal output
- Client-side errors in browser console
- Use `npm run dev` with `--debug` flag for verbose logging

## Important Notes for AI Agents

1. **Always check existing patterns** in codebase before implementing new features
2. **Repository pattern is mandatory** for backend - never query DB directly in controllers
3. **Server Components by default** for frontend - ask if you should use client component
4. **Prepared statements only** in backend - never concatenate SQL strings
5. **Type safety everywhere** - TypeScript in frontend, type declarations in backend
6. **Backend is source of truth** - frontend data should be considered a cache/view
7. **Soft deletes** - use `deleted_at IS NULL` in WHERE clauses, never hard delete
8. **Test with actual backend** - don't assume API responses match types; check actual backend code

## References
- [Backend Architecture Rules](backend_php/docs/architecture_rules.md)
- [Backend Documentation](backend_php/docs/documentation.md)
- [Backend Project Context](backend_php/docs/project_context.md)
- [Frontend Rules](audiotruyen-clone/rules_frontend.md)
- [Prisma Schema](audiotruyen-clone/prisma/schema.prisma)
