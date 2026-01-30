<?php

declare(strict_types=1);

use Lib\Router\Router;
use App\Controllers\AuthController;

return function (Router $router) {
    // --- AUTHENTICATION ---
    $router->post('/api/v1/user/register', [AuthController::class, 'register']);
    $router->post('/api/v1/user/login', [AuthController::class, 'login']);
    $router->post('/api/v1/user/logout', [AuthController::class, 'logout']);

    // --- USER PROFILE ---
    $router->get('/api/v1/user/profile', [AuthController::class, 'profile']);
};
