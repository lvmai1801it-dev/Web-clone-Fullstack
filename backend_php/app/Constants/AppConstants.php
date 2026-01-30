<?php

declare(strict_types=1);

namespace App\Constants;

class AppConstants
{
    // User Roles
    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER = 'user';

    // User Status
    public const STATUS_ACTIVE = 'active';
    public const STATUS_BANNED = 'banned';

    // Environments
    public const ENV_LOCAL = 'local';
    public const ENV_PRODUCTION = 'production';

    // Token Expiration
    public const TOKEN_EXPIRY_LONG = 315360000; // 10 years
}
