<?php

declare(strict_types=1);

namespace Lib\Logger;

use App\Core\Config;

class Logger
{
    private string $logPath;

    public function __construct(string $logPath = null)
    {
        // Default to project_root/storage/logs/app-YYYY-MM-DD.log
        if ($logPath === null) {
            $date = date('Y-m-d');
            $this->logPath = dirname(__DIR__, 2) . "/storage/logs/app-{$date}.log";
        } else {
            $this->logPath = $logPath;
        }

        $this->ensureDirectoryExists();
    }

    private function ensureDirectoryExists(): void
    {
        $dir = dirname($this->logPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true); // Changed to 0755 for security
        }
    }

    public function info(string $message, array $context = []): void
    {
        $this->log('INFO', $message, $context);
    }

    public function error(string $message, array $context = []): void
    {
        $this->log('ERROR', $message, $context);
    }

    public function warning(string $message, array $context = []): void
    {
        $this->log('WARNING', $message, $context);
    }

    public function debug(string $message, array $context = []): void
    {
        if (Config::get('APP_DEBUG') === 'true') {
            $this->log('DEBUG', $message, $context);
        }
    }

    public function log(string $level, string $message, array $context = []): void
    {
        $timestamp = date('c');
        $requestId = $_SERVER['REQUEST_ID'] ?? uniqid();
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $method = $_SERVER['REQUEST_METHOD'] ?? '';

        $logEntry = [
            'timestamp' => $timestamp,
            'level' => $level,
            'message' => $message,
            'context' => $context,
            'request_id' => $requestId,
            'uri' => $uri,
            'method' => $method
        ];

        file_put_contents(
            $this->logPath,
            json_encode($logEntry, JSON_UNESCAPED_UNICODE) . PHP_EOL,
            FILE_APPEND
        );
    }
}
