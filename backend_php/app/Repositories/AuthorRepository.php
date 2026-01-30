<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\BaseRepository;
use PDO;

class AuthorRepository extends BaseRepository
{
    /**
     * Get authors with simple search and pagination
     * @param string $search
     * @param int $limit
     * @return array
     */
    /**
     * Get authors with simple search and pagination
     * @param string $search
     * @param int $limit
     * @return \App\DTOs\AuthorDto[]
     */
    public function getAuthors(string $search = '', int $limit = 50): array
    {
        $sql = "SELECT id, name, slug FROM authors WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $sql .= " AND name LIKE :search";
            $params[':search'] = '%' . $search . '%';
        }

        $sql .= " ORDER BY name ASC LIMIT " . (int) $limit;

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => \App\DTOs\AuthorDto::fromArray($row), $rows);
    }

    public function findBySlug(string $slug): ?\App\DTOs\AuthorDto
    {
        $sql = "SELECT id, name, slug FROM authors WHERE slug = :slug LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $author = $stmt->fetch(PDO::FETCH_ASSOC);
        return $author ? \App\DTOs\AuthorDto::fromArray($author) : null;
    }

    public function findById(int $id): ?\App\DTOs\AuthorDto
    {
        $sql = "SELECT id, name, slug FROM authors WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $author = $stmt->fetch(PDO::FETCH_ASSOC);
        return $author ? \App\DTOs\AuthorDto::fromArray($author) : null;
    }

    public function create(array $data): int
    {
        $id = isset($data['id']) ? (int) $data['id'] : null;

        if ($id) {
            $sql = "INSERT INTO authors (id, name, slug) VALUES (:id, :name, :slug)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':name' => $data['name'],
                ':slug' => $data['slug']
            ]);
            return $id;
        }

        $sql = "INSERT INTO authors (name, slug) VALUES (:name, :slug)";
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
        $sql = "UPDATE authors SET " . implode(', ', $fields) . " WHERE id = :id";
        return $this->db->prepare($sql)->execute($params);
    }

    public function delete(int $id): bool
    {
        $sql = "DELETE FROM authors WHERE id = :id";
        return $this->db->prepare($sql)->execute([':id' => $id]);
    }

    public function advancedSearch(array $filters, int $page = 1, int $perPage = 20): array
    {
        $where = ["1=1"];
        $params = [];

        if (!empty($filters['q'])) {
            $where[] = "(name LIKE :q)";
            $params[':q'] = "%{$filters['q']}%";
        }

        $sql = "SELECT * FROM authors WHERE " . implode(' AND ', $where) . " ORDER BY name ASC";

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

        $countSql = "SELECT COUNT(*) FROM authors WHERE " . implode(' AND ', $where);
        $stmtCount = $this->db->prepare($countSql);
        $stmtCount->execute($params);
        $total = (int) $stmtCount->fetchColumn();

        return [
            'items' => new \App\DTOs\DtoCollection(\App\DTOs\AuthorDto::class, $rows),
            'total' => $total
        ];
    }

    public function getStoriesByAuthor(int $authorId, int $limit = 10): array
    {
        $sql = "SELECT id, title, slug, cover_url, total_chapters, views, rating_avg, updated_at 
                FROM stories 
                WHERE author_id = :author_id 
                ORDER BY updated_at DESC 
                LIMIT :limit";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':author_id', $authorId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => \App\DTOs\StoryDto::fromArray($row), $rows);
    }
}
