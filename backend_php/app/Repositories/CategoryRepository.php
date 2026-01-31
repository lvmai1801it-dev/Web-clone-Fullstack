<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\BaseRepository;
use PDO;

class CategoryRepository extends BaseRepository
{
    /**
     * Get all categories
     * @return array
     */
    /**
     * Get all categories
     * @return \App\DTOs\CategoryDto[]
     */
    public function getAll(): array
    {
        $sql = "SELECT c.id, c.name, c.slug, COUNT(sg.story_id) as story_count 
                FROM categories c
                LEFT JOIN story_genres sg ON c.id = sg.category_id
                GROUP BY c.id
                ORDER BY c.name ASC";
        $stmt = $this->db->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => \App\DTOs\CategoryDto::fromArray($row), $rows);
    }

    public function findBySlug(string $slug): ?\App\DTOs\CategoryDto
    {
        $sql = "SELECT c.id, c.name, c.slug, COUNT(sg.story_id) as story_count 
                FROM categories c
                LEFT JOIN story_genres sg ON c.id = sg.category_id
                WHERE c.slug = :slug
                GROUP BY c.id
                LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? \App\DTOs\CategoryDto::fromArray($result) : null;
    }

    public function findById(int $id): ?\App\DTOs\CategoryDto
    {
        $sql = "SELECT c.id, c.name, c.slug, COUNT(sg.story_id) as story_count 
                FROM categories c
                LEFT JOIN story_genres sg ON c.id = sg.category_id
                WHERE c.id = :id
                GROUP BY c.id
                LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? \App\DTOs\CategoryDto::fromArray($result) : null;
    }

    public function create(array $data): int
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id) {
            $sql = "INSERT INTO categories (id, name, slug) VALUES (:id, :name, :slug)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':name' => $data['name'],
                ':slug' => $data['slug']
            ]);
            return $id;
        }

        $sql = "INSERT INTO categories (name, slug) VALUES (:name, :slug)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':slug' => $data['slug']
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];
        foreach ($data as $key => $value) {
            if ($key === 'id')
                continue;
            $fields[] = "$key = :$key";
            $params[":$key"] = $value;
        }
        $sql = "UPDATE categories SET " . implode(', ', $fields) . " WHERE id = :id";
        return $this->db->prepare($sql)->execute($params);
    }

    public function delete(int $id): bool
    {
        $sql = "DELETE FROM categories WHERE id = :id";
        return $this->db->prepare($sql)->execute([':id' => $id]);
    }

    public function advancedSearch(array $filters, int $page = 1, int $perPage = 20): array
    {
        $where = [];
        $params = [];

        if (!empty($filters['q'])) {
            $where[] = "(name LIKE :q)";
            $params[':q'] = "%{$filters['q']}%";
        }

        $sql = "SELECT c.*, COUNT(sg.story_id) as story_count 
                FROM categories c
                LEFT JOIN story_genres sg ON c.id = sg.category_id";

        if ($where) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }

        $sql .= " GROUP BY c.id ORDER BY c.name ASC";

        // Pagination
        $offset = ($page - 1) * $perPage;
        $sql .= " LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count
        $countSql = "SELECT COUNT(*) FROM categories c";
        if ($where) {
            $countSql .= " WHERE " . implode(' AND ', $where);
        }
        $total = (int) $this->db->prepare($countSql)->execute($params) ? $this->db->prepare($countSql)->fetchColumn() : 0;
        // Actually fetchColumn is easier
        $stmtCount = $this->db->prepare($countSql);
        $stmtCount->execute($params);
        $total = (int) $stmtCount->fetchColumn();

        return [
            'items' => new \App\DTOs\DtoCollection(\App\DTOs\CategoryDto::class, $rows),
            'total' => $total
        ];
    }
}
