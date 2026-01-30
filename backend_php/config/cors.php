<?php

declare(strict_types=1);

return [
    'allow_origins' => ['*'], // In production, replace '*' with specific domains
    'allow_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    'allow_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    'max_age' => 86400, // Cache preflight request for 1 day
];
