<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\BaseController;
use App\Services\AuthorService;
use App\Repositories\AuthorRepository;
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
     *     path="/api/v1/public/authors",
     *     tags={"Authors"},
     *     summary="Get all authors with pagination",
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
     * @OA\Get(
     *     path="/api/v1/public/authors/{slug}",
     *     tags={"Authors"},
     *     summary="Get author details",
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Author Detail")
     * )
     */
    public function show(string $slug)
    {
        $author = $this->authorService->getAuthorBySlug($slug);
        if (!$author) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Author');
            return;
        }
        $this->successResponse($author);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/public/authors/{slug}/stories",
     *     tags={"Authors"},
     *     summary="Get stories by author",
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of stories")
     * )
     */
    public function stories(string $slug)
    {
        $author = $this->authorService->getAuthorBySlug($slug);
        if (!$author) {
            \Lib\ErrorHandler\ErrorHandler::notFound($this, 'Author');
            return;
        }

        $repo = \Lib\Container\ServiceContainer::getInstance()->get('authorRepository');
        $stories = $repo->getStoriesByAuthor((int) $author->id, 20);

        $this->successResponse($stories);
    }


}
