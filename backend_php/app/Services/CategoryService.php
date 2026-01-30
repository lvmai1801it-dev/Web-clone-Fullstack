<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\DTOs\Response\PaginatedResponse;
use App\DTOs\CategoryDto;

class CategoryService
{
    private CategoryRepository $categoryRepo;

    public function __construct()
    {
        $this->categoryRepo = \Lib\Container\ServiceContainer::getInstance()->get('categoryRepository');
    }

    public function getCategories(array $filters = [], int $page = 1, int $perPage = 20): PaginatedResponse
    {
        // This will eventually call repo with filters and pagination
        // For now, mirroring existing functionality but with pagination structure
        $categories = $this->categoryRepo->getAll(); // Currently returns all

        $total = count($categories);
        $lastPage = (int) ceil($total / $perPage);
        $offset = ($page - 1) * $perPage;
        $items = array_slice($categories, $offset, $perPage);

        return new PaginatedResponse(
            items: $items,
            total: $total,
            page: $page,
            per_page: $perPage,
            last_page: $lastPage
        );
    }

    public function getCategoryBySlug(string $slug): ?CategoryDto
    {
        return $this->categoryRepo->findBySlug($slug);
    }

    /**
     * Create or Update a Category (Upsert)
     */
    public function saveCategory(array $data): ?CategoryDto
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id && $this->categoryRepo->findById($id)) {
            $this->categoryRepo->update($id, $data);
            return $this->categoryRepo->findById($id);
        } else {
            $newId = $this->categoryRepo->create($data);
            return $this->categoryRepo->findById($newId);
        }
    }
}
