<?php

declare(strict_types=1);

use Lib\Router\Router;
use App\Controllers\Admin\StoryController as AdminStoryController;
use App\Controllers\Admin\ChapterController as AdminChapterController;
use App\Controllers\Admin\AuthorController as AdminAuthorController;
use App\Controllers\Admin\CategoryController as AdminCategoryController;

return function (Router $router) {
    // --- CATEGORY MANAGEMENT ---
    $router->get('/api/v1/admin/categories', [AdminCategoryController::class, 'index']);
    $router->post('/api/v1/admin/categories', [AdminCategoryController::class, 'store']);
    $router->get('/api/v1/admin/categories/{id}', [AdminCategoryController::class, 'show']);
    $router->put('/api/v1/admin/categories/{id}', [AdminCategoryController::class, 'update']);
    $router->delete('/api/v1/admin/categories/{id}', [AdminCategoryController::class, 'delete']);
    $router->post('/api/v1/admin/categories/batch', [AdminCategoryController::class, 'bulkStore']);

    // --- AUTHOR MANAGEMENT ---
    $router->get('/api/v1/admin/authors', [AdminAuthorController::class, 'index']);
    $router->post('/api/v1/admin/authors', [AdminAuthorController::class, 'store']);
    $router->get('/api/v1/admin/authors/{id}', [AdminAuthorController::class, 'show']);
    $router->put('/api/v1/admin/authors/{id}', [AdminAuthorController::class, 'update']);
    $router->delete('/api/v1/admin/authors/{id}', [AdminAuthorController::class, 'delete']);
    $router->post('/api/v1/admin/authors/batch', [AdminAuthorController::class, 'bulkStore']);

    // --- STORY MANAGEMENT ---
    $router->post('/api/v1/admin/stories/save', [AdminStoryController::class, 'save']);
    $router->delete('/api/v1/admin/stories/{id}', [AdminStoryController::class, 'delete']);

    // --- CHAPTER MANAGEMENT ---
    $router->post('/api/v1/admin/chapters/save', [AdminChapterController::class, 'save']);
    $router->delete('/api/v1/admin/chapters/{id}', [AdminChapterController::class, 'delete']);
};
