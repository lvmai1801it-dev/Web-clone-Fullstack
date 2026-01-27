# Báo cáo Review Code - PHP Backend (Audio Stories)

**Ngày review:** 27/01/2026  
**Người thực hiện:** AI Code Reviewer  
**Phiên bản:** v2.0 (Comprehensive)  
**Status**: Giai đoạn 1 hoàn thành, sẵn sàng giai đoạn 2

---

## 📊 Tóm tắt Tổng quan

| Tiêu chí | Đánh giá | Ghi chú |
|----------|---------|--------|
| **Architecture** | ✅ Tốt | MVC rõ ràng, PSR-4 namespace, Separation of Concerns |
| **Code Quality** | ⚠️ Cần cải thiện | 3 lỗi critical/high priority cần fix |
| **Security** | ✅ Khá tốt | JWT + Password hashing tốt, nhưng soft delete thiếu |
| **Testing** | ❌ Không có | Cần thêm unit tests (PHPUnit) |
| **Documentation** | ✅ Tốt | Swagger annotations đầy đủ, README rõ ràng |
| **Production Ready** | ⚠️ Có điều kiện | Cần fix 3 lỗi trước khi deploy |

**Tổng điểm**: ⭐⭐⭐⭐ (4/5)

---

## ✅ Điểm Mạnh (Strengths)

### 1. Kiến trúc sạch (Clean Architecture)
**Tính năng**:
- Tổ chức rõ ràng: Controllers → Services → Repositories → Database
- Separation of Concerns: DB logic tách riêng ở Repositories, business logic ở Services
- Base Classes (`BaseController`, `BaseRepository`, `BaseService`) giảm code trùng lặp
- PSR-4 Namespacing: Autoloading đúng chuẩn

**Ví dụ tốt**:
```php
// ✅ AuthService xử lý business logic, không trực tiếp DB
public function login(string $email, string $password): array {
    $user = $this->userRepository->findByEmail($email);  // Repository handles DB
    if (!password_verify($password, $user['password'])) {
        throw new AuthenticationException("Invalid credentials");
    }
    $token = $this->jwt->createToken(['id' => $user['id'], 'email' => $user['email']]);
    return ['token' => $token, 'user' => $user];
}
```

**Tác động**: Dễ test, dễ maintain, dễ extend

---

### 2. Bảo mật mạnh (Strong Security Implementation)

#### 2a. Password Security
- ✅ **BCRYPT Hashing**: `password_hash($data['password'], PASSWORD_BCRYPT)`
- ✅ **No Plain Text**: Mật khẩu không lưu thô
- ✅ **Verification**: `password_verify($input, $hash)` kiểm tra an toàn

```php
// ✓ Tốt
$data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
if (!password_verify($password, $user['password'])) { ... }
```

#### 2b. SQL Injection Prevention
- ✅ **Prepared Statements**: Triệt để sử dụng trên tất cả queries
- ✅ **Parameterized**: Tách parameter khỏi SQL query

```php
// ✓ Tốt - Chống SQL injection
$stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute([':email' => $email]);

// ✓ Tốt - List filters
$whereClause .= " AND s.status = :status";
$params[':status'] = $filters['status'];
```

#### 2c. JWT Implementation
- ✅ **Algorithm enforcement**: `JwtAuthenticator` ép buộc algorithm từ config
- ✅ **Expiration**: Token có TTL configurable (default: 1 giờ)
- ✅ **Anti-'none' attack**: Không cho phép algorithm 'none'

```php
// ✓ Tốt - Algorithm từ config, không hardcoded
$this->algo = Config::get('JWT_ALGO', 'HS256');
return JWT::decode($token, new Key($this->secret, $this->algo));
```

#### 2d. Input Validation & Sanitization
- ✅ **Validation**: Format check (email, min/max length)
- ✅ **Sanitization**: XSS prevention với `htmlspecialchars`, `strip_tags`
- ✅ **Type coercion**: Controller type cast query params `(int)`, `(bool)`

```php
// ✓ Tốt - Sanitize input
$sanitized[$key] = htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
```

