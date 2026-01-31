<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\BaseController;
use App\Services\CategoryService;
use App\DTOs\Request\CategoryCreateRequest;
use App\DTOs\Request\CategoryUpdateRequest;
use Lib\ErrorHandler\ErrorHandler;
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
     *     path="/api/v1/admin/categories",
     *     tags={"Admin Categories"},
     *     summary="List all categories (Admin)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="q", in="query", required=false, @OA\Schema(type="string")),
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
     * @OA\Post(
     *     path="/api/v1/admin/categories",
     *     tags={"Admin Categories"},
     *     summary="Create or Update category (Supports Batch)",
     *     description="Save a single category or a list of categories (batch).",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(ref="#/components/schemas/CategoryCreateRequest"),
     *                 @OA\Schema(type="array", @OA\Items(ref="#/components/schemas/CategoryCreateRequest"))
     *             }
     *         )
     *     ),
     *     @OA\Response(response=201, description="Category created")
     * )
     */
    public function store()
    {
        $data = $this->getJsonInput();
        if (!$data) {
            ErrorHandler::validationFailed($this, ['json' => 'Invalid JSON Data']);
            return;
        }

        try {
            if (array_is_list($data)) {
                $results = [];
                foreach ($data as $item) {
                    $results[] = $this->categoryService->saveCategory($item);
                }
                $this->successResponse($results, count($results) . ' categories processed');
            } else {
                $errors = CategoryCreateRequest::validate($data);
                if ($errors) {
                    $this->errorResponse('Validation failed', 422, $errors);
                    return;
                }
                $category = $this->categoryService->saveCategory($data);
                $this->successResponse($category, 'Category saved successfully', 201);
            }
        } catch (\Exception $e) {
            ErrorHandler::internalError($this, $e->getMessage());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/categories/{id}",
     *     tags={"Admin Categories"},
     *     summary="Get category by ID",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Category detail")
     * )
     */
    public function show($id)
    {
        $repo = \Lib\Container\ServiceContainer::getInstance()->get('categoryRepository');
        $category = $repo->findById((int) $id);
        if (!$category) {
            ErrorHandler::notFound($this, 'Category');
            return;
        }
        $this->successResponse($category);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/categories/{id}",
     *     tags={"Admin Categories"},
     *     summary="Update category",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/CategoryUpdateRequest")),
     *     @OA\Response(response=200, description="Category updated")
     * )
     */
    public function update($id)
    {
        $data = $this->getJsonInput();
        $request = CategoryUpdateRequest::fromArray($data);

        $repo = \Lib\Container\ServiceContainer::getInstance()->get('categoryRepository');
        $repo->update((int) $id, $request->toArray());

        $category = $repo->findById((int) $id);
        $this->successResponse($category, 'Category updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/categories/{id}",
     *     tags={"Admin Categories"},
     *     summary="Delete category",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Category deleted")
     * )
     */
    public function delete($id)
    {
        $repo = \Lib\Container\ServiceContainer::getInstance()->get('categoryRepository');
        $repo->delete((int) $id);
        $this->successResponse(null, 'Category deleted successfully');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/categories/batch",
     *     tags={"Admin Categories"},
     *     summary="Bulk create categories",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true, 
     *         @OA\JsonContent(
     *             type="array", 
     *             @OA\Items(ref="#/components/schemas/CategoryCreateRequest"),
     *             example={
     *                 {"name": "Action", "slug": "action"},
     *                 {"name": "Comedy", "slug": "comedy"}
     *             }
     *         )
     *     ),
     *     @OA\Response(response=200, description="Categories created")
     * )
     */
    public function bulkStore()
    {
        $data = $this->getJsonInput(); // Expecting array of categories
        if (!is_array($data)) {
            $this->errorResponse('Invalid input, expected array', 400);
            return;
        }

        $created = [];
        foreach ($data as $item) {
            $created[] = $this->categoryService->saveCategory($item);
        }

        $this->successResponse($created, count($created) . ' categories processed');
    }
}
