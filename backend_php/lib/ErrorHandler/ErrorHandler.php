<?php

declare(strict_types=1);

namespace Lib\ErrorHandler;

use App\Core\BaseController;

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
        'conflict' => 'Xung đột dữ liệu',
    ];

    // Status codes
    const STATUS = [
        'validation_failed' => 400, // Or 422
        'not_found' => 404,
        'unauthorized' => 403,
        'unauthenticated' => 401,
        'duplicate_entry' => 409,
        'invalid_credentials' => 401,
        'account_banned' => 403,
        'internal_error' => 500,
        'conflict' => 409,
    ];

    /**
     * Validation failed error (400)
     */
    public static function validationFailed(
        BaseController $controller,
        array $errors = []
    ): void {
        $controller->errorResponse(
            self::MESSAGES['validation_failed'],
            self::STATUS['validation_failed'],
            $errors
        );
    }

    /**
     * Entity not found error (404)
     */
    public static function notFound(
        BaseController $controller,
        string $entityName = 'Dữ liệu'
    ): void {
        $message = str_replace('{entity}', $entityName, self::MESSAGES['not_found']);
        $controller->errorResponse($message, self::STATUS['not_found']);
    }

    /**
     * Unauthorized access error (403 or 401)
     */
    public static function unauthorized(
        BaseController $controller,
        string $message = null
    ): void {
        $controller->errorResponse(
            $message ?? self::MESSAGES['unauthorized'],
            self::STATUS['unauthorized']
        );
    }

    /**
     * Duplicate entry error (409)
     */
    public static function duplicateEntry(
        BaseController $controller,
        string $message = null
    ): void {
        $controller->errorResponse(
            $message ?? self::MESSAGES['duplicate_entry'],
            self::STATUS['duplicate_entry']
        );
    }

    /**
     * Invalid credentials error (401)
     */
    public static function invalidCredentials(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['invalid_credentials'],
            self::STATUS['invalid_credentials']
        );
    }

    /**
     * Account banned error (403)
     */
    public static function accountBanned(BaseController $controller): void
    {
        $controller->errorResponse(
            self::MESSAGES['account_banned'],
            self::STATUS['account_banned']
        );
    }

    /**
     * Internal error (500)
     */
    public static function internalError(
        BaseController $controller,
        string $message = null
    ): void {
        // Log the error if it hasn't been logged yet (optional, but good for custom 500s)
        // Since we don't have the exception object here, we just log the message.
        if ($message) {
            try {
                $logger = \Lib\Container\ServiceContainer::getInstance()->get(\Lib\Logger\Logger::class);
                $logger->error($message, ['trace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)]);
            } catch (\Exception $e) {
                // Ignore logger errors to avoid infinite loops
            }
        }

        $controller->errorResponse(
            $message ?? self::MESSAGES['internal_error'],
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
        // Log error
        try {
            $logger = \Lib\Container\ServiceContainer::getInstance()->get(\Lib\Logger\Logger::class);
            $logger->error($e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        } catch (\Exception $ex) {
            // Ignore logger errors
        }

        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
            self::duplicateEntry($controller);
        } else {
            // Don't expose internal DB errors to user in production
            self::internalError($controller, 'Lỗi cơ sở dữ liệu');
        }
    }
}
