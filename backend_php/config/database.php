<?php

declare(strict_types=1);

use App\Core\Config;

return [
    'driver' => Config::get('DB_CONNECTION', 'mysql'),
    'host' => Config::get('DB_HOST', '127.0.0.1'),
    'port' => Config::get('DB_PORT', '3306'),
    'database' => Config::get('DB_DATABASE', 'u069677353_audiotruyen'),
    'username' => Config::get('DB_USERNAME', 'root'),
    'password' => Config::get('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
];
