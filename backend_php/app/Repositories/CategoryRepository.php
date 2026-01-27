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
    public function getAll(): array
    {
        $sql = "SELECT id, name, slug FROM categories ORDER BY name ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
