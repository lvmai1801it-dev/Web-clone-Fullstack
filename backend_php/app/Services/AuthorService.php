<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\AuthorRepository;
use App\DTOs\Response\PaginatedResponse;
use App\DTOs\AuthorDto;

class AuthorService
{
    private AuthorRepository $authorRepo;

    public function __construct()
    {
        $this->authorRepo = \Lib\Container\ServiceContainer::getInstance()->get('authorRepository');
    }

    public function getAuthors(string $search = '', int $page = 1, int $perPage = 20): PaginatedResponse
    {
        // For now using existing repo method but wrapping in pagination
        $authors = $this->authorRepo->getAuthors($search, 1000);

        $total = count($authors);
        $lastPage = (int) ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $items = array_slice($authors, $offset, $perPage);

        return new PaginatedResponse(
            items: $items,
            total: $total,
            page: $page,
            per_page: $perPage,
            last_page: $lastPage
        );
    }

    public function getAuthorBySlug(string $slug): ?AuthorDto
    {
        return $this->authorRepo->findBySlug($slug);
    }

    /**
     * Create or Update an Author (Upsert)
     */
    public function saveAuthor(array $data): ?AuthorDto
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id && $this->authorRepo->findById($id)) {
            $this->authorRepo->update($id, $data);
            return $this->authorRepo->findById($id);
        } else {
            $newId = $this->authorRepo->create($data);
            return $this->authorRepo->findById($newId);
        }
    }
}
