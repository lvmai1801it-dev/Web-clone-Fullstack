<?php

declare(strict_types=1);

use App\Core\Config;
use Lib\Router\Router;
use Lib\Logger\Logger;
use Api\V1\Middleware\CorsMiddleware;
use Api\V1\Middleware\SecurityHeadersMiddleware;
use Api\V1\Middleware\RateLimitMiddleware;
use App\Exceptions\AppException;

require __DIR__ . '/../vendor/autoload.php';

// Load Environment
Config::load(__DIR__ . '/../');

// Tắt hiển thị lỗi HTML ra màn hình để tránh làm hỏng cấu trúc JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Global Error Handler
set_exception_handler(function (Throwable $e) {
    $statusCode = 500;
    $response = [
        'success' => false,
        'message' => 'Internal Server Error',
        'timestamp' => time()
    ];

    if ($e instanceof AppException) {
        $statusCode = $e->getHttpStatusCode();
        $response['message'] = $e->getMessage();
        if (method_exists($e, 'getErrors')) {
            $response['errors'] = $e->getErrors();
        }
    } elseif ($e instanceof \PDOException && $e->getCode() == 23000) {
        // Xử lý lỗi trùng lặp dữ liệu (Duplicate Entry)
        $statusCode = 409; // Conflict
        $response['message'] = 'Dữ liệu đã tồn tại (Email, Username hoặc Slug đã được sử dụng)';
    } else {
        // Log unexpected errors
        $logger = \Lib\Container\ServiceContainer::getInstance()->get(\Lib\Logger\Logger::class);
        $logger->error($e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        // Chỉ hiện chi tiết lỗi nếu APP_DEBUG = true
        if (Config::get('APP_DEBUG') === 'true') {
            $response['message'] = $e->getMessage();
            $response['debug'] = [
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        } else {
            // Production: Ẩn lỗi
            $response['message'] = 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.';
        }
    }

    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
});

// Run CORS Middleware
// Run Security Headers
(new SecurityHeadersMiddleware())->handle();

// Run Rate Limiting
(new RateLimitMiddleware())->handle();

// Run CORS Middleware
CorsMiddleware::handle();

// Initialize Service Container
use Lib\Container\ServiceContainer;
$container = ServiceContainer::getInstance();

// Initialize Router
$router = new Router();
$routes = require __DIR__ . '/../Api/routes.php';
$routes($router);

// Dispatch Request
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Xử lý Subdirectory (nếu app chạy trong thư mục con như /backend_php/public)
$scriptName = $_SERVER['SCRIPT_NAME']; // /backend_php/public/index.php
$scriptDir = dirname($scriptName);     // /backend_php/public

// Normalize slashes to forward slashes (fix for Windows)
$scriptDir = str_replace('\\', '/', $scriptDir);

// Nếu URI bắt đầu bằng scriptDir, ta cắt bỏ phần đó đi để lấy path chuẩn
if ($scriptDir !== '/' && strpos($uri, $scriptDir) === 0) {
    $uri = substr($uri, strlen($scriptDir));
}

// Ensure URI starts with /
if (empty($uri) || $uri[0] !== '/') {
    $uri = '/' . $uri;
}

// [DEBUGGING] Log request info
error_log("Incoming Request: Method=$method, URI=$uri, ScriptDir=$scriptDir");

// Đảm bảo URI luôn bắt đầu bằng /
if (empty($uri) || $uri[0] !== '/') {
    $uri = '/' . $uri;
}

$router->dispatch($method, $uri);
