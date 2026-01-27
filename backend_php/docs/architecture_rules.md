# 📋 **QUY TẮC BACKEND PHP + MYSQL (BẮT BUỘC)**

## 🚨 **KIẾN TRÚC PROJECT**

### **1. Cấu trúc thư mục backend**
```
backend/
├── 📁 api/                    # API endpoints
│   ├── v1/                   # Version 1
│   │   ├── public/           # Public APIs
│   │   ├── user/             # User APIs
│   │   ├── admin/            # Admin APIs
│   │   └── middleware/       # Middleware
├── 📁 app/                   # Core application
│   ├── Core/                 # Base classes
│   ├── Controllers/          # Controllers
│   ├── Models/               # Models
│   ├── Services/             # Business logic
│   ├── Repositories/         # Data access layer
│   ├── DTOs/                 # Data Transfer Objects
│   └── Exceptions/           # Custom exceptions
├── 📁 config/                # Configuration
│   ├── database.php
│   ├── cors.php
│   └── constants.php
├── 📁 lib/                   # Libraries
│   ├── Database/             # DB abstraction
│   ├── Auth/                 # Authentication
│   ├── Validator/            # Validation
│   └── Logger/               # Logging
├── 📁 storage/               # File storage
│   ├── logs/                 # Application logs
│   ├── cache/                # Cache files
│   └── uploads/              # Uploaded files
├── 📁 tests/                 # Tests
├── 📁 public/                # Public folder
│   └── index.php             # Entry point
├── .htaccess                 # Apache config
├── composer.json             # Dependencies
└── README.md                 # Documentation
```

**LUẬT 1.1**: MVC pattern nghiêm ngặt  
**LUẬT 1.2**: Separation of concerns rõ ràng  
**LUẬT 1.3**: Không có logic trong public folder ngoài index.php  

## 🔧 **QUY TẮC CODE PHP**

### **2. PHP Standards (PSR)**
```php
// ✅ PSR-1, PSR-12 compliant
<?php

declare(strict_types=1); // LUẬT 2.1: BẮT BUỘC

namespace App\Controllers;

use App\Models\User;
use App\Services\UserService;
use App\Exceptions\ValidationException;

/**
 * User Controller - Quản lý người dùng
 * @package App\Controllers
 */
class UserController extends BaseController
{
    private UserService $userService; // LUẬT 2.2: Type declarations
    
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    
    /**
     * Get user by ID
     * @param int $userId User ID
     * @return array User data
     * @throws NotFoundException
     */
    public function getUser(int $userId): array // LUẬT 2.3: Return types
    {
        return $this->userService->findById($userId);
    }
}
```

**LUẬT 2.1**: `declare(strict_types=1)` BẮT BUỘC  
**LUẬT 2.2**: Type declarations cho tất cả method parameters và return  
**LUẬT 2.3**: Follow PSR-12 coding standard  
**LUẬT 2.4**: Namespace theo PSR-4  

### **3. Database Layer Rules**
```php
// ✅ Repository Pattern
// app/Repositories/StoryRepository.php
class StoryRepository
{
    private PDO $connection;
    
    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }
    
    /**
     * Find story by slug with paginated chapters
     * @param string $slug Story slug
     * @param int $page Page number
     * @param int $perPage Items per page
     * @return array Story with chapters
     */
    public function findBySlugWithChapters(
        string $slug, 
        int $page = 1, 
        int $perPage = 20
    ): ?array {
        $offset = ($page - 1) * $perPage;
        
        $sql = "
            SELECT s.*, a.name as author_name
            FROM stories s
            LEFT JOIN authors a ON s.author_id = a.id
            WHERE s.slug = :slug AND s.deleted_at IS NULL
        ";
        
        $stmt = $this->connection->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $story = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$story) {
            return null;
        }
        
        // Get paginated chapters
        $chaptersSql = "
            SELECT * FROM chapters 
            WHERE story_id = :story_id 
            AND deleted_at IS NULL
            ORDER BY chapter_number ASC
            LIMIT :limit OFFSET :offset
        ";
        
        $chaptersStmt = $this->connection->prepare($chaptersSql);
        $chaptersStmt->execute([
            ':story_id' => $story['id'],
            ':limit' => $perPage,
            ':offset' => $offset
        ]);
        
        $story['chapters'] = $chaptersStmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $story;
    }
}
```

