# 🔧 REFACTORING IMPLEMENTATION GUIDE

**Tài liệu này hướng dẫn cách refactor code từng phần để giảm code trùng lặp.**

---

## 1. ServiceContainer Pattern (2 hours)

### 1.1 Tạo Service Container Class

**File:** `lib/Container/ServiceContainer.php`

```php
<?php

declare(strict_types=1);

namespace Lib\Container;

use Lib\Database\DatabaseConnection;
use App\Repositories\UserRepository;
use App\Repositories\StoryRepository;
use App\Repositories\ChapterRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\AuthorRepository;
use App\Repositories\TagRepository;
use App\Services\AuthService;
use App\Services\StoryService;
use App\Services\ChapterService;
use Lib\Auth\JwtAuthenticator;
use Lib\Validator\RequestValidator;

class ServiceContainer
{
    private static ?self $instance = null;
    private array $services = [];

    private function __construct() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
            self::$instance->registerDefaults();
        }
        return self::$instance;
    }

    private function registerDefaults(): void
    {
        $db = DatabaseConnection::getInstance();

        // Database & Base Services
        $this->register('db', fn() => $db);
        $this->register('validator', fn() => new RequestValidator());
        $this->register('jwt', fn() => new JwtAuthenticator());

        // Repositories
        $this->register('userRepository', fn() => new UserRepository($db));
        $this->register('storyRepository', fn() => new StoryRepository($db));
        $this->register('chapterRepository', fn() => new ChapterRepository($db));
        $this->register('categoryRepository', fn() => new CategoryRepository($db));
        $this->register('authorRepository', fn() => new AuthorRepository($db));
        $this->register('tagRepository', fn() => new TagRepository($db));

        // Services
        $this->register('authService', fn() => new AuthService(
            $this->get('userRepository'),
            $this->get('jwt')
        ));
        $this->register('storyService', fn() => new StoryService(
            $this->get('storyRepository')
        ));
        $this->register('chapterService', fn() => new ChapterService(
            $this->get('chapterRepository'),
            $this->get('storyRepository')
        ));
    }

    public function register(string $key, callable $factory): void
    {
        $this->services[$key] = $factory;
    }

    public function get(string $key): mixed
    {
        if (!isset($this->services[$key])) {
            throw new \RuntimeException("Service '$key' not found in container");
        }
        return $this->services[$key]();
    }

    public function has(string $key): bool
    {
        return isset($this->services[$key]);
    }
}
```

### 1.2 Refactor Controllers (Before & After)

**BEFORE (6 Controllers, mỗi cái 15-20 dòng):**
```php
// app/Controllers/AuthController.php
public function __construct()
{
    $db = DatabaseConnection::getInstance();
    $repo = new UserRepository($db);
    $jwt = new JwtAuthenticator();
    $this->authService = new AuthService($repo, $jwt);
    $this->validator = new RequestValidator();
}
```

**AFTER:**
```php
// app/Controllers/AuthController.php
public function __construct(private \Lib\Container\ServiceContainer $container)
{
    // Dependencies auto-injected
}

// Usage in methods:
public function register()
{
    $authService = $this->container->get('authService');
    $validator = $this->container->get('validator');
    // ... rest of logic
}
```

**Or even better - Constructor Dependency Injection:**

```php
public function __construct(
    private AuthService $authService,
    private RequestValidator $validator
) {}
```

### 1.3 Update index.php to use Container

```php
<?php
// public/index.php

require_once __DIR__ . '/../vendor/autoload.php';

use Lib\Container\ServiceContainer;
use Lib\Router\Router;

// Initialize container (happens once)
$container = ServiceContainer::getInstance();

// Router dispatches to controllers
$router = new Router();
$router->dispatch();
```

---

## 2. Validation Helper Method (1.5 hours)

### 2.1 Update RequestValidator

**File:** `lib/Validator/RequestValidator.php` (add method)

