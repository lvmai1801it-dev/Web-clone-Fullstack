<?php

declare(strict_types=1);

namespace Lib\Logger;

use App\Core\Config;

class Logger
{
    public static function info(string $message, array $context = []): void
    {
        self::log('INFO', $message, $context);
    }

    public static function error(string $message, array $context = []): void
    {
        self::log('ERROR', $message, $context);
    }

    public static function debug(string $message, array $context = []): void
    {
        if (Config::get('APP_DEBUG') === 'true') {
            self::log('DEBUG', $message, $context);
        }
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

        $date = date('Y-m-d');
        $logFile = __DIR__ . '/../../storage/logs/app-' . $date . '.log';

        // Ensure directory exists
        if (!is_dir(dirname($logFile))) {
            mkdir(dirname($logFile), 0777, true);
        }

        file_put_contents(
            $logFile,
            json_encode($logEntry, JSON_UNESCAPED_UNICODE) . PHP_EOL,
            FILE_APPEND
        );
    }
}
