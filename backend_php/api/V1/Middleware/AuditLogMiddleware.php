<?php

declare(strict_types=1);

namespace Api\V1\Middleware;

use Lib\Logger\Logger;

class AuditLogMiddleware
{
    private Logger $logger;

    public function __construct()
    {
        $this->logger = new Logger();
    }

    public function handle(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];

        // Only log state-changing requests for admin
        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            $this->logger->info("Admin Action: $method $uri", [
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
                // Add user ID here if available in context
            ]);
        }
    }
}