#### 2e. Error Handling Security
- ✅ **Stack trace hidden**: `display_errors = '0'` di production
- ✅ **Detailed logs**: Lỗi chi tiết chỉ log, không trả về client
- ✅ **Status codes**: HTTP error codes cho client (500, 400, 401, etc.)

```php
// ✓ Tốt - Production safe error response
if (Config::get('APP_DEBUG') === 'true') {
    $response['message'] = $e->getMessage();  // Chi tiết chỉ debug
} else {
    $response['message'] = 'Internal Server Error';  // Production safe
}
```

---

### 3. API Documentation & Testing Support
- ✅ **Swagger/OpenAPI**: Mỗi endpoint có annotation `@OA\Get`, `@OA\Post`
- ✅ **Interactive UI**: `/docs/index.html` cho phép test endpoints trực tuyến
- ✅ **Complete specs**: Request/response schemas, parameters, examples

**Ví dụ**:
```php
/**
 * @OA\Post(
 *     path="/api/v1/user/login",
 *     tags={"Auth"},
 *     summary="Login user",
 *     @OA\RequestBody(
 *         @OA\JsonContent(required={"email","password"}, ...)
 *     ),
 *     @OA\Response(response=200, description="Login successful")
 * )
 */
public function login() { ... }
```

---

### 4. Database Design Best Practices
- ✅ **Soft Deletes**: Cột `deleted_at` trên mỗi bảng (audit trail)
- ✅ **Timestamps**: `created_at`, `updated_at` tự động update
- ✅ **Relationships**: Foreign keys rõ ràng (authors → stories → chapters)
- ✅ **Indexing**: Primary keys, unique constraints (email, slug)

```sql
CREATE TABLE stories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    deleted_at DATETIME NULL,  -- ✓ Soft delete
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);
```

---

### 5. Code Quality & Standards
- ✅ **Type Safety**: PHP 8.1+ strict types, return type hints
- ✅ **Naming Conventions**: camelCase (variables), PascalCase (classes), snake_case (SQL)
- ✅ **Constants**: Magic strings → named constants (e.g., `PASSWORD_BCRYPT`)
- ✅ **Comments**: PHPDoc trên public methods

```php
<?php declare(strict_types=1);  // ✓ Strict types everywhere

namespace App\Services;

class AuthService {
    /**
     * Login user with email and password
     * @param string $email User email
     * @param string $password User password
     * @return array ['token' => string, 'user' => array]
     * @throws AuthenticationException
     */
    public function login(string $email, string $password): array {
        // Implementation
    }
}
```

---

## ⚠️ Vấn đề Cần Cải Thiện (Issues)

### 🚨 CRITICAL - 1. Lỗi Logic Validator Email

**File**: `lib/Validator/RequestValidator.php` (lines 39-55)  
**Mức độ**: CRITICAL - Email không được validate  
**Tác động**: Medium - Người dùng có thể đăng ký email không hợp lệ

#### Vấn đề chi tiết:

```php
// ❌ Current code
public function validate(array $data, array $rules): array {
    $errors = [];
    foreach ($rules as $field => $fieldRules) {
        foreach ($fieldRules as $rule) {
            $value = $data[$field] ?? null;
            
            if ($rule === 'required' && empty($value)) {
                $errors[$field][] = "Field '$field' is required.";
                continue;
            }
            
            // ❌ Email check nằm ĐÂY - chỉ chạy nếu rule chứa ':'
            if (str_contains($rule, ':')) {
                [$ruleName, $param] = explode(':', $rule);
                // ...
                if ($ruleName === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$field][] = "Invalid email";
                }
            }
        }
    }
}

// Usage
['email' => ['required', 'email']]  // Rule 'email' không chứa ':' → BỎ QUA!
```

**Kịch bản lỗi**:
```
User POST: { "email": "not-an-email", "password": "secret123" }
Validation rules: ['email' => ['required', 'email']]
Result: ❌ Email "not-an-email" được chấp nhận (không validate!)
```

#### Cách sửa:

