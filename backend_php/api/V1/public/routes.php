<?php

declare(strict_types=1);

use Lib\Router\Router;
use App\Controllers\StoryController;
use App\Controllers\ChapterController;
use App\Controllers\CategoryController;
use App\Controllers\AuthorController;
use App\Controllers\HealthController;
use App\Controllers\SwaggerController;

return function (Router $router) {
    // Swagger API Docs
    $router->get('/api/v1/swagger-doc', [SwaggerController::class, 'getJson']);

    // Health Check
    $router->get('/api/v1/health', [HealthController::class, 'index']);

    // --- PUBLIC CONTENT ---

    // Stories
    $router->get('/api/v1/public/stories', [StoryController::class, 'index']);
    $router->get('/api/v1/public/trending', [StoryController::class, 'trending']);
    $router->get('/api/v1/public/recommended', [StoryController::class, 'recommended']);
    $router->get('/api/v1/public/search', [StoryController::class, 'search']);
    $router->get('/api/v1/public/filters', [StoryController::class, 'filters']);
    $router->get('/api/v1/public/stories/slugs-all', [StoryController::class, 'getSlugs']);
    $router->get('/api/v1/public/stories/{id}', [StoryController::class, 'show']);
    $router->post('/api/v1/public/stories/{id}/click', [StoryController::class, 'click']);
    $router->get('/api/v1/public/stories/{id}/chapters', [StoryController::class, 'chapters']);

    // Chapters
    $router->get('/api/v1/public/chapters/{id}', [ChapterController::class, 'show']);
    $router->get('/api/v1/public/stories/{slug}/chapter/{number}', [ChapterController::class, 'getByStorySlugAndNumber']);

    // Categories
    $router->get('/api/v1/public/categories', [CategoryController::class, 'index']);
    $router->get('/api/v1/public/categories/{slug}', [CategoryController::class, 'show']);
    $router->get('/api/v1/public/categories/{slug}/stories', [CategoryController::class, 'stories']);

    // Authors
    $router->get('/api/v1/public/authors', [AuthorController::class, 'index']);
    $router->get('/api/v1/public/authors/{slug}', [AuthorController::class, 'show']);
    $router->get('/api/v1/public/authors/{slug}/stories', [AuthorController::class, 'stories']);
};
