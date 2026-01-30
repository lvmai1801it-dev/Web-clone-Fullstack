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
    public function getAllSlugs(): array
    {
        $sql = "SELECT slug FROM stories ORDER BY updated_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        // Fetch FETCH_COLUMN to get a simple array of strings
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     * Get Stories with Filters
     * @param array $filters
     * @return array
     */
    /**
     * Get Stories with Filters
     * @param array $filters
     * @return array
     */
    public function getStories(array $filters = []): array
    {
        $page = $filters['page'] ?? 1;
        $limit = $filters['limit'] ?? 20;
        $offset = ($page - 1) * $limit;

        $params = [];
        $whereClause = "WHERE 1=1";

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

        $enrichedStories = $this->attachCategories($stories);

        $dtos = array_map(fn($story) => \App\DTOs\StoryDto::fromArray($story), $enrichedStories);

        return [
            'data' => $dtos,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ];
    }

    public function findById(int $id): ?\App\DTOs\StoryDto
    {
        $sql = "SELECT s.*, 
                       a.name as author_name, a.slug as author_slug
                FROM stories s
                LEFT JOIN authors a ON s.author_id = a.id
                WHERE s.id = :id
                LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $story = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$story)
            return null;

        $enriched = $this->attachCategories([$story])[0];
        return \App\DTOs\StoryDto::fromArray($enriched);
    }

    public function findBySlug(string $slug): ?\App\DTOs\StoryDto
    {
        $sql = "SELECT s.*, 
                       a.name as author_name, a.slug as author_slug
                FROM stories s
                LEFT JOIN authors a ON s.author_id = a.id
                WHERE s.slug = :slug
                LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $story = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$story)
            return null;

        $enriched = $this->attachCategories([$story])[0];
        return \App\DTOs\StoryDto::fromArray($enriched);
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
            $categoriesByStory[$cat['story_id']][] = \App\DTOs\CategoryDto::fromArray($cat);
        }

        // Merge back
        foreach ($stories as &$story) {
            $story['categories'] = $categoriesByStory[$story['id']] ?? [];
        }

        return $stories;
    }
    public function exists(int $id): bool
    {
        $sql = "SELECT COUNT(*) FROM stories WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function create(array $data): int
    {
        $fields = [
            'title',
            'slug',
            'cover_url',
            'narrator',
            'description',
            'status',
            'total_chapters',
            'views',
            'rating_avg',
            'rating_count',
            'created_at',
            'updated_at',
            'author_id'
        ];

        $params = [];
        $columns = [];
        $values = [];

        // Handle explicit ID
        if (isset($data['id'])) {
            $columns[] = 'id';
            $values[] = ':id';
            $params[':id'] = $data['id'];
        }

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $columns[] = $field;
                $values[] = ":$field";
                $params[":$field"] = $data[$field];
            }
        }

        // Defaults
        if (!isset($params[':status'])) {
            $columns[] = 'status';
            $values[] = "'ongoing'";
        }

        $sql = "INSERT INTO stories (" . implode(', ', $columns) . ") 
                VALUES (" . implode(', ', $values) . ")";

        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            $id = isset($data['id']) ? (int) $data['id'] : (int) $this->db->lastInsertId();

            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                $this->syncCategories($id, $data['category_ids']);
            }

            $this->db->commit();
            return $id;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function update(int $id, array $data): bool
    {
        $fields = [
            'title',
            'slug',
            'cover_url',
            'narrator',
            'description',
            'status',
            'total_chapters',
            'views',
            'rating_avg',
            'rating_count',
            'created_at',
            'updated_at',
            'author_id'
        ];

        $sets = [];
        $params = [':id' => $id];

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $sets[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        // Always update updated_at
        $sets[] = "updated_at = NOW()";

        if (empty($sets)) {
            // Nothing to update, but check categories
            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                $this->syncCategories($id, $data['category_ids']);
                return true;
            }
            return false;
        }

        $sql = "UPDATE stories SET " . implode(', ', $sets) . " WHERE id = :id";

        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute($params);

            if (isset($data['category_ids']) && is_array($data['category_ids'])) {
                $this->syncCategories($id, $data['category_ids']);
            }

            $this->db->commit();
            return $result;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        $this->db->beginTransaction();
        try {
            // 1. Delete Story Genres (FK ON DELETE RESTRICT)
            $sqlGenres = "DELETE FROM story_genres WHERE story_id = :id";
            $stmtGenres = $this->db->prepare($sqlGenres);
            $stmtGenres->execute([':id' => $id]);

            // 2. Delete Chapters (Manual cleanup for safety)
            $sqlChapters = "DELETE FROM chapters WHERE story_id = :id";
            $stmtChapters = $this->db->prepare($sqlChapters);
            $stmtChapters->execute([':id' => $id]);

            // 3. Delete Story
            $sql = "DELETE FROM stories WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    private function syncCategories(int $storyId, array $categoryIds): void
    {
        // Remove old
        $delSql = "DELETE FROM story_genres WHERE story_id = :story_id";
        $delStmt = $this->db->prepare($delSql);
        $delStmt->execute([':story_id' => $storyId]);

        if (empty($categoryIds))
            return;

        // [FIX] Filter only existing category IDs to prevent FK error
        $placeholders = implode(',', array_fill(0, count($categoryIds), '?'));
        $checkSql = "SELECT id FROM categories WHERE id IN ($placeholders)";
        $checkStmt = $this->db->prepare($checkSql);
        $checkStmt->execute($categoryIds);
        $validIds = $checkStmt->fetchAll(PDO::FETCH_COLUMN);

        if (empty($validIds))
            return;

        // Add new
        $values = [];
        $params = [];
        foreach ($validIds as $index => $catId) {
            $values[] = "(:story_id_$index, :cat_id_$index)";
            $params[":story_id_$index"] = $storyId;
            $params[":cat_id_$index"] = $catId;
        }

        $insSql = "INSERT INTO story_genres (story_id, category_id) VALUES " . implode(', ', $values);
        $insStmt = $this->db->prepare($insSql);
        $insStmt->execute($params);
    }
}
