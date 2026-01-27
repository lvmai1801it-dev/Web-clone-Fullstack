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
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
