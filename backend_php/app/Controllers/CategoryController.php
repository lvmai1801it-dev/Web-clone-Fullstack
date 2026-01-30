<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Services\AuthorService;
use App\Services\CategoryService;
use App\Repositories\CategoryRepository;
use OpenApi\Annotations as OA;

class CategoryController extends BaseController
{
    private CategoryService $categoryService;

    public function __construct()
    {
        $this->categoryService = new CategoryService();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/categories",
     *     tags={"Categories"},
     *     summary="Get all categories with pagination",
     *     @OA\Parameter(name="q", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Paginated categories")
     * )
     */
    public function index()
    {
        $filters = ['q' => $_GET['q'] ?? ''];
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $perPage = isset($_GET['per_page']) ? (int) $_GET['per_page'] : 20;

        $result = $this->categoryService->getCategories($filters, $page, $perPage);
        $this->successResponse($result);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/categories/{slug}",
     *     tags={"Categories"},
     *     summary="Get category details",
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Category Detail")
     * )
     */
    public function show($slug)
    {
        $category = $this->categoryService->getCategoryBySlug($slug);
        if (!$category) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Category');
            return;
        }
        $this->successResponse($category);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/categories/{slug}/stories",
     *     tags={"Categories"},
     *     summary="Get stories in a category",
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of stories")
     * )
     */
    public function stories($slug)
    {
        $category = $this->categoryService->getCategoryBySlug($slug);
        if (!$category) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Category');
            return;
        }

        $repo = \Lib\Container\ServiceContainer::getInstance()->get('storyRepository');
        $stories = $repo->getStories(['category_id' => $category->id]);

        $this->successResponse($stories['data']);
    }
}