**LUẬT 3.1**: Repository pattern cho tất cả database access  
**LUẬT 3.2**: Chỉ PDO, không mysqli  
**LUẬT 3.3**: Prepared statements BẮT BUỘC cho tất cả queries  
**LUẬT 3.4**: Không có raw SQL trong Controllers  

### **4. Controller Rules**
```php
// ✅ Clean Controller với dependency injection
// app/Controllers/Api/v1/StoryController.php
class StoryController extends ApiController
{
    private StoryService $storyService;
    private RequestValidator $validator;
    
    public function __construct(
        StoryService $storyService,
        RequestValidator $validator
    ) {
        parent::__construct();
        $this->storyService = $storyService;
        $this->validator = $validator;
    }
    
    /**
     * Get stories with filtering and pagination
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Validate input
            $filters = $this->validator->validateFilters($request);
            
            // Business logic in Service layer
            $result = $this->storyService->getStories($filters);
            
            return $this->successResponse($result);
            
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->getErrors());
        } catch (NotFoundException $e) {
            return $this->notFoundResponse($e->getMessage());
        } catch (Exception $e) {
            // Log error
            Logger::error($e->getMessage(), ['exception' => $e]);
            return $this->serverErrorResponse();
        }
    }
    
    /**
     * Create new story (Admin only)
     * @param Request $request
     * @return JsonResponse
     */
    #[Authorize(roles: ['admin'])] // Attribute-based authorization
    public function store(Request $request): JsonResponse
    {
        $data = $this->validator->validateStoryCreation($request);
        
        $story = $this->storyService->createStory(
            $data, 
            $request->getUserId()
        );
        
        return $this->createdResponse($story);
    }
}
```

**LUẬT 4.1**: Controllers chỉ xử lý HTTP, không business logic  
**LUẬT 4.2**: Dependency injection cho tất cả dependencies  
**LUẬT 4.3**: Luôn return JsonResponse cho API  
**LUẬT 4.4**: Try-catch trong controller, throw exceptions từ services  

### **5. Service Layer Rules**
```php
// ✅ Service Layer - Business logic
// app/Services/StoryService.php
class StoryService
{
    private StoryRepository $storyRepo;
    private AuthorRepository $authorRepo;
    private CacheService $cache;
    
    public function __construct(
        StoryRepository $storyRepo,
        AuthorRepository $authorRepo,
        CacheService $cache
    ) {
        $this->storyRepo = $storyRepo;
        $this->authorRepo = $authorRepo;
        $this->cache = $cache;
    }
    
    /**
     * Get stories with caching
     * @param array $filters
     * @return array
     */
    public function getStories(array $filters): array
    {
        $cacheKey = 'stories_' . md5(serialize($filters));
        
        // Cache layer
        if ($cached = $this->cache->get($cacheKey)) {
            return $cached;
        }
        
        $stories = $this->storyRepo->findByFilters($filters);
        
        // Transform data
        $result = array_map(function($story) {
            return $this->transformStory($story);
        }, $stories);
        
        // Cache for 5 minutes
        $this->cache->set($cacheKey, $result, 300);
        
        return $result;
    }
    
    /**
     * Create new story
     * @param array $data
     * @param int $userId
     * @return array
     * @throws ValidationException
     */
    public function createStory(array $data, int $userId): array
    {
        // Business validation
        if (!$this->authorRepo->exists($data['author_id'])) {
            throw new ValidationException('Author not found');
        }
        
        // Generate slug
        $data['slug'] = $this->generateSlug($data['title']);
        
        // Create in database
        $storyId = $this->storyRepo->create($data);
        
        // Clear cache
        $this->cache->deleteByPrefix('stories_');
        
        // Log activity
        Logger::info('Story created', [
            'story_id' => $storyId,
            'user_id' => $userId
        ]);
        
        return $this->storyRepo->findById($storyId);
    }
}
```