```php
// ✓ Fixed code
public function validate(array $data, array $rules): array {
    $errors = [];
    foreach ($rules as $field => $fieldRules) {
        foreach ($fieldRules as $rule) {
            $value = $data[$field] ?? null;
            
            // Tách rule thành name + optional param
            $parts = explode(':', $rule);
            $ruleName = $parts[0];
            $param = $parts[1] ?? null;
            
            // Xử lý từng rule
            match ($ruleName) {
                'required' => empty($value) ? $errors[$field][] = "Required" : null,
                'string' => ($value && !is_string($value)) ? $errors[$field][] = "Must be string" : null,
                'email' => ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) ? 
                    $errors[$field][] = "Invalid email" : null,
                'max' => ($value && strlen($value) > $param) ? 
                    $errors[$field][] = "Max $param chars" : null,
                'min' => ($value && strlen($value) < $param) ? 
                    $errors[$field][] = "Min $param chars" : null,
                default => null
            };
        }
    }
    return $errors;
}
```

---

### ❌ HIGH - 2. Soft Delete Không Được Kiểm Tra

**Files**: 
- `app/Repositories/StoryRepository.php` (lines 96-115)
- `app/Repositories/ChapterRepository.php`

**Mức độ**: HIGH - Dữ liệu xóa vẫn hiển thị  
**Tác động**: High - Data inconsistency + potential information leak

#### Vấn đề chi tiết:

```php
// ❌ StoryRepository::getStories (line 53) - CÓ check
public function getStories(array $filters = []): array {
    $whereClause = "WHERE s.deleted_at IS NULL";  // ✓
}

// ❌ Nhưng findById (line 96) - THIẾU check
public function findById(int $id): ?array {
    $sql = "SELECT s.*, a.name as author_name 
            FROM stories s
            LEFT JOIN authors a ON s.author_id = a.id
            WHERE s.id = :id";  // ← THIẾU: AND s.deleted_at IS NULL
    $stmt = $this->db->prepare($sql);
    $stmt->execute([':id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// ❌ findBySlug (line 115) - THIẾU check
public function findBySlug(string $slug): ?array {
    $sql = "SELECT s.* FROM stories s
            WHERE s.slug = :slug";  // ← THIẾU: AND s.deleted_at IS NULL
}

// ❌ ChapterRepository::getChaptersByStoryId
public function getChaptersByStoryId(int $storyId, int $page = 1, int $limit = 50): ?array {
    $sql = "SELECT * FROM chapters 
            WHERE story_id = :story_id";  // ← THIẾU: AND deleted_at IS NULL
}
```

**Kịch bản lỗi**:
```
1. Admin xóa story (id=5): UPDATE stories SET deleted_at = NOW() WHERE id = 5
2. Frontend GET /api/v1/public/stories/5
   → findById() không check deleted_at
   → Trả về truyện đã xóa ❌
3. API call /api/v1/public/stories/5/chapters
   → getChaptersByStoryId() không check deleted_at
   → Trả về chương của truyện đã xóa ❌
```

#### Cách sửa:

Thêm `AND deleted_at IS NULL` (hoặc `AND s.deleted_at IS NULL`) vào tất cả WHERE clauses:

```php
// ✓ Fixed
public function findById(int $id): ?array {
    $sql = "SELECT s.*, a.name as author_name 
            FROM stories s
            LEFT JOIN authors a ON s.author_id = a.id
            WHERE s.id = :id AND s.deleted_at IS NULL";  // ← FIX
    // ...
}

public function findBySlug(string $slug): ?array {
    $sql = "SELECT s.* FROM stories s
            WHERE s.slug = :slug AND s.deleted_at IS NULL";  // ← FIX
    // ...
}

public function getChaptersByStoryId(int $storyId, int $page = 1, int $limit = 50): ?array {
    $sql = "SELECT * FROM chapters 
            WHERE story_id = :story_id AND deleted_at IS NULL
            ORDER BY chapter_number ASC
            LIMIT :limit OFFSET :offset";  // ← FIX
    // ...
}
```

---

### ⚠️ MEDIUM - 3. Input Handling Không Có Framework