```php
<?php
// Add to class RequestValidator:

/**
 * Validate and respond with error if validation fails
 * 
 * @param array $data Data to validate
 * @param array $rules Validation rules
 * @param \App\Core\BaseController $controller Controller instance for error response
 * @return bool True if validation passed, false otherwise (error response already sent)
 */
public function validateAndRespond(
    array $data,
    array $rules,
    \App\Core\BaseController $controller
): bool {
    $errors = $this->validate($data, $rules);
    
    if (!empty($errors)) {
        $controller->errorResponse('Dữ liệu không hợp lệ', 422, $errors);
        return false;
    }
    
    return true;
}

/**
 * Get clean data (sanitized)
 */
public function getCleanData(array $data, array $rules = []): array
{
    // Nếu có rules, chỉ giữ lại fields trong rules
    if (!empty($rules)) {
        $data = array_intersect_key($data, array_flip(array_keys($rules)));
    }
    
    return $this->sanitize($data);
}
```

### 2.2 Usage in Controllers (Refactored)

**BEFORE (mỗi endpoint 8-10 dòng validation):**
```php
public function register()
{
    $data = $this->getJsonBody();
    
    $rules = ['username' => [...], 'email' => [...], ...];
    $errors = $this->validator->validate($data, $rules);
    
    if (!empty($errors)) {
        $this->errorResponse('Validation Error', 400, $errors);
        return;
    }
    
    $cleanData = $this->validator->sanitize($data);
    // ... logic
}
```

**AFTER (1 line validation):**
```php
public function register()
{
    $data = $this->getJsonBody();
    $rules = ['username' => [...], 'email' => [...], ...];
    
    if (!$this->validator->validateAndRespond($data, $rules, $this)) return;
    
    $cleanData = $this->validator->getCleanData($data, $rules);
    // ... logic
}
```

---

## 3. Error Handler Utility (2 hours)

### 3.1 Create StandardErrorHandler

**File:** `lib/ErrorHandler/ErrorHandler.php`

```php
<?php

declare(strict_types=1);

namespace Lib\ErrorHandler;

use App\Core\BaseController;
use App\Exceptions\AppException;

class ErrorHandler
{
    // Standard error messages
    const MESSAGES = [
        'validation_failed' => 'Dữ liệu không hợp lệ',
        'not_found' => '{entity} không tìm thấy',
        'unauthorized' => 'Bạn không có quyền truy cập',
        'duplicate_entry' => 'Dữ liệu đã tồn tại',
        'invalid_credentials' => 'Email hoặc mật khẩu không chính xác',
        'account_banned' => 'Tài khoản đã bị khóa',
        'internal_error' => 'Lỗi hệ thống, vui lòng thử lại',
    ];

    // Status codes
    const STATUS = [
        'validation_failed' => 422,
        'not_found' => 404,
        'unauthorized' => 403,
        'duplicate_entry' => 409,
        'invalid_credentials' => 401,
        'account_banned' => 403,
        'internal_error' => 500,
    ];

    /**
     * Validation failed error
     */
    public static function validationFailed(
        array $errors,
        BaseController $controller
    ): void {
        $controller->errorResponse(
            self::MESSAGES['validation_failed'],
            self::STATUS['validation_failed'],
            $errors
        );
    }

    /**
     * Entity not found error
     */
    public static function notFound(
        string $entityName,
        BaseController $controller
    ): void {
        $message = str_replace('{entity}', $entityName, self::MESSAGES['not_found']);
        $controller->errorResponse($message, self::STATUS['not_found']);
    }

    /**
     * Unauthorized access error
     */
    public static function unauthorized(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['unauthorized'],
            self::STATUS['unauthorized']
        );
    }

    /**
     * Duplicate entry error
     */
    public static function duplicateEntry(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['duplicate_entry'],
            self::STATUS['duplicate_entry']
        );
    }

    /**
     * Invalid credentials error
     */
    public static function invalidCredentials(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['invalid_credentials'],
            self::STATUS['invalid_credentials']
        );
    }

    /**
     * Account banned error
     */
    public static function accountBanned(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['account_banned'],
            self::STATUS['account_banned']
        );
    }

    /**
     * Internal error
     */
    public static function internalError(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['internal_error'],
            self::STATUS['internal_error']
        );
    }

    /**
     * Handle PDOException and respond appropriately
     */
    public static function handleDatabaseError(
        \Exception $e,
        BaseController $controller
    ): void {
        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            self::duplicateEntry($controller);
        } else {
            self::internalError($controller);
        }
    }
}
```

### 3.2 Refactor Controllers to use ErrorHandler

