<?php

declare(strict_types=1);

namespace Api\V1\Middleware;

class RateLimitMiddleware
{
    private string $storageDir;
    private int $limit;
    private int $window;

    public function __construct(int $limit = 60, int $window = 60)
    {
        $this->limit = $limit; // Max requests
        $this->window = $window; // Time window in seconds
        $this->storageDir = __DIR__ . '/../../storage/rate_limit';

        if (!is_dir($this->storageDir)) {
            mkdir($this->storageDir, 0777, true);
        }
    }

    public function handle(): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $file = $this->storageDir . '/' . md5($ip) . '.json';

        $data = ['count' => 0, 'start_time' => time()];

        if (file_exists($file)) {
            $content = file_get_contents($file);
            if ($content) {
                $data = json_decode($content, true);
            }
        }

        $currentTime = time();

        // Reset window if time elapsed
        if ($currentTime - $data['start_time'] > $this->window) {
            $data['count'] = 1;
            $data['start_time'] = $currentTime;
        } else {
            $data['count']++;
        }

        // Save state
        file_put_contents($file, json_encode($data));

        // Set Headers
        header('X-RateLimit-Limit: ' . $this->limit);
        header('X-RateLimit-Remaining: ' . max(0, $this->limit - $data['count']));

        // Check limit
        if ($data['count'] > $this->limit) {
            http_response_code(429);
            echo json_encode([
                'success' => false,
                'message' => 'Too Many Requests. Please try again later.',
                'retry_after' => $this->window - ($currentTime - $data['start_time'])
            ]);
            exit;
        }
    }
}