**LUẬT 5.1**: Business logic chỉ trong Service layer  
**LUẬT 5.2**: Services không biết về HTTP/Request  
**LUẬT 5.3**: Dependency injection cho repositories  
**LUẬT 5.4**: Xử lý caching trong services  

## 🛡️ **SECURITY RULES**

### **6. Authentication & Authorization**
```php
// ✅ JWT Authentication
// lib/Auth/JwtAuthenticator.php
class JwtAuthenticator
{
    private string $secret;
    
    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }
    
    public function authenticate(Request $request): ?User
    {
        $token = $this->extractToken($request);
        
        if (!$token) {
            return null;
        }
        
        try {
            $payload = JWT::decode($token, $this->secret, ['HS256']);
            return $this->userRepository->findById($payload->userId);
        } catch (Exception $e) {
            throw new AuthenticationException('Invalid token');
        }
    }
    
    public function createToken(User $user): string
    {
        $payload = [
            'userId' => $user->getId(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'iat' => time(),
            'exp' => time() + 3600 // 1 hour
        ];
        
        return JWT::encode($payload, $this->secret, 'HS256');
    }
}

// ✅ Middleware Authorization
// api/middleware/AuthMiddleware.php
class AuthMiddleware
{
    public function handle(Request $request, callable $next): Response
    {
        $auth = new JwtAuthenticator(getenv('JWT_SECRET'));
        $user = $auth->authenticate($request);
        
        if (!$user) {
            return new JsonResponse([
                'error' => 'Unauthorized'
            ], 401);
        }
        
        // Attach user to request
        $request->setAttribute('user', $user);
        
        return $next($request);
    }
}

// ✅ Role-based Authorization
#[Attribute(Attribute::TARGET_METHOD)]
class Authorize
{
    public function __construct(
        public array $roles = [],
        public array $permissions = []
    ) {}
}
```

**LUẬT 6.1**: JWT cho API authentication  
**LUẬT 6.2**: Middleware cho route protection  
**LUẬT 6.3**: Role-based và permission-based authorization  
**LUẬT 6.4**: Password hashing với `password_hash()` và `password_verify()`  

### **7. Input Validation & Sanitization**
```php
// ✅ Validation Service
// lib/Validator/RequestValidator.php
class RequestValidator
{
    public function validateStoryCreation(Request $request): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'author_id' => ['required', 'integer', 'min:1'],
            'description' => ['string', 'max:2000'],
            'cover_url' => ['nullable', 'url', 'max:500'],
            'categories' => ['array', 'max:5'],
            'categories.*' => ['integer', 'min:1']
        ];
        
        $data = $request->getParsedBody();
        
        $errors = $this->validate($data, $rules);
        
        if (!empty($errors)) {
            throw new ValidationException($errors);
        }
        
        // Sanitize data
        return [
            'title' => htmlspecialchars($data['title'], ENT_QUOTES, 'UTF-8'),
            'author_id' => (int) $data['author_id'],
            'description' => isset($data['description']) 
                ? htmlspecialchars($data['description'], ENT_QUOTES, 'UTF-8')
                : null,
            'cover_url' => $data['cover_url'] ?? null,
            'categories' => $data['categories'] ?? []
        ];
    }
    
    public function validateFilters(Request $request): array
    {
        $allowedFilters = ['author', 'category', 'status', 'search', 'sort'];
        
        $filters = [];
        foreach ($allowedFilters as $filter) {
            $value = $request->getQueryParam($filter);
            if ($value !== null) {
                $filters[$filter] = $this->sanitize($value);
            }
        }
        
        return $filters;
    }
    
    private function sanitize($value)
    {
        if (is_string($value)) {
            return htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
        }
        if (is_array($value)) {
            return array_map([$this, 'sanitize'], $value);
        }
        return $value;
    }
}
```

**LUẬT 7.1**: Validate TẤT CẢ user input  
**LUẬT 7.2**: Sanitize trước khi lưu database  
**LUẬT 7.3**: Escape output với `htmlspecialchars()`  
**LUẬT 7.4**: Prepared statements cho SQL queries  

## 🗄️ **DATABASE RULES**