**BEFORE (AuthController):**
```php
if ($this->userRepository->exists($data['email'])) {
    throw new ValidationException(['email' => 'Email already used']);
}
```

**AFTER:**
```php
if ($this->userRepository->exists($data['email'])) {
    ErrorHandler::duplicateEntry($this);
    return;
}
```

---

## 4. App Constants (1 hour)

### 4.1 Create Constants File

**File:** `app/Constants/AppConstants.php`

```php
<?php

declare(strict_types=1);

namespace App\Constants;

class AppConstants
{
    // User status
    const STATUS_ACTIVE = 'active';
    const STATUS_BANNED = 'banned';
    const STATUS_INACTIVE = 'inactive';

    // User roles
    const ROLE_ADMIN = 'admin';
    const ROLE_USER = 'user';
    const ROLE_MODERATOR = 'moderator';

    // Story status
    const STORY_STATUS_DRAFT = 'draft';
    const STORY_STATUS_PUBLISHED = 'published';
    const STORY_STATUS_ARCHIVED = 'archived';

    // Sort options
    const SORT_FIELDS = ['created_at', 'updated_at', 'views'];
    const SORT_ORDERS = ['ASC', 'DESC'];

    // Pagination
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 20;
    const MAX_LIMIT = 100;

    // Validation
    const MIN_USERNAME_LENGTH = 3;
    const MAX_USERNAME_LENGTH = 50;
    const MIN_PASSWORD_LENGTH = 6;
    const MIN_TITLE_LENGTH = 3;
    const MAX_TITLE_LENGTH = 255;

    // HTTP
    const STATUS_CODES = [
        'ok' => 200,
        'created' => 201,
        'bad_request' => 400,
        'unauthorized' => 401,
        'forbidden' => 403,
        'not_found' => 404,
        'conflict' => 409,
        'unprocessable' => 422,
        'internal_error' => 500,
    ];
}
```

### 4.2 Usage

**BEFORE:**
```php
// Scattered magic strings
if (($user['status'] ?? '') === 'banned') { }
if ($user['role'] === 'admin') { }
if ($filters['sort'] === 'created_at') { }
```

**AFTER:**
```php
use App\Constants\AppConstants;

if (($user['status'] ?? '') === AppConstants::STATUS_BANNED) { }
if ($user['role'] === AppConstants::ROLE_ADMIN) { }
if ($filters['sort'] === AppConstants::SORT_FIELDS[0]) { }
```

---

## 5. Cleanup Unused Imports (30 min)

### Files to check:
- `StoryController.php` - remove `use App\Middleware\AuthMiddleware`
- `ChapterController.php` - check for unused imports
- Others - review imports

```bash
# Tool to help find unused imports
composer require --dev rector/rector
./vendor/bin/rector process app/Controllers --set symfony-58 --dry-run
```

---

## 6. PSR-12 Auto-Fix (30 min)

```bash
# Install PHP-CS-Fixer
composer require --dev friendsofphp/php-cs-fixer

# Run fixer
./vendor/bin/php-cs-fixer fix app/ --rules=@PSR12

# Check style
./vendor/bin/phpcs --standard=PSR12 app/
```

---

## IMPLEMENTATION TIMELINE

| Phase | Tasks | Effort | Priority |
|-------|-------|--------|----------|
| **Week 1** | 1. ServiceContainer | 2h | P1 |
| | 2. Validation Helper | 1.5h | P1 |
| | 3. Error Handler | 2h | P1 |
| | 4. App Constants | 1h | P2 |
| **Week 2** | 5. Cleanup Imports | 0.5h | P3 |
| | 6. PSR-12 Fix | 0.5h | P3 |
| | 7. Add Logging | 2h | P1 |
| | 8. Add PHPDoc | 2h | P2 |

**Total:** 12 hours for complete refactoring

---

## VALIDATION AFTER REFACTORING

### Test Points:
1. ✅ All controllers still work (manual test each endpoint)
2. ✅ No PHP errors (check logs)
3. ✅ PSR-12 compliant (`phpcs --standard=PSR12`)
4. ✅ No unused imports (manual check)
5. ✅ Error messages consistent (test 404, 422, etc)

---

**Created:** 30/01/2026  
**Purpose:** Reduce duplicate code and improve maintainability
