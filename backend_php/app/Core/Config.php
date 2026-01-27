<?php

declare(strict_types=1);

namespace App\Core;

use Dotenv\Dotenv;

class Config
{
    private static bool $isLoaded = false;

    public static function load(string $path): void
    {
        if (self::$isLoaded) {
            return;
        }

        if (file_exists($path . '/.env')) {
            $dotenv = Dotenv::createImmutable($path);
            $dotenv->load();
        }

        self::$isLoaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return $_ENV[$key] ?? $default;
    }
}
