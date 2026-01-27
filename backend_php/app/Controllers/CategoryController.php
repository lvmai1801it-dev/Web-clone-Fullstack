<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Repositories\CategoryRepository;
use Lib\Database\DatabaseConnection;
use OpenApi\Annotations as OA;

class CategoryController extends BaseController
{
    private CategoryRepository $categoryRepo;

    public function __construct()
    {
        $db = DatabaseConnection::getInstance();
        $this->categoryRepo = new CategoryRepository($db);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/categories",
     *     tags={"Metadata"},
     *     summary="Get all categories",
     *     @OA\Response(
     *         response=200,
     *         description="List of categories",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="slug", type="string")
     *             ))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $categories = $this->categoryRepo->getAll();
        $this->successResponse($categories);
    }
}