### **8. MySQL Database Rules**
```sql
-- ✅ Database Schema Standards
CREATE TABLE stories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    cover_url VARCHAR(500),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    total_chapters INT UNSIGNED DEFAULT 0,
    total_views INT UNSIGNED DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    -- Foreign keys
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT,
    
    -- Indexes
    INDEX idx_stories_author (author_id),
    INDEX idx_stories_status (status),
    INDEX idx_stories_featured (is_featured),
    INDEX idx_stories_created (created_at),
    FULLTEXT INDEX idx_stories_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ✅ Soft delete pattern
UPDATE stories SET deleted_at = NOW() WHERE id = ?;

-- ✅ Query with soft delete check
SELECT * FROM stories WHERE deleted_at IS NULL;
```

**LUẬT 8.1**: InnoDB engine BẮT BUỘC  
**LUẬT 8.2**: UTF8MB4 charset BẮT BUỘC  
**LUẬT 8.3**: Soft delete pattern cho tất cả user-generated content  
**LUẬT 8.4**: Foreign keys với ON DELETE RESTRICT  
**LUẬT 8.5**: Indexes cho tất cả WHERE, JOIN, ORDER BY columns  

### **9. Query Performance Rules**
```php
// ✅ Efficient queries với pagination
public function getStoriesWithChapters(int $page = 1, int $perPage = 20): array
{
    $offset = ($page - 1) * $perPage;
    
    // LUẬT: SELECT chỉ columns cần thiết
    $sql = "
        SELECT 
            s.id, s.title, s.slug, s.cover_url, s.total_chapters,
            a.id as author_id, a.name as author_name, a.slug as author_slug,
            COUNT(DISTINCT c.id) as chapters_count,
            AVG(r.rating) as average_rating
        FROM stories s
        INNER JOIN authors a ON s.author_id = a.id
        LEFT JOIN chapters c ON s.id = c.story_id AND c.deleted_at IS NULL
        LEFT JOIN ratings r ON s.id = r.story_id
        WHERE s.deleted_at IS NULL
          AND s.status = 'published'
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT :limit OFFSET :offset
    ";
    
    $stmt = $this->connection->prepare($sql);
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ✅ Count total for pagination (separate query)
public function countPublishedStories(): int
{
    $sql = "SELECT COUNT(*) as total FROM stories WHERE deleted_at IS NULL AND status = 'published'";
    $stmt = $this->connection->query($sql);
    return (int) $stmt->fetchColumn();
}
```

**LUẬT 9.1**: SELECT chỉ columns cần thiết  
**LUẬT 9.2**: Pagination với LIMIT/OFFSET  
**LUẬT 9.3**: Count total riêng cho pagination  
**LUẬT 9.4**: Không SELECT *  
**LUẬT 9.5**: Indexes cho tất cả WHERE và JOIN conditions  

## 📊 **API RESPONSE FORMAT**

### **10. Standard API Response Format**
```php
// ✅ Consistent response format
class ApiController
{
    protected function successResponse(
        $data = null, 
        string $message = 'Success', 
        int $statusCode = 200
    ): JsonResponse {
        return new JsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => time(),
            'version' => '1.0'
        ], $statusCode);
    }
    
    protected function paginatedResponse(
        array $items, 
        int $total, 
        int $page, 
        int $perPage,
        array $meta = []
    ): JsonResponse {
        $lastPage = ceil($total / $perPage);
        
        return $this->successResponse([
            'items' => $items,
            'pagination' => [
                'total' => $total,
                'count' => count($items),
                'per_page' => $perPage,
                'current_page' => $page,
                'total_pages' => $lastPage,
                'has_more' => $page < $lastPage,
                'next_page' => $page < $lastPage ? $page + 1 : null,
                'prev_page' => $page > 1 ? $page - 1 : null
            ],
            'meta' => $meta
        ]);
    }
    
    protected function errorResponse(
        string $message, 
        int $statusCode = 400,
        array $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => time(),
            'version' => '1.0'
        ];
        
        if ($errors) {
            $response['errors'] = $errors;
        }
        
        return new JsonResponse($response, $statusCode);
    }
}
```

**LUẬT 10.1**: Consistent response format  
**LUẬT 10.2**: Pagination metadata  
**LUẬT 10.3**: Error responses với status codes chuẩn HTTP  
**LUẬT 10.4**: CORS headers cho tất cả responses  

