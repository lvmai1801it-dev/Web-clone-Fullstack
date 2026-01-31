<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\BaseController;
use App\Services\AuthorService;
use App\DTOs\Request\AuthorCreateRequest;
use App\DTOs\Request\AuthorUpdateRequest;
use Lib\ErrorHandler\ErrorHandler;
use OpenApi\Annotations as OA;

class AuthorController extends BaseController
{
    private AuthorService $authorService;

    public function __construct()
    {
        $this->authorService = new AuthorService();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/authors",
     *     tags={"Admin Authors"},
     *     summary="List all authors (Admin)",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="q", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Paginated authors")
     * )
     */
    public function index()
    {
        $search = $_GET['q'] ?? '';
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $perPage = isset($_GET['per_page']) ? (int) $_GET['per_page'] : 20;

        $result = $this->authorService->getAuthors($search, $page, $perPage);
        $this->successResponse($result);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/authors",
     *     tags={"Admin Authors"},
     *     summary="Create or Update author (Supports Batch)",
     *     description="Save a single author or a list of authors (batch).",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             oneOf={
     *                 @OA\Schema(ref="#/components/schemas/AuthorCreateRequest"),
     *                 @OA\Schema(type="array", @OA\Items(ref="#/components/schemas/AuthorCreateRequest"))
     *             }
     *         )
     *     ),
     *     @OA\Response(response=201, description="Author created")
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
                    $results[] = $this->authorService->saveAuthor($item);
                }
                $this->successResponse($results, count($results) . ' authors processed');
            } else {
                $errors = AuthorCreateRequest::validate($data);
                if ($errors) {
                    $this->errorResponse('Validation failed', 422, $errors);
                    return;
                }
                $author = $this->authorService->saveAuthor($data);
                $this->successResponse($author, 'Author saved successfully', 201);
            }
        } catch (\Exception $e) {
            ErrorHandler::internalError($this, $e->getMessage());
        }
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/authors/{id}",
     *     tags={"Admin Authors"},
     *     summary="Get author by ID",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Author detail")
     * )
     */
    public function show($id)
    {
        $repo = \Lib\Container\ServiceContainer::getInstance()->get('authorRepository');
        $author = $repo->findById((int) $id);
        if (!$author) {
            ErrorHandler::notFound($this, 'Author');
            return;
        }
        $this->successResponse($author);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/authors/{id}",
     *     tags={"Admin Authors"},
     *     summary="Update author",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/AuthorUpdateRequest")),
     *     @OA\Response(response=200, description="Author updated")
     * )
     */
    public function update($id)
    {
        $data = $this->getJsonInput();
        $request = AuthorUpdateRequest::fromArray($data);

        $repo = \Lib\Container\ServiceContainer::getInstance()->get('authorRepository');
        $repo->update((int) $id, $request->toArray());

        $author = $repo->findById((int) $id);
        $this->successResponse($author, 'Author updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/authors/{id}",
     *     tags={"Admin Authors"},
     *     summary="Delete author",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Author deleted")
     * )
     */
    public function delete($id)
    {
        $repo = \Lib\Container\ServiceContainer::getInstance()->get('authorRepository');
        $repo->delete((int) $id);
        $this->successResponse(null, 'Author deleted successfully');
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/authors/batch",
     *     tags={"Admin Authors"},
     *     summary="Bulk create authors",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true, 
     *         @OA\JsonContent(
     *             type="array", 
     *             @OA\Items(ref="#/components/schemas/AuthorCreateRequest"),
     *             example={
     *                 {"name": "Ernest Hemingway", "slug": "ernest-hemingway"},
     *                 {"name": "Mark Twain", "slug": "mark-twain"}
     *             }
     *         )
     *     ),
     *     @OA\Response(response=200, description="Authors created")
     * )
     */
    public function bulkStore()
    {
        $data = $this->getJsonInput();
        if (!is_array($data)) {
            $this->errorResponse('Invalid input, expected array', 400);
            return;
        }

        $created = [];
        foreach ($data as $item) {
            $created[] = $this->authorService->saveAuthor($item);
        }

        $this->successResponse($created, count($created) . ' authors processed');
    }
}
