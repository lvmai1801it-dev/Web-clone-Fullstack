<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\BaseRepository;
use PDO;

class StoryRepository extends BaseRepository
{
    /**
     * Get Stories with Filters
     * @param array $filters ['page', 'limit', 'search', 'category_id', 'author_id', 'sort', 'order']
     * @return array ['data' => [], 'pagination' => ['total', 'page', 'limit']]
     */
    public function getStories(array $filters = []): array
    {
        $page = $filters['page'] ?? 1;
        $limit = $filters['limit'] ?? 20;
        $offset = ($page - 1) * $limit;

        $params = [];
        $whereClause = "WHERE s.deleted_at IS NULL";

        // Filter: Search (Title)
        if (!empty($filters['search'])) {
            $whereClause .= " AND s.title LIKE :search";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        // Filter: Category ID
        if (!empty($filters['category_id'])) {
            $whereClause .= " AND s.id IN (SELECT story_id FROM story_genres WHERE category_id = :category_id)";
            $params[':category_id'] = $filters['category_id'];
        }

        // Filter: Author ID
        if (!empty($filters['author_id'])) {
            $whereClause .= " AND s.author_id = :author_id";
            $params[':author_id'] = $filters['author_id'];
        }

        // Filter: Status
        if (!empty($filters['status'])) {
            $whereClause .= " AND s.status = :status";
            $params[':status'] = $filters['status'];
        }

        // Sort
        $sortField = 'updated_at';
        if (!empty($filters['sort']) && in_array($filters['sort'], ['created_at', 'updated_at', 'views'])) {
            $sortField = $filters['sort'];
        }
        $order = strtoupper($filters['order'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

        // 1. Get Total Count for Pagination
        $countSql = "SELECT COUNT(*) FROM stories s $whereClause";
        $countStmt = $this->db->prepare($countSql);
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        // 2. Get Data
        $sql = "SELECT s.*, 
                       a.name as author_name, a.slug as author_slug 
                FROM stories s
                LEFT JOIN authors a ON s.author_id = a.id
                $whereClause
                ORDER BY s.$sortField $order
                LIMIT $limit OFFSET $offset";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'data' => $this->attachCategories($stories),
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ];
    }

    public function findById(int $id): ?array
    {
        $sql = "SELECT s.*, 
                       a.name as author_name, a.slug as author_slug
                FROM stories s
                LEFT JOIN authors a ON s.author_id = a.id
                WHERE s.id = :id
                  AND s.deleted_at IS NULL
                LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $story = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$story)
            return null;

        return $this->attachCategories([$story])[0];
    }

    public function findBySlug(string $slug): ?array
    {
        $sql = "SELECT s.*, 
                       a.name as author_name, a.slug as author_slug
                FROM stories s
                LEFT JOIN authors a ON s.author_id = a.id
                WHERE s.slug = :slug
                  AND s.deleted_at IS NULL
                LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $story = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$story)
            return null;

        return $this->attachCategories([$story])[0];
    }

    private function attachCategories(array $stories): array
    {
        if (empty($stories))
            return [];

        $storyIds = array_column($stories, 'id');
        $placeholders = implode(',', array_fill(0, count($storyIds), '?'));

        $sql = "SELECT sg.story_id, c.id, c.name, c.slug 
                FROM categories c
                JOIN story_genres sg ON c.id = sg.category_id
                WHERE sg.story_id IN ($placeholders)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($storyIds);
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group categories by story_id
        $categoriesByStory = [];
        foreach ($categories as $cat) {
            $categoriesByStory[$cat['story_id']][] = [
                'id' => $cat['id'],
                'name' => $cat['name'],
                'slug' => $cat['slug']
            ];
        }

        // Merge back
        foreach ($stories as &$story) {
            $story['categories'] = $categoriesByStory[$story['id']] ?? [];
        }

        return $stories;
    }
}
