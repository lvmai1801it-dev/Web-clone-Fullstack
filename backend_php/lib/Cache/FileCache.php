<?php

declare(strict_types=1);

namespace Lib\Cache;

class FileCache
{
    private string $cacheDir;
    private int $defaultTtl;

    public function __construct(string $cacheDir = null, int $defaultTtl = 3600)
    {
        $this->cacheDir = $cacheDir ?? dirname(__DIR__, 2) . '/storage/cache';
        $this->defaultTtl = $defaultTtl;

        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $filename = $this->getFilename($key);
        if (!file_exists($filename)) {
            return $default;
        }

        $content = file_get_contents($filename);
        $data = unserialize($content);

        // Check TTL
        if (time() > $data['expires_at']) {
            unlink($filename);
            return $default;
        }

        return $data['value'];
    }

    public function set(string $key, mixed $value, ?int $ttl = null): bool
    {
        $filename = $this->getFilename($key);
        $ttl = $ttl ?? $this->defaultTtl;

        $data = [
            'value' => $value,
            'expires_at' => time() + $ttl
        ];

        return (bool) file_put_contents($filename, serialize($data));
    }

    public function delete(string $key): bool
    {
        $filename = $this->getFilename($key);
        if (file_exists($filename)) {
            return unlink($filename);
        }
        return true;
    }

    public function flush(): bool
    {
        $files = glob($this->cacheDir . '/*.cache');
        foreach ($files as $file) {
            unlink($file);
        }
        return true;
    }

    private function getFilename(string $key): string
    {
        return $this->cacheDir . '/' . md5($key) . '.cache';
    }
}
