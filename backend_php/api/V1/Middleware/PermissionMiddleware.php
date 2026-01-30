<?php

declare(strict_types=1);

namespace Api\V1\Middleware;

use Lib\Auth\JwtAuthenticator;
use App\Lib\ErrorHandler\HttpException;

class PermissionMiddleware
{
    private array $permissions = [
        'category.create' => ['admin', 'editor'],
        'category.update' => ['admin', 'editor'],
        'category.delete' => ['admin'],
        'author.create' => ['admin', 'editor'],
        'author.update' => ['admin', 'editor'],
        'author.delete' => ['admin'],
        'bulk.operations' => ['admin']
    ];

    public function handle(array $params = []): void
    {
        // JWT Auth handles setting the user in the context or request
        // For this project, we might need to get the user from the JwtAuthenticator result
        // Assuming the user role is available in the JWT payload or session

        // This is a placeholder for actual permission logic
        // In a real implementation, we'd check $user->role against $this->permissions[$required]
    }

    public function check(string $requiredPermission, string $userRole): bool
    {
        if (!isset($this->permissions[$requiredPermission])) {
            return false;
        }

        return in_array($userRole, $this->permissions[$requiredPermission]);
    }
}