**File**: `app/Controllers/StoryController.php` (line 60-70)  
**Mức độ**: MEDIUM - Bad practice, khó test  
**Tác động**: Medium - Technical debt, khó maintain

#### Vấn đề chi tiết:

```php
// ❌ Current code - Direct $_GET access
public function index() {
    $filters = [
        'search' => $_GET['q'] ?? null,  // ← Truy cập Global
        'category_id' => isset($_GET['category_id']) ? (int) $_GET['category_id'] : null,
        'author_id' => isset($_GET['author_id']) ? (int) $_GET['author_id'] : null,
        'status' => $_GET['status'] ?? null,
        'is_vip' => isset($_GET['is_vip']) ? (bool) $_GET['is_vip'] : null,
        'min_chapters' => isset($_GET['min_chapters']) ? (int) $_GET['min_chapters'] : null,
        'sort' => $_GET['sort'] ?? 'updated_at',
        'order' => $_GET['order'] ?? 'DESC',
        'page' => isset($_GET['page']) ? (int) $_GET['page'] : 1,
        'limit' => isset($_GET['limit']) ? (int) $_GET['limit'] : 20,
    ];
    $result = $this->storyRepo->getStories($filters);
}
```

**Vấn đề**:
1. Truy cập global `$_GET` → khó mock trong unit test
2. Input validation không uniform → risk miss validation
3. Type casting rải rác (có chỗ `(int)`, có chỗ `??`) → khó maintain
4. Default values rải rác → hard to change

#### Cách sửa:

Tạo Request abstraction:

```php
// ✓ lib/Request/Request.php
class Request {
    public static function query(string $key, $default = null) {
        return $_GET[$key] ?? $default;
    }
    
    public static function queryInt(string $key, int $default = 0): int {
        return isset($_GET[$key]) ? (int) $_GET[$key] : $default;
    }
    
    public static function queryBool(string $key, bool $default = false): bool {
        return isset($_GET[$key]) ? (bool) $_GET[$key] : $default;
    }
}

// ✓ Updated Controller
public function index() {
    $filters = [
        'search' => Request::query('q'),
        'category_id' => Request::queryInt('category_id'),
        'author_id' => Request::queryInt('author_id'),
        'status' => Request::query('status'),
        'is_vip' => Request::queryBool('is_vip'),
        'min_chapters' => Request::queryInt('min_chapters'),
        'sort' => Request::query('sort', 'updated_at'),
        'order' => Request::query('order', 'DESC'),
        'page' => Request::queryInt('page', 1),
        'limit' => Request::queryInt('limit', 20),
    ];
    $result = $this->storyRepo->getStories($filters);
}

// ✓ Unit test dễ hơn
class StoryControllerTest {
    public function testIndexValidation() {
        // Mock Request class
        // Test với giá trị khác nhau
    }
}
```

---

### 💡 LOW - 4. Dependency Injection Manual (Architecture Debt)

**File**: `app/Controllers/*.php` (constructors)  
**Mức độ**: LOW - Hoạt động nhưng khó test  
**Tác động**: Low - Technical debt, cản trở unit testing

#### Vấn đề:

```php
// ❌ Hard-coded DI
public function __construct() {
    $db = \Lib\Database\DatabaseConnection::getInstance();
    $repo = new \App\Repositories\UserRepository($db);
    $jwt = new \Lib\Auth\JwtAuthenticator();
    $this->authService = new AuthService($repo, $jwt);
}
```

**Vấn đề**:
- Dependencies hard-coded → khó mock trong unit test
- Nếu thay đổi `UserRepository` constructor, phải update toàn bộ Controllers
- Không có IoC Container

#### Gợi ý tương lai (Optional):

```php
// ✓ lib/Container/Container.php
class Container {
    private static $bindings = [];
    
    public static function bind(string $key, callable $resolver) {
        self::$bindings[$key] = $resolver;
    }
    
    public static function resolve(string $key) {
        return call_user_func(self::$bindings[$key]);
    }
}

// Bootstrap
Container::bind('UserRepository', function() {
    return new UserRepository(DatabaseConnection::getInstance());
});

Container::bind('AuthService', function() {
    return new AuthService(
        Container::resolve('UserRepository'),
        Container::resolve('JwtAuthenticator')
    );
});

// Controller
public function __construct() {
    $this->authService = Container::resolve('AuthService');
}
```

