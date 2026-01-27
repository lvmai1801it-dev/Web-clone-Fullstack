<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Repositories\AuthorRepository;
use Lib\Database\DatabaseConnection;
use OpenApi\Annotations as OA;

class AuthorController extends BaseController
{
    private AuthorRepository $authorRepo;

    public function __construct()
    {
        $db = DatabaseConnection::getInstance();
        $this->authorRepo = new AuthorRepository($db);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/authors",
     *     tags={"Metadata"},
     *     summary="Get authors list",
     *     @OA\Parameter(name="q", in="query", description="Search by name", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="limit", in="query", description="Limit results", required=false, @OA\Schema(type="integer", default=50)),
     *     @OA\Response(
     *         response=200,
     *         description="List of authors",
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
        $search = $_GET['q'] ?? '';
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;

        $authors = $this->authorRepo->getAuthors($search, $limit);
        $this->successResponse($authors);
    }
}