## 🔍 **ERROR HANDLING & LOGGING**

### **11. Error Handling Rules**
```php
// ✅ Custom Exception Hierarchy
// app/Exceptions/
class AppException extends Exception 
{
    protected int $httpStatusCode = 500;
    
    public function getHttpStatusCode(): int 
    {
        return $this->httpStatusCode;
    }
}

class ValidationException extends AppException 
{
    protected int $httpStatusCode = 422;
    private array $errors;
    
    public function __construct(array $errors, string $message = 'Validation failed')
    {
        parent::__construct($message);
        $this->errors = $errors;
    }
    
    public function getErrors(): array 
    {
        return $this->errors;
    }
}

class NotFoundException extends AppException 
{
    protected int $httpStatusCode = 404;
}

// ✅ Global Error Handler
set_exception_handler(function (Throwable $e) {
    $logger = new Logger();
    $logger->error($e->getMessage(), [
        'exception' => $e,
        'trace' => $e->getTraceAsString()
    ]);
    
    if ($e instanceof AppException) {
        http_response_code($e->getHttpStatusCode());
        echo json_encode([
            'error' => $e->getMessage(),
            'code' => $e->getCode()
        ]);
    } else {
        // Don't expose internal errors in production
        if (getenv('APP_ENV') === 'production') {
            echo json_encode(['error' => 'Internal server error']);
        } else {
            echo json_encode([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
        }
    }
});
```

**LUẬT 11.1**: Custom exceptions cho business logic  
**LUẬT 11.2**: Global error handler  
**LUẬT 11.3**: Log tất cả errors  
**LUẬT 11.4**: Không expose internal errors trong production  

## 📈 **PERFORMANCE OPTIMIZATION**

### **12. Caching Rules**
```php
// ✅ Multi-layer caching
class CacheService
{
    private Redis $redis;
    private array $localCache = [];
    
    public function get(string $key)
    {
        // 1. Local cache (request lifetime)
        if (isset($this->localCache[$key])) {
            return $this->localCache[$key];
        }
        
        // 2. Redis cache
        $data = $this->redis->get($key);
        if ($data !== false) {
            $this->localCache[$key] = unserialize($data);
            return $this->localCache[$key];
        }
        
        return null;
    }
    
    public function set(string $key, $value, int $ttl = 300): bool
    {
        $this->localCache[$key] = $value;
        return $this->redis->setex($key, $ttl, serialize($value));
    }
}

// ✅ Database query caching
public function getPopularStories(int $limit = 10): array
{
    $cacheKey = "popular_stories_{$limit}";
    
    if ($cached = $this->cache->get($cacheKey)) {
        return $cached;
    }
    
    $stories = $this->storyRepository->findPopular($limit);
    $this->cache->set($cacheKey, $stories, 600); // 10 minutes
    
    return $stories;
}
```

**LUẬT 12.1**: Cache tại nhiều level (local, Redis, database)  
**LUẬT 12.2**: Cache keys với versioning  
**LUẬT 12.3**: Cache invalidation khi data thay đổi  
**LUẬT 12.4**: TTL hợp lý cho từng loại data  

## 🧪 **TESTING RULES**

### **13. Testing Standards**
```php
// ✅ Unit Tests với PHPUnit
// tests/Unit/Services/StoryServiceTest.php
class StoryServiceTest extends TestCase
{
    private StoryService $service;
    private MockObject $storyRepoMock;
    
    protected function setUp(): void
    {
        $this->storyRepoMock = $this->createMock(StoryRepository::class);
        $this->service = new StoryService($this->storyRepoMock);
    }
    
    public function testGetStoryReturnsStory(): void
    {
        $expectedStory = ['id' => 1, 'title' => 'Test Story'];
        
        $this->storyRepoMock->method('findById')
            ->with(1)
            ->willReturn($expectedStory);
        
        $result = $this->service->getStory(1);
        
        $this->assertEquals($expectedStory, $result);
    }
    
    public function testGetStoryThrowsNotFoundException(): void
    {
        $this->storyRepoMock->method('findById')
            ->with(999)
            ->willReturn(null);
        
        $this->expectException(NotFoundException::class);
        
        $this->service->getStory(999);
    }
}

// ✅ Integration Tests
// tests/Integration/Api/StoryApiTest.php
class StoryApiTest extends ApiTestCase
{
    public function testGetStoriesReturnsPaginatedResults(): void
    {
        // Create test data
        $this->createTestStories(25);
        
        $response = $this->get('/api/v1/stories?page=2&limit=10');
        
        $this->assertEquals(200, $response->getStatusCode());
        
        $data = json_decode($response->getBody()->getContents(), true);
        
        $this->assertTrue($data['success']);
        $this->assertCount(10, $data['data']['items']);
        $this->assertEquals(25, $data['data']['pagination']['total']);
        $this->assertEquals(2, $data['data']['pagination']['current_page']);
    }
}
```