---

### 💡 LOW - 5. Middleware Pipeline (Architecture Debt)

**File**: `app/Controllers/AuthController.php` (line ~150)  
**Mức độ**: LOW - Manual middleware call  
**Tác động**: Low - Code smell, awkward flow

#### Vấn đề:

```php
// ❌ Manual middleware
public function profile() {
    $user = (new AuthMiddleware())->handle();  // Gọi middleware thủ công
    $userData = $this->authService->getProfile($user['id']);
    $this->successResponse($userData);
}
```

#### Gợi ý tương lai:

```php
// ✓ Framework-level middleware
$router->get('/api/v1/user/profile', 
    [AuthController::class, 'profile'],
    [AuthMiddleware::class]  // Middleware tự động
);

// Router xử lý:
public function dispatch() {
    // ...
    foreach ($middlewares as $middleware) {
        (new $middleware())->handle();
    }
    return (new $controller())->$action(...$params);
}

// Controller clean
public function profile() {
    $user = $_REQUEST['user'];  // Injected by middleware
    $userData = $this->authService->getProfile($user['id']);
    $this->successResponse($userData);
}
```

---

## 🧪 Testing & Quality

### Hiện tại:
| Metric | Giá trị | Target |
|--------|---------|--------|
| **Unit Tests** | ❌ 0% | 70%+ |
| **Integration Tests** | ❌ 0% | 50%+ |
| **Code Coverage** | ❌ 0% | 70%+ |
| **Swagger Tests** | ✅ Manual | - |
| **Type Safety** | ✅ Good | ✅ Good |

### Đề xuất thêm PHPUnit:

```bash
# Cài đặt PHPUnit
composer require --dev phpunit/phpunit

# Test file structure
tests/
├── Unit/
│   ├── Services/
│   │   └── AuthServiceTest.php
│   ├── Repositories/
│   │   └── UserRepositoryTest.php
│   └── Validators/
│       └── RequestValidatorTest.php
└── Integration/
    └── AuthApiTest.php
```

**Ví dụ test**:

```php
// ✓ tests/Unit/Services/AuthServiceTest.php
namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use App\Services\AuthService;
use App\Repositories\UserRepository;
use Lib\Auth\JwtAuthenticator;

class AuthServiceTest extends TestCase {
    private $userRepo;
    private $jwt;
    private $service;
    
    protected function setUp(): void {
        $this->userRepo = $this->createMock(UserRepository::class);
        $this->jwt = $this->createMock(JwtAuthenticator::class);
        $this->service = new AuthService($this->userRepo, $this->jwt);
    }
    
    public function testLoginWithValidCredentials() {
        $this->userRepo->method('findByEmail')
            ->willReturn([
                'id' => 1,
                'email' => 'user@test.com',
                'password' => password_hash('secret', PASSWORD_BCRYPT),
                'status' => 'active'
            ]);
        
        $this->jwt->method('createToken')
            ->willReturn('fake_token_123');
        
        $result = $this->service->login('user@test.com', 'secret');
        
        $this->assertArrayHasKey('token', $result);
        $this->assertEquals('fake_token_123', $result['token']);
    }
    
    public function testLoginWithInvalidPassword() {
        $this->expectException(AuthenticationException::class);
        
        $this->userRepo->method('findByEmail')
            ->willReturn([
                'id' => 1,
                'password' => password_hash('secret', PASSWORD_BCRYPT)
            ]);
        
        $this->service->login('user@test.com', 'wrong_password');
    }
}
```

---

## 📋 Action Plan (Kế hoạch hành động)

### 🔴 Priority 1 - CRITICAL (Fix ngay lập tức)

**FIX-1: Email Validation Logic**
- **Files**: `lib/Validator/RequestValidator.php`
- **Change**: Refactor validation logic để handle rules không chứa `:`
- **Time**: 30 phút
- **Risk**: Low (isolated change)
- **Test**: Manual test with invalid emails

