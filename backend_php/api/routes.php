<?php

declare(strict_types=1);

use Lib\Router\Router;
use App\Core\BaseController;

use App\Controllers\HealthController;

use App\Controllers\StoryController;
use App\Controllers\SwaggerController;

return function (Router $router) {
    // Swagger API Docs
    $router->get('/api/v1/swagger-doc', [SwaggerController::class, 'getJson']);

    // Health Check
    $router->get('/api/v1/health', [HealthController::class, 'index']);

    // --- NHÓM API AUTHENTICATION (Xác thực) ---

    // Đăng ký thành viên
    // POST /api/v1/user/register
    $router->post('/api/v1/user/register', [App\Controllers\AuthController::class, 'register']);

    // Đăng nhập
    // POST /api/v1/user/login
    $router->post('/api/v1/user/login', [App\Controllers\AuthController::class, 'login']);

    // --- NHÓM API NGƯỜI DÙNG (Cần đăng nhập) ---
    // Để bảo vệ route này, ta cần chạy Middleware kiểm tra Token ở trong Controller hoặc wrap route (nếu router hỗ trợ middleware)
    // Ở đây ta gọi trực tiếp controller, middleware sẽ được gọi thủ công hoặc qua cơ chế khác.
    // Cách đơn giản nhất trong PHP thuần: Check middleware ngay đầu hàm Controller profile() hoặc dùng proxy.

    // Lấy thông tin profile
    // GET /api/v1/user/profile
    $router->get('/api/v1/user/profile', [App\Controllers\AuthController::class, 'profile']);
    // --- NHÓM API PUBLIC CONTENT (Truyện, Chương) ---

    // Lấy danh sách truyện (Tìm kiếm, lọc)
    // GET /api/v1/public/stories
    $router->get('/api/v1/public/stories', [StoryController::class, 'index']);

    // Lấy chi tiết truyện (theo ID hoặc Slug)
    // GET /api/v1/public/stories/{id}
    $router->get('/api/v1/public/stories/{id}', [StoryController::class, 'show']);

    // Lấy danh sách chương của truyện
    // GET /api/v1/public/stories/{id}/chapters
    $router->get('/api/v1/public/stories/{id}/chapters', [StoryController::class, 'chapters']);

    // --- METADATA (Tác giả, Thể loại) ---
    // GET /api/v1/public/categories
    $router->get('/api/v1/public/categories', [App\Controllers\CategoryController::class, 'index']);

    // GET /api/v1/public/authors
    $router->get('/api/v1/public/authors', [App\Controllers\AuthorController::class, 'index']);
};