**LUẬT 13.1**: Unit tests cho services và repositories  
**LUẬT 13.2**: Integration tests cho API endpoints  
**LUẬT 13.3**: Test coverage > 80%  
**LUẬT 13.4**: Mock dependencies trong unit tests  

## 🚀 **DEPLOYMENT & MONITORING**

### **14. Deployment Rules**
```env
# ✅ Environment Configuration
# .env.production
APP_ENV=production
APP_DEBUG=false
DB_HOST=localhost
DB_NAME=audiostories
DB_USER=prod_user
DB_PASS=secure_password_here
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=very_strong_secret_key_here
API_RATE_LIMIT=1000
```

**LUẬT 14.1**: Environment variables cho tất cả configuration  
**LUẬT 14.2**: Separate .env files cho mỗi environment  
**LUẬT 14.3**: Never commit .env files  
**LUẬT 14.4**: Use environment-based configuration  

### **15. Monitoring & Logging**
```php
// ✅ Structured logging
class Logger
{
    public static function info(string $message, array $context = []): void
    {
        self::log('info', $message, $context);
    }
    
    public static function error(string $message, array $context = []): void
    {
        self::log('error', $message, $context);
    }
    
    private static function log(string $level, string $message, array $context): void
    {
        $logEntry = [
            'timestamp' => date('c'),
            'level' => $level,
            'message' => $message,
            'context' => $context,
            'request_id' => $_SERVER['REQUEST_ID'] ?? uniqid(),
            'uri' => $_SERVER['REQUEST_URI'] ?? '',
            'method' => $_SERVER['REQUEST_METHOD'] ?? ''
        ];
        
        // Write to file
        file_put_contents(
            __DIR__ . '/../../storage/logs/app.log',
            json_encode($logEntry) . PHP_EOL,
            FILE_APPEND
        );
        
        // Also send to external service in production
        if (getenv('APP_ENV') === 'production') {
            self::sendToLogService($logEntry);
        }
    }
}
```

**LUẬT 15.1**: Structured logging với context  
**LUẬT 15.2**: Log levels (debug, info, warning, error, critical)  
**LUẬT 15.3**: Log rotation (daily files)  
**LUẬT 15.4**: External log monitoring trong production  

---

## 📋 **COMPLIANCE CHECKLIST**

### **Code Review Checklist**
- [ ] PSR-12 compliant
- [ ] Type declarations đầy đủ
- [ ] Prepared statements cho SQL
- [ ] Input validation và sanitization
- [ ] Error handling đầy đủ
- [ ] Unit tests cho new code
- [ ] No sensitive data in logs
- [ ] Security headers đầy đủ

### **Security Audit Checklist**
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection cho forms
- [ ] Rate limiting cho APIs
- [ ] JWT token expiration
- [ ] Password hashing với bcrypt
- [ ] File upload validation

### **Performance Checklist**
- [ ] Database indexes đầy đủ
- [ ] Query optimization
- [ ] Caching strategy
- [ ] Gzip compression
- [ ] CDN cho static assets
- [ ] PHP opcache enabled

**VI PHẠM NGHIÊM TRỌNG**: Block deployment nếu có bất kỳ:
1. SQL injection vulnerability
2. XSS vulnerability  
3. Authentication bypass
4. Sensitive data exposure

**THỰC THI**: ESLint PHP, PHPStan, PHP CodeSniffer trong CI/CD pipeline