```bash
POST /api/v1/user/register
{
  "email": "invalid-email",  # Should be rejected
  "password": "secret123",
  "username": "testuser"
}
# Expected: 400 Bad Request with email validation error
# Current: 201 Created (BUG!)
```

---

### 🟠 Priority 2 - HIGH (Fix trong sprint tiếp theo)

**FIX-2: Soft Delete Checks**
- **Files**: 
  - `app/Repositories/StoryRepository.php` (findById, findBySlug)
  - `app/Repositories/ChapterRepository.php` (getChaptersByStoryId)
  - `app/Repositories/AuthorRepository.php` (if exists)
  - `app/Repositories/CategoryRepository.php` (if exists)
- **Change**: Add `AND deleted_at IS NULL` to all SELECT queries
- **Time**: 1 hour
- **Risk**: Low (straightforward SQL fix)
- **Test**: Verify deleted stories return 404

```bash
# Delete a story
DELETE FROM stories WHERE id = 5;  # Actually: UPDATE stories SET deleted_at = NOW()

# Verify it's gone from API
GET /api/v1/public/stories/5
# Expected: 404 Not Found
# Current: 200 OK with deleted story (BUG!)
```

---

### 🟡 Priority 3 - MEDIUM (Refactor)

**FIX-3: Input Handling Abstraction**
- **Files**: 
  - Create `lib/Request/Request.php`
  - Update `app/Controllers/StoryController.php`, `AuthController.php`
- **Change**: Extract `$_GET/$_POST` access to Request class
- **Time**: 1.5 hours
- **Risk**: Medium (touches controllers)
- **Test**: All API tests pass

---

### 🟢 Priority 4 - NICE TO HAVE (Tương lai)

**ENHANCE-1: IoC Container**
- Create `lib/Container/Container.php`
- Implement service binding/resolution
- Time: 2-3 hours, Phase 2+

**ENHANCE-2: Middleware Pipeline**
- Update Router to support automatic middleware
- Time: 2-3 hours, Phase 2+

**ENHANCE-3: Unit Tests**
- PHPUnit + test suite
- Focus on Service layer + Repositories
- Time: 4-6 hours, Phase 2+

---

## 📊 Metrics & Summary

### Code Quality Metrics
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Test Coverage | 0% | 70% | -70% |
| Security Issues | 3 (1C, 1H) | 0 | 3 |
| Code Duplication | Low | Low | ✓ |
| Documentation | Good | Good | ✓ |
| Type Safety | Good | Good | ✓ |

### Issue Breakdown
| Severity | Count | Estimated Fix Time |
|----------|-------|-------------------|
| Critical | 1 | 30 min |
| High | 1 | 1 hour |
| Medium | 1 | 1.5 hours |
| Low | 2 | 2-3 hours (optional) |

**Total time to production-ready**: ~3 hours

---

## ✨ Kết luận

### Summary
Backend hiện tại có **kiến trúc sạch**, **bảo mật tốt**, **documentation đầy đủ**, nhưng có **3 lỗi cần sửa** trước khi production:

1. **Email validation bypass** (CRITICAL) - 30 phút
2. **Soft delete inconsistency** (HIGH) - 1 giờ  
3. **Input handling** (MEDIUM) - 1.5 giờ

### Recommendation
✅ **Proceed with Fixes**: Thực hiện FIX-1 và FIX-2 ngay lập tức (1.5 giờ).  
✅ **Then Production Deploy**: Hệ thống sẽ production-ready.  
✅ **Phase 2 Roadmap**: Thêm unit tests, IoC Container, middleware pipeline.

### Next Steps
1. Execute FIX-1 (Email validation) - **TODAY**
2. Execute FIX-2 (Soft delete) - **TODAY**  
3. Run regression tests (Swagger UI) - **TODAY**
4. Code review by team - **Tomorrow**
5. Deploy to production - **This week**
6. Phase 2 planning (personalization, comments) - **Next week**
